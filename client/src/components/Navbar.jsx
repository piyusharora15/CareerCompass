import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-gray-800 shadow-lg' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto flex justify-between items-center p-6">
                <Link to="/">
                    <h1 className="text-3xl font-bold text-white cursor-pointer">LakshyaAI</h1>
                </Link>
            </div>
        </motion.nav>
    );
};

export default Navbar;