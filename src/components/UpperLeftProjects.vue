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
  <a-row class="shadow-sm border px-3" :style="{height:localHeight+'px'}">
    <a-tabs
      :default-active-key="currentProjectId"
      tab-position="top"
      :style="{ height: '200px' }"
      @tabClick="onLoad"
    >
      <a-tab-pane v-for="(project, index) in projects" :key="project.projectId" :tab="`project-${index}`" @click="selectProject(project)">
        <a-card v-for="file in project.inputFiles" :key="file.fileId" size="small" :title="file.fileName" style="width: 100%">
          <p>{{file.filePath}}</p>
          <a-row>
            <a-checkbox 
              v-for="(streamInfo, index) in file.streams" 
              :key="index" 
              :defaultChecked="streamInfo.used"
              @change="onChange(file.fileId, streamInfo.index, $event)">
                {{index}}:{{streamInfo.code_type}}, {{streamInfo.code_name}}
            </a-checkbox>
          </a-row>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </a-row>  
</template>

<script>
import { mapState } from 'vuex';
var testProjects = []
for (var i = 0;i<=100;i++){
  testProjects.push({projectId:i, inputFile:[i]})
}
export default {
  name:'UpperLeftProjects',
  props:['projects', 'currentProjectId', 'localHeight'],
  data() {
    return {
      activeKey:[],
      busy:true,
      testProjects
    }
  },
  computed:{
    ...mapState('indexData', ['showingParams'])
  },
  methods: {
    getProjects(projects){
      console.log(projects);
      this.projects = projects
    },
    selectProject(project){
      console.log(project.projectId);
      this.$bus.$emit('changeProject', project.projectId)
    },
    onLoad(val){
      this.$bus.$emit('changeProject', val)
    },
    onChange(fileId, streamId, event){
      console.log(`Now get fileId: ${fileId}`)
      console.log(`Now get streamId: ${streamId}`)
      console.log(event.target.checked)
      this.$bus.$emit('changeStreamState', fileId, streamId, event.target.checked)
    }
  },
  mounted() {
    // this.$bus.$on('transProjects', this.getProjects)
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
</style>