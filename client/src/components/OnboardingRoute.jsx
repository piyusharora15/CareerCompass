import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const OnboardingRoute = () => {
    const { user, isAuthReady } = useContext(AuthContext);
    const location = useLocation();

    // While checking authentication and profile status
    if (!isAuthReady) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    // Check if onboarding is actually required (No profile or industry data)
    const needsOnboarding = user && (!user.careerProfile || !user.careerProfile.industry);

    if (needsOnboarding) {
        // FLAT URL: Redirecting to /onboarding instead of /app/onboarding
        return <Navigate to="/onboarding" state={{ from: location }} replace />;
    }

    // If profile exists, allow access to the requested feature (/insights or /roadmap)
    return <Outlet />;
};

export default OnboardingRoute;