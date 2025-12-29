import React, { useState, useEffect, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowRight, GraduationCap, HeartPulse, Newspaper, 
  Store, MessageCircle, Sparkles, ChevronRight, 
  LogOut, User, Zap, MoreVertical, X, LayoutGrid 
} from 'lucide-react';

// ✅ Ensure this path matches your folder structure
import LOGO from './assets/logo.png';

export default function Home({ user, onLoginSuccess, onLogout }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click Outside to Close Menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Analytics
  useEffect(() => {
    axios.post('https://cneapee-backend-703598443794.asia-south1.run.app/api/admin/track-view').catch(() => {});
  }, []);

  const handleProtectedNav = (path) => {
    setMobileMenuOpen(false);
    if (user) navigate(path);
    else document.getElementById('google-login-btn')?.click();
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white font-sans selection:bg-indigo-500/30 relative overflow-x-hidden">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div 
          className={`
            w-full max-w-6xl mx-4 px-6 h-16 flex items-center justify-between rounded-full transition-all duration-300
            ${scrolled ? 'bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 shadow-lg' : 'bg-transparent border border-transparent'}
          `}
        >
          {/* 1. LOGO (Clean, No Background) */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
             <img 
               src={LOGO} 
               alt="Cneapee Logo" 
               className="w-8 h-8 object-contain transition-transform group-hover:scale-105" 
             />
             <span className="font-bold text-xl tracking-tight hidden sm:block">CNEAPEE</span>
          </div>

          {/* 2. DESKTOP LINKS (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
             <button onClick={() => handleProtectedNav('/vision')} className="hover:text-white transition-colors">Vision</button>
             <button onClick={() => handleProtectedNav('/pricing')} className="hover:text-white transition-colors">Pricing</button>
             <button onClick={() => handleProtectedNav('/policy')} className="hover:text-white transition-colors">Privacy</button>
          </div>

          {/* 3. RIGHT SIDE: PROFILE + MOBILE MENU */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Profile Pill */}
                <div 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                >
                   <img src={user.picture} alt="User" className="w-7 h-7 rounded-full border border-white/10" referrerPolicy="no-referrer"/>
                   <span className="text-xs font-bold text-zinc-200">{user.name.split(' ')[0]}</span>
                </div>

                {/* 3-DOT MENU BUTTON (Visible on Mobile Only) */}
                <div className="relative md:hidden" ref={menuRef}>
                  <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                  >
                    {mobileMenuOpen ? <X size={20} /> : <MoreVertical size={20} />}
                  </button>

                  {/* MOBILE DROPDOWN MENU */}
                  {mobileMenuOpen && (
                    <div className="absolute right-0 top-full mt-3 w-48 bg-[#121214] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up origin-top-right z-[60]">
                      <div className="p-2 space-y-1">
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
                <GoogleLogin onSuccess={onLoginSuccess} onError={() => console.log('Login Failed')} theme="filled_black" shape="pill" size="medium" text="signin" />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative pt-40 px-4 max-w-6xl mx-auto pb-24">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
            <Sparkles size={12} /> CNEAPEE AI Wishing you all a Happy New Year 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-sm">
            Architect Your Future.
          </h1>
          
          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            The all-in-one AI ecosystem to organize your life, master new skills, and create without limits.
          </p>
        </div>

        {/* --- ASK BAR --- */}
        <div className="w-full max-w-xl mx-auto relative group z-20 mb-20">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
            <button 
                onClick={() => handleProtectedNav('/chatbot')}
                className="relative w-full flex items-center p-4 pl-6 rounded-full bg-[#0a0a0c] border border-white/10 text-white hover:bg-[#121215] transition-all duration-300"
            >
                <Sparkles className="mr-3 text-indigo-400 animate-pulse" size={20} />
                <span className="flex-1 text-left text-base text-zinc-400 font-medium group-hover:text-zinc-200 transition-colors">
                  Ask Cneapee to plan your year...
                </span>
                <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center transform group-hover:rotate-[-45deg] transition-transform duration-300">
                  <ArrowRight size={18} />
                </div>
            </button>
        </div>

        {/* --- OPTIMIZED BENTO GRID (Vision Removed) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[140px]">
          
          {/* Row 1 */}
          <BentoCard 
            title="Learning+" 
            desc="AI Tutor" 
            icon={GraduationCap} 
            color="bg-amber-500"
            className="col-span-2 md:col-span-1" 
            onClick={() => handleProtectedNav('/learning')}
          />

          <BentoCard 
            title="Health+" 
            desc="Wellness" 
            icon={HeartPulse} 
            color="bg-rose-500"
            className="col-span-2 md:col-span-1"
            onClick={() => handleProtectedNav('/health')}
          />

          <BentoCard 
            title="News+" 
            desc="Insights" 
            icon={Newspaper} 
            color="bg-emerald-500"
            className="col-span-2 md:col-span-1"
            onClick={() => handleProtectedNav('/news')}
          />

           <BentoCard 
            title="Convo+" 
            desc="Chat AI" 
            icon={MessageCircle} 
            color="bg-cyan-500"
            className="col-span-2 md:col-span-1"
            onClick={() => handleProtectedNav('/convo')}
          />

          {/* Row 2 */}
          <BentoCard 
             title="Store+" 
             desc="Marketplace"
             icon={Store} 
             color="bg-indigo-500"
             className="col-span-2 md:col-span-1"
             onClick={() => handleProtectedNav('/store')}
          />

          <BentoCard 
             title="Studio+" 
             desc="Creative Tools"
             icon={Sparkles} 
             color="bg-purple-500"
             className="col-span-2 md:col-span-2" 
             onClick={() => handleProtectedNav('/studio')}
          />

          {/* Upgrade Card */}
          <div onClick={() => handleProtectedNav('/pricing')} className="col-span-2 md:col-span-1 group relative p-5 rounded-3xl bg-gradient-to-br from-[#121214] to-[#0a0a0c] border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col justify-between overflow-hidden">
             <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div>
               <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white mb-2 shadow-lg shadow-indigo-500/30"><Zap size={16}/></div>
               <h3 className="text-sm font-bold text-white">Pro</h3>
             </div>
             <div className="flex items-center justify-between text-indigo-300 text-xs font-medium">
               <span>Upgrade</span> <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
             </div>
          </div>

        </div>

      </main>

      <footer className="py-8 text-center border-t border-white/5 text-zinc-600 text-xs relative z-10">
         <p>CNEAPEE AI © 2026. All Systems Operational.</p>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const MobileMenuItem = ({ onClick, label, icon: Icon, isDanger }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isDanger ? 'text-red-400 hover:bg-red-500/10' : 'text-zinc-300 hover:text-white hover:bg-white/5'}`}
  >
    <Icon size={16} /> {label}
  </button>
);

const BentoCard = ({ title, desc, icon: Icon, color, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`group relative p-5 bg-[#0e0e11] border border-white/5 hover:border-white/10 rounded-3xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between overflow-hidden ${className}`}
  >
    <div className={`absolute -top-10 -right-10 p-24 ${color} opacity-[0.05] rounded-full blur-3xl group-hover:opacity-[0.1] transition-opacity`} />
    
    <div className="relative z-10">
      <div className={`w-9 h-9 rounded-xl ${color} bg-opacity-10 flex items-center justify-center text-${color.replace('bg-', '')} mb-3 group-hover:scale-105 transition-transform`}>
         <Icon size={18} className="text-white opacity-90" />
      </div>
      <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors mt-0.5">{desc}</p>
    </div>

    <div className="relative z-10 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0">
      <ChevronRight size={16} className="text-zinc-400" />
    </div>
  </div>
);