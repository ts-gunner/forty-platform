const { app, BrowserWindow, globalShortcut, ipcMain,screen } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
let mainWindow;
const APP_ROOT = path.join(__dirname, '..')
const PUBLIC_PATH = path.join(APP_ROOT, "public")

const UMI_ENV = process.env.UMI_ENV
if (UMI_ENV) {
  dotenv.config({ path: path.join(APP_ROOT, ".env" + "." + UMI_ENV) })
} else {
  dotenv.config({ path: path.join(APP_ROOT, ".env") })
}
function createWindow() {
  mainWindow = new BrowserWindow({
    title: process.env.UMI_APP_PROJECT_TITLE,
    icon: path.join(PUBLIC_PATH, 'favicon.ico '),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },

    width: 1200,
    height: 900,
    // minHeight: 700,
    // minWidth: 1000,

    resizable: true,
    // 窗口外观
    frame: true,        // 是否显示边框和标题栏
    titleBarStyle: "default",
    opacity: 1,   // 窗口透明度
    fullscreenable: true, // 是否允许全屏
    hasShadow: true,    // 窗口是否有阴影(macOS)
    thickFrame: true,   // Windows无边框窗口使用WS_THICKFRAME样式, 拉伸缩小窗口
  })

  // ctrl + F12打开调试工具
  globalShortcut.register("Control+F12", () => {
    if (mainWindow) {
      mainWindow.webContents.toggleDevTools()
    }
  })

  if (process.env.UMI_APP_RUNTIME_ENV === 'development') {
    mainWindow.loadURL('http://127.0.0.1:8000');
  } else {
    mainWindow.loadFile(path.join(APP_ROOT, 'build/index.html'));
  }

  // // ipc通信
  // ipcMain.on("reset-window-size", () => {
  //   if (mainWindow.isMaximized()) {
  //     mainWindow.restore(); // 先退出最大化状态
  //   }
  //   const { width, height } = screen.getPrimaryDisplay().workAreaSize
  //   const windowWidth = 400 // 设置的窗口宽度
  //   mainWindow.setSize(windowWidth, height); // 设置默认大小
  //   mainWindow.setPosition(width - windowWidth, 0)  // 最右侧
    // 可选级别：
    // 'normal' - 默认
    // 'floating' - 浮动在其他窗口之上
    // 'torn-off-menu' - 在菜单栏下方
    // 'modal-panel' - 模态面板级别
    // 'main-menu' - 主菜单级别
    // 'status' - 状态栏级别
    // 'pop-up-menu' - 弹出菜单级别
    // 'screen-saver' - 屏幕保护程序级别
    // mainWindow.setAlwaysOnTop(true, "normal")
  // })

  // 监听窗口状态变化
  mainWindow.on('maximize', () => {
    mainWindow.setAlwaysOnTop(false)
  });
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    mainWindow = null
  }
})



app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)


app.on("will-quit", () => {
  globalShortcut.unregisterAll()
})