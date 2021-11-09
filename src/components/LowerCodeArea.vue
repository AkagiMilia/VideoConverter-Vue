<template>
  <div class="container" id="divCodeArea">
      <form id="Codeform" class="form-horizontal">
        <div class="row">
          <!-- <div class="col"><textarea class="form-control" rows="6" id="codeInps" v-model.trim.lazy="cmdStringInpts"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeVideo" v-model.trim.lazy="cmdStringVideo"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeAudio" v-model.trim.lazy="cmdStringAudio"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeOups" v-model.trim.lazy="cmdStringOups"></textarea></div> -->
          <!-- <div class="col"><textarea class="form-control" rows="6" id="codeInps" v-model.trim.lazy="maping"></textarea></div> -->
          <div class="col">
            <textarea class="form-control" id="codeVideo" rows="6" v-model.trim.lazy="video"></textarea>
            <!-- <label for="codeVideo">Video Params</label> -->
          </div>
          
          <div class="col">
            <textarea class="form-control" id="codeAudio" rows="6" v-model.trim.lazy="audio"></textarea>
            <!-- <label for="codeAudio">Video Params</label> -->
          </div>
          
          <!-- <div class="col"><textarea class="form-control" rows="6" id="codeOups" ></textarea></div> -->
        </div>
      </form>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name:'LowerCodeArea',
  props:['parameters', 'currentParameter', 'currentProjectId', 'currentFormat'],
  computed:{
    maping:{
      get(){
        var line = ''
        Object.keys(this.currentParameter.maping).forEach((key)=>{
          line += key + ' '
          line += this.currentParameter.maping[key] + ' '
        })
        return line
      },
      set(value){
        this.updateParams(value, 'maping')
      }
    },
    video:{
      get(){
        var line = ''
        Object.keys(this.currentParameter.video).forEach((key)=>{
          line += key + ' '
          if (typeof this.currentParameter.video[key] == 'object'){
            var valLine = ''
            for (let [key, value] of Object.entries(this.currentParameter.video[key])){
              valLine += key+'='+value+':'
            }
            valLine = valLine.substr(0, valLine.length-1)
            line += valLine + ' '
          }
          else
            line += this.currentParameter.video[key] + ' '
        })
        return line
      },
      set(value){
        this.updateParams(value, 'video')
      }
    },
    audio:{
      get(){
        var line = ''
        Object.keys(this.currentParameter.audio).forEach((key)=>{
          line += key + ' '
          line += this.currentParameter.audio[key] + ' '
        })
        return line
      },
      set(value){
        this.updateParams(value, 'audio')
      }
    },
    ...mapState('indexData', ['showingParams'])
  },
  methods: {
    updateParams(value, type){
      // transfer the string cmd line to a list
      value = value.split(' ')
      value = value.filter(param => param != '')
      var index = 0
      const len = value.length - 1
      // translated object send to App
      var newObject = {}
      while(index <= len){
        if (value[index].startsWith('-')){
          var paramInfo = null
          // read parameter info
          if (this.showingParams[this.currentFormat])
            paramInfo = this.showingParams[this.currentFormat][value[index]]
          console.log('paramInfo:',paramInfo);
          if (index+1<=len && !value[index+1].startsWith('-')){
            if (paramInfo && paramInfo['valueType'].startsWith('dic')){
              var newSubObject = {}
              var valList = value[index+1].split(':')
              for (let val of valList){
                if (val.indexOf('=')<0)
                  val += '=value'
                val = val.split('=')
                newSubObject[val[0]] = val[1]
              }
              newObject[value[index]] = newSubObject
            }
            else
              newObject[value[index]] = value[index+1]
            index += 2
          }
          else{
            if (paramInfo && paramInfo['valueType'].startsWith('dic')){
              newObject[value[index]] = {'param':'value'}
            }  
            else
              newObject[value[index]] = '1'
            index += 1
          }
        }
        else index +=1
      }
      this.$bus.$emit('updateParams', newObject, type)
    }
  },
  mounted() {
    console.log(this.currentProjectId);
    console.log(this.parameters);
  },
}
</script>

<style scoped>

  #divCodeArea{
    height: 100%;
  }
</style>