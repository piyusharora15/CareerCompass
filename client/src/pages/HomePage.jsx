import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Map,
  Zap,
  ArrowRight,
  Target,
  BarChart3,
  Quote,
  Star,
  CheckCircle2,
  Sparkles,
  MousePointer2,
} from "lucide-react";
import heroImage from "../assets/hero-image.png";
import { APP_NAME, APP_TAGLINE } from "../constants/appConfig";

const HomePage = () => {
  const heroRef = useRef(null);
  const [activeCard, setActiveCard] = useState(0);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects for the hero image
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const imageRotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);

  const onboardingSteps = [
    {
      title: "The Analysis",
      role: "Senior Frontend Engineer",
      insight: "Demand for 'Next.js Server Actions' is up 40% in 2026. Your profile lacks this.",
      color: "bg-blue-600",
    },
    {
      title: "The Gap",
      role: "Full Stack Developer",
      insight: "Market shift: Companies are prioritizing 'Rust' for backend performance over Node.js.",
      color: "bg-emerald-600",
    },
    {
      title: "The Roadmap",
      role: "System Architect",
      insight: "Recommended: 4-week deep dive into Distributed Systems & Kafka partitions.",
      color: "bg-purple-600",
    }
  ];

  const features = [
    {
      icon: <BarChart3 className="h-10 w-10 text-blue-500" />,
      title: "Industry Insights",
      description: "Real-time AI analysis of 2026 market trends, salary shifts, and hiring demands for your role.",
    },
    {
      icon: <Target className="h-10 w-10 text-red-500" />,
      title: "Skill Gap Analysis",
      description: "Instantly identify the technical and soft skills you're missing compared to top-tier candidates.",
    },
    {
      icon: <Map className="h-10 w-10 text-emerald-500" />,
      title: "Skill Architect",
      description: "AI-generated interactive roadmaps that guide you from fundamental concepts to mastery.",
    },
    {
      icon: <Zap className="h-10 w-10 text-yellow-500" />,
      title: "Resource Aggregator",
      description: "Hand-picked documentation, blogs, and tutorials for every single node in your roadmap.",
    },
  ];

  return (
    <div className="relative z-0 bg-[#0f172a] text-slate-200 overflow-x-hidden font-sans">
      
      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="w-full pt-48 pb-20 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="space-y-6 mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Sparkles size={14} className="text-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">AI-First Career Intelligence</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter uppercase italic">
              {APP_TAGLINE}
            </h1>
          </motion.div>

          <div className="flex justify-center flex-wrap gap-4 pt-10">
            {/* UPDATED: Navigates to /insights (Flat URL) */}
            <Link to="/insights">
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-12 rounded-[2rem] text-lg inline-flex items-center transition-all shadow-2xl shadow-blue-900/40 group">
                Enter Workspace <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Hero Image with Perspective Effect */}
        <div className="mt-24 px-4" style={{ perspective: "2000px" }}>
          <motion.div style={{ y: imageY, scale: imageScale, rotateX: imageRotateX }} className="max-w-6xl mx-auto">
            <div className="relative p-2 bg-slate-800/50 rounded-[3rem] border border-slate-700 shadow-2xl overflow-hidden">
                <img src={heroImage} alt="Platform Dashboard Preview" className="rounded-[2.5rem] w-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- INTERACTIVE ONBOARDING FLASHCARDS --- */}
      <section className="py-32 bg-slate-950/50">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-left">
              <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
                See How the <br/><span className="text-blue-500">AI Thinks</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Experience our core engine. Select a career phase to see how we transform market data into actionable personal roadmaps.
              </p>
              <div className="flex flex-col gap-4">
                {onboardingSteps.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCard(i)}
                    className={`text-left p-6 rounded-2xl border transition-all duration-300 ${activeCard === i ? 'bg-blue-600/10 border-blue-500 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-70">Step 0{i+1}</span>
                    <span className="font-bold text-lg uppercase tracking-tight italic">{step.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full flex justify-center" style={{ perspective: "1000px" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCard}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`w-full max-w-md aspect-[4/5] ${onboardingSteps[activeCard].color} rounded-[3rem] p-10 shadow-2xl flex flex-col justify-between relative overflow-hidden text-left`}
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-8 italic">Simulation Engine v1.2</p>
                    <p className="text-white/60 text-xs font-bold uppercase mb-2">Analyzing Profile:</p>
                    <h4 className="text-3xl font-black text-white leading-tight mb-10 uppercase italic">
                      {onboardingSteps[activeCard].role}
                    </h4>
                    <div className="p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
                      <Zap className="text-yellow-400 mb-4 fill-yellow-400" size={24} />
                      <p className="text-white font-medium leading-relaxed italic text-sm md:text-base">
                        "{onboardingSteps[activeCard].insight}"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                    <MousePointer2 size={12} /> Interactive Preview Mode
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-32">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">The Platform <br/><span className="text-blue-500">Core</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="group bg-[#1e293b] p-10 rounded-[2.5rem] border border-slate-800 hover:border-blue-500/50 transition-all shadow-xl text-left">
                <div className="mb-8 p-4 bg-slate-900 w-fit rounded-2xl group-hover:scale-110 group-hover:bg-blue-600/10 transition-all">{feature.icon}</div>
                <h4 className="text-xl font-black text-white mb-4 uppercase italic tracking-tight">{feature.title}</h4>
                <p className="text-slate-400 leading-relaxed text-sm font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-32 bg-slate-950/50">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 text-left">
              <h3 className="text-5xl font-black text-white uppercase italic leading-none mb-6">Built for <br/><span className="text-blue-500">Professionals</span></h3>
              <div className="flex gap-4 items-center">
                <div className="flex text-yellow-500"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
                <span className="text-white font-bold text-sm tracking-widest uppercase opacity-70">Verified Users</span>
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-1 gap-6 text-left">
               {[
                 { name: "Rahul Sharma", role: "Senior SWE @ Microsoft", quote: "The Skill Architect showed me exactly why I was failing Senior Dev interviews. It wasn't my React code, it was System Design." },
                 { name: "Sakshi Singh", role: "SDE", quote: "The AI Insights are 2026-ready. The roadmap links saved me 50+ hours of searching for tutorials." }
               ].map((t, i) => (
                 <div key={i} className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-800 relative shadow-2xl group hover:border-blue-500/30 transition-all">
                    <Quote className="absolute top-6 right-8 text-blue-500/10" size={48} />
                    <p className="text-slate-300 italic mb-6 relative z-10 leading-relaxed text-sm md:text-base">"{t.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-xs uppercase shadow-lg shadow-blue-900/40">{t.name[0]}</div>
                      <div>
                        <p className="text-white font-black text-sm uppercase tracking-tight">{t.name}</p>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <h3 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase italic leading-tight">Architecture Your <br/>Future Today.</h3>
          {/* UPDATED: Navigates to /insights (Flat URL) */}
          <Link to="/insights" className="bg-white text-[#0f172a] font-black py-6 px-16 rounded-[2.5rem] text-xl inline-block transition-transform hover:scale-105 shadow-2xl">
            Start Free Journey
          </Link>
          <p className="mt-8 text-slate-500 text-[10px] uppercase font-black tracking-widest italic opacity-60">Personalized AI Roadmap generations included</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;