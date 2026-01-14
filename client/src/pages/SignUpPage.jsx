import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BrainCircuit, Loader2 } from "lucide-react";
import { APP_NAME } from "../constants/appConfig";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = () => {
    window.location.href = "https://careercompass-backend-3nf6.onrender.com/users/google";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("https://careercompass-backend-3nf6.onrender.com/users/signup", { username, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 font-sans">
      <div className="bg-[#1e293b] p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-800">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <BrainCircuit className="h-10 w-10 text-blue-500 group-hover:rotate-12 transition-transform" />
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">
              Career<span className="text-blue-500">Compass</span>
            </h1>
          </Link>
          <p className="text-slate-500 text-[10px] mt-4 font-black uppercase tracking-[0.3em]">
            Join the elite job hunters.
          </p>
        </div>

        {error && (
          <p className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm mb-6 border border-red-500/20 font-bold text-center">
            {error}
          </p>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 font-medium" 
            placeholder="Username" 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
          <input 
            className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 font-medium" 
            placeholder="Email Address" 
            type="email" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 font-medium" 
            placeholder="Password (Min 6 chars)" 
            type="password" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
          <button 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-500 tracking-widest">
            <span className="bg-[#1e293b] px-4">Fast Track</span>
          </div>
        </div>

        {/* Google Signup Button with Logo */}
        <button 
          onClick={handleGoogleAuth} 
          className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-xl group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"
            />
            <path
              fill="#34A853"
              d="M16.04 18.013c-1.09.303-2.26.477-3.467.477a7.077 7.077 0 0 1-6.551-4.394L2.002 17.22a12.004 12.004 0 0 0 10.571 6.78c3.085 0 5.86-1.018 8.082-2.734l-4.615-3.253z"
            />
            <path
              fill="#4285F4"
              d="M19.835 7.513C19.942 8.012 20 8.524 20 9.043c0 .548-.066 1.077-.188 1.584l4.137 3.218c.677-1.46.05-3.047-.188-4.584V7.513h-4.126z"
            />
            <path
              fill="#FBBC05"
              d="M23.945 9.351A12.003 12.003 0 0 0 12 0V4.909c3.34 0 6.182 2.127 7.35 5.091l4.595-3.649z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.275c0-.84-.075-1.645-.215-2.425h-11.275v4.6h6.435c-.28 1.505-1.125 2.78-2.395 3.635l4.615 3.253c2.7-2.49 4.25-6.16 4.25-10.063z"
            />
          </svg>
          <span className="uppercase tracking-tight">Continue with Google</span>
        </button>

        <p className="mt-8 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
          Already a member? <Link to="/login" className="text-blue-500 hover:text-blue-400 ml-1 transition-colors">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;