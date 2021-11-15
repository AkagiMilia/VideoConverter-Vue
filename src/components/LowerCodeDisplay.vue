<template>
  <div class="row align-items-center mt-4 ms-1">
    <div class="col-10" id="divDisArea">
      <!-- <input name="codeArea" class="form-control" id="codeArea" v-model="cmdStringDis"/> -->
      <div class="row align-self-center">
        <p id="codeArea" class="align-self-center mt-2">{{cmdStringDis}}</p>
      </div>
    </div>
    <div class="col">
      <input type="button" id="btnStart" value="START" class="btn btn-primary ms-5" @click.stop="runFFmpeg"/>
    </div>
    <div class="row" id="divLogProcess">
      <p id="pLogProcess">{{result}}</p>
    </div>
  </div> 
</template>

<script>
const { spawn } = require('child_process')
console.log('spawn is ', spawn);
export default {
  name:'LowerCodeDisplay',
  props:['command'],
  data() {
    return {
      result:''
    }
  },
  methods: {
    runFFmpeg(){
      const head = this.command[0]
      const commandList = this.command.slice(1, this.command.length)
      console.log('head:',head);
      console.log('paras:', commandList)
      // const { spawn } = require('electron')
      const ffmpeg = spawn(head, commandList)
  
      ffmpeg.stdout.on('data', (data)=>{
        console.log(data.toString());
        this.result = data.toString()
      });
    
      ffmpeg.stderr.on('data', (data)=>{
        console.log(data.toString());
        this.result = data.toString()
      });   
    }
  },
  computed:{
    cmdStringDis(){
      return this.command.join(' ')
    }
  },
  mounted() {
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