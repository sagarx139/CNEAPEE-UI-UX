import React, { useState, useEffect } from 'react';
import { Sun, Wind, Send, ArrowRight, Bell, Home, MessageCircle } from 'lucide-react';

const Convo = ({ onNavigate }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle Body Class for Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- KITE COMPONENT (Replaces Snow) ---
  const Kites = () => (
    <div className="kite-container">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="kite" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 15}s`,
                animationDelay: `-${Math.random() * 10}s`,
                transform: `scale(${0.5 + Math.random()})`,
                opacity: 0.6
            }}>
              <div className="kite-diamond" style={{ backgroundColor: i % 2 === 0 ? '#ff8c00' : '#ffd700' }}></div>
              <div className="kite-string"></div>
            </div>
        ))}
    </div>
  );

  // --- CHAT ANIMATION COMPONENT ---
  const ChatPreview = () => (
    <div className="chat-preview">
        <div className="chat-bubble left">Happy Makar Sankranti! 🪁</div>
        <div className="chat-bubble right">Kai Po Che! Let's fly kites today! ☀️</div>
        <div className="chat-bubble left">The new Convo app looks amazing.</div>
    </div>
  );

  return (
    <div className="convo-app">
      <Kites />

      <style>{`
        :root {
            /* Makar Sankranti Palette */
            --sankranti-orange: #ff8c00;
            --sankranti-yellow: #ffd700;
            --sky-blue: #87ceeb;
            --harvest-green: #2e7d32;
            
            /* Light Theme */
            --bg-light: #fffcf0;
            --text-light: #2c2c2e;
            --card-light: rgba(255, 255, 255, 0.9);
            
            /* Dark Theme */
            --bg-dark: #1a120b;
            --text-dark: #fefae0;
            --card-dark: rgba(45, 35, 20, 0.7);

            --background-color: var(--bg-light);
            --text-color: var(--text-light);
            --card-bg: var(--card-light);
            --accent-color: var(--sankranti-orange);
        }

        body.dark-mode {
            --background-color: var(--bg-dark);
            --text-color: var(--text-dark);
            --card-bg: var(--card-dark);
        }

        .convo-app {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            background-color: var(--background-color);
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(255, 140, 0, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(135, 206, 235, 0.1) 0%, transparent 40%);
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        /* Kite Animation */
        .kite-container {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
            z-index: 1;
        }
        .kite {
            position: absolute;
            animation: drift linear infinite;
        }
        .kite-diamond {
            width: 30px; height: 30px;
            transform: rotate(45deg);
            border: 2px solid rgba(0,0,0,0.1);
        }
        .kite-string {
            width: 1px; height: 50px;
            background: rgba(0,0,0,0.2);
            margin: 0 auto;
            transform: rotate(10deg);
        }
        @keyframes drift {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(100px, -50px) rotate(10deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }

        /* Header Styles */
        .main-header { padding: 24px 0; position: sticky; top: 0; z-index: 100; }
        .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; }
        
        .logo { font-size: 1.5rem; font-weight: 800; text-decoration: none; color: var(--text-color); display: flex; align-items: center; gap: 10px; }
        .logo-badge { font-size: 0.7rem; background: var(--sankranti-orange); color: white; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; }

        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .icon-btn, .pill-btn { 
            background: var(--card-bg); border: 1px solid rgba(0,0,0,0.05); 
            border-radius: 14px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; color: var(--text-color); backdrop-filter: blur(10px); transition: all 0.2s;
        }
        .icon-btn { width: 44px; height: 44px; }
        .pill-btn { padding: 10px 20px; border-radius: 50px; font-weight: 600; gap: 8px; }
        
        .icon-btn:hover, .pill-btn:hover { transform: scale(1.05); background: var(--accent-color); color: white; }

        /* Hero & Chat Animation */
        .hero { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 20px; z-index: 10; }
        
        .chat-preview {
            width: 100%; max-width: 320px;
            margin-bottom: 30px;
            display: flex; flex-direction: column; gap: 10px;
        }
        .chat-bubble {
            padding: 12px 18px; border-radius: 18px; font-size: 0.9rem;
            max-width: 80%; animation: fadeInUp 0.5s ease-out forwards;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .chat-bubble.left { align-self: flex-start; background: var(--card-bg); border-bottom-left-radius: 4px; }
        .chat-bubble.right { align-self: flex-end; background: var(--sankranti-orange); color: white; border-bottom-right-radius: 4px; }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 15px; }
        .highlight-text { color: var(--sankranti-orange); }

        .cta-btn {
            display: inline-flex; align-items: center; gap: 10px; text-decoration: none;
            font-weight: 700; padding: 16px 40px; border-radius: 50px;
            background: var(--sankranti-orange); color: white;
            box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3); transition: all 0.3s;
        }
        .cta-btn:hover { transform: translateY(-4px); box-shadow: 0 15px 40px rgba(255, 140, 0, 0.4); }

        .wish-card {
            margin-top: 40px; background: var(--card-bg); padding: 20px;
            border-radius: 20px; display: flex; align-items: center; gap: 15px;
            max-width: 450px; border: 1px solid rgba(0,0,0,0.05);
        }
        
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .pill-btn span { display: none; }
        }
      `}</style>

      {/* Header */}
      <header className="main-header">
        <div className="container">
          <a href="#" className="logo">
            <Sun size={24} className="text-orange-500" />
            <span>Convo+</span>
            <span className="logo-badge">UTTARAYAN</span>
          </a>
          
          <div className="nav-actions">
            <button onClick={() => onNavigate && onNavigate('home')} className="pill-btn">
               <Home size={18} />
               <span>Home</span>
            </button>
            <button onClick={toggleTheme} className="icon-btn">
               {isDarkMode ? <Sun size={20} /> : <Wind size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="hero">
        
        {/* Chat Animation Preview */}
        <ChatPreview />

        <h1>Soaring to <span className="highlight-text">New Heights</span></h1>
        
        <p style={{ maxWidth: '600px', opacity: 0.8, marginBottom: '30px' }}>
          As the sun enters Capricorn, we're launching the next generation of 
          private conversations. Higher security, brighter connections.
        </p>

        <a href="#" className="cta-btn">
            Join the Launch <Send size={20} />
        </a>

        {/* Festival Wish */}
        <div className="wish-card">
            <div style={{ background: '#fff3e0', padding: '10px', borderRadius: '12px' }}>
                <Sun size={24} color="#ff8c00" />
            </div>
            <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>Happy Makar Sankranti!</strong>
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>May your life be as colorful and high-flying as the kites in the sky.</span>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '24px', textAlign: 'center', opacity: 0.6, fontSize: '0.85rem' }}>
        <p>© 2026 CONVO+. Happy Makar Sankranti & Pongal! 🪁☀️</p>
      </footer>
    </div>
  );
};

export default Convo;