<template>
  <div class="col-12" id="divAll" v-cloak>
    <div class="row" id="divUpper">
      <div class="col-6" id="divUpperLeft">
        <UpperLeftProjects :projects="projects"/>
        <UpperLeftGuide/>
      </div>
      <div class="col" id="divUpperRight">
        <div class="row" id="divUpperRightRow">
          <UpperRightSelect 
            :currentParameter="currentParameter" 
            :currentProjectId="currentProjectId" 
            :currentAudio="currentAudio"
            :currentVideo="currentVideo"
          />
          <UpperRightParams 
          :currentVideo="currentVideo"
          :currentAudio="currentAudio"
          :currentFormat="currentFormat"
          :currentType="currentType"
          :currentParameter="currentParameter"
          />
        </div>
      </div>
    </div>
    <div class="row" id="divLower">
      <LowerCodeArea 
        :parameters="parameters" 
        :currentParameter="currentParameter" 
        :currentProjectId="currentProjectId"
        :currentFormat="currentFormat"
      />
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
          maping:{
            '-map':'0:a',
            '-map':'0:v'
          },
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
      currentFormat:'',
      currentType:''
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
      Object.keys(this.currentParameter['video']).forEach((key)=>{
        if (key.startsWith('-c:')){
          curV = this.currentParameter['video'][key]
          return
        }
      })
      this.currentFormat = curV
      this.currentType = 'video'
      return curV
    },
    currentAudio(){
      // load the current video format from input parameters
      console.log('current Audio has been triggered')
      var curA = ''
      Object.keys(this.currentParameter['audio']).forEach((key)=>{
        if (key.startsWith('-c:')){
          curA = this.currentParameter['audio'][key]
          return
        }
      })
      this.currentFormat = curA
      this.currentType = 'audio'
      return curA
    },
    ...mapState('indexData',['showingParams'])
  },
  methods:{
    getParams(value, type){
      this.parameters.forEach((target)=>{
        if (target.projectId == this.currentProjectId){
          this.$set(target, type, value)
          return
        }
      })
    },
    addParam(type, param, father=null){
      if (father){
        this.parameters.forEach((target)=>{
          if (target.projectId == this.currentProjectId){
            this.$set(target[type][father], param, '1')
            return
          }
        })
      }
      else{
        this.parameters.forEach((target)=>{
          if (target.projectId == this.currentProjectId){
            this.$set(target[type], param, '1')
            return
          }
        })
      }
    },
    getProject(projectId){
      this.currentProjectId = projectId
    },
    updateFormat(type){
      console.log('Now we changeing format:', type);
      if (type=='video')
        this.currentFormat = this.currentVideo
      else if (type=='audio')
        this.currentFormat = this.currentAudio
    },
    ...mapMutations('indexData', ['loadGuidance'])
  },
  watch:{
    currentFormat:{
      immediate:true,
      handler(curVal, oldVal){
        // if there is no parameter dictionary for this format:
        //    search the database and save one for it
        // else
        //    just return the new format name
        console.log('yes we changed');
        if (curVal == oldVal)
          return
        var hascurV = false
        Object.keys(this.showingParams).forEach((key)=>{
          if (key == curVal)
            hascurV = true
            this.$bus.$emit('refreshParameter', curVal)
            return
        })
        if(!hascurV)
          this.$bus.$emit('empitParameter')
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

    // this.$bus.$emit('transProjects', this.projects)
    this.$bus.$on('updateParams', this.getParams)
    this.$bus.$on('changeProject', this.getProject)
    this.$bus.$on('addParam', this.addParam)
    this.$bus.$on('updateFormat', this.updateFormat)

    this.loadGuidance('./src/data/Guidance.json')

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
