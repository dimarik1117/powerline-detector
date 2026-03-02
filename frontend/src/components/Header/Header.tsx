import { Link } from "react-router-dom";

import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="container header__content">
        
        <Link to="/dashboard" className="header__logo">
          <img
            src="../../images/sprite/icon-logo.svg"
            alt="Logo"
          />
        </Link>

        <div className="header__icons">
          <Link to="/profile">
            <img
              src="../../images/sprite/icon-profile.svg"
              className="header__icons-img"
              alt="Profile"
            />
          </Link>

          <Link to="/">
            <img
              src="../../images/sprite/icon-exit.svg"
              className="header__icons-img"
              alt="Exit"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}