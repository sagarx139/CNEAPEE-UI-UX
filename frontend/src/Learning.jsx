import React, { useState, useEffect, useRef } from 'react';
import config from './config';
import { 
  Home, Sun, Moon, GraduationCap, ChevronDown, 
  Brain, X, ExternalLink, Loader2 
} from 'lucide-react';
import { marked } from 'marked';

// --- Data Configuration ---
const LABELS = {
  "mostCommon": "Core Foundation",
  "grade7": "Grade 7", "grade8": "Grade 8", "grade9": "Grade 9",
  "grade10": "Grade 10", "grade11": "Grade 11", "grade12": "Grade 12"
};

const STUDY_HUB_DATA = {
  "mostCommon": {
    "Science": [{
      "chapterName": "Fundamental Concepts",
      "chapterUrl": "https://en.wikipedia.org/wiki/Science",
      "topics": [
        { "name": "The Scientific Method", "url": "https://en.wikipedia.org/wiki/Scientific_method" },
        { "name": "The Cell", "url": "https://en.wikipedia.org/wiki/Cell_(biology)" },
        { "name": "Photosynthesis", "url": "https://en.wikipedia.org/wiki/Photosynthesis" },
        { "name": "Newton's Laws of Motion", "url": "https://en.wikipedia.org/wiki/Newton%27s_laws_of_motion" },
        { "name": "Periodic Table", "url": "https://en.wikipedia.org/wiki/Periodic_table" },
        { "name": "Chemical Reaction", "url": "https://en.wikipedia.org/wiki/Chemical_reaction" },
        { "name": "DNA", "url": "https://en.wikipedia.org/wiki/DNA" },
        { "name": "Theory of Relativity", "url": "https://en.wikipedia.org/wiki/Theory_of_relativity" }
      ]
    }],
    "Mathematics": [{
      "chapterName": "Core Principles",
      "chapterUrl": "https://en.wikipedia.org/wiki/Mathematics",
      "topics": [
        { "name": "Pythagorean Theorem", "url": "https://en.wikipedia.org/wiki/Pythagorean_theorem" },
        { "name": "Algebraic Expressions", "url": "https://en.wikipedia.org/wiki/Algebraic_expression" },
        { "name": "Linear Equations", "url": "https://en.wikipedia.org/wiki/Linear_equation" },
        { "name": "Calculus", "url": "https://en.wikipedia.org/wiki/Calculus" },
        { "name": "Statistics", "url": "https://en.wikipedia.org/wiki/Statistics" },
        { "name": "Probability", "url": "https://en.wikipedia.org/wiki/Probability" }
      ]
    }],
    "Social Science": [{
      "chapterName": "Pivotal Ideas & Events",
      "chapterUrl": "https://en.wikipedia.org/wiki/Social_science",
      "topics": [
        { "name": "Democracy", "url": "https://en.wikipedia.org/wiki/Democracy" },
        { "name": "The Indian Constitution", "url": "https://en.wikipedia.org/wiki/Constitution_of_India" },
        { "name": "The French Revolution", "url": "https://en.wikipedia.org/wiki/French_Revolution" },
        { "name": "World War I", "url": "https://en.wikipedia.org/wiki/World_War_I" },
        { "name": "Globalization", "url": "https://en.wikipedia.org/wiki/Globalization" },
        { "name": "Supply and Demand", "url": "https://en.wikipedia.org/wiki/Supply_and_demand" }
      ]
    }]
  },
  "grade7": {
    "Science": [
      { "chapterName": "Nutrition in Plants", "chapterUrl": "https://en.wikipedia.org/wiki/Plant_nutrition", "topics": [{ "name": "Modes of Nutrition", "url": "https://en.wikipedia.org/wiki/Nutrition" }, { "name": "Photosynthesis", "url": "https://en.wikipedia.org/wiki/Photosynthesis" }] },
      { "chapterName": "Nutrition in Animals", "chapterUrl": "https://en.wikipedia.org/wiki/Animal_nutrition", "topics": [{ "name": "Human Digestive System", "url": "https://en.wikipedia.org/wiki/Human_digestive_system" }, { "name": "Digestion in Ruminants", "url": "https://en.wikipedia.org/wiki/Ruminant" }] },
      { "chapterName": "Fibre to Fabric", "chapterUrl": "https://en.wikipedia.org/wiki/Textile", "topics": [{ "name": "Wool", "url": "https://en.wikipedia.org/wiki/Wool" }, { "name": "Silk", "url": "https://en.wikipedia.org/wiki/Silk" }] },
      { "chapterName": "Heat", "chapterUrl": "https://en.wikipedia.org/wiki/Heat", "topics": [{ "name": "Conduction, Convection, Radiation", "url": "https://en.wikipedia.org/wiki/Heat_transfer" }] },
      { "chapterName": "Acids, Bases and Salts", "chapterUrl": "https://en.wikipedia.org/wiki/Acid%E2%80%93base_reaction", "topics": [{ "name": "Indicators", "url": "https://en.wikipedia.org/wiki/PH_indicator" }, { "name": "Neutralisation", "url": "https://en.wikipedia.org/wiki/Neutralization_(chemistry)" }] },
      { "chapterName": "Physical and Chemical Changes", "chapterUrl": "https://en.wikipedia.org/wiki/Chemical_property", "topics": [{ "name": "Physical Change", "url": "https://en.wikipedia.org/wiki/Physical_change" }, { "name": "Chemical Change", "url": "https://en.wikipedia.org/wiki/Chemical_change" }] }
    ]
  },
  "grade10": {
    "Science": [
      { "chapterName": "Chemical Reactions and Equations", "chapterUrl": "https://en.wikipedia.org/wiki/Chemical_equation", "topics": [{ "name": "Types of Chemical Reactions", "url": "https://en.wikipedia.org/wiki/Chemical_reaction" }] },
      { "chapterName": "Acids, Bases and Salts", "chapterUrl": "https://en.wikipedia.org/wiki/Acid%E2%80%93base_reaction", "topics": [{ "name": "pH Scale", "url": "https://en.wikipedia.org/wiki/PH" }] },
      { "chapterName": "Life Processes", "chapterUrl": "https://en.wikipedia.org/wiki/Biological_process", "topics": [{ "name": "Human Nutrition, Respiration, Circulation", "url": "https://en.wikipedia.org/wiki/Human_physiology" }] },
      { "chapterName": "Control and Coordination", "chapterUrl": "https://en.wikipedia.org/wiki/Control_theory", "topics": [{ "name": "Human Brain", "url": "https://en.wikipedia.org/wiki/Human_brain" }, { "name": "Plant Hormones", "url": "https://en.wikipedia.org/wiki/Plant_hormone" }] },
      { "chapterName": "Heredity and Evolution", "chapterUrl": "https://en.wikipedia.org/wiki/Heredity", "topics": [{ "name": "Mendel's Laws", "url": "https://en.wikipedia.org/wiki/Mendelian_inheritance" }] },
      { "chapterName": "Electricity", "chapterUrl": "https://en.wikipedia.org/wiki/Electricity", "topics": [{ "name": "Ohm's Law", "url": "https://en.wikipedia.org/wiki/Ohm%27s_law" }] }
    ]
  }
  // ... (Add the rest of your large data object here)
};

export default function Learning() {
  // --- State ---
  const [theme, setTheme] = useState(localStorage.getItem('learning_theme') || 'dark');
  const [activeAccordion, setActiveAccordion] = useState(null); // stores "gradeKey-subject" string
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    url: '',
    content: '',
    loading: false,
    error: null
  });

  const containerRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('learning_theme', theme);
  }, [theme]);

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

  // --- Logic ---
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const toggleAccordion = (key) => {
    setActiveAccordion(prev => prev === key ? null : key);
  };

  const openSummary = async (url, title) => {
    setModalState({ isOpen: true, title, url, content: '', loading: true, error: null });

    try {
      // 1. Fetch Wikipedia Content
      const slug = url.split('/wiki/')[1];
      if (!slug) throw new Error("Invalid Wiki URL");

      const wikiApiUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=1&titles=${slug}&origin=*`;
      const wikiRes = await fetch(wikiApiUrl);
      const wikiData = await wikiRes.json();
      
      const pages = wikiData.query.pages;
      const pageId = Object.keys(pages)[0];
      const contentText = pages[pageId].extract;

      if (!contentText) throw new Error("No Wikipedia content found.");

      // 2. Summarize with Gemini (via your Backend Proxy)
      const context = contentText.substring(0, 12000); // Truncate for token limit
      
      // Note: Make sure your backend at localhost:3000 is running
      const backendRes = await fetch("http://localhost:3000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: context
        })
      });

      const geminiData = await backendRes.json();

      if (!geminiData.candidates || geminiData.candidates.length === 0) {
        throw new Error("AI unavailable. Please read the full article.");
      }

      const markdown = geminiData.candidates[0].content.parts[0].text;
      const parsedMarkdown = marked.parse(markdown);

      setModalState(prev => ({
        ...prev,
        content: parsedMarkdown,
        loading: false
      }));

    } catch (error) {
      console.error(error);
      setModalState(prev => ({
        ...prev,
        loading: false,
        error: "Could not generate summary. Please check your connection or view the original article."
      }));
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="bg-zinc-50 text-zinc-900 dark:bg-[#030305] dark:text-zinc-300 flex flex-col min-h-screen overflow-x-hidden relative transition-colors duration-300 font-sans"
    >
      {/* Styles Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .grid-bg { 
          background-image: linear-gradient(rgba(120,120,120,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,120,0.05) 1px, transparent 1px); 
          background-size: 30px 30px; 
          mask-image: linear-gradient(black 60%, transparent); 
          -webkit-mask-image: linear-gradient(black 60%, transparent);
        }
        .spotlight { background: radial-gradient(400px circle at var(--x) var(--y), rgba(59, 130, 246, 0.1), transparent 40%); }
        .dark .spotlight { background: radial-gradient(500px circle at var(--x) var(--y), rgba(59, 130, 246, 0.05), transparent 40%); }
        
        /* Prose Markdown Styles */
        .prose h1, .prose h2, .prose h3 { color: inherit; font-weight: 700; margin-top: 1em; margin-bottom: 0.5em; }
        .prose h2 { font-size: 1.5rem; border-bottom: 1px solid rgba(120,120,120,0.1); padding-bottom: 0.5rem; }
        .prose p { margin-bottom: 1em; line-height: 1.7; }
        .dark .prose p { color: #a1a1aa; }
        .prose ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .dark .prose ul { color: #d4d4d8; }
        .prose strong { font-weight: 600; }
        .dark .prose strong { color: #fff; }
        .prose blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; font-style: italic; background: rgba(59, 130, 246, 0.1); padding: 0.5rem 1rem; border-radius: 0 8px 8px 0; margin-bottom: 1rem;}
        
        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 3px; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>

      {/* Backgrounds */}
      <div className="fixed inset-0 grid-bg pointer-events-none -z-10"></div>
      <div className="fixed top-0 right-0 w-[600px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Navigation */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full p-1.5 flex items-center shadow-2xl transition-all duration-300 hover:shadow-blue-500/10">
          <a href="/" className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 transition">
            <Home size={18} />
          </a>
          
          <div className="w-px h-4 bg-zinc-300 dark:bg-white/10 mx-2"></div>
          
          <div className="relative group">
            <button className="flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold transition cursor-default">
              <span>Learning+ Hub</span>
              <GraduationCap size={14} className="animate-pulse" />
            </button>
          </div>
          
          <div className="w-px h-4 bg-zinc-300 dark:bg-white/10 mx-2"></div>
          
          <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 transition">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-20 px-4 max-w-5xl mx-auto w-full">
        
        {/* Hero */}
        <div className="flex flex-col items-center justify-center mb-20 animate-fade-in text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs font-mono tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            NEURO 1.1 EDUCATION ENGINE
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Simplified.</span>
          </h1>
          
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-lg leading-relaxed">
            A curated collection of essential topics. Click any topic to generate an instant Neuro Summary directly in the hub.
          </p>
        </div>

        {/* Curriculum Container */}
        <div className="space-y-16">
          {Object.entries(STUDY_HUB_DATA).map(([gradeKey, subjects]) => (
            <div key={gradeKey} className="grade-section">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 border-b border-zinc-200 dark:border-white/10 pb-2">
                {LABELS[gradeKey]}
              </h2>

              <div className="grid gap-4">
                {Object.entries(subjects).map(([subject, chapters]) => {
                  const accordionKey = `${gradeKey}-${subject}`;
                  const isActive = activeAccordion === accordionKey;

                  return (
                    <div key={accordionKey} className={`card accordion-item bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:border-blue-500/30 group relative`}>
                      <button 
                        onClick={() => toggleAccordion(accordionKey)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none relative z-10"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                          <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{subject}</span>
                          <span className="text-xs text-zinc-400 font-mono bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-md">
                            {chapters.length} Chapters
                          </span>
                        </div>
                        <ChevronDown 
                          className={`text-zinc-400 group-hover:text-blue-500 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      <div className="absolute inset-0 spotlight opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>

                      <div className={`transition-all duration-300 ease-in-out bg-zinc-50/50 dark:bg-black/20 ${isActive ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {chapters.map((chapter, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:border-blue-400/50 transition-colors">
                              <button 
                                onClick={() => openSummary(chapter.chapterUrl, chapter.chapterName)}
                                className="font-bold text-sm text-left text-zinc-900 dark:text-white hover:underline decoration-blue-500 underline-offset-2 mb-2 block truncate w-full"
                              >
                                {chapter.chapterName}
                              </button>
                              <div className="pl-2 border-l-2 border-zinc-100 dark:border-white/10">
                                {chapter.topics.map((t, tIdx) => (
                                  <button 
                                    key={tIdx}
                                    onClick={() => openSummary(t.url, t.name)}
                                    className="block text-left text-xs text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 mt-1 truncate transition-colors w-full"
                                  >
                                    • {t.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Summary Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md transition-opacity" onClick={closeModal}></div>
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#0A0A0C] border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-scale-in overflow-hidden transform">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-500/10">
                  <Brain size={20} />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">
                    {modalState.title || 'Loading...'}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">Neuro 1.1 Analysis</p>
                </div>
              </div>
              <button onClick={closeModal} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 flex items-center justify-center transition text-zinc-500 dark:text-zinc-400">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar bg-white dark:bg-[#0A0A0C]">
              {modalState.loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 animate-pulse text-sm">Reading Wikipedia & Summarizing...</p>
                </div>
              ) : modalState.error ? (
                <p className="text-red-500 text-center">{modalState.error}</p>
              ) : (
                <div 
                  className="prose prose-zinc dark:prose-invert max-w-none prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-headings:text-zinc-900 dark:prose-headings:text-white prose-a:text-blue-500"
                  dangerouslySetInnerHTML={{ __html: modalState.content }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Source: Wikipedia</span>
              <a 
                href={modalState.url} 
                target="_blank" 
                rel="noreferrer"
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                Read Full Article <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#050507] pt-12 pb-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Powered by ELYA Technologies.</p>
          <p className="text-[10px] text-zinc-400">© 2025 Learning+. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}