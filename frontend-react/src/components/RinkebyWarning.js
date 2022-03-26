const NetworkWarning = () => {
  return (
    <div className="notification is-danger has-text-centered mb-0">
      WARNING: You are connected to a network that <strong>is not</strong> Binance Smart Chain Testnet. Change your network in MetaMask to
      avoid your money going into the forever box!
    </div>
  );
};

export default NetworkWarning;
