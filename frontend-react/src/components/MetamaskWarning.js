const MetamaskWarning = () => {
  return (
    <div className="notification is-danger container mt-5">
      You must have the{" "}
      <a href="https://metamask.io/" target="_blank">
        MetaMask extension
      </a>{" "}
      installed to interact with Whoopsie Derpies.
    </div>
  );
};

export default MetamaskWarning;
