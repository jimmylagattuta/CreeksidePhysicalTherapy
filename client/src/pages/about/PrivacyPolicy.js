import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { aboutExtra, aboutTerms } from '../../data';

const PrivacyPolicy = () => {
    const documentUrl = process.env.NODE_ENV === 'production' ? 'https://www.creekside-physical-therapy-3c43d5dad481.herokuapp.com/UnityMSKPrivacyPolicy.docx' : 'http://localhost:3001/UnityMSKPrivacyPolicy.docx';

    const tocRef = useRef(null);
    
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(documentUrl)}`}
        width="100%"
        height="500px"
        title="Privacy Policy"
      ></iframe>
      <div useRef={tocRef} className='terms-and-conditions'>
        <h1 style={{ padding: '40px 10px 40px 10px' }}>Terms & Conditions</h1>
        {aboutTerms && (
                    <div className='inner-content'>

                {aboutTerms.map((about, index) => {
                    return (
                        <div className='about-info'>

                            <div className='popout-content'>
                                <div className='about-grid'>
                                    {about.subtitle && (
                                        <div className='about-grid-item'>
                                            <h3 className='about-grid-title'>
                                                {about.subtitle}
                                            </h3>
                                        </div>
                                    )}                
                                    <div className='about-grid-item'>
                                        {about.body.map((content, index) => {
                                            return (
                                                <div>
                                                    {content}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}    
                </div>    
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
