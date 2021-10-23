<template>
  <div class="col myDivStyles" id="divInputFiles">
    <div class="container" v-for="project in projects" :key="project.projectId">
      <div class="row" v-for="file in project.inputFiles" :key="file.fileId">
        {{file.fileName}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name:'UpperLeftProjects',
  data() {
    return {
      projects:[]
    }
  },
  methods: {
    getProjects(projects){
      console.log(projects);
      this.projects = projects
    }
  },
  mounted() {
    this.$bus.$on('transProjects', this.getProjects)
  },
}
</script>

<style>
  #divInputFiles{
    height: 60%;
    padding: 5%;
  }
</style>