import React, { useEffect, useState } from 'react';
import { useCsrfToken } from './CsrfTokenContext';
import './helpers/ReviewsHelpers.css';

const physiciansNames = [
    'Brian Horak, PT, MPT, CSCS',
    'John Zdor, PT, DPT, CCWC, OCS',
    'Peggy Loebner, Physical Therapist',
    'Chad Smurthwaite, PT, DPT',
    'Alex McNiven, PT, DPT',
    'Vince Gonsalves, PT, DPT',
    'Hal, Physical Therapy Aide',
    'Mikayla, Physical Therapy Aide',
    'Jacqueline, Physical Therapy Aide',
    'Dixie',
    'Cellina'
];

const CompanyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debug, setDebug] = useState(false); // Debug flag to toggle logs

    const logDebug = (message, ...optionalParams) => {
        if (debug) {
            console.log(message, ...optionalParams);
        }
    };

    const isCreeksideMentioned = (text) => {
        const creeksideRegex = /\bcreekside\b/i;
        return creeksideRegex.test(text);
    };

    const isNorthwestMentioned = (text) => {
        const northwestRegex = /\bnorthwest\b/i;
        return northwestRegex.test(text);
    };

    const isDoctor = (name) => {
        return physiciansNames.some(doctor => name.toLowerCase().includes(doctor.toLowerCase()));
    };

    useEffect(() => {
        const cacheKey = 'cached_google_reviews';

        const getCachedReviews = () => {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                const { reviews, expiry } = JSON.parse(cachedData);
                if (expiry > Date.now()) {
                    return JSON.parse(reviews);
                } else {
                    localStorage.removeItem(cacheKey); // Remove expired cache
                }
            }
            return null;
        };

        const saveToCache = (data) => {
            const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // Cache for 7 days
            const cacheData = JSON.stringify({ reviews: data, expiry });
            localStorage.setItem(cacheKey, cacheData);
        };

        const fetchReviews = () => {
            const url = process.env.NODE_ENV === 'production'
                ? 'https://creekside-physical-therapy-3c43d5dad481.herokuapp.com/api/v1/pull_google_places_cache'
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
                        if (data.csrf_token) {
                            setCsrfToken(data.csrf_token);
                        }

                        const allReviews = [...data.creekside_reviews, ...data.northwest_reviews];

                        // Filter reviews
                        const filteredReviews = allReviews.filter(review => {
                            const text = review.text.toLowerCase();
                            const authorName = review.author_name.toLowerCase();
                            const hasCreekside = isCreeksideMentioned(text) || isDoctor(review.author_name);
                            const hasNorthwest = isNorthwestMentioned(text);

                            return hasCreekside || (!hasNorthwest && isDoctor(authorName));
                        });

                        // Shuffle the filteredReviews array
                        const shuffledReviews = shuffleArray(filteredReviews);

                        // Take the first three reviews
                        const randomReviews = shuffledReviews.slice(0, 3);

                        saveToCache(randomReviews);
                        setReviews(randomReviews);
                        setLoading(false);
                    } else {
                        throw new Error('Data.reviews is not an array');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setError(err.message);
                    setLoading(false);
                });
        };

        // Function to shuffle an array using the Fisher-Yates algorithm
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        const cachedReviews = getCachedReviews();
        if (cachedReviews) {
            setReviews(cachedReviews);
            setLoading(false);
        } else {
            fetchReviews();
        }
    }, [csrfToken, setCsrfToken]);

    return (
        <div className='reviews-container'>
            {reviews.map((item, index) => {
                let profilePhotoUrl = item.profile_photo_url || defaultProfilePhotoUrls[index % defaultProfilePhotoUrls.length];
                // Check if the username is "CoCo DeLuxe" and replace the profile photo URL with the default if true
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
                            <i
                                className='fa fa-quote-left'
                                aria-hidden='true'></i>
                            <i
                                className='fa fa-quote-right'
                                aria-hidden='true'></i>
                            <p className='review-paragraph'>{item.text}</p>
                        </div>
                        <div className='google-link'>
                            <a aria-label="Link to Google for Google API reviews for Company Default." href={item.author_url} target="_blank" rel="noopener noreferrer">
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
