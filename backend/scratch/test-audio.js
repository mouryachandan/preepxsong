const https = require('https');
const crypto = require('crypto');

function decryptMediaUrl(encryptedUrl) {
    const key = Buffer.from('38346591', 'utf8');
    const decipher = crypto.createDecipheriv('des-ecb', key, '');
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(encryptedUrl, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.replace('_96_p', '_320').replace('_96', '_320');
}

const enc = "ID2ieOjCrwfgWvL5sXl4B1ImC5QfbsDy+b9shY+Kv7Gbldap7+o7dDgOKh1EPaPwr31vBV730Cb9ft9NHlKRJPhveXdhRkFeGBTsxqxbyf8=";
const url = decryptMediaUrl(enc);
console.log('Decrypted:', url);

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error(e);
});
