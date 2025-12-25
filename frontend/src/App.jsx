import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; 
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios'; // 👈 IMPORT ADDED

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

// --- MAIN APP COMPONENT ---
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
      // 1. Google Token Decode karein
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Logged in Google User:", decoded);

      // 2. 🔥 BACKEND KO DATA BHEJEIN (Email Trigger Karne Ke Liye)
      // Note: Make sure Backend is running on port 5000
      try {
        const backendRes = await axios.post('https://cneapee-backend.onrender.com/api/auth/google', {
          name: decoded.name,
          email: decoded.email,
          googleId: decoded.sub, // Google 'sub' ko ID maanta hai
          picture: decoded.picture
        });

        console.log("✅ Backend Connected:", backendRes.data);

        // 3. User ko Alert dikhayein (Email Sent status)
        if (backendRes.data.firstLogin) {
          alert(`Welcome to CNEAPEE, ${decoded.name}! 🎉\nCheck your email for a welcome message.`);
        } else {
          alert(`Welcome back, ${decoded.name}! 👋\nCheck your email for updates.`);
        }

      } catch (backendError) {
        console.error("❌ Backend Connection Failed:", backendError);
        // Agar backend band hai tab bhi login continue karein
      }

      // 4. State aur LocalStorage Update karein
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
    navigate('/'); 
  };

  // Props for sub-pages
  const commonProps = { onBack: () => navigate('/') };
  
  const onNavigate = (path) => {
    if (path === 'home' || path === 'landing') {
      navigate('/'); 
    } else {
      navigate(path);
    }
  };

  // --- ROUTING ---
  return (
    <div className="dark bg-[#050507] text-white min-h-screen">
      <Routes>
        {/* LANDING PAGE ROUTE */}
        <Route 
          path="/" 
          element={
            <Home 
              user={user} 
              onLoginSuccess={handleLoginSuccess} // Updated Handler Pass Kiya
              onLogout={handleLogout} 
            />
          } 
        />

        {/* APP ROUTES */}
        <Route path="/home" element={<Home user={user} onNavigate={onNavigate} />} />
        <Route path="/chatbot" element={<Chatbot onNavigate={onNavigate} />} />
        <Route path="/vision" element={<Vision onNavigate={onNavigate} />} />
        <Route path="/plans" element={<Plans onNavigate={onNavigate} />} />
        <Route path="/policy" element={<Policy onNavigate={onNavigate} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Pass commonProps (onBack) */}
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