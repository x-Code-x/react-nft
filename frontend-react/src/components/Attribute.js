const Attribute = ({ nftDetails, traitNum }) => {
  return (
    <div className="custom-attribute">
      <span className="custom-attribute__trait">{nftDetails.uriJSON.attributes[traitNum].trait_type}</span>
      <span className="custom-attribute__value">{nftDetails.uriJSON.attributes[traitNum].value}</span>
    </div>
  );
};

export default Attribute;
