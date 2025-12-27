import React, { useState, useEffect } from 'react';
import { Snowflake, Gift, Trees, ArrowRight, Bell, Home } from 'lucide-react';
import config from './config';

const Convo = ({ onNavigate }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Handle Body Class for Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- SNOW COMPONENT ---
  const Snow = () => (
    <div className="snow-container">
        {[...Array(50)].map((_, i) => (
            <div key={i} className="snowflake" style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 5}s`,
                animationDelay: `-${Math.random() * 5}s`,
                opacity: Math.random()
            }} />
        ))}
    </div>
  );

  return (
    <div className="convo-app">
      {/* Background Snow */}
      <Snow />

      <style>{`
        :root {
            /* Holiday Palette */
            --holiday-red: #d42426;
            --holiday-green: #165b33;
            --holiday-gold: #f8b229;
            --snow-white: #ffffff;
            
            /* Light Theme */
            --bg-light: #f4f6f9;
            --text-light: #1c1c1e;
            --card-light: rgba(255, 255, 255, 0.8);
            
            /* Dark Theme (Silent Night) */
            --bg-dark: #0b0f19;
            --text-dark: #f0f0f0;
            --card-dark: rgba(20, 25, 35, 0.6);

            /* Default mappings */
            --background-color: var(--bg-light);
            --text-color: var(--text-light);
            --card-bg: var(--card-light);
            --accent-color: var(--holiday-red);
        }

        body.dark-mode {
            --background-color: var(--bg-dark);
            --text-color: var(--text-dark);
            --card-bg: var(--card-dark);
        }

        /* Base Styles */
        .convo-app {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            background-color: var(--background-color);
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(212, 36, 38, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(22, 91, 51, 0.05) 0%, transparent 40%);
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            transition: background-color 0.4s ease, color 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        /* Snow Animation */
        .snow-container {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }
        .snowflake {
            position: absolute;
            top: -10px;
            width: 6px; 
            height: 6px;
            background: white;
            border-radius: 50%;
            filter: blur(1px);
            animation: fall linear infinite;
        }
        @keyframes fall {
            to { transform: translateY(110vh); }
        }

        /* Header */
        .main-header {
            padding: 24px 0;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            text-decoration: none;
            color: var(--text-color);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .logo-badge {
            font-size: 0.7rem;
            background: var(--holiday-red);
            color: white;
            padding: 2px 8px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Navigation Actions */
        .nav-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        /* Icon Button (Square-ish) */
        .icon-btn {
            background: var(--card-bg);
            border: 1px solid rgba(255,255,255,0.1);
            width: 44px; height: 44px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-color);
            backdrop-filter: blur(10px);
            transition: all 0.2s;
        }
        .icon-btn:hover {
            transform: scale(1.05);
            background: var(--accent-color);
            color: white;
            border-color: var(--accent-color);
        }

        /* Pill Button (Home) */
        .pill-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: var(--card-bg);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 50px; /* Pill Shape */
            color: var(--text-color);
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.2s;
            font-weight: 600;
            font-size: 0.9rem;
            text-decoration: none;
        }
        .pill-btn:hover {
            transform: scale(1.05);
            background: var(--text-color); /* Invert colors on hover */
            color: var(--background-color);
        }

        /* Hero */
        .hero {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px 20px;
            z-index: 10;
        }

        .gift-box-anim {
            margin-bottom: 30px;
            position: relative;
        }
        
        .hero h1 {
            font-size: 4rem;
            font-weight: 800;
            letter-spacing: -2px;
            margin-bottom: 20px;
            line-height: 1.1;
            background: linear-gradient(135deg, var(--text-color) 0%, var(--secondary-text-color) 100%);
            -webkit-background-clip: text;
        }
        
        .highlight-text {
            color: var(--holiday-red);
            position: relative;
            display: inline-block;
        }
        .highlight-text::after {
            content: '';
            position: absolute;
            bottom: 5px; left: 0; right: 0;
            height: 12px;
            background: rgba(212, 36, 38, 0.2);
            z-index: -1;
            transform: rotate(-2deg);
        }

        .hero p {
            font-size: 1.2rem;
            color: var(--text-color);
            opacity: 0.8;
            max-width: 500px;
            margin: 0 auto 40px;
            line-height: 1.6;
        }

        /* Call to Action */
        .cta-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.1rem;
            padding: 16px 40px;
            border-radius: 50px;
            transition: all 0.3s ease;
            background: var(--holiday-red);
            color: white;
            box-shadow: 0 10px 30px rgba(212, 36, 38, 0.3);
        }
        .cta-btn:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 40px rgba(212, 36, 38, 0.4);
            background: #b51b1d;
        }

        /* Wish Card */
        .wish-card {
            margin-top: 40px;
            background: var(--card-bg);
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 20px 30px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 400px;
        }
        .wish-icon { color: var(--holiday-green); }

        @media (max-width: 768px) {
            .hero h1 { font-size: 2.8rem; }
            .hero p { font-size: 1rem; }
            .pill-btn span { display: none; } /* Hide text on small screens */
            .pill-btn { padding: 12px; border-radius: 50%; } /* Circle on small screens */
        }
      `}</style>

      {/* Header */}
      <header className="main-header">
        <div className="container">
          <a href="#" className="logo">
            <Gift size={24} className="text-red-500" />
            <span>Convo+</span>
            <span className="logo-badge">XMAS</span>
          </a>
          
          <div className="nav-actions">
            {/* PILL SHAPE HOME BUTTON */}
            <button onClick={() => onNavigate && onNavigate('home')} className="pill-btn">
               <Home size={18} />
               <span>Home</span>
            </button>
            
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle theme">
               {isDarkMode ? <Snowflake size={20} /> : <Trees size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="hero">
        
        {/* Animated Icon */}
        <div className="gift-box-anim">
            <div style={{ 
                width: '80px', height: '80px', 
                background: 'linear-gradient(135deg, #d42426, #b51b1d)', 
                borderRadius: '20px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 20px 50px rgba(212, 36, 38, 0.4)',
                transform: 'rotate(-10deg)'
            }}>
                <Gift size={40} color="white" />
            </div>
        </div>

        <h1>Unwrapping <span className="highlight-text">Soon</span></h1>
        
        <p>
          We're crafting the future of messaging in our workshop. <br />
          Secure, private, and just in time for the new year.
        </p>

        <a href="#" className="cta-btn">
            Get on the Nice List <ArrowRight size={20} />
        </a>

        {/* Holiday Wish */}
        <div className="wish-card">
            <Bell size={24} className="wish-icon" />
            <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>Season's Greetings</strong>
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Wishing you a Merry Christmas and a joyful New Year from the Convo Team.</span>
            </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ padding: '24px', textAlign: 'center', opacity: 0.6, fontSize: '0.85rem', zIndex: 10 }}>
        <p>© 2025 CNEAPEE+. Made with ❤️ & ❄️.</p>
      </footer>
    </div>
  );
};

export default Convo;