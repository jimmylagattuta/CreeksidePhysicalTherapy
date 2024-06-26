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
        'https://lh3.googleusercontent.com/a/ACg8ocKWoslacgKVxr6_0nu2yNq78qvJS_JmSt-o-sm0Poz1=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocIkg86HfAMs_wSjeyDfK_T6jI0hsOa7uwPSHrvQkzxz=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocJF-8tCmJylLukUi86imkat5gT8nG4xHJuweKX0g7-T6A=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocJrHYSdRq54r0T0kNF60xZGqm58qhXVIB3ogEUkGa_e=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocKWj653OujAca153BqwYSRX18G0URD-9DV89ZYyArIET1U=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocKqelNaTWLy28Vdol7ewcw8EYyT2muaWVSjckEAamoy=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocI-UUmoZ36qdH-xNh8xlrTXv3Jx6H7QGBwXeaIa8rjT=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocKPAe4Ik_kZrxRvPsJmKD3YthHHK8mHe2VDb10mPSKP=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocKZ2tCDEg6Ehy8TRlFwuuVvvdpdRnSFfeGYRNUTq1U=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocLu8PkNc-7f1HUTNd94JtS73eJhUka5AIZucTp3Hlbw=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocLfObJkOnSt9CV8D8v_u6kTqfhrE-yQPAYjosZdlzvZ=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocLUv0B3n3yJCFDAuL2h3UzH2kExs6WQRooe_A662cMB=s128-c0x00000000-cc-rp-mo-ba2',
        'https://lh3.googleusercontent.com/a/ACg8ocJicBeMj3c-YfZSzCYTrkKfT8Z3tXIMXSNKxGwU8qim=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocLKrlJ0NBUgNt_mA6fqHxuYrVbHfYy48bb-CaVg3YQC=s128-c0x00000000-cc-rp-mo-ba3',
        'https://lh3.googleusercontent.com/a/ACg8ocKww_NJw1NmlQPCb0AodayToyOTvLxgGtcfIOPuromk=s128-c0x00000000-cc-rp-mo',
        'https://lh3.googleusercontent.com/a/ACg8ocIFg5G-JO49VMdkvA4N5IwxQ9XKjHP3HHTytStrVCI=s128-c0x00000000-cc-rp-mo'
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
                    console.log('Fetched data:', data);
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
                    console.error('Error:', err);
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
                                <div className='user-name' style={{ color: 'black' }}>
                                    {item.author_name}{' '}
                                    <i className='fab fa-yelp'></i>
                                </div>
                            </div>
                        </div>
                        <div className='review-info'>
                            <i className='fa fa-quote-left' aria-hidden='true'></i>
                            <i className='fa fa-quote-right' aria-hidden='true'></i>
                            <p className='review-paragraph' style={{ color: 'black' }}>{item.text}</p>
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
