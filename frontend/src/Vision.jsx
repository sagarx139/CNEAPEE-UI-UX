import React, { useRef, useMemo, useState } from 'react';
import { 
  Brain, BookOpen, HeartPulse, Newspaper, Palette, Terminal, 
  MessageCircle, ShoppingBag, Home, Zap, Layers, Globe, 
  Cpu, Sun, Wheat, Wind, CloudSun, Bot, 
  Workflow, CheckCircle, TrendingUp, Utensils, ShieldPlus, Filter, 
  Headphones, Code, Lock, Tag, Wallet, Wand2, Guitar, Sliders, 
  Image, Brush, Maximize, Server, Users, Shield, ArrowUpRight,
  Trophy, Activity, History, Calendar
} from 'lucide-react';

// Floating Kites Animation
const KiteParticles = () => {
  const kites = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      left: Math.random() * 100,
      size: Math.random() * 15 + 8,
      duration: Math.random() * 25 + 20,
      delay: -Math.random() * 15,
      color: ['#ff6b35', '#f7931e', '#fdc830', '#37b679'][Math.floor(Math.random() * 4)],
      key: i
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {kites.map((k) => (
        <div 
          key={k.key}
          className="absolute opacity-30"
          style={{
            left: `${k.left}%`,
            top: '-5%',
            width: `${k.size}px`,
            height: `${k.size}px`,
            backgroundColor: k.color,
            transform: 'rotate(45deg)',
            animation: `floatKite ${k.duration}s linear infinite`,
            animationDelay: `${k.delay}s`,
            boxShadow: `0 0 15px ${k.color}70`
          }}
        >
          <div className="absolute top-full left-1/2 w-0.5 h-8 bg-white/30 -translate-x-1/2"></div>
        </div>
      ))}
      <style>{`
        @keyframes floatKite {
          0% { transform: translateY(0) translateX(0) rotate(45deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.3; }
          100% { transform: translateY(110vh) translateX(50px) rotate(60deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Ambient Glow
const AmbientGlow = () => (
  <div className="fixed inset-0 opacity-40 pointer-events-none overflow-hidden">
    <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-gradient-radial from-orange-500/20 to-transparent blur-3xl rounded-full animate-pulse-slow" />
    <div className="absolute -bottom-1/2 -right-1/4 w-[900px] h-[900px] bg-gradient-radial from-yellow-500/15 to-transparent blur-3xl rounded-full animate-pulse-slower" />
    <style>{`
      .animate-pulse-slow { animation: gentlePulse 10s ease-in-out infinite; }
      .animate-pulse-slower { animation: gentlePulse 15s ease-in-out infinite; }
      @keyframes gentlePulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(1.1); }
      }
    `}</style>
  </div>
);

// Detail Section Component
const DetailSection = ({ title, subtitle, desc, features, align, color, image }) => {
  const colorMap = {
    amber: 'from-amber-500/40 to-orange-500/40',
    green: 'from-emerald-500/40 to-green-500/40',
    blue: 'from-sky-500/40 to-blue-500/40',
    pink: 'from-pink-500/40 to-rose-500/40',
    purple: 'from-purple-500/40 to-violet-500/40',
    red: 'from-red-500/40 to-orange-500/40',
    cyan: 'from-cyan-500/40 to-teal-500/40',
    indigo: 'from-indigo-500/40 to-purple-500/40'
  };

  // Gracefully handle image load errors by hiding the image element
  // allowing the gradient background to show through.
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center py-16">
      <div className={align === 'right' ? 'md:order-2' : 'md:order-1'}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Sun size={12} /> {subtitle}
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          {title}
        </h2>
        
        <p className="text-base text-zinc-400 mb-6 leading-relaxed">
          {desc}
        </p>

        <div className="space-y-4">
          {features.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 group/item">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 group-hover/item:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <strong className="block text-white text-sm">{item.title}</strong>
                <span className="text-xs text-zinc-500">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={align === 'right' ? 'md:order-1' : 'md:order-2'}>
        <div className="relative h-[350px] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-sm group/visual hover:border-orange-500/30 transition-all duration-500">
          {/* Image with Error Handling */}
          <img 
            src={image} 
            alt={title}
            onError={handleImageError}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/visual:opacity-80 group-hover/visual:scale-105 transition-all duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color] || colorMap.amber} mix-blend-overlay opacity-50`}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/visual:opacity-100 transition-opacity duration-500">
            <div className="w-20 h-20 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-md">
                <ArrowUpRight className="text-white" size={32} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

// Benchmark Data Component
const BenchmarkWidget = () => {
  const [activeVersion, setActiveVersion] = useState('v1.8');

  const versions = {
    'v1.8': [
      { name: "SimpleQA", score: "97.1%", verified: "Self-reported" },
      { name: "AIME 2025", score: "89.3%", verified: "Self-reported" },
      { name: "MMLU-Pro", score: "85.0%", verified: "Self-reported" },
      { name: "HMMT 2025", score: "83.6%", verified: "Self-reported" },
      { name: "GPQA", score: "79.9%", verified: "Self-reported" },
      { name: "Aider-Polyglot", score: "74.5%", verified: "Self-reported" },
      { name: "LiveCodeBench", score: "74.1%", verified: "Self-reported" },
      { name: "CodeForces", score: "70.7%", verified: "Self-reported" },
      { name: "SWE-Bench Verified", score: "67.8%", verified: "Self-reported" },
      { name: "SWE-bench Multi", score: "57.9%", verified: "Self-reported" },
    ],
    'v1.2': [
      { name: "Global-MMLU-Lite", score: "88.4%", verified: "Self-reported" },
      { name: "AIME 2024", score: "88.0%", verified: "Self-reported" },
      { name: "FACTS Grounding", score: "85.3%", verified: "Self-reported" },
      { name: "GPQA", score: "82.8%", verified: "Self-reported" },
      { name: "MMMU", score: "79.7%", verified: "Self-reported" },
      { name: "AIME 2025", score: "72.0%", verified: "Self-reported" },
      { name: "Vibe-Eval", score: "65.4%", verified: "Self-reported" },
      { name: "LiveCodeBench v5", score: "63.9%", verified: "Self-reported" },
      { name: "Aider-Polyglot", score: "61.9%", verified: "Self-reported" },
      { name: "SWE-Bench Verified", score: "60.4%", verified: "Self-reported" }
    ]
  };

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-white/5 pb-4 gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} />
            <h3 className="text-lg font-bold text-white tracking-tight">CNEAPEE AI Benchmark</h3>
          </div>
          
          <div className="flex items-center gap-2 p-1 rounded-full bg-black/40 border border-white/5">
            {Object.keys(versions).map((v) => (
              <button
                key={v}
                onClick={() => setActiveVersion(v)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeVersion === v 
                    ? 'bg-zinc-800 text-white shadow-lg' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {v} {v === 'v1.8' && <span className="ml-1 text-[8px] text-orange-400">•</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
             <span>{activeVersion} Performance</span>
             {activeVersion === 'v1.8' && (
                <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] uppercase tracking-wider">Coming Soon</span>
             )}
           </div>
           <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            <Activity size={12} />
            <span>SOTA</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-y-3 gap-x-4 text-sm">
          <div className="col-span-3 grid grid-cols-10 text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1 px-2">
            <span className="col-span-5">Benchmark</span>
            <span className="col-span-2 text-right">Score</span>
            <span className="col-span-3 text-right">Verification</span>
          </div>
          
          {versions[activeVersion].map((item, i) => (
            <div key={i} className="col-span-3 grid grid-cols-10 items-center p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
              <span className="col-span-5 font-medium text-zinc-300 group-hover:text-white transition-colors flex items-center gap-2">
                {item.name}
              </span>
              <span className="col-span-2 text-right font-bold text-orange-400">
                {item.score}
              </span>
              <span className="col-span-3 text-right text-xs text-zinc-600 group-hover:text-zinc-500">
                {item.verified}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Version History Component
const VersionHistory = () => {
  const history = [
    { version: "v0.1", date: "March 2025", code: "CAI-XX", phase: "Vintage" },
    { version: "v0.6", date: "July 2025", code: "CAI-XX", phase: "Vintage" },
    { version: "v1.2", date: "December 2025", code: "CAI-G25", phase: "Public" },
    { version: "v1.8", date: "March 2026", code: "CAI-D32", phase: "Beta" },
    { version: "v2.2", date: "July 2026", code: "CAI-XX", phase: "Planned" },
  ];

  return (
    <div className="max-w-3xl mx-auto mb-24 mt-32 px-4">
       <h3 className="text-center text-xl font-bold text-white mb-6 flex items-center justify-center gap-2">
          <History size={20} className="text-zinc-400" />
          Release Roadmap
       </h3>
       <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md">
         {/* Table Header */}
         <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 bg-white/5 text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-wider">
           <div>Model Name</div>
           <div>Release Date</div>
           <div>Integration Code</div>
           <div className="text-right">Phase</div>
         </div>
         {/* Rows */}
         {history.map((item, i) => (
           <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b last:border-0 border-white/5 text-xs md:text-sm hover:bg-white/5 transition-colors items-center group">
             <div className="font-mono font-bold text-orange-400 group-hover:text-orange-300 transition-colors">{item.version}</div>
             <div className="text-zinc-400 flex items-center gap-1.5">
               <Calendar size={12} className="opacity-50" />
               {item.date}
             </div>
             <div className="font-mono text-[10px] text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded w-fit border border-white/5">{item.code}</div>
             <div className="text-right">
               <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                 item.phase === 'Public' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                 item.phase === 'Beta' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                 item.phase === 'Vintage' ? 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500' :
                 'bg-purple-500/10 border-purple-500/20 text-purple-400'
               }`}>
                 {item.phase}
               </span>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};

const Vision = () => {
  const containerRef = useRef(null);

  const sections = [
    {
      title: "Learning+", subtitle: "AI Education", 
      desc: "Master any subject with personalized AI tutoring that adapts to your learning style.",
      color: "amber", align: "left",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
      features: [
        { title: "Smart Tutor", desc: "Real-time doubt solving", icon: <Bot size={16} /> },
        { title: "Visual Paths", desc: "Interactive roadmaps", icon: <Workflow size={16} /> },
        { title: "Instant Feedback", desc: "Learn from mistakes", icon: <CheckCircle size={16} /> }
      ]
    },
    {
      title: "Health+", subtitle: "Wellness AI",
      desc: "Track your health metrics and receive preventive insights powered by machine learning.",
      color: "green", align: "right",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      features: [
        { title: "Trend Analysis", desc: "Long-term health patterns", icon: <TrendingUp size={16} /> },
        { title: "Nutrition AI", desc: "Meal tracking via photos", icon: <Utensils size={16} /> },
        { title: "Early Warnings", desc: "Preventive care alerts", icon: <ShieldPlus size={16} /> }
      ]
    },
    {
      title: "News+", subtitle: "Smart Briefings",
      desc: "Cut through information overload with AI-curated news from verified sources.",
      color: "blue", align: "left",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop",
      features: [
        { title: "Bias Filter", desc: "Multi-perspective analysis", icon: <Filter size={16} /> },
        { title: "Global View", desc: "International coverage", icon: <Globe size={16} /> },
        { title: "Audio Digest", desc: "Daily briefings", icon: <Headphones size={16} /> }
      ]
    },
    {
      title: "Convo+", subtitle: "Secure Chat",
      desc: "Next-gen messaging with context memory and end-to-end encryption.",
      color: "pink", align: "right",
      image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=1974&auto=format&fit=crop",
      features: [
        { title: "Context Memory", desc: "Remembers conversations", icon: <Cpu size={16} /> },
        { title: "Code Debug", desc: "Inline code analysis", icon: <Code size={16} /> },
        { title: "E2E Encrypted", desc: "Military-grade security", icon: <Lock size={16} /> }
      ]
    },
    {
      title: "Store+", subtitle: "Tech Marketplace",
      desc: "Curated selection of AI-ready devices and exclusive tech drops.",
      color: "red", align: "left",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101&auto=format&fit=crop",
      features: [
        { title: "AI Hardware", desc: "Pre-configured devices", icon: <Cpu size={16} /> },
        { title: "Limited Drops", desc: "Exclusive releases", icon: <Tag size={16} /> },
        { title: "One-Click Buy", desc: "Integrated checkout", icon: <Wallet size={16} /> }
      ]
    },
    {
      title: "Audio Studio", subtitle: "Sound Suite",
      desc: "Professional audio tools for podcasters, musicians, and content creators.",
      color: "purple", align: "right",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop",
      features: [
        { title: "Noise Remove", desc: "Studio-quality isolation", icon: <Wand2 size={16} /> },
        { title: "AI Music", desc: "Royalty-free tracks", icon: <Guitar size={16} /> },
        { title: "Auto Master", desc: "Professional mixing", icon: <Sliders size={16} /> }
      ]
    },
    {
      title: "AI Imagine", subtitle: "Visual Engine",
      desc: "Transform ideas into photorealistic images with state-of-the-art diffusion models.",
      color: "indigo", align: "left",
      image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2070&auto=format&fit=crop",
      features: [
        { title: "Text-to-Image", desc: "Instant visualization", icon: <Image size={16} /> },
        { title: "Style Transfer", desc: "Artistic filters", icon: <Brush size={16} /> },
        { title: "Outpainting", desc: "Extend boundaries", icon: <Maximize size={16} /> }
      ]
    },
    {
      title: "Enterprise", subtitle: "Business Solutions",
      desc: "Deploy CNEAPEE's intelligence infrastructure across your organization.",
      color: "cyan", align: "right",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      features: [
        { title: "Private API", desc: "Custom integrations", icon: <Server size={16} /> },
        { title: "Team Hub", desc: "Centralized management", icon: <Users size={16} /> },
        { title: "Enterprise Security", desc: "SOC2 compliant", icon: <Shield size={16} /> }
      ]
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-zinc-100 relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        html { scroll-behavior: smooth; }
      `}</style>

      <AmbientGlow />
      <KiteParticles />

      {/* Minimal Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 rounded-full border border-white/5 bg-zinc-950/50 backdrop-blur-xl shadow-lg ring-1 ring-white/10">
        <a href="/" className="px-5 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
          Home
        </a>
        <div className="px-5 py-2 rounded-full text-xs font-medium text-white bg-zinc-800/50 border border-white/5 shadow-inner">
          Vision
        </div>
      </nav>

      <main className="pt-32 pb-16 px-4 max-w-7xl mx-auto relative z-10">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6 text-zinc-200">
            Happy Makar Sankranti & Pongal.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            CNEAPEE AI v1.2 brings intelligence, creativity, and productivity into a single ecosystem. 
            Celebrate innovation this festival season.
          </p>

          {/* Benchmark Section */}
          <BenchmarkWidget />
        </div>

        {/* Version History Table (Replaced the Badge) */}
        <VersionHistory />

        {/* Detail Sections */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <React.Fragment key={idx}>
              <DetailSection {...section} />
              {idx < sections.length - 1 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Why Choose */}
        <div className="text-center mt-24">
          <h2 className="text-3xl font-bold mb-12 text-white flex items-center justify-center gap-3">
            <Wheat size={28} className="text-green-400" />
            Why CNEAPEE
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Layers, color: 'purple', title: 'Unified Ecosystem', desc: 'Everything in one place' },
              { icon: Globe, color: 'blue', title: 'Real-Time Intelligence', desc: 'Live updates, instant insights' },
              { icon: Cpu, color: 'green', title: 'Clean Architecture', desc: 'Built for scale and speed' }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900/50 to-black/50 border border-white/10 hover:border-orange-500/30 transition-all">
                <div className={`w-14 h-14 mx-auto bg-${item.color}-500/10 rounded-xl flex items-center justify-center text-${item.color}-400 mb-4 border border-${item.color}-500/20`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-2xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">CNEAPEE</p>
          <p className="text-sm text-zinc-600 mb-6">
            Celebrating innovation with the spirit of harvest and sunshine.
          </p>
          <div className="text-xs text-zinc-700 flex items-center justify-center gap-2 font-semibold">
            © 2026 CNEAPEE
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Vision;