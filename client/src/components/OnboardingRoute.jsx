import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// --- Component Definition ---
const OnboardingRoute = () => {
    // We get the user data and auth status from our context.
    const { user, isAuthReady } = useContext(AuthContext);
    // 'useLocation' gives us information about the current URL.
    const location = useLocation();

    // If we're still checking for a user, we show a loading message. This prevents a flicker effect.
    if (!isAuthReady) {
        return <div>Loading Application...</div>;
    }

    // --- The Core Logic ---
    // We check two conditions: 1) a user is logged in, and 2) they DO NOT have a 'careerProfile'.
    if (user && !user.careerProfile) {
        // If both are true, we redirect them to the '/app/onboarding' page.
        // We use 'replace' to prevent them from using the back button to escape the onboarding process.
        // 'state={{ from: location }}' is a clever trick to remember the page they were trying to visit, so we can send them there after onboarding is complete.
        return <Navigate to="/app/onboarding" state={{ from: location }} replace />;
    }

    // If the user has a profile (or isn't logged in, which ProtectedRoute will handle), we render the requested page using <Outlet />.
    return <Outlet />;
};

export default OnboardingRoute;