const { app, BrowserWindow, ipcMain, net } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;
let loadingWindow;

// 网络检测函数
function checkNetworkConnection() {
    return new Promise((resolve) => {
        const request = net.request({
            method: 'HEAD',
            url: 'https://www.google.com',
            timeout: 10000 // 增加到10秒超时
        });

        request.on('response', () => {
            resolve(true);
        });

        request.on('error', () => {
            resolve(false);
        });

        request.on('timeout', () => {
            resolve(false);
        });

        request.end();
    });
}

// 创建 loading 窗口
function createLoadingWindow() {
    loadingWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: true, // 保持与主窗口一致的边框
        resizable: true, // 允许调整大小
        alwaysOnTop: false, // 不置顶，避免遮挡
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false,
        icon: path.join(__dirname, '../assets/icon.png') // 保持一致的图标
    });

    loadingWindow.loadFile(path.join(__dirname, 'renderer/loading.html'));

    loadingWindow.once('ready-to-show', () => {
        loadingWindow.show();
    });

    return loadingWindow;
}

// 创建主窗口
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        icon: path.join(__dirname, '../assets/icon.png'),
        show: false
    });

    // 加载远程 URL 或本地文件
    const targetUrl = process.env.ELECTRON_URL || 'file://' + path.join(__dirname, 'renderer/index.html');
    
    mainWindow.loadURL(targetUrl).then(() => {
        console.log('Main app loaded successfully');
    }).catch((error) => {
        console.error('Failed to load main app:', error);
        // 如果加载失败，显示错误信息
        mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // 关闭 loading 窗口
        if (loadingWindow) {
            loadingWindow.close();
            loadingWindow = null;
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 带网络检测的窗口创建
async function createWindow() {
    // 先显示 loading 窗口
    createLoadingWindow();
    
    try {
        // 检测网络连接
        const isOnline = await checkNetworkConnection();
        
        if (isOnline) {
            console.log('Network connection detected');
            // 网络正常，直接创建主窗口
            setTimeout(() => {
                createMainWindow();
            }, 3000); // 给用户更多时间看到 loading 页面
        } else {
            console.log('No network connection, showing offline mode');
            // 网络异常，显示错误信息
            if (loadingWindow) {
                loadingWindow.webContents.executeJavaScript(`
                    document.getElementById('loadingText').textContent = '网络连接失败';
                    document.getElementById('loadingSubtitle').textContent = '正在尝试离线模式...';
                    document.getElementById('networkStatus').textContent = '离线模式';
                    document.getElementById('retryBtn').disabled = false;
                `);
            }
            
            // 延迟后仍然尝试加载主应用（可能是本地模式）
            setTimeout(() => {
                createMainWindow();
            }, 8000); // 更长的等待时间
        }
    } catch (error) {
        console.error('Network check failed:', error);
        // 网络检测失败，仍然尝试加载主应用
        setTimeout(() => {
            createMainWindow();
        }, 5000); // 更长的等待时间
    }
}

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

// IPC handlers for loading page
ipcMain.handle('retry-connection', async () => {
    try {
        const isOnline = await checkNetworkConnection();
        if (isOnline) {
            createMainWindow();
            return { success: true, message: '连接成功' };
        } else {
            return { success: false, message: '网络连接失败' };
        }
    } catch (error) {
        return { success: false, message: '连接检测失败' };
    }
});

ipcMain.handle('check-network', async () => {
    try {
        const isOnline = await checkNetworkConnection();
        return { online: isOnline };
    } catch (error) {
        return { online: false };
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
