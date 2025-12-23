import React, { useState, useEffect, useRef } from 'react';
import { Home, ChevronDown, Sun, Moon, Check, Minus, Sliders, Zap, Database, Users, Shield } from 'lucide-react';

// --- CONFIGURATION ---
const PERIODS = {
  'monthly': { m: 1, d: 0, s: '/mo', l: 'Monthly' },
  '3-month': { m: 3, d: 0.02, s: '/3mo', l: '3 Months' },
  '6-month': { m: 6, d: 0.05, s: '/6mo', l: '6 Months' },
  '12-month': { m: 12, d: 0.10, s: '/yr', l: 'Yearly' }
};

const CATEGORIES = [
  { title: "Essentials", desc: "Core access.", plans: [
    { id: 'free', name: "Free", price: 0, color: 'zinc', feats: [{t:"Standard Model"}, {t:"Limited Queries"}] },
    { id: 'health', name: "Health+", price: 59, color: 'emerald', badge: "Coming Soon", extra: "+ ₹7999 Joining", feats: [{t:"Health Watch", i:true}, {t:"Deep Analytics", i:true}] },
    { id: 'news', name: "News+", price: 59, color: 'orange', badge: "Coming Soon", feats: [{t:"2 Live Channels", i:true}, {t:"Unbiased News", i:true}] }
  ]},
  { title: "AI Intelligence", desc: "Supercharge productivity.", plans: [
    { id: 'rapid', name: "AI Rapid", price: 99, color: 'blue', feats: [{t:"Ad-Free", i:true}, {t:"Standard Speed", i:true}, {t:"High Limits"}] },
    { id: 'ace', name: "AI Ace", price: 399, color: 'indigo', badge: "POPULAR", feats: [{t:"Priority Access", i:true}, {t:"Advanced Models", i:true}, {t:"Unl. History"}] },
    { id: 'ult', name: "AI Ultimate", price: 999, color: 'purple', feats: [{t:"Reasoning Models", i:true}, {t:"Early Access", i:true}, {t:"Ded. Support", i:true}] }
  ]},
  { title: "Creator Studio", desc: "For storytellers.", plans: [
    { id: 'lite', name: "Studio Lite", price: 129, color: 'pink', feats: [{t:"Basic Tools", i:true}, {t:"1080p Export", i:true}, {t:"5GB Storage"}] },
    { id: 'eg', name: "Studio EG", price: 299, color: 'rose', feats: [{t:"Adv. Effects", i:true}, {t:"4K Export", i:true}, {t:"Stock Lib"}] },
    { id: 'x', name: "Studio X", price: 499, color: 'fuchsia', feats: [{t:"AI Gen Tools", i:true}, {t:"Team Collab", i:true}, {t:"Prio. Render", i:true}] }
  ]}
];

// Helper to generate styles dynamically based on color name
const getStyles = (c) => ({
  border: `border-${c}-500/20 hover:border-${c}-500/50`,
  btn: c === 'zinc' ? 'border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5' : `bg-${c}-500/10 text-${c}-600 dark:text-${c}-400 hover:bg-${c}-500/20`,
  icon: `text-${c}-500`
});

// --- SUB-COMPONENTS ---
const RangeControl = ({ label, val, set, min, max, step, unit, col, sub }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-sm font-medium"><label>{label}</label><span className={`text-${col}-500`}>{val}{unit}</span></div>
    <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(Number(e.target.value))} className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-200 dark:bg-zinc-700 accent-${col}-500`}/>
    {sub && <p className="text-xs text-zinc-500">{sub}</p>}
  </div>
);

const CustomBuilder = ({ period }) => {
  const [vals, setVals] = useState({ tokens: 100, storage: 20, members: 1 });
  const [addons, setAddons] = useState({ noAds: true, priority: false, api: false });
  
  const baseTotal = 50 + (vals.tokens * 0.5) + (vals.storage * 2) + (vals.members * 150) + (addons.noAds?50:0) + (addons.priority?200:0) + (addons.api?500:0);
  const finalPrice = Math.round(baseTotal * (1 - period.d));

  return (
    <div className="max-w-4xl mx-auto animate-fade-in bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row gap-12">
      <div className="flex-1 space-y-8">
        {[
          { l: "AI Tokens", k:'tokens', min:10, max:1000, s:10, u:'k', c:'indigo', icon: Zap, sub:"Includes reasoning models" },
          { l: "Storage", k:'storage', min:5, max:500, s:5, u:'GB', c:'blue', icon: Database },
          { l: "Team", k:'members', min:1, max:50, s:1, u:'', c:'pink', icon: Users }
        ].map(i => (
          <div key={i.k}>
            <h3 className="font-bold mb-4 flex gap-2"><i.icon size={20} className={`text-${i.c}-500`}/>{i.l}</h3>
            <RangeControl label={i.l} val={vals[i.k]} set={v => setVals(p => ({...p, [i.k]: v}))} min={i.min} max={i.max} step={i.s} unit={i.u} col={i.c} sub={i.sub} />
          </div>
        ))}
        <div>
          <h3 className="font-bold mb-4 flex gap-2"><Shield size={20} className="text-emerald-500"/> Add-ons</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries({noAds:'Ad-Free', priority:'Priority', api:'API Access'}).map(([k,l]) => (
              <button key={k} onClick={() => setAddons(p => ({...p, [k]: !p[k]}))} className={`p-3 rounded-xl border text-sm flex justify-between ${addons[k] ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500' : 'border-zinc-200 dark:border-white/10'}`}>{l}{addons[k] && <Check size={14}/>}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full md:w-80 bg-zinc-50 dark:bg-black/20 rounded-2xl p-6 border border-zinc-200 dark:border-white/5 h-fit">
        <h4 className="font-bold mb-6">Estimated Cost</h4>
        <div className="text-5xl font-bold mb-1">₹{finalPrice}<span className="text-zinc-500 text-base font-normal">{period.s}</span></div>
        {period.d > 0 && <div className="text-emerald-500 text-sm mb-6">-{period.d*100}% Discount Applied</div>}
        <button className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90">Create Plan</button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Plans = ({ onNavigate }) => {
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark'));
  const [period, setPeriod] = useState('monthly');
  const [menuOpen, setMenuOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleMouseMove = (e) => {
    if (ref.current) {
      ref.current.querySelectorAll('.card').forEach(card => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--y', `${e.clientY - rect.top}px`);
      });
    }
  };

  const calcPrice = (price) => Math.round(price * PERIODS[period].m * (1 - PERIODS[period].d));

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`min-h-screen transition-colors duration-300 font-sans ${theme === 'dark' ? 'bg-[#030305] text-zinc-300' : 'bg-zinc-50 text-zinc-900'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .grid-bg { background-image: linear-gradient(rgba(120,120,120,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,120,0.05) 1px, transparent 1px); background-size: 40px 40px; mask-image: linear-gradient(black 40%, transparent); }
        .spotlight { background: radial-gradient(500px circle at var(--x) var(--y), rgba(255,255,255,0.06), transparent 40%); }
      `}</style>
      
      <div className="fixed inset-0 grid-bg -z-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />

      {/* Header */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className={`backdrop-blur-xl border rounded-full p-1.5 flex items-center gap-1 shadow-sm ${theme === 'dark' ? 'bg-zinc-900/80 border-white/10' : 'bg-white/80 border-zinc-200'}`}>
          <button onClick={() => onNavigate('home')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-500/10"><Home size={18} /></button>
          <div className="w-px h-4 bg-current opacity-20 mx-1" />
          
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-zinc-500/10 text-sm font-bold min-w-[120px] justify-between">
              {PERIODS[period].l} <ChevronDown size={14} className="opacity-60" />
            </button>
            {menuOpen && (
              <div className={`absolute top-full left-0 mt-2 w-48 border rounded-2xl shadow-xl p-1.5 z-50 ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
                {Object.entries(PERIODS).map(([k, d]) => (
                  <button key={k} onClick={() => { setPeriod(k); setMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium hover:bg-zinc-500/10 flex justify-between">
                    {d.l} {d.d > 0 && <span className="text-emerald-500 text-xs">-{d.d*100}%</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-current opacity-20 mx-1" />
          <button onClick={() => setCustomMode(!customMode)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${customMode ? 'bg-indigo-500 text-white' : 'hover:bg-zinc-500/10'}`}>
            <Sliders size={14} /> <span className="hidden sm:inline">Customize</span>
          </button>
          <div className="w-px h-4 bg-current opacity-20 mx-1" />
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-500/10">{theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}</button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">{customMode ? "Design Your Perfect Plan" : "Choose your plan"}</h2>
          <p className="text-zinc-500">{customMode ? "Tailor resources to your exact needs." : "Unlock the full potential of CNEAPEE."}</p>
        </div>

        {customMode ? (
          <CustomBuilder period={PERIODS[period]} />
        ) : (
          CATEGORIES.map((cat, i) => (
            <div key={i} className="mb-20 animate-fade-in">
              <div className="flex items-center gap-4 mb-8"><div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"/><h3 className="text-xl font-bold">{cat.title}</h3><div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"/></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cat.plans.map(p => {
                  const s = getStyles(p.color);
                  return (
                    <div key={p.id} className={`card group relative p-6 rounded-3xl border transition-all duration-300 flex flex-col ${s.border} ${theme==='dark'?'bg-zinc-900/40':'bg-white'}`}>
                      <div className="absolute inset-0 spotlight opacity-0 group-hover:opacity-100 transition pointer-events-none rounded-3xl" />
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between mb-1"><h3 className="text-lg font-bold">{p.name}</h3>{p.badge && <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{p.badge}</span>}</div>
                        <div className="mb-6"><span className="text-4xl font-bold tracking-tight">{p.price > 0 && '₹'}{calcPrice(p.price)}</span><span className="text-sm text-zinc-500 ml-1">{PERIODS[period].s}</span></div>
                        {p.extra && <div className="mb-4"><span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">{p.extra}</span></div>}
                        <ul className="space-y-3 mb-8 text-sm flex-grow">
                          {p.feats.map((f, fi) => (
                            <li key={fi} className="flex gap-2">{f.i ? <Check size={16} className={f.i === true ? s.icon : f.i}/> : <Minus size={16} className="opacity-30"/>}<span>{f.t}</span></li>
                          ))}
                        </ul>
                        <button className={`w-full py-2.5 rounded-xl font-medium text-sm transition ${s.btn}`}>Select {p.name}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <p className="text-center text-xs text-zinc-500 mt-12">Prices in INR. Taxes may apply. © 2025 CNEAPEE.</p>
      </main>
    </div>
  );
};

export default Plans;