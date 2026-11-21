import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { TiLocation } from 'react-icons/ti';
import { MdLocalPhone, MdOutlineMail } from 'react-icons/md';
import { LuFacebook } from 'react-icons/lu';
import { BsInstagram } from 'react-icons/bs';
import { RiFolderVideoLine } from 'react-icons/ri';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { getSiteSettings, getStoredUser, logoutUser } from '../../services/api';
import './Navbar.css';

/**
 * Reusable Responsive Navbar Component
 * Supports mobile hamburger menu (< 768px), top utility bar, and accessibility.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser());
  const [settings, setSettings] = useState({
    mobile: '9695774046',
    email: 'rapidalbumcreation@gmail.com',
    address: 'Raebareli, Uttar Pradesh',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: ''
  });

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Sync auth state
  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getStoredUser());
    };
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Fetch dynamic site settings
  useEffect(() => {
    let isMounted = true;
    getSiteSettings().then((data) => {
      if (isMounted && data) {
        setSettings((prev) => ({
          ...prev,
          mobile: data.mobile || prev.mobile,
          email: data.email || prev.email,
          address: data.address || prev.address,
          facebook: data.facebook || prev.facebook,
          instagram: data.instagram || prev.instagram,
          linkedin: data.linkedin || prev.linkedin
        }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    closeMenu();
    navigate('/login');
  };

  return (
    <header className="site-header">
      {/* Top Utility Bar */}
      <div className="utility-bar">
        <div className="utility-bar__inner">
          <ul className="utility-bar__contact">
            <li>
              <TiLocation className="utility-icon" />
              <span>{settings.address}</span>
            </li>
            <li>
              <MdLocalPhone className="utility-icon" />
              <a href={`tel:${settings.mobile}`} className="utility-link">
                +91 {settings.mobile}
              </a>
            </li>
            <li>
              <MdOutlineMail className="utility-icon" />
              <a href={`mailto:${settings.email}`} className="utility-link">
                {settings.email}
              </a>
            </li>
          </ul>

          <div className="utility-bar__social">
            <span className="utility-social-label">Follow Us:</span>
            <div className="utility-social-icons">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <LuFacebook />
                </a>
              )}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <RiFolderVideoLine />
              </a>
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <BsInstagram />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="main-navbar" aria-label="Main Navigation">
        <div className="main-navbar__inner">
          {/* Brand Logo & Slogan */}
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <div className="navbar-brand__logo">
              <span className="navbar-brand__highlight">Singh </span>Album Design
            </div>
            <div className="navbar-brand__tagline">
              <span>Capture</span> • <span>Design</span> • <span>Cherish</span>
            </div>
          </Link>

          {/* Hamburger Menu Toggle Button (Visible on mobile/tablet < 768px) */}
          <button
            className="navbar-hamburger"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Navigation Links */}
          <div className={`navbar-collapse ${menuOpen ? 'navbar-collapse--open' : ''}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to="/" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <a href="/#about" onClick={closeMenu} className="nav-link">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <NavLink to="/service" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                  Services
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/album" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                  Album Booking
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/training" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                  Training
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/enquiry" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                  Enquiry
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                  Contact Us
                </NavLink>
              </li>
              <li className="nav-item nav-item--cta">
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#1E3A8A' }}>
                      <FaUserCircle size={18} /> {user.name?.split(' ')[0]}
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        background: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.85rem'
                      }}
                      title="Log Out"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                ) : (
                  <NavLink to="/login" onClick={closeMenu} className="nav-link nav-link--cta">
                    Login / Register
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
