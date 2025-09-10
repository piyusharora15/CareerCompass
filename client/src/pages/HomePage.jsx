import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, FileText, MessageSquare, Mail, PlayCircle } from 'lucide-react';
import heroImage from '../assets/hero-image.png';

const HomePage = () => {
    const features = [
        {
            icon: <BarChart2 className="h-10 w-10 text-blue-400" />,
            title: 'Industry Insights',
            description: 'Stay ahead of the curve with real-time data on in-demand skills and salary trends in your specific industry.'
        },
        {
            icon: <FileText className="h-10 w-10 text-green-400" />,
            title: 'AI Resume Builder',
            description: 'Generate ATS-optimized resume content that highlights your skills and gets you noticed by recruiters.'
        },
        {
            icon: <MessageSquare className="h-10 w-10 text-purple-400" />,
            title: 'Mock Interviews',
            description: 'Practice with role-specific questions and get AI-powered feedback to build your confidence and ace your interviews.'
        },
        {
            icon: <Mail className="h-10 w-10 text-yellow-400" />,
            title: 'Intelligent Cover Letters',
            description: 'Our AI analyzes job descriptions to create perfectly tailored cover letters that make you stand out.'
        }
    ];

    // The problematic "overflow-x-hidden" class has been removed from this top-level div.
    return (
        <div>
            <section className="w-full pt-48 pb-20 text-center">
                <div className="container mx-auto px-8">
                    <div>
                        <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
                            Your AI Career Coach for
                            <br />
                            Professional Success
                        </h1>
                        <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl mt-6">
                            Advance your career with personalized guidance, interview prep, and AI-powered tools for job success.
                        </p>
                    </div>
                    <div className="flex justify-center space-x-4 mt-8">
                        <Link to="/app">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105">
                                Get Started
                            </button>
                        </Link>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                            <button className="bg-transparent border-2 border-gray-600 hover:bg-gray-800 text-gray-300 font-bold py-3 px-8 rounded-lg text-lg transition-all hover:scale-105 flex items-center">
                                <PlayCircle className="mr-2 h-5 w-5"/>
                                Watch Demo
                            </button>
                        </a>
                    </div>
                </div>
                <div className="mt-16 container mx-auto px-8">
                    <div>
                        <img
                            src={heroImage}
                            alt="Dashboard Preview"
                            className="rounded-xl shadow-2xl shadow-blue-500/20 border border-gray-700 mx-auto"
                        />
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-900/50">
                <div className="container mx-auto px-8 text-center">
                    <h3 className="text-4xl font-bold mb-4">The Ultimate Career Toolkit</h3>
                    <p className="text-gray-400 mb-16 max-w-2xl mx-auto">Every feature you need to go from applicant to employee of the month.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-gray-800 p-8 rounded-lg text-left"
                            >
                                <div className="mb-6">{feature.icon}</div>
                                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-20">
                <div className="container mx-auto px-8 text-center">
                     <div>
                        <h3 className="text-4xl font-bold mb-4">Ready to Land Your Dream Job?</h3>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            Take control of your career path today. Let LakshyaAI be your guide to success.
                        </p>
                        <Link to="/app" className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-all shadow-lg hover:shadow-xl">
                            Start Your Journey Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;