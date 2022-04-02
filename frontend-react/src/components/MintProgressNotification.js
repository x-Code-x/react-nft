import { PROJECT_NAME, NETWORK, NFT_NAME } from "../constants";
import Countdown from "react-countdown";

const MintProgressNotification = ({ mintWaitTimer, setSelectedTab, transactionHash }) => {
  function galleryClickHandler() {
    setSelectedTab("Gallery");
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome, Firefox, IE, Opera
  }

  return (
    <div className="notification is-primary is-light container mt-5">
      <p className="mb-3">
        Please wait while your transaction is processed by the {NETWORK} network. You can view your pending
        transaction on the appropriate blockchain explorer here:{" "}
        <a className="custom-word-wrap" href={`https://rinkeby.etherscan.io/tx/${transactionHash}`} target="_blank">
          https://rinkeby.etherscan.io/tx/{transactionHash}
        </a>
      </p>
      <p className="mb-3">
        It may take up to 5 minutes for the{" "}
        <a href="https://docs.chain.link/docs/chainlink-vrf/" target="_blank">
          Chainlink VRF
        </a>{" "}
        to respond to the {PROJECT_NAME} contract with a random number. Your new {NFT_NAME} will show here in:{" "}
        <Countdown date={mintWaitTimer} />
      </p>
      <p>
        Admire your other {NFT_NAME} in the <a onClick={galleryClickHandler}>Gallery</a> while you wait!
      </p>
    </div>
  );
};

export default MintProgressNotification;
