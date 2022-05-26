//
const crypto = require('crypto');
const { isMagicCookieFound } = require('daikon/src/parser');
const fs = require('fs');
const splitFileStream = require("split-file-stream");
const algorithm = 'aes-256-ctr';
//


//
// let maxFileSize = 1024 * 1000; // 1024 kbytes per file- 1MB Default
// let outputPath = __dirname + "/particiones" + "/part"; // file path partition's prefix
let path = __dirname + "/particiones/";
// let Split = splitFileStream.getSplitWithGenFilePath((n) => `${outputPath}-${(n + 1)}`)


module.exports = {
    //////////////////////////////////////////////////////////////////////
    //-----------------Funcion Encriptar--------------------------------
    //////////////////////////////////////////////////////////////////////
    encriptar: function (pathFile2Ecrypt, outputPath) {
        const encrypt = (buffer) => {
            let key = 'MySecretKey';
            key = crypto.createHash('sha256').update(String(key)).digest('base64').substring(0, 32);
            const iv = crypto.randomBytes(16);
            //console.log(iv);
            const cipher = crypto.createCipheriv(algorithm, key, iv);
            const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
            let viPath = outputPath + '/vectInit';
            
            fs.writeFileSync(viPath, iv);
            console.log("vi created")

            let keyPath = outputPath + '/secretKey.key';
            fs.writeFileSync(keyPath, key);
            console.log("key created")

            return result;
        }

        fs.readFile(pathFile2Ecrypt, (err, file) => {
            if (err) return console.error(err.message);
            try {
                if (!fs.existsSync(outputPath)) {
                    fs.mkdirSync(outputPath);
                }
            } catch (err) {
                console.error(err);
            }
            let encriptPath = outputPath + '/encryptedFile';
            const encryptedFile = encrypt(file);
            try {
                fs.writeFileSync(encriptPath, encryptedFile);
            } catch (err) {
                console.error(err);
            }
            console.log('Original file encrypted succesfully 100%');
            console.log('The Files are in: ' + outputPath);


        })
        return outfilePath = outputPath + '/encryptedFile';
    },
    //////////////////////////////////////////////////////////////////////
    //-----------------Funcion Split--------------------------------
    //////////////////////////////////////////////////////////////////////
    split: function (imagenPath, numMB, outputPath) {
        maxFileSize = 1024 * (numMB * 1000);
        // Crea el folder en caso de que no exista
        try {
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath);
            }
        } catch (err) {
            console.error(err);
        }
        outputPath = outputPath + "/part"; // nombra el prefijo de las partes
        Split = splitFileStream.getSplitWithGenFilePath((n) => `${outputPath}-${(n + 1)}`);
        Split(fs.createReadStream(imagenPath), maxFileSize, (error, filePaths) => {
            if (error) throw error;
            console.log("This is an array of new files ecnrypted:", filePaths);
        })

    },
    //////////////////////////////////////////////////////////////////////
    //-----------------Funcion Join--------------------------------
    //////////////////////////////////////////////////////////////////////
    join: function (inputPath, outputPath) {
        fs.readdir(inputPath, function (err, archivos) {
            if (err) {
                onError(err);
                return;
            }
            var fullPathPart = [];
            let filePaths = archivos;
            for (let x = 0; x < filePaths.length; x++) {
                fullPathPart.push(inputPath + '/' + filePaths[x])
            }
            outputPath = outputPath + "/joinFile.dcm";
            splitFileStream.mergeFilesToDisk(fullPathPart, outputPath, () => {
                console.log("Finished merging files");
            });


        });
    },
    //////////////////////////////////////////////////////////////////////
    //-----------------Funcion desencriptar--------------------------------
    //////////////////////////////////////////////////////////////////////
    desencriptar: function (File2Desencrypt, key, iv, outputPath) {
        fs.readFile(File2Desencrypt, (err, file) => {
            if (err) return console.error(err.message);
            if (file) {
                const decryptedFile = decrypt(file);
                outputPath = outputPath + '/decrypt_file.dcm';
                fs.writeFile(outputPath, decryptedFile, (err, file) => {
                    if (err) return console.error(err.message);
                    console.log('File dencrypted succesfully 100%');
                })
            }
        })
        const decrypt = (encrypted) => {
            // const iv = encrypted.slice(0, 16);
            const vi = fs.readFileSync(iv);
            // console.log(vi);
            const llave = fs.readFileSync(key);
            // console.log(llave);
            encrypted = encrypted.slice(16);
            const decipher = crypto.createDecipheriv(algorithm, llave, vi);
            const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
            return result;
        }
    }

};

