import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

const Layout = () => {
  return (
    <div className="bg-[#0f172a] text-white min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        {/* Full width container for charts and roadmaps */}
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;