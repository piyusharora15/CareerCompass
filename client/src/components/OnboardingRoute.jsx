import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const OnboardingRoute = () => {
    const { user, isAuthReady } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthReady) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    // Check if onboarding is actually required
    const needsOnboarding = user && (!user.careerProfile || !user.careerProfile.industry);

    if (needsOnboarding) {
        return <Navigate to="/app/onboarding" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default OnboardingRoute;