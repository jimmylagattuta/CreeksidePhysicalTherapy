import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { navMenu } from '../data';
import RequestAppointmentForm from './helpers/RequestAppointmentForm';
import './helpers/navbarHelpers/Navbar.css';
import './helpers/navbarHelpers/FormDiv.css';
import ForesightSquare from './helpers/navbarHelpers/ForesightSquare';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(null);
    const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
    const [showThankYouMessage, setShowThankYouMessage] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const location = useLocation();

    const togglePopup = () => {
      setIsPopupOpen(!isPopupOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const submenuOpen = (menuName) => {
        isSubmenuOpen === menuName
            ? setIsSubmenuOpen(null)
            : setIsSubmenuOpen(menuName);
    };

    const resetMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsSubmenuOpen(null);
    };

    const toggleAppointmentForm = () => {
        if (location.pathname === '/locations') {
          const scrollToHeight = document.body.scrollHeight * 0.8;
          const start = window.scrollY;
          const end = scrollToHeight;
          const duration = 1000; // Duration of the scroll animation in milliseconds
      
          let startTime;
      
          const scrollAnimation = (timestamp) => {
            if (!startTime) {
              startTime = timestamp;
            }
      
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn't exceed 1
      
            const easedProgress = easeInOutCubic(progress); // Apply easing function
      
            window.scrollTo(0, start + (end - start) * easedProgress);
      
            if (elapsed < duration) {
              // Continue the animation
              window.requestAnimationFrame(scrollAnimation);
            }
          };
      
          // Easing function for smooth scroll animation
          const easeInOutCubic = (t) =>
            t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
          // Start the animation
          window.requestAnimationFrame(scrollAnimation);
        }
      };

      
    const closeForm = () => {
        setIsPopupOpen(false); // Close the form
    };
      
    return (
        <header className='navbar-div'>
            <div>
                <div className="navbar-container">
                    <Link to='/' className='logo-link-navbar' style={{ textDecorationLine: 'none' }}>
                        <div className='logo-and-title'>
                            <img
                                src='https://i.imgur.com/1M8ZlnK.webp'
                                alt='Riverside Orthopaedics Associates'
                                className='navbar-logo'
                            />
                            <div>
                                <h2 className="animate-charcter">Orthopaedic Associates Of Riverside</h2>
                            </div>
                        </div>
                    </Link>
                    <div className='navbar-buttons-nav'>
                        <NavLink
                            onClick={toggleAppointmentForm}
                            to={{ pathname: '/locations', hash: '#chatbox' }}
                        >
                            <span className='nav-button'>
                                Call Us
                            </span>
                        </NavLink>
                        <div
                            onClick={togglePopup}
                            >
                            <span className='nav-button'>
                                Download Forms
                            </span>
                        </div>
                        {isPopupOpen && (
                            <div id="form-div">
                                <ForesightSquare togglePopup={togglePopup} />
                            </div>
                        )}
                        {showThankYouMessage && (
                            <div className="thank-you-message">
                                Thank you for the message! We will be with you shortly.
                            </div>
                        )}
                    </div>
                    <button
                        className='mobile-menu-button-navbar'
                        onClick={toggleMobileMenu}
                    >
                        <i
                            className={
                                isMobileMenuOpen ? 'fa fa-times' : 'fa fa-bars'
                            }
                            id="animate-bars"
                            aria-hidden='true'></i>
                    </button>
                </div>
                    <div>
                </div>
            </div>
            <nav
                className={`navbar ${isSubmenuOpen}-open ${
                    isMobileMenuOpen ? 'mobile-menu-show' : ''
                }`}>
                {navMenu.map((item, index) => {
                    return (
                        <div key={index} className={`nav-link-container ${item.menu}-nav`}>
                            <div className='link-items'>
                                <NavLink
                                    onClick={resetMobileMenu}
                                    key={item.menu}
                                    to={item.link}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'nav-link-nav active'
                                            : 'nav-link-nav'
                                    }>
                                    {item.menu}
                                </NavLink>
                                {item.subMenuItems && (
                                    <button
                                        className='mobile-toggle-submenu'
                                        onClick={() => submenuOpen(item.menu)}>
                                        {isSubmenuOpen === item.menu ? (
                                            <i className='fas fa-minus'></i>
                                        ) : (
                                            <i className='fas fa-plus'></i>
                                        )}
                                    </button>
                                )}
                            </div>
                            {item.subMenuItems && (
                                <div className='submenu'>
                                    <NavLink
                                        onClick={resetMobileMenu}
                                        key={item.menu}
                                        to={item.link}
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'sub-link mobile-nav-link active'
                                                : 'sub-link mobile-nav-link'
                                        }
                                        end>
                                        All {item.menu}
                                    </NavLink>
                                    <div className={`submenu-list ${item.subMenuItems.length > 16 ? 'submenu-multi-column' : item.subMenuItems.length > 6 ? 'submenu-two-column' : ''}`}>
                                        {item.subMenuItems.map((subItem) => {
                                            return (
                                                <NavLink
                                                    onClick={resetMobileMenu}
                                                    key={subItem}
                                                    to={`${item.link}/${subItem.toLowerCase().split(' ').join('-')}`}
                                                    className={({ isActive }) =>
                                                        isActive ? 'sub-link active' : 'sub-link'
                                                    }>
                                                    {subItem}
                                                </NavLink>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </header>
    );
};

export default Navbar;