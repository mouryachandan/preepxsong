const fs = require('fs');
const https = require('https');
const path = require('path');

const fetchItunes = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

async function main() {
  try {
    const urls = [
      'https://itunes.apple.com/search?term=kumar+sanu+90s&entity=song&limit=200',
      'https://itunes.apple.com/search?term=udit+narayan+90s&entity=song&limit=200',
      'https://itunes.apple.com/search?term=alka+yagnik+90s&entity=song&limit=100'
    ];
    
    let allTracks = [];
    for (let url of urls) {
      console.log('Fetching', url);
      const data = await fetchItunes(url);
      if (data && data.results) {
        allTracks = allTracks.concat(data.results);
      }
    }
    
    // Deduplicate
    const uniqueTracks = [];
    const seen = new Set();
    for (let track of allTracks) {
      if (track.previewUrl && !seen.has(track.trackName)) {
        seen.add(track.trackName);
        uniqueTracks.push({
          id: track.trackId?.toString() || Math.random().toString(),
          name: track.trackName,
          primaryArtists: track.artistName,
          image: [{ url: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb.jpg', '500x500bb.jpg') : '', quality: '500x500' }],
          downloadUrl: [{ url: track.previewUrl, quality: '128kbps' }],
          duration: 30
        });
      }
    }
    
    const finalSongs = uniqueTracks.slice(0, 500);
    
    const fileContent = `export const hardcodedSongs = ${JSON.stringify(finalSongs, null, 2)};\n`;
    fs.writeFileSync(path.join(__dirname, 'src/songs/songs.data.ts'), fileContent);
    console.log(`Successfully hardcoded ${finalSongs.length} unique songs into src/songs/songs.data.ts`);
  } catch(e) {
    console.error(e);
  }
}

main();
