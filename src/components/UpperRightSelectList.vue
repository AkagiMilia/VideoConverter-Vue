<template>
  <ul class="list-group" ref="test">
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
            />
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { TouchBarOtherItemsProxy } from 'electron'
import { mapState } from 'vuex'
export default {
  name:'UpperRightSelectList',
  props:['currentParameter', 'type', 'currentFormat'],
  data() {
    return {
      nowFocus:'',
      busy:false,
      dataSource:[]
    }
  },
  computed:{
    Selected(){
      return this.currentParameter[this.type]
    },
    ...mapState('indexData', ['showingParams']),
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
      
      setTimeout(() => {
        this.nowFocus = param
        var refName = 'input'+param
        if (refName in this.$refs && this.$refs[refName][0]){
          console.log('ref auto-complete:', this.$refs[refName][0]);
          this.$refs[refName][0].focus()
        }
      }, 200);
      this.$bus.$emit('updateFormat', this.type)
      
      if (father){
        this.$bus.$emit('searchParameter', father, this.type)
        this.$bus.$emit('showGuidance', param, this.showingParams[this.currentFormat][father]['subValues'][param])
      }  
      else{
        this.$bus.$emit('searchParameter', param, this.type)
        if (!param.startsWith('-c'))
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
    sendParam(curVal){
      var newObj = {}
        for (let [key, value] of Object.entries(curVal)){
          newObj[key] = value
        }
        this.$bus.$emit('updateParams', newObj, this.type)
    },
    onSearch(){
      try {
        if (this.showingParams[this.currentFormat][this.nowFocus]['subValues']){
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
    // Object.keys(this.currentParameter[this.type]).forEach((key)=>{
    //   if (key.includes('-c:')){
    //     this.currentForm = this.currentParameter[this.type][key]
    //     console.log('this for is:', this.currentForm);
    //     return
    //   }
    // })
    // console.log(typeof this.Selected['-crf'] == 'object')
  },
}
</script>

<style scoped>
  #divParamPicked{
    height: 100%;
  }
</style>