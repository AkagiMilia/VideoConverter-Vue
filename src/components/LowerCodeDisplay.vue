<template>
  <div>
    <a-row class="border-0 border-bottom row align-items-center bg-light">
      <a-col :span="18" class="border-0 border-end ps-3">
        <p id="codeArea" class="align-self-center mt-2">{{cmdStringDis}}</p>
      </a-col>
      <a-col :span="6" align="middle">
        <a-space>
          <a-button type="primary" size="large" @click.stop="runFFmpeg">
            {{buttonNames.switch}}
          </a-button>
          <a-button v-show="processState.isRunning" type="primary" size="large" @click.stop="pauseFFmpeg">
            {{buttonNames.control}}
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row>
      <p id="pLogProcess">{{result}}</p>
    </a-row> 
  </div>
</template>

<script>
const { spawn } = require('child_process')
console.log('spawn is ', spawn)


export default {
  name:'LowerCodeDisplay',
  props:['command', 'isMac'],
  data() {
    return {
      result:'',
      buttonNames:{
        switch:'START',
        control:'PAUSE'
      },
      processState:{
        isRunning:false,
        isPause:false
      },
      ffmpeg:null
    }
  },
  methods: {
    runFFmpeg(){

      if (!this.processState.isRunning){
        this.processState.isRunning = true
        this.buttonNames.switch = 'STOP'

        const head = this.command[0]
        const commandList = this.command.slice(1, this.command.length)
        console.log('head:',head);
        console.log('paras:', commandList)
        // const { spawn } = require('electron')
        this.ffmpeg = spawn(head, commandList)
    
        this.ffmpeg.stdout.on('data', (data)=>{
          
          console.log(data.toString())
          this.result = data.toString()
        })

        this.$bus.$emit('getRunningState', true)
        this.ffmpeg.stderr.on('data', (data)=>{
          var result = data.toString()
          console.log(result)
          if (result.indexOf('speed')>-1){
            result = result.replace(/=\s+/g, '=')
            result = result.replace(/[\r\n]/g, '')
            result = result.split(' ')
            result = result.filter(val => val != '')
            var infoObj = {}
            for (let unit of result){
              var equalIndex = unit.indexOf('=')
              if (equalIndex>-1){
                infoObj[unit.slice(0, equalIndex)] = unit.slice(equalIndex+1)
              }
            }
            this.result = infoObj
          }
            
        })

        this.ffmpeg.stderr.on('close', (code)=>{
          console.log('Convert End!!!!!!!!!')
          this.processState.isRunning = false
          this.buttonNames.switch = 'START'
          this.buttonNames.control = 'PAUSE'
          this.$bus.$emit('getRunningState', false)
          if (code != 0)
            console.log('process end with code:', code)
        })
      }
      else{
        this.ffmpeg.kill()
        this.processState.isRunning = false
        this.buttonNames.switch = 'START'
        this.buttonNames.control = 'PAUSE'
      }
      
    },
    pauseFFmpeg(){
      console.log(this.ffmpeg.pid)
      if (this.processState.isPause){
        if (this.isMac)
          this.ffmpeg.kill('SIGCONT')
        this.processState.isPause = false
        this.buttonNames.control = 'PAUSE'
      }
      else{
        if (this.isMac)
          this.ffmpeg.kill('SIGSTOP')
        this.processState.isPause = true
        this.buttonNames.control = 'CONTINUE'
      }
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