const { contextBridge, ipcRenderer } = require("electron");
const { encryptFile } = require("../backend/encryptFile.js");
const { decryptFile } = require("../backend/decryptFile.js");
const { sendNotification } = require("../backend/sendNotification.js");
const fs = require("fs");

contextBridge.exposeInMainWorld("encryptFile", encryptFile);
contextBridge.exposeInMainWorld("decryptFile", decryptFile);
contextBridge.exposeInMainWorld("sendNotification", sendNotification);
let saveData = (fname, fpath) => {
  let data = { fname, fpath};
  
  ipcRenderer.send("save-data", data);
};

let bridge = {
  saveData,
};
contextBridge.exposeInMainWorld("Bridge", bridge);
contextBridge.exposeInMainWorld("unlinkSync", {
  unlinkSync: (path) => fs.unlinkSync(path),
});