import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Store({ onBack }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030305] text-zinc-800 dark:text-zinc-200 animate-fade-in flex flex-col">
      
      {/* Header – unchanged */}
      <div className="p-4 border-b border-zinc-200 dark:border-white/10 flex items-center gap-3 bg-white dark:bg-[#030305] sticky top-0 z-10">
        <button
          onClick={onBack}
          className="hover:bg-zinc-100 dark:hover:bg-white/10 p-2 rounded-full transition"
        >
          <ArrowRight className="rotate-180" size={20} />
        </button>
        <span className="font-bold text-lg">Store+</span>
      </div>

      {/* Coming Soon Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl animate-fade-up">

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Coming This Spring 🌸
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            Products that all generations love — built with the{" "}
            <span className="font-semibold text-zinc-900 dark:text-white">
              quality of emotions
            </span>
            , powered by{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              high-quality technology
            </span>
            .
          </p>

          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            And much more is on the way ✨
          </p>

          {/* Glow line */}
          <div className="mt-8 h-[2px] w-40 mx-auto bg-gradient-to-r 
                          from-transparent via-indigo-500 to-transparent 
                          animate-pulse" />
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
