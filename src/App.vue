<template>
  <div class="col-12" id="divAll" v-cloak>
    <div class="row" id="divUpper">
      <div class="col-6" id="divUpperLeft">
        <UpperLeftProjects/>
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
      <LowerCodeDisplay/>
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
      projects:[
        // example.project1
        { 
          projectId:nanoid(),
          inputFiles:
          [
            {
              fileId:nanoid(),
              filePath:'/Users/xyang/Documents/Developing/ElectronDev/Elerye_-_Edera.mp4',
              fileName:'Elerye_-_Edera.mp4',
              streams:[
                {index:0, code_name:'h264', code_type:'video'},
                {index:1, code_name:'aac', code_type:'audio'}
              ],
              streamsUsed:{0:true, 1:true},
              fileParams:['-itsoffset', '35ms']
            },
          ],
          outputFilePath:'/Users/xyang/Documents/Developing/ElectronDev/Elerye_-_Edera-fast-264.mp4',
          outputFileName:'Elerye_-_Edera-fast-264.mp4',
          outputParas:['-y']
        },
        // example.project2
        { 
          projectId:nanoid(),
          inputFiles:
          [
            {
              fileId:nanoid(),
              filePath:'/Users/xyang/Documents/UmaLive02.mkv',
              fileName:'UmaLive02.mkv',
              streams:[
                {index:0, code_name:'hevc', code_type:'video'},
                {index:1, code_name:'flac', code_type:'audio'}
              ],
              streamsUsed:{0:true, 1:true},
              fileParams:[]
            },
          ],
          outputFilePath:'/Users/xyang/Documents/UmaLive02.mp4',
          outputFileName:'UmaLive02.mp4',
          outputParas:['-y']
        }
      ],
      parameters:[
        {
          maping:['-map', '0:v', '-map', '0:a'],
          video:['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '24', '-pix_fmt', 'yuv420p'],
          audio:['-c:v', 'copy']
        },
        {
          maping:['-map', '0:v', '-map', '0:a'],
          video:['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '24', '-pix_fmt', 'yuv420p'],
          audio:['-c:v', 'copy']
        }
      ],
      currentParams:''
    }
  },
  mounted() {
    var i = 0
    this.projects.forEach(element => {
      this.parameters[i].projectId = element.projectId
      i += 1
    })
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
    border-color: rgb(148, 148, 148);
    border-style:solid;
}
</style>
