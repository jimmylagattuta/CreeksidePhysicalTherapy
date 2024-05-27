import React, { useState, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { navMenu, officesData } from '../data';
import RequestAppointmentForm from './helpers/RequestAppointmentForm';
import './helpers/navbarHelpers/Navbar.css';
import './helpers/navbarHelpers/FormDiv.css';
import ForesightSquare from './helpers/navbarHelpers/ForesightSquare';
import ContactNav from './helpers/navbarHelpers/ContactNav';
import './helpers/navbarHelpers/ContactNav.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(null);
    const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
    const [showThankYouMessage, setShowThankYouMessage] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const location = useLocation();
    // const [setMenuOpen, setIsMenuOpen] = useState(false);
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
        console.log('toggleMobileMenu');
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    
    const submenuOpen = (menuName) => {
        console.log('submenuOpen');
        if (isSubmenuOpen === menuName) {
            // If the submenu is already open, close it
            setIsSubmenuOpen(null);
        } else {
            // If a different submenu is open, close it and open the clicked submenu
            setTimeout(() => {
                setIsSubmenuOpen(menuName);
            }, 250);
        }
    };
    

    
    const closeSubmenu = () => {
        setIsSubmenuOpen(null);
    };
    

    const resetMobileMenu = () => {
        console.log('resetMobileMenu');
        setIsMobileMenuOpen(false);
        setTimeout(() => {
            setIsSubmenuOpen(null);
        }, 0.25);
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
                            {/* <div> */}
                                {/* <h2 className="animate-charcter">Creekside Physical Therapy</h2> */}
                            {/* </div> */}
                        </div>
                    </Link>
                    <div className='navbar-buttons-nav'>

                        <div className="call-contact-download">

                            <NavLink
                                onClick={toggleAppointmentForm}
                                to={{ pathname: '/locations', hash: '#chatbox' }}
                            >
                                <span className='nav-button-new'
                                    ref={phoneRef}
                                    href='tel:971-300-0690'
                                    onMouseEnter={() => handleMouseEnter('call', 'Call Us: 971-300-0690', true)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    Call Us: 971-300-0690
                                </span>
                            </NavLink>
                           
                                
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
                            <div className='link-items'> {/* Added div for link items */}
                                {item.onClick ? (
                                    <NavLink
                                        onClick={item.onClick}
                                        key={item.menu}
                                        to={item.link}
                                        className={({ isActive }) =>
                                            isActive ? 'nav-link-nav active' : 'nav-link-nav'
                                        }>
                                        {item.menu}
                                    </NavLink>
                                ) : (
                                    <NavLink
                                        onClick={handleCallDirectionsClick}
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
                                    {/* ---------------------------------------------------------------------------------- */}
                                    <div className={`submenu-list ${item.subMenuItems.length > 16 ? 'submenu-multi-column' : item.subMenuItems.length > 6 ? 'submenu-two-column' : ''}`}>
                                        {((isSubmenuOpen !== null) || (window.innerWidth >= 1000)) && item.subMenuItems.map((subItem) => {
                                            // Check if the subItem contains a comma
                                            if (subItem.includes(',')) {
                                                // Split the name by comma to separate the last name and titles
                                                const parts = subItem.split(',');
                                                if (parts.length >= 2) {
                                                    let lastName = parts[0].trim(); // Get the last name
                                                    let title = parts[1]?.trim(); // Get the first title if it exists

                                                    // Exclude single first-name people
                                                    if (lastName === title) {
                                                        return null;
                                                    }

                                                    // If the title is "Physical Therapist", replace it with "PT"
                                                    title = title === 'Physical Therapist' ? 'PT' : title;

                                                    // Check if the last name is one of the special cases
                                                    if (['Hal', 'Mikayla', 'Jacqueline', 'Cellina', 'Dixie'].includes(lastName)) {
                                                        // For the special cases, set the title to 'PT Aide'
                                                        title = 'PT Aide';
                                                    }

                                                    return (
                                                        <NavLink
                                                            onClick={resetMobileMenu}
                                                            key={subItem}
                                                            to={`${item.link}/${subItem.toLowerCase().split(' ').join('-')}`}
                                                            className={({ isActive }) =>
                                                                isActive ? 'sub-link active' : 'sub-link'
                                                            }>
                                                            {lastName}, {title}
                                                        </NavLink>
                                                    );
                                                }
                                            }
                                            // Display subItem directly if it does not contain a comma or the parts are insufficient
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


                                    {/* ---------------------------------------------------------------------------------- */}
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