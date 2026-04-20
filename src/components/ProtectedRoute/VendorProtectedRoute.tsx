import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const VendorProtectedRoute = () => {
    const location = useLocation();

    const isAuthenticated = () => {
        const session = sessionStorage.getItem("vendor_session");
      
        
        if (!session) return false;

        try {
            const parsedSession = JSON.parse(session);
            const currentTime = new Date().getTime();
            // Check for token presence and valid expiry
            return parsedSession.token && currentTime < parsedSession.expiry;
        } catch (e) {
            return false;
        }
    };

    // If authenticated, render children (Outlet); otherwise, bounce to login
    return isAuthenticated() ? (
        <Outlet />
    ) : (
        <Navigate to="/vendor/login" state={{ from: location }} replace />
    );
};

export default VendorProtectedRoute;