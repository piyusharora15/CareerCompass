// client/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Github, Linkedin, Twitter, ExternalLink } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "../constants/appConfig";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-slate-400 py-16 border-t border-slate-900">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand + short description */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <BrainCircuit className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase cursor-pointer">
                {APP_NAME}
              </h1>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              {APP_TAGLINE}. Empowering your career journey with 
              workflow tracking, success analytics, and professional 
              reflection tools.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="hover:text-blue-500 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Platform</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <Link to="/app" className="hover:text-blue-500 transition-colors flex items-center gap-2">
                   Market Insights
                </Link>
              </li>
              <li>
                <Link to="/app/tracker" className="hover:text-blue-500 transition-colors">
                  Job Tracker
                </Link>
              </li>
              <li>
                <Link to="/app/analytics" className="hover:text-blue-500 transition-colors">
                  Success Analytics
                </Link>
              </li>
              <li>
                <Link to="/app/journal" className="hover:text-blue-500 transition-colors">
                  Interview Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Support</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                  Documentation <ExternalLink size={12}/>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. Engineered for Career Growth.
          </p>
          <div className="flex gap-8">
            <span className="text-slate-600">v1.0.4-stable</span>
            <span className="text-blue-500/50">System Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;