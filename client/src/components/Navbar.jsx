import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        navigate('/');
    };

    const navLinks = [
        { name: 'Industry Insights', path: '/app' },
        { name: 'Resume Builder', path: '/app/resume-builder' },
        { name: 'Mock Interview', path: '/app/mock-interview' },
        { name: 'Cover Letter', path: '/app/cover-letter' },
    ];

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled || mobileMenuOpen ? 'bg-gray-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto flex items-center justify-between p-6">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <BrainCircuit className="h-8 w-8 text-blue-400" />
                    <h1 className="text-3xl font-bold text-white cursor-pointer">LakshyaAI</h1>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path} className="text-gray-300 hover:text-white transition-colors font-medium">
                            {link.name}
                        </Link>
                    ))}
                    {token ? (
                        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Login / Sign Up
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden"
                    >
                        <div className="flex flex-col items-center space-y-4 pt-4 pb-6">
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.path} className="text-gray-300 hover:text-white text-lg" onClick={() => setMobileMenuOpen(false)}>
                                    {link.name}
                                </Link>
                            ))}
                             {token ? (
                                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg w-11/12">
                                    Logout
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-11/12 text-center">
                                    Login / Sign Up
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;