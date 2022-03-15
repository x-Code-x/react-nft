import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import UserDerpy from "./UserDerpy";
import MetamaskWarning from "./MetamaskWarning";
import MintProgressNotification from "./MintProgressNotification";
import ErrorMessage from "./ErrorMessage";
import MetaMaskOpen from "./MetaMaskOpen";
import MetaMaskButton from "./MetaMaskButton";

const Mint = (props) => {
  const {
    noMetaMaskDetectedError,
    connectWalletHandler,
    isConnecting,
    isConnected,
    errorMessageConnect,
    setErrorMessageConnect,
    mintDerpieHandler,
    metamaskWaitingOnUser,
    mintingInProgress,
    mintWaitTimer,
    setSelectedTab,
    transactionHash,
    isNewlyMinted,
    mintedDerpieDetails,
    errorMessageMint,
    setErrorMessageMint,
  } = props;

  return (
    <div className="background">
      <section className="section has-text-centered">
        <h1 className="shizuru pb-5">MINT</h1>
        <h2 className="subtitle custom-mobile-subtitle">
          Mint a Derpie here! Each Derpie costs 0.01 <strong>test</strong> ETH + gas on <strong>Rinkeby</strong>.
        </h2>
        <p className="custom-smaller-mobile-text">
          Make sure your wallet is connected to the Rinkeby Ethereum Testnet (network id: 4) and is funded with Rinkeby
          test ether.
        </p>
        <p className="custom-smaller-mobile-text">
          You can get test ether from a faucet. Try this one:{" "}
          <a href="https://faucets.chain.link/rinkeby" target="_blank">
            https://faucets.chain.link/rinkeby
          </a>
        </p>

        {noMetaMaskDetectedError && <MetamaskWarning />}

        {!isConnected && !noMetaMaskDetectedError && (
          <MetaMaskButton isConnecting={isConnecting} connectWalletHandler={connectWalletHandler} />
        )}

        {errorMessageConnect && (
          <ErrorMessage errorMessage={errorMessageConnect} setErrorMessage={setErrorMessageConnect} />
        )}

        {isConnected && (
          <button
            className={`button mt-4 mb-4 ${metamaskWaitingOnUser ? "is-loading" : ""}`}
            disabled={mintingInProgress}
            onClick={mintDerpieHandler}
          >
            Mint a Whoospie Derpie
          </button>
        )}

        {metamaskWaitingOnUser && <MetaMaskOpen />}
        {mintingInProgress && (
          <MintProgressNotification
            mintWaitTimer={mintWaitTimer}
            setSelectedTab={setSelectedTab}
            transactionHash={transactionHash}
          />
        )}
        {errorMessageMint !== null && (
          <ErrorMessage errorMessage={errorMessageMint} setErrorMessage={setErrorMessageMint} />
        )}
        <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center mt-4">
          {isNewlyMinted && (
            <>
              <p className="is-size-4 is-uppercase">
                <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3 " icon={faStar} /> a new derpie is born!{" "}
                <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3" icon={faStar} />
              </p>
              <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center mt-4">
                {isNewlyMinted && <UserDerpy derpieDetails={mintedDerpieDetails} />}
              </div>
              <p className="is-size-7 pt-3">Transaction Hash:</p>
              <p className="is-size-7">{transactionHash}</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Mint;
