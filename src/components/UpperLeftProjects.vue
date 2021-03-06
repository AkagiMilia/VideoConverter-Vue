<template>
  <a-row class="border-bottom-0 border-end-0" :style="{height:localHeight+'px'}">
    <!-- New project dialog -->
    <UpperLeftNewProject 
      :newProjectVisible="newProjectVisible"
      :windowWidth="windowWidth"
      :ffPaths="ffPaths"
    />
    <!-- Pages of projects -->
    <a-tabs
      :activeKey="currentProjectId ? currentProjectId : 'empty'"
      type="editable-card"
      tab-position="left"
      @tabClick="switchProject"
      @edit="editProject"
      :style="{height:localHeight+'px'}"
      size="small"
    >

      <!-- Tab shows when no project -->
      <a-tab-pane 
        v-if="!projects.length"
        key="empty"
        class="me-3"
      >
        <a-button type="primary" @click="clickNewProject">
          <a-icon type="plus" class="align-middle mb-1"/>
          Add Project
        </a-button>
      </a-tab-pane>

      <!-- Project Tabs -->
      <a-tab-pane 
        v-for="(project, index) in projects" 
        :key="project.projectId" :tab="`${index+1}`"
        :closable="true"
        @click.stop="selectProject(project)"
        :id="project.projectId"
        class="me-3"
      >
        
        <!-- Process Drawer -->
        <a-drawer
          placement="right"
          :width="windowWidth*0.5 - 55"
          closable
          :mask="false"
          :visible="drawerVisible"
          :get-container="false"
          :wrap-style="{ position: 'absolute' }"
          @close="triggerDrawerVisible"
        >
          <span v-if="!isInProcess && !isShowResult" slot="title">Noting is Working</span>
          <span v-else-if="isInProcess && isShowResult" slot="title">Now Working On Project {{workState.workingProject}}</span>
          <span v-else slot="title">Result of Project {{workState.workingProject}}</span>
          <a-row type="flex" justify="center" align="middle" :style="{marginTop:localHeight*0.1 +'px'}">
            <a-empty class="mt-3" v-if="!isShowResult" :description="false"/>
            <a-row :gutter="48" v-if="isShowResult" style="width: 88%;">
              <a-col :span="7" class="border border-start-0 border-top-0 border-bottom-0">
                <p class="text-center m-0 text-nowrap"><strong>FRAMES</strong></p>
                <p class="text-center m-0 text-nowrap fs-5"><strong>{{workState.currentFrame}}</strong></p>
              </a-col>
              <a-col :span="10" class="border border-start-0 border-top-0 border-bottom-0">
                <p class="text-center m-0 text-nowrap"><strong>TIME</strong></p>
                <p class="text-center m-0 text-nowrap fs-5"><strong>{{workState.currentTime && workState.currentTime.startsWith('00:') ? workState.currentTime.replace('00:', '') : workState.currentTime}}</strong></p>
              </a-col>
              <a-col :span="7">
                <p class="text-center m-0 text-nowrap"><strong>SPEED</strong></p>
                <p class="text-center m-0 text-nowrap fs-5"><strong>{{workState.currentSpeed}}</strong></p>
              </a-col>
              
            </a-row>
          </a-row>
          <a-row v-if="isShowResult" class="mt-3">
            <a-progress :percent="+workState.workPercent.toFixed(1)" :status="workState.processState" />
          </a-row>
          <a-row type="flex" justify="center" align="middle" class="mt-3">
            <a-row :gutter="48" v-if="isShowResult" style="width: 88%;">
              <a-col :span="7" class="border border-start-0 border-top-0 border-bottom-0">
                <p class="text-center m-0 text-nowrap"><strong>BITRATE</strong></p>
                <p class="text-center m-0 text-nowrap fs-5"><strong>{{workState.currentRite.replace(/[a-z//]/g, '')}}</strong></p>
                <p class="text-center m-0 text-nowrap text-start"><strong>{{workState.currentRite.replace(/[0-9.]/g, '')}}</strong></p>
              </a-col>
              <a-col :span="5" class="border border-start-0 border-top-0 border-bottom-0">
                <p class="text-center m-0 text-nowrap"><strong>FPS</strong></p>
                <p class="text-center m-0 text-nowrap fs-5"><strong>{{workState.currentFPS}}</strong></p>
              </a-col>
              <a-col :span="5" >
                <p class="text-center m-0 text-nowrap"><strong>QUAL</strong></p>
                <p class="text-center m-0 text-nowrap fs-5"><strong>{{workState.currentQuality}}</strong></p>
              </a-col>
              <a-col :span="7" class="border border-end-0 border-top-0 border-bottom-0">
                <p class="text-center m-0 text-nowrap"><strong>SIZE</strong></p>
                <p class="text-center m-0 text-nowrap fs-5"><strong>{{workState.currentSize.replace(/[a-z A-Z]/g, '')}}</strong></p>
                <p class="text-center m-0 text-nowrap"><strong>{{workState.currentSize.replace(/[0-9.]/g, '')}}</strong></p>
              </a-col>
            </a-row>
          </a-row>
        </a-drawer>

        <!-- Add File & Add Project -->
        <a-row  type="flex" justify="space-between" class="mt-3">
          <a-space>
            <a-button :loading="isLoadFile" type="primary" @click="clickAddFile(project)">
              <a-icon v-show="!isLoadFile" type="plus" class="align-middle mb-1"/>
              File
            </a-button>
            <a-button type="primary" @click="clickNewProject">
              <a-icon type="plus" class="align-middle mb-1"/>
              Project
            </a-button>
          </a-space>
          <a-button type="primary" @click="triggerDrawerVisible">
            <a-icon type="menu-fold" class="align-middle mb-1"/>
            Convert Process
          </a-button>
        </a-row>
        
        
        <!-- Loaded Files -->
        <div 
          v-infinite-scroll="loadMore" 
          infinite-scroll-disabled="busy" 
          infinite-scroll-distance="10" 
          class="divFileCard mt-3" 
          :style="{height:localHeight-130+'px'}"
        > 
          <input 
            type="file" 
            placeholder="Basic usage" 
            style="display:none;" 
            :ref="`loadFor${project.projectId}`" 
            @change="addFile"
          />
          <a-collapse :defaultActiveKey="project.inputFiles.length ? project.inputFiles[0].fileId : null">
            <a-collapse-panel 
              v-for="file in project.inputFiles" 
              :key="file.fileId" 
              :header="file.fileName" style="width: 100%"
            >
              <a-icon 
                type="delete" 
                class="align-middle mb-1" 
                theme="twoTone" 
                two-tone-color="red"
                slot="extra"
                style="fontSize:20px"
                @click="removeFile(file.fileId)"
              />
              <a-space direction="vertical">
                <p>{{file.filePath}}</p>
                <a-row>
                  <a-checkbox 
                    v-for="(streamInfo, index) in file.streams" 
                    :key="index" 
                    :defaultChecked="streamInfo.used"
                    @change="onChangeMap(file.fileId, streamInfo.index, $event)">
                      {{index}}: {{streamInfo.codec_type}}, {{streamInfo.codec_name}}
                  </a-checkbox>
                </a-row>
                <a-row>
                  <a-space>
                    <!-- <span>File Params</span> -->
                    <a-input 
                      placeholder="File Param"
                      v-model="fileParams[file.fileId]" 
                      spellcheck="false"
                      @blur="fileParamExit(file.fileId, $event)"
                    />
                  </a-space>
                </a-row>
              </a-space>
            </a-collapse-panel>
          </a-collapse>
        </div>
        
        <!-- Output location input -->

        <a-input
          placeholder="OutPutParam"
          v-model="currentOutputParam"
          spellcheck="false"
        />

        <a-popover title="Output Info" trigger="hover">
          <template slot="content">
            <a-space direction="vertical" :size="0">
              <span><b>Output Name: </b>{{currentProject.outputFileName}}</span>
              <span><b>Output Path: </b>{{currentProject.outputFilePath}}</span>
            </a-space>
          </template>
          
          <a-input-search
            placeholder="Output Path"
            v-model="currentOutputPath"
            enter-button="Output Path"
            @search="setOutput"
            spellcheck="false"
          />
        </a-popover>
      </a-tab-pane>
    </a-tabs>
  </a-row>  
</template>

<script>

// method to load data from Vuex
import { mapState } from 'vuex';
// method to launch FFprobe
import { exec } from 'child_process'
// to generate random ID
import { nanoid } from 'nanoid'
import UpperLeftNewProject from './UpperLeftNewProject.vue';
// object to send message to Electron main process
import { ipcRenderer } from 'electron'


export default {
  components: { UpperLeftNewProject },
  name:'UpperLeftProjects',
  // props data sent from APP
  props:['projects', 'currentProjectId', 'localHeight', 'windowWidth', 'currentProject', 'ffPaths'],

  data() {
    return {
      activeKey:[],
      busy:false,
      newProjectVisible:false,
      drawerVisible:false,
      isInProcess:false,
      isShowResult:false,
      isLoadFile:false,
      workState:{
        workingProject:'',
        longDuration:0,
        shortDuration:0,
        currentDuration:0,
        currntTime:'',
        workPercent:0,
        processState:'active',
        currentFrame:0,
        currentFPS:0,
        currentSize:'',
        currentRite:'',
        currentSpeed:'',
        currentQuality:0
      }
    }
  },
  computed:{
    ...mapState('indexData', ['showingParams']),
    fileParams:{
      get(){
        var fileParamDict = {}
        for (let file of this.currentProject.inputFiles){
          fileParamDict[file.fileId] = file.fileParams.join(' ')
        }
        return fileParamDict
      }
    },
    currentOutputPath:{
      get(){
        return this.currentProject.outputFilePath
      },
      set(path){
        this.changeOutput(path)
      }
    },
    currentOutputParam:{
      get(){
        return this.currentProject.outputParams.join(' ')
      },
      set(param){
        this.changeOutParam(param)
      }
    }
  },
  methods: {
    // Switch project when user clicks project tags
    selectProject(project){
      console.log(project.projectId);
      this.$bus.$emit('changeProject', project.projectId)
    },
    switchProject(val){
      this.$bus.$emit('changeProject', val)
    },

    // Change selection of streams
    onChangeMap(fileId, streamId, event){
      console.log(`Now get fileId: ${fileId}`)
      console.log(`Now get streamId: ${streamId}`)
      console.log(event.target.checked)
      this.$bus.$emit('changeStreamState', fileId, streamId, event.target.checked)
    },

    // Active open file dialog when click the button
    clickAddFile(project){
      this.$refs[`loadFor${project.projectId}`][0].click()
    },

    // Show create project dialog
    clickNewProject(){
      this.newProjectVisible = true
    },


    triggerDrawerVisible(){
      this.drawerVisible = !this.drawerVisible
    },


    // when file parameter input on blur(lose focus), 
    // submit new file parameter
    fileParamExit(fileId, event){
      var fileParams = event.target.value.split(' ')
      fileParams = fileParams.filter(param => param)
      this.$bus.$emit('changeFileParams', fileId, fileParams)
    },

    // Anylize and send new file information
    // after loading files from open file dialog
    addFile(event){
      console.log('targetInfo', event);
      console.log('file info', event.target.files);
      this.isLoadFile = true
      var newFiles = []
      for (let file of event.target.files){
        var newFile = {}
        newFile.fileId = nanoid()
        newFile.filePath = file.path
        newFile.fileName = file.name
        var finished = 0
        var streams = []
        exec(`${this.ffPaths.ffprobe} -i "${file.path}" -show_streams -of json`, (error, stdout, stderr)=>{
          if (error){
            this.$message.error(`File ${file.name} Load Failed!`)
            console.log('ERROR:', error)
            this.isLoadFile = false
            return
          }
          streams = [...JSON.parse(stdout).streams]
          newFile.streams = streams
          console.log(newFile.streams);
          for (let stream of newFile.streams){
            stream.used = true
          }
          finished += 1
          if (finished >= 2){
            newFile.fileParams = []
            newFiles.push(newFile)
            console.log(newFiles);
            this.$bus.$emit('addNewFiles', newFiles)
            event.target.value = ''
            this.isLoadFile = false
          }
        })
        exec(`${this.ffPaths.ffprobe} -i "${file.path}" -show_format -of json`, (error, stdout, stderr)=>{
          if (error){
            this.$message.error(`File ${file.name} Load Failed!`)
            console.log('ERROR:', error)
            this.isLoadFile = false
            return
          }
          newFile.fileInfo = JSON.parse(stdout).format
          finished += 1
          if (finished >= 2){
            newFile.fileParams = []
            newFiles.push(newFile)
            console.log(newFiles);
            this.$bus.$emit('addNewFiles', newFiles)
            event.target.value = ''
            this.isLoadFile = false
          }
        })
      }
    },

    removeFile(fileId){
      this.$bus.$emit('removeFile', fileId)
    },

    editProject(targetKey, action){
      this[action](targetKey)
    },
    remove(targetKey){
      if (targetKey != 'empty')
        this.$bus.$emit('removeProject', targetKey)
      
    },
    // Set the default output path
    // and send message to the electron main process
    // to open a save file dialog with the default output path
    setOutput(){
      var defaultPath = this.currentProject.inputFiles[0].filePath
      var dotIndex = defaultPath.lastIndexOf('.')
      defaultPath = defaultPath.slice(0,dotIndex) + '-output' + defaultPath.slice(dotIndex)
      ipcRenderer.send('OpenFolder', defaultPath, 'Project')
    },

    // Update new output parameter
    changeOutput(path){
      if (path.lastIndexOf('/')>-1)
        var slashIndex = path.lastIndexOf('/')
      else 
        var slashIndex = path.lastIndexOf('\\')
      var outputFileName = path.slice(slashIndex+1)
      console.log('outputFileName', outputFileName)
      this.$bus.$emit('changeOutput', path, outputFileName)
    },

    changeOutParam(param){
      var paramArr = param.split(' ')
      this.$bus.$emit('changeOutParam', paramArr)
    },

    loadMore(){
      this.busy = false
    }
  },
  beforeMount() {

    // Close/open the create new project dialog after receiving a message
    this.$bus.$on('changeVisible', (visible)=>{
      this.newProjectVisible = visible
    })

    // When a project is in process
    this.$bus.$on('getRunningState', (isRunning, isFail)=>{
      if (this.isInProcess && !isRunning){
        if (isFail){
          this.workState.processState = 'exception'
        }
        else{
          this.workState.workPercent = 100
          this.workState.processState = 'success'
        }
      }
      this.isInProcess = isRunning
      if (isRunning){
        // resrt process data
        this.workState.processState = 'active'
        this.workState.workingProject = ''
        this.workState.longDuration = 0
        this.workState.shortDuration = 0
        this.workState.currentDuration = 0
        this.workState.currntTime = ''
        this.workState.workPercent = 0
        this.workState.currentFrame = 0
        this.workState.currentRite = ''
        this.workState.currentSpeed = ''
        this.workState.currentQuality = 0

        this.isShowResult = isRunning
        this.drawerVisible = true
        // find which project is working
        this.workState.workingProject = this.projects.findIndex(project => project.projectId == this.currentProjectId) + 1
        
        // find the project's duration
        var longDuration = 0
        var shortDuration = Infinity
        for (let file of this.currentProject.inputFiles){
          if (file.fileInfo && file.fileInfo.duration){
            var fileDurtion = +file.fileInfo.duration
            if (longDuration<fileDurtion)
              longDuration = fileDurtion
            if (shortDuration>fileDurtion)
              shortDuration = fileDurtion
          }
        }
        if (longDuration)
          this.workState.longDuration = longDuration
        if (shortDuration != Infinity)
          this.workState.shortDuration = shortDuration
      }
    })
    
    // when ffmpeg send back Progress feedback
    this.$bus.$on('getRunningProgress', (resultObj)=>{
      // load converted frames
      this.workState.currentFrame = resultObj.frame ? +resultObj.frame : this.workState.currentFrame
      // load current Time
      if (resultObj.time){
        this.workState.currentTime = resultObj.time
        var timeList = resultObj.time.split(':')
        var finalCurrentTime = 0
        var timeIndex = 0
        for (let time of timeList){
          if (timeIndex == 0)
            finalCurrentTime += +time * 3600
          else if (timeIndex == 1)
            finalCurrentTime += +time * 60
          else
            finalCurrentTime += +time
          timeIndex += 1
        }
        this.workState.currentDuration = finalCurrentTime
        this.workState.workPercent = this.workState.currentDuration * 100 / this.workState.longDuration
      }
      // load current FPS
      this.workState.currentFPS = resultObj.fps ? +resultObj.fps : this.workState.currentFPS 
      // load Current Quality
      this.workState.currentQuality = resultObj.q ? +resultObj.q : this.workState.currentQuality
      // load Current Size
      if (resultObj.size)
        this.workState.currentSize = resultObj.size
      else if (resultObj.Lsize)
        this.workState.currentSize = resultObj.Lsize
      // load Current BitRate
      this.workState.currentRite = resultObj.bitrate ? resultObj.bitrate : this.workState.currentRite
      // load Current Speed
      this.workState.currentSpeed = resultObj.speed ? resultObj.speed : this.workState.currentSpeed
    })

    // Listen output path from save file dialog
    ipcRenderer.on('fileAddressProject', (event, path)=>{
      console.log('filePath:', path)
      if (path)
        this.changeOutput(path)
    })
  },
}
</script>

<style>
  #divInputFiles{
    height: 60%;
    padding: 5%;
  }
  .project:hover{
    background-color: rgb(182, 220, 255);
  }
  /* .project:focus{
    background-color: rgb(0, 102, 255);
  } */

  .filePath{
    font-size: 13px;
  }

  .scroller {
    height: 100px;
  }

  .user {
    height: 32%;
    padding: 0 12px;
    display: flex;
    align-items: center;
  }

  .divFileCard{
    overflow: auto;
  }
</style>