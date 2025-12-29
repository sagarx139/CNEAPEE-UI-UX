import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Zap, ArrowLeft, LogOut } from 'lucide-react';

export default function Profile({ onNavigate }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // 1. Backend se jo data login ke waqt mila tha (jisme usage aur plan hai)
    const storedProfile = JSON.parse(localStorage.getItem('profile')); 
    // 2. Google Auth ka raw data (backup ke liye)
    const googleData = JSON.parse(localStorage.getItem('user_data'));
    
    // Priority: Backend Profile > Google Data
    setUserData(storedProfile?.result || googleData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; // Hard Refresh taaki state clear ho jaye
  };

  if (!userData) return (
    <div className="h-screen bg-[#050505] text-white flex items-center justify-center font-sans">
      <div className="animate-pulse">Loading Profile...</div>
    </div>
  );

  // --- 📊 TOKEN CALCULATION LOGIC ---
  const limits = { 
    free: 4000, 
    student: 27000, 
    working: 60000, 
    coder: 200000 
  };
  
  const userPlan = userData.plan || 'free';
  const dailyLimit = limits[userPlan];
  const currentUsage = userData.usage?.dailyTokens || 0;
  
  // Percentage nikalna (Max 100%)
  const percentage = Math.min((currentUsage / dailyLimit) * 100, 100).toFixed(1);

  // Progress Bar Color Logic
  const getProgressColor = () => {
    if (percentage > 90) return 'from-red-500 to-orange-500';
    if (percentage > 70) return 'from-yellow-500 to-orange-500';
    return 'from-indigo-500 to-purple-500';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6 flex flex-col items-center justify-center relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* --- BACKGROUND GLOW --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => onNavigate('home')} 
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 backdrop-blur-md"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        </div>

        {/* --- USER INFO CARD --- */}
        <div className="bg-[#0e0e11] border border-white/10 rounded-3xl p-8 mb-6 relative overflow-hidden shadow-2xl">
           <div className="flex flex-col items-center gap-4 relative z-10">
            {/* Avatar with Glow Ring */}
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              {userData.picture ? (
                <img 
                  src={userData.picture} 
                  alt="User" 
                  className="w-full h-full object-cover rounded-full border-4 border-[#0e0e11]" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="w-full h-full bg-[#0e0e11] rounded-full flex items-center justify-center border-4 border-[#0e0e11]">
                    <User size={32} />
                </div>
              )}
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
              <p className="text-zinc-500 text-sm flex items-center justify-center gap-2 mt-1">
                <Mail size={12}/> {userData.email}
              </p>
              
              {/* Role Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 text-indigo-300">
                <Shield size={10} /> {userData.role || 'User'}
              </div>
            </div>
           </div>
        </div>

        {/* --- USAGE & PLAN CARD --- */}
        <div className="bg-gradient-to-br from-[#121214] to-[#0a0a0c] border border-white/10 rounded-3xl p-6 mb-6 hover:border-white/20 transition-all">
          
          {/* Progress Header */}
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
                <Zap size={16} className="text-yellow-500" fill="currentColor"/> Daily Token Usage
             </div>
             <div className={`text-xs font-mono font-bold ${percentage > 90 ? 'text-red-400' : 'text-zinc-400'}`}>
                {percentage}% Used
             </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden mb-2 border border-white/5">
             <div 
               className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-1000 ease-out`} 
               style={{ width: `${percentage}%` }}
             ></div>
          </div>
          
          <div className="text-[10px] text-zinc-600 text-right mb-6">
            Refreshes every 24 hours
          </div>

          <div className="w-full h-px bg-white/5 mb-4"></div>

          {/* Plan Details */}
          <div className="flex justify-between items-center">
             <div className="text-sm text-zinc-400">
                Current Plan: <span className="text-white capitalize font-bold text-lg align-middle ml-1">{userPlan}</span>
             </div>
             <button 
                onClick={() => onNavigate('pricing')} 
                className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-lg shadow-white/10"
             >
                Upgrade Plan
             </button>
          </div>
        </div>

        {/* --- LOGOUT BUTTON --- */}
        <button 
          onClick={handleLogout} 
          className="w-full py-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
        >
           <LogOut size={18} /> Sign Out
        </button>

      </div>
    </div>
  );
}