import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { navMenu } from '../data';
import './helpers/navbarHelpers/Navbar.css';

// Helper function to generate slugs
const generateSlug = (name) => encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(null);

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

    return (
        <header className='navbar-div'>
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
            <nav className={`navbar ${isSubmenuOpen}-open ${isMobileMenuOpen ? 'mobile-menu-show' : ''}`}>
                {navMenu.map((item, index) => (
                    <div key={index} className={`nav-link-container ${item.menu}-nav`}>
                        <div className='link-items'>
                            <NavLink
                                onClick={resetMobileMenu}
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
                                        const path = `/${item.menu === 'Providers' ? 'providers' : 'services'}/${generateSlug(subItem)}`;
                                        console.log('Generated Path:', path);
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
