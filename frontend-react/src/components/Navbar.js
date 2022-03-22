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
      <nav className="navbar has-background-black-ter" role="navigation" aria-label="main navigation">
        <div className="navbar-brand is-flex is-align-items-center">
          <figure className="image is-64x64 custom-nav-img pl-3 is-flex is-align-items-center">
            <img className="" src={Logo} />
          </figure>
          <a className="navbar-item inter is-size-3 is-size-4-mobile" onClick={logoClickHandler}>
            <span className="">Mystery Boxes</span>
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
            <a
              className="navbar-item"
              onClick={() => {
                setSelectedTab("About");
                setIsActive(false);
              }}
            >
              About
            </a>
            <a
              className="navbar-item"
              onClick={() => {
                setSelectedTab("Get Mystery Box!");
                setIsActive(false);
              }}
            >
              Mint
            </a>
            <a
              className="navbar-item"
              onClick={() => {
                setSelectedTab("Gallery");
                setIsActive(false);
              }}
            >
              Your Mystery Boxes
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
