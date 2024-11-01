const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 941,
    minHeight: 600,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    simpleFullscreen: true,
    fullscreenable: true,
    webPreferences: {
      // You can add other configurations here:
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarOverlay: {
      
      color: '#0d1f2d',
      symbolColor: '#ffffff',
      padding: 10,
      height: 50,
    },
  });

  mainWindow.maximize();
  mainWindow.show();

  // Remove Menu Bar
  //mainWindow.removeMenu();

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Optional: Open the DevTools (can be removed for production).
  mainWindow.webContents.openDevTools();
};

// Called when Electron has finished initialization.
app.whenReady().then(() => {
  createWindow();

  // On macOS, re-create a window when the dock icon is clicked and no other windows are open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Load comments from JSON file
function loadComments() {
  const filePath = path.join(__dirname, 'comments.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath));
  }
  return [];
}

// Save comments to JSON file
function saveComments(comments) {
  const filePath = path.join(__dirname, 'comments.json');
  fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));
}

// Handle comment addition
ipcMain.handle('add-comment', (event, commentText) => {
  const comments = loadComments();
  const newComment = { id: Date.now(), text: commentText };
  comments.push(newComment);
  saveComments(comments);
  return comments;
});

// Handle comment deletion
ipcMain.handle('delete-comment', (event, commentId) => {
  let comments = loadComments();
  comments = comments.filter(comment => comment.id !== commentId);
  saveComments(comments);
  return comments;
});

// Load comments on startup
ipcMain.handle('load-comments', () => {
  return loadComments();
});
