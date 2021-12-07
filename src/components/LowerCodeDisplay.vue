<template>
  <div class="overflow-auto">
    <a-row class="border-0 border-bottom row align-items-center bg-light " :style="{height:localHeight+'px'}">
      
      <a-col :span="18" class="border-0 border-end ps-3" >
        <h5>Full Command Line</h5>
        <a-row :style="{height:localHeight-35+'px'}" class=" overflow-auto">
          <p id="codeArea" class="align-self-center mt-2">{{cmdStringDis}}</p>
        </a-row>
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
  </div>
</template>

<script>
const { spawn, exec } = require('child_process')
const path = require('path')
console.log('spawn is ', spawn)


export default {
  name:'LowerCodeDisplay',
  props:['command', 'isMac', 'localHeight'],
  data() {
    return {
      result:'',
      buttonNames:{
        switch:'START',
        control:'PAUSE'
      },
      processState:{
        isRunning:false,
        isPause:false,
        isFail:false
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
        const launchPath = path.join(__static, 'temp')
        console.log('launchPath:', launchPath)
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
            this.$bus.$emit('getRunningProgress', infoObj)
          }
            
        })

        this.ffmpeg.stderr.on('close', (code)=>{
          console.log('Convert End!!!!!!!!!')
          this.processState.isRunning = false
          this.buttonNames.switch = 'START'
          this.buttonNames.control = 'PAUSE'
          this.$bus.$emit('getRunningState', false, this.processState.isFail)
          this.processState.isFail = false
          if (code != 0)
            console.log('process end with code:', code)
        })
      }
      else{
        this.ffmpeg.kill()
        this.processState.isFail = true
        this.processState.isRunning = false
        this.buttonNames.switch = 'START'
        this.buttonNames.control = 'PAUSE'
      }
      
    },
    pauseFFmpeg(){
      // if pause, continue
      if (this.processState.isPause){
        if (this.isMac)
          this.ffmpeg.kill('SIGCONT')
        else{
          const cwd = path.join(__static, 'tools')
          exec(`.\\pssuspend.exe -r ${this.ffmpeg.pid}`, { cwd }, (error, stdout, stderr)=>{
            if (error)
              console.log('error:', error)
            if (stdout)
              console.log('stdout:', stdout)
            if (stderr)
              console.log('stderr:', stderr)
          })
        }
        this.processState.isPause = false
        this.buttonNames.control = 'PAUSE'
      }
      // else pause
      else{
        if (this.isMac)
          this.ffmpeg.kill('SIGSTOP')
        else{
          const cwd = path.join(__static, 'tools')
          exec(`.\\pssuspend.exe ${this.ffmpeg.pid}`, { cwd }, (error, stdout, stderr)=>{
            if (error)
              console.log('error:', error)
            if (stdout)
              console.log('stdout:', stdout)
            if (stderr)
              console.log('stderr:', stderr)
          })
        }
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