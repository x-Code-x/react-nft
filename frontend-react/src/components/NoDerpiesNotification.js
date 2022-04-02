import { NETWORK, NFT_NAME } from "../constants";
const NoNFTNotification = ({ setShowGallery }) => {
  return (
    <div className="notification is-danger is-light container mt-5">
      <button className="delete" onClick={() => setShowGallery(false)}></button>
      <span>This account does not own any {NFT_NAME}s :(</span>
    </div>
  );
};

export default NoNFTNotification;
