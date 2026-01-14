import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { 
  Compass, 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  Trophy
} from "lucide-react";

const Roadmap = () => {
  const { token, user } = useContext(AuthContext);
  const [roadmap, setRoadmap] = useState([]);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedNode, setExpandedNode] = useState(null);

  // 1. Fetch persisted roadmap AND progress on mount
  useEffect(() => {
    const loadSavedData = async () => {
      setLoading(true);
      try {
        // Fetch saved roadmap structure from DB
        const roadmapRes = await axios.get("https://careercompass-backend-3nf6.onrender.com/api/roadmap/my-roadmap", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (roadmapRes.data && roadmapRes.data.length > 0) {
          setRoadmap(roadmapRes.data);
        }

        // Fetch completion progress
        const progressRes = await axios.get("https://careercompass-backend-3nf6.onrender.com/api/roadmap/progress", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompletedNodes(progressRes.data);
      } catch (err) {
        console.error("Failed to load saved roadmap data", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) loadSavedData();
  }, [token]);

  // 2. Generate Roadmap via AI (This will also save to DB)
  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const missing = user?.careerProfile?.missingSkills || [];
      const res = await axios.post(
        "https://careercompass-backend-3nf6.onrender.com/api/roadmap/generate", 
        { 
          missingSkills: missing, 
          desiredRole: user?.careerProfile?.desiredRole 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoadmap(res.data);
    } catch (err) {
      alert("AI Architect is busy. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Toggle Completion Status
  const toggleComplete = async (nodeId, e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(
        "https://careercompass-backend-3nf6.onrender.com/api/roadmap/toggle-complete", 
        { nodeId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.completed) {
        setCompletedNodes([...completedNodes, nodeId]);
      } else {
        setCompletedNodes(completedNodes.filter(id => id !== nodeId));
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const calculateProgress = () => {
    if (roadmap.length === 0) return 0;
    const completedCount = roadmap.filter(node => completedNodes.includes(node.id)).length;
    return Math.round((completedCount / roadmap.length) * 100);
  };

  if (loading && roadmap.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
        <p className="text-xl font-medium animate-pulse">Building your learning path...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto bg-[#0f172a] min-h-screen text-slate-200">
      
      {/* --- HEADER --- */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter italic">
          SKILL ARCHITECT
        </h1>
        <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-black mb-8">
          AI-Powered Roadmap for {user?.careerProfile?.desiredRole || "Your Career"}
        </p>
        
        {roadmap.length === 0 && !loading && (
          <button 
            onClick={generateRoadmap}
            className="bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-2xl font-black transition-all flex items-center gap-3 mx-auto shadow-lg shadow-blue-900/40"
          >
            <Sparkles size={20}/>
            GENERATE INTERACTIVE ROADMAP
          </button>
        )}
      </div>

      {/* --- PROGRESS BAR (Sticky) --- */}
      {roadmap.length > 0 && (
        <div className="sticky top-24 z-40 bg-[#1e293b]/90 backdrop-blur-md p-6 rounded-3xl border border-slate-800 mb-12 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              <h2 className="text-xs font-black text-white uppercase italic tracking-widest">
                Learning Progress
              </h2>
            </div>
            <span className="text-blue-400 font-black text-sm">{calculateProgress()}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 transition-all duration-1000 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
      )}

      {/* --- ROADMAP TREE --- */}
      <div className="relative border-l-2 border-slate-800 ml-4 space-y-10">
        {roadmap.map((node) => {
          const isCompleted = completedNodes.includes(node.id);
          const isExpanded = expandedNode === node.id;

          return (
            <div key={node.id} className="relative pl-10 group">
              <div className={`absolute -left-[11px] top-0 h-5 w-5 rounded-full border-4 border-[#0f172a] transition-all duration-500 ${
                isCompleted ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 
                isExpanded ? 'bg-blue-500 shadow-[0_0_15px_#3b82f6]' : 'bg-slate-700'
              }`} />

              <div 
                onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                className={`bg-[#1e293b] p-6 rounded-[2rem] border transition-all cursor-pointer ${
                  isExpanded ? 'border-blue-500 shadow-2xl scale-[1.02]' : 'border-slate-800'
                } ${isCompleted ? 'opacity-80' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => toggleComplete(node.id, e)}
                      className={`p-2 rounded-xl transition-all ${
                        isCompleted ? 'bg-emerald-500 text-white' : 'bg-[#0f172a] text-slate-600 border border-slate-700'
                      }`}
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <div>
                      <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest">
                        {node.difficulty}
                      </span>
                      <h3 className={`text-lg font-bold mt-0.5 ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                        {node.label}
                      </h3>
                    </div>
                  </div>
                  <div className="text-slate-500">
                    {isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Key Concepts</h4>
                      <ul className="space-y-2">
                        {node.subtasks?.map(task => (
                          <li key={task} className="flex items-center gap-3 text-xs text-slate-400">
                            <Circle size={6} className="text-blue-500 fill-blue-500" /> {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Resources</h4>
                      <div className="space-y-2">
                        {node.resources?.map(res => (
                          <a 
                            key={res.url} 
                            href={res.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center justify-between p-3 bg-[#0f172a] rounded-xl border border-slate-700 hover:border-blue-500 transition-colors"
                          >
                            <span className="text-[11px] font-bold text-slate-400">{res.title}</span>
                            <ExternalLink size={14} className="text-slate-600" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {roadmap.length > 0 && (
        <div className="mt-20 text-center">
           <button 
             onClick={generateRoadmap} 
             disabled={loading}
             className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
           >
             {loading ? "Regenerating..." : "Regenerate Entire Path"}
           </button>
        </div>
      )}
    </div>
  );
};

export default Roadmap;