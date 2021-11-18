<template>
  <a-col :span="12" class="shadow-sm border px-3" id="divParamLists">
    <div 
      v-infinite-scroll="loadMore" 
      infinite-scroll-disabled="busy" 
      infinite-scroll-distance="10" 
      class="divParamList" 
      :style="{height:localHeight+'px'}"
    >
    <ul class="list-group">
      <li class="list-group-item" :class="selectedStyles[key]" v-for="(param, key) in parameterObject" :key='key' @click="addParam(key, param)" @mouseenter="showGuidance(key, param)">
        <div class="d-flex justify-content-between">
          <div class="">
            <span>{{key}}</span>
          </div>
          <div class="">
            <a-tag 
              :color="ColorValueType[param.valueType] ? ColorValueType[param.valueType] : 'blue'">
              {{param.valueType}}
            </a-tag>
          </div>
        </div>
      </li>
    </ul>
    </div>
  </a-col>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name:'UpperRightParams',
  props:['currentAudio', 'currentVideo', 'currentFormat', 'currentType', 'currentParameter', 'localHeight'],
  data(){
    return{
      parameterObject:{},
      currentDict:'',
      isSubParam:false,
      busy:false,
      ColorValueType:{
        string:'orange',
        int:'blue',
        float:'blue',
        boolean:'green',
        dictionary:'cyan',
        flags:'pink'
      }
    }
  },
  methods: {
    displayParameter(param, type){
      if (type == 'video')
        var searchType = this.currentVideo
      else if (type == 'audio')
        var searchType = this.currentAudio
      console.log('searching param:', param);
      console.log('searching type:',searchType);
      if (this.showingParams[searchType]){
        for(let [key, value] of Object.entries(this.showingParams[searchType])){
          if (key == param || param.startsWith('-c:')){
            if (value.valueType.startsWith('dic')){
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
              this.parameterObject = this.showingParams[searchType]
            break
          }
        }
        // this.parameterObject = this.showingParams[this.currentVideo]
      }
      console.log('current parameter list is:\n', this.parameterObject)
    },
    addParam(key, value){
      if (this.isSubParam){
        console.log('I am a subParam')
        this.$bus.$emit('addParam', this.currentType, key, value, this.currentDict)
      }
      else{
        this.$bus.$emit('addParam', this.currentType, key, value, null)
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
          if (this.currentParameter[this.currentType][this.currentDict] && key in this.currentParameter[this.currentType][this.currentDict])
            dict[key] = 'bg-primary bg-opacity-25'
          else
            dict[key] = ''
        }
      }
      else{
        for (let key of Object.keys(this.parameterObject)){
          if (this.currentParameter[this.currentType] && key in this.currentParameter[this.currentType])
            dict[key] = 'bg-primary bg-opacity-25'
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