import React, { useState } from "react";
import { Check, ArrowLeft, X, Loader2, PartyPopper } from "lucide-react";
import axios from 'axios';

// Backend URL update karna mat bhoolna
const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/admin";

const PLANS = [
  { name: "Free", price: "₹0", features: ["Basic chat", "Standard speed", "Limited usage"], primary: false, btnText: "Current Plan", disabled: true },
  { name: "Neo", price: "₹199", features: ["High daily limits", "More detailed responses", "Priority access"], primary: true, btnText: "Get Started", disabled: false },
  { name: "Air", price: "₹499", features: ["Advanced reasoning", "Longer context"], primary: false, btnText: "Coming Soon", disabled: true },
  { name: "Ultra", price: "₹999", features: ["Maximum capability", "Advanced coding"], primary: false, btnText: "Coming Soon", disabled: true }
];

export default function Pricing({ user, onNavigate }) {
  const [showModal, setShowModal] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Success

  const handlePlanClick = (plan) => {
    if (plan.name === "Neo") {
      if(!user) return alert("Please Login First!");
      setShowModal(true);
    }
  };

  const handleApplyCoupon = async () => {
    if (coupon.trim().toUpperCase() !== "NEWYEAR100") {
      alert("Invalid Coupon! Try: NEWYEAR100");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/submit-payment-request`, {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        planName: "Neo"
      });
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-10 relative">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => onNavigate("home")} className="p-2 rounded-lg bg-white/5 hover:bg-white/10"><ArrowLeft size={18} /></button>
          <h1 className="text-xl font-semibold">Pricing</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          {PLANS.map((plan, idx) => (
            <div key={idx} className={`rounded-2xl border p-6 flex flex-col ${plan.primary ? "border-indigo-500 bg-indigo-500/5" : "border-white/10 bg-white/5"}`}>
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="my-4"><span className="text-3xl font-bold">{plan.price}</span><span className="text-sm text-zinc-400">/mo</span></div>
              <ul className="space-y-3 text-sm flex-1 mb-6">{plan.features.map((f, i) => (<li key={i} className="flex gap-2 text-zinc-300"><Check size={16} className="text-green-500"/>{f}</li>))}</ul>
              <button onClick={() => handlePlanClick(plan)} disabled={plan.disabled} className={`w-full py-3 rounded-xl font-bold text-sm ${plan.primary ? "bg-indigo-600 hover:bg-indigo-500" : "bg-white/10 opacity-50 cursor-not-allowed"}`}>{plan.btnText}</button>
            </div>
          ))}
        </div>
      </div>

      {/* FAKE BILLING MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20}/></button>
            
            {step === 1 ? (
              <>
                <h3 className="text-xl font-bold mb-2">Secure Checkout</h3>
                <p className="text-zinc-400 text-sm mb-6">Plan: <span className="text-indigo-400 font-bold">Neo (₹199)</span></p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase font-bold">Coupon Code</label>
                    <input type="text" placeholder="Enter Code" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white mt-1 focus:border-indigo-500 outline-none"/>
                    <p className="text-[10px] text-zinc-500 mt-1">*Hint: Use NEWYEAR100</p>
                  </div>
                  <div className="bg-zinc-900/50 p-3 rounded-lg flex justify-between text-sm"><span className="text-zinc-400">Total:</span><span className="font-bold text-white">₹0.00</span></div>
                  <button onClick={handleApplyCoupon} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex justify-center items-center">{loading ? <Loader2 className="animate-spin"/> : "Complete Upgrade"}</button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <PartyPopper size={40} className="mx-auto text-green-500 mb-4"/>
                <h3 className="text-2xl font-bold mb-2">Success!</h3>
                <p className="text-zinc-400 mb-6">Request sent. You will be upgraded shortly.</p>
                <button onClick={() => { setShowModal(false); onNavigate('home'); }} className="w-full bg-white text-black font-bold py-3 rounded-xl">Back to Home</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}