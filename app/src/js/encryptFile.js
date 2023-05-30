const path = require("path");
//const fs = require("fs");
//const { pipeline } = require("stream/promises");
//const { Transform } = require("stream");
const nodeCrypto = require("crypto");
const { Buffer } = require("buffer");
//const { app } = require("./encryption.js");
//const { railfence } = require("./railfenceCipher.js");

  function encrypt(data, password){   
    const iterationCount = 2 ** 14;
    const salt = nodeCrypto.randomBytes(16);
    const key = nodeCrypto.scryptSync(password, salt, 32, { N: iterationCount });
    const cipher = nodeCrypto.createCipheriv("aes-256-gcm", key, salt);
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([salt, authTag, encryptedData]);
  }

  function encFile(){
    const encHighWaterMark = 1024 * 1024 * 100;
    fileLocation = document.getElementById('fileEnc').files[0].path;
    password = document.getElementById('password').value;
    const fileReadStream = fs.createReadStream(fileLocation, {
      highWaterMark: encHighWaterMark,
    });

    const filePath = path.parse(fileLocation).dir;
    const fileExt = path.parse(fileLocation).ext;
    let fileName = path.parse(fileLocation).name;
    let newEncFile;
    
    newEncFile = filePath + "\\" + fileName + "__ENC" + fileExt;

    console.log("\n\n\n"+fileReadStream);

    //NEED TO FIX THIS AND REDO IT
    const data = fs.readFileSync(fileLocation);
    //const fileWriteStream = fs.readFileSync(newEncFile);
    const encryptedData = this.encrypt(data, password);
    fs.writeFileSync(newEncFile,encryptedData);
    fs.unlinkSync(fileLocation);
    //END OF WHAT NEEDS TO BE FIXED

    // try{
    //   pipeline(
    //     fileReadStream,
    //     new Transform({
    //       transform(chunk, encoding, callback) {
    //         const encryptedData = this.encrypt(chunk, password);
    //         callback(null, encryptedData);
    //       },
    //     }),
    //     fileWriteStream
    //   );
    // }
    // catch(err){
    //   console.log("\n\n\n"+"Yikees"+"\n\n\n");
    //   throw err;
    // }

  }

//module.exports.encryptFile = encryptFile;
//module.exports.encHighWaterMark = encHighWaterMark;
