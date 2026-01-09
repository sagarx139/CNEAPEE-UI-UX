import React, { useState } from "react";
import {
  Home,
  X,
  Sparkles,       // AI Features
  TextCursorInput, // Text-to-Speech
  Speech,         // Text-to-Speech
  Layers,         // Advanced Multi-Track
  Upload,         // Import/Export
  Download,       // Import/Export
  Package,        // Feature package/bundle
  Award,          // Recognition/Premium feel
} from "lucide-react";

// --- Upcoming Features Data ---
const upcomingFeaturesData = [
  {
    id: 'ai-enhancement',
    name: "AI Audio Enhancement Suite",
    icon: Sparkles,
    description: "Leverage cutting-edge AI to intelligently clean up your audio. Features include noise reduction, de-essing, hum removal, and automatic mastering to give your tracks a professional polish with a single click.",
    release: "Targeting March Release"
  },
  {
    id: 'tts',
    name: "AI Text-to-Speech (TTS)",
    icon: Speech, // Using Speech icon, could also use TextCursorInput
    description: "Generate realistic human-like voiceovers directly within the studio. Choose from a variety of voices, accents, and languages to quickly add narration or character voices to your projects.",
    release: "Targeting Spring Release"
  },
  {
    id: 'multi-track-v2',
    name: "Advanced Multi-Track Editing",
    icon: Layers,
    description: "Enhanced multi-track capabilities allowing for more complex arrangements. Includes features like track freezing, sidechaining simulation, and improved automation curves for dynamic mixing.",
    release: "Ongoing Development - Spring/Summer"
  },
  {
    id: 'import-export',
    name: "Advanced Import & Export Options",
    icon: Download, // Using Download icon, representing output flexibility
    description: "Support for a wider range of audio formats and codecs for both importing project assets and exporting finished masters. Includes options for stems, different sample rates, and bit depths.",
    release: "March Release"
  },
  {
    id: 'collaboration',
    name: "Real-time Collaboration",
    icon: Package, // Representing teamwork/shared projects
    description: "Work seamlessly with others on the same project in real-time. Share your mixes, get feedback instantly, and build your sound together.",
    release: "Targeting Spring Release"
  },
  {
    id: 'pro-plugins',
    name: "Integrated Professional Plugins",
    icon: Award, // Representing premium quality tools
    description: "Access a curated selection of professional-grade audio plugins directly within the studio environment, enhancing your creative possibilities.",
    release: "Summer Release"
  }
];

const Studio = ({ onBack }) => {
  const [showUpcomingFeatures, setShowUpcomingFeatures] = useState(true); // Start with features visible

  // Subtle background animation elements
  const [backgroundElements] = useState(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 15,
      speed: Math.random() * 8 + 4,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 relative overflow-hidden font-sans text-white flex flex-col items-center justify-center p-8">

      {/* --- Animated Background Elements --- */}
      <div className="absolute inset-0 z-0 opacity-30">
        {backgroundElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full bg-gradient-to-br from-purple-600 to-blue-500 animate-float"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.size}px`,
              height: `${el.size}px`,
              animationDuration: `${el.speed}s`,
              animationDelay: `-${el.delay}s`, // Start animation at different points
            }}
          />
        ))}
      </div>

      {/* --- Header --- */}
      <header className="relative z-20 p-6 flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
            aria-label="Go Back"
          >
            <Home size={24} />
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Package size={30} className="text-blue-400" />
            CNEAPEE
            <span className="text-lg font-medium text-gray-300 ml-2">Future Features</span>
          </h1>
        </div>
        {/* No buttons needed here anymore, focus is on the features */}
      </header>

      {/* --- Feature Showcase --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-5xl font-extrabold text-center mb-4 leading-tight">
          Revolutionizing Audio Creation.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400">
            See What's Next.
          </span>
        </h2>
        <p className="text-xl text-gray-300 text-center max-w-3xl mb-16">
          We're constantly innovating to bring you the most powerful and intuitive audio tools. Discover the groundbreaking features coming soon to CNEAPEE.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
          {upcomingFeaturesData.map((feature) => (
            <div
              key={feature.id}
              className="bg-white/5 backdrop-blur-lg border border-gray-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out transform cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-lg">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br from-purple-400 to-blue-400 transition-colors duration-300">
                    {feature.name}
                  </h3>
                </div>
              </div>
              <p className="text-gray-300 text-base leading-relaxed">
                {feature.description}
              </p>
              <p className="mt-6 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-blue-500">
                {feature.release}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="relative z-20 p-6 text-center text-gray-500 text-sm border-t border-gray-700 w-full">
        © {new Date().getFullYear()} CNEAPEE. All rights reserved. Innovation is our sound.
      </footer>
    </div>
  );
};

export default Studio;

// --- Global CSS (Add this to your global CSS file, e.g., index.css or App.css) ---
/*
@keyframes float {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
}

.animate-float {
  animation: float 15s ease-in-out infinite alternate forwards;
}
*/