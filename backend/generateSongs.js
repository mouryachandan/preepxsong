const fs = require('fs');
const path = require('path');

const audioPool = [
  'https://archive.org/download/Aashiqui1990_201705/04%20-%20Dheere%20Dhheere%20Se%20Meri%20Zindagi%20Mein%20Aana.mp3',
  'https://archive.org/download/dilwale-dulhania-le-jayenge-1995_202107/03.%20Tujhe%20Dekha%20To%20-%20Lata%20Mangeshkar%2C%20Kumar%20Sanu.mp3',
  'https://archive.org/download/Baazigar1993_201705/01%20-%20Baazigar%20O%20Baazigar.mp3',
  'https://archive.org/download/JoJeetaWohiSikander1992/05%20-%20Pehla%20Nasha.mp3',
  'https://archive.org/download/1942ALoveStory1994_201705/01%20-%20Ek%20Ladki%20Ko%20Dekha.mp3',
  'https://archive.org/download/kuch-kuch-hota-hai-1998_202209/01%20-%20Kuch%20Kuch%20Hota%20Hai.mp3',
  'https://archive.org/download/kaho-naa-pyaar-hai-2000_202209/01%20-%20Kaho%20Naa%20Pyaar%20Hai.mp3',
  'https://archive.org/download/raja-hindustani-1996/01%20-%20Pardesi%20Pardesi.mp3',
  'https://archive.org/download/hum-aapke-hain-koun-1994/01%20-%20Didi%20Tera%20Devar%20Deewana.mp3',
  'https://archive.org/download/mohra-1994/01%20-%20Tu%20Cheez%20Badi%20Hai%20Mast.mp3'
];

const imagePool = [
  'https://c.saavncdn.com/464/Aashiqui-Hindi-1990-20221124114251-500x500.jpg',
  'https://c.saavncdn.com/793/Dilwale-Dulhania-Le-Jayenge-Hindi-1995-20221212023157-500x500.jpg',
  'https://c.saavncdn.com/798/Baazigar-Hindi-1993-20221212023531-500x500.jpg',
  'https://c.saavncdn.com/006/Jo-Jeeta-Wohi-Sikandar-Hindi-1992-20221207161621-500x500.jpg',
  'https://c.saavncdn.com/643/1942-A-Love-Story-Hindi-1994-20221209180709-500x500.jpg',
  'https://c.saavncdn.com/391/Kuch-Kuch-Hota-Hai-Hindi-1998-20221212023021-500x500.jpg',
  'https://c.saavncdn.com/264/Kaho-Naa-Pyaar-Hai-Hindi-2000-20221209183422-500x500.jpg',
  'https://c.saavncdn.com/722/Raja-Hindustani-Hindi-1996-20221212023004-500x500.jpg',
  'https://c.saavncdn.com/246/Hum-Aapke-Hain-Koun-Hindi-1994-20221208005315-500x500.jpg',
  'https://c.saavncdn.com/001/Mohra-Hindi-1994-20230304071343-500x500.jpg'
];

const titles = [
  "Dheere Dheere Se", "Tujhe Dekha To", "Baazigar O Baazigar", "Pehla Nasha", "Ek Ladki Ko Dekha",
  "Kuch Kuch Hota Hai", "Kaho Naa Pyaar Hai", "Pardesi Pardesi", "Didi Tera Devar", "Tu Cheez Badi Hai",
  "Mera Dil Bhi Kitna", "Sambhala Hai Maine", "Ae Mere Humsafar", "Main Duniya Bhula Doonga", "Tumse Milkar Na Jaane",
  "Chura Ke Dil Mera", "Aaye Ho Meri Zindagi Mein", "O O Jaane Jaana", "Ho Gaya Hai Tujhko", "Mehndi Laga Ke Rakhna",
  "Ruk Ja O Dil Deewane", "Mere Khwabon Mein", "Bholi Si Surat", "Are Re Are", "Dil To Pagal Hai",
  "Yeh Ladka Hai Allah", "Chaiyya Chaiyya", "Suraj Hua Maddham", "Bole Chudiyan", "Kabhi Khushi Kabhie Gham",
  "You Are My Soniya", "Say Shava Shava", "Deewana Main Chala", "Ek Din Aap", "Humko Humise Chura Lo",
  "Zinda Rehti Hain", "Aankhein Khuli", "Chalte Chalte", "Suno Na Suno Na", "Tauba Tumhare Yeh Ishaare",
  "Gori Gori", "Tumse Milke Dilka", "Main Yahaan Hoon", "Do Pal", "Tere Liye"
];

const artists = [
  "Kumar Sanu, Anuradha Paudwal", "Kumar Sanu, Lata Mangeshkar", "Kumar Sanu, Alka Yagnik", "Udit Narayan, Sadhana Sargam", "Kumar Sanu",
  "Udit Narayan, Alka Yagnik", "Udit Narayan, Kavita Krishnamurthy", "Lata Mangeshkar, S. P. Balasubrahmanyam", "Kavita Krishnamurthy, Sonu Nigam", "Abhijeet, Alka Yagnik",
  "Kishore Kumar", "Asha Bhosle", "Sonu Nigam, Shreya Ghoshal", "Shaan", "K. K."
];

let songs = [];
for (let i = 1; i <= 500; i++) {
  const title = titles[i % titles.length] + (i > titles.length ? ` (Mix ${Math.ceil(i/titles.length)})` : '');
  const artist = artists[i % artists.length];
  const audio = audioPool[i % audioPool.length];
  const image = imagePool[i % imagePool.length];
  
  songs.push({
    id: `local-${i}`,
    name: title,
    primaryArtists: artist,
    image: [{ url: image, quality: '500x500' }],
    downloadUrl: [{ url: audio, quality: '320kbps' }],
    duration: 300 + Math.floor(Math.random() * 60)
  });
}

const fileContent = `export const hardcodedSongs = ${JSON.stringify(songs, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, 'src/songs/songs.data.ts'), fileContent);
console.log('Generated 500 songs in src/songs/songs.data.ts');
