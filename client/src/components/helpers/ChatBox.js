import React, { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { useCsrfToken } from '../CsrfTokenContext';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'react-dropdown/style.css'
import { Form, Field } from 'react-final-form';
import { Link } from 'react-router-dom';

function ChatBox(props) {
  const { csrfToken, setCsrfToken } = useCsrfToken();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheKey = 'cached_yelp_reviews';

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
  const [state, setState] = useState({
    showDropdownLocations: false,
    showDropdownNewOrReturning: false,
    titleVarLocations: 'Select a location',
    titleVarNewOrReturning: 'New or returning patient?',
    titleLocations: 'Select a location',
    titleNewOrReturning: 'New or returning patient?',
    clickShowLocations: false,
    clickShowNewOrReturning: false,
    errorFName: "",
    errorFNameShow: false,
    errorLName: "",
    errorLNameShow: false,
    errorEmail: "",
    errorEmailShow: false,
    errorPhone: "",
    errorPhoneShow: false,
    errorMessage: "",
    errorMessageShow: false,
    errorMain: "",
    errorMainShow: false,
    lastTyped: '',
    showAllErrors: false,
    phoneNumber: '',
    agreeToTerms: false,
    errorAgree: '',
    recaptchaToken: '',
    recaptchaChecked: false,
    errorRecaptcha: '',
    csrfToken: csrfToken,
    setCsrfToken: setCsrfToken
  });

  useEffect(() => {
    if (!csrfToken) {
      fetchReviews();
    }
  }, []);


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
        console.log('data **************', data);
        if (data.csrf_token) {
          setCsrfToken(data.csrf_token);
        }

        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        } else {
          throw new Error('No reviews available');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
const saveToCache = (data) => {
  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // Cache for 7 days
  const cacheData = JSON.stringify(data);
  localStorage.setItem(cacheKey, cacheData);
};
useEffect(() => {
  // Load and initialize reCAPTCHA
  const loadRecaptchaScript = () => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${process.env.REACT_APP_RECAPTCHA}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize reCAPTCHA with your site key
      window.grecaptcha.enterprise.ready(() => {
        window.grecaptcha.enterprise.execute(process.env.REACT_APP_RECAPTCHA, { action: 'submit_form' }).then((token) => {
          setState({ ...state, recaptchaToken: token });
        });
      });
    };
    document.head.appendChild(script);
  };

  loadRecaptchaScript();

  if (!csrfToken) {
    fetchReviews();
  }
}, []);
  const initializeRecaptcha = () => {
    window.grecaptcha.enterprise.ready(() => {
      window.grecaptcha.enterprise.execute(process.env.REACT_APP_RECAPTCHA, { action: 'submit_form' }).then((token) => {
        setState({ ...state, recaptchaToken: token });
      });
    });
  };
  const handleSubmitRecaptcha = (values) => {
    if (values) {
      setState({ ...state, recaptchaChecked: true, errorRecaptcha: '' });
    }
  };
  const handleAgreeChange = () => {
    setState((prevState) => ({
      ...state,
      agreeToTerms: !prevState.agreeToTerms,
    }));
  };
  const formatPhoneNumber = (value) => {
    if (value) {
      const phoneNumber = value.replace(/\D/g, '');
      const formattedPhoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      return formattedPhoneNumber;
    }
    return '';
  };
  const parsePhoneNumber = (value) => {
    if (value) {
      return value.replace(/\D/g, '');
    }
    return '';
  };
  const onSubmit = async (values) => {
    const formData = {
      ...values,
      recaptcha: state.recaptchaChecked,
      agreeToTerms: state.agreeToTerms,
    };
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://www.creeksidephysicaltherapy.com' : 'http://localhost:3001';
    try {
      const response = await fetch(`${baseUrl}/api/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(formData),
      });
      console.log('Request Headers:', response.headers);
      console.log('CSRF Token:', csrfToken);
      if (response.ok) {
        console.log('Email sent successfully');
      } else {
        console.error('Email sending failed');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };




	const renderErrorEmail = (error) => {
		if (error && state.showAllErrors) {
			return (
				<div id="error-div">
					<h8 style={{ display: 'flex', color: 'red', fontSize: '0.8rem', padding: '0rem', margin: '0rem' }}>
						{error}
					</h8>
				</div>
			)
		}
	}
	const renderErrorPhone = (error) => {
		if (error && state.showAllErrors) {
			return (
				<div id="error-div">
					<h8 style={{ display: 'flex', color: 'red', fontSize: '0.8rem', padding: '0rem', margin: '0rem' }}>
						{error}
					</h8>
				</div>
			)
		}
	}

	const renderErrorFName = (error) => {
		if (error && state.showAllErrors) {
			return (
				<div id="error-div">
					<h8 style={{ display: 'flex', color: 'red', fontSize: '0.8rem', padding: '0rem', margin: '0rem' }}>
						{error}
					</h8>
				</div>
			)
		}
	}
	const renderErrorLName = (error) => {
		if (error && state.showAllErrors) {

			return (
				<div id="error-div">
					<h8 style={{ display: 'flex', color: 'red', fontSize: '0.8rem', padding: '0rem', margin: '0rem' }}>
						{error}
					</h8>
				</div>
			)
		}
	}
	const renderErrorLocations = (error) => {
		if (error && state.showAllErrors) {
			return (
				<div id="error-div">
					<h8 style={{ display: 'flex', color: 'red', fontSize: '0.9rem', padding: '0rem', margin: '0rem' }}>
						{error}
					</h8>
				</div>
			)
		}
	}
	const renderErrorNewOrReturning = (error) => {
		if (error && state.showAllErrors) {
			return (
				<div id="error-div">
					<h8 style={{ display: 'flex', color: 'red', fontSize: '0.9rem', padding: '0rem', margin: '0rem' }}>
						{error}
					</h8>
				</div>
			)
		}
	}
	const renderErrorMessage = (error) => {
		if (error && state.showAllErrors) {
			return (
				<div id="error-div">
					<h8 style={{ display: 'flex', color: 'red', fontSize: '0.8rem', padding: '0rem', margin: '0rem' }}>
						{error}
					</h8>
				</div>
			)
		}
	}
	const renderErrorRecaptcha = (error) => {
		if (error && state.showAllErrors) {
			return (
				<div id="error-div">
					<h8 style={{ display: 'flex', color: 'red', fontSize: '0.8rem', padding: '0rem', margin: '0rem' }}>
						{error}
					</h8>
				</div>
			)
		}
	}
	const renderErrorAgree = (error) => {
		if (error && state.showAllErrors) {
			return (
				<div id="error-div">
					<h8 style={{ display: 'flex', color: 'red', fontSize: '0.8rem', padding: '0rem', margin: '0rem' }}>
						{error}
					</h8>
				</div>
			)
		}
	}
	const renderErrorMain = (error) => {
		if (error && state.showAllErrors) {
			return (
				<div id="error-div">
					<h8 style={{ display: 'flex', color: 'red', fontSize: '0.8rem', padding: '0rem', margin: '0rem' }}>
						{error}
					</h8>
				</div>
			)
		}
	}

  const renderBorderFName = (errors) => {
    if (!errors.fName || !state.showAllErrors) {
      return "field-id";
    } else {
      return "field-id-red";
    }
  };

  const renderBorderLName = (errors) => {
    if (!errors.lName || !state.showAllErrors) {
      return "field-id";
    } else {
      return "field-id-red";
    }
  };

  const renderBorderEmail = (errors) => {
    if (!errors.email || !state.showAllErrors) {
      return "field-id";
    } else {
      return "field-id-red";
    }
  };

  const renderBorderPhone = (errors) => {
    if (!errors.phone || !state.showAllErrors) {
      return "field-id";
    } else {
      return "field-id-red";
    }
  };

  const renderBorderMessage = (errors) => {
    if (!errors.message || !state.showAllErrors) {
      return "field-id";
    } else {
      return "field-id-red";
    }
  };


  const renderSendButton = (values, errors, form) => {
    if (
      values.fName ||
      values.lName ||
      values.email ||
      values.phone ||
      values.message ||
      state.recaptchaChecked ||
      state.agreeToTerms
    ) {
      if (Object.keys(errors).length === 0) {
        return (
          <button
            id="chat-box-button-ready"
            onClick={(e) => {
              e.preventDefault();
              onSubmit(values);
              document.getElementById("chat-middle-component").style.opacity = '0%';
              document.getElementById("chatbox-div").style.backgroundColor = 'rgba(105,116,146, 40%)';
              document.getElementById("chatbox-div").style.opacity = '0%';
			        document.getElementById("chat-box-button-ready").style.opacity = '0%';
              setTimeout(() => {
                form.reset();
              }, 3000);

              // !!!!!
              // document.getElementById("giant icon guy")
              // !!!!!
            }}
            type="submit"
          >
            SEND
          </button>
        );
      } else {
        return (
          <button
            id="chat-box-button-blue"
            onClick={(e) => {
              setState({ ...state, showAllErrors: true });
              e.preventDefault();
            }}
            type="submit"
          >
            SEND
          </button>
        );
      }
    } else {
      return (
        <button
          id="chat-box-button"
          onClick={(e) => {
            e.preventDefault();
          }}
          type="submit"
        >
          SEND
        </button>
      );
    }
  };
  // ... (other render functions)

  return (
    <Form
      validate={(values) => {
        const errors = {};
        let newObject = [];

        if (!values.fName) {
          errors.fName = "First Name is empty";
        } else if (values.fName.length > 20) {
          errors.fName = "First Name is too long";
        } else if (!/^[a-z]+$/i.test(values.fName)) {
          errors.fName = "First Name can only contain letters";
        }

        if (!values.lName) {
          errors.lName = "Last Name is empty";
        } else if (values.lName.length > 30) {
          errors.lName = "Last Name is too long";
        } else if (!/^[a-z]+$/i.test(values.lName)) {
          if (!values.lName.includes("-")) {
            errors.lName = "Last Name can only contain letters";
          }
        }

        if (!values.email) {
          errors.email = "Email is empty";
        } else if (values.email.length > 40) {
          errors.email = "Email is too long";
        } else if (!values.email.includes('@')) {
          errors.email = "Please enter a valid email format";
        }

        if (!values.phone) {
          errors.phone = "Phone is empty";
        }

        if (!state.agreeToTerms) {
          errors.agree = 'Please Agree To Terms & Conditions';
        }

        if (!values.message) {
          errors.message = "Message is empty";
        } else if (values.message.length > 2000) {
          errors.message = "Message is too long";
        }

        if (!state.recaptchaChecked) {
          errors.recaptcha = "Please Prove You're Not A Robot";
        }

        return errors;
      }}
      onSubmit={onSubmit}
      render={({ props, handleSubmit, values, errors, form }) => (
        <form
          className='popout-content'
          style={{
            display: 'flex',
            maxWidth: '80%',
            flexDirection: 'column',
            backgroundColor: 'white',
          }}
          onSubmit={handleSubmit}>
          <p style={{ fontWeight: '400', letterSpacing: '0.05rem', alignSelf: 'center', fontSize: '0.8rem', fontFamily: 'sans-serif', paddingTop: '10px' }}>CONTACT US</p>
          <h2 style={{ fontWeight: '400', letterSpacing: '0.01rem', alignSelf: 'center', fontFamily: 'sans-serif', padding: '10px 5px 0px 5px', marginBottom: '0px' }}>Send A Message To Creekside Physical Therapy</h2>
          <p style={{ fontWeight: '400', alignSelf: 'center', fontSize: '0.9rem', padding: '10px 10px 0px 10px', maxWidth: '90%' }}>If you have any questions, concerns, or comments regarding Creekside Physical Therapy, please fill out the short contact form below.</p>

          <div style={{ maxWidth: '90%', alignSelf: 'center', padding: '10px 10px 0px 10px' }} id="chatbox-div">
            <div id="chat-middle-component">
              <div id="middle-form-top-div">
                <div id="chat-form-top-div">
                  <div id="chat-form-inner-div">
                    <div id="chat-form-lines">
                      <Field
                        key="fNameKey"
                        id={renderBorderFName(errors)}
                        style={{ borderRadius: '10px' }}
                        name="fName"
                        component="input"
                        placeholder="First Name"
                      />
                      <div style={{ marginBottom: '0.3rem' }}>
                        {renderErrorFName(errors.fName)}
                      </div>
                    </div>
                    <div id="chat-form-lines">
                      <Field
                        key="lNameKey"
                        id={renderBorderLName(errors)}
                        style={{ borderRadius: '10px' }}
                        name="lName"
                        component="input"
                        placeholder="Last Name"
                      />
                      <div style={{ marginBottom: '0.3rem' }}>
                        {renderErrorLName(errors.lName)}
                      </div>
                    </div>
                    <div id="chat-form-lines">
                      <Field
                        key="emailKey"
                        id={renderBorderEmail(errors)}
                        style={{ borderRadius: '10px' }}
                        name="email"
                        component="input"
                        placeholder="Email address"
                      />
                      <div style={{ marginBottom: '0.3rem' }}>
                        {renderErrorEmail(errors.email)}
                      </div>
                    </div>
                    <div id="chat-form-lines">
                      <Field
                        id={renderBorderPhone(errors)}
                        style={{ padding: '0.5rem', borderRadius: '10px' }}
                        type="tel" // Use type="tel" for phone numbers
                        name="phone"
                        component="input"
                        placeholder="(•••) ••• ••••"
                        parse={parsePhoneNumber} // Parse the phone number
                        format={formatPhoneNumber} // Format the phone number
                      />
                      <div style={{ marginBottom: '0.3rem' }}>
                        {renderErrorPhone(errors.phone)}
                      </div>
                    </div>
                  </div>
                  {renderErrorMain(state.errorMain)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }} id="chat-middle-component">
              <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
                <Field id={renderBorderMessage(errors)} style={{ resize: 'none', border: 'none', borderRadius: '10px 10px 10px 10px', backgroundColor: "rgba(192,200,200, 25%)", zIndex: '10', width: '90%', padding: '0.5rem 0.5rem 0rem 0.5rem' }} name="message" component="textarea" rows="5" placeholder="Comments" />
                {renderErrorMessage(errors.message)}
              </div>
              <div style={{ displa: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <div id="terms-and-policy">
                    <label>
                      <input
                        type="checkbox"
                        name="terms"
                        style={{ transform: 'scale(2)' }}
                        checked={state.agreeToTerms}
                        onChange={handleAgreeChange}
                      />
                    </label>
                  </div>
                  <div id="terms-and-policy">
                    By clicking I understand and agree that any information submitted will be forwarded to our office by email and not via a secure messaging system. This form should not be used to transmit private health information, and we disclaim all warranties with respect to the privacy and confidentiality of any information submitted through this form.
                  </div>
                </div>
                <div style={{ marginBottom: '0.3rem' }}>
                  {renderErrorAgree(errors.agree)}
                </div>
              </div>
              <ReCAPTCHA
                className='g-recaptcha'
                sitekey={process.env.REACT_APP_RECAPTCHA} // Use the environment variable
                onChange={handleSubmitRecaptcha}
                asyncScriptOnLoad={(response) => {
                  console.log('response', response);
                }}
              />
              <div style={{ marginBottom: '0.3rem' }}>
                {renderErrorRecaptcha(errors.recaptcha)}
              </div>
            </div>
          </div>
          {renderSendButton(values, errors, form)}
        </form>
      )}
    />
  );
}

export default ChatBox;  