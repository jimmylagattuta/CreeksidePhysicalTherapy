import React, { useState, useEffect } from 'react';
import ExpertiseBlocks from '../components/ExpertiseBlocks';
import { Link } from 'react-router-dom';
import ReactBackgroundCarousel from '../components/Carousel';
import CompanyReviewsPage from '../components/CompanyReviewsPage';
import AboutUsComponent from '../components/AboutUsComponent';
import TeamComponent from './lazyHome/TeamComponent';
import LocationComponent from './lazyHome/LocationComponent';
import MapContainer from '../components/googleMapReact/MapContainer';
import './helpers/Home.css';
import '../components/helpers/Carousel.css';

const Home = () => {
    const [firstImageLoaded, setFirstImageLoaded] = useState(false);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        const firstImage = new Image();
        firstImage.src = 'https://i.imgur.com/KRQMs5L.webp';
        firstImage.onload = () => {
            setFirstImageLoaded(true);
        };
        return () => {
            firstImage.onload = null;
        };
    }, []);

    useEffect(() => {
        const mapTimeout = setTimeout(() => {
            setShowMap(true);
        }, 1500);

        return () => clearTimeout(mapTimeout);
    }, []);

    const renderMapContainer = () => {
        if (showMap) {
            return <MapContainer />;
        }
        return <p>Loading map...</p>;
    };

    const handleRequestAppointmentClick = () => {
        window.open('https://default-company.myezyaccess.com/Patient/Main.aspx?AspxAutoDetectCookieSupport=1', '_blank');
    };

    return (
        <main style={{ overflowX: 'hidden', maxWidth: '100%' }} className='main-content'>
            <div className='home-hero'>
                <div className='home-banner'>
                    <div className="banner-title-container">
                        <h1 style={{ color: 'white', textShadow: '1px 1px 6px black' }} className='banner-title'>
                            {" "}INDIVIDUALIZED{" "}
                        </h1>
                        <h1 style={{ color: 'white', textShadow: '1px 1px 6px black' }} className='banner-title'>
                            {" "}{" "}
                        </h1>
                        <h1 style={{ color: 'white', textShadow: '1px 1px 6px black' }} className='banner-title'>
                            {" "}CARE{" "}
                        </h1>
                    </div>
                    <p style={{ color: 'white', textShadow: '1px 1px 6px black' }} className='banner-description'>
                        To Get You Moving At Your Best
                    </p>
                    <div className='banner-buttons'>
                        <div className='button-wrapper'>
                            <Link
                                className='btn header-button-yellow'
                                to={{ pathname: '/locations', hash: '#chatbox' }}
                            >
                                Request Appointment
                                <i id="banner-btn-arrow" className="fas fa-long-arrow-alt-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='Carousel-container'>
                    <ReactBackgroundCarousel>
                        <div className='carousel-img'>
                            <img
                                src='https://i.imgur.com/KRQMs5L.webp'
                                alt='img1'
                                loading='eager'
                                style={{ height: '100%', width: '100%' }}
                            />
                        </div>
                        <div className='carousel-img'>
                            <img
                                src='https://i.imgur.com/hl6j14o.webp'
                                alt='img2'
                                loading='lazy'
                                style={{ height: '100%', width: '100%' }}
                            />
                        </div>
                        <div className='carousel-img'>
                            <img
                                src='https://i.imgur.com/qeHdPfp.webp'
                                alt='img3'
                                loading='lazy'
                                style={{ height: '100%', width: '100%' }}
                            />
                        </div>
                        <div className='carousel-img'>
                            <img
                                src='https://i.imgur.com/pErxD82.webp'
                                alt='img4'
                                loading='lazy'
                                style={{ height: '100%', width: '100%' }}
                            />
                        </div>
                        <div className='carousel-img'>
                            <img
                                src='https://i.imgur.com/ECpdKat.webp'
                                alt='img5'
                                loading='lazy'
                                style={{ height: '100%', width: '100%' }}
                            />
                        </div>
                    </ReactBackgroundCarousel>
                </div>
            </div>
            <AboutUsComponent />
            <div className='home-expertise'>
                <h2 className='section-title'>Explore Our Services</h2>
                <i className='fas fa-th'></i>
                <ExpertiseBlocks />
            </div>
            <TeamComponent />
            <LocationComponent />
            <div className='home-map'>
                {renderMapContainer()}
            </div>
            <div className='home-reviews'>
                <CompanyReviewsPage />
            </div>
        </main>
    );
};

export default Home;
