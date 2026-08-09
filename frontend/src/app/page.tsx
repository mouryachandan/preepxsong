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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/songs/ping`, { method: 'POST' });
        const data = await res.json();
        if (data.online) setOnlineCount(data.online);
      } catch (e) {}
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

      {/* Top Bar & Title Area */}
      <div className="relative z-10 w-full p-4 md:p-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        
        {/* PreepX Logo (Left on Desktop, Center on Mobile) */}
        <div className="flex items-center select-none z-20 w-full md:w-auto justify-center md:justify-start">
          <Image src={preepxLogo} alt="PreepX Logo" className="h-16 md:h-32 w-auto object-contain" priority />
        </div>
        
        {/* Center Column: Online + Title */}
        <div className="flex flex-col items-center gap-2 md:gap-3 z-10 w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:top-10 pointer-events-none">
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-auto">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-white/90">{onlineCount} online</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight text-center bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
            Music with Preepx
          </h1>
        </div>

        {/* Time (Right on Desktop, Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-3 text-white/80 z-20">
          <div className="text-white/80 font-medium tracking-wider text-sm flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      {/* Glass Player (Centered on Mobile, Bottom Bar on Desktop) */}
      {displaySong && (
        <div className="absolute inset-0 md:inset-auto md:bottom-10 md:left-0 md:right-0 z-20 px-6 md:px-4 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-xl mx-auto bg-black/40 backdrop-blur-3xl rounded-[40px] md:rounded-[32px] p-8 md:p-5 flex flex-col md:flex-row items-center gap-6 md:gap-5 border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.8)] md:shadow-[0_16px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
            
            {/* Spinning Album Art */}
            <div className="relative w-48 h-48 md:w-20 md:h-20 flex-shrink-0">
              <div className={`w-full h-full rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] md:shadow-2xl ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}>
                <img src={bgImage} alt="cover" className="w-full h-full object-cover" />
              </div>
              {/* Center hole to look like a CD/Record */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-4 md:h-4 bg-black/80 rounded-full border border-white/30" />
            </div>

            {/* Track Info & Progress */}
            <div className="w-full md:flex-1 overflow-hidden text-center md:text-left">
              <h2 className="text-white font-bold text-2xl md:text-base truncate md:pr-2 mb-1 md:mb-0">
                {displaySong.name}
              </h2>
              <p className="text-white/60 text-base md:text-xs truncate md:pr-2 mb-4 md:mb-2">
                {displaySong.primaryArtists}
              </p>

              {/* Progress Bar & Timers */}
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-white/50 w-10 text-right md:hidden">{formatTime(progress)}</span>
                <div 
                  className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer flex items-center group"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-100 ease-linear relative" 
                    style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-white/50 w-10 text-left md:hidden">{formatTime(duration)}</span>
              </div>
              <div className="hidden md:block text-[10px] text-white/50 mt-1">
                {formatTime(progress)} / {formatTime(duration)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8 md:gap-4 w-full md:w-auto mt-4 md:mt-0 md:pr-2">
              <button onClick={prevSong} className="text-white/70 hover:text-white transition-colors">
                <SkipBack size={32} className="md:w-5 md:h-5" fill="currentColor" />
              </button>
              
              <button 
                onClick={() => {
                  if (!currentSong && displaySong) {
                    playSong(displaySong, songs);
                  } else {
                    togglePlay();
                  }
                }} 
                className="w-20 h-20 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] md:shadow-lg"
              >
                {isPlaying ? (
                  <Pause size={32} className="md:w-5 md:h-5" fill="currentColor" />
                ) : (
                  <Play size={32} className="md:w-5 md:h-5 ml-1 md:ml-1" fill="currentColor" />
                )}
              </button>

              <button onClick={nextSong} className="text-white/70 hover:text-white transition-colors">
                <SkipForward size={32} className="md:w-5 md:h-5" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
