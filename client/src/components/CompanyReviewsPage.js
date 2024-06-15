import React, { useEffect, useState, useRef } from 'react';
import { useCsrfToken } from './CsrfTokenContext';
import './helpers/ReviewsHelpers.css';

const CompanyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { csrfToken, setCsrfToken } = useCsrfToken();
    const previousCsrfToken = useRef(csrfToken);

    const defaultProfilePhotoUrls = [
        'https://lh3.googleusercontent.com/a/ACg8ocLIudbeWrIiWWZp7p9ibYtGWt7_t2sZhu3GhVETjeORZQ=s128-c0x00000000-cc-rp-mo',
        // ... (other URLs)
    ];

    useEffect(() => {
        const cacheKey = 'cached_creekside_reviews';

        const getFilteredReviews = (reviewList) => {
            if (!Array.isArray(reviewList)) return [];
            return reviewList.filter(
                (review) => review.text && !defaultProfilePhotoUrls.includes(review.profile_photo_url)
            );
        };

        const getCachedReviews = () => {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                const { reviews, expiry } = JSON.parse(cachedData);
                if (expiry > Date.now()) {
                    return reviews;
                } else {
                    localStorage.removeItem(cacheKey);
                }
            }
            return null;
        };

        const saveToCache = (data) => {
            const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
            const cacheData = { reviews: data, expiry };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        };

        const fetchReviews = () => {
            const url =
                process.env.NODE_ENV === 'production'
                    ? 'https://www.creeksidephysicaltherapy.com/api/v1/pull_google_places_cache'
                    : 'http://localhost:3001/api/v1/pull_google_places_cache';

            const headers = {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            };

            fetch(url, { headers })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to fetch reviews');
                    }
                })
                .then((data) => {
                    if (Array.isArray(data.creekside_reviews) && Array.isArray(data.northwest_reviews)) {
                        if (data.csrf_token && data.csrf_token !== previousCsrfToken.current) {
                            setCsrfToken(data.csrf_token);
                            previousCsrfToken.current = data.csrf_token;
                        }

                        const creeksideReviews = getFilteredReviews(data.creekside_reviews);
                        const northwestReviews = getFilteredReviews(data.northwest_reviews);

                        const combinedReviews = [...creeksideReviews, ...northwestReviews];
                        const shuffledReviews = shuffleArray(combinedReviews);
                        const randomReviews = shuffledReviews.slice(0, 3);

                        saveToCache(combinedReviews);
                        setReviews(randomReviews);
                        setLoading(false);
                    } else {
                        throw new Error('Data reviews are not arrays');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setError(err.message);
                    setLoading(false);
                });
        };

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const cachedReviews = getCachedReviews();
        if (cachedReviews) {
            setReviews(cachedReviews.slice(0, 3));
            setLoading(false);
        } else {
            fetchReviews();
        }
    }, [csrfToken, setCsrfToken]);

    if (loading) return <div className='loading'><p>Loading reviews...</p></div>;
    if (error) return <div className='error'><p>Error: {error}</p></div>;

    return (
        <div className='reviews-container'>
            {reviews.map((item, index) => {
                if (!item.text.trim()) return null;

                let profilePhotoUrl = item.profile_photo_url || defaultProfilePhotoUrls[index % defaultProfilePhotoUrls.length];
                if (item.author_name === "CoCo DeLuxe") {
                    profilePhotoUrl = defaultProfilePhotoUrls[index % defaultProfilePhotoUrls.length];
                }

                return (
                    <div key={index} className='single-review-container'>
                        <div className='review-top-info'>
                            <div
                                className='user-icon'
                                style={{
                                    backgroundImage: `url(${profilePhotoUrl})`,
                                }}>
                                {!item.profile_photo_url && (
                                    <i className='fas fa-user-circle'></i>
                                )}
                            </div>
                            <div className='review-name-container'>
                                <div className='user-name'>
                                    {item.author_name}{' '}
                                    <i className='fab fa-yelp'></i>
                                </div>
                            </div>
                        </div>
                        <div className='review-info'>
                            <i className='fa fa-quote-left' aria-hidden='true'></i>
                            <i className='fa fa-quote-right' aria-hidden='true'></i>
                            <p className='review-paragraph'>{item.text}</p>
                        </div>
                        <div className='google-link'>
                            <a aria-label="Link to Google for Google API reviews for Creekside Physical Therapy." href={item.author_url} target="_blank" rel="noopener noreferrer">
                                <i style={{ color: 'white' }} className="fab fa-google fa-lg"></i>
                            </a>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CompanyReviewsPage;
