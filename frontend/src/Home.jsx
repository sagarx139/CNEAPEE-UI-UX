import React, { useState, useEffect, useRef, memo } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight, GraduationCap, HeartPulse, Newspaper,
  Store, MessageCircle, Sparkles, ChevronRight,
  LogOut, Zap, X, LayoutGrid, History, // Import History icon
  Megaphone, Shield, Sun, Moon, Search, Menu
} from 'lucide-react';

import LOGO from './assets/logo2026.png';

const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api";

// --- THEME HOOK ---
const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  return { theme, toggleTheme };
};

// --- BENTO CARD ---
const BentoCard = memo(({ title, desc, icon: Icon, colorClass, onClick, isDark, className="" }) => (
  <div
    onClick={onClick}
    className={`
      group relative p-5 rounded-3xl cursor-pointer
      transition-all duration-300 active:scale-[0.98] transform-gpu
      flex flex-col justify-between overflow-hidden
      ${isDark
        ? 'bg-[#121214] border border-white/5 hover:border-white/10'
        : 'bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300'
      } ${className}
    `}
  >
    <div className={`
      w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors
      ${isDark ? 'bg-white/5 text-white' : 'bg-zinc-100 text-zinc-900'}
    `}>
         <Icon size={18} className={colorClass} />
    </div>

    <div>
      <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{title}</h3>
      <p className={`text-[12px] mt-1 font-medium leading-tight ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{desc}</p>
    </div>

    <div className={`absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`}>
      <ChevronRight size={16} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
    </div>
  </div>
));

export default function Home({ user, onLoginSuccess, onLogout }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [broadcast, setBroadcast] = useState(null);
  const [inputPrompt, setInputPrompt] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => requestAnimationFrame(() => setScrolled(window.scrollY > 10));
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    axios.post(`${API_URL}/admin/track-view`).catch(() => {});
    const fetchBroadcast = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/admin/get-broadcast`);
            if (data?.message) setBroadcast(data.message);
        } catch (e) {}
    };
    fetchBroadcast();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProtectedNav = (path) => {
    setMobileMenuOpen(false);
    if (user) navigate(path);
    else document.getElementById('google-login-btn')?.click();
  };

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (!inputPrompt.trim()) return;
    if (user) {
        navigate('/chatbot', { state: { initialPrompt: inputPrompt } });
    } else {
        document.getElementById('google-login-btn')?.click();
    }
  };

  const handleHistoryClick = () => {
    if (user) {
      navigate('/chatbot'); // Navigate to Chatbot page, assuming it handles history display
    } else {
      document.getElementById('google-login-btn')?.click();
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500/30 transition-colors duration-300 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#fafafa] text-zinc-900'}`}>

      {broadcast && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-indigo-600 text-white text-xs font-bold py-2.5 px-4 text-center flex justify-between items-center animate-in slide-in-from-top">
            <div className="mx-auto flex items-center gap-2">
                <Megaphone size={14} className="text-yellow-300 animate-pulse"/>
                <span className="truncate max-w-[80vw]">{broadcast}</span>
            </div>
            <button onClick={() => setBroadcast(null)} className="opacity-80 hover:opacity-100"><X size={14}/></button>
        </div>
      )}

      {/* --- SINGLE PILL NAVBAR (RESPONSIVE FIX) --- */}
      <nav
        className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-300 pointer-events-none
        ${broadcast ? 'top-14' : 'top-6'}
        `}
      >
        <div className={`
          pointer-events-auto flex items-center gap-2 p-2 pl-4 pr-2 rounded-full shadow-2xl border backdrop-blur-xl transition-all duration-300
          ${scrolled ? 'scale-[0.98]' : 'scale-100'}
          ${isDark
            ? 'bg-[#121214]/90 border-white/10 shadow-black/50'
            : 'bg-white/90 border-zinc-200 shadow-zinc-200/50'}
        `}>

            {/* Logo */}
            <div className="flex items-center justify-center cursor-pointer shrink-0" onClick={() => navigate('/')}>
                <img src={LOGO} alt="Logo" className="w-7 h-7 object-contain" />
            </div>

            {/* Desktop Links (Hidden on small screens) */}
            <div className="hidden md:flex items-center gap-1 ml-2">
                {['Vision', 'Pricing', 'Privacy'].map((item) => (
                    <button
                        key={item}
                        onClick={() => handleProtectedNav(item === 'Privacy' ? '/policy' : `/${item.toLowerCase()}`)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${isDark ? 'text-zinc-400 hover:text-white hover:bg-white/10' : 'text-zinc-600 hover:text-black hover:bg-zinc-100'}`}
                    >
                        {item}
                    </button>
                ))}

                {/* Vertical Divider */}
                <div className={`w-px h-5 mx-2 ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}></div>
            </div>

            {/* Spacer for Mobile (pushes controls to right) */}
            <div className="md:hidden flex-1 w-2"></div>

            {/* Mobile Menu Trigger (Visible on Mobile) */}
            <div className="md:hidden relative shrink-0" ref={menuRef}>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`p-2 rounded-full transition-colors ${isDark ? 'text-zinc-400 hover:bg-white/10' : 'text-zinc-600 hover:bg-zinc-100'}`}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                 {mobileMenuOpen && (
                 <div className={`absolute top-12 right-0 w-48 p-2 rounded-2xl border shadow-2xl z-50 animate-in fade-in zoom-in-95 origin-top-right ${isDark ? 'bg-[#18181b] border-white/10' : 'bg-white border-zinc-200'}`}>
                    {['Vision', 'Pricing', 'Privacy'].map(item => (
                      <button key={item} onClick={() => handleProtectedNav(item === 'Privacy' ? '/policy' : `/${item.toLowerCase()}`)} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium mb-1 ${isDark ? 'text-zinc-300 hover:bg-white/5' : 'text-zinc-700 hover:bg-zinc-50'}`}>
                        {item}
                      </button>
                    ))}
                    <div className={`h-px my-1 ${isDark ? 'bg-white/10' : 'bg-zinc-100'}`}></div>
                    <button onClick={onLogout} className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-2">
                       <LogOut size={14}/> Logout
                    </button>
                 </div>
               )}
            </div>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors shrink-0 ${isDark ? 'text-zinc-400 hover:text-yellow-300 hover:bg-white/10' : 'text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100'}`}
            >
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Profile Picture (Only Icon) */}
            {user ? (
                <div onClick={() => navigate('/profile')} className="cursor-pointer relative group shrink-0 ml-1">
                    <img
                        src={user.picture}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className={`w-9 h-9 rounded-full border-2 transition-all ${isDark ? 'border-zinc-700 group-hover:border-white/50' : 'border-white shadow-sm group-hover:border-zinc-300'}`}
                    />
                </div>
            ) : (
                <div id="google-login-btn" className="ml-1 shrink-0">
                    <GoogleLogin onSuccess={onLoginSuccess} onError={() => {}} type="icon" theme={isDark ? "filled_black" : "outline"} shape="circle" />
                </div>
            )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative pt-32 md:pt-48 px-4 max-w-6xl mx-auto pb-24">

        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[400px] rounded-full blur-[80px] md:blur-[100px] pointer-events-none -z-10 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-500/5'}`} />

        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <h1 className={`text-5xl sm:text-6xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
             Limitless AI Ecosystem.
          </h1>

          <p className={`text-[15px] sm:text-base max-w-xs md:max-w-xl mx-auto leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Your intelligent ecosystem to create, learn, and organize. Experience the speed of thought.
          </p>
        </div>

        {/* --- INPUT BAR --- */}
        <div className="w-full max-w-xl mx-auto mb-12 md:mb-20 px-1">
             <form
                onSubmit={handlePromptSubmit}
                className={`
                  relative group flex items-center rounded-2xl p-2 transition-all duration-300
                  ${isDark
                    ? 'bg-[#121214] border border-white/10 focus-within:border-indigo-500/50 shadow-black/50'
                    : 'bg-white border border-zinc-200 focus-within:border-indigo-500/50 shadow-xl shadow-zinc-200/50'
                  } shadow-lg
                `}
             >
                <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="  Ask anything..."
                    className={`flex-1 bg-transparent text-[15px] outline-none h-11 w-full ${isDark ? 'text-white placeholder:text-zinc-600' : 'text-zinc-900 placeholder:text-zinc-400'}`}
                />
                {/* History Button */}
<button
    type="button" // Changed to button to prevent form submission
    onClick={handleHistoryClick}
    className={`
        p-2.5 mr-1 rounded-xl transition-all duration-200 shrink-0 flex items-center justify-center
        rounded-full px-4 py-2 // Moved pill shape styling to base class
        ${isDark ? 'text-zinc-400 hover:text-indigo-400 hover:bg-white/10' : 'text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100'}
    `}
>
    <div className="flex items-center"> {/* Wrapper for icon and text */}
        <History size={20} />
        <span className="ml-2">History</span> {/* Added "History" text with margin */}
    </div>
</button>


                <button
                    type="submit"
                    className={`
                        p-3 rounded-xl transition-all duration-200 shrink-0
                        ${inputPrompt.trim()
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transform scale-100'
                          : `scale-90 ${isDark ? 'bg-white/5 text-zinc-600' : 'bg-zinc-100 text-zinc-400'}`
                        }
                    `}
                >
                    <ArrowRight size={18} />
                </button>
             </form>
        </div>

        {/* --- BENTO GRID (Responsive Fix: grid-cols-1 on small mobile) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[160px]">

          <BentoCard title="Learning" desc="AI Teaching Environment" icon={GraduationCap} colorClass="text-amber-500" isDark={isDark} onClick={() => handleProtectedNav('/learning')} />
          <BentoCard title="Health" desc="Wellness" icon={HeartPulse} colorClass="text-rose-500" isDark={isDark} onClick={() => handleProtectedNav('/health')} />
          <BentoCard title="News" desc="Briefings" icon={Newspaper} colorClass="text-emerald-500" isDark={isDark} onClick={() => handleProtectedNav('/news')} />
          <BentoCard title="Chat" desc="Assistant" icon={MessageCircle} colorClass="text-cyan-500" isDark={isDark} onClick={() => handleProtectedNav('/convo')} />
          <BentoCard title="Store+" desc="Premium Gadgets from CNEAPEE" icon={Store} colorClass="text-indigo-500" isDark={isDark} onClick={() => handleProtectedNav('/store')} />
          <BentoCard title="Audio Studio" desc="Creative Audio Suite" icon={Zap} colorClass="text-yellow-500" isDark={isDark} onClick={() => handleProtectedNav('/studio')} />
          <BentoCard title="AI IMAGINE" desc="Image Generation" icon={LayoutGrid} colorClass="text-pink-500" isDark={isDark} onClick={() => handleProtectedNav('/imagine')} />
          <BentoCard title="Enterprise Solutions" desc="Business Solutions" icon={Shield} colorClass="text-green-500" isDark={isDark} onClick={() => handleProtectedNav('/enterprise')} />
        </div>
      </main>

      <footer className={`py-10 text-center border-t ${isDark ? 'border-white/5 bg-[#050505]' : 'border-zinc-100 bg-[#fafafa]'}`}>
         <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <img src={LOGO} alt="Logo" className="w-5 h-5 grayscale" />
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>CNEAPEE WebApp v2.0.3</span>
         </div>
         <p className={`text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            © 2026 Cneapee AI Technologies. All rights reserved.
         </p>
      </footer>
    </div>
  );
}
