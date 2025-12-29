import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'; 
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import config from './config'; 

// --- IMPORT PAGES ---
import Home from './Home';
import Chatbot from './Chatbot';
import Vision from './Vision';
// import Plans from './Plans'; 
import Learning from './Learning';
import HealthApp from './HealthApp';
import NewsApp from './NewsApp';
import Store from './Store';
import Convo from './Convo';
import Studio from './Studio';
import Policy from './Policy';
import AdminDashboard from './AdminDashboard';

// ✅ FIXED IMPORTS (Assuming files are in the same folder as App.jsx)
import Profile from './Profile'; 
import Pricing from './Pricing'; 

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // --- PERSIST LOGIN ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // --- GOOGLE LOGIN HANDLER ---
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Backend Connection
      try {
        const backendRes = await axios.post(`${config.API_URL}/api/auth/google`, {
          name: decoded.name,
          email: decoded.email,
          googleId: decoded.sub, 
          picture: decoded.picture
        });

        if (backendRes.data.token) {
            localStorage.setItem('token', backendRes.data.token);
            localStorage.setItem('profile', JSON.stringify(backendRes.data)); 
        }
      } catch (err) {
        console.error("Backend Error:", err);
      }

      setUser(decoded);
      localStorage.setItem('user_data', JSON.stringify(decoded));
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.clear();
    navigate('/'); 
  };

  const commonProps = { onBack: () => navigate('/') };
  const onNavigate = (path) => navigate(path === 'home' ? '/' : `/${path}`);

  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-indigo-500/30">
      <Routes>
        <Route path="/" element={<Home user={user} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />} />
        
        <Route path="/chatbot" element={<Chatbot onNavigate={onNavigate} />} />
        <Route path="/vision" element={<Vision onNavigate={onNavigate} />} />
        
        {/* Pricing & Plans */}
        <Route path="/pricing" element={<Pricing onNavigate={onNavigate} />} />
        <Route path="/plans" element={<Pricing onNavigate={onNavigate} />} />
        
        {/* Profile */}
        <Route path="/profile" element={user ? <Profile onNavigate={onNavigate} /> : <Home user={user} onLoginSuccess={handleLoginSuccess} />} />

        {/* Other Apps */}
        <Route path="/learning" element={<Learning {...commonProps} />} />
        <Route path="/health" element={<HealthApp {...commonProps} />} />
        <Route path="/news" element={<NewsApp {...commonProps} />} />
        <Route path="/store" element={<Store {...commonProps} />} />
        <Route path="/convo" element={<Convo onNavigate={onNavigate} />} />
        <Route path="/studio" element={<Studio onBack={() => navigate('/')} />} />
        <Route path="/policy" element={<Policy onNavigate={onNavigate} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}