import React from 'react';
import { Check, ArrowLeft, Zap, Star } from 'lucide-react';

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    tokens: "4,000 / day",
    color: "bg-[#18181b]",
    border: "border-white/5",
    btnColor: "bg-white/10 hover:bg-white/20",
    features: ["Basic Chat Access", "Standard Speed", "Community Support"]
  },
  {
    name: "Student",
    price: "₹199",
    tokens: "27,000 / day",
    color: "bg-[#0e0e11]", // Darker base
    border: "border-blue-500/30",
    btnColor: "bg-blue-600 hover:bg-blue-500",
    popular: true,
    features: ["Ideal for Learners", "Faster Responses", "Priority Access"]
  },
  {
    name: "Working",
    price: "₹499",
    tokens: "60,000 / day",
    color: "bg-[#0e0e11]",
    border: "border-indigo-500/30",
    btnColor: "bg-indigo-600 hover:bg-indigo-500",
    features: ["For Professionals", "High Limits", "Advanced Context"]
  },
  {
    name: "Coder",
    price: "₹999",
    tokens: "200k / day",
    color: "bg-[#0e0e11]",
    border: "border-purple-500/30",
    btnColor: "bg-purple-600 hover:bg-purple-500",
    features: ["Max Power", "Code Generation", "No Limits"]
  }
];

export default function Pricing({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => onNavigate('home')} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-zinc-300 transition-all border border-white/5">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Back to Home</h1>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Choose Your Power
          </h2>
          <p className="text-zinc-400">More tokens = More detailed answers & coding capabilities.</p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan, idx) => (
            <div key={idx} className={`relative rounded-3xl p-6 border ${plan.border} ${plan.color} flex flex-col transition-transform hover:-translate-y-2 hover:shadow-2xl`}>
              
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                  <Star size={10} fill="currentColor"/> Most Popular
                </div>
              )}

              <h3 className="text-lg font-bold text-zinc-100 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-zinc-500">/mo</span>
              </div>

              <div className="bg-white/5 rounded-xl p-3 mb-6 border border-white/5">
                <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-wide mb-1">
                  <Zap size={12} fill="currentColor" /> Daily Limit
                </div>
                <div className="text-xl font-mono text-white font-semibold">{plan.tokens}</div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check size={16} className="text-green-500 shrink-0 mt-0.5" /> 
                    <span className="opacity-80">{feat}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg ${plan.btnColor} text-white`}>
                {plan.name === 'Free' ? 'Current Plan' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}