import React from 'react';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';

export default function Store({ onBack }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030305] text-zinc-800 dark:text-zinc-200 animate-fade-in flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-white/10 flex items-center gap-3 bg-white dark:bg-[#030305] sticky top-0 z-10">
        <button onClick={onBack} className="hover:bg-zinc-100 dark:hover:bg-white/10 p-2 rounded-full transition">
          <ArrowRight className="rotate-180" size={20} />
        </button>
        <span className="font-bold text-lg">Store+</span>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-zinc-500">AI Tools, Plugins, and Premium Features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sample Product Card */}
          <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 transition group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                <ShoppingBag size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 px-2 py-1 rounded-full">
                <Star size={12} fill="currentColor" /> 4.9
              </div>
            </div>
            <h3 className="font-bold text-lg mb-1">Neuro Pro License</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Unlock unlimited queries, 4K image generation, and priority support.
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-bold text-xl">$19.99</span>
              <button className="bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition">
                Buy Now
              </button>
            </div>
          </div>

          {/* Coming Soon Card */}
          <div className="bg-zinc-50 dark:bg-white/5 border border-dashed border-zinc-300 dark:border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center opacity-70">
            <ShoppingBag size={32} className="text-zinc-300 mb-3" />
            <h3 className="font-bold text-lg">More items coming soon</h3>
          </div>
        </div>
      </div>
    </div>
  );
}