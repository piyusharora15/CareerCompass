import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/users/google';
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/users/login', { email, password });
            login(res.data.token);
            navigate('/app');
        } catch (err) {
            setError(err.response?.data || 'Failed to login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <BrainCircuit className="h-8 w-8 text-blue-400" />
                        <h1 className="text-3xl font-bold text-white">LakshyaAI</h1>
                    </Link>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
                {error && <p className="bg-red-500/20 text-red-400 text-center mb-4 p-2 rounded-md">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors">Login</button>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-600"></span></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-800 text-gray-400">Or continue with</span></div>
                    </div>
                    <div className="mt-6 flex justify-center">
                         <button onClick={handleGoogleLogin} className="inline-flex items-center justify-center px-4 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 w-full">
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 48 48">
                                <path d="M44.5,20.2H24v8.3h11.3c-1.6,5.2-6.5,9-11.3,9s-9.8-3.8-11.3-9H2.5c1.6,6.8,7.9,12,15.2,12s13.6-5.2,15.2-12h11.6V20.2z" fill="#4285F4"/>
                                <path d="M44.5,20.2H24v8.3h11.3c-1.6,5.2-6.5,9-11.3,9c-6.7,0-12.2-5.5-12.2-12.2s5.5-12.2,12.2-12.2c3.2,0,6.1,1.2,8.2,3.2l6.2-6.2C34.9,3.2,29.9,0,24,0C10.7,0,0,10.7,0,24s10.7,24,24,24c12.2,0,22.1-9,23.5-20.7H44.5V20.2z" fill="#EA4335"/>
                                <path d="M24,48c13.3,0,24-10.7,24-24S37.3,0,24,0C10.7,0,0,10.7,0,24s10.7,24,24,24z" fill="#34A853"/>
                                <path d="M44.5,20.2H24v8.3h11.3c-1.6,5.2-6.5,9-11.3,9c-6.7,0-12.2-5.5-12.2-12.2s5.5-12.2,12.2-12.2c3.2,0,6.1,1.2,8.2,3.2l6.2-6.2C34.9,3.2,29.9,0,24,0C10.7,0,0,10.7,0,24s10.7,24,24,24c12.2,0,22.1-9,23.5-20.7H44.5V20.2z" fill="#FBBC05"/>
                            </svg>
                            Login with Google
                        </button>
                    </div>
                </div>
                <p className="mt-8 text-center text-sm text-gray-400">Don't have an account? <Link to="/signup" className="font-medium text-blue-400 hover:underline">Sign up</Link></p>
            </div>
        </div>
    );
};
export default LoginPage;