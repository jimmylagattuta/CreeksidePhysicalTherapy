import React, { useEffect, useState, useRef } from 'react';
import { useCsrfToken } from './CsrfTokenContext';
import './helpers/ReviewsHelpers.css';

const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const CompanyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { csrfToken, setCsrfToken } = useCsrfToken();
    const previousCsrfToken = useRef(csrfToken);

    const companyAliases = [
        'creekside physical therapy',
        'creekside therapy',
        'creekside'
    ];

    const doctors = [
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    useEffect(() => {
        const cacheKey = 'cached_creekside_reviews';

        const isRelevantReview = (review) => {
            const normalizedText = review.text.toLowerCase();
            return (
                companyAliases.some(alias => normalizedText.includes(alias.toLowerCase())) ||
                doctors.some(doctor => normalizedText.includes(doctor.toLowerCase().replace("dr. ", "")))
            );
        };

        const getFilteredReviews = (reviewList) => {
            return reviewList.filter(
                (review) => isRelevantReview(review) &&
                    !review.text.startsWith("Absolutely horrendous") &&
                    !defaultProfilePhotoUrls.includes(review.profile_photo_url)
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
                        // Update CSRF token only if it changes
                        if (data.csrf_token && data.csrf_token !== previousCsrfToken.current) {
                            setCsrfToken(data.csrf_token);
                            previousCsrfToken.current = data.csrf_token;
                        }

                        const creeksideReviews = getFilteredReviews(data.creekside_reviews);
                        const northwestReviews = getFilteredReviews(data.northwest_reviews);

                        const combinedReviews = [
                            ...creeksideReviews,
                            ...northwestReviews
                        ];

                        const shuffledReviews = shuffleArray(combinedReviews);
                        const randomReviews = shuffledReviews.slice(0, 20); // Get the first 20 reviews

                        saveToCache(randomReviews); // Cache the selected reviews
                        setReviews(randomReviews); // Set the selected reviews
                        setLoading(false);
                    } else {
                        console.log('Data reviews are not arrays');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setError(err.message);
                    setLoading(false);
                });
        };

        const cachedReviews = getCachedReviews();
        if (cachedReviews) {
            setReviews(cachedReviews);
            setLoading(false);
        } else {
            fetchReviews();
        }
    }, [csrfToken, setCsrfToken]);

    return (
        <div className="company-reviews-page">
            <div className="top-bar-reviews">
                <h1>Company Reviews</h1>
                <h2>Reviews from Our Customers</h2>
            </div>

            <div className="company-reviews-container">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    reviews.map((review, index) => (
                        <div className="review-card" key={index}>
                            <div className="profile-photo">
                                <img
                                    src={review.profile_photo_url}
                                    alt="Profile"
                                    className="profile-photo"
                                    onError={(e) => (e.target.src = 'default_profile_photo_url')}
                                />
                            </div>
                            <div className="review-details">
                                <h3>{review.author_name}</h3>
                                <div className="rating">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <span key={i}>&#9733;</span>
                                    ))}
                                </div>
                                <p>{formatDate(review.relative_time_description)}</p>
                                <p>{review.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CompanyReviewsPage;
