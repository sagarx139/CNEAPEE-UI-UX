import React, { useRef, useMemo } from 'react';
import { 
  Brain, BookOpen, HeartPulse, Newspaper, Palette, Terminal, 
  MessageCircle, ShoppingBag, Video, Home, ChevronDown, 
  Zap, Layers, Globe, Cpu, Sparkles, Snowflake, Gift, Trees
} from 'lucide-react';

// --- DECORATIVE BACKGROUND COMPONENTS ---

const SnowParticles = () => {
  const particles = useMemo(() => {
    const generateParticles = () => {
      return [...Array(40)].map(() => ({
        left: Math.random() * 100,
        width: Math.random() * 4 + 1,
        height: Math.random() * 4 + 1,
        animationDuration: Math.random() * 15 + 10,
        animationDelay: -Math.random() * 10
      }));
    };
    return generateParticles();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {particles.map((particle, i) => (
        <div 
          key={i}
          className="absolute bg-white rounded-full opacity-30 animate-fall"
          style={{
            left: `${particle.left}%`,
            top: -20,
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            animationDuration: `${particle.animationDuration}s`,
            animationDelay: `${particle.animationDelay}s`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) translateX(0px); opacity: 0; }
          10% { opacity: 0.5; }
          100% { transform: translateY(105vh) translateX(20px); opacity: 0; }
        }
        .animate-fall { animation: fall linear infinite; }
      `}</style>
    </div>
  );
};

const NorthernLights = () => (
  <div className="absolute inset-0 opacity-40 pointer-events-none select-none overflow-hidden">
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-900/30 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
    <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-red-900/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slower" />
    <style>{`
      .animate-pulse-slow { animation: pulse 8s ease-in-out infinite; }
      .animate-pulse-slower { animation: pulse 12s ease-in-out infinite; }
    `}</style>
  </div>
);

// --- VISION COMPONENT ---
const Vision = ({ onNavigate }) => {
  const containerRef = useRef(null);

  // Spotlight Effect Logic
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.feature-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--y', `${e.clientY - rect.top}px`);
      });
    }
  };

  const features = [
    {
      id: 1,
      title: "Conversational AI",
      icon: <Brain className="text-red-400" size={32} />,
      desc: "Ask questions naturally and receive structured, contextual responses across learning, creativity, and technical domains.",
      tag: "Intelligence"
    },
    {
      id: 2,
      title: "Learning+",
      icon: <BookOpen className="text-blue-400" size={32} />,
      desc: "Your adaptive educational support system. Understand concepts clearly and learn new skills efficiently.",
      tag: "Education"
    },
    {
      id: 3,
      title: "Health+",
      icon: <HeartPulse className="text-green-400" size={32} />,
      desc: "AI-driven wellness awareness providing preventive health insights and lifestyle understanding.",
      tag: "Wellness"
    },
    {
      id: 4,
      title: "News+",
      icon: <Newspaper className="text-amber-400" size={32} />,
      desc: "A smart newsroom integrating trusted real-time sources with AI summarization.",
      tag: "Information"
    },
    {
      id: 5,
      title: "AI Image Generator",
      icon: <Palette className="text-purple-400" size={32} />,
      desc: "Generate visuals from text prompts. Perfect for creators, marketers, and designers.",
      tag: "Creativity"
    },
    {
      id: 6,
      title: "Coding Assistance",
      icon: <Terminal className="text-cyan-400" size={32} />,
      desc: "Write, explain, and debug code. Your productivity assistant for frontend, backend, and algorithms.",
      tag: "Dev Tools"
    },
    {
      id: 7,
      title: "Convo+",
      icon: <MessageCircle className="text-pink-400" size={32} />,
      desc: "Real-time, secure messaging. Communicate instantly within the ecosystem without the noise.",
      tag: "Connect"
    },
    {
      id: 8,
      title: "Store+",
      icon: <ShoppingBag className="text-yellow-400" size={32} />,
      desc: "An upcoming curated marketplace for digital and physical products aligned with the CNEAPEE ecosystem.",
      tag: "Coming Soon"
    },
    {
      id: 9,
      title: "Creator Studio",
      icon: <Video className="text-indigo-400" size={32} />,
      desc: "A comprehensive production suite. Edit images, apply cinematic effects, and refine visual storytelling.",
      tag: "Production"
    }
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen font-sans selection:bg-red-500/30 bg-[#050507] text-zinc-300 relative overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .spotlight { 
          background: radial-gradient(500px circle at var(--x) var(--y), rgba(220, 38, 38, 0.1), transparent 40%); 
        }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        .animate-fade-in { animation: fadeIn 1s ease-out forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* --- Background Elements --- */}
      <NorthernLights />
      <SnowParticles />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none -z-10" 
           style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

      {/* --- Floating Navbar --- */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center p-1.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-300 bg-black/60 border-white/10 shadow-black/50">
        
        {/* Pill-Shaped Home Button */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-sm font-medium text-zinc-200 group"
        >
          <Home size={16} className="text-zinc-400 group-hover:text-red-400 transition-colors" />
          <span>Home</span>
        </button>

        {/* Divider */}
        <div className="w-[1px] h-5 mx-2 bg-white/10"></div>

        {/* Vision Label */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-bold tracking-tight text-white">
          <Sparkles size={14} className="text-yellow-500" />
          <span>Vision</span>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="pt-40 pb-20 px-4 max-w-7xl mx-auto relative z-10">
        
        {/* 1. Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/20 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Gift size={12} /> Holiday Update Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
            One Ecosystem.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-green-500">
              Infinite Possibilities.
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-zinc-400">
            CNEAPEE brings together knowledge, creativity, and holiday cheer into a single, unified ecosystem. 
            Smarter tools, faster insights, zero clutter.
          </p>
        </div>

        {/* 2. Core Capabilities Grid */}
        <div className="mb-32">
          <h2 className="text-2xl font-bold mb-8 pl-2 border-l-4 border-red-500 text-white flex items-center gap-2">
            Core Capabilities <Snowflake size={18} className="text-blue-400 opacity-50" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <div 
                key={feature.id}
                className={`feature-card group relative p-6 rounded-3xl border transition-all duration-500 flex flex-col h-full hover:-translate-y-1 overflow-hidden
                  bg-[#0a0a0c]/80 border-white/5 hover:border-red-500/30 backdrop-blur-sm
                  ${(idx === 0 || idx === 3) ? 'md:col-span-2' : ''}
                `}
              >
                {/* Spotlight Layer */}
                <div className="absolute inset-0 spotlight opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                      {feature.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider border px-2 py-1 rounded-md text-zinc-500 border-zinc-500/20 bg-black/40">
                      {feature.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-red-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed flex-grow text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Gemini Integration Section */}
        <div className="mb-32 relative rounded-3xl overflow-hidden border p-8 md:p-12 border-white/10 glass-panel">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 text-red-400 font-bold justify-center tracking-widest text-xs">
              <Zap size={14} /> POWERED BY GEMINI
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">
              Enhanced Intelligence.<br/>Future-Ready Reasoning.
            </h2>
            
            <p className="mb-10 text-lg md:text-xl leading-relaxed text-zinc-400">
              By integrating Gemini-class AI models, CNEAPEE strengthens its capabilities across complex query handling, multimodal understanding, and context-rich responses.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              {['Advanced Reasoning', 'Context-Aware Responses', 'Multimodal Capabilities', 'Scalable Architecture'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white/5 border-white/10 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Why CNEAPEE (Three Pillars) */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-16 text-white flex items-center justify-center gap-3">
             <Trees size={28} className="text-green-500" />
             Why CNEAPEE Stands Out
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl hover:bg-white/5 transition duration-300">
              <div className="w-14 h-14 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
                <Layers size={28} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Unified Ecosystem</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">AI, learning, news, creativity, and commerce in one place. Reduces dependency on multiple apps.</p>
            </div>
            <div className="p-6 rounded-3xl hover:bg-white/5 transition duration-300">
              <div className="w-14 h-14 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                <Globe size={28} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Real-Time Intelligence</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Live news aggregation combined with intelligent AI summarization for up-to-the-minute insights.</p>
            </div>
            <div className="p-6 rounded-3xl hover:bg-white/5 transition duration-300">
              <div className="w-14 h-14 mx-auto bg-green-500/10 rounded-full flex items-center justify-center text-green-400 mb-6 border border-green-500/20">
                <Cpu size={28} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Clean Architecture</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">A distinct separation between AI productivity tools and human-to-human communication layers.</p>
            </div>
          </div>
        </div>

      </main>

      {/* --- Footer --- */}
      <footer className="border-t py-12 text-center transition-colors duration-300 border-white/5 bg-[#020203]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-2xl font-bold mb-4 tracking-tighter text-white">CNEAPEE</p>
          <p className="text-sm max-w-md mx-auto mb-8 text-zinc-500">
            An AI-powered digital ecosystem combining intelligent assistance, real-time news, and integrated commerce into a single platform.
          </p>
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center justify-center gap-2">
            © 2025 CNEAPEE Platform. <Snowflake size={10} /> All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Vision;