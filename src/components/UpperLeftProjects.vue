<template>
  <div class="col shadow-sm bg-body rounded mt-3" id="divInputFiles">
    <div class="row project" v-for="project in projects" :key="project.projectId" @click="selectProject(project)">
      <div class="row" v-for="file in project.inputFiles" :key="file.fileId">
        <p class="fileName">{{file.fileName}}</p>
        <p class="filePath">{{file.filePath}}</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name:'UpperLeftProjects',
  props:['projects'],
  data() {
    return {
    }
  },
  methods: {
    getProjects(projects){
      console.log(projects);
      this.projects = projects
    },
    selectProject(project){
      console.log(project);
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
</style>