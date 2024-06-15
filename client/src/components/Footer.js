import { expertiseBlocks, physicians, locations } from '../data';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='main-footer'>
            <div className='container'>
                <div className='footer-grid'>
                    <div className='footer-item word-wrap-container'>
                        <Link
                            to='/'
                        >
                            <div className='footer-word-wrap'>Creekside Physical Therapy</div>
                        </Link>
                    </div>
                    <div className='footer-item'>
                        <Link
                            className='footer-link'
                            to='/about-us/privacy-policy'
                        >
                            PRIVACY
                        </Link>
                    </div>
                    <div className='footer-item'>
                        <Link
                            className='footer-link'
                            to='/about-us/privacy-policy'
                        >
                            TERMS & CONDITIONS
                        </Link>
                    </div>
                    <div className='footer-item'>
                        <Link
                            className='footer-link'
                            to='/locations'
                        >
                            ACCESSIBILITY
                        </Link>
                    </div>
                    <div className='footer-item'>
                        <Link
                            className='footer-link'
                            to={{ pathname: '/locations', hash: '#chatbox' }}
                        >
                            CONTACT US
                        </Link>
                    </div>
                    <div className="footer-item">
                        <a 
                            href="https://www.healowpay.com/HealowPay/jsp/healow/login.jsp" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn header-button-yellow"
                            style={{ backgroundColor: '#c6972d' }}
                        >
                            Pay Now
                        </a>
                    </div>
                </div>
                {/*----------------------------------------------------------------------------------------------*/}
                {/*----------------------------------------------------------------------------------------------*/}
            </div>
            <div id="h-four-temp-fix" className='footer-name'>Powered By James Lagattuta</div>
        </footer>
    );
};

export default Footer;
