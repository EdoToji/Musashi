const { app, BrowserWindow, Menu, shell, ipcMain, dialog} = require("electron");
const path = require("path");
const fs = require('fs');
const ElectronStore = require('electron-store');
ElectronStore.initRenderer();
//const { desktopNotificationSettings, saveDesktopNotificationSettings } = require("./app/backend/notificationSettings.js");

//let notification = desktopNotificationSettings();
//let scramble = scrambleFileNameSettings();

const isMac = process.platform === "darwin";
const isDev = false;  // Set to true for DevTools

if(process.platform === "win32") {
    app.setAppUserModelId(app.name);
  }

const loadMainWindow = () => {
    const mainWindow = new BrowserWindow({
        title: "Musashi",
        width : 1400,
        height: 900,
        minWidth: 1400,
        minHeight: 900,
        webPreferences: {
            contextIsolation: false,
            preload: path.join(__dirname, "../../app/electron/preload.js"),
            nodeIntegration: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, "../../../musashi-app/index.html"));
}

app.on("ready", loadMainWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        loadMainWindow();
    }
});
ipcMain.on("save-data", (data) => {
  let sData = JSON.parse(JSON.stringify(data));
  fs.appendFileSync("../src/js/fileStorage.json", sData);
  console.log("Data Saved");
});

