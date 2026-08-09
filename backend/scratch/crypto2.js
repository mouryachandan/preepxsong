const crypto = require('crypto');

function decryptMediaUrl(encryptedUrl) {
  try {
    const key = Buffer.from('38346591', 'utf8');
    const decipher = crypto.createDecipheriv('des-ecb', key, '');
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(encryptedUrl, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.replace('_96_p.mp4', '_320.mp4').replace('.mp4', '.mp3');
  } catch (err) {
    return 'ERROR: ' + err.message;
  }
}

const enc = "ID2ieOjCrwfgWvL5sXl4B1ImC5QfbsDy+b9shY+Kv7Gbldap7+o7dDgOKh1EPaPwr31vBV730Cb9ft9NHlKRJPhveXdhRkFeGBTsxqxbyf8=";
console.log(decryptMediaUrl(enc));
