const NoBoxesNotification = ({ setShowGallery }) => {
  return (
    <div className="notification is-danger is-light container mt-5">
      <button className="delete" onClick={() => setShowGallery(false)}></button>
      <span>This account does not own any Mystery Boxes :(</span>
    </div>
  );
};

export default NoBoxesNotification;
