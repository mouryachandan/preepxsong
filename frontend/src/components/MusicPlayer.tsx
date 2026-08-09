'use client';
import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Play, Pause, SkipBack, SkipForward, Maximize2, Minimize2, Repeat, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MusicPlayer = () => {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong, progress, howl, setProgress } = useAudioPlayer();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (howl) {
      setDuration(howl.duration());
      
      const interval = setInterval(() => {
        if (howl.playing()) {
          useAudioPlayer.setState({ progress: howl.seek() as number });
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [howl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        prevSong();
      } else if (e.code === 'ArrowRight') {
        nextSong();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, prevSong, nextSong]);

  if (!currentSong) return null;

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  const coverImage = currentSong.image?.slice(-1)?.[0]?.url || 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=500';

  return (
    <AnimatePresence>
      {isFullScreen ? (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center p-8"
        >
          <button onClick={() => setIsFullScreen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white">
            <Minimize2 size={24} />
          </button>
          
          <motion.img 
            src={coverImage}
            alt={currentSong.name}
            className={`w-64 h-64 md:w-96 md:h-96 rounded-full object-cover shadow-2xl mb-12 ${isPlaying ? 'animate-spin-slow' : ''}`}
            style={{ animationDuration: '20s' }}
          />
          
          <h2 className="text-3xl font-bold mb-2 text-center text-white">{currentSong.name}</h2>
          <p className="text-lg text-gray-400 mb-12 text-center">{currentSong.primaryArtists}</p>
          
          <div className="w-full max-w-2xl flex flex-col gap-4">
            <input 
              type="range" 
              min={0} 
              max={duration} 
              value={progress} 
              onChange={handleSeek}
              className="w-full accent-white h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-6">
              <button className="text-white/50 hover:text-white"><Shuffle size={20} /></button>
              <button onClick={prevSong} className="text-white hover:scale-110 transition"><SkipBack size={32} /></button>
              <button onClick={togglePlay} className="w-20 h-20 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition">
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
              </button>
              <button onClick={nextSong} className="text-white hover:scale-110 transition"><SkipForward size={32} /></button>
              <button className="text-white/50 hover:text-white"><Repeat size={20} /></button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 h-24 bg-black/60 backdrop-blur-xl border-t border-white/10 flex items-center px-6 z-40"
        >
          <div className="flex items-center gap-4 flex-1">
            <img src={coverImage} alt={currentSong.name} className="w-14 h-14 rounded-md object-cover" />
            <div>
              <h4 className="font-medium text-white truncate max-w-[200px]">{currentSong.name}</h4>
              <p className="text-xs text-gray-400 truncate max-w-[200px]">{currentSong.primaryArtists}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center flex-1 max-w-xl">
            <div className="flex items-center gap-6 mb-2">
              <button onClick={prevSong} className="text-white/70 hover:text-white"><SkipBack size={20} /></button>
              <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition">
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
              </button>
              <button onClick={nextSong} className="text-white/70 hover:text-white"><SkipForward size={20} /></button>
            </div>
            <div className="w-full flex items-center gap-3 text-xs text-gray-400">
              <span>{formatTime(progress)}</span>
              <input 
                type="range" 
                min={0} 
                max={duration} 
                value={progress} 
                onChange={handleSeek}
                className="w-full accent-white h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-4 flex-1">
            <button onClick={() => setIsFullScreen(true)} className="text-white/50 hover:text-white">
              <Maximize2 size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
