import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, FolderArchive, PlusCircle, ShieldCheck } from 'lucide-react';
import { useSound } from '../../context/SoundContext';
import { caseService } from '../../services/api';

export default function Navbar() {
  const location = useLocation();
  const { soundEnabled, toggleSound, ambientActive, toggleAmbient, playClick } = useSound();
  const [dbHealthy, setDbHealthy] = useState(true);

  useEffect(() => {
    // Non-blocking health ping
    caseService.getHealth()
      .then((res) => setDbHealthy(res.status === 'healthy'))
      .catch(() => setDbHealthy(false));
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-noir-950/90 backdrop-blur-md border-b border-noir-600/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link
          to="/"
          onClick={playClick}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded bg-noir-900 border border-gold/40 flex items-center justify-center text-gold group-hover:border-gold group-hover:shadow-gold-glow transition-all">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <circle cx="11" cy="11" r="3" fill="#C69B52" stroke="none" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-wide text-cream group-hover:text-gold transition-colors block leading-tight">
              AI MYSTERY ROOM
            </span>
            <span className="text-[10px] font-mono tracking-widest text-parchment uppercase block">
              Noir Detective Bureau
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {/* Start Investigation CTA */}
          <Link
            to="/create"
            onClick={playClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-all ${
              isActive('/create')
                ? 'bg-gold text-noir-950 font-semibold shadow-gold-glow'
                : 'text-parchment hover:text-cream hover:bg-noir-900 border border-transparent hover:border-noir-600'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-gold" />
            <span>New Case</span>
          </Link>

          {/* Case History Link */}
          <Link
            to="/history"
            onClick={playClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-all ${
              isActive('/history')
                ? 'bg-noir-800 text-gold border border-gold/40'
                : 'text-parchment hover:text-cream hover:bg-noir-900 border border-transparent hover:border-noir-600'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span className="hidden sm:inline">Case Archives</span>
            <span className="sm:hidden">Archives</span>
          </Link>

          {/* System Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-noir-900 border border-noir-600 text-[11px] font-mono text-parchment">
            <span className={`w-2 h-2 rounded-full ${dbHealthy ? 'bg-vintage-success' : 'bg-vintage-danger animate-pulse'}`} />
            <span>AI Ready</span>
          </div>

          {/* Sound Controls */}
          <div className="flex items-center border-l border-noir-600 pl-2 sm:pl-3 ml-1 sm:ml-2">
            <button
              onClick={toggleSound}
              className={`p-2 rounded transition-all focus:outline-none ${
                soundEnabled
                  ? 'text-gold bg-noir-900 border border-gold/40'
                  : 'text-vintage-muted hover:text-parchment bg-transparent'
              }`}
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Detective Sound Effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {soundEnabled && (
              <button
                onClick={toggleAmbient}
                className={`ml-1 text-[10px] font-mono px-2 py-1 rounded hidden sm:inline-block transition-colors ${
                  ambientActive ? 'bg-vintage-success/20 text-[#8cb080] border border-vintage-success/40' : 'bg-noir-900 text-vintage-muted border border-noir-600'
                }`}
                title="Toggle Noir Rain Atmosphere"
              >
                Rain: {ambientActive ? 'ON' : 'OFF'}
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
