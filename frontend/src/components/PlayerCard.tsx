'use client';
import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

export default function PlayerCard() {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    nextSong, 
    prevSong,
    progress,
    duration,
    setProgress 
  } = useAudioPlayer();

  if (!currentSong) return null;

  const coverImage = currentSong.image?.slice(-1)?.[0]?.url || currentSong.image?.[0]?.url;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl flex items-center justify-between gap-6 transition-all duration-300">
      
      {/* Album Art & Info */}
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 shadow-lg border border-white/10">
          <img src={coverImage} alt={currentSong.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-col overflow-hidden">
          <h3 className="text-white font-semibold text-lg truncate" dangerouslySetInnerHTML={{ __html: currentSong.name }} />
          <p className="text-white/60 text-sm truncate" dangerouslySetInnerHTML={{ __html: currentSong.primaryArtists }} />
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="flex flex-col items-end gap-2 w-1/2">
        <div className="flex items-center gap-4">
          <button onClick={prevSong} className="text-white/70 hover:text-white transition">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay} 
            className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition shadow-lg"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={nextSong} className="text-white/70 hover:text-white transition">
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full text-xs text-white/50 font-medium">
          <span>{formatTime(progress)}</span>
          <input 
            type="range" 
            min="0" 
            max={duration || 100} 
            value={progress} 
            onChange={handleSeek}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer focus:outline-none accent-white"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
    </div>
  );
}
