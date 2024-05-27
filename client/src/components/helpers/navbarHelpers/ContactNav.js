import React, { useState } from 'react';
import { officesData } from '../../../data';

import './ContactNav.css';

const ContactNav = ({
  isMenuOpen,
  setMenuOpen,
  hoveredItem,
  setHoveredItem,
  hoveredDetails,
  setHoveredDetails,
  handleItemOpen,
  hoveredPhoneDetails,
  setHoveredPhoneDetails,
  handleMouseEnter,
  handleMouseLeave,
  getHoveredStyle,
  getAddressHoveredStyle,
  getPhoneHoveredStyle,
  setIsMenuOpen, // Include setMenuOpen from props
  handleCallDirectionsClick
}) => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);



  return (
    <div className={isMenuOpen ? 'menu-open' : ''}>
      <div onClick={handleCallDirectionsClick} className="nav-phone-and-seperater">
        <p className="words-appear">Call/</p><p className="nav-seperater">{` `}Us</p><p className="nav-seperater">|{` `}</p>
        <p className="words-appear">Directions</p>
      </div>
      {isMenuOpen && (
        <div className="contact-nav-menu">
          {officesData.map(office => (
            <div className='default-company-call-directions' key={office.id}>
              <a
                id="map-icon-nav"
                href={`tel:${office.phone}`}
                title='Phone clickable'
                onMouseEnter={() => handleMouseEnter(office.city, `${office.addressOne}\n${office.addressTwo}\n${office.phone}\nFax: ${office.fax}`, true)}
                onMouseLeave={handleMouseLeave}
                style={getPhoneHoveredStyle()}
              >
                <i id="nav-phone-call" className='fas fa-mobile-alt fa-2x'></i>
              </a>
              {office.city}
              <a
                id="map-icon-nav"
                href={`https://maps.google.com/?q=${office.addressOne.replace(/\s/g, '+')},${office.addressTwo.replace(/\s/g, '+')}`}
                onMouseEnter={() => handleMouseEnter(office.city, `${office.addressOne}\n${office.addressTwo}\n${office.phone}\nFax: ${office.fax}`, false)}
                onMouseLeave={handleMouseLeave}
                style={getAddressHoveredStyle()}
              >
                <i id="nav-map-go" className='fas fa-map-marked-alt fa-1x'></i>
              </a>
            </div>
          ))}
          {hoveredDetails && (
            <div style={{ maxWidth: '140px', backgroundColor: 'rgba(114, 14, 16, 20%)', zIndex: '8', padding: '5px', lineHeight: '1.5' }}>
              <p dangerouslySetInnerHTML={{ __html: hoveredDetails }}></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactNav;
