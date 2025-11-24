import { useEffect, useRef, useState } from "react";

export default function CneapeeHome() {
  const [showBanner, setShowBanner] = useState(false);
  const [typedText, setTypedText] = useState("");
  const iRef = useRef(0);
  const timeoutRef = useRef(null);

  const bannerText = `CNEAPEE AI: Model Neuro 1.1 is a next-gen multimodal assistant built to transform user interaction through intelligent automation, contextual awareness, and real-time responsiveness. Designed for productivity, learning, and wellness, it adapts seamlessly to your needs.

Key Features:
• Context-Aware Intelligence – Understands voice & text with precision
• Modular Tools – Study Hub, Health Insights, Events, News
• Neural Response Engine – Fast, human-like replies

Beta Launch: February 2026
Rolling out on our 2nd anniversary for Beta Users.`;

  useEffect(() => {
    if (showBanner) {
      setTypedText("");
      iRef.current = 0;
      const typeLetter = () => {
        if (iRef.current <= bannerText.length) {
          setTypedText(bannerText.slice(0, iRef.current));
          iRef.current++;
          timeoutRef.current = setTimeout(typeLetter, 12);
        }
      };
      typeLetter();
    } else {
      clearTimeout(timeoutRef.current);
    }
  }, [showBanner]);

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-white text-white min-h-screen overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 animate-gradient" />

      {/* Navigation */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-40 flex items-center gap-4">
        <img
          src="assets/cneapeelogo-removebg-preview.png"
          alt="CNEAPEE Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full"
        />
        <div className="flex gap-2 px-2 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
          <button className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-white font-bold hover:bg-white/20 transition duration-300">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12L12 5l8 7M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </button>
          <button className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-white font-bold hover:bg-white/20 transition duration-300">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sign In */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-40">
        <a href="profile.html">
          <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold shadow-lg hover:bg-white/20 transition duration-300">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Sign In</span>
          </button>
        </a>
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center min-h-screen px-4 sm:px-8 pt-32 sm:pt-40">
        <header className="mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight">CNEAPEE AI</h1>
          <p className="mt-4 text-sm sm:text-lg text-gray-300 max-w-xl mx-auto">Single Hub For Smarter and Efficient Use</p>
          <p className="mt-2 text-xs sm:text-base text-gray-300 max-w-xl mx-auto">"Coming to Beta Users • February 2026 • 2nd Anniversary Drop"</p>
        </header>

        {/* Search Input */}
        <section className="w-full max-w-xl mb-8">
          <div className="relative bg-gray-800 rounded-xl border border-gray-700 flex items-center focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50">
            <input type="text" placeholder="Ask anything..." className="w-full bg-transparent text-white px-4 sm:px-6 py-3 rounded-xl focus:outline-none text-base sm:text-lg" />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors" aria-label="Search">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 rounded-lg hover:opacity-90 transition-opacity" aria-label="Voice Input">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <span onClick={() => setShowBanner(true)} className="hidden sm:inline bg-gray-900 text-green-300 text-xs font-semibold px-3 py-1 rounded-full border border-green-400 shadow cursor-pointer">
                Neuro 1.1
              </span>
            </div>
          </div>
        </section>

        {/* Pills */}
        <section className="flex flex-wrap gap-3 justify-center mb-10 px-2">
          {[
            { label: "Deals", href: "deals.html", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Study Hub", href: "studyhub.html", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
            { label: "Health", href: "health.html", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
            { label: "News", href: "news.html", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
          ].map(({ label, href, icon }) => (
            <a key={label} href={href}>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                </svg>
                <span>{label}</span>
              </button>
            </a>
          ))}
        </section>
      </main>

      {/* Neuro Banner */}
      {showBanner && (
        <div className="fixed left-1/2 bottom-8 z-50 w-[370px] max-w-xs -translate-x-1/2 bg-white/10 backdrop-blur-lg border border-green-400 rounded-2xl shadow-2xl p-6 text-left text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-300 font-bold text-lg">CNEAPEE AI Model Neuro 1.1</span>
            <button onClick={() => setShowBanner(false)} className="text-gray-400 hover:text-white text-xl font-bold leading-none">&times;</button>
          </div>
          <div className="text-xs text-green-200 mb-2">Launch Date: <span className="font-semibold">February 2026</span> | <span className="font-semibold">Beta Access</span></div>
          <div className="text-sm whitespace-pre-line font-mono min-h-[220px]">{typedText}</div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm text-gray-400">
        © 2025 CNEAPEE. All rights reserved.
      </footer>
    </div>
  );
}
