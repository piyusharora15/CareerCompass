import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { token, isAuthReady } = useContext(AuthContext);

    if (!isAuthReady) {
        // You can return a loading spinner here
        return <div>Loading...</div>;
    }

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;