<template>
  <div class="row align-items-center mt-5">
    <div class="col-11" id="divDisArea">
      <!-- <input name="codeArea" class="form-control" id="codeArea" v-model="cmdStringDis"/> -->
      <div class="row align-self-center">
        <p id="codeArea" class="align-self-center mt-2">{{cmdStringDis}}</p>
      </div>
    </div>
    <div class="col">
      <input type="button" id="btnStart" value="START" class="btn btn-primary" @click.stop="runFFmpeg"/>
    </div>
    <div class="row" id="divLogProcess">
      <p id="pLogProcess">{{result}}</p>
    </div>
  </div> 
</template>

<script>
export default {
  name:'LowerCodeDisplay',
  data() {
    return {
      cmdStringDis:'ffmpeg........',
      result:'........'
    }
  },
  methods: {
    runFFmpeg(){
      return
    }
  },
}
</script>

<style scoped>
  #divDisArea{
      height: 60px;
      border-style: solid;
      background-color: rgb(255, 255, 255);
      border-width: 2px;
      border-radius: 10px;
      border-color: rgb(49, 197, 255);
  }

  .divLogProcess{
    border-width: 3px;
    border-radius: 20px;
    border-color: rgb(49, 197, 255);
    border-style: groove;
}
</style>