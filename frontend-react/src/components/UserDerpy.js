import Logo from "../img/Logo.png";
import Attribute from "./Attribute";

const UserMystryBoxes = ({ mysteryBoxDetails }) => {
  const imgURI = `https://ipfs.io/ipfs/${mysteryBoxDetails.uriJSON.image.split("").splice(7).join("")}`;
  const style = { backgroundColor: `#${mysteryBoxDetails.uriJSON.background_color}` };
  return (
    <>
      <div className="card custom-card">
        <div className="card-image">
          <figure style={style} className="image is-4by4">
            <img src={imgURI} alt="Mystery Box Image" />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={Logo} alt="Myster Box Logo" />
              </figure>
            </div>
            <div className="media-left has-text-left">
              <p className="title is-4 mb-0 is-capitalized">{mysteryBoxDetails.uriJSON.name}</p>
              <p className="">{`Token ID: ${mysteryBoxDetails.tokenId}`}</p>
            </div>
          </div>

          <div className="content field is-grouped is-flex">
            <Attribute mysteryBoxDetails={mysteryBoxDetailsDetails} traitNum={0} />
            <Attribute mysteryBoxDetails={mysteryBoxDetailsDetails} traitNum={1} />
            <Attribute mysteryBoxDetails={mysteryBoxDetailsDetails} traitNum={2} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDerpy;
