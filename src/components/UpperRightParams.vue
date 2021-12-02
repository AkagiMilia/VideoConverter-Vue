<template>
  <a-col :span="12" class="border border-end-0 bg-light" id="divParamLists">
    <div 
      v-infinite-scroll="loadMore" 
      infinite-scroll-disabled="busy" 
      infinite-scroll-distance="10" 
      class="divParamList" 
      :style="{height:localHeight+'px'}"
    >
    <ul v-if="currentStream.streamType == 'video'" class="list-group list-group-flush">
      <li class="list-group-item list-group-item-action titleList" @click="triggerVisible('videoOptions')">
        <div class="d-flex justify-content-between">
          <span class="fs-5">Video Options</span> 
        </div>
      </li>
      <li class="list-group-item list-group-item-action disabled" v-show="!displayList.videoOptions">
        Hidding
      </li>
      <li 
        class="list-group-item list-group-item-action border-0" 
        v-show="displayList.videoOptions"
        v-for="(paramInfo, paramName) in videoOptions" :key="paramName"
        :class="selectedStyles[paramName]" 
        @click="addParam(paramName, paramInfo)" 
        @mouseenter="showGuidance(paramName, paramInfo)"
      >
        <div class="d-flex justify-content-between">
          <div class="">
            <span><strong>{{paramName}}</strong></span>
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

    <ul class="list-group list-group-flush">
      <li class="list-group-item list-group-item-action titleList">
        <div class="d-flex justify-content-between">
          <span class="fs-5">{{currentStream.format.replace(/^\S/, s => s.toUpperCase())}}</span> 
        </div>
      </li>

      <li class="list-group-item list-group-item-action border-0" :class="selectedStyles[paramName]" v-for="(paramInfo, paramName) in parameterObject" :key='paramName' @click="addParam(paramName, paramInfo)" @mouseenter="showGuidance(paramName, paramInfo)">
        <div class="d-flex justify-content-between">
          <div class="">
            <span><strong>{{paramName}}</strong></span>
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
      parameterObject:{},           // Parameter candidates showing on the page
      currentDict:'',               // save the parameter name if it requires dictionary sub value
      isSubParam:false,             // wheter the selected candidate is a sub value
      busy:false,
      ColorValueType:{              // value type's showing colors
        string:'orange',
        int:'blue',
        float:'cyan',
        boolean:'green',
        dictionary:'purple',
        flags:'pink'
      },
      displayList:{}
    }
  },
  methods: {

    // Search the parameter candidate from guidance
    // and store the results
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
      }
      console.log('current parameter list is:\n', this.parameterObject)
    },

    // send new parameter information to the App after user clicking
    addParam(paramName, paramInfo){
      if (this.isSubParam){
        console.log('I am a subParam')
        this.$bus.$emit('addParam', paramName, paramInfo, this.currentDict)
      }
      else{
        var mark = this.currentStream.mark
        if (paramInfo.streamSpecifier)
          paramName += mark.slice(mark.indexOf(':'))
        this.$bus.$emit('addParam', paramName, paramInfo, null)
      }
    },

    // if the project or stream's format changed,
    // refresh the candidate
    refreshParameter(curV){
      this.parameterObject = this.showingParams[curV]
      this.isSubParam = false

    },

    // if the new format is not recorded in the guidance
    // show a blank list
    empitParameter(){
      this.parameterObject = {}
    },

    // if the user hover on the candidate, send it's information
    // and display its explanation on the component Guidance
    showGuidance(key, param){
      this.$bus.$emit('showGuidance', key, param)
    },

    triggerVisible(name){
      console.log('Give me Change!!!')
      this.$set(this.displayList, name, !this.displayList[name])
    },
    loadMore(){
      this.busy = false
    }
  },
  computed:{

    // Parameter guidance load from Vuex
    ...mapState('indexData',['showingParams', 'videoOptions']),

    // mark which parameter candidate has been selected 
    selectedStyles(){
      var dict = {}
      var mark = this.currentStream.mark
      var curStreamParam = this.currentStream.params
      for (let key of Object.keys(this.parameterObject)){
        if (this.isSubParam){
          if (curStreamParam[this.currentDict] && key in curStreamParam[this.currentDict])
            dict[key] = 'selected'
          else
            dict[key] = ''
        }
        else{
          if (curStreamParam && key in curStreamParam)
            dict[key] = 'selected'
          else
            dict[key] = ''
        }
      }
      if (this.currentStream.streamType == 'video'){
        for (let key of Object.keys(this.videoOptions)){
          if (this.videoOptions[key].streamSpecifier)
            var keyWithMark = key + mark.slice(mark.indexOf(':'))
          else
            var keyWithMark = key
          
          if (curStreamParam && keyWithMark in curStreamParam)
              dict[key] = 'list-group-item-info'
            else
              dict[key] = ''
        }
      }
      return dict
      
      /* if (this.isSubParam){
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
      } */
    }
  },
  beforeMount() {
    this.$bus.$on('searchParameter', this.displayParameter)
    this.$bus.$on('refreshParameter', this.refreshParameter)
    this.$bus.$on('empitParameter', this.empitParameter)
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
  .selected{
    background-color: rgb(240, 243, 255);
  }
  .titleList{
    background-color: rgb(158, 106, 255);
    color:white
  }
</style>