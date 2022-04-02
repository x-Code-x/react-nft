import UserGallery from "./UserGallery";
import MetaMaskButton from "./MetaMaskButton";
import NoNFTNotification from "./NoNFTNotification";
import ErrorMessage from "./ErrorMessage";
import MetamaskWarning from "./MetamaskWarning";
import { PROJECT_NAME, NFT_NAME } from "../constants";

const Gallery = (props) => {
  const {
    noMetaMaskDetectedError,
    isConnecting,
    isConnected,
    errorMessageConnect,
    setErrorMessageConnect,
    gettingUserDerpies,
    getUserDerpiesHandler,
    connectWalletHandler,
    userDerpieDetails,
    showGallery,
    setShowGallery,
    errorMessageFetch,
    errorMessageGallery,
    setErrorMessageGallery,
  } = props;
  return (
    <div className="background">
      <section className="section has-text-centered">
        <h1 className="inter pb-5">YOUR {NFT_NAME} GALLERY</h1>
        <h2 className="subtitle custom-mobile-subtitle">All your {NFT_NAME}s in one place!</h2>

        {noMetaMaskDetectedError && <MetamaskWarning />}

        {!isConnected && !noMetaMaskDetectedError && (
          <MetaMaskButton isConnecting={isConnecting} connectWalletHandler={connectWalletHandler} />
        )}

        {errorMessageConnect && (
          <ErrorMessage errorMessage={errorMessageConnect} setErrorMessage={setErrorMessageConnect} />
        )}

        {isConnected && (
          <button className={`button mb-4 ${gettingUserDerpies ? "is-loading" : ""}`} onClick={getUserDerpiesHandler}>
            {userDerpieDetails.length === 0 ? "See Your {NFT_NAME}s" : "Refresh Your {NFT_NAME}s"}
          </button>
        )}
        {showGallery && <UserGallery userDerpieDetails={userDerpieDetails} />}
        {showGallery && userDerpieDetails.length === 0 && <NoNFTNotification setShowGallery={setShowGallery} />}
        {errorMessageGallery !== null && (
          <ErrorMessage errorMessage={errorMessageGallery} setErrorMessage={setErrorMessageGallery} />
        )}
        {errorMessageFetch && <p>Error fetching images from IPFS: error status {errorMessageFetch}</p>}
      </section>
    </div>
  );
};

export default Gallery;
