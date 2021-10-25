<template>
  <div class="col-12" id="divAll" v-cloak>
    <div class="row" id="divUpper">
      <div class="col-6" id="divUpperLeft">
        <UpperLeftProjects :projects="projects"/>
        <UpperLeftGuide/>
      </div>
      <div class="col" id="divUpperRight">
        <div class="row" id="divUpperRightRow">
          <UpperRightSelect/>
          <UpperRightParams/>
        </div>
      </div>
    </div>
    <div class="row" id="divLower">
      <LowerCodeArea/>
      <LowerCodeDisplay :command="cmdLine"/>
    </div>
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

const isMac = navigator.platform === 'MacIntel'
const ffmpegWin = 'ffmpeg'
const ffmpegMac = '/opt/homebrew/bin/ffmpeg'

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
                {index:0, code_name:'h264', code_type:'video'},
                {index:1, code_name:'aac', code_type:'audio'}
              ],
              streamsUsed:{0:true, 1:true},
              fileParams:['-itsoffset', '35ms']
            },
          ],
          outputFilePath:'Elerye_-_Edera-fast-265.mp4',
          outputFileName:'Elerye_-_Edera-fast-265.mp4',
          outputParas:['-y']
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
                {index:0, code_name:'hevc', code_type:'video'},
                {index:1, code_name:'flac', code_type:'audio'}
              ],
              streamsUsed:{0:true, 1:true},
              fileParams:[]
            },
          ],
          outputFilePath:'UmaLive02.mp4',
          outputFileName:'UmaLive02.mp4',
          outputParas:['-y']
        }
      ],
      parameters:[
        {
          maping:['-map', '0:v', '-map', '0:a'],
          video:['-c:v', 'libx265', '-preset', 'ultrafast', '-crf', '24', '-pix_fmt', 'yuv420p'],
          audio:['-c:a', 'copy']
        },
        {
          maping:['-map', '0:v', '-map', '0:a'],
          video:['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '24', '-pix_fmt', 'yuv420p'],
          audio:['-c:a', 'copy']
        }
      ],
      currentProjectId:''
    }
  },
  computed:{
    cmdLine(){
      var currentProjectParams = this.parameters.filter(project => project.projectId == this.currentProjectId)[0]
      var currentProject = this.projects.filter(project => project.projectId == this.currentProjectId)[0]
      console.log('currentProject@',currentProject);
      console.log('currentID@', this.currentProjectId)
      var cmd = [this.FFmpegPath]
      currentProject.inputFiles.forEach((file)=>{
        cmd = cmd.concat(file.fileParams)
        cmd.push('-i')
        cmd.push(file.filePath)
      })
      
      cmd = cmd.concat(
        currentProjectParams.maping,
        currentProjectParams.video,
        currentProjectParams.audio,
        currentProject.outputParas,
        currentProject.outputFilePath
        )
      return cmd
    }
  },
  beforeMount(){
    var i = 0
    this.projects.forEach(element => {
      this.parameters[i].projectId = element.projectId
      i += 1
    })
    this.currentProjectId = this.parameters[0].projectId
    // this.$bus.$emit('transProjects', this.projects)
    
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

  html,body{
    background-color: rgb(238, 238, 238);
    height: 77%;
    width: 99%;
  }

  [v-cloak]{
    display: none;
  }

  #divAll{
    padding-left: 2%;
    height: 100%;
  }

  #divUpper{
    height: 80%;
  }

  #divUpperRight{
    height:92.5%
  }
  #divUpperRightRow{
    height: 100%;
  }

  #divLower{
    height: auto;
    margin-top: 1%;
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
