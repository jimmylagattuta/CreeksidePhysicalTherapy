import React, { useState, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { navMenu, officesData } from '../data';
import RequestAppointmentForm from './helpers/RequestAppointmentForm';
import './helpers/navbarHelpers/Navbar.css';
import './helpers/navbarHelpers/FormDiv.css';
import ForesightSquare from './helpers/navbarHelpers/ForesightSquare';
import ContactNav from './helpers/navbarHelpers/ContactNav';
import './helpers/navbarHelpers/ContactNav.css';
const generateSlug = (name) => encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));


const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(null);
    const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
    const [showThankYouMessage, setShowThankYouMessage] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredDetails, setHoveredDetails] = useState('');
    const [hoveredPhoneDetails, setHoveredPhoneDetails] = useState('');
    const phoneRef = useRef(); // Create a ref for the phone number link

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const submenuOpen = (menuName) => {
        if (isSubmenuOpen === menuName) {
            setIsSubmenuOpen(null);
        } else {
            setTimeout(() => {
                setIsSubmenuOpen(menuName);
            }, 250);
        }
    };

    const closeSubmenu = () => {
        setIsSubmenuOpen(null);
    };

    const resetMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setTimeout(() => {
            setIsSubmenuOpen(null);
        }, 250);
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

    const handleMouseEnter = (item, details, isPhone) => {
        setHoveredItem(item);

        let lines = details.split('\n');
        let addressLines = [];
        let phoneNumberLines = [];

        // Iterate through each line to categorize as address or phone number
        lines.forEach(line => {
            // Check if the line matches a phone number pattern
            const phoneNumberRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
            if (phoneNumberRegex.test(line)) {
                phoneNumberLines.push(line);
            } else {
                addressLines.push(line);
            }
        });

        // Highlight the first phone number
        if (isPhone && phoneNumberLines.length > 0) {
            const highlightedPhoneNumber = `<p style="color: yellow;">${phoneNumberLines[0]}</p>`;
            setHoveredDetails(details.replace(phoneNumberLines[0], highlightedPhoneNumber));
        } else {
            setHoveredDetails(details.replace(addressLines.join('\n'), `<p style="color: yellow;">${addressLines.join('\n')}</p>`));
            setHoveredPhoneDetails(''); // Clear the phone details
        }
    };

    const handleCallDirectionsClick = () => {
        setMenuOpen(prevState => !prevState); // Toggle the menu open/close state
        setIsMenuOpen(prevState => !prevState); // Toggle the specific Call/Directions state
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
        setHoveredDetails('');
    };

    const handleItemOpen = () => {
        setMenuOpen(!isMenuOpen);
    };

    const getHoveredStyle = (item) => {
        return item === hoveredItem ? { backgroundColor: 'yellow' } : {};
    };

    const getAddressHoveredStyle = () => {
        return getHoveredStyle('address');
    };

    const getPhoneHoveredStyle = () => {
        return getHoveredStyle('phone');
    };

    return (
        <header className='navbar-div'>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div className="navbar-container">
                    <Link to='/' className='logo-link-navbar' style={{ textDecorationLine: 'none' }}>
                        <div className='logo-and-title'>
                            <img
                                src='../Logo.jpg'
                                alt='Creekside Physical Therapy'
                                className='navbar-logo'
                            />
                        </div>
                    </Link>
                    <button
                        aria-label="Mobile navbar button"
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
            </div>
            <nav
                className={`navbar ${isSubmenuOpen}-open ${isMobileMenuOpen ? 'mobile-menu-show' : ''}`}>
                {navMenu.map((item, index) => {
                    return (
                        <div key={index} className={`nav-link-container ${item.menu}-nav`}>
                            <div className='link-items'>
                                <NavLink
                                    onClick={resetMobileMenu}
                                    key={item.menu}
                                    to={item.link}
                                    className={({ isActive }) =>
                                        isActive ? 'nav-link-nav active' : 'nav-link-nav'
                                    }>
                                    {item.menu}
                                </NavLink>
                                {item.subMenuItems && (
                                    <button
                                        onClick={() => submenuOpen(item.menu)}
                                        className='mobile-toggle-submenu'
                                    >
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
                                    {isSubmenuOpen !== null && (
                                        <NavLink
                                            onClick={resetMobileMenu}
                                            key={item.menu}
                                            to={item.link}
                                            className={({ isActive }) =>
                                                isActive ? 'sub-link mobile-nav-link active' : 'sub-link mobile-nav-link'
                                            }
                                            end>
                                            All {item.menu}
                                        </NavLink>
                                    )}
                                    <div className={`submenu-list ${item.subMenuItems.length > 16 ? 'submenu-multi-column' : item.subMenuItems.length > 6 ? 'submenu-two-column' : ''}`}>
                                        {((isSubmenuOpen !== null) || (window.innerWidth >= 1000)) && item.subMenuItems.map((subItem) => {
                                            return (
                                                <NavLink
                                                    onClick={resetMobileMenu}
                                                    key={subItem}
                                                    to={`/providers/${generateSlug(subItem)}`}
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
