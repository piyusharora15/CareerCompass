import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BrainCircuit, LogOut, BarChart3, Map } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const AppHeader = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Insights", path: "/app", icon: <BarChart3 size={18}/> },
    { name: "Skill Roadmap", path: "/app/roadmap", icon: <Map size={18}/> },
  ];

  return (
    <header className="bg-[#1e293b]/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 px-8">
        <Link to="/app" className="flex items-center space-x-2">
          <BrainCircuit className="h-7 w-7 text-blue-500" />
          <h1 className="text-xl font-bold text-white tracking-tighter uppercase">CareerCompass</h1>
        </Link>

        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/app"}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-bold transition-all ${
                  isActive ? "text-blue-500" : "text-slate-400 hover:text-white"
                }`
              }
            >
              {link.icon} {link.name}
            </NavLink>
          ))}
        </nav>

        <button 
          onClick={() => { logout(); navigate("/"); }} 
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors font-bold text-sm uppercase"
        >
          <span className="hidden sm:inline">Sign Out</span>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;