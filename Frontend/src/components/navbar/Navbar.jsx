import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import './navbar.css';
import SearchBar from './SearchBar';
import Login from './login/Login';
import { FaCartShopping } from "react-icons/fa6";
import { RiAdminLine } from "react-icons/ri";
import LoginModal from '../../pages/admin/AdminLoginPopup';

function MainNavbar({ username }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminPopupOpen, setAdminPopupOpen] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dynamically check admin login status
  const handleAdminClick = () => {
    const adminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (adminLoggedIn) {
      navigate('/admin');
    } else {
      setAdminPopupOpen(true);
    }
  };

  useEffect(() => {
    if (location.pathname !== '/admin') {
      localStorage.setItem("isAdminLoggedIn", "false");
    }
  }, [location.pathname]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setCurrentUsername(storedUsername);
    }
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem("isAdminLoggedIn", "true");
    setAdminPopupOpen(false);
    navigate('/admin');
  };

  const isActive = (path) => location.pathname === path;

  // Toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="bg-slate-300">
        <nav className="flex h-20 items-center list-none justify-between px-4 lg:px-8">
          {/* Logo */}
          <div className="logo">
            <img
              src={Logo}
              className="w-12 rounded-full"
              onClick={() => (window.location.href = '/')}
              style={{ cursor: 'pointer' }}
              alt="Logo"
            />
          </div>

          {/* Search Bar (only for large screens) */}
          <div className="hidden lg:block flex-grow">
            <SearchBar />
          </div>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden flex items-center">
            <button onClick={toggleMenu}>
              <span className="text-xl">☰</span>
            </button>
          </div>

          {/* Navbar Links */}
          <div className={`lg:flex justify-evenly items-center ${isMenuOpen ? 'navbar-links active' : 'hidden'} lg:block`}>
            <div
              onClick={() => navigate('/menu')}
              className={`hover:bg-slate-400 rounded-md cursor-pointer font-semibold px-4 py-2 ${isActive('/menu') ? 'bg-slate-400 rounded-lg' : ''}`}
            >
              Menu
            </div>
            <div
              onClick={() => navigate('/contact')}
              className={`hover:bg-slate-400 rounded-lg cursor-pointer font-semibold px-4 py-2 ${isActive('/contact') ? 'bg-slate-400 rounded-lg' : ''}`}
            >
              Contact
            </div>
            {currentUsername ? (
              <div className="username-display">
                <span><Login username={username} /></span>
              </div>
            ) : (
              <div className="login-link">
                <Login />
              </div>
            )}
            <div onClick={() => navigate('/cart')} className="cursor-pointer">
              <FaCartShopping size={28} />
            </div>
            <div
              onClick={handleAdminClick}
              className={`hover:bg-slate-400 rounded-lg cursor-pointer font-semibold px-4 py-2 flex items-center gap-1 ${isActive('/admin') ? 'bg-slate-400 rounded-lg' : ''}`}
            >
              <RiAdminLine className="text-2xl" size={27} />
              Admin
            </div>
          </div>
        </nav>

        {/* Admin Login Popup */}
        {isAdminPopupOpen && (
          <LoginModal
            onClose={() => setAdminPopupOpen(false)}
            onLogin={handleLoginSuccess}
          />
        )}
      </div>
    </>
  );
}

export default MainNavbar;
