import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BrainCircuit, LogOut, BarChart3, Map } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const AppHeader = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Updated paths to match flattened URL structure
  const navLinks = [
    { name: "Insights", path: "/insights", icon: <BarChart3 size={18}/> },
    { name: "Skill Roadmap", path: "/roadmap", icon: <Map size={18}/> },
  ];

  return (
    <header className="bg-[#1e293b]/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 px-8">
        
        {/* LOGO: Redirects to landing page '/' */}
        <Link to="/" className="flex items-center space-x-2 group">
          <BrainCircuit className="h-7 w-7 text-blue-500 group-hover:rotate-12 transition-transform" />
          <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">
            Career<span className="text-blue-500">Compass</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              // Active styling logic for flattened URLs
              className={({ isActive }) =>
                `flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive ? "text-blue-500" : "text-slate-400 hover:text-white"
                }`
              }
            >
              {link.icon} {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Sign Out Action */}
        <button 
          onClick={() => { logout(); navigate("/"); }} 
          className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors font-black text-[10px] uppercase tracking-widest"
        >
          <span className="hidden sm:inline">Sign Out</span>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;