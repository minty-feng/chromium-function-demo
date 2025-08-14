const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false
    });

    mainWindow.loadFile(path.join(__dirname, 'src/renderer/index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        console.log('✅ React 18 应用启动成功！');
        console.log('📱 应用窗口已显示');
        console.log('🔧 检查以下功能：');
        console.log('   - 顶部导航栏是否显示');
        console.log('   - 左侧边栏是否显示');
        console.log('   - 配置文件标签页是否显示');
        console.log('   - 新建配置按钮是否可点击');
        
        // 5秒后自动关闭应用
        setTimeout(() => {
            console.log('⏰ 测试完成，应用将在3秒后关闭...');
            setTimeout(() => {
                app.quit();
            }, 3000);
        }, 5000);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
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
