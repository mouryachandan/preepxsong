import type { Metadata } from 'next';
import './globals.css';
import { MusicPlayer } from '@/components/MusicPlayer';

export const metadata: Metadata = {
  title: 'Music with Preepx',
  description: 'Stream the best of 90s Bollywood Music',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center opacity-80 fixed" />
        <div className="absolute inset-0 bg-black/50 fixed backdrop-blur-[2px]" />
        
        <main className="relative z-10 h-screen w-full flex flex-col">
          {children}
        </main>
        
      </body>
    </html>
  );
}
