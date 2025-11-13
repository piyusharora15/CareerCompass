import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const HomeLayout = () => {
  return (
    <div className="bg-gray-900 text-white">
      <Navbar />
      <main className="relative isolate">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
