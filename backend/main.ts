import { app, BrowserWindow } from "electron";
import * as path from "path";

export let mainWindow: Electron.BrowserWindow | null;
const root = path.join(__dirname, "../../");

export function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      plugins: true,
      nodeIntegration: true
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(root, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.maximize();

  // @if NODE_ENV != 'production' **
  if (process.env.ECON === "true") {
    const client = require("electron-connect").client;
    client.create(mainWindow);
  }
  // @endif */
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

const pathToPepFlashPlayer = process.env.NODE_ENV === "development"
  ? path.join(__dirname, "../../../")
  : path.dirname(app.getPath("exe"));
const pepPlayerFullPath = path.join(pathToPepFlashPlayer, "build/assets", 'pepflashplayer.dll');
 
app.commandLine.appendSwitch('ppapi-flash-path', pepPlayerFullPath);
app.commandLine.appendSwitch('ppapi-flash-version', '18.0.0.203');
