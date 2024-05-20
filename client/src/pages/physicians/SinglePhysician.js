import { Link, useParams } from 'react-router-dom';
import { physicians } from '../../data';
import '../../components/helpers/ReviewsHelpers.css';
const SinglePhysician = () => {
    const { physicianId } = useParams();
    console.log('SinglePhyscian physicians', physicians);
    const physician = physicians.find((item) => {
        console.log('item', item);
        const [firstName, ...otherNames] = item.name.split(' ');
        const lastName = otherNames.length > 0 ? otherNames.join(' ').replace(/\s/g, '-') : ''; // Replace spaces with hyphens
        const fullName = `${firstName}${lastName ? `-${lastName}` : ''}`.toLowerCase();
        return fullName === physicianId;
    });
    
    console.log('physician', physician);
    const doctors = [
        'Default Doctor 1',
        'Default Doctor 2',
        'Default Doctor 3',
        'Default Doctor 4',
        'Default Doctor 5',
        'Default Doctor 6',
        'Default Doctor 7'
    ];
    const { bio, image, name, practiceEmphasis, specialProcedures } = physician;
    const cacheKey = 'cached_creekside_reviews';
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
            date
        );

        return formattedDate;
    };
    const renderPracticeEmphasisMobile = (practiceEmphasis) => {
        if (practiceEmphasis && practiceEmphasis.length > 0) {
            return (
                <div className='specialties-item'>
                    <h4>Practice Emphasis</h4>
                    <ul className='specialties-list'>
                        {practiceEmphasis.map((item, index) => {
                            return (
                                <li key={index} className='specialties-list-item'>
                                    {item}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        }
    }
    const renderPracticeEmphasis = (practiceEmphasis) => {
        if (practiceEmphasis && practiceEmphasis.length > 0) {
            return (
                <div className='specialties-item'>
                    <h4>Practice Emphasis</h4>
                    <ul className='specialties-list'>
                        {practiceEmphasis.map((item, index) => {
                            return (
                                <li key={index} className='specialties-list-item'>
                                    {item}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        }
    }
    const getCachedReviews = () => {
        const cachedDataBeforeJson = localStorage.getItem(cacheKey);
        if (cachedDataBeforeJson) {
            const { reviews, expiry } = JSON.parse(cachedDataBeforeJson);
    
            return reviews.map((review, index) => {
                // Check if any doctor's name is mentioned in the review text
                console.log('review CPT', review);
                const doctorNames = doctors.map((doctor) => doctor.toLowerCase().replace("dr. ", ""));
                const mentionsDoctor = doctorNames.some((name) => review.text.toLowerCase().includes(name));
    
                // Exclude reviews that do not mention any doctor's name
                if (!mentionsDoctor) return null;
    
                // Exclude reviews with certain author names
                if (review.author_name === "Pdub ..") return null;
    
                return (
                    <div key={index} className='single-review-container'>
                        <div className='review-top-info'>
                            <div
                                className='user-icon'
                                style={{
                                    backgroundImage: `url(${review.profile_photo_url})`,
                                }}>
                                {!review.profile_photo_url && (
                                    <i className='fas fa-user-circle'></i>
                                )}
                            </div>
                            <div className='review-name-container'>
                                <div className='user-name'>
                                    {review.author_name}{' '}
                                    <i className='fab fa-yelp'></i>
                                </div>
                            </div>
                        </div>
                        <div className='review-info'>
                            <i
                                className='fa fa-quote-left'
                                aria-hidden='true'></i>
                            <i
                                className='fa fa-quote-right'
                                aria-hidden='true'></i>
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
                        {bio.map((item, index) => {
                            return (
                                <div key={index}>
                                    {index > 0 && <div className='popout-content'><p className='page-description'>{item}</p></div>}
                                    {index === 0 && <p className='page-description'>{item}</p>}
                                </div>
                                // <p key={index} className='page-description'>
                                //     {item}
                                // </p>
                            );
                        })}

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
