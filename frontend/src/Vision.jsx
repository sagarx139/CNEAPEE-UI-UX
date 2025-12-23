import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  BookOpen, 
  HeartPulse, 
  Newspaper, 
  Palette, 
  Terminal, 
  MessageCircle, 
  ShoppingBag, 
  Video, 
  Home, // Corrected from HomeIcon
  ChevronDown, 
  Sun, 
  Moon, 
  Zap, 
  Layers, 
  Globe, 
  Cpu 
} from 'lucide-react';

// --- VISION COMPONENT ---
const Vision = ({ onNavigate }) => {
  // Initialize theme from localStorage
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  const containerRef = useRef(null);

  // Apply theme
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
      icon: <Brain className="text-purple-500" size={32} />,
      desc: "Ask questions naturally and receive structured, contextual responses across learning, creativity, and technical domains.",
      tag: "Intelligence Layer"
    },
    {
      id: 2,
      title: "Learning+",
      icon: <BookOpen className="text-blue-500" size={32} />,
      desc: "Your adaptive educational support system. Understand concepts clearly and learn new skills efficiently.",
      tag: "Education"
    },
    {
      id: 3,
      title: "Health+",
      icon: <HeartPulse className="text-red-500" size={32} />,
      desc: "AI-driven wellness awareness providing preventive health insights and lifestyle understanding.",
      tag: "Wellness"
    },
    {
      id: 4,
      title: "News+",
      icon: <Newspaper className="text-orange-500" size={32} />,
      desc: "A smart newsroom integrating trusted real-time sources with AI summarization to reduce information overload.",
      tag: "Information"
    },
    {
      id: 5,
      title: "AI Image Generator",
      icon: <Palette className="text-pink-500" size={32} />,
      desc: "Generate visuals from text prompts. Perfect for creators, marketers, and designers to experiment with styles.",
      tag: "Creativity"
    },
    {
      id: 6,
      title: "Coding Assistance",
      icon: <Terminal className="text-green-500" size={32} />,
      desc: "Write, explain, and debug code. Your productivity assistant for frontend, backend, and algorithms.",
      tag: "Development"
    },
    {
      id: 7,
      title: "Convo+",
      icon: <MessageCircle className="text-teal-500" size={32} />,
      desc: "Real-time, secure messaging. Communicate instantly within the ecosystem without the noise.",
      tag: "Communication"
    },
    {
      id: 8,
      title: "Store+",
      icon: <ShoppingBag className="text-yellow-500" size={32} />,
      desc: "An upcoming curated marketplace for digital and physical products aligned with the CNEAPEE ecosystem.",
      tag: "Commerce • Coming Soon"
    },
    {
      id: 9,
      title: "Creator Studio",
      icon: <Video className="text-indigo-500" size={32} />,
      desc: "A comprehensive production suite. Edit images, apply cinematic effects to videos, and refine your visual storytelling.",
      tag: "Production"
    }
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`min-h-screen transition-colors duration-300 font-sans selection:bg-purple-500/30 ${theme === 'dark' ? 'bg-[#030305] text-zinc-300' : 'bg-zinc-50 text-zinc-900'}`}
    >
      {/* --- Inline Styles for Specific Effects --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .grid-bg { 
          background-image: linear-gradient(rgba(120,120,120,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,120,0.05) 1px, transparent 1px); 
          background-size: 40px 40px; 
          mask-image: linear-gradient(black 60%, transparent); 
        }
        
        .spotlight { 
          background: radial-gradient(500px circle at var(--x) var(--y), rgba(124, 58, 237, 0.08), transparent 40%); 
        }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* --- Background Elements --- */}
      <div className="fixed inset-0 grid-bg pointer-events-none -z-10"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* --- Floating Navbar --- */}
      <nav className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center p-1.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-300 
        ${theme === 'dark' ? 'bg-zinc-900/80 border-white/10 shadow-black/50' : 'bg-white/80 border-zinc-200 shadow-zinc-200/50'}`}>
        
        {/* Home Button (Navigates back to App) */}
        <button 
          onClick={() => onNavigate('home')}
          className={`p-2.5 rounded-full transition-colors ${theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-white/10' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
          title="Go to App Home"
        >
          <Home size={20} />
        </button>

        {/* Divider */}
        <div className={`w-[1px] h-5 mx-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`}></div>

        {/* Context Selector (Renamed to Vision) */}
        <button className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-semibold tracking-tight
          ${theme === 'dark' ? 'text-zinc-200 hover:bg-white/5' : 'text-zinc-800 hover:bg-zinc-50 bg-zinc-50/50'}`}>
          <span>Vision</span>
          <ChevronDown size={14} className="opacity-60" />
        </button>

        {/* Divider */}
        <div className={`w-[1px] h-5 mx-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`}></div>

        {/* Theme Toggle (Sun/Moon Icon) */}
        <button 
          onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          className={`p-2.5 rounded-full transition-colors ${theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-white/10' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* --- Main Content --- */}
      <main className="pt-40 pb-20 px-4 max-w-7xl mx-auto">
        
        {/* 1. Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-24 animate-fade-in">
          <h1 className={`text-5xl md:text-7xl font-bold tracking-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
            One Ecosystem.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-teal-300">
              Infinite Possibilities.
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
            CNEAPEE brings together knowledge, creativity, real-time information, and communication into a single, unified ecosystem. 
            Smarter tools, faster insights, zero clutter.
          </p>
        </div>

        {/* 2. Core Capabilities Grid */}
        <div className="mb-32">
          <h2 className={`text-2xl font-bold mb-8 pl-2 border-l-4 border-purple-500 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
            Core Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <div 
                key={feature.id}
                className={`feature-card group relative p-6 rounded-3xl border transition-all duration-300 flex flex-col h-full hover:-translate-y-1 overflow-hidden
                  ${theme === 'dark' ? 'bg-zinc-900/40 border-white/5 hover:border-purple-500/30' : 'bg-white border-zinc-200 hover:border-purple-500/30 shadow-sm'}
                  ${(idx === 0 || idx === 3) ? 'md:col-span-2' : ''}
                `}
              >
                <div className="absolute inset-0 spotlight opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-zinc-50'}`}>
                      {feature.icon}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-1 rounded-md ${theme === 'dark' ? 'text-zinc-500 border-zinc-500/20' : 'text-zinc-600 border-zinc-300'}`}>
                      {feature.tag}
                    </span>
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed flex-grow ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Gemini Integration Section */}
        <div className={`mb-32 relative rounded-3xl overflow-hidden border p-8 md:p-12 ${theme === 'dark' ? 'border-white/10 glass-panel' : 'border-zinc-200 bg-white shadow-lg'}`}>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 text-blue-500 font-bold justify-center">
              <Zap size={20} /> POWERED BY GEMINI
            </div>
            
            <h2 className={`text-3xl md:text-5xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
              Enhanced Intelligence.<br/>Future-Ready Reasoning.
            </h2>
            
            <p className={`mb-10 text-lg md:text-xl leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
              By integrating Gemini-class AI models, CNEAPEE strengthens its capabilities across complex query handling, multimodal understanding, and context-rich responses.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              {['Advanced Reasoning', 'Context-Aware Responses', 'Multimodal Capabilities', 'Scalable Architecture'].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full border ${theme === 'dark' ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Why CNEAPEE (Three Pillars) */}
        <div className="text-center mb-20">
          <h2 className={`text-3xl font-bold mb-16 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
            Why CNEAPEE Stands Out
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 mb-4">
                <Layers size={24} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Unified Ecosystem</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>AI, learning, news, creativity, and commerce in one place. Reduces dependency on multiple apps.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-4">
                <Globe size={24} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Real-Time Intelligence</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>Live news aggregation combined with intelligent AI summarization for up-to-the-minute insights.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4">
                <Cpu size={24} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Clean Architecture</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>A distinct separation between AI productivity tools and human-to-human communication layers.</p>
            </div>
          </div>
        </div>

      </main>

      {/* --- Footer --- */}
      <footer className={`border-t py-12 text-center transition-colors duration-300 ${theme === 'dark' ? 'border-white/5 bg-[#050507]' : 'border-zinc-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <p className={`text-2xl font-bold mb-4 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}>CNEAPEE</p>
          <p className={`text-sm max-w-md mx-auto mb-8 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
            An AI-powered digital ecosystem combining intelligent assistance, real-time news, and integrated commerce into a single platform.
          </p>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
            © 2025 CNEAPEE Platform. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Vision;