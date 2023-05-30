//const path = require("path");
//const fs = require("fs");
//const { pipeline } = require("stream/promises");
//const { Transform } = require("stream");
//const { app } = require("./encryption.js");
//const { encHighWaterMark } = require("./encryptFile.js");
//const { railfence } = require("./railfenceCipher.js");
//const { scramble } = require("../electron/settings.js");
//const nodeCrypto = require("crypto");
//const { Buffer } = require("buffer");

  function decrypt(data,password){
    try {
      const iterationCount = 2 ** 14;
      const salt = data.subarray(0, 16);
      const authTag = data.subarray(16, 32);
      const encData = data.subarray(32, data.length);
      const key = nodeCrypto.scryptSync(password, salt, 32, { N: iterationCount });
      const decipher = nodeCrypto.createDecipheriv("aes-256-gcm", key, salt);
      decipher.setAuthTag(authTag);
      const plainText = Buffer.concat([
        decipher.update(encData),
        decipher.final(),
      ]);
      return plainText;
    } catch (e) {
      return true;
    }
  }
  

  function decFile(){
    //const encHighWaterMark = 1024 * 1024 * 100;
    //const decHighWatermark = encHighWaterMark + 32;
    encFileLocation = document.getElementById('fileDec').files[0].path;
    password = document.getElementById('passwordDec').value;
    // const fileReadStream = fs.createReadStream(encFileLocation, {
    //   highWaterMark: decHighWatermark,
    // });

    const filePath = path.parse(encFileLocation).dir;
    const fileExt = path.parse(encFileLocation).ext;
    let fileName = path.parse(encFileLocation).name;

    if (fileName.includes("__ENC")) {
      fileName = fileName.split("__ENC").slice(0, -1).join("__ENC");
    } else {
      fileName = fileName + "__DEC";
    }

    const newDecFile = filePath + "\\" + fileName + fileExt;
    //const fileWriteStream = fs.createWriteStream(newDecFile);

    try {
      const data = fs.readFileSync(encFileLocation);
      console.log("\n\n\n\n"+encFileLocation);
      const decBuffer = this.decrypt(data,password);
      fs.writeFileSync(newDecFile,decBuffer);
      fs.unlinkSync(encFileLocation);
    } catch (err) {
      throw err;
    }
  }

//module.exports.decryptFile = decryptFile;