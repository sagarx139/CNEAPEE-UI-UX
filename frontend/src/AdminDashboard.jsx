import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaEye, FaChartLine, FaTrash, FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // =========================================================
  // 🔑 ADMIN SETTINGS (YAHAN SE ID PASSWORD BADAL LO)
  // =========================================================
  const ADMIN_ID = "cneapeexadmin";
  const ADMIN_PASS = "cneapeemumbaiserver1";
  // =========================================================

  // States
  const [isUnlocked, setIsUnlocked] = useState(false); // Lock status
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState({ totalUsers: 0, dailyViews: 0, totalViews: 0 });
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Backend URL
  const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api";

  // 🔐 HANDLE LOGIN (Ye check karega ID/Pass)
  const handleUnlock = (e) => {
    e.preventDefault();
    
    if (credentials.id === ADMIN_ID && credentials.password === ADMIN_PASS) {
        setIsUnlocked(true); // Gate khul gaya
        fetchData(); // Ab data mangwao
    } else {
        setError("❌ Invalid Credentials! Access Denied.");
        // Shake effect ya clear password kar sakte ho
        setCredentials({ ...credentials, password: '' });
    }
  };

  // Data Fetching Functions
  const fetchData = async () => {
    setLoadingData(true);
    try {
        const statsRes = await axios.get(`${API_URL}/admin/stats`);
        setStats(statsRes.data);
        const usersRes = await axios.get(`${API_URL}/users`);
        setUsers(usersRes.data);
    } catch (error) {
        console.error("Error fetching data", error);
    }
    setLoadingData(false);
  };

  // Delete User Logic
  const handleDeleteUser = async (userId) => {
    if(!window.confirm("WARNING: Permanently delete this user?")) return;
    try {
        await axios.delete(`${API_URL}/admin/delete-user/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        // Stats update manually
        setStats({...stats, totalUsers: stats.totalUsers - 1});
        alert("✅ User deleted");
    } catch (error) {
        alert("❌ Failed to delete");
    }
  };

  // --- 🛑 LOCKED SCREEN (Agar ID/Pass nahi dala) ---
  if (!isUnlocked) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-600/20 rounded-full text-blue-500">
                        <FaShieldAlt size={40} />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white text-center mb-2">Restricted Area</h2>
                <p className="text-zinc-500 text-center mb-6 text-sm">Enter Admin Credentials to access database.</p>
                
                <form onSubmit={handleUnlock} className="space-y-4">
                    <div>
                        <label className="text-zinc-400 text-xs uppercase font-bold ml-1">Admin ID</label>
                        <div className="flex items-center bg-black border border-zinc-700 rounded-lg px-3 py-3 mt-1 focus-within:border-blue-500 transition">
                            <FaUserFriends className="text-zinc-500 mr-3" />
                            <input 
                                type="text" 
                                className="bg-transparent text-white w-full outline-none placeholder-zinc-700"
                                placeholder="Enter Admin ID"
                                value={credentials.id}
                                onChange={(e) => setCredentials({...credentials, id: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-zinc-400 text-xs uppercase font-bold ml-1">Password</label>
                        <div className="flex items-center bg-black border border-zinc-700 rounded-lg px-3 py-3 mt-1 focus-within:border-blue-500 transition">
                            <FaKey className="text-zinc-500 mr-3" />
                            <input 
                                type="password" 
                                className="bg-transparent text-white w-full outline-none placeholder-zinc-700"
                                placeholder="Enter Server Password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center font-bold animate-pulse">{error}</p>}

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <FaLock size={14} /> UNLOCK DASHBOARD
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => navigate('/')}
                        className="w-full text-zinc-500 text-sm hover:text-white mt-2"
                    >
                        Back to Home
                    </button>
                </form>
            </div>
        </div>
    );
  }

  // --- ✅ UNLOCKED DASHBOARD (Agar ID/Pass sahi hai) ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans animate-fade-in">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="bg-green-600 p-2 rounded-lg"><FaLock size={20}/></span> 
                Admin Console
            </h1>
            <p className="text-green-500 text-xs font-mono mt-1 ml-1">● SESSION ACTIVE: {ADMIN_ID}</p>
        </div>
        
        <button 
            onClick={() => setIsUnlocked(false)} 
            className="flex items-center gap-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition text-sm font-bold border border-red-600/30"
        >
            <FaLock /> LOCK PANEL
        </button>
      </div>

      {loadingData ? (
          <div className="text-center py-20 text-gray-500">Loading Database...</div>
      ) : (
        <>
            {/* 1. STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#111] p-6 rounded-xl border-l-4 border-blue-500 shadow-lg">
                    <div className="flex items-center gap-4">
                        <FaUserFriends className="text-3xl text-blue-400"/>
                        <div>
                            <p className="text-gray-400 text-sm">Total Users</p>
                            <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
                        </div>
                    </div>
                </div>
                <div className="bg-[#111] p-6 rounded-xl border-l-4 border-green-500 shadow-lg">
                    <div className="flex items-center gap-4">
                        <FaEye className="text-3xl text-green-400"/>
                        <div>
                            <p className="text-gray-400 text-sm">Today's Views</p>
                            <h2 className="text-2xl font-bold">{stats.dailyViews}</h2>
                        </div>
                    </div>
                </div>
                <div className="bg-[#111] p-6 rounded-xl border-l-4 border-purple-500 shadow-lg">
                    <div className="flex items-center gap-4">
                        <FaChartLine className="text-3xl text-purple-400"/>
                        <div>
                            <p className="text-gray-400 text-sm">Total Views</p>
                            <h2 className="text-2xl font-bold">{stats.totalViews}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. USERS TABLE */}
            <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-200">User Database</h3>
                    <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded">{users.length} Records</span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Date Joined</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-800/50 transition duration-150">
                                    <td className="p-4 font-medium text-white">{user.name}</td>
                                    <td className="p-4 text-blue-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                            user.role === 'admin' 
                                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                                            : 'bg-gray-700/30 text-gray-400 border-gray-600/30'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        {user.role !== 'admin' && (
                                            <button 
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition"
                                                title="Delete User"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;