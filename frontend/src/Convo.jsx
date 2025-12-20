import React, { useState, useEffect } from 'react';

const Convo = () => {
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

  return (
    <div className="convo-app">
      {/* Embedded CSS to maintain your exact styling */}
      <style>{`
        :root {
            --background-color-light: #ffffff;
            --text-color-light: #1c1c1e;
            --secondary-text-color-light: #6a6a6e;
            --border-color-light: #e5e5e5;
            --accent-color-light: #000000;
            --card-background-light: #f7f7f7;

            --background-color-dark: #121212;
            --text-color-dark: #f5f5f7;
            --secondary-text-color-dark: #a0a0a5;
            --border-color-dark: #3a3a3c;
            --accent-color-dark: #ffffff;
            --card-background-dark: #1c1c1e;
            
            --background-color: var(--background-color-light);
            --text-color: var(--text-color-light);
            --secondary-text-color: var(--secondary-text-color-light);
            --border-color: var(--border-color-light);
            --accent-color: var(--accent-color-light);
            --card-background: var(--card-background-light);
        }

        body.dark-mode {
            --background-color: var(--background-color-dark);
            --text-color: var(--text-color-dark);
            --secondary-text-color: var(--secondary-text-color-dark);
            --border-color: var(--border-color-dark);
            --accent-color: var(--accent-color-dark);
            --card-background: var(--card-background-dark);
        }

        /* Base Styles */
        .convo-app {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            transition: background-color 0.4s ease, color 0.4s ease;
        }

        /* Header */
        .main-header {
            padding: 20px 0;
            position: sticky;
            top: 0;
            background-color: transparent;
            z-index: 100;
        }

        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            text-decoration: none;
            color: var(--text-color);
        }

        /* Hero / Coming Soon */
        .hero {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: radial-gradient(ellipse at top, var(--card-background), transparent 70%);
            padding: 0 20px;
        }

        .hero h1 {
            font-size: 3.5rem;
            font-weight: 800;
            letter-spacing: -2px;
            margin-bottom: 20px;
            color: var(--text-color);
        }

        .hero p {
            font-size: 1.3rem;
            color: var(--secondary-text-color);
            max-width: 600px;
            margin: 0 auto 40px;
            line-height: 1.6;
        }

        /* Buttons */
        .dark-mode-toggle {
            background: none;
            border: 1px solid var(--border-color);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            color: var(--text-color);
        }
        .dark-mode-toggle:hover {
            background-color: var(--card-background);
        }

        .btn {
            display: inline-block;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            padding: 16px 32px;
            border-radius: 12px;
            transition: all 0.3s ease;
            background-color: var(--accent-color);
            color: var(--background-color);
        }
        .btn:hover {
            transform: translateY(-4px);
            opacity: 0.9;
            box-shadow: 0 12px 25px rgba(0,0,0,0.1);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .hero p { font-size: 1.1rem; }
        }
      `}</style>

      {/* Header */}
      <header className="main-header">
        <div className="container">
          <nav className="navbar">
            <a href="#" className="logo">Convo+</a>
            
            <div className="nav-items">
              <button 
                onClick={toggleTheme} 
                className="dark-mode-toggle" 
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  /* Sun Icon */
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  /* Moon Icon */
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="hero">
        <div className="hero-content">
          <h1>Convo+ is Coming Soon</h1>
          <p>
            Secure. Private. Simple.<br />
            We are building the future of messaging. Stay tuned.
          </p>
          <a href="#" className="btn">Get Notified</a>
        </div>
      </main>

      {/* Simple Footer */}
      <footer style={{ padding: '20px', textAlign: 'center', color: 'var(--secondary-text-color)', fontSize: '0.9rem' }}>
        <p>© 2025 CNEAPEE+. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Convo;