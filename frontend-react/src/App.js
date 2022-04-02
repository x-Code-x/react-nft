import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";

import "bulma/css/bulma.css";
import "./App.css";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Mint from "./components/Mint";
import Gallery from "./components/Gallery";
import AccountChangedWarning from "./components/AccountChangedWarning";
import NetworkWarning from "./components/NetworkWarning";
import { PROJECT_NAME, NFT_ADDRESS, DERPIES_ADDRESS, VRFCOORDINATORMOCK_ADDRESS_LOCALHOST, CHAINLINK_WAIT_TIME_MINUTES } from "./constants";

// import Derpies from "./contracts/localhost/Derpies.json"; // development
import Derpies from "./contracts/rinkeby/Derpies.json"; // deployment
import VRFCoordinatorMock from "./contracts/localhost/VRFCoordinatorMock.json";
import ChainChangedWarning from "./components/ChainChangedWarning";

function App() {
  const [selectedTab, setSelectedTab] = useState("About");

  // account state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState("not connected");
  const [connectedNetwork, setConnectedNetwork] = useState("none");
  const [networkWarning, setNetworkWarning] = useState(false);
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
  const [errorMessageFetch, setErrorMessageFetch] = useState(null);
  const [noMetaMaskDetectedError, setNoMetaMaskDetectedError] = useState(false);

  async function connectWalletHandler() {
    clearErrorMessages();
    setIsConnecting(true);

    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
        const network = window.ethereum.networkVersion;
        // console.log(`metamask connected with account: ${account} to network ID: ${network}`);
        setConnectedAccount(`${account.slice(0, 4)}...${account.slice(-4)}`);
        setConnectedNetwork(network);
        setIsConnected(true);
        if (network !== "97") { // Hardcoded - have to fix this
          setNetworkWarning(true);
        } else {
          setNetworkWarning(false);
        }
      } catch (error) {
        // console.log(`${error.code} ${error.message}`);
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

        // TODO - merge the below two for...of loops together.
        let tokenIdArray = [];
        for await (const derpie of derpieIterable) {
          const tokenId = await contract.tokenOfOwnerByIndex(account, derpie);
          tokenIdArray.push(parseInt(tokenId.toString()));
        }

        let tempDerpieDetails = [];
        for await (const tokenId of tokenIdArray) {
          const tokenUri = await contract.tokenURI(parseInt(tokenId.toString()));
          const tokenUriHttps = `https://ipfs.io/ipfs/${tokenUri.split("").splice(7).join("")}`;
          const uriJSON = await fetchMetadata(tokenUriHttps);
          tempDerpieDetails.push({ tokenId, uriJSON });
        }

        setUserDerpieDetails([...tempDerpieDetails]);
        setShowGallery(true);
        setGettingUserDerpies(false);
      }
    } catch (error) {
      // console.log(error);
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
      // console.log(error);
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
    setMintWaitTimer(startTimer + CHAINLINK_WAIT_TIME_MINUTES);

    setTransactionHash(mintTx.hash);

    setMetamaskWaitingOnUser(false);
    setMintingInProgress(true);

    const mintTxReceipt = await mintTx.wait();
    // console.log(mintTxReceipt);
    const requestId = mintTxReceipt.logs[3].topics[1];
    const tokenId = mintTxReceipt.events[3].topics[2];

    // VRFCOORDINATORMOCK for localhost tests only
    if (window.ethereum.networkVersion === "1337") {
      await vrfCoordinatorMockTx(signer, derpiesContract, requestId);
    }

    // Wait for chainlink vrf before requesting metadata
    // console.log("waiting for chainlink vrf");
    await waitForChainlinkVRF(CHAINLINK_WAIT_TIME_MINUTES - (Date.now() - startTimer));

    setNewlyMintedDerpy(tokenId);
  }

  // TODO - listen for emitted event instead
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

  function clearErrorMessages() {
    setErrorMessageConnect(null);
    setErrorMessageMint(null);
    setErrorMessageGallery(null);
  }

  async function fetchMetadata(tokenUri) {
    try {
      const response = await fetch(tokenUri);

      if (response.ok) {
        return response.json();
      } else {
        setErrorMessageFetch(response.status);
        return Promise.reject(response);
      }
    } catch (error) {
      setErrorMessageFetch(error);
    }
  }

  useEffect(() => {
    if (!window.ethereum) {
      // console.log("no metamask detected");
      setNoMetaMaskDetectedError(true);
    }
  }, []);

  // listen for EIP-1193 events
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

  useEffect(async () => {
    // isMountedMint guards against running this useEffect on page load.
    if (isMountedMint.current) {
      if (newlyMintedDerpie === null) return;

      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(DERPIES_ADDRESS, Derpies.abi, provider);

        const tokenId = parseInt(newlyMintedDerpie.toString());
        const tokenUri = await contract.tokenURI(newlyMintedDerpie);
        // TODO - update here
        const tokenUriHttps = `https://ipfs.io/ipfs/${tokenUri.split("").splice(7).join("")}`;
        const uriJSON = await fetchMetadata(tokenUriHttps);
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

      {networkWarning && <NetworkWarning />}
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
          errorMessageFetch={errorMessageFetch}
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
