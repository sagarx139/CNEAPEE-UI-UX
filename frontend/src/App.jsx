import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; 
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import config from './config'; 

// --- IMPORT YOUR PAGES ---
import Home from './Home';
import Chatbot from './Chatbot';
import Vision from './Vision';
import Plans from './Plans';
import Learning from './Learning';
import HealthApp from './HealthApp';
import NewsApp from './NewsApp';
import Store from './Store';
import Convo from './Convo';
import Studio from './Studio';
import Policy from './Policy';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // --- PERSIST LOGIN ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // --- HANDLERS ---
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      // 1. Google Token Decode
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Logged in Google User:", decoded);

      // 2. 🔥 BACKEND CONNECTION
      try {
        console.log("Connecting to Backend at:", `${config.API_URL}/api/auth/google`);
        
        const backendRes = await axios.post(`${config.API_URL}/api/auth/google`, {
          name: decoded.name,
          email: decoded.email,
          googleId: decoded.sub, 
          picture: decoded.picture
        });

        console.log("✅ Backend Connected:", backendRes.data);

        // ⭐⭐⭐ MAIN FIX HERE: TOKEN SAVE KARNA ZAROORI HAI ⭐⭐⭐
        if (backendRes.data.token) {
            localStorage.setItem('token', backendRes.data.token);
            console.log("🔑 Token Saved to LocalStorage!");
        }
        // ⭐⭐⭐ FIX END ⭐⭐⭐

        if (backendRes.data.firstLogin) {
          alert(`Welcome to CNEAPEE, ${decoded.name}! 🎉`);
        } else {
          alert(`Welcome back, ${decoded.name}! 👋`);
        }

      } catch (backendError) {
        console.error("❌ Backend Connection Failed:", backendError);
        // Backend fail hone par bhi login state maintain karte hain
      }

      // 3. State aur LocalStorage Update
      setUser(decoded);
      localStorage.setItem('user_data', JSON.stringify(decoded));

    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user_data');
    localStorage.removeItem('token'); // Logout pe token bhi hatao
    navigate('/'); 
  };

  const commonProps = { onBack: () => navigate('/') };
  
  const onNavigate = (path) => {
    if (path === 'home' || path === 'landing') {
      navigate('/'); 
    } else {
      navigate(path);
    }
  };

  return (
    <div className="dark bg-[#050507] text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Home user={user} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />} />
        <Route path="/home" element={<Home user={user} onNavigate={onNavigate} />} />
        <Route path="/chatbot" element={<Chatbot onNavigate={onNavigate} />} />
        <Route path="/vision" element={<Vision onNavigate={onNavigate} />} />
        <Route path="/plans" element={<Plans onNavigate={onNavigate} />} />
        <Route path="/policy" element={<Policy onNavigate={onNavigate} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/learning" element={<Learning {...commonProps} />} />
        <Route path="/health" element={<HealthApp {...commonProps} />} />
        <Route path="/news" element={<NewsApp {...commonProps} />} />
        <Route path="/store" element={<Store {...commonProps} />} />
        <Route path="/convo" element={<Convo onNavigate={onNavigate} />} />
        <Route path="/studio" element={<Studio onBack={() => navigate('/')} />} />
      </Routes>
    </div>
  );
}