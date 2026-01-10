import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip 
} from "recharts";
import { 
  CheckCircle2, XCircle, TrendingUp, Info, RefreshCw, 
  Target, Zap, Briefcase, Map, ChevronRight, BrainCircuit
} from "lucide-react";

const Dashboard = () => {
  const { user, token, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newRole, setNewRole] = useState("");

  // 1. Fetch AI Career Insights (The core Analysis)
  const fetchInsight = async (role) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/career-insights/my-insight?role=${role || user.careerProfile.desiredRole}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInsight(res.data);
    } catch (err) {
      console.error("Error fetching insights", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.careerProfile) {
      fetchInsight();
    }
  }, [user]);

  const handleUpdateRole = async () => {
    const roleToUse = newRole || user.careerProfile.desiredRole;
    setIsRegenerating(true);
    try {
      if (newRole) {
        await axios.post("http://localhost:5000/users/profile", 
          { ...user.careerProfile, desiredRole: roleToUse },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      const res = await axios.post("http://localhost:5000/career-insights/generate",
        { ...user.careerProfile, desiredRole: roleToUse },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInsight(res.data);
      await fetchUser(); 
      setNewRole("");
    } catch (err) {
      alert("AI Service busy. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  if (loading && !insight) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
        <RefreshCw className="animate-spin mb-4 text-blue-500" size={48} />
        <p className="text-xl font-medium animate-pulse">Analyzing Industry Standards...</p>
      </div>
    );
  }

  // Data formatting for the Radar Chart
  const radarData = [
    ...(insight?.skillGapAnalysis?.matchedSkills?.map(s => ({ subject: s, A: 100 })) || []),
    ...(insight?.skillGapAnalysis?.missingSkills?.map(s => ({ subject: s, A: 40 })) || [])
  ];

  const renderCustomAxisTick = ({ payload, x, y, textAnchor, stroke, radius }) => (
    <g>
      <text radius={radius} stroke={stroke} x={x} y={y} textAnchor={textAnchor} fill="#94a3b8" fontSize="10px" fontWeight="bold">
        <tspan x={x} dy="0em">{payload.value.length > 12 ? `${payload.value.substring(0, 10)}..` : payload.value}</tspan>
      </text>
    </g>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-20">
      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="group flex items-center gap-2 transition-all">
            <BrainCircuit className="h-7 w-7 text-blue-500 group-hover:rotate-12 transition-transform" />
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-blue-500 transition-colors italic">
              Career <span className="text-blue-500 group-hover:text-white transition-colors">Compass</span>
            </h1>
          </Link>
          
          <div className="flex items-center gap-3 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700 shadow-inner">
            <input 
              className="bg-transparent px-4 py-1 text-sm outline-none w-48 md:w-64 text-white placeholder:text-slate-600" 
              placeholder="Change Target Role..."
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />
            <button 
              onClick={handleUpdateRole}
              disabled={isRegenerating}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isRegenerating ? <RefreshCw className="animate-spin w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {isRegenerating ? "SYNCING..." : "REGENERATE"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-8">
        {/* Profile indicator */}
        <div className="mb-8 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <Target size={14} className="text-blue-500"/> Current Target Profile: 
            <span className="text-white ml-1">{user.careerProfile.desiredRole}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- 1. SKILL COVERAGE RADAR --- */}
          <div className="lg:col-span-5 bg-[#1e293b] rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl overflow-hidden">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Info className="text-blue-400" size={16}/> Proficiency Map
            </h2>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={renderCustomAxisTick} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                  <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-center text-slate-500 mt-4 uppercase font-bold">100 = Match | 40 = Critical Gap</p>
          </div>

          {/* --- 2. AI STRATEGIC FEEDBACK --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#1e293b] rounded-[2.5rem] p-8 border border-slate-800 shadow-xl relative overflow-hidden group min-h-[220px]">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={120} />
              </div>
              <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
                <Zap size={20} className="text-yellow-400 fill-yellow-400"/> AI STRATEGIC ROADMAP
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg italic border-l-4 border-blue-500 pl-6 relative z-10">
                "{insight?.actionableFeedback}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1 font-black">Market Vertical</p>
                  <p className="text-lg font-bold text-white uppercase">{insight?.industry || user.careerProfile.industry}</p>
               </div>
               <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1 font-black">Analysis Engine</p>
                  <p className="text-lg font-bold text-blue-400 uppercase">Gemini 3 Optimized</p>
               </div>
            </div>
          </div>

          {/* --- 3. ASSETS & ACTIONABLE ROADMAP BRIDGE --- */}
          <div className="lg:col-span-12 bg-[#1e293b] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {/* Assets Section */}
              <div className="p-8">
                <h3 className="text-emerald-500 font-black uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                  <CheckCircle2 size={16}/> Verified Assets
                </h3>
                <div className="flex flex-wrap gap-2">
                  {insight?.skillGapAnalysis?.matchedSkills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gaps Section + Bridge to Roadmap */}
              <div className="p-8 bg-red-500/[0.02] flex flex-col justify-between">
                <div>
                  <h3 className="text-red-500 font-black uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                    <XCircle size={16}/> Target Acquisitions
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {insight?.skillGapAnalysis?.missingSkills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => navigate("/roadmap")}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-lg"
                >
                  <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <Map size={18} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-blue-400 leading-none mb-1">Gap Detected</p>
                    <p className="text-sm font-bold text-white leading-tight">Architect My Learning Path</p>
                  </div>
                  <ChevronRight size={20} className="ml-auto text-slate-600 group-hover:text-white" />
                </button>
              </div>
            </div>
          </div>
          
          {/* --- 4. INDUSTRY FORECAST --- */}
          <div className="lg:col-span-12 mt-6">
             <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tighter flex items-center gap-2">
                <Briefcase className="text-blue-500" size={20} /> Industry Forecast 2026
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insight?.industryTrends?.map((trend, i) => (
                  <div key={i} className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 group hover:border-blue-500/50 transition-all">
                    <div className="text-2xl font-black text-slate-800 group-hover:text-blue-500/20 mb-2 transition-colors">0{i+1}</div>
                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">{trend}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;