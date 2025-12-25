import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // <--- Router Imports
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

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
  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Logged in:", decoded);
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
    navigate('/'); // Go back to home on logout
  };

  // Props for sub-pages to handle "Back" button
  // Note: We use navigate('/') instead of setView('landing')
  const commonProps = { onBack: () => navigate('/') };
  const onNavigate = (path) => {
  if (path === 'home' || path === 'landing') {
    navigate('/'); // Forces "home" to go to "/"
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
              onLoginSuccess={handleLoginSuccess} 
              onLogout={handleLogout} 
            />
          } 
        />

        {/* APP ROUTES */}
        {/* Pass navigate function if your components use it, or commonProps for back buttons */}
        <Route path="/home" element={<Home user={user} onNavigate={onNavigate} />} />
        <Route path="/chatbot" element={<Chatbot onNavigate={onNavigate} />} />
        <Route path="/vision" element={<Vision onNavigate={onNavigate} />} />
        <Route path="/plans" element={<Plans onNavigate={onNavigate} />} />
        <Route path="/policy" element={<Policy onNavigate={onNavigate} />} />

        {/* Pass commonProps (onBack) to these apps */}
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