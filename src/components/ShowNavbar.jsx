import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ShowNavbar = ({ children }) => {
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(true);

    const navVisible = [
        "/", "/ca", "/3d", "/events", 
        "/closed", "/register", "/team", "/team24", "/theme", "/preregister", 
        "/accommodation", "/workshop", "/dashboard", 
        "/edit-profile", "/business-darbar","/sponsors"
    ];

    useEffect(() => {
        // console.log(location);
        if (!navVisible.includes(location.pathname)) {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }
    }, [location, navVisible]);

    return <div>{showNavbar && children}</div>;
};

export default ShowNavbar;
