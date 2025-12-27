import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaEye, FaChartLine, FaTrash, FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // 🚫 NO HARDCODED PASSWORDS HERE ANYMORE!

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState({ totalUsers: 0, dailyViews: 0, totalViews: 0 });
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api";

  // 🔐 SECURE LOGIN CHECK
  const handleUnlock = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setError('');

    try {
        // Hum ID/Pass Backend ko bhej rahe hain check karne ke liye
        const res = await axios.post(`${API_URL}/admin/verify-login`, credentials);
        
        if (res.data.success) {
            setIsUnlocked(true);
            fetchData();
        }
    } catch (err) {
        setError("❌ Wrong ID or Password! Access Denied.");
        setCredentials({ ...credentials, password: '' });
    }
    setVerifying(false);
  };

  const fetchData = async () => {
    setLoadingData(true);
    try {
        const statsRes = await axios.get(`${API_URL}/admin/stats`);
        setStats(statsRes.data);
        const usersRes = await axios.get(`${API_URL}/users`);
        setUsers(usersRes.data);
    } catch (error) { console.error("Error fetching data", error); }
    setLoadingData(false);
  };

  const handleDeleteUser = async (userId) => {
    if(!window.confirm("WARNING: Permanently delete this user?")) return;
    try {
        await axios.delete(`${API_URL}/admin/delete-user/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        setStats({...stats, totalUsers: stats.totalUsers - 1});
        alert("✅ User deleted");
    } catch (error) { alert("❌ Failed to delete"); }
  };

  // --- LOCKED SCREEN ---
  if (!isUnlocked) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-600/20 rounded-full text-blue-500">
                        <FaShieldAlt size={40} />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white text-center mb-2">Secure Admin Access</h2>
                <p className="text-zinc-500 text-center mb-6 text-sm">Credentials are verified securely by the server.</p>
                
                <form onSubmit={handleUnlock} className="space-y-4">
                    <div>
                        <label className="text-zinc-400 text-xs uppercase font-bold ml-1">Admin ID</label>
                        <input 
                            type="text" 
                            className="bg-black border border-zinc-700 text-white w-full rounded-lg px-3 py-3 mt-1 outline-none focus:border-blue-500 transition"
                            placeholder="Enter Admin ID"
                            value={credentials.id}
                            onChange={(e) => setCredentials({...credentials, id: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-zinc-400 text-xs uppercase font-bold ml-1">Password</label>
                        <input 
                            type="password" 
                            className="bg-black border border-zinc-700 text-white w-full rounded-lg px-3 py-3 mt-1 outline-none focus:border-blue-500 transition"
                            placeholder="Enter Server Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center font-bold animate-pulse">{error}</p>}

                    <button 
                        type="submit" 
                        disabled={verifying}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {verifying ? "Verifying..." : <><FaLock size={14} /> UNLOCK DASHBOARD</>}
                    </button>
                    
                    <button type="button" onClick={() => navigate('/')} className="w-full text-zinc-500 text-sm hover:text-white mt-2">Back to Home</button>
                </form>
            </div>
        </div>
    );
  }

  // --- UNLOCKED DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans animate-fade-in">
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="bg-green-600 p-2 rounded-lg"><FaLock size={20}/></span> Admin Console
            </h1>
            <p className="text-green-500 text-xs font-mono mt-1 ml-1">● SECURE CONNECTION ACTIVE</p>
        </div>
        <button onClick={() => setIsUnlocked(false)} className="flex items-center gap-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition text-sm font-bold border border-red-600/30">
            <FaLock /> LOCK PANEL
        </button>
      </div>

      {loadingData ? <div className="text-center py-20 text-gray-500">Loading Database...</div> : (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#111] p-6 rounded-xl border-l-4 border-blue-500 shadow-lg">
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
                </div>
                <div className="bg-[#111] p-6 rounded-xl border-l-4 border-green-500 shadow-lg">
                    <p className="text-gray-400 text-sm">Today's Views</p>
                    <h2 className="text-2xl font-bold">{stats.dailyViews}</h2>
                </div>
                <div className="bg-[#111] p-6 rounded-xl border-l-4 border-purple-500 shadow-lg">
                    <p className="text-gray-400 text-sm">Total Views</p>
                    <h2 className="text-2xl font-bold">{stats.totalViews}</h2>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-800"><h3 className="text-xl font-bold text-gray-200">User Database</h3></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-gray-900 text-gray-400 text-sm uppercase"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4 text-right">Actions</th></tr></thead>
                        <tbody className="divide-y divide-gray-800">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-800/50">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4 text-blue-400">{user.email}</td>
                                    <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-gray-700 text-gray-400">{user.role}</span></td>
                                    <td className="p-4 text-right">
                                        {user.role !== 'admin' && <button onClick={() => handleDeleteUser(user._id)} className="text-gray-500 hover:text-red-500 p-2"><FaTrash size={16}/></button>}
                                    </td>
                                </tbody>
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