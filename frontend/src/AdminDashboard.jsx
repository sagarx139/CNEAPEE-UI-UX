import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config'; // (Path adjust kar lena, agar file folder k andar h to ../config hoga)
import { 
  Users, Mail, Trash2, Send, RefreshCw, 
  Search, AlertTriangle, CheckCircle, XCircle, LogOut, ShieldAlert 
} from 'lucide-react';

const AdminDashboard = () => {
    // --- STATE ---
    const [users, setUsers] = useState([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    // UI Specific State
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

    // --- HELPER: Notification Toast (Better than alert) ---
    const showNotify = (type, msg) => {
        setNotification({ type, message: msg });
        setTimeout(() => setNotification(null), 3000);
    };

    // --- ORIGINAL BACKEND LOGIC (Restored) ---

    // 1. Fetch Users
    const fetchUsers = async () => {
        try {
            const res = await axios.get('https://cneapee-backend-703598443794.asia-south1.run.app/api/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            showNotify('error', "Failed to fetch users from backend");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Send Bulk Email
    const sendBulkEmail = async () => {
        if (!subject || !message) return showNotify('error', "Subject aur Message required hai!");
        
        setLoading(true);
        try {
            await axios.post('https://cneapee-backend-703598443794.asia-south1.run.app/api/admin/send-bulk-email', { subject, message });
            showNotify('success', "Emails Sent Successfully! 🚀");
            setSubject('');
            setMessage('');
        } catch (err) {
            console.error(err);
            showNotify('error', "Email bhejne mein error aaya.");
        }
        setLoading(false);
    };

    // 3. Delete Single User
    const deleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await axios.delete(`https://cneapee-backend-703598443794.asia-south1.run.app/api/admin/delete-user/${id}`);
                showNotify('success', "User deleted successfully");
                fetchUsers(); // Refresh list
            } catch (err) {
                console.error(err);
                showNotify('error', "Delete failed");
            }
        }
    };

    // 4. Delete All Users
    const deleteAllUsers = async () => {
        const confirm1 = window.confirm("⚠️ DANGER: Sab users delete ho jayenge! Pakka?");
        if (confirm1) {
            const confirm2 = window.confirm("Double Check: Wapas nahi aayenge users. Delete karu?");
            if (confirm2) {
                try {
                    await axios.delete('https://cneapee-backend-703598443794.asia-south1.run.app/api/admin/delete-all');
                    showNotify('success', "Pura Userbase Saaf! 🗑️");
                    fetchUsers(); // Refresh list
                } catch (err) {
                    console.error(err);
                    showNotify('error', "Delete All failed");
                }
            }
        }
    };

    // --- SEARCH FILTER (Client Side UI Only) ---
    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans relative overflow-hidden selection:bg-blue-500/30">
            
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            {/* --- NOTIFICATION TOAST --- */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md animate-slide-in ${
                    notification.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span className="font-medium tracking-wide">{notification.message}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto p-6 relative z-10">
                
                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
                    <div>
                        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-zinc-500 text-sm mt-2 font-medium">Overview & Management Console</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={fetchUsers} 
                            className="p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all border border-white/5 hover:border-white/10"
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                        <button className="flex items-center gap-2 px-5 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all font-semibold text-sm">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* --- LEFT: EMAIL COMPOSER (5 Cols) --- */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-900/20">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Broadcast</h2>
                                    <p className="text-xs text-zinc-500">Send updates to all users</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="group">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1 mb-2 block group-focus-within:text-blue-400 transition-colors">Subject Line</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Important System Update" 
                                        className="w-full p-4 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                    />
                                </div>
                                
                                <div className="group">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1 mb-2 block group-focus-within:text-blue-400 transition-colors">Message Content</label>
                                    <textarea 
                                        placeholder="Type your message here..." 
                                        className="w-full p-4 h-56 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner resize-none leading-relaxed"
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                    ></textarea>
                                </div>

                                <button 
                                    onClick={sendBulkEmail}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                >
                                    {loading ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <Send size={18} /> Send Campaign
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT: USER LIST (7 Cols) --- */}
                    <div className="lg:col-span-7">
                        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl h-full flex flex-col">
                            
                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl shadow-lg shadow-emerald-900/20">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">User Base</h2>
                                        <p className="text-xs text-zinc-500 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            {users.length} active records
                                        </p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={deleteAllUsers}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/5 text-red-500 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider group"
                                >
                                    <ShieldAlert size={16} />
                                    <span className="group-hover:hidden">Danger Zone</span>
                                    <span className="hidden group-hover:inline">Delete All Users</span>
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="relative mb-6 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Search users by name or email..." 
                                    className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all shadow-inner"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Table Container */}
                            <div className="flex-1 overflow-hidden border border-white/5 rounded-2xl bg-[#0a0a0a]/50">
                                <div className="overflow-y-auto h-[500px] custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-zinc-900/90 text-zinc-500 text-xs font-bold uppercase tracking-wider sticky top-0 backdrop-blur-md z-10 shadow-sm">
                                            <tr>
                                                <th className="p-5">User Profile</th>
                                                <th className="p-5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map(user => (
                                                    <tr key={user._id} className="group hover:bg-white/[0.02] transition-colors duration-200">
                                                        <td className="p-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10 flex items-center justify-center font-bold text-white text-sm shadow-md">
                                                                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                                                </div>
                                                                <div>
                                                                    <div className="font-semibold text-zinc-200 group-hover:text-white transition-colors">
                                                                        {user.name}
                                                                    </div>
                                                                    <div className="text-xs text-zinc-500 font-mono mt-0.5">
                                                                        {user.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-5 text-right">
                                                            <button 
                                                                onClick={() => deleteUser(user._id)}
                                                                className="p-2.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                                title="Delete User"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" className="py-20 text-center">
                                                        <div className="flex flex-col items-center justify-center gap-3 opacity-30">
                                                            <Search size={48} />
                                                            <span className="text-sm font-medium">No users found</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
                @keyframes slide-in { 
                    from { transform: translateX(100%); opacity: 0; } 
                    to { transform: translateX(0); opacity: 1; } 
                }
                .animate-slide-in { animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;