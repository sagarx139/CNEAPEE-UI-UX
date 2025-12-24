import React, { useState } from "react";
import {
  Home,
  DollarSign,
  X,
  Sparkles,
  Layers,
  Cloud,
  Image,
} from "lucide-react";

// 1. Accepted onBack prop
const Studio = ({ onBack }) => {
  const [showPlans, setShowPlans] = useState(false);
  const [floatPositions] = useState(() =>
    Array.from({ length: 18 }).map(() => ({
      top: Math.random() * 95,
      left: Math.random() * 95,
    }))
  );

  // initial floatPositions are set via lazy useState initializer above

  return (
    <div className="min-h-screen bg-[#eef4fb] relative overflow-hidden font-sans">
      
      {/* Floating background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {floatPositions.map((p, i) => (
          <div
            key={i}
            className="absolute w-10 h-10 rounded-xl border border-white/40 bg-white/10"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
            }}
          />
        ))}
      </div>

      {/* NAVBAR */}
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md shadow-lg rounded-full px-4 py-2">
          
          {/* 2. Added onClick handler for Back */}
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-100 transition text-slate-600 hover:text-slate-900"
          >
            <Home size={18} />
          </button>

          <div className="w-px h-6 bg-slate-200" />

          <span className="text-sm font-semibold text-slate-900 px-2">
            Creative Studio
          </span>

          <div className="w-px h-6 bg-slate-200" />

          <button
            onClick={() => setShowPlans(true)}
            className="p-2 rounded-full hover:bg-slate-100 transition text-slate-600 hover:text-slate-900"
          >
            <DollarSign size={18} />
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative z-10">

        {/* 3. Feature Card - Moved into flow with margin-bottom (mb-8) */}
        <div className="bg-white rounded-2xl shadow-lg px-5 py-4 flex items-start gap-3 max-w-xs mb-8 transition-transform hover:-translate-y-1 duration-300">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600 shrink-0">
            <Sparkles size={18} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">
              AI-Assisted Editing
            </p>
            <p className="text-xs text-slate-500">
              Background removal, cleanup & intelligent enhancements
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700 font-semibold">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Center Card */}
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-[380px] p-8 relative">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
            <Image size={28} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            CNEAPEE Creative Studio
          </h2>

          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Browser-native photo editing inspired by professional tools.
          </p>

          <p className="text-xs text-slate-400 mt-3">
            No uploads · Privacy-first · Real-time editing
          </p>
        </div>

        {/* Side Pills - Kept absolute for decoration */}
        <div className="hidden md:flex absolute left-10 lg:left-24 top-1/2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm items-center gap-2 animate-pulse">
          <Layers size={16} className="text-purple-600" />
          <span className="text-xs font-semibold text-slate-600">Layer-Based</span>
        </div>

        <div className="hidden md:flex absolute right-10 lg:right-24 top-1/2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm items-center gap-2 animate-pulse delay-700">
          <Cloud size={16} className="text-blue-500" />
          <span className="text-xs font-semibold text-slate-600">Cloud Sync</span>
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-10 md:bottom-20 flex gap-8 md:gap-16 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">0ms</p>
            <p className="text-xs md:text-sm text-slate-500">Edit Latency</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">100%</p>
            <p className="text-xs md:text-sm text-slate-500">Client-Side</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">60+</p>
            <p className="text-xs md:text-sm text-slate-500">FPS Render</p>
          </div>
        </div>
      </div>

      {/* PRICING MODAL */}
      {showPlans && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl p-6 md:p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowPlans(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-bold text-center mb-2">
              Creative Studio Plans
            </h2>
            <p className="text-sm text-slate-500 text-center mb-8">
              These are upcoming plans
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Lite */}
              <div className="border rounded-2xl p-6 text-center hover:border-slate-300 transition">
                <h3 className="font-bold text-lg">Studio Lite</h3>
                <p className="text-2xl font-black my-2 text-slate-800">
                  ₹129<span className="text-sm font-medium text-slate-500">/mo</span>
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6 text-left pl-4 list-disc">
                  <li>Basic Tools</li>
                  <li>1080p Export</li>
                  <li>5GB Storage</li>
                </ul>
                <button className="w-full py-2 rounded-xl bg-slate-100 font-semibold cursor-not-allowed text-slate-400">
                  Coming Soon
                </button>
              </div>

              {/* EG */}
              <div className="border-2 border-purple-500 rounded-2xl p-6 text-center shadow-lg transform md:-translate-y-2 bg-white relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
                <h3 className="font-bold text-lg text-purple-700">Studio EG</h3>
                <p className="text-2xl font-black my-2 text-slate-900">
                  ₹299<span className="text-sm font-medium text-slate-500">/mo</span>
                </p>
                <ul className="text-sm text-slate-600 space-y-2 mb-6 text-left pl-4 list-disc">
                  <li>Advanced Effects</li>
                  <li>4K Export</li>
                  <li>Stock Library</li>
                </ul>
                <button className="w-full py-2 rounded-xl bg-purple-600 text-white font-semibold cursor-not-allowed opacity-80">
                  Coming Soon
                </button>
              </div>

              {/* X */}
              <div className="border rounded-2xl p-6 text-center hover:border-slate-300 transition">
                <h3 className="font-bold text-lg">Studio X</h3>
                <p className="text-2xl font-black my-2 text-slate-800">
                  ₹499<span className="text-sm font-medium text-slate-500">/mo</span>
                </p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6 text-left pl-4 list-disc">
                  <li>AI Gen Tools</li>
                  <li>Team Collaboration</li>
                  <li>Priority Rendering</li>
                </ul>
                <button className="w-full py-2 rounded-xl bg-slate-100 font-semibold cursor-not-allowed text-slate-400">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Studio;