'use client';

import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Menu, X, ArrowRight, GraduationCap, HeartPulse, 
  Newspaper, Store as StoreIcon, Lightbulb, MessageCircle, LogIn, 
  Sparkles, ShieldCheck, Wifi, Loader2, Lock, ScanLine, CheckCircle2 
} from 'lucide-react';

// --- RESTORED REAL IMPORTS ---
// Ensure these files exist in your project folder as before
import Chatbot from './Chatbot';
import Vision from './Vision';
import Plans from './Plans';
import Learning from './Learning';
import HealthApp from './HealthApp';
import NewsApp from './NewsApp';
import Store from './Store';
import Convo from './Convo';
import LogoImg from './assets/CNEAPEE 2026 LOGO.png'; 

// --- FEATURES DATA ---
const FEATURES = [
  { label: 'Learning+', icon: GraduationCap, id: 'learning' },
  { label: 'Health+', icon: HeartPulse, id: 'health' },
  { label: 'News+', icon: Newspaper, id: 'news' },
  { label: 'Store+', icon: StoreIcon, id: 'store' },
  { label: 'Convo+', icon: MessageCircle, id: 'convo' }
];

// --- LOADING SCREEN (3 SECONDS) ---
const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [hexStream, setHexStream] = useState([]);
  const [status, setStatus] = useState("Initializing Core...");

  // Timer Logic
  useEffect(() => {
    const duration = 3000; 
    const interval = 50;
    const steps = duration / interval;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + (100 / steps);
      });
    }, interval);

    // Matrix Rain Effect
    const hexTimer = setInterval(() => {
      const chars = "0123456789ABCDEF";
      const line = Array(8).fill(0).map(() => chars[Math.floor(Math.random() * 16)] + chars[Math.floor(Math.random() * 16)]).join(" ");
      setHexStream(prev => [line, ...prev.slice(0, 8)]);
    }, 80);

    return () => { clearInterval(timer); clearInterval(hexTimer); };
  }, []);

  // Status Updates
  useEffect(() => {
    if (progress < 25) setStatus("Initializing Security Kernel...");
    else if (progress < 50) setStatus("Verifying Biometric Handshake...");
    else if (progress < 75) setStatus("Establishing Secure Uplink...");
    else setStatus("Welcome to Neuro 1.1");
  }, [progress]);

  return (
    <div className="fixed inset-0 bg-[#050507] text-white z-[100] flex flex-col font-mono overflow-hidden">
      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-12 p-8 max-w-6xl mx-auto w-full">
        
        {/* Left: Security Visual */}
        <div className="w-full max-w-md relative">
           <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full"></div>
           <div className="relative border border-zinc-800 bg-black/80 rounded-lg p-6 h-64 overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_#6366f1] animate-scan"></div>
             
             {/* Header */}
             <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-4">
               <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                 <Lock size={14} /> ENCRYPTED
               </div>
               <div className="text-zinc-600 text-xs">PORT: 443</div>
             </div>

             {/* Matrix Stream */}
             <div className="space-y-1 font-mono text-xs text-zinc-600">
               {hexStream.map((line, i) => (
                 <div key={i} className={i === 0 ? "text-indigo-400 font-bold" : "opacity-50"}>{line}</div>
               ))}
             </div>

             {/* Center Icon */}
             <div className="absolute inset-0 flex items-center justify-center">
               <ScanLine size={64} className="text-indigo-500/20" />
             </div>
           </div>
        </div>

        {/* Right: Progress & Status */}
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">NEURO 1.1</h1>
            <div className="flex items-center gap-2 text-indigo-400 text-sm">
              <ShieldCheck size={16} /> 
              <span>Security Clearance: Valid</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400 uppercase tracking-wider">
              <span>{status}</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div className="h-full bg-indigo-500 transition-all duration-75 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="space-y-3">
             <StatusRow label="Neural Engine" active={progress > 15} />
             <StatusRow label="Database Uplink" active={progress > 45} />
             <StatusRow label="User Preferences" active={progress > 75} />
          </div>
        </div>
      </div>

      {/* Bottom: Features */}
      <div className="h-24 bg-zinc-900/50 border-t border-zinc-800 backdrop-blur flex items-center justify-center gap-8 md:gap-16">
        {FEATURES.map((f, i) => (
          <div key={i} className={`flex flex-col items-center gap-2 transition-all duration-500 ${progress > (20 + i * 15) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <f.icon size={20} className="text-indigo-500" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{f.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scan { 0% { top: 0; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

const StatusRow = ({ label, active }) => (
  <div className={`flex items-center gap-3 text-sm font-mono transition-colors duration-300 ${active ? 'text-zinc-200' : 'text-zinc-700'}`}>
    {active ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Loader2 size={16} className="animate-spin" />}
    {label}
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light'); // Default to light
  const [view, setView] = useState('landing');
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme Toggle Handler
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;

  // --- ROUTING LOGIC: CORRECTLY LINKS TO YOUR IMPORTS ---
  if (view !== 'landing') {
    const commonProps = { onBack: () => setView('landing') };
    
    // This mapping ensures the View State triggers the correct imported component
    const renderView = () => {
      switch(view) {
        case 'chatbot': return <Chatbot {...commonProps} />;
        case 'vision': return <Vision {...commonProps} />;
        case 'plans': return <Plans {...commonProps} />;
        case 'learning': return <Learning {...commonProps} />;
        case 'health': return <HealthApp {...commonProps} />;
        case 'news': return <NewsApp {...commonProps} />;
        case 'store': return <Store {...commonProps} />;
        case 'convo': return <Convo {...commonProps} />;
        default: return setView('landing');
      }
    };
    
    // Wrap sub-views in the theme container too
    return (
      <div className={theme === 'dark' ? 'dark bg-[#050507] text-white min-h-screen' : 'bg-zinc-50 text-zinc-900 min-h-screen'}>
        {renderView()}
      </div>
    );
  }

  // --- LANDING PAGE RENDER ---
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#050507] text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
        maskImage: 'linear-gradient(to bottom, black 40%, transparent)'
      }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="fixed top-6 w-full flex justify-center px-4 z-50">
        <div className={`flex items-center justify-between w-full max-w-4xl px-4 py-2 rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 ${isDark ? 'bg-zinc-900/80 border-white/10' : 'bg-white/80 border-zinc-200'}`}>
          
          <button onClick={() => setView('landing')} className="flex items-center gap-2 hover:opacity-80">
            <img src={LogoImg} alt="Logo" className="w-8 h-8 rounded bg-zinc-100 p-1 object-contain" />
            <span className={`font-bold text-lg hidden sm:block ${isDark ? 'text-white' : 'text-zinc-900'}`}>CNEAPEE</span>
          </button>

          <div className="flex items-center gap-2">
            <NavButton label="Vision" icon={Lightbulb} color="text-yellow-500" onClick={() => setView('vision')} isDark={isDark} />
            <NavButton label="Try+" icon={Sparkles} color="text-purple-500" onClick={() => setView('plans')} isDark={isDark} />
            
            <div className={`w-px h-4 mx-1 ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
            
            <button onClick={toggleTheme} className={`p-2 rounded-full transition ${isDark ? 'hover:bg-white/10 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-600'}`}>
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button onClick={() => alert("Login")} className={`ml-2 px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg transition hover:scale-105 ${isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white'}`}>
              Get Started <LogIn size={14} />
            </button>

            <button className="md:hidden p-2" onClick={() => setMenuOpen(true)}>
              <Menu size={20} className={isDark ? 'text-white' : 'text-black'} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center space-y-8 ${isDark ? 'bg-black/95 text-white' : 'bg-white/95 text-zinc-900'}`}>
          <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-8 p-2"><X size={24} /></button>
          <div className="text-2xl font-bold" onClick={() => { setView('chatbot'); setMenuOpen(false); }}>Try Neuro+ AI</div>
          <div className="text-2xl font-bold" onClick={() => { setView('vision'); setMenuOpen(false); }}>Vision</div>
        </div>
      )}

      {/* Hero Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-500 text-xs font-mono tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          NEURO 1.1 ONLINE
        </div>

        {/* Forced Text Color for Light Mode Contrast */}
        <h1 className={`text-5xl md:text-8xl font-bold tracking-tight mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Intelligence, <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700">Evolved.</span>
        </h1>

        <p className={`text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium transition-colors duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Uniting real-time conversation, predictive health, and adaptive learning into one seamless intelligence layer with <span className="text-indigo-500 font-semibold">Gemini</span> and <span className="text-indigo-500 font-semibold">GNews</span>.
        </p>

        <div className="flex flex-col items-center gap-8 w-full">
          <button onClick={() => setView('chatbot')} className={`px-8 py-3.5 rounded-full font-bold flex items-center gap-2 shadow-xl transition hover:scale-105 active:scale-95 ${isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white'}`}>
            Try Neuro+ AI <ArrowRight size={16} />
          </button>

          <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl">
            {FEATURES.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => setView(item.id)}
                className={`
                  group relative px-5 py-3 rounded-xl border cursor-pointer hover:scale-105 transition-all duration-300
                  ${isDark 
                    ? 'bg-white/5 border-white/10 hover:border-indigo-500/50' 
                    : 'bg-white border-zinc-200 hover:border-indigo-500 shadow-sm'}
                `}
              >
                <div className={`flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>
                  <item.icon size={16} className="text-indigo-500" /> 
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-8 px-6 text-center text-xs border-t transition-colors duration-300 ${isDark ? 'border-white/5 bg-black text-zinc-500' : 'border-zinc-200 bg-zinc-50 text-zinc-500'}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
             <span className={`block text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>CNEAPEE</span>
             Made with ❤️ in Incredible India.
          </div>
          <div className="mt-4 md:mt-0">© 2026 CNEAPEE. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

// Sub-Component for Buttons
const NavButton = ({ label, icon: Icon, color, onClick, isDark }) => (
  <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition ${isDark ? 'text-zinc-300 hover:bg-white/5 hover:text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-indigo-600'}`}>
    <Icon size={16} className={color} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);