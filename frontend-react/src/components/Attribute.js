const Attribute = ({ boxDetails, traitNum }) => {
  return (
    <div className="custom-attribute">
      <span className="custom-attribute__trait">{boxDetails.uriJSON.attributes[traitNum].trait_type}</span>
      <span className="custom-attribute__value">{boxDetails.uriJSON.attributes[traitNum].value}</span>
    </div>
  );
};

export default Attribute;
