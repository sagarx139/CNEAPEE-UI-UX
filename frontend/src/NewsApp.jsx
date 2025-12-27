import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Home, Settings, X, ExternalLink, Rss, Globe, RefreshCw, AlertCircle } from 'lucide-react';
import config from './config';

// --- CONFIGURATION ---
const API_KEY = '2877481bf91e69e4b75457258c852780'; // Enter your API Key here
const CACHE_KEY = 'cneapee_news_cache';
const UPDATE_INTERVAL_MINS = 20;
const CACHE_DURATION_MS = UPDATE_INTERVAL_MINS * 60 * 1000;

// --- FALLBACK DATA (For offline/error states) ---
const FALLBACK_POOL = [
  { source: "Reuters", title: "Next-Gen Semiconductors Hit Markets", description: "Major breakthroughs in 2nm process technology promise 40% efficiency gains in mobile devices. Leading foundries have announced the mass production of 2nm chips.", url: "#", publishedAt: new Date().toISOString() },
  { source: "TechCrunch", title: "Generative AI Regulation Talks Heat Up", description: "Global leaders convene to discuss standardizing safety protocols for autonomous agents. A new summit in Geneva has brought together tech leaders.", url: "#", publishedAt: new Date().toISOString() },
  { source: "The Verge", title: "Smart Glasses Adoption Soars in Q3", description: "AR wearables are finally seeing mainstream traction thanks to lightweight form factors. Q3 earnings reports show a 200% spike in sales.", url: "#", publishedAt: new Date().toISOString() },
  { source: "Bloomberg", title: "Tech Giants Pivot to Nuclear Energy", description: "Data center power demands drive unprecedented investment in small modular reactors to meet the voracious energy appetite of AI.", url: "#", publishedAt: new Date().toISOString() },
  { source: "Wired", title: "Quantum Encryption Standards Released", description: "NIST finalizes algorithms designed to protect data from future quantum computer attacks. Organizations are urged to begin migration.", url: "#", publishedAt: new Date().toISOString() },
  { source: "Engadget", title: "Foldable Phones Market Matures", description: "Durability concerns fade as new hinge designs rated for 500,000 folds become standard. New dust-proof hinges and ultra-thin glass composites.", url: "#", publishedAt: new Date().toISOString() },
  { source: "Ars Technica", title: "Open Source AI Models Close Gap", description: "New benchmarks reveal open weights models are now performing within 2% of leading proprietary systems in coding and reasoning tasks.", url: "#", publishedAt: new Date().toISOString() },
  { source: "CNBC", title: "SpaceX Announces Mars Cargo Mission", description: "Starship creates new timeline for interplanetary logistics. The company aims to send uncrewed cargo ships to the red planet within 24 months.", url: "#", publishedAt: new Date().toISOString() },
  { source: "The Guardian", title: "EU Digital Markets Act Takes Effect", description: "Tech gatekeepers face new interoperability requirements as landmark legislation officially comes into force across the European Union.", url: "#", publishedAt: new Date().toISOString() },
  { source: "MIT Tech Review", title: "Breakthrough in Solid State Batteries", description: "Researchers demonstrate a commercially viable solid state electrolyte that could double EV range and reduce charging times to 10 minutes.", url: "#", publishedAt: new Date().toISOString() },
  { source: "VentureBeat", title: "Web3 Gaming Rebounds in 2025", description: "After a crypto winter, blockchain-based gaming sees a resurgence with focus on gameplay-first mechanics rather than tokenomics.", url: "#", publishedAt: new Date().toISOString() },
  { source: "ZDNet", title: "Cybersecurity Spending Tops $200B", description: "Global enterprise security budgets reach record highs as automated threat detection becomes the new standard for corporate defense.", url: "#", publishedAt: new Date().toISOString() }
];

// --- COMPONENTS ---

const NewsCard = React.memo(({ article, onClick, index }) => {
  const cardRef = useRef(null);
  
  const timeString = useMemo(() => {
    const pubDate = new Date(article.publishedAt || new Date());
    const diffMs = new Date() - pubDate;
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins < 60 ? `${diffMins} mins ago` : `${Math.floor(diffMins/60)} hours ago`;
  }, [article.publishedAt]);

  const sourceName = article.source.name || article.source || "Unknown";

  return (
    <div 
      ref={cardRef}
      className="card group relative p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full animate-slide-up cursor-pointer shadow-sm hover:shadow-lg overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onClick(article, timeString, sourceName)}
    >
      <div className="absolute inset-0 spotlight opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <Globe size={10} /> {sourceName}
            </span>
            <span>•</span>
            <span>{timeString}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed flex-grow">
          {article.description || "Click to read more details about this story."}
        </p>
      </div>
    </div>
  );
});

export default function App() {
  // State
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState({ text: 'INITIALIZING...', color: 'indigo', detail: '' });
  const [progress, setProgress] = useState(0);
  const [modalArticle, setModalArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- LIFECYCLE & EFFECTS ---

  // 1. Initialize (Theme & Data)
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme !== 'light');
    
    // Initial Fetch
    fetchNews(false);
  }, []);

  // 2. Toggle Theme Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // 3. Spotlight Effect (Optimized)
  useEffect(() => {
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        const cards = document.querySelectorAll('.card');
        if (cards.length === 0) return;
        
        // Batch read/write if possible, or just apply styles
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          // Simple check to only update if mouse is relatively close or inside can be added here for extra perf
          card.style.setProperty('--x', `${x}px`);
          card.style.setProperty('--y', `${y}px`);
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [articles]);

  // 4. Timer Logic
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const lastFetch = parseInt(localStorage.getItem(`${CACHE_KEY}_timestamp`) || '0', 10);
      const nextFetch = lastFetch + CACHE_DURATION_MS;
      
      const diff = nextFetch - now;
      
      if (diff <= 0) {
        // Time to update
        fetchNews(true);
      } else {
        // Update progress
        const totalDuration = CACHE_DURATION_MS;
        const elapsed = totalDuration - diff;
        const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        setProgress(percentage);
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer(); // run immediately
    return () => clearInterval(timer);
  }, []);

  // --- CORE LOGIC ---

  const fetchNews = async (forceRefresh = false) => {
    if (forceRefresh) {
        setLoading(true);
        setStatus({ text: 'UPDATING FEED...', color: 'indigo', detail: '' });
    }

    // 1. Check Cache first (unless forced)
    if (!forceRefresh) {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(`${CACHE_KEY}_timestamp`);
      
      if (cachedData && cachedTime) {
        const age = Date.now() - parseInt(cachedTime, 10);
        if (age < CACHE_DURATION_MS) {
          console.log("Loading from cache");
          try {
            const parsed = JSON.parse(cachedData);
            setArticles(parsed);
            setLoading(false);
            setStatus({ text: 'LIVE FEED (CACHED)', color: 'green', detail: '' });
            return; 
          } catch (e) {
            console.error("Cache parse error", e);
          }
        }
      }
    }

    // 2. Fetch from API
    try {
      const url = `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=9&apikey=${API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.errors ? errorData.errors[0] : `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.errors) {
        throw new Error(Object.values(data.errors).join(', '));
      }

      // Backfill if not enough articles
      let combinedArticles = data.articles || [];
      if (combinedArticles.length < 9) {
        const needed = 9 - combinedArticles.length;
        combinedArticles = [...combinedArticles, ...FALLBACK_POOL.slice(0, needed)];
      }

      // 3. Save to State & Cache
      setArticles(combinedArticles);
      localStorage.setItem(CACHE_KEY, JSON.stringify(combinedArticles));
      localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString());
      
      setStatus({ text: 'LIVE FEED ACTIVE', color: 'green', detail: '' });
    } catch (error) {
      console.warn("Fetch failed:", error);
      
      // Load fallback or stale cache if available
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
         setArticles(JSON.parse(cachedData));
         setStatus({ text: 'OFFLINE (USING CACHE)', color: 'orange', detail: 'Could not reach API, showing saved news.' });
      } else {
         setArticles(FALLBACK_POOL.slice(0, 9));
         
         // Diagnostic Status
         let errorMsg = 'OFFLINE MODE';
         let detailMsg = error.message;
         const errString = error.message.toLowerCase();
         
         if (errString.includes('403') || errString.includes('forbidden')) {
            errorMsg = 'ACCESS DENIED';
            detailMsg = 'Domain not allowed or Key Invalid';
         } else if (errString.includes('429')) {
            errorMsg = 'QUOTA EXCEEDED';
         } else if (errString.includes('network') || errString.includes('fetch')) {
            errorMsg = 'NETWORK ERROR';
            detailMsg = 'Connection blocked (CORS/AdBlock)';
         }
         setStatus({ text: errorMsg, color: 'red', detail: detailMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (color) => {
    switch (color) {
      case 'green': return 'text-green-500 border-green-500/20 bg-green-500/10';
      case 'red': return 'text-red-500 border-red-500/20 bg-red-500/10';
      case 'orange': return 'text-orange-500 border-orange-500/20 bg-orange-500/10';
      default: return 'text-indigo-600 dark:text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${darkMode ? 'bg-[#030305] text-zinc-300' : 'bg-zinc-50 text-zinc-900'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .grid-bg { 
          background-image: linear-gradient(rgba(120,120,120,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,120,0.05) 1px, transparent 1px); 
          background-size: 30px 30px; 
          mask-image: linear-gradient(black 60%, transparent); 
          -webkit-mask-image: linear-gradient(black 60%, transparent);
        }
        .spotlight { background: radial-gradient(400px circle at var(--x) var(--y), rgba(100,100,100,0.06), transparent 40%); }
        .dark .spotlight { background: radial-gradient(500px circle at var(--x) var(--y), rgba(255,255,255,0.03), transparent 40%); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.5); border-radius: 3px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; opacity: 0; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Backgrounds */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full p-1.5 flex items-center shadow-2xl transition-all duration-300 hover:shadow-indigo-500/10">
          <button onClick={() => window.location.reload()} className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition" title="Refresh">
            <Home size={18} />
          </button>
          <div className="w-px h-4 bg-zinc-300 dark:bg-white/10 mx-2" />
          <div className="relative group">
            <button className="flex items-center gap-3 px-6 py-2 rounded-full bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-sm font-semibold text-zinc-900 dark:text-white transition cursor-default">
              <span>News Plus</span>
              <Rss size={14} className="text-indigo-500 animate-pulse" />
            </button>
          </div>
          <div className="w-px h-4 bg-zinc-300 dark:bg-white/10 mx-2" />
          <button onClick={() => setShowSettings(!showSettings)} className={`w-10 h-10 flex items-center justify-center rounded-full transition ${showSettings ? 'bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white'}`} title="Settings">
            <Settings size={18} />
          </button>
        </div>
      </nav>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed top-20 right-0 left-0 mx-auto w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl p-5 z-40 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Settings</h3>
            <button onClick={() => setShowSettings(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="pt-2 flex justify-between items-center border-t border-zinc-200 dark:border-white/10">
            <span className="text-xs text-zinc-500">Appearance</span>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="text-xs bg-zinc-100 dark:bg-white/10 px-3 py-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-white/20 transition text-zinc-700 dark:text-zinc-300"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-20 px-4 max-w-7xl mx-auto w-full z-10">
        
        {/* Status Header */}
        <div className="flex flex-col items-center justify-center mb-12 animate-fade-in text-center">
          <div className={`inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border text-xs font-mono transition-colors duration-300 ${getStatusColor(status.color)}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${status.color === 'green' ? 'bg-green-500' : status.color === 'red' ? 'bg-red-500' : status.color === 'orange' ? 'bg-orange-500' : 'bg-indigo-500'}`} />
            <span>{status.text}</span>
          </div>

          {/* Detailed Error Message if any */}
          {status.color === 'red' && status.detail && (
            <div className="text-[10px] text-red-500/80 font-mono mb-2 flex items-center gap-1 animate-pulse">
              <AlertCircle size={10} />
              {status.detail}
            </div>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">
            CNEAPEE News+
          </h1>
          
          {/* Graphical Update Timer */}
          <div className="mt-6 flex flex-col items-center gap-2 w-full max-w-xs">
            <div className="flex items-center justify-between w-full text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5"><RefreshCw size={10} className="animate-spin-slow" /> Auto-Update</span>
                <span className="font-mono tabular-nums">{progress.toFixed(2)}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-indigo-500 transition-all duration-1000 ease-linear rounded-full" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && articles.length === 0 ? (
            <div className="col-span-full text-center py-20 text-zinc-500 animate-pulse font-mono text-sm">
              CONNECTING TO NEURAL NETWORK...
            </div>
          ) : (
            articles.map((article, index) => (
              <NewsCard 
                key={`${article.url}-${index}`} 
                article={article} 
                index={index} 
                onClick={(art, time, src) => setModalArticle({ ...art, displayTime: time, displaySource: src })} 
              />
            ))
          )}
        </div>
      </main>

      {/* Article Modal */}
      {modalArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setModalArticle(null)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0A0A0C] border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-slide-up overflow-hidden">
            <div className="flex justify-between items-start p-6 border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">{modalArticle.displaySource}</span>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">{modalArticle.title}</h2>
              </div>
              <button onClick={() => setModalArticle(null)} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 flex items-center justify-center transition text-zinc-500 dark:text-zinc-400 flex-shrink-0 ml-4">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto text-zinc-600 dark:text-zinc-300 leading-relaxed space-y-4 custom-scrollbar text-base">
              <p>{modalArticle.content || modalArticle.description || "No detailed content available."}</p>
            </div>
            <div className="p-4 border-t border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center text-xs text-zinc-400">
              <span>Aggregated via GNews API</span>
              <a href={modalArticle.url} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-400 flex items-center gap-1">
                Read Original <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}