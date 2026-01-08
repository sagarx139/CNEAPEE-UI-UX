import React, { useRef, useMemo } from 'react';
import { 
  Brain, BookOpen, HeartPulse, Newspaper, Palette, Terminal, 
  MessageCircle, ShoppingBag, Home, Zap, Layers, Globe, 
  Cpu, Sun, Wheat, Wind, CloudSun, Bot, 
  Workflow, CheckCircle, TrendingUp, Utensils, ShieldPlus, Filter, 
  Headphones, Code, Lock, Tag, Wallet, Wand2, Guitar, Sliders, 
  Image, Brush, Maximize, Server, Users, Shield, ArrowUpRight
} from 'lucide-react';

// Floating Kites Animation
const KiteParticles = () => {
  const kites = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      left: Math.random() * 100,
      size: Math.random() * 15 + 8,
      duration: Math.random() * 25 + 20,
      delay: -Math.random() * 15,
      color: ['#ff6b35', '#f7931e', '#fdc830', '#37b679'][Math.floor(Math.random() * 4)],
      key: i
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {kites.map((k) => (
        <div 
          key={k.key}
          className="absolute opacity-30"
          style={{
            left: `${k.left}%`,
            top: '-5%',
            width: `${k.size}px`,
            height: `${k.size}px`,
            backgroundColor: k.color,
            transform: 'rotate(45deg)',
            animation: `floatKite ${k.duration}s linear infinite`,
            animationDelay: `${k.delay}s`,
            boxShadow: `0 0 15px ${k.color}70`
          }}
        >
          <div className="absolute top-full left-1/2 w-0.5 h-8 bg-white/30 -translate-x-1/2"></div>
        </div>
      ))}
      <style>{`
        @keyframes floatKite {
          0% { transform: translateY(0) translateX(0) rotate(45deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.3; }
          100% { transform: translateY(110vh) translateX(50px) rotate(60deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Ambient Glow
const AmbientGlow = () => (
  <div className="fixed inset-0 opacity-40 pointer-events-none overflow-hidden">
    <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-gradient-radial from-orange-500/20 to-transparent blur-3xl rounded-full animate-pulse-slow" />
    <div className="absolute -bottom-1/2 -right-1/4 w-[900px] h-[900px] bg-gradient-radial from-yellow-500/15 to-transparent blur-3xl rounded-full animate-pulse-slower" />
    <style>{`
      .animate-pulse-slow { animation: gentlePulse 10s ease-in-out infinite; }
      .animate-pulse-slower { animation: gentlePulse 15s ease-in-out infinite; }
      @keyframes gentlePulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(1.1); }
      }
    `}</style>
  </div>
);

// Feature Card Component
const FeatureCard = ({ feature, index }) => {
  const isLarge = index === 0 || index === 3;
  
  return (
    <div 
      className={`group relative p-6 rounded-3xl border border-white/10 transition-all duration-500 flex flex-col
        bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl
        hover:border-orange-400/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20
        ${isLarge ? 'md:col-span-2' : ''}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 group-hover:scale-110 transition-transform">
            {feature.icon}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider border px-2 py-1 rounded-full text-orange-400/70 border-orange-500/30 bg-orange-500/5">
            {feature.tag}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-orange-100 transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
          {feature.desc}
        </p>
      </div>
    </div>
  );
};

// Detail Section Component
const DetailSection = ({ title, subtitle, desc, features, align, color }) => {
  const colorMap = {
    amber: 'from-amber-500/20 to-orange-500/20',
    green: 'from-emerald-500/20 to-green-500/20',
    blue: 'from-sky-500/20 to-blue-500/20',
    pink: 'from-pink-500/20 to-rose-500/20',
    purple: 'from-purple-500/20 to-violet-500/20',
    red: 'from-red-500/20 to-orange-500/20',
    cyan: 'from-cyan-500/20 to-teal-500/20',
    indigo: 'from-indigo-500/20 to-purple-500/20'
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center py-16">
      <div className={align === 'right' ? 'md:order-2' : 'md:order-1'}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Sun size={12} /> {subtitle}
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          {title}
        </h2>
        
        <p className="text-base text-zinc-400 mb-6 leading-relaxed">
          {desc}
        </p>

        <div className="space-y-4">
          {features.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 group/item">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 group-hover/item:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <strong className="block text-white text-sm">{item.title}</strong>
                <span className="text-xs text-zinc-500">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={align === 'right' ? 'md:order-1' : 'md:order-2'}>
        <div className="relative h-[350px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-sm group/visual hover:border-orange-500/30 transition-all duration-500">
          <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color] || colorMap.amber} opacity-50`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-orange-500/20 rotate-45 rounded-xl group-hover/visual:rotate-90 transition-transform duration-1000"></div>
            <div className="absolute w-24 h-24 bg-orange-500/10 rotate-45 rounded-lg backdrop-blur-sm"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

const Vision = () => {
  const containerRef = useRef(null);

  const gridFeatures = [
    { id: 1, title: "Conversational AI", icon: <Brain className="text-orange-400" size={24} />, desc: "Intelligent contextual responses powered by advanced NLP.", tag: "Core" },
    { id: 2, title: "Learning+", icon: <BookOpen className="text-yellow-400" size={24} />, desc: "Adaptive learning paths tailored to your pace.", tag: "Education" },
    { id: 3, title: "Health+", icon: <HeartPulse className="text-green-400" size={24} />, desc: "AI-driven wellness insights and tracking.", tag: "Wellness" },
    { id: 4, title: "News+", icon: <Newspaper className="text-sky-400" size={24} />, desc: "Smart news aggregation with bias detection.", tag: "Info" },
    { id: 5, title: "AI Imagine", icon: <Palette className="text-purple-400" size={24} />, desc: "Generate stunning visuals from text.", tag: "Creative" },
    { id: 6, title: "Coding+", icon: <Terminal className="text-cyan-400" size={24} />, desc: "Code assistant for rapid development.", tag: "Dev" },
    { id: 7, title: "Convo+", icon: <MessageCircle className="text-pink-400" size={24} />, desc: "Secure real-time messaging platform.", tag: "Chat" },
    { id: 8, title: "Store+", icon: <ShoppingBag className="text-amber-400" size={24} />, desc: "Premium gadgets and AI hardware.", tag: "Shop" }
  ];

  const sections = [
    {
      title: "Learning+", subtitle: "AI Education", 
      desc: "Master any subject with personalized AI tutoring that adapts to your learning style.",
      color: "amber", align: "left",
      features: [
        { title: "Smart Tutor", desc: "Real-time doubt solving", icon: <Bot size={16} /> },
        { title: "Visual Paths", desc: "Interactive roadmaps", icon: <Workflow size={16} /> },
        { title: "Instant Feedback", desc: "Learn from mistakes", icon: <CheckCircle size={16} /> }
      ]
    },
    {
      title: "Health+", subtitle: "Wellness AI",
      desc: "Track your health metrics and receive preventive insights powered by machine learning.",
      color: "green", align: "right",
      features: [
        { title: "Trend Analysis", desc: "Long-term health patterns", icon: <TrendingUp size={16} /> },
        { title: "Nutrition AI", desc: "Meal tracking via photos", icon: <Utensils size={16} /> },
        { title: "Early Warnings", desc: "Preventive care alerts", icon: <ShieldPlus size={16} /> }
      ]
    },
    {
      title: "News+", subtitle: "Smart Briefings",
      desc: "Cut through information overload with AI-curated news from verified sources.",
      color: "blue", align: "left",
      features: [
        { title: "Bias Filter", desc: "Multi-perspective analysis", icon: <Filter size={16} /> },
        { title: "Global View", desc: "International coverage", icon: <Globe size={16} /> },
        { title: "Audio Digest", desc: "Daily briefings", icon: <Headphones size={16} /> }
      ]
    },
    {
      title: "Convo+", subtitle: "Secure Chat",
      desc: "Next-gen messaging with context memory and end-to-end encryption.",
      color: "pink", align: "right",
      features: [
        { title: "Context Memory", desc: "Remembers conversations", icon: <Cpu size={16} /> },
        { title: "Code Debug", desc: "Inline code analysis", icon: <Code size={16} /> },
        { title: "E2E Encrypted", desc: "Military-grade security", icon: <Lock size={16} /> }
      ]
    },
    {
      title: "Store+", subtitle: "Tech Marketplace",
      desc: "Curated selection of AI-ready devices and exclusive tech drops.",
      color: "red", align: "left",
      features: [
        { title: "AI Hardware", desc: "Pre-configured devices", icon: <Cpu size={16} /> },
        { title: "Limited Drops", desc: "Exclusive releases", icon: <Tag size={16} /> },
        { title: "One-Click Buy", desc: "Integrated checkout", icon: <Wallet size={16} /> }
      ]
    },
    {
      title: "Audio Studio", subtitle: "Sound Suite",
      desc: "Professional audio tools for podcasters, musicians, and content creators.",
      color: "purple", align: "right",
      features: [
        { title: "Noise Remove", desc: "Studio-quality isolation", icon: <Wand2 size={16} /> },
        { title: "AI Music", desc: "Royalty-free tracks", icon: <Guitar size={16} /> },
        { title: "Auto Master", desc: "Professional mixing", icon: <Sliders size={16} /> }
      ]
    },
    {
      title: "AI Imagine", subtitle: "Visual Engine",
      desc: "Transform ideas into photorealistic images with state-of-the-art diffusion models.",
      color: "indigo", align: "left",
      features: [
        { title: "Text-to-Image", desc: "Instant visualization", icon: <Image size={16} /> },
        { title: "Style Transfer", desc: "Artistic filters", icon: <Brush size={16} /> },
        { title: "Outpainting", desc: "Extend boundaries", icon: <Maximize size={16} /> }
      ]
    },
    {
      title: "Enterprise", subtitle: "Business Solutions",
      desc: "Deploy CNEAPEE's intelligence infrastructure across your organization.",
      color: "cyan", align: "right",
      features: [
        { title: "Private API", desc: "Custom integrations", icon: <Server size={16} /> },
        { title: "Team Hub", desc: "Centralized management", icon: <Users size={16} /> },
        { title: "Enterprise Security", desc: "SOC2 compliant", icon: <Shield size={16} /> }
      ]
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-zinc-100 relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        html { scroll-behavior: smooth; }
      `}</style>

      <AmbientGlow />
      <KiteParticles />

      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-2 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl">
        <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 transition-all text-sm font-medium">
          <Home size={16} className="text-orange-400" />
          <span>Home</span>
        </a>
        <div className="w-px h-5 bg-white/10"></div>
        <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold">
          <Sun size={14} className="text-yellow-500" />
          <span>Vision</span>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-4 max-w-7xl mx-auto relative z-10">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold uppercase mb-6">
            <Wheat size={12} /> Happy Makar Sankranti & Pongal
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Harvest the Future.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400">
              One Unified Platform.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            CNEAPEE AI v1.2 brings intelligence, creativity, and productivity into a single ecosystem. 
            Celebrate innovation this festival season.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-32">
          <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-2">
            Core Capabilities <Wind size={18} className="text-sky-400" />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gridFeatures.map((feature, idx) => (
              <FeatureCard key={feature.id} feature={feature} index={idx} />
            ))}
          </div>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 text-orange-200 text-sm font-bold tracking-wider backdrop-blur-xl">
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            POWERED BY CNEAPEE AI v1.2
          </div>
        </div>

        {/* Detail Sections */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <React.Fragment key={idx}>
              <DetailSection {...section} />
              {idx < sections.length - 1 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Why Choose */}
        <div className="text-center mt-24">
          <h2 className="text-3xl font-bold mb-12 text-white flex items-center justify-center gap-3">
            <Wheat size={28} className="text-green-400" />
            Why CNEAPEE
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Layers, color: 'purple', title: 'Unified Ecosystem', desc: 'Everything in one place' },
              { icon: Globe, color: 'blue', title: 'Real-Time Intelligence', desc: 'Live updates, instant insights' },
              { icon: Cpu, color: 'green', title: 'Clean Architecture', desc: 'Built for scale and speed' }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900/50 to-black/50 border border-white/10 hover:border-orange-500/30 transition-all">
                <div className={`w-14 h-14 mx-auto bg-${item.color}-500/10 rounded-xl flex items-center justify-center text-${item.color}-400 mb-4 border border-${item.color}-500/20`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-2xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">CNEAPEE</p>
          <p className="text-sm text-zinc-600 mb-6">
            Celebrating innovation with the spirit of harvest and sunshine.
          </p>
          <div className="text-xs text-zinc-700 flex items-center justify-center gap-2 font-semibold">
            © 2025 CNEAPEE Platform <CloudSun size={12} /> Happy Makar Sankranti
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Vision;