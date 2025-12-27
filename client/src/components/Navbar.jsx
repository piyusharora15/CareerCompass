import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, X, Menu, LogOut, LayoutDashboard } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { APP_NAME } from "../constants/appConfig";

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Nav links updated to match new features
  const navLinks = [
    { name: "Insights", path: "/app" },
    { name: "Job Tracker", path: "/app/tracker" },
    { name: "Success Analytics", path: "/app/analytics" },
    { name: "Interview Journal", path: "/app/journal" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? "bg-[#0f172a]/90 backdrop-blur-md shadow-xl" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-6">
        <Link to="/" className="flex items-center space-x-2">
          <BrainCircuit className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">{APP_NAME}</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-slate-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
          
          {token ? (
            <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
              <Link to="/app" className="text-blue-500 hover:text-blue-400 font-bold text-sm uppercase flex items-center gap-2">
                <LayoutDashboard size={18}/> Dashboard
              </Link>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-900/20">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#0f172a] border-b border-slate-800 p-6 flex flex-col space-y-6"
          >
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className="text-slate-300 font-bold uppercase text-center">
                {link.name}
              </Link>
            ))}
            {token ? (
               <button onClick={handleLogout} className="bg-red-600 text-white font-bold py-3 rounded-xl">Logout</button>
            ) : (
               <Link to="/login" className="bg-blue-600 text-white font-bold py-3 rounded-xl text-center">Login</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;