import React, { useState } from 'react';
import './ContactNav.css';

const MenuComponent = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredDetails, setHoveredDetails] = useState('');
  const [hoveredPhoneDetails, setHoveredPhoneDetails] = useState('');

  console.log('hoveredDetails', hoveredDetails);
  console.log('hoveredPhoneDetails', hoveredPhoneDetails);

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
  
  
  
  const handleMouseLeave = () => {
    setHoveredItem(null);
    setHoveredDetails('');
  };

  const handleItemOpen = () => {
    setMenuOpen(!isMenuOpen);
    // setMenuOpen(true);
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
    <div className={isMenuOpen ? 'menu-open' : ''}>
      <div onClick={handleItemOpen} className="nav-phone-and-seperater">
        <p className="words-appear">Call</p><p className="nav-seperater">{` `}Us</p><p className="nav-seperater">|{` `}</p><i id="nav-phone" className='fas fa-mobile-alt fa-2x'></i>
        <p className="words-appear">Directions</p><i id="nav-map" className='fas fa-map-marked-alt fa-1x'></i>
      </div>
      {isMenuOpen && (
        <div className="contact-nav-menu">
          <div className='default-company-call-directions'>
            <a
              id="map-icon-nav"
              href='tel:+15550100'
              title='Phone clickable'
              onMouseEnter={() => handleMouseEnter('Cityville', '100 Main Street\nCityville, IL 60000\n555-0100\nFax: 555-0101', true)}
              onMouseLeave={handleMouseLeave}
              style={getPhoneHoveredStyle()}
            >
              <i id="nav-phone-call" className='fas fa-mobile-alt fa-2x'></i>
            </a>
            Cityville
            <a
              id="map-icon-nav"
              href={`https://maps.google.com/?q=100+Main+Street,Cityville,IL+60000`}
              onMouseEnter={() => handleMouseEnter('Cityville', '100 Main Street\nCityville, IL 60000\n555-0100\nFax: 555-0101', false)}
              onMouseLeave={handleMouseLeave}
              style={getAddressHoveredStyle()}
            >
              <i id="nav-map-go" className='fas fa-map-marked-alt fa-1x'></i>
            </a>
          </div>
          <div className='default-company-call-directions'>
            <a
              id="map-icon-nav"
              href='tel:+15550200'
              title='Phone clickable'
              onMouseEnter={() => handleMouseEnter('Metropolis', '200 Central Ave\nMetropolis, IL 60001\n555-0200\nFax: 555-0201', true)}
              onMouseLeave={handleMouseLeave}
              style={getPhoneHoveredStyle()}
            >
              <i id="nav-phone-call" className='fas fa-mobile-alt fa-2x'></i>
            </a>
            Metropolis
            <a
              id="map-icon-nav"
              href={`https://maps.google.com/?q=200+Central+Ave,Metropolis,IL+60001`}
              onMouseEnter={() => handleMouseEnter('Metropolis', '200 Central Ave\nMetropolis, IL 60001\n555-0200\nFax: 555-0201', false)}
              onMouseLeave={handleMouseLeave}
              style={getAddressHoveredStyle()}
            >
              <i id="nav-map-go" className='fas fa-map-marked-alt fa-1x'></i>
            </a>
          </div>
          <div className='default-company-call-directions'>
            <a
              id="map-icon-nav"
              href='tel:+15550300'
              title='Phone clickable'
              onMouseEnter={() => handleMouseEnter('Springfield', '300 Capitol Plaza\nSpringfield, IL 60002\n555-0300\nFax: 555-0301', true)}
              onMouseLeave={handleMouseLeave}
              style={getPhoneHoveredStyle()}
            >
              <i id="nav-phone-call" className='fas fa-mobile-alt fa-2x'></i>
            </a>
            Springfield
            <a
              id="map-icon-nav"
              href={`https://maps.google.com/?q=300+Capitol+Plaza,Springfield,IL+60002`}
              onMouseEnter={() => handleMouseEnter('Springfield', '300 Capitol Plaza\nSpringfield, IL 60002\n555-0300\nFax: 555-0301', false)}
              onMouseLeave={handleMouseLeave}
              style={getAddressHoveredStyle()}
            >
              <i id="nav-map-go" className='fas fa-map-marked-alt fa-1x'></i>
            </a>
          </div>
          {hoveredDetails && (
            <div style={{ maxWidth: '140px', backgroundColor: 'rgb(0, 64, 143)', zIndex: '8', padding: '5px', lineHeight: '1.5' }}>
              <p dangerouslySetInnerHTML={{ __html: hoveredDetails }}></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuComponent;
