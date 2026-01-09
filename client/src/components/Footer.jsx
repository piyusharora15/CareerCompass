import React from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Github, Linkedin, Twitter, ExternalLink } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "../constants/appConfig";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-slate-400 py-16 border-t border-slate-900">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <BrainCircuit className="h-8 w-8 text-blue-500 group-hover:rotate-12 transition-transform duration-300" />
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic cursor-pointer">
                Career<span className="text-blue-500">{APP_NAME.replace('Career', '')}</span>
              </h1>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm font-medium">
              {APP_TAGLINE}. Engineered to transform industry data into personalized learning roadmaps using advanced AI insights.
            </p>
            <div className="flex space-x-5">
              <a href="https://x.com/piyusharora_15" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/piyusharora15" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/piyush-arora1504/" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Platform</h3>
            <ul className="space-y-4 text-sm font-bold">
              {/* FLAT URLS: Updated to /insights and /roadmap */}
              <li><Link to="/insights" className="hover:text-blue-500 transition-colors uppercase tracking-tight">Market Insights</Link></li>
              <li><Link to="/roadmap" className="hover:text-blue-500 transition-colors uppercase tracking-tight">Skill Roadmap</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Support</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="/" className="hover:text-white transition-colors flex items-center gap-1 uppercase tracking-tight">Documentation <ExternalLink size={12}/></a></li>
              <li><a href="/" className="hover:text-white transition-colors uppercase tracking-tight">Privacy Policy</a></li>
              <li><a href="/" className="hover:text-white transition-colors uppercase tracking-tight">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. Architecting professional growth.</p>
          <div className="flex gap-8">
            <span className="text-slate-600">v1.2.0-stable</span>
            <span className="text-emerald-500/50 flex items-center gap-2">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               System Status: Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;