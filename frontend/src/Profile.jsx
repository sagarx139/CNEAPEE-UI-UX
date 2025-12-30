import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Mail,
  Shield,
  Zap,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';

const API_URL =
  "https://cneapee-backend-703598443794.asia-south1.run.app/api/auth";

export default function Profile({ onNavigate }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const stored = JSON.parse(localStorage.getItem("profile"));
        setUserData(stored?.result);
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(data.result);
      localStorage.setItem("profile", JSON.stringify(data));
    } catch {
      const stored = JSON.parse(localStorage.getItem("profile"));
      setUserData(stored?.result);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-pulse text-sm tracking-wide">Loading profile…</div>
      </div>
    );

  if (!userData)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        No user data
      </div>
    );

  // ---- SAME LOGIC ----
  const textLimits = { free: 4000, neo: 27000, working: 60000, coder: 200000 };
  const imageLimits = { none: 0, gen_ai_first: 25, lite: 99, excess: 199, max: 499 };

  const textPlan = userData.plan || "free";
  const imgPlan = userData.imagePlan || "none";

  const textUsage = userData.usage?.dailyTokens || 0;
  const imgUsage = userData.usage?.generatedImages || 0;

  const textPerc = Math.min((textUsage / textLimits[textPlan]) * 100, 100).toFixed(1);
  const imgPerc =
    imageLimits[imgPlan] > 0
      ? Math.min((imgUsage / imageLimits[imgPlan]) * 100, 100).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-4 py-6">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate("home")}
            className="p-3 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 mb-5 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
              <img
                src={
                  userData.picture ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="User"
                className="w-full h-full rounded-full object-cover bg-black"
              />
            </div>

            <h2 className="mt-4 text-lg font-semibold">{userData.name}</h2>
            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
              <Mail size={12} /> {userData.email}
            </p>

            <span className="mt-3 px-3 py-1 text-[10px] uppercase tracking-widest rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
              <Shield size={10} /> {userData.role || "User"}
            </span>
          </div>
        </div>

        {/* Text Usage */}
        <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 mb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Zap size={15} className="text-yellow-400" />
              Text Usage
            </div>
            <span className="text-xs text-zinc-400">{textPerc}%</span>
          </div>

          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700"
              style={{ width: `${textPerc}%` }}
            />
          </div>

          <div className="flex justify-between mt-3 text-[11px] text-zinc-500">
            <span>Plan: <b className="text-white capitalize">{textPlan}</b></span>
            <span>Daily</span>
          </div>
        </div>

        {/* Image Usage */}
        <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ImageIcon size={15} className="text-purple-400" />
              Image Usage
            </div>
            <span className="text-xs text-zinc-400">{imgPerc}%</span>
          </div>

          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
              style={{ width: `${imgPerc}%` }}
            />
          </div>

          <div className="flex justify-between mt-3 text-[11px] text-zinc-500">
            <span>
              Plan: <b className="text-white capitalize">{imgPlan.replace(/_/g, " ")}</b>
            </span>
            <span>Monthly</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("pricing")}
            className="flex-1 py-3 rounded-xl bg-white text-black font-semibold active:scale-[0.97] transition"
          >
            Upgrade
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-400 font-semibold hover:bg-red-500 hover:text-white transition active:scale-[0.97]"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
