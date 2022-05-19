const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-ctr';
let key = 'MySecretKey';
key = crypto.createHash('sha256').update(String(key)).digest('base64').substring(0, 32);

const decrypt = (encrypted) => {

    const iv = encrypted.slice(0, 16);
    encrypted = encrypted.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return result;
}

fs.readFile('./cipher_file.dcm', (err, file) => {
    if (err) return console.error(err.message);

    if (file) {
        const decryptedFile = decrypt(file);
        fs.writeFile('./decrypt_file.dcm', decryptedFile, (err, file) => {
            if (err) return console.error(err.message);           
            console.log('File dencrypted succesfully 100%');
           
        })
    }
})
