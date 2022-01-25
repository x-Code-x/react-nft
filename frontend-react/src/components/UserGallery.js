import UserDerpy from "./UserDerpy";

const UserGallery = ({ userDerpieDetails }) => {
  return (
    <>
      <div className="is-flex is-justify-content-center is-flex-wrap-wrap custom-gallery-gap">
        {userDerpieDetails.map((derpie, index) => (
          <UserDerpy key={index} derpieDetails={derpie} />
        ))}
      </div>
    </>
  );
};

export default UserGallery;
