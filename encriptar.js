const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-ctr';
let key = 'MySecretKey';
key = crypto.createHash('sha256').update(String(key)).digest('base64').substring(0, 32);


const encrypt = (buffer) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return result;
}


fs.readFile('./test1.dcm', (err, file) => {
    if (err) return console.error(err.message);
    console.log('Curent file Data: ${file}');
    const encryptedFile = encrypt(file);
    fs.writeFile('./cipher_file.dcm', encryptedFile, (err, file) => {
        if (err) return console.error(err.message);
        
            console.log('File encrypted succesfully 100%');
        
    })
})

