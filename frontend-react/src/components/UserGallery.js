import UserDerpy from "./UserBoxes";

const UserGallery = ({ userBoxesDetails }) => {
  return (
    <>
      <div className="is-flex is-justify-content-center is-flex-wrap-wrap custom-gallery-gap">
        {userBoxesDetails.map((box, index) => (
          <UserBoxes key={index} boxDetails={derpie} />
        ))}
      </div>
    </>
  );
};

export default UserGallery;
