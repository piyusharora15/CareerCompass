import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { APP_NAME } from "../constants/appConfig";
import { BrainCircuit, Sparkles, Rocket, Briefcase, Target, Cpu } from "lucide-react";

const OnboardingPage = () => {
  // Form State
  const [industry, setIndustry] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [desiredRole, setDesiredRole] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Hooks
  const { token, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const skillList = skills.split(",").map((s) => s.trim()).filter(s => s !== "");
      const profileData = { industry, currentRole, desiredRole, skills: skillList };

      // 1. SAVE PROFILE
      await axios.post("http://localhost:5000/users/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2. GENERATE INITIAL INSIGHTS (AI CALL)
      await axios.post("http://localhost:5000/career-insights/generate", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3. Update context and move to insights
      await fetchUser(); 
      navigate("/insights"); // Updated to flat URL
    } catch (err) {
      setError(err.response?.data?.message || "Setup failed. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-[#1e293b] p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600/20 p-4 rounded-2xl border border-blue-500/30">
              <BrainCircuit className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-center mb-2 tracking-tighter uppercase italic">
            Initialize <span className="text-blue-500">Profile</span>
          </h1>
          <p className="text-center text-slate-500 mb-10 font-bold uppercase tracking-widest text-xs">
            Let's architect your {APP_NAME} experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Industry */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Briefcase size={14} className="text-blue-500"/> Market Vertical
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  placeholder="e.g., FinTech / Web3"
                />
              </div>

              {/* Current Role */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Rocket size={14} className="text-blue-500"/> Current Status
                </label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  placeholder="e.g., Junior Dev"
                />
              </div>
            </div>

            {/* Desired Role */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Target size={14} className="text-blue-500"/> Target Milestone
              </label>
              <input
                type="text"
                value={desiredRole}
                onChange={(e) => setDesiredRole(e.target.value)}
                required
                className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                placeholder="e.g., Senior Full Stack Engineer"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Cpu size={14} className="text-blue-500"/> Current Tech Stack
              </label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
                rows="3"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none"
                placeholder="React, Node.js, Python, AWS..."
              ></textarea>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter italic">Separate skills with commas for the AI engine.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[2rem] transition-all disabled:bg-slate-700 flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 group"
            >
              {isLoading ? (
                <Sparkles className="animate-spin" />
              ) : (
                <>
                  GENERATE AI DASHBOARD <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                </>
              )}
            </button>

            {error && (
              <p className="text-red-400 bg-red-400/10 border border-red-400/20 p-4 rounded-xl text-center text-xs font-bold animate-pulse">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;