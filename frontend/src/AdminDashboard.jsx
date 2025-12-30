import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Shield, Search, Trash2, 
  BarChart3, Eye, Zap, Lock, LogOut, Megaphone, Mail, Send, Check, Image as ImageIcon 
} from 'lucide-react';

const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/admin";

// HELPER: Text Plan Limit
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

// HELPER: Image Plan Limit
const getImagePlanLimit = (planName) => {
    const plan = planName?.toLowerCase() || 'none';
    switch(plan) {
        case 'gen_ai_first': return 25;
        case 'lite': return 99;
        case 'excess': return 199;
        case 'max': return 499;
        default: return 0;
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
  
  const handleApprovePayment = async (req) => {
      if(!window.confirm(`Approve ${req.planName} for ${req.userName}?`)) return;
      try {
          const token = sessionStorage.getItem('admin_token');
          // Important: Sending both requestId and planName
          await axios.post(`${API_URL}/approve-payment`, 
             { requestId: req._id, userId: req.userId, planName: req.planName },
             { headers: { 'x-admin-token': token } }
          );
          setRequests(requests.filter(r => r._id !== req._id));
          fetchDashboardData(token);
          alert("✅ Plan Activated Successfully!");
      } catch (error) { 
          const msg = error.response?.data?.message || "Unknown Error";
          alert(`Approval Failed: ${msg}`); 
      }
  };

  // ✅ UPDATED: Handle Both Plan Types (Text & Image)
  const handleUpdatePlan = async (userId, newPlan, type) => {
    if (!window.confirm(`Change ${type} plan to ${newPlan}?`)) return;
    setUpdating(userId);
    try {
      const token = sessionStorage.getItem('admin_token');
      await axios.put(`${API_URL}/update-plan/${userId}`, 
        { plan: newPlan, type }, // Sending type to backend
        { headers: { 'x-admin-token': token } }
      );
      
      // Optimistic UI Update
      setUsers(users.map(u => {
          if (u._id === userId) {
              return type === 'image' ? { ...u, imagePlan: newPlan } : { ...u, plan: newPlan };
          }
          return u;
      }));
    } catch (error) { alert("Failed to update plan"); } 
    finally { setUpdating(null); }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("⚠️ DELETE USER?")) return;
    try {
        const token = sessionStorage.getItem('admin_token');
        await axios.delete(`${API_URL}/delete-user/${userId}`, { headers: { 'x-admin-token': token } });
        setUsers(users.filter(u => u._id !== userId));
    } catch (error) { alert("Failed to delete"); }
  };

  const handleSendBroadcast = async () => {
    if(!broadcastMsg.trim()) return;
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
        <div className="w-full max-w-md bg-[#0e0e11] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Security</h2>
          <form onSubmit={handleAdminLogin} className="space-y-4 mt-6">
            <input type="text" value={adminId} onChange={e => setAdminId(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" placeholder="Secure ID" />
            <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" placeholder="Password" />
            {loginError && <div className="text-red-400 text-xs text-center font-bold">{loginError}</div>}
            <button type="submit" disabled={isChecking} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all">
              {isChecking ? "Verifying..." : "Unlock Console"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-4 md:p-8">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
           <button onClick={handleLogout} className="p-3 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition border border-white/5"><LogOut size={20}/></button>
           <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="text-indigo-500" fill="currentColor" /> Admin Console</h1>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <StatCard label="Users" value={stats.totalUsers} icon={Users} color="text-blue-400" />
            <StatCard label="Views" value={stats.dailyViews} icon={Eye} color="text-green-400" />
        </div>
      </div>

      {/* --- PENDING REQUESTS --- */}
      {requests.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8 bg-[#0e0e11] border border-orange-500/30 rounded-3xl overflow-hidden shadow-2xl p-4">
          <h2 className="text-lg font-bold text-orange-400 flex items-center gap-2 mb-4"><Zap size={20}/> Pending Requests ({requests.length})</h2>
          <div className="space-y-2">
            {requests.map(req => (
              <div key={req._id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-orange-500/30 transition">
                <div>
                  <div className="font-bold">{req.userName}</div>
                  <div className="text-xs text-zinc-500">{req.userEmail}</div>
                  <div className="text-xs text-indigo-400 mt-1 font-bold">Req: {req.planName}</div>
                </div>
                <button onClick={() => handleApprovePayment(req)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                  <Check size={14}/> Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="max-w-7xl mx-auto mb-6 relative group">
          <Search className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#0e0e11] border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition text-sm text-white" />
      </div>

      {/* Main Table */}
      <div className="max-w-7xl mx-auto bg-[#0e0e11] border border-white/5 rounded-3xl overflow-hidden shadow-2xl min-h-[400px]">
         {loading ? <div className="p-20 text-center text-zinc-500">Loading...</div> : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                     <th className="p-5">User</th>
                     <th className="p-5">Text Plan</th>
                     <th className="p-5">Image Plan</th> {/* NEW COLUMN */}
                     <th className="p-5">Usage (Txt / Img)</th>
                     <th className="p-5 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {filteredUsers.map(user => (
                     <tr key={user._id} className="hover:bg-white/[0.02] transition">
                       <td className="p-5">
                         <div className="font-bold text-sm">{user.name}</div>
                         <div className="text-xs text-zinc-500">{user.email}</div>
                       </td>
                       
                       {/* Text Plan */}
                       <td className="p-5">
                          <select value={user.plan || 'free'} onChange={(e) => handleUpdatePlan(user._id, e.target.value, 'text')} className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-zinc-300 outline-none cursor-pointer">
                              <option value="free">Free</option><option value="neo">Neo</option><option value="working">Working</option><option value="coder">Coder</option>
                          </select>
                       </td>

                       {/* Image Plan (NEW) */}
                       <td className="p-5">
                          <select value={user.imagePlan || 'none'} onChange={(e) => handleUpdatePlan(user._id, e.target.value, 'image')} className="bg-black border border-purple-500/30 rounded px-2 py-1 text-xs text-purple-300 outline-none cursor-pointer">
                              <option value="none">None</option>
                              <option value="gen_ai_first">Gen AI First</option>
                              <option value="lite">Lite</option>
                              <option value="excess">Excess</option>
                              <option value="max">Max</option>
                          </select>
                       </td>

                       {/* Dual Stats */}
                       <td className="p-5">
                          <div className="flex flex-col gap-1">
                            <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                               <Zap size={10} className="text-yellow-500"/>
                               {user.usage?.dailyTokens || 0}/{getPlanLimit(user.plan)}
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                               <ImageIcon size={10} className="text-purple-500"/>
                               {user.usage?.generatedImages || 0}/{getImagePlanLimit(user.imagePlan)}
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