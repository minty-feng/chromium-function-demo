const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const isDev = process.argv.includes('--dev');

// 处理 macOS 安全编码警告和 GPU 错误
if (process.platform === 'darwin') {
  // 设置环境变量来抑制警告
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
  process.env.ELECTRON_NO_ATTACH_CONSOLE = 'true';
  
  // 添加命令行参数来抑制警告和错误
  app.commandLine.appendSwitch('--disable-features', 'VizDisplayCompositor');
  app.commandLine.appendSwitch('--disable-gpu-sandbox');
  app.commandLine.appendSwitch('--no-sandbox');
  app.commandLine.appendSwitch('--disable-software-rasterizer');
  app.commandLine.appendSwitch('--disable-gpu-process-crash-limit');
  
  // 重写 applicationSupportsSecureRestorableState 方法
  Object.defineProperty(app, 'applicationSupportsSecureRestorableState', {
    get: () => true,
    configurable: true
  });
  
  // 在应用准备就绪时再次设置
  app.on('ready', () => {
    try {
      if (typeof app.applicationSupportsSecureRestorableState === 'function') {
        app.applicationSupportsSecureRestorableState = () => true;
      }
    } catch (error) {
      // 忽略错误
    }
  });
} else {
  // 非 macOS 系统的 GPU 错误处理
  app.commandLine.appendSwitch('--disable-gpu-sandbox');
  app.commandLine.appendSwitch('--disable-software-rasterizer');
  app.commandLine.appendSwitch('--disable-gpu-process-crash-limit');
}

// 处理网络服务错误
app.commandLine.appendSwitch('--disable-features', 'NetworkService,NetworkServiceLogging');

// 禁用安全警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

// 全局错误处理
function handleError(error, context = '') {
  if (isDev) {
    console.error(`Error in ${context}:`, error);
  }
}

// 保持对窗口对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，窗口会被自动地关闭
let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false
  });

  // 加载应用的 index.html
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  // 当窗口准备好显示时显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus(); // 确保窗口获得焦点
    
    // 开发模式下打开开发者工具
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // 处理渲染进程崩溃
  mainWindow.webContents.on('crashed', (event, killed) => {
    console.error('Renderer process crashed:', { killed });
    if (!killed) {
      mainWindow.reload();
    }
  });

  // 处理未捕获的异常
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page failed to load:', errorCode, errorDescription);
  });

  // 当窗口被关闭时发出
  mainWindow.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    mainWindow = null;
  });

  // 设置菜单
  createMenu();
}

// 创建应用菜单
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建配置文件',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-profile');
          }
        },
        {
          label: '导入配置文件',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'JSON Files', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            if (!result.canceled) {
              mainWindow.webContents.send('import-profile', result.filePaths[0]);
            }
          }
        },
        {
          label: '导出配置文件',
          accelerator: 'CmdOrCtrl+S',
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              filters: [
                { name: 'JSON Files', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            if (!result.canceled) {
              mainWindow.webContents.send('export-profile', result.filePath);
            }
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectall', label: '全选' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '切换开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于',
              message: 'AdsPower Clone',
              detail: '版本 1.0.0\n一个指纹浏览器管理工具'
            });
          }
        },
        {
          label: '查看帮助',
          click: () => {
            shell.openExternal('https://github.com/your-repo/ads-power-clone');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  // 处理 macOS 安全编码警告
  if (process.platform === 'darwin') {
    try {
      // 尝试设置安全编码支持
      if (typeof app.applicationSupportsSecureRestorableState === 'function') {
        app.applicationSupportsSecureRestorableState = () => true;
      }
      // 或者尝试直接设置属性
      if (app.applicationSupportsSecureRestorableState !== undefined) {
        app.applicationSupportsSecureRestorableState = true;
      }
    } catch (error) {
      // 忽略错误
    }
  }

  // 添加错误处理
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  createWindow();
});

// 当所有窗口都被关闭时退出
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC 事件处理
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-name', () => {
  return app.getName();
});

// 处理浏览器启动
ipcMain.handle('launch-browser', async (event, profileData) => {
  try {
    // 这里可以添加启动浏览器的逻辑
    if (isDev) {
      console.log('Launching browser with profile:', profileData.name || profileData.id);
    }
    return { success: true, message: 'Browser launched successfully' };
  } catch (error) {
    console.error('Browser launch error:', error.message);
    return { success: false, message: error.message };
  }
});

// 处理配置文件保存
ipcMain.handle('save-profile', async (event, profileData) => {
  try {
    // 这里可以添加保存配置文件的逻辑
    console.log('Saving profile:', profileData);
    return { success: true, message: 'Profile saved successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// 处理配置文件删除
ipcMain.handle('delete-profile', async (event, profileId) => {
  try {
    // 这里可以添加删除配置文件的逻辑
    console.log('Deleting profile:', profileId);
    return { success: true, message: 'Profile deleted successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// 处理设置获取
ipcMain.handle('get-settings', async (event) => {
  try {
    // 这里可以添加获取设置的逻辑
    const defaultSettings = {
      defaultBrowserPath: '',
      autoStart: false,
      proxyType: 'none',
      proxyHost: '',
      proxyPort: '',
      proxyUsername: '',
      proxyPassword: '',
      theme: 'light',
      language: 'zh-CN'
    };
    return { success: true, settings: defaultSettings };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// 处理设置保存
ipcMain.handle('save-settings', async (event, settings) => {
  try {
    // 这里可以添加保存设置的逻辑
    console.log('Saving settings:', settings);
    return { success: true, message: 'Settings saved successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// 处理浏览器状态获取
ipcMain.handle('get-browser-status', async (event) => {
  try {
    // 这里可以添加获取浏览器状态的逻辑
    const browsers = [];
    return { success: true, browsers };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// 处理浏览器刷新
ipcMain.handle('refresh-browser', async (event, browserId) => {
  try {
    // 这里可以添加刷新浏览器的逻辑
    console.log('Refreshing browser:', browserId);
    return { success: true, message: 'Browser refreshed successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
