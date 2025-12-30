import React, { useState, useEffect, useRef, memo } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowRight, GraduationCap, HeartPulse, Newspaper, 
  Store, MessageCircle, Sparkles, ChevronRight, 
  LogOut, User, Zap, MoreVertical, X, LayoutGrid, Megaphone 
} from 'lucide-react';

import LOGO from './assets/logo.png';

// ✅ CONFIRM YOUR BACKEND URL
const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api";

// ⚡ MEMOIZED COMPONENTS (Prevents Re-renders on scroll)
const BentoCard = memo(({ title, desc, icon: Icon, color, className = "", onClick }) => (
  <div onClick={onClick} className={`group relative p-5 bg-[#0e0e11] border border-white/5 hover:border-white/10 rounded-3xl cursor-pointer transition-all duration-300 active:scale-95 flex flex-col justify-between overflow-hidden ${className}`}>
    {/* Static Gradient instead of Blur for Performance */}
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.08] rounded-bl-full pointer-events-none`} />
    
    <div className="relative z-10">
      <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-10 flex items-center justify-center text-${color.replace('bg-', '')} mb-3 group-hover:scale-105 transition-transform duration-300`}>
         <Icon size={20} className="text-white opacity-90" />
      </div>
      <h3 className="text-sm font-bold text-zinc-100">{title}</h3>
      <p className="text-xs text-zinc-500 mt-1 font-medium">{desc}</p>
    </div>
    <div className="relative z-10 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
      <ChevronRight size={16} className="text-zinc-400" />
    </div>
  </div>
));

const MobileMenuItem = memo(({ onClick, label, icon: Icon, isDanger }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium active:scale-95 transition-transform ${isDanger ? 'text-red-400 bg-red-500/5' : 'text-zinc-300 hover:bg-white/5'}`}>
    <Icon size={18} /> {label}
  </button>
));

export default function Home({ user, onLoginSuccess, onLogout }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [broadcast, setBroadcast] = useState(null);
  const menuRef = useRef(null);

  // 1. Optimized Scroll Handler (Throttled via requestAnimationFrame)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true }); // passive: true improves performance
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. Analytics & Broadcast
  useEffect(() => {
    axios.post(`${API_URL}/admin/track-view`).catch(() => {});
    const fetchBroadcast = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/admin/get-broadcast`);
            if (data && data.message) setBroadcast(data.message);
        } catch (error) { console.error("Banner Error:", error); }
    };
    fetchBroadcast();
  }, []);

  const handleProtectedNav = (path) => {
    setMobileMenuOpen(false);
    if (user) navigate(path);
    else document.getElementById('google-login-btn')?.click();
  };

  return (
    // Removed noise overlay, using clean CSS radial gradient
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 relative overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#13111c] via-[#050505] to-[#050505]">
      
      {/* --- BROADCAST BANNER --- */}
      {broadcast && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-indigo-600 text-white text-xs font-bold py-2.5 px-4 text-center shadow-md animate-in slide-in-from-top duration-300 flex justify-between items-center">
            <div className="mx-auto flex items-center gap-2">
                <Megaphone size={14} className="text-yellow-300 animate-pulse"/>
                <span className="truncate max-w-[80vw]">{broadcast}</span>
            </div>
            <button onClick={() => setBroadcast(null)} className="absolute right-2 p-1.5 opacity-70 hover:opacity-100">
                <X size={14}/>
            </button>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav 
        className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-out will-change-transform
        ${broadcast ? 'top-10' : 'top-0'} 
        ${scrolled ? 'py-2' : 'py-6'}`}
      >
        <div 
          className={`
            w-[92%] max-w-6xl px-5 h-14 md:h-16 flex items-center justify-between rounded-2xl transition-all duration-300
            ${scrolled 
                ? 'bg-[#0f0f11]/90 backdrop-blur-md border border-white/5 shadow-2xl shadow-black/50' 
                : 'bg-transparent border border-transparent'}
          `}
        >
          {/* LOGO */}
          <div className="flex items-center gap-2.5 cursor-pointer active:opacity-70 transition-opacity" onClick={() => navigate('/')}>
             <img src={LOGO} alt="Logo" className="w-7 h-7 object-contain" />
             <span className="font-bold text-lg tracking-tight text-white hidden sm:block">CNEAPEE</span>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
             {['Vision', 'Pricing', 'Privacy'].map((item) => (
                 <button 
                    key={item}
                    onClick={() => handleProtectedNav(item === 'Privacy' ? '/policy' : `/${item.toLowerCase()}`)} 
                    className="hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
                 >
                    {item}
                 </button>
             ))}
          </div>

          {/* PROFILE / MENU */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div onClick={() => navigate('/profile')} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-zinc-800/50 border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                   <img src={user.picture} alt="User" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer"/>
                   <span className="text-xs font-bold text-zinc-200 hidden sm:block">{user.name.split(' ')[0]}</span>
                </div>

                {/* MOBILE MENU */}
                <div className="relative md:hidden" ref={menuRef}>
                  <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl bg-zinc-800/50 text-zinc-300 active:bg-zinc-700 transition">
                    {mobileMenuOpen ? <X size={18} /> : <MoreVertical size={18} />}
                  </button>
                  {mobileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]">
                      <div className="p-1.5 space-y-0.5">
                         <MobileMenuItem onClick={() => handleProtectedNav('/vision')} label="Vision" icon={LayoutGrid} />
                         <MobileMenuItem onClick={() => handleProtectedNav('/pricing')} label="Pricing" icon={Zap} />
                         <div className="h-px bg-white/5 my-1" />
                         <MobileMenuItem onClick={() => navigate('/profile')} label="Profile" icon={User} />
                         <MobileMenuItem onClick={onLogout} label="Logout" icon={LogOut} isDanger />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div id="google-login-btn">
                <GoogleLogin onSuccess={onLoginSuccess} onError={() => {}} theme="filled_black" shape="pill" size="medium" text="signin" />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative pt-36 px-4 max-w-6xl mx-auto pb-20">
        
        {/* LIGHTWEIGHT BACKGROUND GLOW (CSS Gradient only) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-6">
            🎉 Happy New Year 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-white drop-shadow-lg">
            Limitless AI.
          </h1>
          <p className="text-base text-zinc-400 max-w-md mx-auto leading-relaxed">
            Your all-in-one ecosystem to create, learn, and organize.
          </p>
        </div>

        {/* --- OPTIMIZED ASK BAR (No heavy blurs) --- */}
        <div className="w-full max-w-lg mx-auto relative group z-20 mb-16">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-30 blur-md group-hover:opacity-60 transition duration-500"></div>
            <button onClick={() => handleProtectedNav('/chatbot')} className="relative w-full flex items-center p-3.5 pl-5 rounded-full bg-[#09090b] text-white transition-transform active:scale-[0.98]">
                <Sparkles className="mr-3 text-indigo-500" size={18} />
                <span className="flex-1 text-left text-sm text-zinc-400 font-medium group-hover:text-zinc-200">
                  Plan your year with Cneapee...
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center">
                  <ArrowRight size={16} />
                </div>
            </button>
        </div>

        {/* --- PERFORMANCE GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[130px]">
          <BentoCard title="Learning+" desc="AI Tutor" icon={GraduationCap} color="bg-amber-500" className="col-span-2 md:col-span-1" onClick={() => handleProtectedNav('/learning')} />
          <BentoCard title="Health+" desc="Wellness" icon={HeartPulse} color="bg-rose-500" className="col-span-2 md:col-span-1" onClick={() => handleProtectedNav('/health')} />
          <BentoCard title="News+" desc="Insights" icon={Newspaper} color="bg-emerald-500" className="col-span-2 md:col-span-1" onClick={() => handleProtectedNav('/news')} />
          <BentoCard title="Convo+" desc="Chat AI" icon={MessageCircle} color="bg-cyan-500" className="col-span-2 md:col-span-1" onClick={() => handleProtectedNav('/convo')} />
          <BentoCard title="Store+" desc="Shop" icon={Store} color="bg-indigo-500" className="col-span-2 md:col-span-1" onClick={() => handleProtectedNav('/store')} />
          
          <BentoCard title="Studio+" desc="Create" icon={Sparkles} color="bg-purple-500" className="col-span-2 md:col-span-2" onClick={() => handleProtectedNav('/studio')} />
          
          {/* Upgrade Card (Simplified) */}
          <div onClick={() => handleProtectedNav('/pricing')} className="col-span-2 md:col-span-1 group relative p-5 rounded-3xl bg-gradient-to-b from-[#18181b] to-[#0e0e11] border border-white/10 hover:border-indigo-500/30 transition-all cursor-pointer active:scale-95 flex flex-col justify-between">
             <div>
               <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white mb-2 shadow-lg shadow-indigo-500/20"><Zap size={16}/></div>
               <h3 className="text-sm font-bold text-white">Pro Plan</h3>
             </div>
             <div className="flex items-center justify-between text-indigo-400 text-xs font-bold uppercase tracking-wide">
               <span>Upgrade</span> <ArrowRight size={14} />
             </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center border-t border-white/5 text-zinc-700 text-[10px] uppercase tracking-widest">
         CNEAPEE AI © 2026
      </footer>
    </div>
  );
}