<template>
  <a-modal v-model="visible" title="Create a New Basic Project" on-ok="newProjectOk" :width="windowWidth*0.7">
    <template slot="footer">
      <a-button key="back" @click="newProjectCancel">
        {{cancleBtnSpan}}
      </a-button>
      <a-button key="submit" type="primary" @click="newProjectOk" :loading="isCreating">
        {{okBtnSpan}}
      </a-button>
    </template>

    <a-row class="ms-5 me-5">
      <a-steps :current="currentPage">
        <a-step title="Open Files" >
        </a-step>
        <a-step title="Project Setting"/>
      </a-steps>
    </a-row>

    <!-- Step 1 Page -->
    <div v-if="currentPage == 0" class="mt-3">
      <hr>
      <a-upload-dragger
        name="file"
        :multiple="true"
        :showUploadList="false"
        :customRequest="addFiles"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">
          Click or drag file to this area
        </p>

        <a-list :grid="{ gutter: 16, column: 3 }" :data-source="newProject.inputFiles">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-card :title="'File '+(index+1)">
              <span>{{item.fileName}}</span>
            </a-card>
          </a-list-item>
        </a-list>
      </a-upload-dragger>
    </div>


    <div v-if="currentPage == 1" class="mt-3">
      <hr>
      <!-- Video Setting -->
      <a-row>
        <a-space>
          <h3>Video</h3>
          <a-radio :checked="isVideoCopy" @click="changeVideoCopy" class="mb-2">Copy Video Stream</a-radio>
        </a-space>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <span>Video Format</span>
          <a-select
            show-search
            placeholder="Select a Video Format"
            option-filter-prop="children"
            style="width:100%"
            defaultValue="libx264"
            :filter-option="filterVideoFormat"
            @change="videoFormatExit"
            :disabled="isVideoCopy"
          >
            <a-select-option v-for="format in Object.keys(encodersInfo.videos)" :key="format" :value="format">
              <a-tooltip placement="right">
                <template slot="title">
                  {{encodersInfo.videos[format].explanation}}
                </template>
                <a-row>
                  {{format}}
                </a-row>
              </a-tooltip>
            </a-select-option>
          </a-select>
        </a-col>

        <a-col :span="8">
          <span>Encoding Type</span>
          <a-select
            placeholder="Select a Encoding Type"
            style="width:100%"
            defaultValue="Average Bit Rate"
            @change="videoEncodingExit"
            :disabled="isVideoCopy"
          >
            <a-select-option v-for="type in videoEncodingTypes" :key="type" :value="type">
              {{type}}
            </a-select-option>
          </a-select>
        </a-col>

        <a-col v-if="videoEncodingType == 'Average Bit Rate'" :span="8">
          <span>Bit Rate</span>
          <a-input suffix="Kbps" v-model="videoBitRate" :disabled="isVideoCopy"/>
        </a-col>

        <a-col v-if="videoEncodingType == 'Contant Quality(Crf)'" :span="8">
          <span>Quality Value</span>
          <a-input-number 
            v-model="videoQuantity" 
            :max="50" 
            :min="0"
            style="width:100%"
            :disabled="isVideoCopy"
          />
        </a-col>
      </a-row>

      <hr class="mt-4">
      <!-- Audio Setting -->
      <a-row>
        <a-space>
          <h3>Audio</h3>
          <a-radio :checked="isAudioCopy" @click="changeAudioCopy" class="mb-2">Copy Audio Stream</a-radio>
        </a-space>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <span>Audio Format</span>
          <a-select
            show-search
            placeholder="Select a Audio Format"
            option-filter-prop="children"
            style="width:100%"
            defaultValue="aac"
            :filter-option="filterAudioFormat"
            @change="audioFormatExit"
            :disabled="isAudioCopy"
          >
            <a-select-option v-for="format in Object.keys(encodersInfo.audios)" :key="format" :value="format">
              {{format}}
            </a-select-option>
          </a-select>

        </a-col>

        <a-col :span="8">
          <span>Bit Rate</span>
          <a-input suffix="Kbps" v-model="audioBitRate" :disabled="isAudioCopy"/>
        </a-col>
      </a-row>

      <hr class="mt-4">

      <a-row>
        <a-row>
          <h3>Output File</h3>
        </a-row>
      </a-row>

      <a-row>
        <a-popover title="Output Info" trigger="hover">
          <template slot="content">
            <a-space direction="vertical" :size="0">
              <span><b>Output Name: </b>{{newProject.outputFileName}}</span>
              <span><b>Output Path: </b>{{newProject.outputFilePath}}</span>
            </a-space>
          </template>
          <a-input-search
            placeholder="Output Path"
            v-model="newOutputPath"
            enter-button="Output Path"
            @search="setOutput"
            spellcheck="false"
          />
        </a-popover>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import { exec } from 'child_process'
import { nanoid } from 'nanoid'
import { ipcRenderer } from 'electron'
import { mapState } from 'vuex'

export default {
  name:'UpperLeftNewProject',
  props:['newProjectVisible', 'windowWidth'],
  data() {
    return {
      currentPage:0,
      newProject:{},
      cancleBtnSpan:'Close',
      okBtnSpan:'Next',

      isVideoCopy:false,
      isAudioCopy:false,

      videoFormat:'libx264',
      videoEncodingTypes:['Average Bit Rate', 'Contant Quality(Crf)'],
      videoEncodingType:'Average Bit Rate',
      videoBitRate:'1500',
      videoQuantity:25,

      audioFormat:'aac',
      audioBitRate:'320',

      videoStream:{},
      audioStream:{},

      isCreating:false
    }
  },
  computed:{
    ...mapState('indexData', ['encodersInfo']),
    visible:{
      get(){
        return this.newProjectVisible
      },
      set(val){
        this.$bus.$emit('changeVisible', val) 
      }
    },
    newOutputPath:{
      get(){
        return this.newProject.outputFilePath
      },
      set(path){
        this.changeOutput(path)
      }
    }
  },
  methods: {
    newProjectOk(event){
      if (this.currentPage == 1)
        this.createNewProject()
      else
        this.currentPage += 1
    },
    newProjectCancel(event){
      if (!this.currentPage)
        this.$bus.$emit('changeVisible', false)
      else
        this.currentPage -= 1
    },
    addFiles(info){
      var newFile = {}
      newFile.fileId = nanoid()
      newFile.filePath = info.file.path
      newFile.fileName = info.file.name
      var streams = []
      exec(`ffprobe -i "${info.file.path}" -show_streams -of json`, (error, stdout, stderr)=>{
        if (error){
          this.$message.error(`File ${info.file.name} Load Failed!`)
          return
        }
        streams = [...JSON.parse(stdout).streams]
        newFile.streams = streams
        console.log(newFile.streams);
        for (let stream of newFile.streams){
          stream.used = true
        }
        newFile.fileParams = []
        if (this.newProject.inputFiles)
          this.newProject.inputFiles.push(newFile)
        else
          this.$set(this.newProject, 'inputFiles', [newFile])
      })
    },
    changeVideoCopy(event){
      if (!this.isVideoCopy)
        this.isVideoCopy = event.target.checked
      else 
        this.isVideoCopy = !event.target.checked
    },
    changeAudioCopy(event){
      if (!this.isAudioCopy)
        this.isAudioCopy = event.target.checked
      else 
        this.isAudioCopy = !event.target.checked
    },
    videoFormatExit(value){
      this.videoFormat = value
    },
    audioFormatExit(value){
      this.audioFormat = value
    },
    filterVideoFormat(input, option){
      console.log(option);
      return option.componentOptions.children[0].
      componentOptions.children[1].
      componentOptions.children[0].text.trim().indexOf(input)>-1
    },
    filterAudioFormat(input, option){
      return option.componentOptions.children[0].text.trim().indexOf(input)>-1
    },
    videoEncodingExit(value){
      this.videoEncodingType = value
    },

    setOutput(){
      if (!this.newProject.inputFiles){
        ipcRenderer.send('OpenFolder', '', 'newProject')
        return
      }
      var defaultPath = this.newProject.inputFiles[0].filePath
      var dotIndex = defaultPath.lastIndexOf('.')
      defaultPath = defaultPath.slice(0,dotIndex) + '-output' + defaultPath.slice(dotIndex)
      ipcRenderer.send('OpenFolder', defaultPath, 'newProject')
    },

    changeOutput(path){
      if (path.lastIndexOf('/')>-1)
        var slashIndex = path.lastIndexOf('/')
      else 
        var slashIndex = path.lastIndexOf('\\')
      var outputFileName = path.slice(slashIndex+1)
      this.$set(this.newProject, 'outputFilePath', path)
      this.$set(this.newProject, 'outputFileName', outputFileName)
    },

    createNewProject(){
      this.isCreating = true

      // basic init
      this.newProject.projectId = nanoid()
      if (!this.newProject.inputFiles)
        this.$set(this.newProject, 'inputFiles', [])
      if (!this.newProject.outputFilePath){
        this.$set(this.newProject, 'outputFilePath', 'output.mov')
        this.$set(this.newProject, 'outputFileName', 'output.mov')
      }
      this.$set(this.newProject, 'outputParams', ['-y'])
      this.$set(this.newProject, 'parameters', [])

      // push video stream
      var videoStream = {}
      videoStream.streamId = nanoid()
      videoStream.streamType = 'video'
      videoStream.mark = '-c:v'
      videoStream.params = {}
      if (this.isVideoCopy){
        videoStream.format = 'copy'
      }
      else{
        videoStream.format = this.videoFormat
        if (this.videoEncodingType == 'Average Bit Rate')
          videoStream.params = {'-b:v':this.videoBitRate+'k'}
        else
          videoStream.params = {'-crf':`${this.videoQuantity}`}
      }
      this.newProject.parameters.push(videoStream)

      // push audio stream
      var audioStream = {}
      audioStream.streamId = nanoid()
      audioStream.streamType = 'audio'
      audioStream.mark = '-c:a'
      audioStream.params = {}
      if (this.isAudioCopy){
        audioStream.format = 'copy'
      }
      else{
        audioStream.format = this.audioFormat
        audioStream.params = {'-b:a':this.audioBitRate+'k'}
      }
      this.newProject.parameters.push(audioStream)
      
      // commit new project
      this.$bus.$emit('addProject', this.newProject)
      this.isCreating = false
      this.$bus.$emit('changeVisible', false)

      // set back defult value
      this.videoFormat = 'libx264'
      this.videoEncodingType='Average Bit Rate'
      this.videoBitRate='1500'
      this.videoQuantity=25
      this.audioFormat='aac'
      this.audioBitRate='320'
      this.newProject = {}
      this.currentPage = 0
    }
  },
  watch:{
    currentPage:{
      handler(curVal){
        if (curVal == 0){
          this.cancleBtnSpan = 'Close'
          this.okBtnSpan = 'Next'
        }
        else if (curVal == 1){
          this.cancleBtnSpan = 'Previous'
          this.okBtnSpan = 'Create'
        }
      }
    }
  },
  beforeMount() {
    ipcRenderer.on('fileAddressNewProject', (event, path)=>{
      console.log('filePath:', path)
      if (path)
        this.changeOutput(path)
    })
  },
}
</script>

<style>

</style>