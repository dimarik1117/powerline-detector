import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header__content">
        <Link to="/dashboard" className="header__logo" title="На главную">
          <img
            src="../../images/sprite/icon-logo.svg"
            alt="PowerLine Detector"
          />
        </Link>

        <div className="header__icons">
          <Link to="/profile" title="Профиль">
            <img
              src="../../images/sprite/icon-profile.svg"
              className="header__icons-img"
              alt="Profile"
            />
          </Link>

          <button 
            onClick={handleLogout} 
            className="header__logout-btn"
            title="Выйти"
          >
            <img
              src="../../images/sprite/icon-exit.svg"
              className="header__icons-img"
              alt="Exit"
            />
          </button>
        </div>
      </div>
    </header>
  );
}