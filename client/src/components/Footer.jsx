import React from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  // --- JSX ---
  return (
    <footer className="bg-gray-800 text-gray-400 py-12">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <BrainCircuit className="h-7 w-7 text-blue-400" />
              <h1 className="text-2xl font-bold text-white cursor-pointer">
                LakshyaAI
              </h1>
            </Link>
            <p className="text-sm">
              Your personal AI career coach, designed to help you land your
              dream job with data-driven insights.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/app" className="hover:text-white transition-colors">
                  Insights Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/app/resume-builder"
                  className="hover:text-white transition-colors"
                >
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link
                  to="/app/mock-interview"
                  className="hover:text-white transition-colors"
                >
                  Mock Interview
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <p className="text-sm">
              Stay updated with the latest features and career tips.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} LakshyaAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
