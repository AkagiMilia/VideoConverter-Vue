/*jslint es6 */
const { app, Menu, BrowserWindow} = require('electron')

const isMac = process.platform === 'darwin';
var shortCutQS = null;
// isMac ? shortCutQS='control+Q' : shortCutQS='crtl+Q';
const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      /* {
          label: 'Quick Convert',
          accelerator: shortCutQS,
          click: function ()
          {
              var winQuick = new BrowserWindow({
                  width: 1024,
                  height: 1024,
                  webPreferences:
                    {
                        nodeIntegration: true,
                        contextIsolation: false
                    }
              });

              winQuick.loadFile('../src/index.html')
              winQuick.on('closed', function (){
                  winQuick = null;
              });
          }
      }, */

      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  /*
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  */
  // { role: 'viewMenu' }
  {
    label: 'Dev',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { 
          label: 'Open Dev Tool',
          role: 'toggleDevTools' 
        }
      // { type: 'separator' },
      // { role: 'resetZoom' },
      // { role: 'zoomIn' },
      // { role: 'zoomOut' },
      // { type: 'separator' },
      // { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)