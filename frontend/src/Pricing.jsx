import React from "react";
import { Check, ArrowLeft } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    desc: "Get started with core AI features",
    features: [
      "Basic AI chat access",
      "Standard response speed",
      "Limited daily usage",
      "Community support"
    ],
    primary: false
  },
  {
    name: "Basic",
    price: "₹199",
    desc: "For students and everyday learning",
    features: [
      "Higher daily usage limits",
      "More detailed responses",
      "Faster performance",
      "Priority system access"
    ],
    primary: true
  },
  {
    name: "Air",
    price: "₹499",
    desc: "For professionals and creators",
    features: [
      "High usage limits",
      "Advanced AI reasoning",
      "Longer context handling",
      "Priority performance"
    ],
    primary: false
  },
  {
    name: "Ultra",
    price: "₹999",
    desc: "Maximum power for developers",
    features: [
      "Maximum AI capability",
      "Advanced code generation",
      "Extended context & memory",
      "Top-priority performance"
    ],
    primary: false
  }
];

export default function Pricing({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => onNavigate("home")}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold">Pricing</h1>
        </div>

        {/* Title */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Choose a plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {PLANS.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-6 flex flex-col
                ${plan.primary
                  ? "border-indigo-500 bg-indigo-500/5"
                  : "border-white/10 bg-white/5"
                }`}
            >
              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <p className="text-sm text-zinc-400 mb-4">{plan.desc}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-zinc-400 text-sm"> / month</span>
              </div>

              <ul className="space-y-3 text-sm flex-1 mb-6">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <Check size={16} className="text-green-500 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-semibold text-sm transition
                  ${plan.primary
                    ? "bg-indigo-600 hover:bg-indigo-500"
                    : "bg-white/10 hover:bg-white/20"
                  }`}
              >
                {plan.name === "Free" ? "Current plan" : "Get started"}
              </button>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-zinc-500 mt-10">
          AI responses may vary. Usage limits apply. Plans auto-renew monthly.
        </p>
      </div>
    </div>
  );
}
