const crypto = require('crypto');

function decryptMediaUrl(encryptedUrl) {
  try {
    const key = Buffer.from('38346591', 'utf8');
    const decipher = crypto.createDecipheriv('des-ecb', key, null);
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(encryptedUrl, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    console.log("Decrypted:", decrypted);
    return decrypted;
  } catch (err) {
    console.error("Error:", err);
  }
}

decryptMediaUrl("ID2ieOjCrwfgWvL5sXl4B1ImC5QfbsDyx6+PYTH0Fzy04C8Ok/hFkL3jJ5qZ0NQHduYa5rQA4uoAZieHc+Q97hw7tS9a8Gtq");
