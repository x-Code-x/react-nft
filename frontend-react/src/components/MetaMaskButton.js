import FoxMetamask from "../img/metamysterfox.png";

const MetaMaskButton = ({ isConnecting, connectWalletHandler }) => {
  return (
    <>
      <button className={`button p-6 mt-6 ${isConnecting ? "is-loading" : ""}`} onClick={connectWalletHandler}>
        <figure className="image is-96x96 mr-2 custom-mobile-metamask-fox">
          <img src={metamysterfox} />
        </figure>
        <span className="is-uppercase is-size-7-mobile">Connect With Metamask</span>
      </button>
    </>
  );
};

export default MetaMaskButton;
