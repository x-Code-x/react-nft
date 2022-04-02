import UserGallery from "./UserGallery";
import MetaMaskButton from "./MetaMaskButton";
import NoBoxesNotification from "./NoBoxesNotification";
import ErrorMessage from "./ErrorMessage";
import MetamaskWarning from "./MetamaskWarning";

const Gallery = (props) => {
  const {
    noMetaMaskDetectedError,
    isConnecting,
    isConnected,
    errorMessageConnect,
    setErrorMessageConnect,
    gettingUserBoxes,
    getUserBoxHandler,
    connectWalletHandler,
    userBoxDetails,
    showGallery,
    setShowGallery,
    errorMessageFetch,
    errorMessageGallery,
    setErrorMessageGallery,
  } = props;
  return (
    <div className="background">
      <section className="section has-text-centered">
        <h1 className="inter pb-5">YOUR MYSTERY BOXES</h1>
        <h2 className="subtitle custom-mobile-subtitle">All your Mystery Boxes in one place!</h2>

        {noMetaMaskDetectedError && <MetamaskWarning />}

        {!isConnected && !noMetaMaskDetectedError && (
          <MetaMaskButton isConnecting={isConnecting} connectWalletHandler={connectWalletHandler} />
        )}

        {errorMessageConnect && (
          <ErrorMessage errorMessage={errorMessageConnect} setErrorMessage={setErrorMessageConnect} />
        )}

        {isConnected && (
          <button className={`button mb-4 ${gettingUserBoxes ? "is-loading" : ""}`} onClick={getUserBoxHandler}>
            {userBoxesDetails.length === 0 ? "See Your Mystery Boxes" : "Refresh Your Mystery Boxes"}
          </button>
        )}
        {showGallery && <UserGallery userBoxDetails={userBoxDetails} />}
        {showGallery && userBoxDetails.length === 0 && <NoBoxesNotification setShowGallery={setShowGallery} />}
        {errorMessageGallery !== null && (
          <ErrorMessage errorMessage={errorMessageGallery} setErrorMessage={setErrorMessageGallery} />
        )}
        {errorMessageFetch && <p>Error fetching images from IPFS: error status {errorMessageFetch}</p>}
      </section>
    </div>
  );
};

export default Gallery;
