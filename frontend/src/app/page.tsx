'use client';

import React, { useEffect, useState } from 'react';
import { getTrendingSongs } from '@/services/api';
import { useAudioPlayer, Song } from '@/hooks/useAudioPlayer';
import { Play, SkipBack, SkipForward, Pause, Radio, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import preepxLogo from '../../preepx_logo.png';
import Image from 'next/image';

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(1);

  const { currentSong, isPlaying, playSong, togglePlay, progress, duration, nextSong, prevSong, setProgress } = useAudioPlayer();

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const ping = async () => {
      try {
        let clientId = sessionStorage.getItem('clientId');
        if (!clientId) {
          clientId = Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem('clientId', clientId);
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/songs/ping`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId })
        });
        const data = await res.json();
        if (data.online) setOnlineCount(data.online);
      } catch (e) { }
    };

    if (isPlaying) {
      ping();
      interval = setInterval(ping, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const data = await getTrendingSongs();
      if (data?.data?.results) setSongs(data.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setProgress(percent * duration);
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const displaySong = currentSong || (songs.length > 0 ? songs[0] : null);

  // The background image matches the song, or a default placeholder
  const bgImage = displaySong
    ? (displaySong.image?.slice(-1)?.[0]?.url || displaySong.image?.[0]?.url)
    : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2000&auto=format&fit=crop';

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-transparent text-white font-sans touch-none selection:bg-transparent">

      {/* Transparent container to let layout background show through */}

      {/* Top Header Row */}
      <div className="relative z-20 w-full p-4 md:p-6 flex flex-row justify-between items-center">
        {/* Logo (Left) */}
        <a href="https://preepx.in" className="flex items-center select-none z-10 hover:opacity-80 transition-opacity">
          <Image src={preepxLogo} alt="PreepX Logo" className="h-16 md:h-24 w-auto object-contain drop-shadow-md" priority />
        </a>

        {/* Online Pill (Center) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-2 bg-black/30 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/10 shadow-sm pointer-events-auto z-10">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] md:text-xs font-medium text-white/90">{onlineCount} online</span>
        </div>
        
        {/* Time (Right) */}
        <div className="flex items-center z-10">
          <div className="text-white/90 font-medium tracking-wider text-[10px] md:text-xs flex items-center bg-black/30 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-white/10 shadow-sm">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Hero Title */}
      <div className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 w-full px-4 text-center z-10 pointer-events-none flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          Music with Preepx
        </h1>
        
        {/* Promo Banner */}
        <a href="https://preepx.in" target="_blank" rel="noopener noreferrer" className="mt-4 md:mt-6 pointer-events-auto group flex flex-col md:flex-row items-center gap-1.5 md:gap-3 px-5 py-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/10 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-0.5">
          <span className="text-xs md:text-sm text-white/90 font-medium">
            Preparing for interviews? Crack your dream job with AI.
          </span>
          <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text flex items-center gap-1">
            Explore PreepX <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </a>
      </div>

      {/* Glass Player (Premium Horizontal Pill Centered) */}
      {loading ? (
        <div className="absolute bottom-[45%] md:bottom-32 left-1/2 -translate-x-1/2 w-[95%] max-w-[400px] md:max-w-[650px] z-30 pointer-events-none">
          <div className="w-full bg-white/[0.08] backdrop-blur-3xl rounded-[32px] p-2.5 md:p-4 flex flex-row items-center gap-3 md:gap-5 border border-white/[0.15] shadow-[0_16px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
            <div className="relative w-14 h-14 md:w-20 md:h-20 flex-shrink-0">
              <div className="w-full h-full rounded-2xl md:rounded-[20px] bg-white/10 animate-pulse"></div>
            </div>
            <div className="flex-1 pl-1">
              <div className="h-4 md:h-5 bg-white/10 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-3 md:h-4 bg-white/10 rounded w-1/2 mb-3 animate-pulse"></div>
              <div className="h-1 md:h-1.5 bg-white/10 rounded-full w-full animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2.5 md:gap-4 pr-2 md:pr-4">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded-full animate-pulse"></div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-full animate-pulse"></div>
              <div className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : displaySong && (
        <div className="absolute bottom-[45%] md:bottom-32 left-1/2 -translate-x-1/2 w-[95%] max-w-[400px] md:max-w-[650px] z-30 pointer-events-none">
          <div className="w-full bg-white/[0.08] backdrop-blur-3xl rounded-[32px] p-2.5 md:p-4 flex flex-row items-center gap-3 md:gap-5 border border-white/[0.15] shadow-[0_16px_40px_rgba(0,0,0,0.5)] pointer-events-auto transition-transform hover:scale-[1.02]">

            {/* Album Art (Square with rounded corners, subtle glow) */}
            <div className="relative w-14 h-14 md:w-20 md:h-20 flex-shrink-0">
              <div className={`w-full h-full rounded-2xl md:rounded-[20px] overflow-hidden shadow-lg ${isPlaying ? 'animate-[pulse_4s_ease-in-out_infinite]' : ''}`}>
                <img src={bgImage} alt="cover" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Track Info & Progress */}
            <div className="flex-1 overflow-hidden text-left pl-1">
              <h2 className="text-white font-bold text-sm md:text-lg truncate pr-2 mb-0.5 md:mb-1">
                {displaySong.name}
              </h2>
              <p className="text-white/60 text-[10px] md:text-sm truncate pr-2 mb-1.5 md:mb-2 font-medium">
                {displaySong.primaryArtists}
              </p>

              {/* Minimal Progress Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] md:text-xs text-white/40 w-7 md:w-10 text-right">{formatTime(progress)}</span>
                <div
                  className="flex-1 h-1 md:h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer flex items-center group relative"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-gradient-to-r from-white/80 to-white rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] md:text-xs text-white/40 w-7 md:w-10 text-left">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2.5 md:gap-4 pr-2 md:pr-4">
              <button onClick={prevSong} className="text-white/70 hover:text-white transition-colors">
                <SkipBack size={20} className="md:w-6 md:h-6" fill="currentColor" />
              </button>

              <button
                onClick={() => {
                  if (!currentSong && displaySong) {
                    playSong(displaySong, songs);
                  } else {
                    togglePlay();
                  }
                }}
                className="w-12 h-12 md:w-14 md:h-14 bg-white hover:bg-gray-100 text-black rounded-full flex items-center justify-center transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
              >
                {isPlaying ? (
                  <Pause size={20} className="md:w-6 md:h-6" fill="currentColor" />
                ) : (
                  <Play size={20} className="md:w-6 md:h-6 ml-1" fill="currentColor" />
                )}
              </button>

              <button onClick={nextSong} className="text-white/70 hover:text-white transition-colors">
                <SkipForward size={20} className="md:w-6 md:h-6" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
