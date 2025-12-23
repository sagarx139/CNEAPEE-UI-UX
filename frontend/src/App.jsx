import React, { useState } from 'react';
import { 
  Moon, Sun, Menu, X, ArrowRight, GraduationCap, HeartPulse, 
  Newspaper, Store as StoreIcon, Lightbulb, MessageCircle, LogIn, 
  Sparkles 
} from 'lucide-react';
//add favicon logo.png
// inject favicon from src/assets/logo.png
(() => {
  try {
    const existing = document.querySelector("link[rel~='icon']");
    if (existing) existing.href = Logo;
    else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = Logo;
      document.head.appendChild(link);
    }
  } catch {
    // noop for non-browser environments
  }
})();
// --- COMPONENT IMPORTS ---
import Chatbot from './Chatbot';
import Vision from './Vision';
import Plans from './Plans';
import Learning from './Learning';
import HealthApp from './HealthApp';
import NewsApp from './NewsApp';
import Store from './Store';
import Convo from './Convo';
import Studio from './Studio';
import Logo from './assets/logo.png';

// --- FEATURES DATA ---
const FEATURES = [
  { label: 'Learning+', icon: GraduationCap, id: 'learning' },
  { label: 'Health+', icon: HeartPulse, id: 'health' },
  { label: 'News+', icon: Newspaper, id: 'news' },
  { label: 'Store+', icon: StoreIcon, id: 'store' },
  { label: 'Convo+', icon: MessageCircle, id: 'convo' },
  { label: 'Studio+', icon: Sparkles, id: 'studio' }
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [theme, setTheme] = useState('light');
  const [view, setView] = useState('landing');
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme Toggle Handler
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- ROUTING LOGIC ---
  if (view !== 'landing') {
    // Standard back handler for simple components
    const commonProps = { onBack: () => setView('landing') };
    
    // Universal navigation handler for complex components
    const handleNavigate = (target) => {
      if (target === 'home') setView('landing');
      else setView(target);
    };

    const renderView = () => {
      switch(view) {
        // Complex components using handleNavigate
        case 'chatbot': return <Chatbot onNavigate={handleNavigate} />;
        case 'vision': return <Vision onNavigate={handleNavigate} />;
        case 'plans': return <Plans onNavigate={handleNavigate} />;
        case 'convo': return <Convo onNavigate={handleNavigate} />;
        
        // Studio specifically needs onBack to trigger the Home button logic
        case 'studio': return <Studio onBack={() => handleNavigate('home')} />;
        
        // Simple components using commonProps
        case 'learning': return <Learning {...commonProps} />;
        case 'health': return <HealthApp {...commonProps} />;
        case 'news': return <NewsApp {...commonProps} />;
        case 'store': return <Store {...commonProps} />;
        
        default: return setView('landing');
      }
    };
    
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
            <img src={Logo} alt="Logo" className="w-8 h-8 rounded bg-zinc-100 p-1 object-contain" />
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
          <div className="text-2xl font-bold" onClick={() => { setView('chatbot'); setMenuOpen(false); }}>Try Flare AI</div>
          <div className="text-2xl font-bold" onClick={() => { setView('vision'); setMenuOpen(false); }}>Vision</div>
          <div className="text-2xl font-bold" onClick={() => { setView('plans'); setMenuOpen(false); }}>Plans</div>
        </div>
      )}

      {/* Hero Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">

        <h1 className={`text-5xl md:text-8xl font-bold tracking-tight mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Intelligence, <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700">Evolved.</span>
        </h1>

        <p className={`text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium transition-colors duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Uniting real-time conversation, predictive health, and adaptive learning into one seamless intelligence layer with <span className="text-indigo-500 font-semibold">Gemini</span> and <span className="text-indigo-500 font-semibold">GNews</span>.
        </p>

        <div className="flex flex-col items-center gap-8 w-full">
          <button onClick={() => setView('chatbot')} className={`px-8 py-3.5 rounded-full font-bold flex items-center gap-2 shadow-xl transition hover:scale-105 active:scale-95 ${isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white'}`}>
            Try AI <ArrowRight size={16} />
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
    {Icon && <Icon size={16} className={color} />}
    <span className="hidden sm:inline">{label}</span>
  </button>
);