<template>
  <div id="divAll" :style="{height:windowHeight+'px'}">
    <a-row type="flex" justify="center" align="top" :gutter="[16,16]">
      <a-col :span="12">
        <a-space direction="vertical" style="width:100%" >
          <UpperLeftProjects 
            :projects="projects" 
            :currentProjectId="currentProjectId" 
            :FFmpegPath="FFmpegPath"
            :localHeight="windowHeight*0.3"
            :windowWidth="windowWidth"
          />
            
          <UpperLeftGuide :localHeight="windowHeight*0.2"/> 
        </a-space>
      </a-col>
      <a-col :span="12" :gutter="[16,16]">
        <UpperRightSelect 
          :currentParameter="currentParameter" 
          :currentProjectId="currentProjectId" 
          :currentAudio="currentAudio"
          :currentVideo="currentVideo"
          :localHeight="windowHeight*0.5"
        />
        <UpperRightParams 
        :currentVideo="currentVideo"
        :currentAudio="currentAudio"
        :currentFormat="currentFormat"
        :currentType="currentType"
        :currentParameter="currentParameter"
        :localHeight="windowHeight*0.5"
        />
      </a-col>
    </a-row>

    
    <a-row type="flex" justify="center" align="top"> 
      <LowerCodeArea 
        :parameters="parameters" 
        :currentParameter="currentParameter" 
        :currentProjectId="currentProjectId"
        :currentFormat="currentFormat"
      />
      <LowerCodeDisplay :command="cmdLine"/>`
    </a-row>
    

  </div>
  
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import UpperLeftProjects from './components/UpperLeftProjects.vue'
import UpperLeftGuide from './components/UpperLeftGuide.vue'
import UpperRightSelect from './components/UpperRightSelect.vue'
import UpperRightParams from './components/UpperRightParams.vue'

import LowerCodeArea from './components/LowerCodeArea.vue'
import LowerCodeDisplay from './components/LowerCodeDisplay.vue'

import { nanoid } from 'nanoid'
import { mapGetters, mapMutations, mapState } from 'vuex'
const isMac = navigator.platform === 'MacIntel'
const ffmpegWin = 'ffmpeg'
const ffmpegMac = '/opt/homebrew/bin/ffmpeg'


// db.each('select * from SQLite_master', function(err,row){
//   console.log(row)
// })


export default {
  name: 'App',
  components: {
    UpperLeftProjects,
    UpperLeftGuide,
    UpperRightSelect,
    UpperRightParams,
    LowerCodeArea,
    LowerCodeDisplay
  },
  data() {
    return {
      FFmpegPath: isMac ? ffmpegMac : ffmpegWin,
      projects:[
        // example.project1
        { 
          projectId:nanoid(),
          inputFiles:
          [
            {
              fileId:nanoid(),
              filePath:'Elerye_-_Edera.mp4',
              fileName:'Elerye_-_Edera.mp4',
              streams:[
                {index:0, codec_name:'h264', codec_type:'video', used:true},
                {index:1, codec_name:'aac', codec_type:'audio', used:true}
              ],
              fileParams:['-itsoffset', `0ms`]
            },
          ],
          outputFilePath:'Elerye_-_Edera fast 264.mp4',
          outputFileName:'Elerye_-_Edera fast 264.mp4',
          outputParams:['-y']
        },
        // example.project2
        { 
          projectId:nanoid(),
          inputFiles:
          [
            {
              fileId:nanoid(),
              filePath:'UmaLive02.mkv',
              fileName:'UmaLive02.mkv',
              streams:[
                {index:0, codec_name:'hevc', codec_type:'video', used:true},
                {index:1, codec_name:'flac', codec_type:'audio', used:true}
              ],
              fileParams:[]
            },
          ],
          outputFilePath:'UmaLive02.mp4',
          outputFileName:'UmaLive02.mp4',
          outputParams:['-y']
        }
      ],
      parameters:[
        {
          video:{
            '-c:v':'libx265',
            '-crf':'24',
            '-preset':'ultrafast',
            '-pix_fmt':'yuv420p',
            '-x265-params':{
              'ssim':'true',
              'rd':'5'
            }
          },
          audio:{
            '-c:a':'copy'
          },
          projectId:''
        },
        {
          video:{
            '-c:v':'libx264',
            '-crf':'24',
            '-preset':'ultrafast',
            '-pix_fmt':'yuv420p',
          },
          audio:{
            '-c:a':'copy'
          },
          projectId:""
        }
      ],
      currentProjectId:'',
      currentProject:'',
      currentFormat:'',
      currentType:'',
      windowHeight:document.body.clientHeight,
      windowWidth:document.body.clientWidth
    }
  },
  computed:{
    cmdLine(){
      var currentProjectParams = this.parameters.find(project => project.projectId == this.currentProjectId)
      // base address ffmpeg
      var cmd = [this.FFmpegPath]
      // add input files and their input parameters
      this.currentProject.inputFiles.forEach((file)=>{
        cmd = cmd.concat(file.fileParams)
        cmd.push('-i')
        cmd.push(`${file.filePath}`)
      })

      // add map info
      var fileIndex = 0
      this.currentProject.inputFiles.forEach((file)=>{
        for (let stream of file.streams){
          if (stream.used){
            cmd.push('-map')
            cmd.push(`${fileIndex}:${stream.index}`)
          }
        }
        fileIndex += 1
      })

      // add video params
      var cmdBlock = []
      Object.keys(currentProjectParams.video).forEach((key)=>{
        cmdBlock.push(key)
        if (typeof currentProjectParams.video[key] == 'object'){
          var valLine = ''
          for (let [key, value] of Object.entries(currentProjectParams.video[key])){
            valLine += key+'='+value+':'
          }
          valLine = valLine.substr(0, valLine.length-1)
          cmdBlock.push(valLine)
        }
        else
          cmdBlock.push(currentProjectParams.video[key])
      })
      cmd = cmd.concat(cmdBlock)

      // add audio params
      cmdBlock = []
      Object.keys(currentProjectParams.audio).forEach((key)=>{
        cmdBlock.push(key)
        if (typeof currentProjectParams.audio[key] == 'object'){
          var valLine = ''
          for (let [key, value] of Object.entries(currentProjectParams.audio[key])){
            valLine += key+'='+value+':'
          }
          valLine = valLine.substr(0, valLine.length-1)
          cmdBlock.push(valLine)
        }
        else
          cmdBlock.push(currentProjectParams.audio[key])
      })
      cmd = cmd.concat(cmdBlock)

      // add output params and path
      cmd = cmd.concat(this.currentProject.outputParams)
      cmd.push(`${this.currentProject.outputFilePath}`)

      return cmd
    },
    currentParameter:{
      get(){
        return this.parameters.filter(project => project.projectId == this.currentProjectId)[0]
      }
    },
    currentVideo(){
      // load the current video format from input parameters
      console.log('current Video has been triggered')
      var curV = ''
      for (let key of Object.keys(this.currentParameter['video'])){
        if (key.startsWith('-c:')){
          curV = this.currentParameter['video'][key]
          break
        }
      }
      this.currentFormat = curV
      this.currentType = 'video'
      return curV
    },
    currentAudio(){
      // load the current video format from input parameters
      console.log('current Audio has been triggered')
      var curA = ''
      for (let key of Object.keys(this.currentParameter['audio'])){
        if (key.startsWith('-c:')){
          curA = this.currentParameter['audio'][key]
          break
        }
      }
      this.currentFormat = curA
      this.currentType = 'audio'
      return curA
    },
    ...mapState('indexData',['showingParams', 'encodersInfo'])
  },
  methods:{
    // change parameters(by select lists)
    getParams(value, type = null){
      for (let target of this.parameters){
        if (target.projectId == this.currentProjectId){
          if (!type){
            for (let subType of ['video', 'audio']){
              this.$set(target, subType, value[subType])
            }
            break
          }
          else{
            this.$set(target, type, value)
            break
          }
        }
      }
    },
    // add parameters(by parameter candidate)
    addParam(type, key, value, father=null){
      var defaultVal = '1'
      if (value.valueType.startsWith('bool'))
        defaultVal = 'true'
      else if ('subValues' in value){
        if (value.valueType.startsWith('int'))
          defaultVal = '1' 
        else
          defaultVal = Object.keys(value['subValues'])[0]
      }   
        
      for (let target of this.parameters){
        if (target.projectId == this.currentProjectId){
          if (father)
            this.$set(target[type][father], key, defaultVal)
          else
            this.$set(target[type], key, defaultVal)
          break
        }
      }
    },
    // change current project(by project list)
    getProject(projectId){
      this.currentProjectId = projectId
    },
    // update current format
    updateFormat(type){
      console.log('Now we changeing format:', type);
      if (type=='video')
        this.currentFormat = this.currentVideo
      else if (type=='audio')
        this.currentFormat = this.currentAudio
      this.currentType = type
    },
    changeStreamState(fileId, streamId, used){     
      var currentFile = this.currentProject.inputFiles.find(file => file.fileId == fileId)
      var currentStream = currentFile.streams.find(stream => stream.index == streamId)
      currentStream.used = used
    },
    addNewFiles(newFiles){
      currentProject.inputFiles = [...this.currentProject.inputFiles, ...newFiles]
    },
    removeFile(fileId){
      var currentFile = this.currentProject.inputFiles.filter(file => file.fileId != fileId)
      this.currentProject.inputFiles = [...currentFile]
    },
    ...mapMutations('indexData', ['loadGuidance', 'loadEncoders'])
  },
  watch:{
    // if the currentFormat changed
    // let the Param list refreash
    currentFormat:{
      immediate:true,
      handler(curVal, oldVal){

        var hascurV = false
        for (let key of Object.keys(this.showingParams)){
          if (key == curVal){
            hascurV = true
            console.log(`refesh:`, curVal)
            this.$bus.$emit('refreshParameter', curVal)
            break
          }
        }
        if(!hascurV)
          this.$bus.$emit('empitParameter')
      }
    },
    currentProjectId:{
      immediate:true,
      handler(curVal, oldval){
         this.currentProject = this.projects.find(project => project.projectId == curVal)
      }
    }
  },
  beforeMount(){
    var i = 0
    this.projects.forEach(element => {
      this.parameters[i].projectId = element.projectId
      i += 1
    })
    this.currentProjectId = this.parameters[0].projectId
    this.currentProject = this.projects.find(project => project.projectId == this.currentProjectId)

    // this.$bus.$emit('transProjects', this.projects)
    this.$bus.$on('updateParams', this.getParams)
    this.$bus.$on('changeProject', this.getProject)
    this.$bus.$on('addParam', this.addParam)
    this.$bus.$on('updateFormat', this.updateFormat)
    this.$bus.$on('changeStreamState', this.changeStreamState)
    this.$bus.$on('addNewFiles', this.addNewFiles)
    this.$bus.$on('removeFile', this.removeFile)
    const path = require('path')
    const guidancePath = path.join(__static, 'Guidance.json')
    const encodersPath = path.join(__static, 'Encoders.json')
    this.loadGuidance(guidancePath)
    this.loadEncoders(encodersPath)
    

    window.onresize = ()=>{
      this.windowHeight = document.body.clientHeight
      this.windowWidth = document.body.clientWidth
    }

  },
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  [v-cloak]{
    display: none;
  }

  #divAll{
    padding: 2%;
  }

  #divUpper{
    height: 80%;
  }

  #divUpperRight{
    height:95%
  }
  #divUpperRightRow{
    height: 100%;
  }

  #divLower{
    height: auto;
    margin-top: 3%;
  }

  .myDivStyles{
    margin-top: 2%;
    background-color: white;
    border-width: 3px;
    border-radius: 10px;
    border-color: rgb(177, 177, 177);
    border-style:solid;
}
</style>
