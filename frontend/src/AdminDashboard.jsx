import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Shield, Search, ArrowLeft, Trash2, 
  BarChart3, Eye, Zap, Lock, LogOut 
} from 'lucide-react';

const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/admin";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Login State
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  // Dashboard State
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, dailyViews: 0, totalViews: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(null);
  
  const navigate = useNavigate();

  // Check if session exists on load
  useEffect(() => {
    const adminToken = sessionStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
      fetchDashboardData(adminToken);
    }
  }, []);

  // --- 🔐 1. LOGIN HANDLING ---
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
        // SAVE SPECIAL TOKEN
        const token = res.data.token;
        sessionStorage.setItem('admin_token', token);
        setIsAuthenticated(true);
        fetchDashboardData(token);
      }
    } catch (err) {
      console.error(err);
      setLoginError('❌ Access Denied: Invalid ID or Password');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  // --- 📡 2. DATA FETCHING (Uses Admin Token) ---
  const fetchDashboardData = async (tokenOverride) => {
    setLoading(true);
    const token = tokenOverride || sessionStorage.getItem('admin_token');

    try {
      const config = { headers: { 'x-admin-token': token } }; // Special Header

      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/stats`, config),
        axios.get(`${API_URL}/users`, config)
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      
    } catch (error) {
      console.error("Fetch Error:", error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        handleLogout(); // Session Expired
      }
    } finally {
      setLoading(false);
    }
  };

  // --- ⚡ UPDATE PLAN ---
  const handleUpdatePlan = async (userId, newPlan) => {
    if (!window.confirm(`Change plan to ${newPlan}?`)) return;
    setUpdating(userId);
    try {
      const token = sessionStorage.getItem('admin_token');
      await axios.put(`${API_URL}/update-plan/${userId}`, { plan: newPlan }, {
        headers: { 'x-admin-token': token }
      });
      
      setUsers(users.map(u => u._id === userId ? { ...u, plan: newPlan } : u));
    } catch (error) {
      alert("Failed to update plan.");
    } finally {
      setUpdating(null);
    }
  };

  // --- 🗑️ DELETE USER ---
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("⚠️ DELETE USER PERMANENTLY?")) return;
    try {
        const token = sessionStorage.getItem('admin_token');
        await axios.delete(`${API_URL}/delete-user/${userId}`, {
            headers: { 'x-admin-token': token }
        });
        setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
        alert("Delete Failed");
    }
  };

  // --- RENDER LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-indigo-500/30">
        <div className="w-full max-w-md bg-[#0e0e11] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-indigo-500 border border-white/5 shadow-lg shadow-indigo-500/10">
              <Shield size={32} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Security</h2>
          <p className="text-zinc-500 text-center mb-8 text-sm">Identity Verification Required.</p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Secure ID</label>
              <input 
                type="text" 
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                className="w-full mt-2 bg-[#050505] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none transition"
                placeholder="Enter ID"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Password</label>
              <input 
                type="password" 
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                className="w-full mt-2 bg-[#050505] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none transition"
                placeholder="Enter Password"
              />
            </div>

            {loginError && <div className="text-red-400 text-xs text-center font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{loginError}</div>}

            <button 
              type="submit" 
              disabled={isChecking}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all mt-4 flex justify-center gap-2 items-center shadow-lg shadow-indigo-500/20"
            >
              {isChecking ? "Verifying..." : <><Lock size={16}/> Unlock Console</>}
            </button>
          </form>

          <button onClick={() => navigate('/')} className="w-full text-center text-zinc-600 text-xs mt-6 hover:text-white transition">
            &larr; Return to Application
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-4 md:p-8 selection:bg-indigo-500/30">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
           <button onClick={handleLogout} className="p-3 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition border border-white/5 group">
             <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform"/>
           </button>
           <div>
             <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="text-indigo-500" fill="currentColor" /> Admin Console
             </h1>
             <p className="text-xs text-zinc-500">System Overview & Management</p>
           </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <StatCard label="Users" value={stats.totalUsers} icon={Users} color="text-blue-400" />
            <StatCard label="Views Today" value={stats.dailyViews} icon={Eye} color="text-green-400" />
            <StatCard label="Total Views" value={stats.totalViews} icon={BarChart3} color="text-purple-400" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-6 relative group">
          <Search className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search users database..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0e0e11] border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition text-sm text-white placeholder:text-zinc-600"
          />
      </div>

      {/* Users Table */}
      <div className="max-w-7xl mx-auto bg-[#0e0e11] border border-white/5 rounded-3xl overflow-hidden shadow-2xl min-h-[400px]">
         {loading ? (
             <div className="p-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
                <p className="text-sm font-medium">Fetching secure data...</p>
             </div>
         ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                     <th className="p-5">User Profile</th>
                     <th className="p-5">System Role</th>
                     <th className="p-5">Plan Status</th>
                     <th className="p-5 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {filteredUsers.map(user => (
                     <tr key={user._id} className="hover:bg-white/[0.02] transition group">
                       
                       <td className="p-5">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-bold border border-white/5 shadow-inner">
                             {user.name?.charAt(0).toUpperCase() || 'U'}
                           </div>
                           <div>
                             <div className="font-bold text-zinc-200 text-sm">{user.name}</div>
                             <div className="text-xs text-zinc-500">{user.email}</div>
                             <div className="text-[10px] text-zinc-600 font-mono mt-0.5">
                               Used: <span className="text-zinc-400">{user.usage?.dailyTokens || 0}</span> tokens
                             </div>
                           </div>
                         </div>
                       </td>

                       <td className="p-5">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-zinc-800/50 text-zinc-500 border-white/5'}`}>
                            {user.role || 'user'}
                          </span>
                       </td>

                       <td className="p-5">
                         <div className="relative w-32">
                            <select 
                              value={user.plan || 'free'} 
                              onChange={(e) => handleUpdatePlan(user._id, e.target.value)}
                              disabled={updating === user._id}
                              className={`
                                w-full appearance-none bg-[#050505] border border-white/10 rounded-lg pl-3 pr-8 py-2 text-xs font-bold uppercase tracking-wide focus:border-indigo-500 outline-none cursor-pointer transition
                                ${user.plan === 'coder' ? 'text-purple-400 border-purple-500/30' : 
                                  user.plan === 'working' ? 'text-blue-400 border-blue-500/30' : 
                                  user.plan === 'student' ? 'text-green-400 border-green-500/30' : 'text-zinc-400'}
                              `}
                            >
                              <option value="free">Free</option>
                              <option value="student">Student</option>
                              <option value="working">Working</option>
                              <option value="coder">Coder</option>
                            </select>
                            <Zap size={12} className="absolute right-3 top-2.5 text-zinc-600 pointer-events-none opacity-50" />
                         </div>
                       </td>

                       <td className="p-5 text-right">
                         <button 
                            onClick={() => handleDeleteUser(user._id)} 
                            className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                            title="Delete User"
                         >
                            <Trash2 size={16} />
                         </button>
                       </td>

                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
         )}
         
         {!loading && filteredUsers.length === 0 && (
            <div className="p-16 text-center">
               <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-600"><Search size={20}/></div>
               <p className="text-zinc-500 text-sm">No users found.</p>
            </div>
         )}
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-[#0e0e11] border border-white/5 rounded-2xl p-4 flex items-center gap-4 min-w-[150px] shadow-lg hover:border-white/10 transition">
        <div className={`p-2.5 rounded-xl bg-white/5 ${color} shadow-inner`}>
            <Icon size={20} />
        </div>
        <div>
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">{label}</div>
        </div>
    </div>
);