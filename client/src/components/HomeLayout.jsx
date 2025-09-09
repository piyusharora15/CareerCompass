import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const HomeLayout = () => {
    return (
        <div className="bg-gray-900 text-white">
            <Navbar />
            <main className="relative isolate">
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;