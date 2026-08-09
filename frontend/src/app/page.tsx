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
      <div className="relative z-10 w-full p-6">
        {/* Status Bar */}
        <div className="flex justify-between items-start relative">
          {/* PreepX Logo (Left) */}
          <div className="flex items-center gap-2 select-none z-20">
            <Image src={preepxLogo} alt="PreepX Logo" className="h-32 w-auto object-contain" priority />
          </div>
          
          {/* Center Column: Online + Title (Absolutely Centered) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center gap-3 mt-4 z-10 w-full max-w-2xl pointer-events-none">
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-auto">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-white/90">{onlineCount} online</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-center bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
              Music with Preepx
            </h1>
          </div>

          {/* Time (Right) */}
          <div className="flex items-center gap-3 text-white/80 mt-4 z-20">
            <div className="text-white/80 font-medium tracking-wider text-sm flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
      {/* Floating Glass Player (Bottom) */}
      {displaySong && (
        <div className="absolute bottom-10 left-0 right-0 z-20 px-4">
          <div className="w-full max-w-xl mx-auto bg-black/40 backdrop-blur-3xl rounded-[32px] p-5 flex items-center gap-5 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            
            {/* Spinning Album Art */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <div className={`w-full h-full rounded-full overflow-hidden border border-white/20 shadow-2xl ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}>
                <img src={bgImage} alt="cover" className="w-full h-full object-cover" />
              </div>
              {/* Center hole to look like a CD/Record */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black/60 rounded-full border border-white/30" />
            </div>

            {/* Track Info & Progress */}
            <div className="flex-1 overflow-hidden">
              <h2 className="text-white font-semibold text-base truncate pr-2">
                {displaySong.name}
              </h2>
              <p className="text-white/60 text-xs truncate pr-2 mb-2">
                {displaySong.primaryArtists}
              </p>

              {/* Progress Bar & Timers */}
              <div className="flex items-center gap-3 mt-1">
                <div 
                  className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer flex items-center group"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-100 ease-linear relative" 
                    style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-[10px] text-white/50 mt-1">
                {formatTime(progress)} / {formatTime(duration)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 pr-2">
              <button onClick={prevSong} className="text-white/70 hover:text-white transition-colors">
                <SkipBack size={20} fill="currentColor" />
              </button>
              
              <button 
                onClick={() => {
                  if (!currentSong && displaySong) {
                    playSong(displaySong, songs);
                  } else {
                    togglePlay();
                  }
                }} 
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                {isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" className="ml-1" />
                )}
              </button>

              <button onClick={nextSong} className="text-white/70 hover:text-white transition-colors">
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
