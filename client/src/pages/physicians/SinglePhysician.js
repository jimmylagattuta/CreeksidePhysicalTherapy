import { Link, useParams } from 'react-router-dom';
import { physicians } from '../../data';
import '../../components/helpers/ReviewsHelpers.css';

const SinglePhysician = () => {
    const { physicianId } = useParams();
    console.log('SinglePhysician physicians', physicians);

    const doctorNames = [
        'brian horak',
        'john zdor',
        'peggy loebner',
        'chad smurthwaite',
        'alex mcniven',
        'vince gonsalves',
        'hal',
        'mikayla',
        'jacqueline',
        'dixie',
        'cellina'
    ];
    

    const physician = physicians.find((item) => {
        console.log('item', item);
        const nameVariants = [
            item.name,
            item.name.toLowerCase().replace(/\s+/g, '-'),
            item.name.toLowerCase().replace(/,/g, '').replace(/\s+/g, '-'),
            item.name.toLowerCase().replace(/,/g, '').replace(/\s+/g, '')
        ];
        return nameVariants.includes(physicianId.toLowerCase());
    });

    console.log('physician', physician);

    const { bio, image, name, practiceEmphasis, specialProcedures } = physician || {};

    const cacheKey = 'cached_creekside_reviews';

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const renderPracticeEmphasisMobile = (practiceEmphasis) => {
        if (practiceEmphasis && practiceEmphasis.length > 0) {
            return (
                <div className='specialties-item'>
                    <h4>Practice Emphasis</h4>
                    <ul className='specialties-list'>
                        {practiceEmphasis.map((item, index) => (
                            <li key={index} className='specialties-list-item'>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    };

    const renderPracticeEmphasis = (practiceEmphasis) => {
        if (practiceEmphasis && practiceEmphasis.length > 0) {
            return (
                <div className='specialties-item'>
                    <h4>Practice Emphasis</h4>
                    <ul className='specialties-list'>
                        {practiceEmphasis.map((item, index) => (
                            <li key={index} className='specialties-list-item'>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    };

    const getCachedReviews = () => {
        const cachedDataBeforeJson = localStorage.getItem(cacheKey);
        if (cachedDataBeforeJson) {
            const { reviews, expiry } = JSON.parse(cachedDataBeforeJson);
            console.log('reviews', reviews);
            return reviews
                .filter((review) => !review.text.trim()) // Skip if review text is blank
                .map((review) => {
                    // Check if any doctor's name is mentioned in the review text
                    const doctorNamesLowerCase = doctorNames.map((doctor) => doctor.toLowerCase());
                    const words = review.text.toLowerCase().split(/\s+/);
                    const mentionsDoctor = doctorNamesLowerCase.some((name) => {
                        // Match any form of the name (e.g., first name, last name, or full name)
                        return name.split(' ').every((part) => words.includes(part));
                    });
    
                    console.log('doctorNamesLowerCase:', doctorNamesLowerCase);
                    console.log('words:', words);
                    console.log('mentionsDoctor:', mentionsDoctor);
    
                    // Check if the review is for the current physician
                    const physicianNameLowerCase = physician.name.toLowerCase();
                    const truncatedName = physicianNameLowerCase.split(',')[0].trim();
                    const isForPhysician = review.text.includes(truncatedName);
    
                    console.log('physicianNameLowerCase:', physicianNameLowerCase);
                    console.log('truncatedName:', truncatedName);
                    console.log('isForPhysician:', isForPhysician);
    
                    // Exclude reviews that do not mention any doctor's name or are not for the current physician
                    if (!mentionsDoctor || !isForPhysician) return null;
    
                    // Exclude reviews with certain author names
                    if (review.author_name === "Pdub ..") return null;
    
                    return (
                        <div key={review.id} className='single-review-container'>
                            <div className='review-top-info'>
                                <div
                                    className='user-icon'
                                    style={{ backgroundImage: `url(${review.profile_photo_url})` }}>
                                    {!review.profile_photo_url && (
                                        <i className='fas fa-user-circle'></i>
                                    )}
                                </div>
                                <div className='review-name-container'>
                                    <div className='user-name'>
                                        {review.author_name} <i className='fab fa-yelp'></i>
                                    </div>
                                </div>
                            </div>
                            <div className='review-info'>
                                <i className='fa fa-quote-left' aria-hidden='true'></i>
                                <i className='fa fa-quote-right' aria-hidden='true'></i>
                                <p className='review-paragraph'>{review.text}</p>
                            </div>
                            <div className='google-link'>
                                <a href={review.author_url} target="_blank" rel="noopener noreferrer">
                                    <i style={{ color: 'white' }} className="fab fa-google fa-lg"></i>
                                </a>
                            </div>
                        </div>
                    );
                }).filter(Boolean); // Remove any null values from the array
        }
        return null;
    };
    
    
    
    

    return (
        <>
            <div style={{ padding: '50px', margin: '0 auto', display: 'flex' }}>
                <div className='page-grid-single-physician'>
                    <div className='physician-left'>
                        <div className='physician-image'>
                            <img src={image} alt={name} />
                        </div>
                    </div>
                    <div className='physician-right'>
                        <h5 className='physician-name'>{name}</h5>
                        {bio && bio.map((item, index) => (
                            <div key={index}>
                                {index > 0 && <div className='popout-content'><p className='page-description'>{item}</p></div>}
                                {index === 0 && <p className='page-description'>{item}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='reviews-container'>
                {getCachedReviews()}
            </div>
        </>
    );
};

export default SinglePhysician;
