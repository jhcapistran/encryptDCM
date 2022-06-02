const md = require('./moduleEncryptSplit');
imagePath = 'test3.dcm';
async function main(){
    let outfilePath = md.encriptar(imagePath, './fileEncrypt')
    await md.split(outfilePath, 1, './particiones');
    await md.join('./particiones', './');
    await md.desencriptar('joinFile.dcm', 'fileEncrypt/secretKey.key', 'fileEncrypt/vectInit', './');
}
main();

