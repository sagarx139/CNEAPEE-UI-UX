import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ArrowRight, GraduationCap, HeartPulse, 
  Newspaper, Store as StoreIcon, Lightbulb, MessageCircle, 
  Sparkles, Snowflake, Gift, Trees
} from 'lucide-react';

// --- LOGO & ASSETS ---
// Use the public `logo.png` so navbar and manifest stay consistent
const LOGO = '/logo.png';

// --- COMPONENT IMPORTS ---
// (Placeholder imports)
import Chatbot from './Chatbot';
import Vision from './Vision';
import Plans from './Plans';
import Learning from './Learning';
import HealthApp from './HealthApp';
import NewsApp from './NewsApp';
import Store from './Store';
import Convo from './Convo';
import Studio from './Studio';

// --- FAVICON INJECTION ---
(() => {
  try {
    const existing = document.querySelector("link[rel~='icon']");
    if (existing) existing.href = LOGO;
    else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = LOGO;
      document.head.appendChild(link);
    }
  } catch {
    // noop
  }
})();

// --- ANIMATION COMPONENTS ---

// 1. Interactive Mouse Sparkle Trail
const MagicCursor = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.8) return; // Limit creation rate
      const newParticle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        color: ['#FFD700', '#FF0000', '#00FF00', '#ffffff'][Math.floor(Math.random() * 4)]
      };
      setParticles(prev => [...prev.slice(-15), newParticle]); 
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {particles.map(p => (
        <div key={p.id} className="absolute w-2 h-2 rounded-full animate-ping"
          style={{ 
            left: p.x, top: p.y, 
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`
          }} 
        />
      ))}
    </div>
  );
};

// 2. String of Christmas Lights
const ChristmasLights = () => (
  <div className="fixed top-0 left-0 w-full h-4 z-[40] flex justify-between px-2 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <div key={i} className="relative">
        <div className="w-1 h-4 bg-zinc-800 mx-auto" /> {/* Cord */}
        <div 
          className="w-3 h-3 rounded-full absolute -bottom-2 left-1/2 -translate-x-1/2 animate-twinkle"
          style={{
            backgroundColor: i % 3 === 0 ? '#ff3b3b' : i % 3 === 1 ? '#2ecc71' : '#f1c40f',
            boxShadow: `0 2px 10px ${i % 3 === 0 ? '#ff3b3b' : i % 3 === 1 ? '#2ecc71' : '#f1c40f'}`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      </div>
    ))}
  </div>
);

// 3. Flying Santa Silhouette
const FlyingSanta = () => (
  <div className="fixed top-20 pointer-events-none z-0 animate-fly-across opacity-80" style={{ width: '200px' }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h4c1 0 2-1 2-2V8l3 2 3-2v3h5l3-3M2 12l2 4h6l-2-4" /> 
      <circle cx="18" cy="7" r="1.5" fill="red" className="animate-pulse" />
    </svg>
    <div className="text-[10px] text-center font-bold mt-1 opacity-50 text-white">Ho Ho Ho!</div>
  </div>
);

// 4. Floating Ornaments
const FloatingOrnaments = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
            <div 
                key={i}
                className="absolute rounded-full opacity-20 blur-sm animate-float-slow"
                style={{
                    width: `${Math.random() * 60 + 40}px`,
                    height: `${Math.random() * 60 + 40}px`,
                    background: i % 2 === 0 ? 'radial-gradient(circle, #ff0000 0%, transparent 70%)' : 'radial-gradient(circle, #00ff00 0%, transparent 70%)',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                    animationDelay: `-${Math.random() * 5}s`
                }}
            />
        ))}
    </div>
);

// 5. Heavy Snow (3 Layers)
const SnowStorm = () => {
  const createFlakes = (count, speedClass, sizeClass, opacity) => 
    Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`absolute bg-white rounded-full ${speedClass}`}
        style={{
          left: `${Math.random() * 100}%`,
          top: -20,
          width: sizeClass === 'lg' ? Math.random() * 6 + 4 : Math.random() * 3 + 1,
          height: sizeClass === 'lg' ? Math.random() * 6 + 4 : Math.random() * 3 + 1,
          opacity: opacity,
          animationDelay: `-${Math.random() * 10}s`
        }}
      />
    ));

  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
      <div className="w-full h-full absolute">{createFlakes(50, 'animate-fall-slow', 'sm', 0.4)}</div>
      <div className="w-full h-full absolute">{createFlakes(30, 'animate-fall', 'md', 0.7)}</div>
      <div className="w-full h-full absolute filter blur-[1px]">{createFlakes(15, 'animate-fall-fast', 'lg', 0.9)}</div>
    </div>
  );
};

// --- FEATURES DATA ---
const FEATURES = [
  { label: 'Learning+', icon: GraduationCap, id: 'learning', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-900' },
  { label: 'Health+', icon: HeartPulse, id: 'health', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-900' },
  { label: 'News+', icon: Newspaper, id: 'news', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-900' },
  { label: 'Store+', icon: StoreIcon, id: 'store', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-900' },
  { label: 'Convo+', icon: MessageCircle, id: 'convo', color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-900' },
  { label: 'Studio+', icon: Sparkles, id: 'studio', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-900' }
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState('landing');
  const [menuOpen, setMenuOpen] = useState(false);

  // FORCE DARK MODE
  const isDark = true; 

  // --- ROUTING LOGIC ---
  if (view !== 'landing') {
    const commonProps = { onBack: () => setView('landing') };
    const handleNavigate = (target) => target === 'home' ? setView('landing') : setView(target);

    const renderView = () => {
      switch(view) {
        case 'chatbot': return <Chatbot onNavigate={handleNavigate} />;
        case 'vision': return <Vision onNavigate={handleNavigate} />;
        case 'plans': return <Plans onNavigate={handleNavigate} />;
        case 'convo': return <Convo onNavigate={handleNavigate} />;
        case 'studio': return <Studio onBack={() => handleNavigate('home')} />;
        case 'learning': return <Learning {...commonProps} />;
        case 'health': return <HealthApp {...commonProps} />;
        case 'news': return <NewsApp {...commonProps} />;
        case 'store': return <Store {...commonProps} />;
        default: return setView('landing');
      }
    };
    
    return (
      <div className="dark bg-[#050507] text-white min-h-screen">
        {renderView()}
      </div>
    );
  }

  // --- LANDING PAGE ---
  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-300 bg-[#09090b] text-zinc-100">
      
      {/* --- GLOBAL ANIMATION STYLES --- */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) translateX(0px); }
          100% { transform: translateY(110vh) translateX(20px); }
        }
        .animate-fall { animation: fall 8s linear infinite; }
        .animate-fall-slow { animation: fall 14s linear infinite; }
        .animate-fall-fast { animation: fall 5s linear infinite; }

        @keyframes fly-across {
          0% { transform: translateX(-20vw) translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(120vw) translateY(-50px); opacity: 0; }
        }
        .animate-fly-across { animation: fly-across 25s linear infinite; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) scale(0.8); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
        }
        .animate-twinkle { animation: twinkle 1.5s ease-in-out infinite; }

        @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }

        @keyframes candy-cane {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        .animate-candy-cane {
            background-size: 200% 200%;
            animation: candy-cane 3s linear infinite;
        }
        
        /* Slow Spin for Snowflake */
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* --- ATMOSPHERIC LAYERS --- */}
      <ChristmasLights />
      <FlyingSanta />
      <FloatingOrnaments />
      <SnowStorm />
      <MagicCursor />

      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent)'
        }} className="absolute inset-0" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 flex justify-center pt-8 px-4">
        <div className="flex items-center justify-between w-full max-w-5xl px-5 py-3 rounded-full border shadow-xl backdrop-blur-xl transition-all duration-300 bg-zinc-900/60 border-white/10">
          
          <button onClick={() => setView('landing')} className="flex items-center gap-3 hover:opacity-80 transition group">
            <div className="w-9 h-9 bg-gradient-to-tr from-red-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <img src={LOGO} alt="CNEAPEE logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block text-white">CNEAPEE</span>
          </button>

          <div className="flex items-center gap-2">
            <NavButton label="Vision" icon={Lightbulb} onClick={() => setView('vision')} />
            <NavButton label="Plans" icon={Sparkles} onClick={() => setView('plans')} />
            
            <div className="w-px h-5 mx-2 bg-zinc-700" />
            
            {/* Removed Theme Toggle Button */}

            <button onClick={() => alert("Login")} className="ml-2 px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg transition hover:scale-105 active:scale-95 bg-white text-black hover:bg-zinc-200">
              Sign In
            </button>

            <button className="md:hidden p-2 ml-1" onClick={() => setMenuOpen(true)}>
              <Menu size={22} className="text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center space-y-8 bg-black/95 text-white">
          <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-8 p-3 bg-zinc-800 rounded-full"><X size={24} /></button>
          <div className="text-3xl font-bold tracking-tight" onClick={() => { setView('chatbot'); setMenuOpen(false); }}>Ask Cneapee</div>
          <div className="text-3xl font-bold tracking-tight opacity-70" onClick={() => { setView('vision'); setMenuOpen(false); }}>Vision</div>
          <div className="text-3xl font-bold tracking-tight opacity-70" onClick={() => { setView('plans'); setMenuOpen(false); }}>Plans</div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 flex flex-col items-center pt-40 px-4 pb-20 max-w-7xl mx-auto">

        {/* Holiday Banner */}
        <div className="w-full max-w-3xl mb-12 relative overflow-hidden rounded-3xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl bg-zinc-900/40 border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-green-500/10 to-blue-500/20 opacity-60 animate-candy-cane" />
            
            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="p-5 rounded-full shadow-inner bg-zinc-800 text-red-400">
                    <Gift size={36} className="animate-bounce" />
                </div>
                <div className="flex-1">
                    <h3 className="text-3xl font-bold flex flex-wrap items-center justify-center sm:justify-start gap-3 text-white">
                        Merry Christmas 
                        <Snowflake size={24} className="text-blue-400 animate-spin-slow" />
                        <span className="text-sm font-normal px-2 py-1 bg-red-500 text-white rounded-md">Ho Ho Ho!</span>
                    </h3>
                    <p className="mt-3 text-lg leading-relaxed font-medium text-zinc-300">
                        Unlock your festive creativity with our new holiday AI models.
                    </p>
                </div>
            </div>
        </div>

        {/* Hero Text */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 text-white">
            Think bigger. <br />
            {/* Candy Cane Text Effect */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-green-500 animate-candy-cane">
                Celebrate faster.
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed text-zinc-400">
            Your all-in-one intelligence layer for learning, health, and creativity.
          </p>
        </div>

        {/* --- INPUT COMPONENT --- */}
        <div className="w-full max-w-2xl mx-auto relative group z-20 mb-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-green-500 to-gold-500 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500 animate-pulse"></div>
            
            <div 
                onClick={() => setView('chatbot')}
                className="relative flex items-center p-3 pl-6 rounded-full cursor-pointer transition-all duration-300 border bg-[#151515] border-zinc-800 text-white hover:bg-[#1a1a1a]"
            >
                <Sparkles className="mr-4 text-yellow-400" size={24} />
                <div className="flex-1 text-xl font-medium opacity-60">
                   Ask Cneapee to plan your holiday...
                </div>
                <div className="p-3 rounded-full flex items-center justify-center transition-transform group-hover:rotate-[-45deg] duration-300 bg-zinc-800 text-white">
                    <ArrowRight size={22} />
                </div>
            </div>
        </div>


        {/* --- FEATURES GRID --- */}
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
            {FEATURES.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => setView(item.id)}
                className="group relative flex items-center gap-5 p-6 rounded-3xl border cursor-pointer transition-all duration-500 bg-zinc-900/40 border-white/5 hover:bg-zinc-800/60"
              >
                {/* Feature Icon */}
                <div className={`
                  p-4 rounded-2xl transition-all duration-300 ring-1 ring-inset ring-black/5 bg-zinc-800 group-hover:scale-110
                  ${item.color}
                `}>
                  <item.icon size={28} />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-lg text-zinc-100">
                    {item.label}
                  </h4>
                  <p className="text-sm mt-1 font-medium text-zinc-500 group-hover:text-zinc-400">
                    Launch Application
                  </p>
                </div>
                
                {/* Frosty/Glow Border on Hover */}
                <div className={`absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${item.border}`} />
              </div>
            ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t relative z-10 border-white/5 bg-[#050507]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
           <div className="flex items-center gap-2 mb-4 md:mb-0">
             <Trees size={20} className="text-green-600" />
             <span className="font-semibold">CNEAPEE © 2026</span>
           </div>
           <div className="flex gap-8">
             <a href="#" className="hover:text-white transition">Privacy</a>
             <a href="#" className="hover:text-white transition">Terms</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

// Nav Button Component
const NavButton = ({ label, icon: Icon, onClick }) => (
  <button onClick={onClick} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all text-zinc-400 hover:text-white hover:bg-white/5">
    {Icon && <Icon size={16} />}
    {label}
  </button>
);