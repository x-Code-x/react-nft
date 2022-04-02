import Logo from "../img/Logo.png";
import Attribute from "./Attribute";
import { PROJECT_NAME, NETWORK, NFT_NAME } from "../constants";

const UserDerpy = ({ nftDetails }) => {
  const imgURI = `https://ipfs.io/ipfs/${nftDetails.uriJSON.image.split("").splice(7).join("")}`;
  const style = { backgroundColor: `#${nftDetails.uriJSON.background_color}` };
  return (
    <>
      <div className="card custom-card">
        <div className="card-image">
          <figure style={style} className="image is-4by4">
            <img src={imgURI} alt="{NFT_NAME} Image" />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={Logo} alt="{PROJECT_NAME} Logo" />
              </figure>
            </div>
            <div className="media-left has-text-left">
              <p className="title is-4 mb-0 is-capitalized">{nftDetails.uriJSON.name}</p>
              <p className="">{`Token ID: ${nftDetails.tokenId}`}</p>
            </div>
          </div>

          <div className="content field is-grouped is-flex">
            <Attribute nftDetails={nftDetails} traitNum={0} />
            <Attribute nftDetails={nftDetails} traitNum={1} />
            <Attribute nftDetails={nftDetails} traitNum={2} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDerpy;
