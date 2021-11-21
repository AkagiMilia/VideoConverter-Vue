<template>
  <a-col :span="12" class="border" id="divParamLists">
    <div 
      v-infinite-scroll="loadMore" 
      infinite-scroll-disabled="busy" 
      infinite-scroll-distance="10" 
      class="divParamList" 
      :style="{height:localHeight+'px'}"
    >
    <ul class="list-group list-group-flush">
      <li class="list-group-item list-group-item-action" :class="selectedStyles[paramName]" v-for="(paramInfo, paramName) in parameterObject" :key='paramName' @click="addParam(paramName, paramInfo)" @mouseenter="showGuidance(paramName, paramInfo)">
        <div class="d-flex justify-content-between">
          <div class="">
            <span>{{paramName}}</span>
          </div>
          <div class="">
            <a-tag 
              :color="ColorValueType[paramInfo.valueType] ? ColorValueType[paramInfo.valueType] : 'blue'">
              {{paramInfo.valueType}}
            </a-tag>
          </div>
        </div>
      </li>
    </ul>
    </div>
  </a-col>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name:'UpperRightParams',
  props:['currentFormat', 'currentStreamId', 'currentStream', 'currentType', 'localHeight'],
  data(){
    return{
      parameterObject:{},
      currentDict:'',
      isSubParam:false,
      busy:false,
      ColorValueType:{
        string:'orange',
        int:'blue',
        float:'cyan',
        boolean:'green',
        dictionary:'purple',
        flags:'pink'
      }
    }
  },
  methods: {
    displayParameter(param, type){
      console.log('searching param:', param)
      console.log('searching type:', type);
      var searchFormat = this.currentStream.format
      console.log('searching format:',searchFormat);
      if (this.showingParams[searchFormat]){
        for(let [key, value] of Object.entries(this.showingParams[searchFormat])){
          if (key == param || param.startsWith('-c:')){
            if (value.valueType.startsWith('dict')){
              this.$nextTick(function(){
                this.parameterObject = value.subValues
                this.currentDict = key
                this.isSubParam = true
              })
              break
            }
            else
              console.log('set sub False!')
              this.isSubParam = false
              this.parameterObject = this.showingParams[searchFormat]
            break
          }
        }
        // this.parameterObject = this.showingParams[this.currentVideo]
      }
      console.log('current parameter list is:\n', this.parameterObject)
    },
    addParam(paramName, paramInfo){
      if (this.isSubParam){
        console.log('I am a subParam')
        this.$bus.$emit('addParam', paramName, paramInfo, this.currentDict)
      }
      else{
        this.$bus.$emit('addParam', paramName, paramInfo, null)
      }
    },
    refreshParameter(curV){
      this.parameterObject = this.showingParams[curV]
    },
    empitParameter(){
      this.parameterObject = {}
    },
    showGuidance(key, param){
      this.$bus.$emit('showGuidance', key, param)
    },
    loadMore(){
      this.busy = false
    }
  },
  computed:{
    ...mapState('indexData',['showingParams']),
    selectedStyles(){
      var dict = {}
      if (this.isSubParam){
        for (let key of Object.keys(this.parameterObject)){
          if (this.currentStream.params[this.currentDict] && key in this.currentStream.params[this.currentDict])
            dict[key] = 'list-group-item-info'
          else
            dict[key] = ''
        }
      }
      else{
        for (let key of Object.keys(this.parameterObject)){
          if (this.currentStream.params && key in this.currentStream.params)
            dict[key] = 'list-group-item-info'
          else
            dict[key] = ''
        }
      }
      return dict
    }
  },
  beforeMount() {
    this.$bus.$on('searchParameter', this.displayParameter)
    this.$bus.$on('refreshParameter', this.refreshParameter)
    this.$bus.$on('empitParameter', this.empitParameter)
  },
  mounted(){
    
}
}
</script>

<style scoped>
  #divParamLists{
    height: 100%;
  }
  .divParamList{
    overflow: auto;
  }
</style>