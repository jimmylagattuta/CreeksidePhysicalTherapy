import React, { useEffect, useRef, useState } from 'react';
import { aboutObj, aboutObjOther, aboutObjPortal, insuranceInformation } from '../../data';
import AppointmentInfo from './AppointmentInfo';
import './helpers/About.css';
import './helpers/PortalSection.css';

const About = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const portalSectionRef = useRef(null);
  const [isJioPhone, setIsJioPhone] = useState(false);
  const [isPixel2, setIsPixel2] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isOldiOS, setIsOldiOS] = useState(false);


  useEffect(() => {
    const userAgent = navigator.userAgent;
    // console.log("Browser's User Agent:", userAgent);
  
    // Detecting older iOS versions
    const iosVersionMatch = userAgent.match(/OS (\d+)_/); // Matches 'OS X_' where X is the version number
    if (iosVersionMatch && iosVersionMatch.length > 1) {
      const iosVersion = parseInt(iosVersionMatch[1], 10); // Extract the iOS version number
      setIsOldiOS(iosVersion < 9); // Consider iOS versions older than 11 as "old"
    }

    setIsJioPhone(userAgent.includes("KAIOS"));
    setIsAndroid(userAgent.includes("Android"));
  }, []);
  
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update the state to reflect the visibility of the portal section
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect the observer once the portal section is visible
        }
      },
      {
        threshold: 0.5, // Trigger when at least 50% of the portal section is visible
      }
    );

    if (portalSectionRef.current) {
      observer.observe(portalSectionRef.current);
    }

    // Clean up by disconnecting the observer when the component unmounts
    return () => {
      if (portalSectionRef.current) {
        observer.unobserve(portalSectionRef.current);
      }
    };
  }, []);
  console.log("Props:", props);
  console.log('aboutObjOther', aboutObjOther);
  console.log("State:", {
    isVisible,
    isJioPhone,
    isPixel2,
    isAndroid,
    isOldiOS
  });
  return (
    <div className="top-div-about" style={{ width: '100vw' }}>
      <div className='about-parent-div'>
        <div className='about-div-responsive'>
          {aboutObj.map((item, index) => {
            return (
              <div className='about-div-two-responsive' key={index}>
                <img
                  src="https://i.imgur.com/EBJUAgp.webp"
                  alt={item.nameOne}
                  id='about-div-image-responsive'
                />
                <img
                  src="https://i.imgur.com/V1JENY4h.webp"
                  alt="Doctor"
                  id='about-div-doctor-responsive'
                />
                <div className='about-div-bulleted'>
                  <p>{item.descriptionOne}</p>
                  {item.descriptionOneBullettedList && Array.isArray(item.descriptionOneBullettedList) && (
                    <ul className='unordered-list-about'>
                      {item.descriptionOneBullettedList.map((bulletItem, bulletIndex) => (
                        <li key={bulletIndex}>
                          {bulletItem === 'And More!' ? <h3>And More!</h3> : <h3>{bulletItem}</h3>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className='appointment-section'>
          {aboutObjOther.map((item, index) => (
            <div key={index} className='about-div-bulleted-bring'>
              <h2>{item.nameOne}</h2>
              <p>
                {/* Check if item.descriptionOne is a string */}
                {typeof item.descriptionOne === 'string' ? (
                  // If it's a string, split it to insert the link where needed
                  item.descriptionOne.split(/(Default Company Patient Portal!)/).map((part, index) => (
                    part === "Default Company Patient Portal!" ? (
                      <a
                        key={index}
                        className="animate-grow"
                        href="https://default-company.myezyaccess.com/Patient/Main.aspx"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Default Company Patient Portal!
                      </a>
                    ) : (
                      part
                    )
                  ))
                ) : (
                  // If it's not a string, render it as a separate element
                  <React.Fragment>
                    {item.descriptionOne}
                  </React.Fragment>
                )}
              </p>
                {item.descriptionOneBullettedList && item.descriptionOneBullettedList.map((bulletItem, bulletIndex) => (
                  <ul className='unordered-list-about-bring'>
                    <li key={bulletIndex}>
                      {bulletItem.startsWith('http') ? <img src={bulletItem} alt="List Item" /> : bulletItem}
                    </li>
                  </ul>
                ))}

              <ul className='unordered-list-about-bring'>
                <a href="tel:17084420221">
                  <button className="portal-button">
                    Call Us at (123) 456-7890
                  </button>
                </a>
              </ul>
            </div>
          ))}
          <h2>Insurances We Cover</h2>
          <div className='insurance-columns'>
            {insuranceInformation.map((insurance, index) => (
              <div key={index} className='about-div-bulleted-insurance'>
                <p>{insurance.name}</p>
                <ul className='unordered-list-about-insurance'>
                  {insurance.plans && (
                    <li>
                      {insurance.plans.map((plan, planIndex) => (
                        <p key={planIndex}>{plan}</p>
                      ))}
                    </li>
                  )}
                </ul>              
              </div>
            ))}
          </div>
        </div>
      </div>
      <div ref={portalSectionRef} className={`portal-section ${isVisible ? 'border-animation' : ''} ${(isJioPhone || isAndroid || isOldiOS) ? 'no-animation' : ''}`}>
        {aboutObjPortal.map((item, index) => (
          <div key={index} className='portal-about-div-bulleted-bring'>
            <h2 style={{ color: 'black' }}>{item.nameOne}</h2>
            <div>
              {item.descriptionOne.map((description, idx) => (
                <p key={idx}>{description}</p>
              ))}
            </div>
              {item.descriptionOneBullettedList.map((bulletItem, bulletIndex) => (
                <ul className='portal-unordered-list-about'>
                  <li key={bulletIndex}>{bulletItem}</li>
                </ul>
              ))}
            <ul className='portal-unordered-list-about'>
              <a style={{ color: 'black' }} className="animate-grow-portal" href="https://default-company.myezyaccess.com/Patient/Main.aspx" target="_blank" rel="noopener noreferrer">Go To Portal!</a>
            </ul>
          </div>
        ))}
      </div>
      <AppointmentInfo />
    </div>
  );
};

export default About;
