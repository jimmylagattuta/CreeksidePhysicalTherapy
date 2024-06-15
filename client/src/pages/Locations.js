import React, { useRef, useEffect } from 'react';
import PagesHeader from '../components/PagesHeader';
import { Link } from 'react-router-dom';
import MapContainer from '../components/googleMapReact/MapContainer';
import ChatBox from './../components/helpers/ChatBox';
const Locations = () => {
    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (window.location.hash === '#chatbox') {
            setTimeout(() => {
                chatBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }, []);
    
    return (
        <>
            <PagesHeader title='Locations' />;
            <div className='page-container'>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} className='page-info'>
                    <h3 style={{ alignSelf: 'baseline' }}>
                    Creekside Physical Therapy proudly serves patients throughout the Portland Metro area from conveniently located offices above the Providence Medical Group Cedar Mill Clinic and on Oleson Road. If you’re eager to get back on your feet and back to doing what you love, complete our contact form or call us at 971-300-0690.
                    </h3>
                </div>
            </div>
            <div className='location-map-section'>
                <MapContainer />
            </div>
            <div ref={chatBoxRef} style={{ display: 'flex', justifyContent: 'center', padding: "110px 0px 45px 0px" }}>
                <ChatBox />
            </div>
        </>
    );
};

export default Locations;
