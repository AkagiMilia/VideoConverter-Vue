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
            <textarea class="form-control" id="codeVideo" rows="6" v-model.trim.lazy="paramLine" spellcheck="false"></textarea>
            <!-- <label for="codeVideo">Video Params</label> -->
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
    paramLine:{
      get(){
        var line = ''
        for (let type of Object.keys(this.currentParameter)){
          if (typeof this.currentParameter[type] != 'object')
            continue
          Object.keys(this.currentParameter[type]).forEach((key)=>{
            line += key + ' '
            if (typeof this.currentParameter[type][key] == 'object'){
              var valLine = ''
              for (let [key, value] of Object.entries(this.currentParameter[type][key])){
                valLine += key+'='+value+':'
              }
              valLine = valLine.substr(0, valLine.length-1)
              line += valLine + ' '
            }
            else
              line += this.currentParameter[type][key] + ' '
          })
        }
        return line
      },
      set(value){
        this.updateParams(value)
      }
    },
    ...mapState('indexData', ['showingParams', 'markParams'])
  },
  methods: {
    updateParams(paramLine){
      // transfer the string cmd line to a list
      paramLine = paramLine.split(' ')
      paramLine = paramLine.filter(param => param != '')
      var markLists = []
      var index = 0
      var cutPoint = 0
      var isStart = true
      var storeType = ''
      for (let word of paramLine){
        for (let type of ['video', 'audio']){
          for (let mark of this.markParams[type]){
            if (mark.startsWith(word)){
              if (isStart){
                isStart = false
                storeType = type
                cutPoint = index
                break
              }
              markLists.push({
                type:storeType, 
                value:paramLine.slice(cutPoint, index),
                format:paramLine[cutPoint+1]
                })
              storeType = type
              cutPoint = index
              break
            }
          }
        }
        index += 1
      }
      markLists.push({type:storeType, 
        value:paramLine.slice(cutPoint),
        format:paramLine[cutPoint+1]
      })
      // translated object send to App
      var submitObject = {}
      for (let markList of markLists){
        var newObject = {}
        var { value } = markList
        var len = value.length - 1
        index = 0
        while(index <= len){
          if (value[index].startsWith('-') && !+value[index].substr(1)){
            var paramInfo = null
            // read parameter info
            if (this.showingParams[markList.format])
              paramInfo = this.showingParams[markList.format][value[index]]
            console.log('paramInfo:',paramInfo);
            if (index+1<=len && (!value[index+1].startsWith('-') || +value[index+1].substr(1))){
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
        submitObject[markList.type] = {...submitObject[markList.type], ...newObject}
      }
      console.log('cmdLine -> Object:', submitObject)
      this.$bus.$emit('updateParams', submitObject)
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