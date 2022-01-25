import { useState } from "react";
import Logo from "../img/Logo.png";

const Navbar = (props) => {
  const { setSelectedTab, connectedAccount, connectedNetwork } = props;

  const [isActive, setIsActive] = useState(false);

  function logoClickHandler() {
    setSelectedTab("About");
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome, Firefox, IE, Opera
  }

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <figure className="image is-64x64 pl-3 is-flex is-align-items-center">
            <img className="" src={Logo} />
          </figure>
          <a className="navbar-item shizuru is-size-3" onClick={logoClickHandler}>
            <span className="">WhoopsieDerpies</span>
          </a>

          <button
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target=""
            onClick={() => setIsActive(!isActive)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div id="" className={`navbar-menu ${isActive ? "is-active" : ""}`}>
          <div className="navbar-end">
            <a className="navbar-item" onClick={() => setSelectedTab("About")}>
              About
            </a>
            <a className="navbar-item" onClick={() => setSelectedTab("Mint")}>
              Mint
            </a>
            <a className="navbar-item" onClick={() => setSelectedTab("Gallery")}>
              Your Derpies
            </a>
          </div>
          <div className="navbar-item">
            <div className="custom-connect-status">
              <span className="custom-connect-status__network">Network ID: {connectedNetwork}</span>
              <span className="custom-connect-status__account">Account: {connectedAccount}</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
