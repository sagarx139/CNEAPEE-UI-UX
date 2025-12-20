import React, { useState, useEffect, useRef } from 'react';
import { Home, ChevronDown, Moon, Sun, Check, Minus } from 'lucide-react';

const PERIODS = {
  'monthly': { months: 1, discount: 0, suffix: '/mo', label: 'Monthly' },
  '3-month': { months: 3, discount: 0.10, suffix: '/3mo', label: '3 Months' },
  '6-month': { months: 6, discount: 0.15, suffix: '/6mo', label: '6 Months' },
  '12-month': { months: 12, discount: 0.30, suffix: '/yr', label: 'Yearly' }
};

const PLANS_DATA = [
  {
    id: 'free',
    name: "Free",
    desc: "Essential access.",
    basePrice: 0,
    features: [
      { text: "Standard Model", included: true },
      { text: "Limited Queries", included: true }
    ],
    buttonText: "Get Started",
    borderColor: "border-zinc-200 dark:border-white/5",
    hoverBorder: "hover:border-zinc-300 dark:hover:border-white/20",
    buttonStyle: "border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-white/5"
  },
  {
    id: 'health',
    name: "Health+",
    desc: "Wellness & Analytics.",
    basePrice: 29,
    extra: "+ ₹2999 Joining Fee",
    features: [
      { text: "Health Watch Included", included: true, highlight: "text-emerald-500" },
      { text: "Deep Analytics", included: true, highlight: "text-emerald-500" }
    ],
    buttonText: "Select Health+",
    borderColor: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/50",
    buttonStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
    priceColor: "text-zinc-900 dark:text-white"
  },
  {
    id: 'plus-ads',
    name: "Plus (Ads)",
    desc: "Enhanced, ad-supported.",
    basePrice: 59,
    features: [
      { text: "Enhanced Access", included: true, highlight: "text-blue-500" },
      { text: "Ad-Supported", included: false }
    ],
    buttonText: "Select Plus (Ads)",
    borderColor: "border-blue-500/20",
    hoverBorder: "hover:border-blue-500/50",
    buttonStyle: "border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10",
    priceColor: "text-zinc-900 dark:text-white"
  },
  {
    id: 'plus',
    name: "Plus",
    badge: "HOT",
    desc: "Ad-free standard.",
    basePrice: 99,
    features: [
      { text: "Ad-Free", included: true, highlight: "text-indigo-500" },
      { text: "High Limits", included: true, highlight: "text-indigo-500" },
      { text: "Fast Response", included: true, highlight: "text-indigo-500" }
    ],
    buttonText: "Go Plus",
    borderColor: "border-indigo-500/30",
    hoverBorder: "hover:border-indigo-500/60",
    shadow: "shadow-lg shadow-indigo-500/5",
    buttonStyle: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20",
    priceColor: "text-zinc-900 dark:text-white"
  },
  {
    id: 'plus-max',
    name: "Plus Max",
    desc: "Ultimate power.",
    basePrice: 299,
    features: [
      { text: "Advanced Models", included: true, highlight: "text-purple-500" },
      { text: "Priority SLA", included: true, highlight: "text-purple-500" },
      { text: "Early Access", included: true, highlight: "text-purple-500" }
    ],
    buttonText: "Max Out",
    borderColor: "border-purple-500/20",
    hoverBorder: "hover:border-purple-500/50",
    buttonStyle: "border border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10",
    priceColor: "text-zinc-900 dark:text-white"
  },
  {
    id: 'enterprise',
    name: "Enterprise",
    desc: "Custom scale.",
    basePrice: "Custom",
    features: [
      { text: "Custom Models", included: true },
      { text: "API Access", included: true }
    ],
    buttonText: "Contact Sales",
    borderColor: "border-transparent",
    hoverBorder: "hover:border-zinc-700",
    bgOverride: "bg-zinc-900 dark:bg-white",
    textOverride: "text-white dark:text-black",
    buttonStyle: "bg-white dark:bg-zinc-900 text-black dark:text-white hover:scale-105"
  }
];

export default function Plans() {
  const [theme, setTheme] = useState('dark');
  const [currentPeriod, setCurrentPeriod] = useState('monthly');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Theme Toggle Effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle Click Outside Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Spotlight Effect
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--y', `${e.clientY - rect.top}px`);
      });
    }
  };

  // Price Calculation Helper
  const getPriceDisplay = (basePrice) => {
    if (typeof basePrice !== 'number') return basePrice;
    
    const periodData = PERIODS[currentPeriod];
    if (currentPeriod === 'monthly') return basePrice;
    
    const total = basePrice * periodData.months;
    return Math.round(total * (1 - periodData.discount));
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#030305] dark:text-zinc-300 transition-colors duration-300 overflow-x-hidden font-sans`}
    >
      {/* External Styles/Fonts simulation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .grid-bg { 
          background-image: linear-gradient(rgba(120,120,120,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,120,0.03) 1px, transparent 1px); 
          background-size: 40px 40px; 
          mask-image: linear-gradient(black 40%, transparent); 
          -webkit-mask-image: linear-gradient(black 40%, transparent);
        }
        .spotlight { 
          background: radial-gradient(500px circle at var(--x) var(--y), rgba(255,255,255,0.06), transparent 40%); 
        }
        .dark .spotlight { 
          background: radial-gradient(500px circle at var(--x) var(--y), rgba(255,255,255,0.04), transparent 40%); 
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
      `}</style>

      {/* Backgrounds */}
      <div className="fixed inset-0 grid-bg pointer-events-none -z-10"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full p-1.5 flex items-center gap-1 shadow-2xl">
          
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
            <Home size={18} />
          </button>

          <div className="w-px h-4 bg-zinc-300 dark:bg-white/10 mx-1"></div>

          {/* Plan Selector */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-sm font-semibold text-zinc-900 dark:text-white transition w-40 justify-between"
            >
              <span>{PERIODS[currentPeriod].label}</span>
              <ChevronDown size={14} className="opacity-60" />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in duration-200">
                {Object.entries(PERIODS).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentPeriod(key);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition flex justify-between"
                  >
                    {data.label}
                    {data.discount > 0 && (
                      <span className="text-green-500 text-xs">-{data.discount * 100}%</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-zinc-300 dark:bg-white/10 mx-1"></div>

          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {PLANS_DATA.map((plan) => (
            <div 
              key={plan.id}
              className={`
                card group relative p-6 rounded-3xl transition-all duration-300 flex flex-col h-full
                ${plan.bgOverride || "bg-white dark:bg-zinc-900/40"}
                ${plan.borderColor} ${plan.hoverBorder}
                ${plan.shadow || ""}
                ${plan.id === 'plus' ? 'transform hover:-translate-y-1' : ''}
              `}
            >
              {/* Spotlight Overlay */}
              <div className="absolute inset-0 spotlight opacity-0 group-hover:opacity-100 transition pointer-events-none rounded-3xl"></div>
              
              <div className={`relative z-10 flex flex-col h-full ${plan.textOverride || "text-zinc-900 dark:text-white"}`}>
                
                {/* Title & Badge */}
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  {plan.badge && (
                    <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                </div>
                
                <p className={`text-xs mb-6 ${plan.textOverride ? "opacity-70" : "text-zinc-500"}`}>
                  {plan.desc}
                </p>

                {/* Price */}
                <div className={`mb-6 ${plan.textOverride ? "" : plan.priceColor}`}>
                   <span className="text-4xl font-bold transition-all duration-300">
                     {typeof plan.basePrice === 'number' ? '' : ''} 
                     {typeof plan.basePrice === 'number' && '₹'}
                     {getPriceDisplay(plan.basePrice)}
                   </span>
                   {typeof plan.basePrice === 'number' && (
                     <span className={`text-sm ml-1 ${plan.textOverride ? "opacity-70" : "text-zinc-500"}`}>
                       {PERIODS[currentPeriod].suffix}
                     </span>
                   )}
                </div>

                {/* Extra Fee Label (Health+) */}
                {plan.extra && (
                   <div className="mb-6">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                        {plan.extra}
                      </span>
                   </div>
                )}

                {/* Features */}
                <ul className={`space-y-3 mb-8 text-sm flex-grow ${plan.textOverride ? "opacity-80" : "text-zinc-600 dark:text-zinc-400"}`}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check size={16} className={feature.highlight || (plan.textOverride ? "" : "text-zinc-400")} />
                      ) : (
                        <Minus size={16} className="text-zinc-400" />
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button className={`w-full py-2.5 rounded-xl font-medium transition text-sm ${plan.buttonStyle}`}>
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-zinc-400 mt-12">
          Prices in INR. Taxes may apply. © 2025 CNEAPEE.
        </p>
      </main>
    </div>
  );
}