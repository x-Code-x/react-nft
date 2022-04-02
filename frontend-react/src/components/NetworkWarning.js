import { NETWORK } from "../constants";
const NetworkWarning = () => {
  return (
    <div className="notification is-danger has-text-centered mb-0">
      WARNING: You are connected to a network that <strong>is not</strong> {NETWORK}. Change your network in MetaMask to
      avoid your money going into the Forever Box!
    </div>
  );
};

export default NetworkWarning;
