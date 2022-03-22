const RinkebyWarning = () => {
  return (
    <div className="notification is-danger has-text-centered mb-0">
      WARNING: You are connected to a network that <strong>is not</strong> BSC Testnet. Change your network in MetaMask to
      avoid doing your hard earned BNB going into the Forever Box!
    </div>
  );
};

export default RinkebyWarning;
