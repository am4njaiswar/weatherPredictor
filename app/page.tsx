'use client'
import Link from 'next/link';
import { Cloud, Zap, Wind, Thermometer, Droplets, Navigation, BarChart3, Shield, Cpu, Satellite, Globe, AlertTriangle } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

// --- Types ---
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

interface StatItemProps {
  value: string;
  label: string;
  icon: ReactNode;
  color: string;
}

// --- Components ---
const FeatureCard = ({ icon, title, description, gradient, delay }: FeatureCardProps) => (
  <div 
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
    style={{
      animationDelay: `${delay}ms`,
      animationFillMode: 'both'
    }}
  >
    <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
    <div className="relative z-10">
      <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${gradient} mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-300 leading-relaxed">{description}</p>
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-400">AI Confidence</span>
          <span className="font-bold text-emerald-400">98%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="bg-linear-to-r from-emerald-500 to-cyan-500 rounded-full h-full w-[98%] transition-all duration-700" />
        </div>
      </div>
    </div>
  </div>
);

const StatItem = ({ value, label, icon, color }: StatItemProps) => (
  <div className="flex flex-col items-center p-6 rounded-2xl bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
    <div className={`p-3 rounded-full ${color} bg-opacity-10 mb-4`}>
      {icon}
    </div>
    <div className="text-3xl font-bold bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent mb-2">
      {value}
    </div>
    <div className="text-slate-300 text-sm font-medium text-center">{label}</div>
  </div>
);

// --- Main Page ---
export default function LandingPage() {
  // FIX: Store random particles in state to avoid Hydration Mismatch
  const [particles, setParticles] = useState<{ top: string; left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // This code only runs on the client, ensuring the random numbers are generated safely
    const newParticles = Array.from({ length: 30 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setParticles(newParticles);
  }, []);

  const features = [
    {
      icon: <Thermometer className="w-7 h-7" />,
      title: "Thermal Physics Engine",
      description: "Advanced heat mapping and temperature gradient analysis with real-time atmospheric modeling.",
      gradient: "from-orange-500/20 to-rose-500/20",
      delay: 100
    },
    {
      icon: <Wind className="w-7 h-7" />,
      title: "Aerodynamic Simulation",
      description: "3D wind pattern modeling and storm trajectory prediction using computational fluid dynamics.",
      gradient: "from-cyan-500/20 to-blue-500/20",
      delay: 200
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Pattern Recognition AI",
      description: "Deep learning algorithms analyze decades of historical data for unprecedented accuracy.",
      gradient: "from-purple-500/20 to-violet-500/20",
      delay: 300
    },
    {
      icon: <Satellite className="w-7 h-7" />,
      title: "Real-time Satellite Sync",
      description: "Direct integration with global satellite networks for live atmospheric data streaming.",
      gradient: "from-emerald-500/20 to-teal-500/20",
      delay: 400
    },
    {
      icon: <Cpu className="w-7 h-7" />,
      title: "Multi-Model Ensemble",
      description: "Combines Random Forest, Neural Networks, and Gradient Boosting for optimal predictions.",
      gradient: "from-blue-500/20 to-indigo-500/20",
      delay: 500
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Hazard Detection",
      description: "Early warning system for extreme weather events with automated emergency protocols.",
      gradient: "from-amber-500/20 to-orange-500/20",
      delay: 600
    }
  ];

  const stats = [
    {
      value: "98.2%",
      label: "Prediction Accuracy",
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      color: "text-cyan-400"
    },
    {
      value: "24/7",
      label: "Real-time Monitoring",
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      color: "text-blue-400"
    },
    {
      value: "<50ms",
      label: "Response Time",
      icon: <Navigation className="w-5 h-5 text-emerald-400" />,
      color: "text-emerald-400"
    },
    {
      value: "99.9%",
      label: "System Uptime",
      icon: <Shield className="w-5 h-5 text-purple-400" />,
      color: "text-purple-400"
    }
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-linear-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-linear-to-r from-purple-500/10 to-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-linear-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[64px_64px]" />
        
        {/* Floating particles (UPDATED FIX) */}
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-cyan-300/30 rounded-full animate-twinkle"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration
              }}
            />
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav className="relative w-full p-6 lg:p-8 flex justify-between items-center max-w-7xl mx-auto z-20">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
            <div className="relative flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">
              <Cloud className="w-7 h-7 text-cyan-400 animate-pulse" />
              <div>
                <div className="text-2xl font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  WeatherOracle
                </div>
                <div className="text-xs text-cyan-300/70 font-semibold tracking-widest">AI FORECASTING SYSTEM</div>
              </div>
            </div>
          </div>
        </div>
        
        <Link href="/predict">
          <button className="group relative overflow-hidden bg-linear-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 px-6 py-3 rounded-xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex items-center gap-2 text-sm font-semibold">
              <Zap className="w-4 h-4 group-hover:animate-pulse" />
              Launch Dashboard
            </span>
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative flex flex-col justify-center items-center text-center px-4 py-12 lg:py-20 z-10">
        {/* Animated badge */}
        <div className="relative inline-flex items-center gap-3 mb-10 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300" />
          </div>
          <span className="text-sm font-semibold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            MULTI-MODEL AI ARCHITECTURE
          </span>
          <span className="text-cyan-300">✦</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 max-w-6xl mx-auto leading-tight">
          <span className="relative">
            <span className="relative z-10">Predict Weather</span>
            <span className="absolute inset-0 bg-linear-to-r from-cyan-500/20 to-blue-500/20 blur-3xl" />
          </span>
          <br />
          <span className="relative">
            <span className="relative z-10 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              With Quantum Precision
            </span>
            <span className="absolute inset-0 bg-linear-to-r from-cyan-500/30 to-purple-500/30 blur-3xl" />
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl text-slate-300 max-w-3xl mb-12 leading-relaxed font-light px-4">
          The world&apos;s first AI-powered forecasting platform combining{' '}
          <span className="text-cyan-300 font-medium">thermal physics</span>,{' '}
          <span className="text-blue-300 font-medium">aerodynamic simulation</span>, and{' '}
          <span className="text-purple-300 font-medium">neural pattern recognition</span>{' '}
          for unprecedented weather prediction accuracy.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 items-center mb-20">
          <Link href="/predict">
            <button className="group relative bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-3">
                <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Forecasting Now
              </span>
            </button>
          </Link>
          
          <a href="#features">
            <button className="group bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-3 backdrop-blur-sm">
              <Cpu className="w-5 h-5 group-hover:animate-spin" />
              Explore Technology
            </button>
          </a>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mb-20">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>

        {/* Animated Weather Visualization */}
        <div className="relative w-full max-w-6xl h-64 mb-20 rounded-2xl overflow-hidden border border-white/10 bg-linear-to-br from-black/40 to-slate-900/40 backdrop-blur-sm">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-gradient" />
          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="text-left">
                <div className="text-sm text-slate-400 mb-2">LIVE SIMULATION</div>
                <div className="text-2xl font-bold">Storm Prediction Model</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
              <div className="bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full h-full w-3/4 animate-progress" />
            </div>
            <div className="flex justify-between text-sm text-slate-300">
              <span>Low Risk</span>
              <span className="font-bold text-amber-400">Storm Detected: 85% Probability</span>
              <span>High Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="relative max-w-7xl mx-auto px-4 pb-32 z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Advanced Forecasting Technology
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Powered by six specialized AI models working in unison to deliver the most accurate weather predictions available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-linear-to-r from-cyan-500/20 to-purple-500/20 blur-3xl rounded-3xl" />
            <div className="relative bg-linear-to-br from-slate-900/80 to-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Experience the Future of Weather Forecasting?</h3>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of meteorologists, researchers, and weather enthusiasts who trust WeatherOracle AI.
              </p>
              <Link href="/predict">
                <button className="group bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-cyan-500/30">
                  <span className="relative flex items-center gap-3">
                    <Zap className="w-5 h-5 group-hover:animate-bounce" />
                    Launch Weather Dashboard
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 75%; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-out forwards;
        }
        
        .animate-twinkle {
          animation: twinkle var(--duration) ease-in-out infinite;
        }
        
        .animate-in {
          animation-duration: 0.7s;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .fade-in {
          animation-name: fadeIn;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .slide-in-from-bottom-4 {
          animation-name: slideInFromBottom4;
        }
        
        @keyframes slideInFromBottom4 {
          from { transform: translateY(1rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .slide-in-from-bottom-8 {
          animation-name: slideInFromBottom8;
        }
        
        @keyframes slideInFromBottom8 {
          from { transform: translateY(2rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </main>
  );
}