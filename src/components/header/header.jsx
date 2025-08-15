import React from "react";
import logo from "../../assets/transparentLogo.png";
import "./header.scss";
import { Link } from "react-router-dom";

// import "./Header.scss";

function Header() {
  return (
    <header className="header mt-3">
      <div className="d-flex justify-content-center center-element">
        <Link to="/">
          <img
            src={logo}
            alt="Hoidle logo"
            id="hoidle-logo"
            className="mx-auto rounded p-2"
          />
        </Link>
      </div>
    </header>
  );
}

export default Header;
