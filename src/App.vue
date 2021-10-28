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
      <LowerCodeArea :parameters="parameters" :currentProjectId="currentProjectId"/>
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
                {index:0, code_name:'h264', code_type:'video'},
                {index:1, code_name:'aac', code_type:'audio'}
              ],
              streamsUsed:{0:true, 1:true},
              fileParams:['-itsoffset', '0ms']
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
          maping:{
            '-map':'0:a',
            '-map':'0:v'
          },
          video:{
            '-c:v':'libx265',
            '-crf':'24',
            '-preset':'ultrafast',
            '-pix_fmt':'yuv420p',
            '-x265-params':'ssim=1'
          },
          audio:{
            '-c:a':'copy'
          },
          projectId:''
        },
        {
          maping:{
            '-map':'0:a',
            '-map':'0:v'
          },
          video:{
            '-c:v':'libx264',
            '-crf':'24',
            '-preset':'ultrafast',
            '-pix_fmt':'yuv420p'
          },
          audio:{
            '-c:a':'copy'
          },
          projectId:""
        }
      ],
      currentProjectId:''
    }
  },
  computed:{
    cmdLine(){
      var currentProjectParams = this.parameters.filter(project => project.projectId == this.currentProjectId)[0]
      var currentProject = this.projects.filter(project => project.projectId == this.currentProjectId)[0]
      // console.log('currentProject@',currentProject);
      // console.log('currentID@', this.currentProjectId)
      var cmd = [this.FFmpegPath]
      currentProject.inputFiles.forEach((file)=>{
        cmd = cmd.concat(file.fileParams)
        cmd.push('-i')
        cmd.push(file.filePath)
      })

      var cmdBlock = []
      Object.keys(currentProjectParams.maping).forEach((key)=>{
        cmdBlock.push(key)
        cmdBlock.push(currentProjectParams.maping[key])
      })
      cmd = cmd.concat(cmdBlock)

      cmdBlock = []
      Object.keys(currentProjectParams.video).forEach((key)=>{
        cmdBlock.push(key)
        cmdBlock.push(currentProjectParams.video[key])
      })
      cmd = cmd.concat(cmdBlock)

      cmdBlock = []
      Object.keys(currentProjectParams.audio).forEach((key)=>{
        cmdBlock.push(key)
        cmdBlock.push(currentProjectParams.audio[key])
      })
      cmd = cmd.concat(cmdBlock)

      cmd = cmd.concat(
        currentProject.outputParas,
        currentProject.outputFilePath)

      return cmd
    }
  },
  methods:{
    getParams(projectId, value, type){
      this.parameters.forEach((target)=>{
        if (target.projectId == projectId){
          this.$set(target, type, value)
          return
        }
      })
    },
    getProject(projectId){
      this.currentProjectId = projectId
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
    this.$bus.$on('updateParams', this.getParams)
    this.$bus.$on('changeProject', this.getProject)
  },
  mounted(){
    this.$dataBase.each('select * from libx265', function(err,row){
      console.log(row)
    })
  }
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
