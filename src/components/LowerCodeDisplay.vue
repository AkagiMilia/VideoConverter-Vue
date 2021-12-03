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
        <a-button type="primary" size="large" @click.stop="pauseFFmpeg">
          PAUSE
        </a-button>
        <a-button type="primary" size="large" @click.stop="continueFFmpeg">
          CONTINUE
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
      result:'',
      ffmpeg:null
    }
  },
  methods: {
    runFFmpeg(){
      const head = this.command[0]
      const commandList = this.command.slice(1, this.command.length)
      console.log('head:',head);
      console.log('paras:', commandList)
      // const { spawn } = require('electron')
      this.ffmpeg = spawn(head, commandList)
  
      this.ffmpeg.stdout.on('data', (data)=>{
        console.log(data.toString());
        this.result = data.toString()
      })
    
      this.ffmpeg.stderr.on('data', (data)=>{
        console.log(data.toString());
        this.result = data.toString()
      })

      this.ffmpeg.stderr.on('close', (code)=>{
        console.log('Convert End!!!!!!!!!');
        if (code != 0)
          console.log('process end with code:', code);
      })
    },
    pauseFFmpeg(){
      this.ffmpeg.kill('SIGSTOP')
    },
    continueFFmpeg(){
      this.ffmpeg.kill('SIGCONT')
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