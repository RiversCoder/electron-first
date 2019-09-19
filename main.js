const electron = require('electron');
const url = require('url');
const path  = require('path');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

// listen for app to be a ready
app.on('ready', function(){
  // create a new window
  mainWindow = new BrowserWindow({});
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
    width:300, height: 200, title: 'add book list item'
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
    label: 'File',
    //顶部菜单的子菜单列表
    submenu: [
      { label: 'Add Item',
        click: () => { // 点击打开新的添加内容窗口
          createNewWindow()
        }
      },
      { label: 'Clear Item' },
      { label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',  // 区分 windows 和 mac os 平台关闭软件
        click: () => { // 点击窗口关闭
          app.quit();
        }
      },
    ]
  }
]
