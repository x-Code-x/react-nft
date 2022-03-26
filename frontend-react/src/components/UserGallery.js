import UserDerpy from "./UserMysteryBox";

const UserGallery = ({ userMysteryBoxDetails }) => {
  return (
    <>
      <div className="is-flex is-justify-content-center is-flex-wrap-wrap custom-gallery-gap">
        {userMysteryBoxDetails.map((mysteryBox, index) => (
          <UserMysteryBox key={index} mysteryBoxDetails={derpie} />
        ))}
      </div>
    </>
  );
};

export default UserGallery;
