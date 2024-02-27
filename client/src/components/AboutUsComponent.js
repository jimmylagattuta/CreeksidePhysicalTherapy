import { Link, NavLink } from 'react-router-dom';
import './helpers/AboutUsComponent.css'

const AboutUsComponent = () => {
    const handleLearnMoreClick = () => {
        // Replace 'your-url-here' with the actual URL you want to open
        window.open('your-url-here', '_blank');
    };

    return (
        <div className='about-container'>
            <div className='about-container-top'>
                <h1 className='about-title'>Creekside Physical Therapy </h1>
                <p className='about-description'>
                    Creekside Physical Therapy is committed to providing the highest quality of orthopaedic care possible. Along with the treatment of immediate or chronic problems, we strive to integrate the doctrine of prevention in all our treatment plans as a way to alleviate potential future difficulties. It is the goal of Creekside Physical Therapy  and its employees to provide high quality, sensitive care to each and every patient, family member and/or friend we come in contact with. We fully understand and furthermore take very seriously the trust our patients put in our hands. We are committed to devoting ourselves to kindness and consideration when interacting with our patients, their family members and friends. We are pleased to have you as a patient. If you have any questions, always feel free to contact our office and our trained staff will assist you in any way possible.
                </p>
            </div>
            <div className='about-container-bottom'>
                <img alt="bottom left container" className='about-container-bottom-left'
                />
                <div className='about-container-bottom-right'>
                <h2 className='about-title-right'>
                    Creekside Physical Therapy Patient Portal
                </h2>
                <p className='about-description-right'>
                    Creekside Physical Therapy  is pleased to introduce the <a className="animate-grow" href="https://oar.myezyaccess.com/Patient/Main.aspx" target="_blank" rel="noopener noreferrer">Creekside Physical Therapy Patient Portal!</a> The Patient Portal is an electronic system that will allow you, our patients, to communicate your medical needs with our office staff and provide
                <p className='about-description-right'>
                    To join the Patient Portal, call the office and provide our staff with your email address. Then, log on to OAR’s Patient Portal to access our patient features.
                </p>
                </p>

                <p className='about-description-right'>
                    <ul>
                        <li>
                            Expedite your check-in process by completing New Patient Forms online
                        </li>
                    </ul>
                </p>
                <p className='about-description-right'>
                    <ul>
                        <li>
                            Tired of waiting on hold? Schedule your appointments, order medical records, and request prescription refills electronically
                        </li>
                    </ul>
                </p>
                <p className='about-description-right'>
                    <ul>
                        <li>
                            Update your medical history and pay bills from the privacy of your home
                        </li>
                    </ul>
                </p>
                <p className='about-description-right'>
                    <ul>
                        <li>
                            Verify your insurance eligibility and review your benefits prior to your appointment
                        </li>
                    </ul>
                </p>
                
                <div className='about-right-button'>
                    {/* Add onClick event */}
                    <button className='btn header-button-white' onClick={handleLearnMoreClick}>
                        Learn More
                    </button>
                </div>

                </div>
            </div>
        </div>
    );
};

export default AboutUsComponent;
