import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaEye, FaChartLine, FaTrash, FaLock, FaArrowLeft } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, dailyViews: 0, totalViews: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend URL
  const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api";
  
  // 🔒 SECURITY LIST: Sirf in emails ko entry milegi
  const ADMIN_EMAILS = ["sanskritibhushan139@gmail.com", "sagarx139@gmail.com"];

  useEffect(() => {
    checkAccessAndFetch();
  }, []);

  const checkAccessAndFetch = () => {
    const userString = localStorage.getItem('user');
    
    // 1. Agar login hi nahi hai -> Bahar
    if (!userString) {
      alert("Please login first!");
      navigate('/');
      return;
    }

    const loggedInUser = JSON.parse(userString);

    // 2. Agar Email List mein nahi hai AUR Role bhi Admin nahi hai -> Bahar
    const isAuthorized = ADMIN_EMAILS.includes(loggedInUser.email) || loggedInUser.role === 'admin';

    if (!isAuthorized) {
      alert("⛔ SECURITY ALERT: You are not authorized to view this page.");
      navigate('/'); // Home page par phek do
      return;
    }

    // 3. Agar sab sahi hai -> Data lao
    fetchStats();
    fetchUsers();
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats`);
      setStats(res.data);
    } catch (error) { console.error("Stats Error", error); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (error) { console.error("User Error", error); }
  };

  // 🗑️ DELETE USER LOGIC
  const handleDeleteUser = async (userId) => {
    if(!window.confirm("WARNING: Are you sure you want to permanently delete this user?")) return;

    try {
        await axios.delete(`${API_URL}/admin/delete-user/${userId}`);
        // UI se hatao bina refresh kiye
        setUsers(users.filter(u => u._id !== userId));
        fetchStats(); // Counts update karo
        alert("✅ User deleted successfully");
    } catch (error) {
        alert("❌ Failed to delete user");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <FaLock className="text-4xl text-blue-500 animate-pulse"/>
        <p className="text-lg font-mono text-blue-400">Verifying Admin Credentials...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="bg-blue-600 p-2 rounded-lg"><FaLock size={20}/></span> 
                Admin Console
            </h1>
            <p className="text-gray-400 text-sm mt-1 ml-1">Manage Users & Analytics</p>
        </div>
        
        <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition text-sm font-medium"
        >
            <FaArrowLeft /> Back to Home
        </button>
      </div>

      {/* 1. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
            icon={FaUserFriends} 
            label="Total Users" 
            value={stats.totalUsers} 
            color="text-blue-400" 
            borderColor="border-blue-500" 
        />
        <StatCard 
            icon={FaEye} 
            label="Today's Views" 
            value={stats.dailyViews} 
            color="text-green-400" 
            borderColor="border-green-500" 
        />
        <StatCard 
            icon={FaChartLine} 
            label="All Time Views" 
            value={stats.totalViews} 
            color="text-purple-400" 
            borderColor="border-purple-500" 
        />
      </div>

      {/* 2. USERS TABLE */}
      <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-200">Registered Users</h3>
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
                                {/* Delete Button - Admin ko delete mat karne dena */}
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
            {users.length === 0 && (
                <div className="p-8 text-center text-gray-500">No users found.</div>
            )}
        </div>
      </div>
    </div>
  );
};

// Simple Component for Stats
const StatCard = ({ icon: Icon, label, value, color, borderColor }) => (
    <div className={`bg-[#111] p-6 rounded-xl border-l-4 shadow-lg ${borderColor} flex items-center gap-5 hover:bg-[#161616] transition`}>
        <div className={`p-3 rounded-full bg-gray-800/50 ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-gray-400 text-xs uppercase font-bold tracking-wide">{label}</p>
            <h2 className="text-3xl font-bold text-white mt-1">{value}</h2>
        </div>
    </div>
);

export default AdminDashboard;