import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UseAuthContext } from '../../contexts/auth-context';

const Navbar: React.FC = () => {
    const { user, logout } = UseAuthContext();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">EFREI My Contacts</Link>
            </div>

            <div className="navbar-menu">
                <div className="navbar-nav">
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    >
                        Accueil
                    </Link>
                    <Link
                        to="/profile"
                        className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                    >
                        Profil
                    </Link>
                </div>

                <div className="navbar-user">
                    <span className="user-name">
                        Bonjour, {user?.firstName}
                    </span>
                    <button onClick={logout} className="logout-btn">
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;