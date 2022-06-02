


//
const crypto = require('crypto');
const fs = require('fs');
const splitFileStream = require("split-file-stream");
const algorithm = 'aes-256-ctr';
path = require('path');
//

module.exports = {
    //////////////////////////////////////////////////////////////////////
    //-----------------Funcion Encriptar--------------------------------
    //////////////////////////////////////////////////////////////////////
    encriptar: function (pathFile2Ecrypt, outputPath) {
        const encrypt = (buffer) => new Promise((resolve, reject) => {
            console.log("Encrypting..........")
            let key = 'MySecretKey';
            key = crypto.createHash('sha256').update(String(key)).digest('base64').substring(0, 32);
            const iv = crypto.randomBytes(16);
            //console.log(iv);
            const cipher = crypto.createCipheriv(algorithm, key, iv);
            const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
            let encriptPath = outputPath + '/encryptedFile';
            resolve(fs.writeFileSync(encriptPath, result));
            // } catch (err) {
            //     console.error(err);
            // }
            console.log('Original file encrypted succesfully 100%');

            let viPath = outputPath + '/vectInit';
            fs.writeFileSync(viPath, iv);
            console.log("vi created")

            let keyPath = outputPath + '/secretKey.key';
            fs.writeFileSync(keyPath, key);
            console.log("key created");

            console.log('The Files are in: ' + outputPath);

        });


        file = fs.readFileSync(pathFile2Ecrypt);
        try {
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath);
            }
        } catch (err) {
            console.error(err);
        }

        encrypt(file)
        return outfilePath = outputPath + '/encryptedFile';
    },
    //////////////////////////////////////////////////////////////////////
    //-----------------Funcion Split--------------------------------
    //////////////////////////////////////////////////////////////////////
    split: async function (imagenPath, numMB, outputPath) {
        maxFileSize = 1024 * (numMB * 1000);
        // Crea el folder en caso de que no exista
        try {
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath);
            }
        } catch (err) {
            console.error(err);
        }
        let PathParts = outputPath + "/part"; // nombra el prefijo de las partes
        file2split = fs.readFileSync(imagenPath);
        let len = file2split.length;
        let numPart = Math.ceil(len / maxFileSize);
        await splitAwait(len);

        async function splitAwait(len) {
            console.log("Beginning splitting files....... ")
            var customSplit = splitFileStream.getSplitWithGenFilePath((n) => `${PathParts}-${(n + 1)}`);
            customSplit(fs.createReadStream(imagenPath), maxFileSize, (error, filePaths) => {
                if (error) throw error;
                console.log("The split parts are in", filePaths);
                // let response = await Promise.all(responsePromise);
            });
            
            fs.existsSync(outputPath)
            fileCountSplit = fs.readdirSync(outputPath);
            while (fileCountSplit.length < numPart) {
                await sleep(1);
                fileCountSplit = fs.readdirSync(outputPath);
            }
            let fullPath, totalSize = 0;
            while (totalSize < len) {
                fileCountSplit.forEach(file => {
                    fullPath = path.join(outputPath, file);
                    size = fs.statSync(fullPath).size; // Get size of file
                    totalSize += size; // Calculate total size
                });
                await sleep(1);
            }
         
        }
        console.log("Finished spliting files....... ");

    },
    //////////////////////////////////////////////////////////////////////
    //-----------------Funcion Join--------------------------------
    //////////////////////////////////////////////////////////////////////
    join: async function (inputPath, outputPath) {
        console.log("Merging files.............")
        let filePaths = fs.readdirSync(inputPath);
        var fullPathPart = [];
        var temp = [];
        let fullSize = 0;
        for (let x = 0; x < filePaths.length; x++) {
            fullPathPart.push(inputPath + '/' + filePaths[x])
            temp = fs.readFileSync(fullPathPart[x]);
            fullSize += temp.length;
        }
        let pathSplit = outputPath + "joinFile.dcm";
       await merge();

        async function merge() {
            splitFileStream.mergeFilesToDisk(fullPathPart, pathSplit, () => { });

            
            while (!fs.existsSync(pathSplit)) {
                await sleep(1);                
            }
            fileMerge = fs.readFileSync(pathSplit);
            while (fileMerge.length < fullSize) {
                fileMerge = fs.readFileSync(pathSplit);
                await sleep(1);
            }
            console.log("Finished merging files........")
        }
    },
    //////////////////////////////////////////////////////////////////////
    //-----------------Funcion desencriptar--------------------------------
    //////////////////////////////////////////////////////////////////////
    desencriptar: async function (File2Desencrypt, key, iv, outputPath) {
        const decrypt = async (encrypted) => {
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
        try {
            file = fs.readFileSync(File2Desencrypt);
            // while(file.length==0){
            //     // console.log("File is empty!")
            // }
        }
        catch (err) {
            console.error(err);
        }
        console.log("Decrypting.............")
        const decryptedFile = await decrypt(file);
        outputPath = outputPath + '/decrypt_file.dcm';
        try {
            fs.writeFileSync(outputPath, decryptedFile);
            console.log('File dencrypted succesfully 100%');
        }
        catch (err) {
            console.error(err);
        }

    }

};


function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

// Hay dos tipos de nstrucciones=> 
// 1) Instruccion instantanea-> Son sincronas (suma, mover valores de variables, operaciones, manejo de objetos...)
// 2) Instrucciones de entrada/salida-> Son asincronas (Son todas aquella que no solo necesitan RAM y Procesador, e.g. leer archivos, hacer peticiones webkitURL, guardar archivos, comunicaciones con perifericos etc...)

// Realizar todas las funcionalidad de manera SINCRONA
// -> Promesas, funciones asncronas y await