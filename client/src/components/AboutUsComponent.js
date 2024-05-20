import { Link, NavLink } from 'react-router-dom';
import './helpers/AboutUsComponent.css'

const AboutUsComponent = () => {
    const handleLearnMoreClick = () => {
        // Replace 'your-url-here' with the actual URL you want to open
        window.open('/about-us', '_blank');
    };

    return (
        <div className='about-container'>
            <div class='about-container-top'>
                <h1 class='about-title'>Creekside Physical Therapy</h1>
                <p className='about-description'>
                    Our Experienced Portland Physical Therapists Provide Custom Care for Foot and Ankle Issues.
                    At Creekside Physical Therapy, we provide the individualized rehabilitation you need to return to your daily routine or resume activities like walking, running, or hiking without pain. Whether you've been suffering in silence or previously received treatment elsewhere but weren't satisfied with the results, our exceptional physical therapists and exercise specialists can help.

                    Take the first step in your journey to improved foot and ankle health: Contact us now to schedule an appointment with one of our expert physical therapists.
                </p>
            </div>
            <div className='about-container-bottom'>
                <img aria-label="bottom left container" className='about-container-bottom-left'/>
                <div className='about-container-bottom-right'>
                    <h2 className='about-title-right'>
                        Portland's Foot and Ankle Rehabilitation Experts
                    </h2>
                    <p className='about-description-right'>
                        Focus on foot, ankle, and lower leg injuries ensures optimal care. We assess the entire kinetic chain and develop an individualized plan to help you get back to moving your best.
                    </p>
                    <p className='about-description-right'>
                        We develop a custom rehabilitation plan for you. Whether you want to walk without pain or train for a triathlon, we'll create a treatment plan to get you there.
                    </p>
                    <p className='about-description-right'>
                        <ul>
                            <li>
                                We put patients first, prioritizing your well-being during each visit.
                            </li>
                            <li>
                                Typical sessions include interventions to decrease pain, methods for managing pain at home, and exercise to strengthen and improve your confidence with movement.
                            </li>
                            <li>
                                Your treatment plan will be based on current best practice interventions and customized to best fit your needs and goals.
                            </li>
                            <li>
                                Our therapists are trained in ASTYM, Strain-Counterstrain, Mulligan techniques, as well as therapeutic exercise prescription.
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
