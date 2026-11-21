import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import { getSiteSettings } from '../../services/api';
import './Footer.css';

/**
 * Reusable Responsive Footer Component
 * Accessible, mobile-first grid layout with dynamic site settings.
 */
const Footer = () => {
  const [settings, setSettings] = useState({
    mobile: '9695774046',
    email: 'rapidalbumcreation@gmail.com',
    address: 'Raebareli Uttar Pradesh India',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: ''
  });

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

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {/* Brand Column */}
        <div className="footer-col footer-col--brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo__accent">Singh</span> Album Design
          </Link>
          <p className="footer-tagline">Capture • Design • Cherish</p>
          <p className="footer-desc">
            We craft exquisite and timeless wedding albums with bespoke layouts,
            premium materials, and master photo retouching.
          </p>
          <div className="footer-social-links">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
            )}
            {settings.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            )}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col">
          <h4 className="footer-col__title">Quick Links</h4>
          <ul className="footer-links-list">
            <li><NavLink to="/">Home</NavLink></li>
            <li><a href="/#about">About Us</a></li>
            <li><NavLink to="/service">Services</NavLink></li>
            <li><NavLink to="/album">Album Samples</NavLink></li>
            <li><NavLink to="/training">Training</NavLink></li>
            <li><NavLink to="/contact">Contact Us</NavLink></li>
          </ul>
        </div>

        {/* Services Column */}
        <div className="footer-col">
          <h4 className="footer-col__title">Our Services</h4>
          <ul className="footer-links-list">
            <li><NavLink to="/service">Wedding Album Design</NavLink></li>
            <li><NavLink to="/service">Photo Finishing & Retouch</NavLink></li>
            <li><NavLink to="/training">Photoshop Training</NavLink></li>
            <li><NavLink to="/album">Custom Album Design</NavLink></li>
            <li><NavLink to="/enquiry">Order Consultation</NavLink></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="footer-col footer-col--contact" id="contact">
          <h4 className="footer-col__title">Contact Information</h4>
          <ul className="footer-contact-list">
            <li>
              <FaPhoneAlt className="footer-contact-icon" />
              <a href={`tel:${settings.mobile}`}>+91 {settings.mobile}</a>
            </li>
            <li>
              <FaEnvelope className="footer-contact-icon" />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li>
              <FaMapMarkerAlt className="footer-contact-icon" />
              <span>{settings.address}</span>
            </li>
            <li>
              <FaGlobe className="footer-contact-icon" />
              <a href="https://rapidalbumcreation.com/" target="_blank" rel="noreferrer">rapidalbumcreation.com</a>
            </li>
          </ul>

          <NavLink to="/enquiry" className="footer-cta-btn">
            Send Enquiry →
          </NavLink>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom__inner">
          <p>© {new Date().getFullYear()} Singh Album Design. All Rights Reserved.</p>
          <p className="footer-credit">
            Design and Developed by{' '}
            <a
              href="https://axsemsoftwares.com/"
              target="_blank"
              rel="noreferrer"
              className="footer-credit-link"
            >
              Team Axsem Software
            </a>
          </p>
          <p className="footer-bottom__tag">Capture • Design • Cherish</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
