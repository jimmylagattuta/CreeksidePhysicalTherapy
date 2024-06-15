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

const physicians = [
    "Brian Horak",
    "John Zdor",
    "Peggy Loebner",
    "Chad Smurthwaite",
    "Alex McNiven",
    "Vince Gonsalves",
    "Hal",
    "Mikayla",
    "Jacqueline",
    "Dixie",
    "Cellina"
];

const generateSlug = (name) => encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));

// Convert names to URL-friendly slugs
const validPhysicianIds = physicians.map(generateSlug);

const isValidPhysicianId = (physicianId) => {
    return validPhysicianIds.includes(physicianId);
};

const PhysicianRoute = () => {
    const { physicianId } = useParams();
    const decodedPhysicianId = decodeURIComponent(physicianId);

    if (isValidPhysicianId(decodedPhysicianId)) {
        return <SinglePhysician physicianId={decodedPhysicianId} />;
    } else {
        return <Navigate to="/providers" replace />;
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
                    <Route path=":physicianId" element={<PhysicianRoute />} />
                    <Route path="*" element={<Navigate to="/providers" replace />} />
                </Route>
                <Route path="services/*" element={<ServicesLayout />}>
                    <Route index element={<Services />} />
                    <Route path=":serviceId" element={<SingleService />} />
                </Route>
                <Route path="locations" element={<Locations />} />
                <Route path="*" element={<Error />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
