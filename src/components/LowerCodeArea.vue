<template>
  <div class="container" id="divCodeArea">
      <form id="Codeform" class="form-horizontal">
        <div class="row">
          <!-- <div class="col"><textarea class="form-control" rows="6" id="codeInps" v-model.trim.lazy="cmdStringInpts"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeVideo" v-model.trim.lazy="cmdStringVideo"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeAudio" v-model.trim.lazy="cmdStringAudio"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeOups" v-model.trim.lazy="cmdStringOups"></textarea></div> -->
          <div class="col"><textarea class="form-control" rows="6" id="codeInps" v-model.trim.lazy="maping"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeVideo" v-model.trim.lazy="video"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeAudio" v-model.trim.lazy="audio"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeOups" ></textarea></div>
        </div>
      </form>
    </div>
</template>

<script>
export default {
  name:'LowerCodeArea',
  props:['parameters', 'currentProjectId'],
  computed:{
    currentParameter:{
      get(){
        return this.parameters.filter(project => project.projectId == this.currentProjectId)[0]
      }
    },
    maping:{
      get(){
        return this.currentParameter.maping.join(' ')
      },
      set(value){
        this.updateParams(this.currentProjectId, value, 'maping')
      }
    },
    video:{
      get(){
        return this.currentParameter.video.join(' ')
      },
      set(value){
        this.updateParams(this.currentProjectId, value, 'video')
      }
    },
    audio:{
      get(){
        return this.currentParameter.audio.join(' ')
      },
      set(value){
        this.updateParams(this.currentProjectId, value, 'audio')
      }
    },
  },
  methods: {
    updateParams(projectId, value, type){
      console.log(projectId, value, type);
    }
  },
  mounted() {
    console.log(this.currentProjectId);
    console.log(this.parameters);
  },
}
</script>

<style>

</style>