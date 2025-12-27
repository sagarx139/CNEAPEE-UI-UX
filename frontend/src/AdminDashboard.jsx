import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Delete icon import kiya
import { FaUserFriends, FaEye, FaChartLine, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    dailyViews: 0,
    totalViews: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend URL
  const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api";

  useEffect(() => {
    checkAdminAccess();
  }, []);

  // 🛡️ SECURITY CHECK: Sirf Admin ko ghusne do
  const checkAdminAccess = () => {
    const userString = localStorage.getItem('user'); // Ya jahan tum user store karte ho
    if (!userString) {
        alert("Please login first!");
        navigate('/');
        return;
    }

    const user = JSON.parse(userString);
    // Check role (Make sure tumhare DB mein admin ka role 'admin' set ho)
    if (user.role !== 'admin') {
        alert("⛔ Access Denied: Admins Only!");
        navigate('/'); 
        return;
    }

    // Agar admin hai, to data fetch karo
    fetchStats();
    fetchUsers();
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats`);
      setStats(res.data);
    } catch (error) {
      console.error("Stats Fetch Error", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("User Fetch Error", error);
    }
  };

  // 🗑️ DELETE USER FUNCTION
  const handleDeleteUser = async (userId) => {
    if(!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

    try {
        await axios.delete(`${API_URL}/admin/delete-user/${userId}`);
        // List refresh karo bina page reload kiye
        setUsers(users.filter(user => user._id !== userId));
        fetchStats(); // Update count
        alert("User Deleted Successfully");
    } catch (error) {
        alert("Failed to delete user");
        console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Verifying Admin Access...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-400">Admin Dashboard</h1>
        <span className="bg-red-500/20 text-red-400 px-4 py-1 rounded-full text-xs font-bold border border-red-500/50 flex items-center gap-2">
            <FaExclamationTriangle /> ADMIN AREA
        </span>
      </div>

      {/* 1. STATS CARDS (Simplified) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-500 hover:bg-gray-800/80 transition">
            <div className="flex items-center gap-4">
                <FaUserFriends className="text-3xl text-blue-400"/>
                <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
                </div>
            </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-500 hover:bg-gray-800/80 transition">
            <div className="flex items-center gap-4">
                <FaEye className="text-3xl text-green-400"/>
                <div>
                    <p className="text-gray-400 text-sm">Views Today</p>
                    <h2 className="text-2xl font-bold">{stats.dailyViews}</h2>
                </div>
            </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-purple-500 hover:bg-gray-800/80 transition">
            <div className="flex items-center gap-4">
                <FaChartLine className="text-3xl text-purple-400"/>
                <div>
                    <p className="text-gray-400 text-sm">Total Views</p>
                    <h2 className="text-2xl font-bold">{stats.totalViews}</h2>
                </div>
            </div>
        </div>
      </div>

      {/* 2. USER LIST TABLE WITH DELETE */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">User Management <span className="text-sm font-normal text-gray-500">({users.length})</span></h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-700 text-gray-400">
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Joined</th>
                        <th className="p-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                            <td className="p-3 font-medium">{user.name}</td>
                            <td className="p-3 text-blue-300">{user.email}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-600/20 text-gray-400'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="p-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className="p-3 text-right">
                                {user.role !== 'admin' && (
                                    <button 
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="text-red-400 hover:text-red-500 hover:bg-red-500/10 p-2 rounded transition"
                                        title="Delete User"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {users.length === 0 && <p className="text-center text-gray-500 mt-4">No users found.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;