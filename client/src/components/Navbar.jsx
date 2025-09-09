import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const navLinks = [
        { name: 'Industry Insights', path: '/app' },
        { name: 'Resume Builder', path: '/app/resume-builder' },
        { name: 'Mock Interview', path: '/app/mock-interview' },
        { name: 'Cover Letter', path: '/app/cover-letter' },
    ];

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                ? 'bg-gray-900/80 backdrop-blur-md shadow-lg' 
                : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto flex items-center p-6">
                {/* Left Side: Logo and Title */}
                <div className="flex-1 flex justify-start">
                    <Link to="/" className="flex items-center space-x-2">
                        <BrainCircuit className="h-8 w-8 text-blue-400" />
                        <h1 className="text-3xl font-bold text-white cursor-pointer">LakshyaAI</h1>
                    </Link>
                </div>
                
                {/* Centered Navigation Links */}
                <div className="hidden md:flex flex-1 justify-center items-center space-x-6"> {/* Reduced spacing from space-x-8 to space-x-6 */}
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            to={link.path} 
                            className="text-gray-300 hover:text-white transition-colors font-medium whitespace-nowrap" // Added whitespace-nowrap
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side: CTA Button */}
                <div className="hidden md:flex flex-1 justify-end">
                     <Link to="/app" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Get Started
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;