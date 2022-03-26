const Attribute = ({ mysteryBoxDetails, traitNum }) => {
  return (
    <div className="custom-attribute">
      <span className="custom-attribute__trait">{mysteryBoxDetails.uriJSON.attributes[traitNum].trait_type}</span>
      <span className="custom-attribute__value">{mysteryBoxDetails.uriJSON.attributes[traitNum].value}</span>
    </div>
  );
};

export default Attribute;
