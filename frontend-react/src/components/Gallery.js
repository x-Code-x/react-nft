import UserGallery from "./UserGallery";
import MetaMaskButton from "./MetaMaskButton";
import NoDerpiesNotification from "./NoDerpiesNotification";
import ErrorMessage from "./ErrorMessage";
import MetamaskWarning from "./MetamaskWarning";

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
        <h1 className="shizuru pb-5">YOUR DERPIES GALLERY</h1>
        <h2 className="subtitle">All your derpies in one place!</h2>

        {noMetaMaskDetectedError && <MetamaskWarning />}

        {!isConnected && !noMetaMaskDetectedError && (
          <MetaMaskButton isConnecting={isConnecting} connectWalletHandler={connectWalletHandler} />
        )}

        {errorMessageConnect && (
          <ErrorMessage errorMessage={errorMessageConnect} setErrorMessage={setErrorMessageConnect} />
        )}

        {isConnected && (
          <button className={`button mb-4 ${gettingUserDerpies ? "is-loading" : ""}`} onClick={getUserDerpiesHandler}>
            {userDerpieDetails.length === 0 ? "See Your Derpies" : "Refresh Your Derpies"}
          </button>
        )}
        {showGallery && <UserGallery userDerpieDetails={userDerpieDetails} />}
        {showGallery && userDerpieDetails.length === 0 && <NoDerpiesNotification setShowGallery={setShowGallery} />}
        {errorMessageGallery !== null && (
          <ErrorMessage errorMessage={errorMessageGallery} setErrorMessage={setErrorMessageGallery} />
        )}
        {errorMessageFetch && <p>Error fetching images from IPFS: error status {errorMessageFetch}</p>}
      </section>
    </div>
  );
};

export default Gallery;
