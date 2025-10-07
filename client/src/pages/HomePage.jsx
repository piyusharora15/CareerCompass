import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart2, FileText, MessageSquare, Mail, ArrowRight, Youtube } from 'lucide-react';
import heroImage from '../assets/hero-image.png'; // Make sure this path is correct

const HomePage = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
    const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
    const imageRotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);

    const features = [
        {
            icon: <BarChart2 className="h-10 w-10 text-blue-400" />,
            title: 'Industry Insights',
            description: 'Stay ahead with real-time data on in-demand skills and salary trends in your specific industry.'
        },
        {
            icon: <FileText className="h-10 w-10 text-green-400" />,
            title: 'AI Resume Builder',
            description: 'Generate ATS-optimized resume content that highlights your skills and gets you noticed by recruiters.'
        },
        {
            icon: <MessageSquare className="h-10 w-10 text-purple-400" />,
            title: 'Mock Interviews',
            description: 'Practice with role-specific questions and get AI-powered feedback to build your confidence and ace interviews.'
        },
        {
            icon: <Mail className="h-10 w-10 text-yellow-400" />,
            title: 'Intelligent Cover Letters',
            description: 'Our AI analyzes job descriptions to create perfectly tailored cover letters that make you stand out.'
        }
    ];

    return (
        <div>
            {/* Hero Section */}
            <section ref={heroRef} className="w-full pt-48 pb-20 text-center relative overflow-hidden">
                <div className="space-y-6 mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient">
                                Your AI Career Coach for Professional Success
                            </span>
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                            Advance your career with personalized guidance, interview prep, and AI-powered tools for job success.
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex justify-center flex-wrap gap-4"
                    >
                        <Link to="/app">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg inline-flex items-center">
                                Get Started <ArrowRight className="ml-2 h-5 w-5"/>
                            </button>
                        </Link>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg inline-flex items-center">
                                <Youtube className="mr-2 h-5 w-5"/> Watch Demo
                            </button>
                        </a>
                    </motion.div>
                </div>

                <div className="mt-12 px-4" style={{ perspective: '1000px' }}>
                    <motion.div
                        style={{
                            y: imageY,
                            scale: imageScale,
                            rotateX: imageRotateX,
                        }}
                        className="hero-image"
                    >
                        <img
                            src={heroImage}
                            width={1280}
                            height={720}
                            alt="Dashboard Preview"
                            className="rounded-lg shadow-2xl border border-gray-700/50 mx-auto"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-900/50 relative z-10">
                <div className="container mx-auto px-8 text-center">
                    <h3 className="text-4xl font-bold mb-4">The Ultimate Career Toolkit</h3>
                    <p className="text-gray-400 mb-16 max-w-2xl mx-auto">Every feature you need to go from applicant to employee of the month.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="bg-gray-800 p-8 rounded-lg text-left"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="mb-6">{feature.icon}</div>
                                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-8 text-center">
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                     >
                        <h3 className="text-4xl font-bold mb-4">Ready to Land Your Dream Job?</h3>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            Take control of your career path today. Let LakshyaAI be your guide to success.
                        </p>
                        <Link to="/app" className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-all shadow-lg hover:shadow-xl">
                            Start Your Journey Now
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;