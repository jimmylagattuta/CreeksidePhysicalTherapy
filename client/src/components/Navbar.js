import React, { useState, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { navMenu } from '../data';
import './helpers/navbarHelpers/Navbar.css';
import './helpers/navbarHelpers/FormDiv.css';
import ForesightSquare from './helpers/navbarHelpers/ForesightSquare';
import './helpers/navbarHelpers/ContactNav.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const location = useLocation();
    const phoneRef = useRef();

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

    const resetMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setTimeout(() => {
            setIsSubmenuOpen(null);
        }, 250);
    };

    const handleMouseEnter = (item, details, isPhone) => {
        // handle hover effect here if needed
    };

    const handleMouseLeave = () => {
        // handle hover effect here if needed
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
                    <div style={{ display: 'flex' }}>

                        <a 
                            href="https://www.healowpay.com/HealowPay/jsp/healow/login.jsp" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn header-button-yellow"

                            style={{ backgroundColor: '#c6972d', maxHeight: '30px', minWidth: '62px' }}
                        >
                            Pay Now
                        </a>
                    </div>
                    <div className='navbar-buttons-nav'>
                        <a href="tel:971-300-0690" className='nav-button-new'>
                            Call Us: 971-300-0690
                        </a>
                        {isPopupOpen && (
                            <div id="form-div">
                                <ForesightSquare togglePopup={togglePopup} />
                            </div>
                        )}
                    </div>
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
            <nav className={`navbar ${isSubmenuOpen}-open ${isMobileMenuOpen ? 'mobile-menu-show' : ''}`}>
                {navMenu.map((item, index) => (
                    <div key={index} className={`nav-link-container ${item.menu}-nav`}>
                        <div className='link-items'>
                            {item.target ? (
                                <a
                                    href={item.link}
                                    target={item.target}
                                    rel="noopener noreferrer"
                                    className='nav-link-nav'
                                >
                                    {item.menu}
                                </a>
                            ) : (
                                <NavLink
                                    onClick={resetMobileMenu}
                                    key={item.menu}
                                    to={item.link}
                                    className={({ isActive }) =>
                                        isActive ? 'nav-link-nav active' : 'nav-link-nav'
                                    }>
                                    {item.menu}
                                </NavLink>
                            )}
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
                            <div className={`submenu ${isSubmenuOpen === item.menu ? 'show' : ''}`}>
                                <NavLink
                                    onClick={resetMobileMenu}
                                    to={item.link}
                                    className={({ isActive }) =>
                                        isActive ? 'sub-link mobile-nav-link active' : 'sub-link mobile-nav-link'
                                    }
                                    end>
                                    All {item.menu}
                                </NavLink>
                                <div className={`submenu-list ${item.subMenuItems.length > 16 ? 'submenu-multi-column' : item.subMenuItems.length > 6 ? 'submenu-two-column' : ''}`}>
                                    {item.subMenuItems.map((subItem) => {
                                        if (typeof subItem !== 'string') {
                                            console.error('Expected string, but got:', typeof subItem, subItem);
                                            return null;
                                        }
                                        const path = `/${item.menu === 'Providers' ? 'providers' : 'services'}/${subItem.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-')}`;
                                        return (
                                            <NavLink
                                                onClick={resetMobileMenu}
                                                key={subItem}
                                                to={path}
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
                ))}
            </nav>
        </header>
    );
};

export default Navbar;
