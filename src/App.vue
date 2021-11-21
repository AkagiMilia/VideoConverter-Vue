<template>
  <div id="divAll" :style="{height:windowHeight+'px'}">
    <a-row type="flex" justify="center" align="top">
      <a-col :span="12">
          <UpperLeftProjects 
            :projects="projects" 
            :currentProjectId="currentProjectId"
            :currentProject="currentProject"
            :FFmpegPath="FFmpegPath"
            :localHeight="windowHeight*0.4"
            :windowWidth="windowWidth"
          />
            
          <UpperLeftGuide :localHeight="windowHeight*0.2"/> 
      </a-col>
      <a-col :span="12" >
        <UpperRightSelect 
          :currentParameter="currentParameter" 
          :currentProjectId="currentProjectId" 
          :localHeight="windowHeight*0.597"
        />
        <UpperRightParams 
          :currentFormat="currentFormat"
          :currentStream="currentStream"
          :currentType="currentType"
          :localHeight="windowHeight*0.597"
        />
      </a-col>
    </a-row>

    
    <a-row justify="center" align="top" :span="24" class="mt-3"> 
      <LowerCodeArea 
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
          outputParams:['-y'],
          parameters:[ 
            {
              streamId:nanoid(),
              streamType:'video',
              mark:'-c:v',
              format:'libx265',
              params:{
                '-crf':'24',
                '-preset':'ultrafast',
                '-pix_fmt':'yuv420p',
                '-x265-params':{
                  'ssim':'true',
                  'rd':'5'
                }
              }
            },
            {
              streamId:nanoid(),
              streamType:'audio',
              mark:'-c:a',
              format:'flac',
              params:{
                '-a':'b',
                '-c':'d'
              } 
            }
          ],  
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
          outputParams:['-y'],
          parameters:[
            {
              streamId:nanoid(),
              streamType:'video',
              mark:'-c:v',
              format:'libx264',
              params:{
                '-crf':'24',
                '-preset':'ultrafast',
                '-pix_fmt':'yuv420p',
              }
            },
            {
              streamId:nanoid(),
              steamType:'audio',
              mark:'-c:a',
              format:'copy',
              params:{
                // empty
              }
            }
          ]
        }
      ],
      currentProjectId:'',
      currentProject:{},
      currentParameter:[],
      // focused streamType e.g video
      currentStreamId:'',
      currentStream:{},
      currentType:'',
      currentFormat:'',
      windowHeight:document.body.clientHeight,
      windowWidth:document.body.clientWidth
    }
  },
  computed:{
    cmdLine(){
      var currentProjectParams = this.projects.find(project => project.projectId == this.currentProjectId).parameters
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

      var cmdBlock = []
      // add video and audio params
      cmdBlock = []
      for (let stream of currentProjectParams){
        cmdBlock.push(stream.mark)
        cmdBlock.push(stream.format)
        for (let [param, value] of Object.entries(stream.params)){
          cmdBlock.push(param)
          if (typeof value == 'object'){
            var valLine = ''
            for (let [subParam, subValue] of Object.entries(value)){
              valLine += subParam+'='+subValue+':'
            }
            valLine = valLine.substr(0, valLine.length-1)
            cmdBlock.push(valLine)
          }
          else
            cmdBlock.push(value)
        }
      }
      cmd = cmd.concat(cmdBlock)

      // add output params and path
      cmd = cmd.concat(this.currentProject.outputParams)
      cmd.push(`${this.currentProject.outputFilePath}`)

      return cmd
    },
    // focused format e.g libx264
    // also changing currentType e.g video
    ...mapState('indexData',['showingParams', 'encodersInfo'])
  },
  methods:{
    // change parameters(by select lists)
    getParams(value, type = null, streamId = null){
      if (type){
        this.currentStream.params = value
      }
      else{
        var index = 0
        var foundCurStreamId = false
        for (let stream of value){
          if (this.currentParameter[index]){
            stream.streamId = this.currentParameter[index].streamId
            if (stream.streamId == this.currentStreamId){
              foundCurStreamId = true
            }       
          }
          else{
            stream.streamId = nanoid()
          }
          index += 1
        }
        var currentParameter = this.projects.find(project => project.projectId == this.currentProjectId).parameters
        while(currentParameter.length)
          currentParameter.pop()
        for (let stream of value){
          currentParameter.push(stream)
        }
        if (!foundCurStreamId){
          this.currentStreamId = currentParameter[0].streamId
        }
        this.refreshPointers()
        console.log('this projects', this.projects);
      }
    },
    // add parameters(by parameter candidate)
    addParam(paramName, paramInfo, father=null){
      var defaultVal = '1'
      if (paramInfo.valueType.startsWith('bool'))
        defaultVal = 'true'
      else if ('subValues' in paramInfo){
        if (paramInfo.valueType.startsWith('int'))
          defaultVal = '1' 
        else
          defaultVal = Object.keys(paramInfo['subValues'])[0]
      }   
      console.log('add param name:', paramName)
      console.log('add target:',this.currentStream);
      if (father && !this.currentStream.params[father][paramName])
        this.$set(this.currentStream.params[father], paramName, defaultVal)
      else if(!this.currentStream.params[paramName])
        this.$set(this.currentStream.params, paramName, defaultVal)
 
    },
    // change current project(by project list)
    getProject(projectId){
      this.currentProjectId = projectId
    },
    // update current format
    switchStream(streamId){
      this.currentStreamId = streamId
    },
    changeStreamState(fileId, streamId, used){     
      var currentFile = this.currentProject.inputFiles.find(file => file.fileId == fileId)
      var currentStream = currentFile.streams.find(stream => stream.index == streamId)
      currentStream.used = used
    },
    addNewFiles(newFiles){
      this.currentProject.inputFiles = [...this.currentProject.inputFiles, ...newFiles]
    },
    removeFile(fileId){
      var currentFile = this.currentProject.inputFiles.filter(file => file.fileId != fileId)
      this.currentProject.inputFiles = [...currentFile]
    },
    refreshPointers(){
      this.currentProject = this.projects.find(project => project.projectId == this.currentProjectId)
      this.currentParameter = this.currentProject.parameters
      this.currentStream = this.currentParameter.find(stream => stream.streamId = this.currentStreamId)
      this.currentFormat = this.currentStream.format
      this.currentType = this.currentStream.streamType

    },
    ...mapMutations('indexData', ['loadGuidance', 'loadEncoders'])
  },
  watch:{
    // if the currentFormat changed
    // let the Param list refreash
    currentFormat:{
      immediate:true,
      handler(curVal, oldVal){
        if (!curVal)
          return
        var hascurV = false
        for (let key of Object.keys(this.showingParams)){
          if (key == curVal){
            hascurV = true
            console.log('refesh:', curVal)
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
        if (!curVal)
          return
        this.currentProject = this.projects.find(project => project.projectId == curVal)
        this.currentParameter = this.currentProject.parameters
        this.currentStreamId = this.currentProject.parameters[0].streamId
        console.log('currentFormat', this.currentFormat)
      }
    },
    currentStreamId:{
      immediate:true,
      handler(curVal, oldval){
        if (!curVal)
          return
        if (this.currentParameter && this.currentStreamId){
          for (let stream of this.currentParameter){
            if (stream.streamId == this.currentStreamId){
              this.currentStream = stream
              this.currentFormat = stream.format
              this.currentType = stream.streamType
            }
          }
        }
      }
    }
  },
  beforeMount(){
    this.currentProjectId = this.projects[0].projectId
    this.currentProject = this.projects.find(project => project.projectId == this.currentProjectId)
    this.currentStreamId = this.currentProject.parameters[0].streamId

    // this.$bus.$emit('transProjects', this.projects)
    this.$bus.$on('updateParams', this.getParams)
    this.$bus.$on('changeProject', this.getProject)
    this.$bus.$on('addParam', this.addParam)
    this.$bus.$on('switchStream', this.switchStream)
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
