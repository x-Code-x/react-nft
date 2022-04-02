import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import UserDerpy from "./UserDerpy";
import MetamaskWarning from "./MetamaskWarning";
import MintProgressNotification from "./MintProgressNotification";
import ErrorMessage from "./ErrorMessage";
import MetaMaskOpen from "./MetaMaskOpen";
import MetaMaskButton from "./MetaMaskButton";
import { PROJECT_NAME, NETWORK, NETWORK_ID, NFT_NAME } from "../constants";
import Logo from "../img/nft-img/Logo.png";

const Mint = (props) => {
  const {
    noMetaMaskDetectedError,
    connectWalletHandler,
    isConnecting,
    isConnected,
    errorMessageConnect,
    setErrorMessageConnect,
    mintNFTHandler,
    metamaskWaitingOnUser,
    mintingInProgress,
    mintWaitTimer,
    setSelectedTab,
    transactionHash,
    isNewlyMinted,
    mintedNFTDetails,
    errorMessageMint,
    setErrorMessageMint,
  } = props;

  return (
    <div className="background">
      <section className="section has-text-centered">
        <h1 className="inter pb-5">MINT</h1>
        <h2 className="subtitle custom-mobile-subtitle">
          Mint a {NFT_NAME} here! Each {NFT_NAME} costs 0.01 <strong>test</strong> BNB + gas on <strong>{NETWORK}</strong>.
        </h2>
        <p className="custom-smaller-mobile-text">
          Make sure your wallet is connected to the {NETWORK} (Network ID: {NETWORK_ID}) and is funded with {NETWORK} 
           tokens.
        </p>
        <p className="custom-smaller-mobile-text">
          You can get test tokens from a faucet. Try this one:{" "}
          <a href="https://testnet.binance.org/faucet-smart" target="_blank">
            https://testnet.binance.org/faucet-smart
          </a>
        </p>
      </section>
      <section className="section has-text-centered">
        <div class="tile is-ancestor">
          <div class="tile is-6 is-parent">
            <div class="tile is-child box">
              <p class="title">BNB Mystery Box</p>
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
                  onClick={mintNFTHandler}
               >
                 Mint a {NFT_NAME}
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
                     <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3 " icon={faStar} /> a new {NFT_NAME} is born!{" "}
                      <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3" icon={faStar} />
                   </p>
                   <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center mt-4">
                     {isNewlyMinted && <UserDerpy nftDetails={mintedNFTDetails} />}
                   </div>
                   <p className="is-size-7 pt-3">Transaction Hash:</p>
                   <p className="is-size-7">{transactionHash}</p>
                 </>
                )}
             </div>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child box">
              <p class="title">$MYST Mystery Box</p>
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
                  onClick={mintNFTHandler}
                >
                  Mint a {NFT_NAME}
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
                      <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3 " icon={faStar} /> a new {NFT_NAME} is born!{" "}
                      <FontAwesomeIcon className="fas fa-2x fa-solid is-size-3" icon={faStar} />
                    </p>
                    <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center mt-4">
                      {isNewlyMinted && <UserDerpy nftDetails={mintedNFTDetails} />}
                    </div>
                   <p className="is-size-7 pt-3">Transaction Hash:</p>
                    <p className="is-size-7">{transactionHash}</p>
                  </>
               )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mint;
