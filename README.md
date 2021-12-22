# VideoConverter
## Overview
![screenshot](/src/assets/ScreenShot01.png)

## Project Setup
```
yarn install
# or
npm install
```

## Compiles for Development
```
yarn electron:serve
# or
npm run electron:serve
```

## Build This Project
```
yarn electron:build
# or
npm run electron:build
```

## Files System Tree
```
videoConverter
├── README.md
├── babel.config.js
├── jsconfig.json
├── package-lock.json
├── package.json
├── public                          
│   ├── Encoders.json                   // Encoders Info
│   ├── Guidance.json                   // Parameter Guidance
│   ├── assets
│   │   ├── file-music-fill.svg
│   │   └── film.svg
│   ├── favicon.ico
│   └── index.html                      // Main Page
├── src
│   ├── App.vue                         // Main Component App
│   ├── assets
│   │   ├── file-music-fill.svg
│   │   ├── film.svg
│   │   └── logo.png
│   ├── background.js                   // Electron Start Up
│   ├── components                      
│   │   ├── LowerCodeArea.vue           // Component Parameter Input
│   │   ├── LowerCodeDisplay.vue        // Component Result Display
│   │   ├── UpperLeftGuide.vue          // Component Guidance
│   │   ├── UpperLeftNewProject.vue     // Component New Project Dialog
│   │   ├── UpperLeftProjects.vue       // Component Projects
│   │   ├── UpperRightParams.vue        // Component Parameter Candidates
│   │   ├── UpperRightSelect.vue        // Component Selected Params
│   │   └── UpperRightSelectList.vue    // Component Stream Params List
│   ├── data
│   │   ├── paraFetch.py                // FFmpeg Guidance Handler
│   │   └── x265Params.json
│   ├── main.js                         // Vue Start Up
│   ├── menu.js                         // Application Menu
│   └── store                           // Vuex Data
│       ├── index.js
│       └── indexData.js
├── vue.config.js
└── yarn.lock

```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
