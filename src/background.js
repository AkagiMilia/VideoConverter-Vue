'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { exec } from 'child_process'
import path from 'path'
const fs = require('fs')

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1024,
    height: 1024,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  require('./menu.js')
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    console.log(process.env.WEBPACK_DEV_SERVER_URL)
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()

  // send back System Info
  ipcMain.on('requireSystemInfo',(event)=>{
    const currentSystem = process.platform
    const isMac = currentSystem === 'darwin'
    const savePath = path.join(__static, 'data/savedProject.json')
    var ffPaths = {}
    var finished = 0
    if (isMac){
      if (isDevelopment)
        process.env.PATH = process.env.PATH + `:/usr/local/bin`
      else
        process.env.PATH = process.env.PATH + `:/usr/local/bin:/opt/homebrew/bin/`
      console.log(process.env);
      for (let program of ['ffmpeg', 'ffprobe', 'ffplay']){
        exec(`which ${program}`, {shell:'/bin/zsh'}, (error, stdout, stderr)=>{
          if (error){
            console.log(error)
            event.reply('ffpmegError', error.toString(), process.env)
          }
          if (stdout){
            console.log('Result:', stdout)
            ffPaths[program] = stdout.replaceAll(/[^\S]/g,'')
          }
          if (stderr)
            console.log('ResultError:', stderr)
          finished += 1
          if (finished >= 3){
            console.log('ffPaths:', ffPaths);
            event.reply('getSystemInfo', currentSystem, isMac, ffPaths)
          }
        })
      }
    }
    else{
      for (let program of ['ffmpeg', 'ffprobe', 'ffplay']){
        exec(`${program} -h`, (error, stdout, stderr)=>{
          if (error){
            console.log(error)
            event.reply('ffpmegError', error.toString(), process.env)
          }
          if (stdout){
            console.log('Result:')
            ffPaths[program] = program
          }
          if (stderr)
            console.log('ResultError:')
          finished += 1
          if (finished >= 3){
            console.log('ffPaths:', ffPaths);
            event.reply('getSystemInfo', currentSystem, isMac, ffPaths)
          }
        })
      }
    } 
  })

  // waiting message from Vue
  // open dialog 'save file'
  ipcMain.on('OpenFolder', (event, defaultPath, sender)=>{
    dialog.showSaveDialog({
      title:'save file',
      defaultPath
    }).then(result=>{
      if (sender == 'Project')
        event.reply('fileAddressProject', result.filePath)
      else if (sender == 'newProject')
        event.reply('fileAddressNewProject', result.filePath)
    })
  })


  ipcMain.on('saveProjects', (event, projects)=>{
    fs.writeFile(path.join(__static, 'data/savedProject.json'), JSON.stringify(projects, null, 2), (err)=>{
      console.log('Saved');
    })
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
