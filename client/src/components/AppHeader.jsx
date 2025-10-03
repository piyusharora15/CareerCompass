import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AppHeader = () => {
    const { logout } = useContext(AuthContext); 
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home page after logout
    };

    const navLinks = [
        { name: 'Industry Insights', path: '/app' },
        { name: 'Resume Builder', path: '/app/resume-builder' },
        { name: 'Mock Interview', path: '/app/mock-interview' },
        { name: 'Cover Letter', path: '/app/cover-letter' },
    ];

    return (
        <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700">
            <div className="container mx-auto flex items-center justify-between p-4">
                
                {/* Left Side: Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <BrainCircuit className="h-7 w-7 text-blue-400" />
                    <h1 className="text-2xl font-bold text-white cursor-pointer">LakshyaAI</h1>
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.path === '/app'}
                            className={({ isActive }) =>
                                `font-medium transition-colors ${
                                    isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Right Side: User Actions */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <User className="h-5 w-5 text-gray-300" /> {/* A placeholder profile button */}
                    </button>
                    <button 
                        onClick={handleLogout} // When this button is clicked, it calls our 'handleLogout' function.
                        className="flex items-center space-x-2 bg-red-600/50 hover:bg-red-600/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5"/>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AppHeader; // We export the component so other files can use it.