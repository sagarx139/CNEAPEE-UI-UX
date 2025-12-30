import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Shield, Search, Trash2, 
  BarChart3, Eye, Zap, Lock, LogOut, Megaphone, Mail, Send, Check 
} from 'lucide-react';

const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/admin";

// --- 1. PLAN LIMITS HELPER ---
const getPlanLimit = (planName) => {
  const plan = planName?.toLowerCase() || 'free';
  switch(plan) {
    case 'neo': return 27000;
    case 'working': return 60000;
    case 'coder': return 204000;
    case 'free': 
    default: return 4000;
  }
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Login State
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  // Dashboard Data
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]); 
  const [stats, setStats] = useState({ totalUsers: 0, dailyViews: 0, totalViews: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(null);

  // Broadcast States
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  
  const navigate = useNavigate();

  // Session Check
  useEffect(() => {
    const adminToken = sessionStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
      fetchDashboardData(adminToken);
    }
  }, []);

  // --- LOGIN ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    setLoginError('');

    try {
      const res = await axios.post(`${API_URL}/verify-login`, {
        id: adminId,
        password: adminPass
      });

      if (res.data.success) {
        const token = res.data.token;
        sessionStorage.setItem('admin_token', token);
        setIsAuthenticated(true);
        fetchDashboardData(token);
      }
    } catch (err) {
      setLoginError('❌ Invalid Credentials');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  // --- FETCH DATA ---
  const fetchDashboardData = async (tokenOverride) => {
    setLoading(true);
    const token = tokenOverride || sessionStorage.getItem('admin_token');
    try {
      const config = { headers: { 'x-admin-token': token } };
      
      const [statsRes, usersRes, reqRes] = await Promise.all([
        axios.get(`${API_URL}/stats`, config),
        axios.get(`${API_URL}/users`, config),
        axios.get(`${API_URL}/payment-requests`, config)
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setRequests(reqRes.data);

    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---
  
  // FIX: Approve Payment with Better Error Handling
  const handleApprovePayment = async (req) => {
      if(!window.confirm(`Approve ${req.planName} for ${req.userName}?`)) return;
      try {
          const token = sessionStorage.getItem('admin_token');
          
          console.log("Approving:", req); // Debug log

          await axios.post(`${API_URL}/approve-payment`, 
             { requestId: req._id, userId: req.userId, planName: req.planName },
             { headers: { 'x-admin-token': token } }
          );
          
          // UI Update
          setRequests(requests.filter(r => r._id !== req._id));
          fetchDashboardData(token);
          
          alert("✅ User Upgraded!");
      } catch (error) { 
          console.error("Approval Error:", error);
          // Show real error from backend
          const msg = error.response?.data?.message || error.message || "Unknown Error";
          alert(`Approval Failed: ${msg}`); 
      }
  };

  // Update Plan Manually
  const handleUpdatePlan = async (userId, newPlan) => {
    if (!window.confirm(`Change plan to ${newPlan}?`)) return;
    setUpdating(userId);
    try {
      const token = sessionStorage.getItem('admin_token');
      await axios.put(`${API_URL}/update-plan/${userId}`, { plan: newPlan }, { headers: { 'x-admin-token': token } });
      setUsers(users.map(u => u._id === userId ? { ...u, plan: newPlan } : u));
    } catch (error) { alert("Failed to update plan"); } 
    finally { setUpdating(null); }
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("⚠️ DELETE USER?")) return;
    try {
        const token = sessionStorage.getItem('admin_token');
        await axios.delete(`${API_URL}/delete-user/${userId}`, { headers: { 'x-admin-token': token } });
        setUsers(users.filter(u => u._id !== userId));
    } catch (error) { alert("Failed to delete"); }
  };

  // Broadcasts
  const handleSendBroadcast = async () => {
    if(!broadcastMsg.trim()) return;
    if(!window.confirm("Set this live banner?")) return;
    try {
        const token = sessionStorage.getItem('admin_token');
        await axios.post(`${API_URL}/broadcast`, { message: broadcastMsg }, { headers: { 'x-admin-token': token } });
        alert("📢 Banner Updated!");
        setBroadcastMsg('');
    } catch (error) { alert("Failed"); }
  };

  const handleClearBroadcast = async () => {
    try {
        const token = sessionStorage.getItem('admin_token');
        await axios.delete(`${API_URL}/broadcast`, { headers: { 'x-admin-token': token } });
        alert("Banner Removed");
    } catch (error) { alert("Failed"); }
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailBody) return alert("Fill all fields");
    if (!window.confirm(`Email ALL ${users.length} users?`)) return;
    setSendingEmail(true);
    try {
        const token = sessionStorage.getItem('admin_token');
        await axios.post(`${API_URL}/send-email-broadcast`, 
           { subject: emailSubject, message: emailBody }, 
           { headers: { 'x-admin-token': token } }
        );
        alert("✅ Emails Sent!");
        setEmailSubject(''); setEmailBody('');
    } catch (error) { alert("Email Failed"); }
    finally { setSendingEmail(false); }
  };

  // --- UI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30">
        <div className="w-full max-w-md bg-[#0e0e11] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-indigo-500 border border-white/5 shadow-lg">
              <Shield size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Security</h2>
          <p className="text-zinc-500 text-center mb-8 text-sm">Identity Verification Required.</p>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input type="text" value={adminId} onChange={e => setAdminId(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" placeholder="Secure ID" />
            <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" placeholder="Password" />
            {loginError && <div className="text-red-400 text-xs text-center font-bold">{loginError}</div>}
            <button type="submit" disabled={isChecking} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all mt-4 flex justify-center gap-2 items-center">
              {isChecking ? "Verifying..." : <><Lock size={16}/> Unlock Console</>}
            </button>
          </form>
          <button onClick={() => navigate('/')} className="w-full text-center text-zinc-600 text-xs mt-6 hover:text-white">&larr; Go Home</button>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-4 md:p-8 selection:bg-indigo-500/30">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
           <button onClick={handleLogout} className="p-3 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition border border-white/5"><LogOut size={20}/></button>
           <div>
             <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="text-indigo-500" fill="currentColor" /> Admin Console</h1>
           </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <StatCard label="Users" value={stats.totalUsers} icon={Users} color="text-blue-400" />
            <StatCard label="Views Today" value={stats.dailyViews} icon={Eye} color="text-green-400" />
            <StatCard label="Total Views" value={stats.totalViews} icon={BarChart3} color="text-purple-400" />
        </div>
      </div>

      {/* --- 💰 PENDING PAYMENT REQUESTS --- */}
      {requests.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8 bg-[#0e0e11] border border-orange-500/30 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/5 bg-orange-500/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-orange-400 flex items-center gap-2">
              <Zap size={20}/> Pending Upgrades
            </h2>
            <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-bold">{requests.length} pending</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-white/5">
                {requests.map(req => (
                  <tr key={req._id} className="hover:bg-white/[0.02]">
                    <td className="p-5">
                      <div className="font-bold text-white">{req.userName}</div>
                      <div className="text-xs text-zinc-500">{req.userEmail}</div>
                    </td>
                    <td className="p-5">
                      <span className="text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full text-xs border border-indigo-500/20">
                        Requested: {req.planName}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleApprovePayment(req)}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition font-bold text-xs flex items-center gap-2 float-right"
                        title="Approve & Upgrade"
                      >
                        <Check size={16} /> Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- BROADCAST & EMAIL CONTROL PANEL --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* 📢 Banner Broadcast */}
          <div className="bg-[#0e0e11] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Megaphone size={18} className="text-orange-400"/> Live Site Banner</h2>
              <div className="flex gap-2">
                  <input type="text" value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} placeholder="Type announcement..." className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-white focus:border-orange-500 outline-none" />
                  <button onClick={handleSendBroadcast} className="bg-orange-600 hover:bg-orange-500 p-3 rounded-xl"><Send size={18}/></button>
                  <button onClick={handleClearBroadcast} className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-xl"><Trash2 size={18}/></button>
              </div>
          </div>

          {/* 📧 Email Broadcast */}
          <div className="bg-[#0e0e11] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Mail size={18} className="text-blue-400"/> Email Newsletter</h2>
              <div className="space-y-3">
                  <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Subject..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none" />
                  <div className="flex gap-2">
                      <input type="text" value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder="Message Body..." className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none" />
                      <button onClick={handleSendEmail} disabled={sendingEmail} className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl disabled:opacity-50 text-white">{sendingEmail ? "..." : <Send size={18}/>}</button>
                  </div>
              </div>
          </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto mb-6 relative group">
          <Search className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#0e0e11] border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition text-sm text-white" />
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-[#0e0e11] border border-white/5 rounded-3xl overflow-hidden shadow-2xl min-h-[400px]">
         {loading ? <div className="p-20 text-center text-zinc-500">Loading...</div> : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                     <th className="p-5">User</th>
                     <th className="p-5">Role</th>
                     <th className="p-5">Plan</th>
                     <th className="p-5">Token Usage (Used/Limit)</th>
                     <th className="p-5 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {filteredUsers.map(user => (
                     <tr key={user._id} className="hover:bg-white/[0.02] transition">
                       <td className="p-5">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-white/5">{user.name?.charAt(0)}</div>
                           <div><div className="font-bold text-zinc-200 text-sm">{user.name}</div><div className="text-xs text-zinc-500">{user.email}</div></div>
                         </div>
                       </td>
                       <td className="p-5"><span className="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-400">{user.role}</span></td>
                       <td className="p-5">
                          <select value={user.plan || 'free'} onChange={(e) => handleUpdatePlan(user._id, e.target.value)} disabled={updating === user._id} className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-zinc-300 outline-none cursor-pointer">
                              <option value="free">Free</option><option value="neo">Neo</option><option value="working">Working</option><option value="coder">Coder</option>
                          </select>
                       </td>

                       {/* --- NEW TOKEN USAGE COLUMN --- */}
                       <td className="p-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white text-xs font-mono">
                               <Zap size={10} className="inline mr-1 text-yellow-500"/>
                               {user.usage?.dailyTokens || 0} / {getPlanLimit(user.plan)}
                            </span>
                            <div className="w-24 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                               <div className="h-full bg-indigo-500" style={{ width: `${Math.min(((user.usage?.dailyTokens || 0) / getPlanLimit(user.plan)) * 100, 100)}%` }}></div>
                            </div>
                          </div>
                       </td>

                       <td className="p-5 text-right"><button onClick={() => handleDeleteUser(user._id)} className="text-zinc-500 hover:text-red-500"><Trash2 size={16}/></button></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
         )}
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-[#0e0e11] border border-white/5 rounded-2xl p-4 flex items-center gap-4 min-w-[150px] shadow-lg">
        <div className={`p-2 rounded-xl bg-white/5 ${color}`}><Icon size={20} /></div>
        <div><div className="text-xl font-bold text-white">{value}</div><div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">{label}</div></div>
    </div>
);