'use client';

import React, { useState, useRef, useEffect } from 'react';
import { uploadSong, getSongs, deleteSong } from '@/services/api';
import { UploadCloud, Music, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [artists, setArtists] = useState('');
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [uploadedSongs, setUploadedSongs] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('admin_auth', 'true');
      fetchSongs();
    }
  }, [isAuthenticated]);

  const fetchSongs = async () => {
    try {
      const res = await getSongs();
      if (res?.data?.results) {
        setUploadedSongs(res.data.results);
      }
    } catch (error) {
      console.error('Failed to fetch songs', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSong(id);
      if (res.success) {
        fetchSongs(); // Refresh list
      } else {
        alert(res.message || 'Failed to delete song');
      }
    } catch (error) {
      console.error('Failed to delete song', error);
      alert('Error deleting song');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artists || audioFiles.length === 0) {
      setStatus('error');
      setMessage('Artist name and at least one audio file are required!');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('Uploading to Cloudinary & MongoDB... Please wait.');

    try {
      const formData = new FormData();
      formData.append('artists', artists);
      audioFiles.forEach((file) => {
        formData.append('audio', file);
      });

      const res = await uploadSong(formData);
      if (res.success) {
        setStatus('success');
        setMessage(`${audioFiles.length} song(s) uploaded successfully!`);
        setArtists('');
        setAudioFiles([]);
        fetchSongs();
      } else {
        setStatus('error');
        setMessage(`Error: ${res.message || 'Failed to upload'}`);
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'preepxsongs8969@gmail.com';
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'preepxsongs8969';
    
    if (email === correctEmail && password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Email or Password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]" />
        
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-2xl text-center shadow-2xl relative z-10">
          <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Admin Login</h2>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            autoFocus
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-white/30 mb-4 text-center tracking-wide"
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-white/30 mb-6 text-center tracking-widest"
          />
          <button 
            type="submit" 
            className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl hover:shadow-blue-500/25 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="absolute top-6 right-6">
          <button 
            onClick={handleLogout}
            className="text-sm px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 text-white/70 hover:text-white"
          >
            Logout
          </button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Admin CMS
          </h1>
          <p className="text-white/60 text-lg">Upload new tracks to your database directly.</p>
        </div>

        <AnimatePresence mode="wait">
          {status !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 rounded-xl mb-8 flex items-center gap-3 border ${
                status === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
              }`}
            >
              {status === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Artist(s)</label>
                <input 
                  type="text" 
                  value={artists}
                  onChange={(e) => setArtists(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-white/30"
                  placeholder="e.g. Kumar Sanu, Lata Mangeshkar"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Audio Upload */}
              <div 
                onClick={() => audioInputRef.current?.click()}
                className={`relative group h-28 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  audioFiles.length > 0 ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 bg-black/20 hover:border-white/40 hover:bg-white/5'
                }`}
              >
                <input 
                  type="file" 
                  ref={audioInputRef}
                  accept="audio/mp3,audio/mpeg"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setAudioFiles(Array.from(e.target.files).slice(0, 30));
                    }
                  }}
                  className="hidden"
                />
                {audioFiles.length > 0 ? (
                  <div className="flex flex-col items-center text-blue-400">
                    <Music size={28} className="mb-2" />
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {audioFiles.length} file(s) selected
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-white/50 group-hover:text-white/80 transition-colors">
                    <UploadCloud size={28} className="mb-2" />
                    <span className="text-sm font-medium">Click to upload up to 30 MP3s</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              loading 
                ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl hover:shadow-blue-500/25'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Uploading...
              </>
            ) : (
              'Upload to Database'
            )}
          </button>
        </form>

        {/* Uploaded Songs List */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-4 text-white/90">Uploaded Songs</h2>
          {uploadedSongs.length === 0 ? (
            <p className="text-white/50 text-center py-4 text-sm">No songs uploaded yet.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {uploadedSongs.map((song) => (
                <div key={song.id} className="flex items-center justify-between bg-black/30 border border-white/5 p-2 rounded-lg backdrop-blur-sm hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={song.image?.[0]?.url || 'https://via.placeholder.com/150'} alt="cover" className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                    <div className="overflow-hidden">
                      <h3 className="font-semibold text-white/90 text-sm truncate">{song.name}</h3>
                      <p className="text-xs text-white/50 truncate">{song.primaryArtists}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(song.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all flex-shrink-0"
                    title="Delete Song"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
