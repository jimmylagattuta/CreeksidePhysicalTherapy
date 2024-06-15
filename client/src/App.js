import { Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Locations from './pages/Locations';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/about/About';
import Error from './pages/Error';
import SingleAbout from './pages/about/SingleAbout';
import AboutLayout from './pages/about/AboutLayout';
import PhysiciansLayout from './pages/physicians/PhysiciansLayout';
import SinglePhysician from './pages/physicians/SinglePhysician';
import Physicians from './pages/physicians/Physicians';
import Services from './pages/services/Services';
import ServicesLayout from './pages/services/ServicesLayout';
import SingleService from './pages/services/SingleService';
import { navMenu } from './data';

// Helper function to generate slugs
const generateSlug = (name) => encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));

// Extract valid slugs for physicians and services
const validPhysicianSlugs = navMenu
    .find(item => item.menu === 'Providers')
    .subMenuItems.map(name => generateSlug(name));

const validServiceSlugs = navMenu
    .find(item => item.menu === 'Foot and Ankle Rehab')
    .subMenuItems.map(name => generateSlug(name))
    .concat(
        navMenu.find(item => item.menu === 'Orthopedic Rehab')
            .subMenuItems.map(name => generateSlug(name))
    );

console.log('Valid Physician Slugs:', validPhysicianSlugs);
console.log('Valid Service Slugs:', validServiceSlugs);

// Helper function to check if slug is valid
const isValidSlug = (slug, validSlugs) => {
    const decodedSlug = decodeURIComponent(slug);
    console.log('Checking slug:', decodedSlug);
    return validSlugs.includes(decodedSlug);
};

// Helper component to handle dynamic routing for physicians
const PhysicianRoute = () => {
    const { physicianSlug } = useParams();
    const decodedSlug = decodeURIComponent(physicianSlug);
    console.log('Physician Route Slug:', decodedSlug);

    if (isValidSlug(decodedSlug, validPhysicianSlugs)) {
        return <SinglePhysician slug={decodedSlug} />;
    } else {
        console.warn('Invalid Physician Slug:', decodedSlug);
        return <Navigate to="/providers" replace />;
    }
};

// Helper component to handle dynamic routing for services
const ServiceRoute = () => {
    const { serviceSlug } = useParams();
    const decodedSlug = decodeURIComponent(serviceSlug);
    console.log('Service Route Slug:', decodedSlug);

    if (isValidSlug(decodedSlug, validServiceSlugs)) {
        return <SingleService slug={decodedSlug} />;
    } else {
        console.warn('Invalid Service Slug:', decodedSlug);
        return <Navigate to="/services" replace />;
    }
};

function App() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
        console.log('Navigated to:', pathname);
    }, [pathname]);

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about-us/*" element={<AboutLayout />}>
                    <Route index element={<About />} />
                    <Route path=":aboutId" element={<SingleAbout />} />
                </Route>
                <Route path="providers/*" element={<PhysiciansLayout />}>
                    <Route index element={<Physicians />} />
                    <Route path=":physicianSlug" element={<PhysicianRoute />} />
                    <Route path="*" element={<Navigate to="/providers" replace />} />
                </Route>
                <Route path="services/*" element={<ServicesLayout />}>
                    <Route index element={<Services />} />
                    <Route path=":serviceSlug" element={<ServiceRoute />} />
                    <Route path="*" element={<Navigate to="/services" replace />} />
                </Route>
                <Route path="locations" element={<Locations />} />
                <Route path="*" element={<Error />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
