<template>
  <ul class="list-group" ref="test">
    <li>
      <span>{{streamInfo.mark}}</span>
      <span>{{streamInfo.format}}</span>
    </li>
    <li class="list-group-item" :class="warningStyles[param]" v-for="(value, param) in Selected" :key="param" @click="paramClick(param)">
      <span>{{param}}</span>
      <span v-if="typeof Selected[param] == 'string'" v-show="param!=nowFocus">  {{value}}</span>
      <a-auto-complete
        type="text" 
        :data-source="dataSource"
        v-if="typeof Selected[param] == 'string'"
        v-model.trim.lazy="Selected[param]"
        v-show="param==nowFocus"
        @blur="paramExit(param, null, $event)"
        @focus="paramFocus"
        @search="onSearch"
        :ref="'input'+param"
        spellcheck="false"
        />
      <ul class="list-group" v-if="typeof Selected[param] == 'object'">
        <li class="list-group-item" :class="warningStyles[subParam]" v-for="(subVal, subParam) in Selected[param]" :key="subParam" @click.stop="paramClick(subParam, param)">
          <span>{{subParam}}</span>
          <span v-show="subParam!=nowFocus">  {{subVal}}</span>
          <a-auto-complete 
            type="text" 
            :data-source="dataSource"
            v-model.trim.lazy="Selected[param][subParam]"
            v-show="subParam==nowFocus"
            @blur="paramExit(param, subParam, $event)"
            @search="onSearch"
            :ref="'input'+subParam"
            spellcheck="false"
            />
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name:'UpperRightSelectList',
  props:['streamInfo', 'type'],
  data() {
    return {
      nowFocus:'',
      busy:false,
      dataSource:[],
      currentParam:''
    }
  },
  computed:{
    Selected(){
      return this.streamInfo.params
    },
    currentFormat:{
      get(){
        return this.streamInfo.format
      }
    },
    ...mapState('indexData', ['showingParams', 'markParams', 'encodersInfo']),
    warningStyles(){
      var dict = {}
      for (let [key, value] of Object.entries(this.Selected)){
        if (typeof value == 'object'){
          for (let subKey of Object.keys(value)){
            if (this.showingParams[this.currentFormat][key] && this.showingParams[this.currentFormat][key]['subValues'] && subKey in this.showingParams[this.currentFormat][key]['subValues'])
              dict[subKey] = ''
            else
              dict[subKey] = 'bg-warning'
          }
        }
        if (this.currentFormat in this.showingParams && key in this.showingParams[this.currentFormat])
          dict[key] = ''
        else if (key.startsWith('-c:'))
          dict[key] = ''
        else
          dict[key] = 'bg-warning'
      }
      return dict
    }
  },
  methods: {
    paramClick(param, father=null){
      this.currentParam = param
      setTimeout(() => {
        this.nowFocus = param
        var refName = 'input'+param
        if (refName in this.$refs && this.$refs[refName][0]){
          console.log('ref auto-complete:', this.$refs[refName][0]);
          this.$refs[refName][0].focus()
        }
      }, 200);
      this.$bus.$emit('switchStream', this.streamInfo.streamId)
      
      if (father){
        this.$bus.$emit('searchParameter', father, this.streamInfo.streamType)
        this.$bus.$emit('showGuidance', param, this.showingParams[this.currentFormat][father]['subValues'][param])
      }  
      else{
        this.$bus.$emit('searchParameter', param, this.streamInfo.streamType)
        if (!param.startsWith('-c:'))
          this.$bus.$emit('showGuidance', param, this.showingParams[this.currentFormat][param])
      }  
    },
    paramExit(param,subParam,value){
      console.log('param:',param)
      console.log('subParam:',subParam)
      if (!value.trim()){
        if (subParam)
          this.Selected[param][subParam] = '1'
        else
          this.Selected[param] = '1'
      }
      this.nowFocus = ''
      this.sendParam({...this.Selected})
      this.dataSource = []
    },
    sendParam(params){
      this.$bus.$emit('updateParams', params, this.streamInfo.streamType, this.streamInfo.streamId)
    },
    onSearch(){
      try {
        console.log(this.currentParam);
        if (this.markParams.video.indexOf(this.currentParam) > -1){
          this.dataSource = Object.keys(this.encodersInfo.videos)
        }
        else if (this.markParams.audio.indexOf(this.currentParam) > -1){
          this.dataSource = Object.keys(this.encodersInfo.audios)
        }
        else if (this.showingParams[this.currentFormat][this.nowFocus]['subValues']){
          this.dataSource = Object.keys(this.showingParams[this.currentFormat][this.nowFocus]['subValues'])
        }
      } catch (error) {
        console.log('%c Object Read Error', 'color:orange');
      }
    },
    paramFocus(){
      this.onSearch()
    }
  },
  beforeMount() {
  },
}
</script>

<style scoped>
  #divParamPicked{
    height: 100%;
  }
</style>