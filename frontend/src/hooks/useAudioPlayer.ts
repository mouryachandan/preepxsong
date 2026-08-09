import { create } from 'zustand';
import { Howl } from 'howler';

export interface Song {
  id: string;
  name: string;
  primaryArtists: string;
  image: { url: string; quality: string }[];
  downloadUrl: { url: string; quality: string }[];
  duration: number;
}

interface AudioPlayerState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  howl: Howl | null;
  
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (vol: number) => void;
  setProgress: (prog: number) => void;
}

let progressInterval: NodeJS.Timeout | null = null;

export const useAudioPlayer = create<AudioPlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 1,
  howl: null,

  playSong: (song, newQueue) => {
    const { howl } = get();
    if (howl) {
      howl.unload();
    }

    if (progressInterval) {
      clearInterval(progressInterval);
    }

    const highQualityAudio = song.downloadUrl?.slice(-1)?.[0]?.url || song.downloadUrl?.[0]?.url;

    const newHowl = new Howl({
      src: [highQualityAudio],
      html5: true,
      volume: get().volume,
      onplay: () => {
        set({ isPlaying: true, duration: newHowl.duration() || song.duration || 300 });
        progressInterval = setInterval(() => {
          set({ progress: newHowl.seek() as number });
        }, 1000);

        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: song.name,
            artist: song.primaryArtists,
            artwork: song.image?.map(img => ({
              src: img.url, sizes: '500x500', type: 'image/jpeg'
            })) || []
          });

          navigator.mediaSession.setActionHandler('play', () => get().togglePlay());
          navigator.mediaSession.setActionHandler('pause', () => get().togglePlay());
          navigator.mediaSession.setActionHandler('previoustrack', () => get().prevSong());
          navigator.mediaSession.setActionHandler('nexttrack', () => get().nextSong());
        }
      },
      onload: () => {
        set({ duration: newHowl.duration() || song.duration || 300 });
      },
      onpause: () => {
        set({ isPlaying: false });
        if (progressInterval) clearInterval(progressInterval);
      },
      onend: () => {
        get().nextSong();
        if (progressInterval) clearInterval(progressInterval);
      },
      onloaderror: () => console.error('Error loading audio'),
    });

    newHowl.play();

    set((state) => ({
      currentSong: song,
      howl: newHowl,
      isPlaying: true,
      queue: newQueue || state.queue,
      progress: 0,
    }));
  },

  togglePlay: () => {
    const { howl, isPlaying } = get();
    if (!howl) return;
    
    if (isPlaying) {
      howl.pause();
    } else {
      howl.play();
    }
  },

  nextSong: () => {
    const { queue, currentSong, playSong } = get();
    if (!currentSong || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playSong(queue[nextIndex]);
  },

  prevSong: () => {
    const { queue, currentSong, playSong } = get();
    if (!currentSong || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    playSong(queue[prevIndex]);
  },

  setVolume: (vol) => {
    const { howl } = get();
    if (howl) howl.volume(vol);
    set({ volume: vol });
  },

  setProgress: (prog) => {
    const { howl } = get();
    if (howl) {
      howl.seek(prog);
      set({ progress: prog });
    }
  }
}));
