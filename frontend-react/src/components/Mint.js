import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import UserBoxes from "./UserBoxes";
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
    mintBoxHandler,
    metamaskWaitingOnUser,
    mintingInProgress,
    mintWaitTimer,
    setSelectedTab,
    transactionHash,
    isNewlyMinted,
    mintedBoxDetails,
    errorMessageMint,
    setErrorMessageMint,
  } = props;

  return (
    <div className="background">
      <section className="section has-text-centered">
        <h1 className="inter pb-5">REVEAL A MYSTERY BOX</h1>
        <h2 className="subtitle custom-mobile-subtitle">
          Reveal a Mystery Box here! Each Mystery Box costs 0.01 <strong>test</strong> BNB + gas on <strong>BSC Testnet</strong>.
        </h2>
        <p className="custom-smaller-mobile-text">
          Make sure your wallet is connected to the BSC Testnet (network id: 97) and is funded with Test BNB.
        </p>
        <p className="custom-smaller-mobile-text">
          You can get test BNB from a faucet. Try this one:{" "}
          <a href="https://testnet.binance.org/faucet-smart" target="_blank">
            https://testnet.binance.org/faucet-smart
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
            onClick={mintBoxHandler}
          >
                Reveal a Mystery Box
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
                <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3 " icon={faStar} /> A new Mystery Box is revealed!{" "}

                <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3" icon={faStar} />
              </p>
              <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center mt-4">
                {isNewlyMinted && <UserBoxes boxDetails={mintedBoxDetails} />}
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
