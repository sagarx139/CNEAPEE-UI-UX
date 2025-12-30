import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, X, Loader2, PartyPopper, Tag, CreditCard, ShieldCheck, ImageIcon, MessageSquare } from "lucide-react";
import axios from 'axios';

// ✅ Backend URL
const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/admin";

// PLAN DATA
const TEXT_PLANS = [
  { name: "Free", price: "₹0", features: ["Basic chat", "Standard speed", "Limited usage"], primary: false, btnText: "Current Plan", disabled: true },
  { name: "Neo", price: "₹199", features: ["High daily limits", "More detailed responses", "Priority access"], primary: true, btnText: "Get Started", disabled: false },
  { name: "Working", price: "₹499", features: ["Advanced reasoning", "Longer context"], primary: false, btnText: "Coming Soon", disabled: true },
  { name: "Coder", price: "₹999", features: ["Maximum capability", "Advanced coding"], primary: false, btnText: "Coming Soon", disabled: true }
];

const IMAGE_PLANS = [
  { name: "Gen AI First", price: "₹59", features: ["25 Images / Month", "Fast Generation", "Standard Quality"], primary: true, btnText: "Start Creating", disabled: false },
  { name: "Lite", price: "₹219", features: ["99 Images / Month", "High Speed", "HD Quality"], primary: false, btnText: "Coming Soon", disabled: true },
  { name: "Excess", price: "₹429", features: ["199 Images / Month", "Commercial Use", "Priority Queue"], primary: false, btnText: "Coming Soon", disabled: true },
  { name: "Max", price: "₹999", features: ["499 Images / Month", "Top Priority", "4K Downloads"], primary: false, btnText: "Coming Soon", disabled: true }
];

export default function Pricing({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState("text"); // 'text' or 'image'
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // Stores selected plan details
  
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false); 
  const [applyingCoupon, setApplyingCoupon] = useState(false); 
  const [step, setStep] = useState(1); 
  
  const [price, setPrice] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [activeUser, setActiveUser] = useState(user);
  useEffect(() => {
    if (user) { setActiveUser(user); } 
    else {
        const stored = localStorage.getItem('user_data') || localStorage.getItem('profile');
        if (stored) try { setActiveUser(JSON.parse(stored)); } catch(e) {}
    }
  }, [user]);

  // Handle Plan Click
  const handlePlanClick = (plan) => {
    if (!activeUser) return alert("Please Login First!");
    
    // Check if the plan is available for purchase
    if (plan.disabled) return;

    setSelectedPlan(plan);
    setPrice(parseInt(plan.price.replace("₹", "")));
    setCoupon("");
    setIsCouponApplied(false);
    setStep(1);
    setShowModal(true);
  };

  // Coupon Logic (Applies to both Neo and Gen AI First)
  const handleApplyCoupon = () => {
    setApplyingCoupon(true);
    setCouponError("");
    setTimeout(() => {
        if (coupon.trim().toUpperCase() === "NEWYEAR100") {
            setPrice(0);
            setIsCouponApplied(true);
        } else {
            setCouponError("Invalid Coupon Code");
        }
        setApplyingCoupon(false);
    }, 1000);
  };

  // Final Payment Submission
  const handleFinalPayment = async () => {
    setLoading(true);
    setStep(2); 
    try {
      await axios.post(`${API_URL}/submit-payment-request`, {
        userId: activeUser._id || activeUser.sub,
        userName: activeUser.name,
        userEmail: activeUser.email,
        planName: selectedPlan.name // Send specific name (e.g., "Gen AI First")
      });
      setTimeout(() => { setStep(3); setLoading(false); }, 2000);
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
      setStep(1); setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 py-10 relative font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
             <button onClick={() => onNavigate("home")} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/5"><ArrowLeft size={20} /></button>
             <h1 className="text-2xl font-bold tracking-tight">Upgrade Plan</h1>
          </div>

          {/* Toggle Switch */}
          <div className="bg-[#0e0e11] border border-white/10 p-1 rounded-xl flex gap-1">
             <button onClick={() => setActiveTab("text")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "text" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}>
                <MessageSquare size={16}/> Text Intelligence
             </button>
             <button onClick={() => setActiveTab("image")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "image" ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"}`}>
                <ImageIcon size={16}/> Image Creation
             </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {(activeTab === "text" ? TEXT_PLANS : IMAGE_PLANS).map((plan, idx) => (
            <div key={idx} className={`relative group rounded-3xl border p-8 flex flex-col transition-all duration-300 hover:-translate-y-1
                ${plan.primary 
                  ? activeTab === "text" 
                        ? "border-indigo-500/50 bg-gradient-to-b from-indigo-900/20 to-[#0a0a0a] shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]" 
                        : "border-purple-500/50 bg-gradient-to-b from-purple-900/20 to-[#0a0a0a] shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]"
                  : "border-white/10 bg-[#0e0e0e]"
                }`}>
              
              {plan.primary && <div className={`absolute top-0 right-0 text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider ${activeTab === 'text' ? 'bg-indigo-600' : 'bg-purple-600'}`}>Most Popular</div>}
              
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="my-4">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-zinc-500 font-medium">{activeTab === 'text' ? '/mo' : '/pack'}</span>
              </div>
              
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-6"></div>

              <ul className="space-y-4 text-sm flex-1 mb-8">
                  {plan.features.map((f, i) => (
                      <li key={i} className="flex gap-3 text-zinc-300 items-start">
                          <div className="mt-0.5 p-0.5 bg-green-500/20 rounded-full text-green-400"><Check size={12}/></div>
                          {f}
                      </li>
                  ))}
              </ul>
              
              <button 
                  onClick={() => handlePlanClick(plan)} 
                  disabled={plan.disabled} 
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg
                  ${plan.primary 
                    ? activeTab === "text" ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-purple-600 hover:bg-purple-500 text-white"
                    : "bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5"}`}
              >
                  {plan.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 MODAL (Reused for both) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-white/10 w-full max-w-md rounded-3xl relative shadow-2xl overflow-hidden flex flex-col min-h-[450px]">
            
            {step === 1 && <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 z-20 text-zinc-400 hover:text-white bg-black/20 p-2 rounded-full backdrop-blur-sm transition"><X size={20}/></button>}

            {step === 1 && (
              <div className="p-8 flex flex-col h-full relative z-10">
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 border shadow-inner ${activeTab === 'text' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
                        <CreditCard size={24}/>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Confirm Purchase</h3>
                    <p className="text-zinc-400 text-sm">Upgrade to {selectedPlan?.name}</p>
                </div>

                <div className="text-center mb-8">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Payable</p>
                    <div className="flex items-center justify-center gap-3">
                        {isCouponApplied && <span className="text-2xl text-zinc-600 line-through decoration-red-500/50 decoration-2">{selectedPlan?.price}</span>}
                        <span className={`font-extrabold tracking-tight transition-all duration-500 ${isCouponApplied ? "text-5xl text-green-400" : "text-5xl text-white"}`}>₹{price}</span>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    <label className="text-xs text-zinc-400 font-bold uppercase flex items-center gap-1"><Tag size={12}/> Coupon Code</label>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Ex: NEWYEAR100" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} disabled={isCouponApplied} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors uppercase font-mono text-sm"/>
                        <button onClick={handleApplyCoupon} disabled={isCouponApplied || !coupon} className={`px-4 rounded-xl font-bold text-sm transition-all border ${isCouponApplied ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-white/10 hover:bg-white/20 text-white border-white/10"}`}>{applyingCoupon ? <Loader2 className="animate-spin" size={18}/> : isCouponApplied ? "Applied" : "Apply"}</button>
                    </div>
                    {couponError && <p className="text-red-400 text-xs animate-pulse">{couponError}</p>}
                    {isCouponApplied && <p className="text-green-400 text-xs flex items-center gap-1"><ShieldCheck size={12}/> 100% Discount Applied!</p>}
                </div>

                <div className="mt-auto">
                    <button onClick={handleFinalPayment} className={`w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all ${activeTab === 'text' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'}`}>
                        {isCouponApplied ? "Activate Free Plan" : `Pay ₹${price}`}
                    </button>
                </div>
              </div>
            )}

            {step === 2 && (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="relative w-24 h-24 mb-6">
                        <div className={`absolute inset-0 border-4 border-t-transparent rounded-full animate-spin ${activeTab === 'text' ? 'border-indigo-500' : 'border-purple-500'}`}></div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Processing...</h3>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] mb-6 animate-bounce"><Check className="text-black" size={40} strokeWidth={4}/></div>
                    <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
                    <p className="text-zinc-400 mb-8 max-w-[250px] mx-auto text-sm">Your request for <span className="font-bold text-white">{selectedPlan?.name}</span> has been received.</p>
                    <button onClick={() => { setShowModal(false); onNavigate('home'); }} className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-colors">Back to Dashboard</button>
                    <div className="absolute top-10 left-10 text-yellow-500 animate-ping opacity-50"><PartyPopper/></div>
                </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}