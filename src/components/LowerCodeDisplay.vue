<template>
  <div>
    <a-row class="border-0 border-bottom row align-items-center bg-light">
      <a-col :span="18" class="border-0 border-end ps-3">
        <p id="codeArea" class="align-self-center mt-2">{{cmdStringDis}}</p>
      </a-col>
      <a-col :span="6" align="middle">
        <a-button type="primary" size="large" @click.stop="runFFmpeg">
          START
        </a-button>
      </a-col>
    </a-row>
    <a-row>
      <p id="pLogProcess">{{result}}</p>
    </a-row> 
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
  
</style>