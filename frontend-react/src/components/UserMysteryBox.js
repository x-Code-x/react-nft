import Logo from "../img/Logo.png";
import Attribute from "./Attribute";

const UserDerpy = ({ derpieDetails }) => {
  const imgURI = `https://ipfs.io/ipfs/${derpieDetails.uriJSON.image.split("").splice(7).join("")}`;
  const style = { backgroundColor: `#${derpieDetails.uriJSON.background_color}` };
  return (
    <>
      <div className="card custom-card">
        <div className="card-image">
          <figure style={style} className="image is-4by4">
            <img src={imgURI} alt="Derpie Image" />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={Logo} alt="Whoosie Derpies Logo" />
              </figure>
            </div>
            <div className="media-left has-text-left">
              <p className="title is-4 mb-0 is-capitalized">{derpieDetails.uriJSON.name}</p>
              <p className="">{`Token ID: ${derpieDetails.tokenId}`}</p>
            </div>
          </div>

          <div className="content field is-grouped is-flex">
            <Attribute derpieDetails={derpieDetails} traitNum={0} />
            <Attribute derpieDetails={derpieDetails} traitNum={1} />
            <Attribute derpieDetails={derpieDetails} traitNum={2} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDerpy;
