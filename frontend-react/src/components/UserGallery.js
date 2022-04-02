import UserBoxes from "./UserBoxes";

const UserGallery = ({ userBoxDetails }) => {
  return (
    <>
      <div className="is-flex is-justify-content-center is-flex-wrap-wrap custom-gallery-gap">
        {userBoxDetails.map((box, index) => (
          <UserBoxes key={index} boxDetails={box} />
        ))}
      </div>
    </>
  );
};

export default UserGallery;
