<template>
    <!-- <div class="row project" v-for="project in projects" :key="project.projectId" @click="selectProject(project)">
      <div class="row" v-for="file in project.inputFiles" :key="file.fileId">
        <p class="fileName">{{file.fileName}}</p>
        <p class="filePath">{{file.filePath}}</p>
      </div>
    </div> -->
      <!-- <a-collapse v-model="activeKey" expand-icon-position="left">
          <a-collapse-panel :key="item.projectId" header="This is panel header 1">
            <p>{{ item.projectId }}</p>
            <a-icon slot="extra" type="setting"/>
          </a-collapse-panel>
       
      </a-collapse>
 -->
  <a-row class="border border-bottom-0 border-end-0" :style="{height:localHeight+'px'}">
    <UpperLeftNewProject 
      :newProjectVisible="newProjectVisible"
      :windowWidth="windowWidth"
      />
    <a-tabs
      :default-active-key="currentProjectId"
      tab-position="left"
      @tabClick="switchProject"
      size="small"
    >
      <a-tab-pane 
        v-for="(project, index) in projects" 
        :key="project.projectId" :tab="`${index+1}`" 
        @click="selectProject(project)"
        class="me-3"
      >
        <a-space class="mt-3">
          <a-button :loading="isLoadFile" type="primary" @click="clickAddFile(project)">
            <a-icon v-show="!isLoadFile" type="plus" class="align-middle mb-1"/>
            Add File
          </a-button>
          <a-button type="primary" @click="clickNewProject">
            <a-icon type="plus" class="align-middle mb-1"/>
            Add Project
          </a-button>
        </a-space>
        <div 
          v-infinite-scroll="loadMore" 
          infinite-scroll-disabled="busy" 
          infinite-scroll-distance="10" 
          class="divFileCard" 
          :style="{height:localHeight-100+'px'}"
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
                    <span>File Params</span>
                    <a-input 
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
        <a-row>
          <a-space>
            <a-button>
              Output Folder
            </a-button>
          </a-space>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </a-row>  
</template>

<script>
import { mapState } from 'vuex';
import { exec } from 'child_process'
import { nanoid } from 'nanoid'
import UpperLeftNewProject from './UpperLeftNewProject.vue';


export default {
  components: { UpperLeftNewProject },
  name:'UpperLeftProjects',
  props:['projects', 'currentProjectId', 'localHeight', 'windowWidth', "currentProject"],

  data() {
    return {
      activeKey:[],
      busy:false,
      newProjectVisible:false,
      isLoadFile:false
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
    }
  },
  methods: {
    selectProject(project){
      console.log(project.projectId);
      this.$bus.$emit('changeProject', project.projectId)
    },
    switchProject(val){
      this.$bus.$emit('changeProject', val)
    },
    onChangeMap(fileId, streamId, event){
      console.log(`Now get fileId: ${fileId}`)
      console.log(`Now get streamId: ${streamId}`)
      console.log(event.target.checked)
      this.$bus.$emit('changeStreamState', fileId, streamId, event.target.checked)
    },
    clickAddFile(project){
      this.$refs[`loadFor${project.projectId}`][0].click()
    },
    clickNewProject(){
      this.newProjectVisible = true
    },
    fileParamExit(fileId, event){
      var fileParams = event.target.value.split(' ')
      fileParams = fileParams.filter(param => param)
      this.$bus.$emit('changeFileParams', fileId, fileParams)
    },
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
        var streams = []
        exec(`ffprobe -i "${file.path}" -show_streams -of json`, (error, stdout, stderr)=>{
          if (error){
            console.log(error)
            this.isLoadFile = false
            return
          }
          streams = [...JSON.parse(stdout).streams]
          newFile.streams = streams
          console.log(newFile.streams);
          for (let stream of newFile.streams){
            stream.used = true
          }
          newFile.fileParams = []
          newFiles.push(newFile)
          console.log(newFiles);
          this.$bus.$emit('addNewFiles', newFiles)
          event.target.value = ''
          this.isLoadFile = false
        })
      }
    },
    removeFile(fileId){
      this.$bus.$emit('removeFile', fileId)
    },
    loadMore(){
      this.busy = false
    }
  },
  beforeMount() {
    this.$bus.$on('changeVisible', (visible)=>{
      this.newProjectVisible = visible
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