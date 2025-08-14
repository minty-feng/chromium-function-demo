const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false,
            allowRunningInsecureContent: true
        },
        icon: path.join(__dirname, '../assets/icon.svg'),
        show: false,
        // macOS specific options to suppress warnings
        titleBarStyle: 'default',
        vibrancy: 'under-window',
        // Additional options to reduce warnings
        autoHideMenuBar: true,
        skipTaskbar: false
    });

    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// macOS specific settings to reduce warnings
if (process.platform === 'darwin') {
    // Set process flags to reduce macOS warnings
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
    process.env.ELECTRON_ENABLE_SECURE_RESTORABLE_STATE = 'true';
}

// Suppress various warnings
app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('no-sandbox');

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC handlers for data management
ipcMain.handle('get-profiles', () => {
    return store.get('profiles', []);
});

ipcMain.handle('save-profile', (event, profile) => {
    const profiles = store.get('profiles', []);
    const existingIndex = profiles.findIndex(p => p.id === profile.id);
    
    if (existingIndex >= 0) {
        profiles[existingIndex] = profile;
    } else {
        profiles.push({ ...profile, id: Date.now().toString() });
    }
    
    store.set('profiles', profiles);
    return profiles;
});

ipcMain.handle('delete-profile', (event, profileId) => {
    const profiles = store.get('profiles', []);
    const filteredProfiles = profiles.filter(p => p.id !== profileId);
    store.set('profiles', filteredProfiles);
    return filteredProfiles;
});

ipcMain.handle('get-browsers', () => {
    return store.get('browsers', []);
});

ipcMain.handle('save-browser', (event, browser) => {
    const browsers = store.get('browsers', []);
    const existingIndex = browsers.findIndex(b => b.id === browser.id);
    
    if (existingIndex >= 0) {
        browsers[existingIndex] = browser;
    } else {
        browsers.push({ ...browser, id: Date.now().toString() });
    }
    
    store.set('browsers', browsers);
    return browsers;
});

ipcMain.handle('get-groups', () => {
    return store.get('groups', []);
});

ipcMain.handle('save-group', (event, group) => {
    const groups = store.get('groups', []);
    const existingIndex = groups.findIndex(g => g.id === group.id);
    
    if (existingIndex >= 0) {
        groups[existingIndex] = group;
    } else {
        groups.push({ ...group, id: Date.now().toString() });
    }
    
    store.set('groups', groups);
    return groups;
});

ipcMain.handle('get-settings', () => {
    return store.get('settings', {});
});

ipcMain.handle('save-settings', (event, settings) => {
    store.set('settings', settings);
    return settings;
});
