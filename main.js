// 参考文档：wwww.christianengvall.se/electron-packager-tutorial/
// https://www.christianengvall.se/electron-packager-tutorial/
// http://www.iconarchive.com/show/real-vista-business-icons-by-iconshock/shopping-cart-icon.html

const electron = require('electron');
const url = require('url');
const path  = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

// 设置当前环境
process.env.NODE_ENV = 'development' // production

let mainWindow;
let addWindow;

// listen for app to be a ready
app.on('ready', function(){
  // create a new window
  mainWindow = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true
    }
  });
  // load html file into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./html/mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // 点击主窗口的关闭按钮
  mainWindow.on('closed',() => {
    app.quit()
  })

  //build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // install emnu
  Menu.setApplicationMenu(mainMenu);
});

// create a new add window
function createNewWindow(){

  // 新建有固定宽高的窗口
  addWindow = new BrowserWindow({
    width:600, height: 300, title: 'add book list item',
    webPreferences: {
        nodeIntegration: true
    }
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./html/addWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // garbage collection handle
  addWindow.on('closed',() => {
    addWindow = null;
  });

}

// Create menu template
const mainMenuTemplate = [
  {
    //顶部菜单的名称
    label: '文件',
    //顶部菜单的子菜单列表
    submenu: [
      { label: '新增小说',
        click: () => { // 点击打开新的添加内容窗口
          createNewWindow()
        }
      },
      { label: '清理小说' ,
        click: () => {
          mainWindow.webContents.send('book:clear');
        }
      },
      { label: '退出',
        accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',  // 区分 windows 和 mac os 平台关闭软件
        click: () => { // 点击窗口关闭
          app.quit();
        }
      },
    ]
  }
]

// 开发环境 和 线上环境区分
function checkEnvAndPlatform(){
  // mac os 下新增空顶部菜单项 达到显示的目的
  if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({})
  }

  // 验证当前处于开发环境或者处于测试环境 打开开发者工具
  if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
      label: '开发者工具',
      submenu: [
        { label: '打开/关闭',
          accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',  // 区分 windows 和 mac os 平台关闭软件
          click: (item, focusedWindow) => {
            focusedWindow.toggleDevTools();
          }
        },
        {
          label: '刷新', role: 'reload', accelerator: process.platform == 'darwin' ? 'Command+F5': 'Ctrl+F5',
        }
      ]
    })
  }
}
checkEnvAndPlatform();

// 监听窗口消息传递
ipcMain.on('book:add',(e, val) => {
  mainWindow.webContents.send('book:add',val);
  addWindow.close();
});
