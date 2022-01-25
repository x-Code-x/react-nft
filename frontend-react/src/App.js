import "bulma/css/bulma.css";
import "./App.css";

import { ethers } from "ethers";
import { useState, useEffect, useRef } from "react";

import Navbar from "./components/Navbar";
import About from "./components/About";
import Mint from "./components/Mint";
import Gallery from "./components/Gallery";
import AccountChangedWarning from "./components/AccountChangedWarning"; // DELETE?
import RinkebyWarning from "./components/RinkebyWarning";

// import Derpies from "./contracts/localhost/Derpies.json";
import Derpies from "./contracts/rinkeby/Derpies.json";
import VRFCoordinatorMock from "./contracts/localhost/VRFCoordinatorMock.json";
import ChainChangedWarning from "./components/ChainChangedWarning";

function App() {
  const DERPIES_ADDRESS = process.env.REACT_APP_DERPIES_ADDRESS_RINKEBY;
  // const DERPIES_ADDRESS = process.env.REACT_APP_DERPIES_ADDRESS_LOCALHOST;
  const VRFCOORDINATORMOCK_ADDRESS_LOCALHOST = process.env.REACT_APP_VRFCOORDINATORMOCK_ADDRESS_LOCALHOST;

  const MINUTES_TO_MILLISECONDS = 60 * 1000;
  const chainlinkWaitTimeMinutes = 5 * MINUTES_TO_MILLISECONDS;

  const [selectedTab, setSelectedTab] = useState("About");

  // account state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState("not connected");
  const [connectedNetwork, setConnectedNetwork] = useState("none");
  const [rinkebyWarning, setRinkebyWarning] = useState(false);
  const [chainChanged, setChainChanged] = useState(false);
  const [accountChanged, setAccountChanged] = useState(false);

  // minting state
  const isMountedMint = useRef(false); // object
  const [metamaskWaitingOnUser, setMetamaskWaitingOnUser] = useState(false);
  const [mintingInProgress, setMintingInProgress] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [mintWaitTimer, setMintWaitTimer] = useState(null);
  const [isNewlyMinted, setIsNewlyMinted] = useState(false);
  const [newlyMintedDerpie, setNewlyMintedDerpy] = useState(null);
  const [mintedDerpieDetails, setMintedDerpieDetails] = useState(null);

  // gallery state
  const [showGallery, setShowGallery] = useState(false);
  const [gettingUserDerpies, setGettingUserDerpies] = useState(false);
  const [userDerpieDetails, setUserDerpieDetails] = useState([]);

  // error state
  const [errorMessageConnect, setErrorMessageConnect] = useState(null);
  const [errorMessageMint, setErrorMessageMint] = useState(null);
  const [errorMessageGallery, setErrorMessageGallery] = useState(null);
  const [noMetaMaskDetectedError, setNoMetaMaskDetectedError] = useState(false);

  useEffect(() => {
    if (!window.ethereum) {
      console.log("no metamask detected");
      setNoMetaMaskDetectedError(true);
    }
  }, []);

  useEffect(() => {
    // guard clause to prevent site from reloading when user is changing metamask settings when not connected.
    if (connectedAccount === "not connected") return;
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        setChainChanged(true);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      });
      window.ethereum.on("accountsChanged", () => {
        setAccountChanged(true);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      });
    }
  });

  function clearErrorMessages() {
    setErrorMessageConnect(null);
    setErrorMessageMint(null);
    setErrorMessageGallery(null);
  }

  async function connectWalletHandler() {
    clearErrorMessages();
    setIsConnecting(true);

    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
        const network = window.ethereum.networkVersion;
        console.log(`metamask connected with account: ${account} to network ID: ${network}`);
        setConnectedAccount(`${account.slice(0, 4)}...${account.slice(-4)}`);
        setConnectedNetwork(network);
        setIsConnected(true);
        if (network !== "4") {
          setRinkebyWarning(true);
        } else {
          setRinkebyWarning(false);
        }
      } catch (error) {
        console.log(`${error.code} ${error.message}`);
        setErrorMessageConnect(error);
      }
      setIsConnecting(false);
    }
  }

  async function getUserDerpiesHandler() {
    clearErrorMessages();
    setGettingUserDerpies(true);

    try {
      if (typeof window.ethereum !== "undefined") {
        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(DERPIES_ADDRESS, Derpies.abi, provider);
        const numDerpies = await contract.balanceOf(account);

        // to use in below for await
        let derpieIterable = [];
        for (let i = 0; i < parseInt(numDerpies.toString()); i++) {
          derpieIterable.push(i);
        }

        let tokenIdArray = [];
        for await (const derpie of derpieIterable) {
          const tokenId = await contract.tokenOfOwnerByIndex(account, derpie);
          tokenIdArray.push(parseInt(tokenId.toString()));
        }

        let tempDerpieDetails = [];
        for await (const tokenId of tokenIdArray) {
          const tokenUri = await contract.tokenURI(parseInt(tokenId.toString()));
          const tokenUriHttps = `https://ipfs.io/ipfs/${tokenUri.split("").splice(7).join("")}`;
          const uriData = await fetch(tokenUriHttps);
          const uriJSON = await uriData.json();
          tempDerpieDetails.push({ tokenId, uriJSON });
        }

        setUserDerpieDetails([...tempDerpieDetails]);
        setShowGallery(true);
        setGettingUserDerpies(false);
      }
    } catch (error) {
      console.log(error);
      setErrorMessageGallery(error);
      setGettingUserDerpies(false);
    }
  }

  async function mintDerpieHandler() {
    clearErrorMessages();
    setIsNewlyMinted(false);

    try {
      if (typeof window.ethereum !== "undefined") {
        await mintDerpie();
        setMintingInProgress(false);
      }
    } catch (error) {
      console.log(error);
      setMintingInProgress(false);
      setErrorMessageMint(error);
    }
    // reset to false for the case where user rejects metamask transaction
    setMetamaskWaitingOnUser(false);
    setMintingInProgress(false);
  }

  async function mintDerpie() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const derpiesContract = new ethers.Contract(DERPIES_ADDRESS, Derpies.abi, signer);

    setMetamaskWaitingOnUser(true);

    const mintTx = await derpiesContract.mintDerpie({
      value: ethers.utils.parseEther("0.01"),
    });

    const startTimer = Date.now();
    setMintWaitTimer(startTimer + chainlinkWaitTimeMinutes);

    setTransactionHash(mintTx.hash);

    setMetamaskWaitingOnUser(false);
    setMintingInProgress(true);

    const mintTxReceipt = await mintTx.wait();
    const requestId = mintTxReceipt.logs[3].topics[1];
    const tokenId = mintTxReceipt.events[3].topics[2];

    // VRFCOORDINATORMOCK for localhost tests only
    if (window.ethereum.networkVersion === "1337") {
      await vrfCoordinatorMockTx(signer, derpiesContract, requestId);
    }

    // Wait for chainlink vrf before requesting metadata
    console.log("waiting for chainlink vrf");
    await waitForChainlinkVRF(chainlinkWaitTimeMinutes - (Date.now() - startTimer));

    setNewlyMintedDerpy(tokenId);
  }

  async function waitForChainlinkVRF(waitTimeMilliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, waitTimeMilliseconds);
    });
  }

  async function vrfCoordinatorMockTx(signer, derpiesContract, requestId) {
    const vrfCoordinatorContract = new ethers.Contract(
      VRFCOORDINATORMOCK_ADDRESS_LOCALHOST,
      VRFCoordinatorMock.abi,
      signer
    );
    const randNumTx = await vrfCoordinatorContract.callBackWithRandomness(requestId, 22, derpiesContract.address);
    await randNumTx.wait();
  }

  useEffect(async () => {
    // isMountedMint guards against running this useEffect on page load.
    if (isMountedMint.current) {
      if (newlyMintedDerpie === null) return;

      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(DERPIES_ADDRESS, Derpies.abi, provider);

        const tokenId = parseInt(newlyMintedDerpie.toString());
        const tokenUri = await contract.tokenURI(newlyMintedDerpie);
        const tokenUriHttps = `https://ipfs.io/ipfs/${tokenUri.split("").splice(7).join("")}`;
        const uriData = await fetch(tokenUriHttps);
        const uriJSON = await uriData.json();
        setMintedDerpieDetails({ tokenId, uriJSON });
        setIsNewlyMinted(true);
      }
    } else {
      isMountedMint.current = true;
    }
  }, [newlyMintedDerpie]);

  useEffect(() => {
    clearErrorMessages();
  }, [selectedTab]);

  return (
    <>
      <Navbar setSelectedTab={setSelectedTab} connectedNetwork={connectedNetwork} connectedAccount={connectedAccount} />

      {rinkebyWarning && <RinkebyWarning />}
      {chainChanged && <ChainChangedWarning />}
      {accountChanged && <AccountChangedWarning />}

      {selectedTab === "About" && <About setSelectedTab={setSelectedTab} />}
      {selectedTab === "Mint" && (
        <Mint
          noMetaMaskDetectedError={noMetaMaskDetectedError}
          connectWalletHandler={connectWalletHandler}
          isConnecting={isConnecting}
          isConnected={isConnected}
          errorMessageConnect={errorMessageConnect}
          setErrorMessageConnect={setErrorMessageConnect}
          mintDerpieHandler={mintDerpieHandler}
          errorMessageMint={errorMessageMint}
          setErrorMessageMint={setErrorMessageMint}
          metamaskWaitingOnUser={metamaskWaitingOnUser}
          mintingInProgress={mintingInProgress}
          mintWaitTimer={mintWaitTimer}
          setSelectedTab={setSelectedTab}
          transactionHash={transactionHash}
          isNewlyMinted={isNewlyMinted}
          mintedDerpieDetails={mintedDerpieDetails}
        />
      )}
      {selectedTab === "Gallery" && (
        <Gallery
          noMetaMaskDetectedError={noMetaMaskDetectedError}
          connectWalletHandler={connectWalletHandler}
          isConnecting={isConnecting}
          isConnected={isConnected}
          errorMessageConnect={errorMessageConnect}
          setErrorMessageConnect={setErrorMessageConnect}
          getUserDerpiesHandler={getUserDerpiesHandler}
          gettingUserDerpies={gettingUserDerpies}
          userDerpieDetails={userDerpieDetails}
          errorMessageGallery={errorMessageGallery}
          setErrorMessageGallery={setErrorMessageMint}
          showGallery={showGallery}
          setShowGallery={setShowGallery}
        />
      )}
    </>
  );
}

export default App;
