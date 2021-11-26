<template>
  <a-row :span="24">
    <textarea class="form-control" v-model.trim.lazy="paramLine" spellcheck="false" rows="3"/>
    <!-- <div @="editExit">
      <highlightable-input
        highlight-style="background-color:yellow" 
        :highlight-enabled="true" 
        :highlight="highlight"
        v-model.trim.lazy="paramLine"
        spellcheck="false"
        ref="inputArea"
      />
    </div> -->
  </a-row>
</template>

<script>
import { mapState } from 'vuex'
import HighlightableInput from 'vue-highlightable-input'
export default {
  name:'LowerCodeArea',
  components:{
    HighlightableInput
  },
  props:['currentParameter', 'currentProjectId', 'currentFormat'],
  data() {
    return {
      msg:'',
      highlight: [
        {text:'chicken', style:"background-color:#f37373"},
      ]
    }
  },
  computed:{
    paramLine:{
      get(){
        var line = ''
        console.log(`${this.currentParameter}`);
        for (let stream of this.currentParameter){
          line += stream.mark + ' '
          line += stream.format + ' '
          for (let [key, value] of Object.entries(stream.params)){
            line += key + ' '
            if (typeof value == 'object'){
              var valLine = ''
              for (let [subKey, subValue] of Object.entries(value)){
                valLine += subKey+'='+subValue+':'
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
      set(value){
        this.updateParams(value)
      }
    },
    ...mapState('indexData', ['showingParams', 'markParams'])
  },
  methods: {
    editExit(event){
      console.log(this.$refs.inputArea);
    },
    updateParams(paramLine){
      // transfer the string cmd line to a list
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
      // translated object send to App
      for (let markList of markLists){
        var newObject = {}
        var { params } = markList
        var len = params.length - 1
        index = 0
        while(index <= len){
          if (params[index].startsWith('-') && !+params[index].substr(1)){
            var paramInfo = null
            // read parameter info
            if (this.showingParams[markList.format])
              paramInfo = this.showingParams[markList.format][params[index]]
            console.log('paramInfo:',paramInfo);
            if (index+1<=len && (!params[index+1].startsWith('-') || +params[index+1].substr(1))){
              if (paramInfo && paramInfo['valueType'].startsWith('dic')){
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
              else
                newObject[params[index]] = params[index+1]
              index += 2
            }
            else{
              if (paramInfo && paramInfo['valueType'].startsWith('dic')){
                newObject[params[index]] = {'param':'value'}
              }  
              else
                newObject[params[index]] = '1'
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
</style>