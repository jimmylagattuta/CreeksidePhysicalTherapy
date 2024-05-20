import { Link } from 'react-router-dom';
import { physicians } from '../../data';

// Function to create a URL-friendly version of the name
const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
};

const Physicians = () => {
    console.log('physicians', physicians);
    return (
        <div className='page-container'>
            <div className='physician-header'>
                <h1 className='main-page-title'>Meet Our Physicians</h1>
                <p className='main-page-description'>
                    Located in Cityville, Metropolis, Springfield, Laketown, Hilldale, Rivercity, Greenville, and Eastwood
                </p>
            </div>
            <div className='page-grid'>
                {physicians.map((physician) => {
                    const slug = generateSlug(physician.name);
                    return (
                        <div style={{ boxShadow: "6px 6px 8px #ddd" }} className='grid-item' key={physician.name}>
                            <div className='image-container'>
                                <Link
                                    className='physician-link'
                                    to={`/providers/${slug}`}
                                >
                                    <img
                                        src={physician.imageMedium}
                                        alt={physician.name}
                                        className='grid-image'
                                    />
                                </Link>
                            </div>
                            <Link
                                className='physician-link'
                                to={`/providers/${slug}`}
                            >
                                <h5 className='physician-name'>{physician.name}</h5>
                            </Link>
                            <Link
                                className='physician-link'
                                to={`/providers/${slug}`}
                            >
                                Read Bio
                                <i className='fas fa-arrow-right physician-bio-icon'></i>
                            </Link>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Physicians;
