import Logo from "../img/Logo.png";
import Attribute from "./Attribute";

const UserBoxes = ({ boxDetails }) => {
  const imgURI = `https://ipfs.io/ipfs/${boxDetails.uriJSON.image.split("").splice(7).join("")}`;
  const style = { backgroundColor: `#${boxDetails.uriJSON.background_color}` };
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
              <p className="title is-4 mb-0 is-capitalized">{boxDetails.uriJSON.name}</p>
              <p className="">{`Token ID: ${boxDetails.tokenId}`}</p>
            </div>
          </div>

          <div className="content field is-grouped is-flex">
            <Attribute boxDetails={boxDetails} traitNum={0} />
            <Attribute boxDetails={boxDetails} traitNum={1} />
            <Attribute boxDetails={boxDetails} traitNum={2} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBoxes;
