import React, { useState } from 'react';
import { 
  Sliders, 
  Layers, 
  Type, 
  Image as ImageIcon, 
  Download, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut,
  Sun,
  Contrast,
  Droplet,
  Aperture,
  RotateCcw,
  // New icons for the floating nav
  Home,
  Settings,
  ChevronDown
} from 'lucide-react';

// Accept the onBack prop here
const Studio = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('adjust');
  
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
  });

  const [zoom, _setZoom] = useState(100);

  const handleAdjustmentChange = (key, value) => {
    setAdjustments(prev => ({ ...prev, [key]: value }));
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
    });
  };

  const getImageFilter = () => {
    return `
      brightness(${adjustments.brightness}%) 
      contrast(${adjustments.contrast}%) 
      saturate(${adjustments.saturation}%) 
      blur(${adjustments.blur}px)
      grayscale(${adjustments.grayscale}%)
      sepia(${adjustments.sepia}%)
    `;
  };

  return (
    <div className="flex h-screen w-full bg-[#0f0f12] text-white overflow-hidden font-sans relative">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-20 border-r border-white/10 flex flex-col items-center py-6 gap-6 bg-[#18181b] z-20">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
            <Aperture size={24} className="text-white" />
        </div>
        
        <NavButton icon={<Sliders size={20} />} label="Adjust" isActive={activeTab === 'adjust'} onClick={() => setActiveTab('adjust')} />
        <NavButton icon={<Layers size={20} />} label="Filters" isActive={activeTab === 'filters'} onClick={() => setActiveTab('filters')} />
        <NavButton icon={<Type size={20} />} label="Text" isActive={activeTab === 'text'} onClick={() => setActiveTab('text')} />
        <NavButton icon={<ImageIcon size={20} />} label="Overlays" isActive={activeTab === 'overlays'} onClick={() => setActiveTab('overlays')} />
      </aside>

      {/* 2. SECONDARY SIDEBAR */}
      <div className="w-80 border-r border-white/10 bg-[#121215] flex flex-col z-10">
        <div className="h-16 border-b border-white/10 flex items-center px-6">
            <h2 className="text-lg font-medium tracking-wide capitalize">{activeTab} Tools</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {activeTab === 'adjust' && (
            <>
              <SliderGroup icon={<Sun size={16} />} label="Brightness" value={adjustments.brightness} min={0} max={200} onChange={(e) => handleAdjustmentChange('brightness', e.target.value)} />
              <SliderGroup icon={<Contrast size={16} />} label="Contrast" value={adjustments.contrast} min={0} max={200} onChange={(e) => handleAdjustmentChange('contrast', e.target.value)} />
              <SliderGroup icon={<Droplet size={16} />} label="Saturation" value={adjustments.saturation} min={0} max={200} onChange={(e) => handleAdjustmentChange('saturation', e.target.value)} />
              <SliderGroup label="Blur" value={adjustments.blur} min={0} max={20} onChange={(e) => handleAdjustmentChange('blur', e.target.value)} />
              <SliderGroup label="Grayscale" value={adjustments.grayscale} min={0} max={100} onChange={(e) => handleAdjustmentChange('grayscale', e.target.value)} />
              
              <button onClick={resetAdjustments} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors mt-4">
                <RotateCcw size={12} /> Reset to defaults
              </button>
            </>
          )}

          {activeTab === 'filters' && (
             <div className="grid grid-cols-2 gap-3">
                {['Vivid', 'Noir', 'Warm', 'Cool', 'Vintage', 'Dramatic'].map(filter => (
                    <div key={filter} className="aspect-square bg-gray-800 rounded-lg hover:ring-2 ring-indigo-500 cursor-pointer transition-all flex items-center justify-center group overflow-hidden relative">
                        <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=200&h=200&q=80)'}}></div>
                        <span className="relative z-10 font-medium text-sm drop-shadow-md">{filter}</span>
                    </div>
                ))}
             </div>
          )}
          
          {(activeTab === 'text' || activeTab === 'overlays') && (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-sm text-center">
                  <p>Tool features coming soon.</p>
              </div>
          )}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col bg-[#09090b] relative">
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5">
            <div className="flex items-center gap-4 text-gray-400">
                <button className="hover:text-white"><Undo size={18} /></button>
                <button className="hover:text-white"><Redo size={18} /></button>
                <span className="h-4 w-px bg-white/10"></span>
                <span className="text-sm">Project_Untitled_01.jpg</span>
            </div>
            <div className="flex items-center gap-3">
                 <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                    <Download size={16} /> Export
                </button>
            </div>
        </header>

        <div className="flex-1 flex items-center justify-center overflow-hidden p-8 relative">
            <div 
                className="relative shadow-2xl transition-all duration-200 ease-out"
                style={{ transform: `scale(${zoom / 100})`, transition: 'filter 0.1s ease' }}
            >
                <img 
                    src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Editing Canvas" 
                    className="max-w-full max-h-[80vh] object-contain rounded-sm"
                    style={{ filter: getImageFilter() }}
                />
            </div>
        </div>

        {/* --- FLOATING NAVIGATION BAR (Inspired by your image) --- */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white rounded-full shadow-2xl shadow-black/50 p-1.5 flex items-center gap-1 ring-1 ring-white/10">
            
            {/* Home Button -> Calls onBack */}
            <button 
              onClick={onBack}
              className="p-2.5 text-slate-600 hover:text-black hover:bg-slate-100 rounded-full transition-colors"
              title="Back to Home"
            >
              <Home size={20} strokeWidth={2.5} />
            </button>
            
            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 mx-1"></div>

            {/* Center Selector */}
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-800 text-sm font-bold transition-colors">
              <span>Studio Pro</span>
              <ChevronDown size={16} className="text-slate-500" />
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 mx-1"></div>

            {/* Settings Button */}
            <button className="p-2.5 text-slate-600 hover:text-black hover:bg-slate-100 rounded-full transition-colors">
              <Settings size={20} strokeWidth={2.5} />
            </button>

          </div>
        </div>

      </main>
    </div>
  );
};

// Helper components remain the same...
const NavButton = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 p-2 w-full transition-all relative group ${isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}>
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
        {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-500 rounded-l-full" />}
    </button>
);

const SliderGroup = ({ icon, label, value, min, max, onChange }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center text-xs text-gray-300">
            <div className="flex items-center gap-2">
                {icon}<span>{label}</span>
            </div>
            <span className="text-gray-500 font-mono">{value}</span>
        </div>
        <input type="range" min={min} max={max} value={value} onChange={onChange} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400" />
    </div>
);

export default Studio;