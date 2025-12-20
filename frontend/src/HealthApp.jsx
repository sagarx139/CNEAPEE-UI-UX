import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Settings, Activity, Search, X, ChevronDown, 
  Info, AlertTriangle, Shield, Pill, Heart 
} from 'lucide-react';

// --- Static Data ---
const DISEASES = [
  {
    name: "Fever", icon: "🤒",
    brief: "Temporary increase in body temperature, often indicating the body is fighting an infection.",
    symptoms: ["Temp > 100.4°F", "Chills", "Sweating", "Headache", "Fatigue"],
    warnings: ["Fever > 103°F", "Lasts > 3 days", "Difficulty breathing", "Confusion"],
    precautions: ["Rest", "Hydrate", "Light clothing", "Cool cloth on forehead"],
    medicines: ["Paracetamol", "Ibuprofen", "ORS for hydration"],
    prevention: ["Hand hygiene", "Vaccination", "Avoid sick contacts"]
  },
  {
    name: "Body Ache", icon: "💪",
    brief: "Pain or discomfort in muscles and joints, often caused by viral infections or exertion.",
    symptoms: ["Muscle pain", "Joint stiffness", "Fatigue", "Weakness"],
    warnings: ["Severe persistent pain", "High fever", "Muscle weakness"],
    precautions: ["Rest", "Heat/Cold therapy", "Gentle stretching", "Hydration"],
    medicines: ["Paracetamol", "Ibuprofen", "Topical gels"],
    prevention: ["Regular exercise", "Warm-up before activity", "Ergonomics"]
  },
  {
    name: "Common Cold", icon: "🤧",
    brief: "Viral infection of the upper respiratory tract affecting nose and throat.",
    symptoms: ["Runny nose", "Sneezing", "Sore throat", "Cough", "Mild fever"],
    warnings: ["Symptoms > 10 days", "High fever", "Severe sinus pain", "Wheezing"],
    precautions: ["Rest", "Hydrate", "Humidifier", "Warm gargle"],
    medicines: ["Paracetamol", "Antihistamines", "Saline drops", "Cough suppressants"],
    prevention: ["Wash hands", "Avoid touching face", "Disinfect surfaces"]
  },
  {
    name: "Headache", icon: "🤕",
    brief: "Pain in head or neck region ranging from mild to severe.",
    symptoms: ["Throbbing pain", "Sensitivity to light", "Nausea", "Dizziness"],
    warnings: ["Worst headache of life", "Fever & stiff neck", "Post-injury"],
    precautions: ["Dark quiet room", "Compresses", "Hydrate", "Relaxation"],
    medicines: ["Paracetamol", "Ibuprofen", "Aspirin", "Sumatriptan (Migraine)"],
    prevention: ["Identify triggers", "Regular sleep", "Hydration", "Limit screens"]
  },
  {
    name: "Diabetes", icon: "🩺",
    brief: "Chronic condition affecting blood sugar regulation.",
    symptoms: ["Thirst", "Urination", "Hunger", "Weight loss", "Blurry vision"],
    warnings: ["Extreme sugar levels", "Confusion", "Abdominal pain", "Foot sores"],
    precautions: ["Monitor sugar", "Diet & Exercise", "Foot care", "No smoking"],
    medicines: ["Metformin", "Insulin", "Statins", "BP meds", "Consult doctor"],
    prevention: ["Healthy weight", "Exercise", "Low sugar diet"]
  },
  {
    name: "Anxiety", icon: "😰",
    brief: "Excessive worry or fear interfering with daily life.",
    symptoms: ["Worry", "Restlessness", "Rapid heart", "Sweating", "Sleep issues"],
    warnings: ["Panic attacks", "Chest pain", "Self-harm thoughts"],
    precautions: ["Relaxation", "Limit caffeine", "Sleep schedule", "Exercise"],
    medicines: ["Therapy (CBT)", "SSRIs", "Anxiolytics (Rx)"],
    prevention: ["Coping strategies", "Mindfulness", "Exercise"]
  }
];

const DEFAULT_API_KEY = "2877481bf91e69e4b75457258c852780"; 

export default function HealthApp() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState(() => localStorage.getItem('health_source') || "Neuro 1.1 General");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('health_api_key') || "");
  
  const containerRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.spotlight-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--y', `${e.clientY - rect.top}px`);
      });
    }
  };

  const saveSettings = () => {
    localStorage.setItem('health_source', dataSource);
    if(apiKey) localStorage.setItem('health_api_key', apiKey);
    else localStorage.removeItem('health_api_key');
    setShowSettings(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    if (dataSource === "Neuro 1.1 General") {
      const localMatch = DISEASES.find(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (localMatch) {
        setSelectedDisease({ ...localMatch, source: "Neuro Database" });
        return;
      }
    }

    setIsLoading(true);
    setSelectedDisease({ loading: true });

    const activeKey = apiKey || DEFAULT_API_KEY;
    const prompt = `Act as a professional medical assistant. Analyze: "${searchQuery}". Return raw JSON with keys: name, brief, symptoms, warnings, precautions, medicines, prevention.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      if (!data.candidates) throw new Error("No response");

      let text = data.candidates[0].content.parts[0].text;
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiResult = JSON.parse(text);
      setSelectedDisease({ ...aiResult, source: `Neuro AI (${dataSource})` });
    } catch (error) {
      alert("Search failed. Using fallback...");
      setSelectedDisease(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className={`min-h-screen flex flex-col relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#030305] text-zinc-300' : 'bg-zinc-50 text-zinc-900'}`}>
      <div className="fixed inset-0 grid-bg pointer-events-none -z-10 opacity-30"></div>
      
      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className={`backdrop-blur-xl border rounded-full p-1.5 flex items-center shadow-2xl ${theme === 'dark' ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-zinc-200'}`}>
          <button onClick={() => window.location.reload()} className="p-2 hover:bg-zinc-500/10 rounded-full transition"><Home size={18}/></button>
          <div className="w-px h-4 mx-2 bg-zinc-500/30"></div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/10 text-emerald-600'}`}>
            <Activity size={14} className="animate-pulse"/> Health+
          </div>
          <div className="w-px h-4 mx-2 bg-zinc-500/30"></div>
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-zinc-500/10 rounded-full transition"><Settings size={18}/></button>
        </div>
      </nav>

      {/* Settings */}
      {showSettings && (
        <div className={`fixed top-24 right-0 left-0 mx-auto w-80 p-6 rounded-3xl z-[60] shadow-2xl border animate-fade-in ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
          <div className="flex justify-between mb-4"><h3 className="font-bold text-xs uppercase opacity-50">Config</h3><button onClick={()=>setShowSettings(false)}><X size={16}/></button></div>
          <select value={dataSource} onChange={(e)=>setDataSource(e.target.value)} className="w-full p-2 mb-4 rounded-lg bg-zinc-500/10 text-sm outline-none">
            <option value="Neuro 1.1 General">General Engine</option>
            <option value="PubMed">PubMed Focus</option>
          </select>
          <button onClick={saveSettings} className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm mb-4">Save</button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full py-2 bg-zinc-500/10 rounded-xl text-sm italic">Toggle {theme === 'dark' ? 'Light' : 'Dark'}</button>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 pt-32 pb-20 px-6 max-w-5xl mx-auto w-full text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">How are you <span className="text-emerald-500">feeling?</span></h1>
        <p className="opacity-60 mb-10">Neuro Intelligence Diagnosis Engine</p>
        
        <div className="max-w-2xl mx-auto relative group mb-16">
          <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleSearch()} placeholder="Describe symptoms..." className={`w-full p-4 px-8 rounded-2xl border outline-none shadow-xl transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-zinc-200 text-black'}`}/>
          <button onClick={handleSearch} className="absolute right-3 top-3 bg-emerald-500 p-2 rounded-xl text-white"><Search size={20}/></button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {DISEASES.map((d, i) => (
            <button key={i} onClick={()=>setSelectedDisease({...d, source: "Local DB"})} className={`spotlight-card group relative p-6 rounded-2xl border transition-all text-center overflow-hidden ${theme === 'dark' ? 'bg-zinc-900/40 border-white/5 hover:border-emerald-500/50' : 'bg-white border-zinc-200 hover:border-emerald-500/50 shadow-sm'}`}>
              <div className="absolute inset-0 spotlight opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
              <div className="text-4xl mb-3">{d.icon}</div>
              <div className="font-bold">{d.name}</div>
            </button>
          ))}
        </div>
      </main>

      {/* Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={()=>setSelectedDisease(null)}>
          <div className={`w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 border shadow-2xl relative ${theme === 'dark' ? 'bg-[#0A0A0C] border-white/10' : 'bg-white border-zinc-200'}`} onClick={e=>e.stopPropagation()}>
             <button onClick={()=>setSelectedDisease(null)} className="absolute top-6 right-6"><X/></button>
             {selectedDisease.loading ? <div className="p-20 animate-pulse text-emerald-500 font-bold">Analyzing...</div> : (
               <div className="text-left">
                  <h2 className="text-3xl font-bold mb-4">{selectedDisease.name}</h2>
                  <p className="text-lg opacity-70 mb-8">{selectedDisease.brief}</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-zinc-500/5 border border-zinc-500/10">
                      <h3 className="font-bold text-emerald-500 flex items-center gap-2 mb-4"><Shield size={18}/> Care</h3>
                      <ul className="space-y-2 text-sm opacity-80">{selectedDisease.precautions?.map((p,idx)=><li key={idx}>• {p}</li>)}</ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                      <h3 className="font-bold text-red-500 flex items-center gap-2 mb-4"><AlertTriangle size={18}/> Warnings</h3>
                      <ul className="space-y-2 text-sm opacity-80">{selectedDisease.warnings?.map((w,idx)=><li key={idx}>• {w}</li>)}</ul>
                    </div>
                  </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}