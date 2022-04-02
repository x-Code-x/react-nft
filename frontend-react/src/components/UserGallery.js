import UserNFT from "./UserNFT";

const UserGallery = ({ userNFTDetails }) => {
  return (
    <>
      <div className="is-flex is-justify-content-center is-flex-wrap-wrap custom-gallery-gap">
        {userNFTDetails.map((nft, index) => (
          <UserNFT key={index} nftDetails={nft} />
        ))}
      </div>
    </>
  );
};

export default UserGallery;
