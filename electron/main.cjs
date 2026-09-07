const { app, BrowserWindow, shell } = require("electron");

// Kernel desktop: a native shell around the hosted Kernel app, so chats,
// connectors and skills stay in sync with the web version.
const APP_URL = process.env.KERNEL_APP_URL || "https://kernel.lovable.app/chat";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 480,
    minHeight: 520,
    title: "Kernel",
    backgroundColor: "#F6F3EC",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(APP_URL);

  // External links open in the user's browser, not inside the app shell.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(new URL(APP_URL).origin)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
