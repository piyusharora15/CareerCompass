import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { BarChart2, FileText, MessageSquare, Mail } from 'lucide-react';
import AppHeader from './AppHeader';

const Sidebar = () => {
    const navLinks = [
        { name: 'Industry Insights', icon: BarChart2, path: '/app' },
        { name: 'Resume Builder', icon: FileText, path: '/app/resume-builder' },
        { name: 'Mock Interview', icon: MessageSquare, path: '/app/mock-interview' },
        { name: 'Cover Letter', icon: Mail, path: '/app/cover-letter' },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-gray-800 p-6 flex flex-col">
             <Link to="/">
                <h1 className="text-2xl font-bold text-white mb-10 cursor-pointer">LakshyaAI</h1>
            </Link>
            <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        end={link.path === '/app'}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                isActive 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`
                        }
                    >
                        <link.icon className="h-5 w-5" />
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

const Layout = () => {
    return (
        <div className="bg-gray-900 text-white">
            <AppHeader />
            <main className="container mx-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;