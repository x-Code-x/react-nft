import FoxMetamask from "../img/FoxFace.png";

const MetaMaskButton = ({ isConnecting, connectWalletHandler }) => {
  return (
    <>
      <button className={`button p-6 mt-6 ${isConnecting ? "is-loading" : ""}`} onClick={connectWalletHandler}>
        <figure className="image is-96x96 mr-2">
          <img src={FoxMetamask} />
        </figure>
        <span className="is-uppercase">Connect With Metamask</span>
      </button>
    </>
  );
};

export default MetaMaskButton;
