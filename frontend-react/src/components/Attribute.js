const Attribute = ({ trait, traitNum }) => {
  return (
    <div className="custom-attribute">
      <span className="custom-attribute__trait">{trait.uriJSON.attributes[traitNum].trait_type}</span>
      <span className="custom-attribute__value">{trait.uriJSON.attributes[traitNum].value}</span>
    </div>
  );
};

export default Attribute;
