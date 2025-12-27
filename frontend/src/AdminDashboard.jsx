import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Agar icons install nahi hain to terminal me: npm install react-icons
import { FaUserFriends, FaEye, FaEnvelope, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    dailyViews: 0,
    totalViews: 0,
    emailsSent: 0,
    emailLimit: 300
  });
  const [users, setUsers] = useState([]);
  
  // Forms State
  const [broadcast, setBroadcast] = useState({ subject: '', message: '' });
  const [personal, setPersonal] = useState({ email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Backend URL (Production Friendly)
  const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api";

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

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
      // User fetch route fix kiya (/api/users)
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("User Fetch Error", error);
    }
  };

  const handleBroadcast = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/send-bulk-email`, broadcast);
      setStatusMsg("✅ Broadcast Sent!");
      fetchStats(); // Update quota
    } catch (err) {
      setStatusMsg("❌ Broadcast Failed");
    }
    setLoading(false);
  };

  const handlePersonalMail = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/send-personal-email`, personal);
      setStatusMsg(`✅ Mail sent to ${personal.email}`);
      fetchStats();
    } catch (err) {
      setStatusMsg("❌ Personal Mail Failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">Admin Dashboard & Analytics</h1>

      {/* 1. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-4">
                <FaUserFriends className="text-3xl text-blue-400"/>
                <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
                </div>
            </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <div className="flex items-center gap-4">
                <FaEye className="text-3xl text-green-400"/>
                <div>
                    <p className="text-gray-400 text-sm">Views Today</p>
                    <h2 className="text-2xl font-bold">{stats.dailyViews}</h2>
                </div>
            </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-4">
                <FaChartLine className="text-3xl text-purple-400"/>
                <div>
                    <p className="text-gray-400 text-sm">Total Views</p>
                    <h2 className="text-2xl font-bold">{stats.totalViews}</h2>
                </div>
            </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center gap-4">
                <FaEnvelope className="text-3xl text-yellow-400"/>
                <div>
                    <p className="text-gray-400 text-sm">Email Quota (Daily)</p>
                    <h2 className="text-xl font-bold">{stats.emailLimit - stats.emailsSent} / {stats.emailLimit}</h2>
                    <p className="text-xs text-gray-500">Remaining</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 2. BROADCAST SECTION */}
        <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaEnvelope/> Broadcast (To All)</h3>
            <input 
                className="w-full bg-gray-700 p-3 rounded mb-3 text-white" 
                placeholder="Subject" 
                onChange={(e) => setBroadcast({...broadcast, subject: e.target.value})}
            />
            <textarea 
                className="w-full bg-gray-700 p-3 rounded mb-3 text-white h-32" 
                placeholder="Message for everyone..."
                onChange={(e) => setBroadcast({...broadcast, message: e.target.value})}
            ></textarea>
            <button 
                onClick={handleBroadcast} 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold transition">
                {loading ? "Sending..." : "Send Broadcast"}
            </button>
        </div>

        {/* 3. PERSONAL MAIL SECTION */}
        <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaUserFriends/> Personal Mail</h3>
            <input 
                className="w-full bg-gray-700 p-3 rounded mb-3 text-white" 
                placeholder="User Email (e.g. user@gmail.com)" 
                onChange={(e) => setPersonal({...personal, email: e.target.value})}
            />
            <input 
                className="w-full bg-gray-700 p-3 rounded mb-3 text-white" 
                placeholder="Subject" 
                onChange={(e) => setPersonal({...personal, subject: e.target.value})}
            />
            <textarea 
                className="w-full bg-gray-700 p-3 rounded mb-3 text-white h-20" 
                placeholder="Personal Message..."
                onChange={(e) => setPersonal({...personal, message: e.target.value})}
            ></textarea>
            <button 
                onClick={handlePersonalMail} 
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-bold transition">
                {loading ? "Sending..." : "Send Personal Email"}
            </button>
        </div>
      </div>

      {statusMsg && <p className="mt-4 text-center text-lg font-bold text-yellow-400">{statusMsg}</p>}

      {/* 4. USER LIST TABLE */}
      <div className="mt-10 bg-gray-800 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">User Base ({users.length})</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-700 text-gray-400">
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700">
                            <td className="p-3">{user.name}</td>
                            <td className="p-3 text-blue-300">{user.email}</td>
                            <td className="p-3">{user.role}</td>
                            <td className="p-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;