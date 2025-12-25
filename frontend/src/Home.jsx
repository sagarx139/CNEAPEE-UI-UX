import React, { useState, useEffect, useMemo } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom'; 
import { 
  Menu, X, ArrowRight, GraduationCap, HeartPulse, 
  Newspaper, Store as StoreIcon, Lightbulb, MessageCircle, 
  Sparkles, Snowflake, Gift, Trees, LogOut, Lock 
} from 'lucide-react';

const LOGO = '/logo.png';

// --- ANIMATION COMPONENTS ---
const MagicCursor = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.8) return; 
      const newParticle = { id: Date.now(), x: e.clientX, y: e.clientY, color: ['#FFD700', '#FF0000', '#00FF00', '#ffffff'][Math.floor(Math.random() * 4)] };
      setParticles(prev => [...prev.slice(-15), newParticle]); 
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== newParticle.id)), 800);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return <div className="fixed inset-0 pointer-events-none z-[9999]">{particles.map(p => (<div key={p.id} className="absolute w-2 h-2 rounded-full animate-ping" style={{ left: p.x, top: p.y, backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }} />))}</div>;
};

const ChristmasLights = () => {
  const seededRandom = (seed) => { const x = Math.sin(seed) * 10000; return x - Math.floor(x); };
  const delays = useMemo(() => Array.from({ length: 30 }).map((_, i) => seededRandom(i * 0.5) * 2), []);
  return (
    <div className="fixed top-0 left-0 w-full h-4 z-[40] flex justify-between px-2 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="relative">
          <div className="w-1 h-4 bg-zinc-800 mx-auto" />
          <div className="w-3 h-3 rounded-full absolute -bottom-2 left-1/2 -translate-x-1/2 animate-twinkle" style={{ backgroundColor: i % 3 === 0 ? '#ff3b3b' : i % 3 === 1 ? '#2ecc71' : '#f1c40f', boxShadow: `0 2px 10px ${i % 3 === 0 ? '#ff3b3b' : i % 3 === 1 ? '#2ecc71' : '#f1c40f'}`, animationDelay: `${delays[i]}s` }} />
        </div>
      ))}
    </div>
  );
};

const FlyingSanta = () => (
  <div className="fixed top-20 pointer-events-none z-0 animate-fly-across opacity-80" style={{ width: '200px' }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4c1 0 2-1 2-2V8l3 2 3-2v3h5l3-3M2 12l2 4h6l-2-4" /> <circle cx="18" cy="7" r="1.5" fill="red" className="animate-pulse" /></svg>
    <div className="text-[10px] text-center font-bold mt-1 opacity-50 text-white">Ho Ho Ho!</div>
  </div>
);

const FloatingOrnaments = () => {
    const seededRandom = (seed) => { const x = Math.sin(seed) * 10000; return x - Math.floor(x); };
    const ornaments = useMemo(() => [...Array(6)].map((_, i) => ({ id: i, width: seededRandom(i * 1.1) * 60 + 40, height: seededRandom(i * 1.3) * 60 + 40, background: i % 2 === 0 ? 'radial-gradient(circle, #ff0000 0%, transparent 70%)' : 'radial-gradient(circle, #00ff00 0%, transparent 70%)', left: seededRandom(i * 1.5) * 100, top: seededRandom(i * 1.7) * 100, animationDuration: seededRandom(i * 1.9) * 10 + 10, animationDelay: seededRandom(i * 2.1) * 5 })), []);
    return (<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">{ornaments.map((ornament) => (<div key={ornament.id} className="absolute rounded-full opacity-20 blur-sm animate-float-slow" style={{ width: `${ornament.width}px`, height: `${ornament.height}px`, background: ornament.background, left: `${ornament.left}%`, top: `${ornament.top}%`, animationDuration: `${ornament.animationDuration}s`, animationDelay: `-${ornament.animationDelay}s` }} />))}</div>);
};

const SnowStorm = () => {
  const createFlakes = (count, speedClass, sizeClass, opacity) => Array.from({ length: count }).map((_, i) => (<div key={i} className={`absolute bg-white rounded-full ${speedClass}`} style={{ left: `${Math.random() * 100}%`, top: -20, width: sizeClass === 'lg' ? Math.random() * 6 + 4 : Math.random() * 3 + 1, height: sizeClass === 'lg' ? Math.random() * 6 + 4 : Math.random() * 3 + 1, opacity: opacity, animationDelay: `-${Math.random() * 10}s` }} />));
  return (<div className="fixed inset-0 pointer-events-none z-1 overflow-hidden"><div className="w-full h-full absolute">{createFlakes(50, 'animate-fall-slow', 'sm', 0.4)}</div><div className="w-full h-full absolute">{createFlakes(30, 'animate-fall', 'md', 0.7)}</div><div className="w-full h-full absolute filter blur-[1px]">{createFlakes(15, 'animate-fall-fast', 'lg', 0.9)}</div></div>);
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

export default function Home({ user, onLoginSuccess, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // New state for login popup
  const navigate = useNavigate(); 

  // --- PROTECTED NAVIGATION HANDLER ---
  const handleProtectedNav = (path) => {
    if (user) {
      navigate(path);
    } else {
      setShowLoginModal(true); // Show login popup if not logged in
    }
  };

  // Wrapper for Login Success to close modal automatically
  const handleModalLoginSuccess = (response) => {
    onLoginSuccess(response);
    setShowLoginModal(false);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-300 bg-[#09090b] text-zinc-100">
      
      {/* Styles */}
      <style>{`
        @keyframes fall { 0% { transform: translateY(-20px) translateX(0px); } 100% { transform: translateY(110vh) translateX(20px); } }
        .animate-fall { animation: fall 8s linear infinite; }
        .animate-fall-slow { animation: fall 14s linear infinite; }
        .animate-fall-fast { animation: fall 5s linear infinite; }
        @keyframes fly-across { 0% { transform: translateX(-20vw) translateY(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateX(120vw) translateY(-50px); opacity: 0; } }
        .animate-fly-across { animation: fly-across 25s linear infinite; }
        @keyframes twinkle { 0%, 100% { opacity: 0.4; transform: translateX(-50%) scale(0.8); } 50% { opacity: 1; transform: translateX(-50%) scale(1.2); } }
        .animate-twinkle { animation: twinkle 1.5s ease-in-out infinite; }
        @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        @keyframes candy-cane { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        .animate-candy-cane { background-size: 200% 200%; animation: candy-cane 3s linear infinite; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <ChristmasLights />
      <FlyingSanta />
      <FloatingOrnaments />
      <SnowStorm />
      <MagicCursor />

      {/* Grid BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, black 60%, transparent)' }} className="absolute inset-0" />
      </div>

      {/* --- LOGIN MODAL POPUP --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-400">
              <Lock size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Login Required</h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Please sign in with Google to access Cneapee's AI features, plans, and tools.
            </p>
            
            <div className="flex justify-center">
               <GoogleLogin 
                  onSuccess={handleModalLoginSuccess} 
                  onError={() => console.log('Login Failed')} 
                  theme="filled_black" 
                  shape="pill" 
                  size="large" 
                  text="signin_with" 
                  width="250" 
               />
            </div>
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 flex justify-center pt-8 px-4">
        <div className="flex items-center justify-between w-full max-w-5xl px-5 py-3 rounded-full border shadow-xl backdrop-blur-xl transition-all duration-300 bg-zinc-900/60 border-white/10">
          
          {/* Logo click also protected or can be public */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition group">
            <div className="w-9 h-9 bg-gradient-to-tr from-red-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <img src={LOGO} alt="CNEAPEE" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block text-white">CNEAPEE</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Protected Nav Buttons */}
            <NavButton label="Vision" icon={Lightbulb} onClick={() => handleProtectedNav('/vision')} />
            <NavButton label="Plans" icon={Sparkles} onClick={() => handleProtectedNav('/plans')} />
            
            <div className="w-px h-5 mx-2 bg-zinc-700" />
            
            {/* --- USER PROFILE SECTION --- */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 ml-1 animate-fade-in group relative">
                {user.picture ? (
                  <img src={user.picture} alt="profile" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full border border-zinc-500 shadow-sm" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                
                <div className="hidden sm:flex flex-col">
                    <span className="text-sm font-bold text-white leading-none max-w-[100px] truncate">{user.name}</span>
                    <button onClick={onLogout} className="text-[10px] text-zinc-400 hover:text-red-400 leading-none mt-1 flex items-center gap-1 transition-colors text-left">Log out</button>
                </div>
                <button onClick={onLogout} className="sm:hidden p-1 text-zinc-400 hover:text-red-400"><LogOut size={16} /></button>
              </div>
            ) : (
              <div className="ml-1">
                <GoogleLogin onSuccess={onLoginSuccess} onError={() => console.log('Login Failed')} theme="filled_black" shape="pill" size="medium" text="signin" width="100" />
              </div>
            )}
            
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
          
          {/* Protected Mobile Links */}
          <div className="text-3xl font-bold tracking-tight" onClick={() => { setMenuOpen(false); handleProtectedNav('/chatbot'); }}>Ask Cneapee</div>
          <div className="text-3xl font-bold tracking-tight opacity-70" onClick={() => { setMenuOpen(false); handleProtectedNav('/vision'); }}>Vision</div>
          <div className="text-3xl font-bold tracking-tight opacity-70" onClick={() => { setMenuOpen(false); handleProtectedNav('/plans'); }}>Plans</div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 flex flex-col items-center pt-40 px-4 pb-20 max-w-7xl mx-auto">

        <div className="w-full max-w-3xl mb-12 relative overflow-hidden rounded-3xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl bg-zinc-900/40 border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-green-500/10 to-blue-500/20 opacity-60 animate-candy-cane" />
            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="p-5 rounded-full shadow-inner bg-zinc-800 text-red-400"><Gift size={36} className="animate-bounce" /></div>
                <div className="flex-1">
                    <h3 className="text-3xl font-bold flex flex-wrap items-center justify-center sm:justify-start gap-3 text-white">
                        Merry Christmas <Snowflake size={24} className="text-blue-400 animate-spin-slow" />
                        <span className="text-sm font-normal px-2 py-1 bg-red-500 text-white rounded-md">Ho Ho Ho!</span>
                    </h3>
                    <p className="mt-3 text-lg leading-relaxed font-medium text-zinc-300">Unlock your festive creativity with our new holiday AI models.</p>
                </div>
            </div>
        </div>

        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 text-white">
            Think bigger. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-green-500 animate-candy-cane">Celebrate faster.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed text-zinc-400">
            Your all-in-one intelligence layer for learning, health, and creativity.
          </p>
        </div>

        {/* --- INPUT COMPONENT (Protected) --- */}
        <div className="w-full max-w-2xl mx-auto relative group z-20 mb-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-green-500 to-gold-500 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500 animate-pulse"></div>
            
            <div 
                onClick={() => handleProtectedNav('/chatbot')} // <--- Protected
                className="relative flex items-center p-3 pl-6 rounded-full cursor-pointer transition-all duration-300 border bg-[#151515] border-zinc-800 text-white hover:bg-[#1a1a1a]"
            >
                <Sparkles className="mr-4 text-yellow-400" size={24} />
                <div className="flex-1 text-xl font-medium opacity-60">Ask Cneapee to plan your holiday...</div>
                <div className="p-3 rounded-full flex items-center justify-center transition-transform group-hover:rotate-[-45deg] duration-300 bg-zinc-800 text-white"><ArrowRight size={22} /></div>
            </div>
        </div>

        {/* --- FEATURES GRID (Protected) --- */}
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
            {FEATURES.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => handleProtectedNav(`/${item.id}`)} // <--- Protected
                className="group relative flex items-center gap-5 p-6 rounded-3xl border cursor-pointer transition-all duration-500 bg-zinc-900/40 border-white/5 hover:bg-zinc-800/60"
              >
                <div className={`p-4 rounded-2xl transition-all duration-300 ring-1 ring-inset ring-black/5 bg-zinc-800 group-hover:scale-110 ${item.color}`}><item.icon size={28} /></div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-zinc-100">{item.label}</h4>
                  <p className="text-sm mt-1 font-medium text-zinc-500 group-hover:text-zinc-400">Launch Application</p>
                </div>
                <div className={`absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${item.border}`} />
              </div>
            ))}
        </div>
      </main>

      <footer className="py-12 border-t relative z-10 border-white/5 bg-[#050507]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
           <div className="flex items-center gap-2 mb-4 md:mb-0"><Trees size={20} className="text-green-600" /><span className="font-semibold">CNEAPEE © 2026</span></div>
           <div className="flex gap-8">
             <Link to="/policy" className="hover:text-white transition">Privacy & Terms</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}

const NavButton = ({ label, icon: Icon, onClick }) => (
  <button onClick={onClick} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all text-zinc-400 hover:text-white hover:bg-white/5">
    {Icon && <Icon size={16} />}
    {label}
  </button>
);