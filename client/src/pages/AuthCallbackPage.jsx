import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthCallbackPage = () => {
    const { login } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            login(token);
            navigate('/app');
        } else {
            // Handle error or redirect to login
            navigate('/login');
        }
    }, [location, login, navigate]);

    return <div>Loading...</div>; // Or a spinner
};

export default AuthCallbackPage;