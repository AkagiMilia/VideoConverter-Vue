<template>
  <a-row class="form-floating">
    <textarea 
      class="form-control border-0 font-monospace" id="floatingTextarea2" 
      v-model.trim.lazy="paramLine" 
      @keydown.enter="editExit" 
      spellcheck="false" 
      :style="{height:localHeight+'px'}"
    />
    <label for="floatingTextarea2" >Code Area</label>
  </a-row>
</template>

<script>  
import { mapState } from 'vuex'
export default {
  name:'LowerCodeArea',
  props:['currentParameter', 'currentProjectId', 'currentFormat', 'localHeight'],
  data() {
    return {
      msg:'',
      highlight: [
        {text:'chicken', style:"background-color:#f37373"},
      ]
    }
  },
  computed:{

    // Current parameter string
    paramLine:{
      // Translate the parameters to string displaying on the input area
      get(){
        var line = ''
        if (!this.currentParameter.length)
          return line
        for (let stream of this.currentParameter){
          line += stream.mark + ' '
          line += stream.format + ' '
          for (let [key, value] of Object.entries(stream.params)){
            line += key + ' '
            if (value == undefined)
              continue
            if (value.constructor == Object){
              var valLine = ''
              for (let [subKey, subValue] of Object.entries(value)){
                valLine += subKey+'='+subValue+':'
              }
              valLine = valLine.substr(0, valLine.length-1)
              line += valLine + ' '
            }
            else if(value.constructor == Array){
              var valLine = ''
              for (let subKey of value){
                valLine += subKey+'+'
              }
              valLine = valLine.substr(0, valLine.length-1)
              line += valLine + ' '
            }
            else
              line += value + ' '
          }
        }
        return line
      },
      // Set the string to parameter objects after the input changing
      set(value){
        this.updateParams(value)
      }
    },
    ...mapState('indexData', ['showingParams', 'markParams', 'videoOptions'])
  },
  methods: {
    editExit(event){
      event.target.blur()
    },

    // Translate parameter sting to an array including streams parameter objects 
    // and send them to App
    updateParams(paramLine){
      if (!paramLine){
        console.log('empty inputs')
        var markLists = [
          {
            streamType:'video',
            mark:'-c:v',
            format:'copy',
            params:{}
          },
          {
            streamType:'audio',
            mark:'-c:a',
            format:'copy',
            params:{}
          }
        ]
        this.$bus.$emit('updateParams', markLists)
        return
      }
      paramLine = paramLine.split(' ')
      paramLine = paramLine.filter(param => param != '')
      var markLists = []
      var index = 0
      var cutPoint = 0
      var isStart = true
      var streamType = ''
      for (let word of paramLine){
        for (let type of ['video', 'audio']){
          for (let mark of this.markParams[type]){
            if (word.startsWith(mark)){
              if (isStart){
                isStart = false
                streamType = type
                cutPoint = index
                break
              }
              markLists.push({
                streamType,
                mark:paramLine[cutPoint],
                format:!paramLine[cutPoint+1].startsWith('-') ? paramLine[cutPoint+1] : 'copy',
                params:!paramLine[cutPoint+1].startsWith('-') ? paramLine.slice(cutPoint+2, index) : paramLine.slice(cutPoint+1, index)
                })
              streamType = type
              cutPoint = index
              break
            }
          }
        }
        index += 1
      }
      markLists.push({
        streamType, 
        mark:paramLine[cutPoint],
        params:paramLine[cutPoint+1] && !paramLine[cutPoint+1].startsWith('-') ? paramLine.slice(cutPoint+2) : paramLine.slice(cutPoint+1),
        format:paramLine[cutPoint+1] && !paramLine[cutPoint+1].startsWith('-') ? paramLine[cutPoint+1] : 'copy',
      })

      for (let markList of markLists){
        var newObject = {}
        var { params } = markList
        var len = params.length - 1
        index = 0
        while(index <= len){
          if (params[index].startsWith('-') && !+params[index].substr(1)){

            // get Param's Information
            var paramInfo = null
            var markIndex = params[index].indexOf(':')
            if (this.showingParams[markList.format])
              paramInfo = this.showingParams[markList.format][params[index]]
            if (this.videoOptions[params[index].slice(0, markIndex>-1 ? markIndex : params[index].length)]){
              paramInfo = this.videoOptions[params[index].slice(0, markIndex>-1 ? markIndex : params[index].length)]
            }
            
            // Analyze Parameters
            // If this current value start with '-' (e.g. '-crf') and the next value is a legal value 
            if (index+1<=len && (!params[index+1].startsWith('-') || +params[index+1].substr(1))){
              if (paramInfo && paramInfo['valueType'].startsWith('dict')){
                var newSubObject = {}
                var valList = params[index+1].split(':')
                for (let val of valList){
                  if (val.indexOf('=')<0)
                    val += '=value'
                  val = val.split('=')
                  newSubObject[val[0]] = val[1]
                }
                newObject[params[index]] = newSubObject
              }
              else if (paramInfo && paramInfo['valueType'].startsWith('flag')){
                var valList = params[index+1].split('+')
                newObject[params[index]] = valList
              }
              else
                newObject[params[index]] = params[index+1]
              index += 2
            }
            // Else, we consider there is an missing value for the parameter
            // and here it will make an auto-complete
            else{
              if (paramInfo && paramInfo['valueType'].startsWith('dict')){
                newObject[params[index]] = {'param':'value'}
              }
              else if (paramInfo && paramInfo['valueType'].startsWith('flag')){
                newObject[params[index]] = ['flag']
              }
              else if (paramInfo && paramInfo['valueType'] == 'none')
                newObject[params[index]] = undefined
              else if (paramInfo)
                newObject[params[index]] = '1'
              else
                newObject[params[index]] = undefined
              index += 1
            }
          }
          else index +=1
        }
        markList.params = newObject
      }
      console.log('cmdLine -> Object:', markLists)
      this.$bus.$emit('updateParams', markLists)
    }
  },
  mounted() {
    console.log(this.currentProjectId);
  },
}
</script>

<style scoped>

  #divCodeArea{
    height: 100%;
  }
  textarea::-webkit-scrollbar-thumb{
    background-color:rgb(117, 117, 117);
  }
  textarea::-webkit-scrollbar{
    border-left-color: rgb(170, 170, 170);
  }
</style>