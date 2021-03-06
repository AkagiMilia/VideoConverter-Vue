<template>
  <ul class="list-group list-group-flush" ref="test">
    
    <li class="list-group-item list-group-item-action titleList" @click="switchStream(streamInfo.format)">
      
        <a-row type="flex" justify="space-between" align="middle">
          <!-- Video Icon -->
          <a-col>
            <a-space>
              <svg v-if="streamInfo.streamType == 'video'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-film" viewBox="0 0 16 16">
                <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
              </svg>
              <!-- Audio Icon -->
              <svg v-if="streamInfo.streamType == 'audio'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-file-music-fill" viewBox="0 0 16 16">
                <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm-.5 4.11v1.8l-2.5.5v5.09c0 .495-.301.883-.662 1.123C7.974 12.866 7.499 13 7 13c-.5 0-.974-.134-1.338-.377-.36-.24-.662-.628-.662-1.123s.301-.883.662-1.123C6.026 10.134 6.501 10 7 10c.356 0 .7.068 1 .196V4.41a1 1 0 0 1 .804-.98l1.5-.3a1 1 0 0 1 1.196.98z"/>
              </svg>
              <span class="fs-5" v-show="streamInfo.format!=nowFocus">{{streamInfo.format}}</span>
              <a-select
                show-search
                option-filter-prop="children"
                style="width:100px;fontSize:20px"
                v-show="streamInfo.format==nowFocus"
                :defaultValue="streamInfo.format"
                :filter-option="filterFormat"
                @blur="FormatExit"
                @click="switchStream(streamInfo.format)"
                ref="formSelect"
              >
                <a-select-option v-for="format in Object.keys(encodersInfo[streamInfo.streamType+'s'])" :key="format" :value="format">
                  <a-tooltip placement="left">
                    <template slot="title">
                      {{encodersInfo[streamInfo.streamType+'s'][format].explanation}}
                    </template>
                    <a-row>
                      {{format}}
                    </a-row>
                  </a-tooltip>
                </a-select-option>
              </a-select>
              <a-icon 
                v-show="streamInfo.format!=nowFocus" 
                style="fontSize:24px"
                type="down-square" 
                theme="filled" 
                @click="triggerFormatSelection(streamInfo.format)"/>
              <a-icon 
                v-show="streamInfo.format==nowFocus" 
                style="fontSize:24px"
                type="up-square" 
                theme="filled" 
                @click="triggerFormatSelection(streamInfo.format)"/>
            </a-space>
          </a-col>
          <a-col>
            <span style="fontSize:16px">{{streamInfo.mark}}</span>
          </a-col>
        </a-row>
        
    </li>

    <a-empty class="mt-3" v-if="!Object.keys(Selected).length" :description="false"/>

    <li class="list-group-item list-group-item-action paramList border-0" :class="warningStyles[param]" v-for="(value, param) in Selected" :key="param" @click="paramClick(param)">
      <a-row>
        <a-col :span="typeof Selected[param] == 'object' ? 23 : 12">
          <span><strong>{{param}}</strong></span>
        </a-col>
        <a-col v-show="typeof Selected[param] == 'string'" :span="11">
          <span 
            v-if="typeof Selected[param] == 'string'" 
            v-show="param!=nowFocus"
          >
            {{value}}
          </span>
          <a-auto-complete
            type="text" 
            :data-source="dataSource"
            v-if="typeof Selected[param] == 'string'"
            v-model.trim.lazy="Selected[param]"
            v-show="param==nowFocus"
            @keydown.enter="inputEnter"
            @blur="paramExit(param, null, $event)"
            @focus="paramFocus"
            @search="onSearch"
            :ref="'input'+param"
            spellcheck="false"
            />
        </a-col>
        
        <a-col :span="1">
          <a-icon 
            class="delete mt-1" 
            type="close-circle" 
            theme="twoTone" 
            twoToneColor="red"
            @click.stop="deleteParam(param, null)"
          />
        </a-col>
        
      </a-row>
      
      <!-- If parameter type is an object, -->
      <!-- show their sub parameters -->
      <ul class="list-group mt-2" v-if="Selected[param] && Selected[param].constructor == Object">
        <li class="list-group-item list-group-item-action subParamList border-0 border-start rounded-0" :class="warningStyles[subParam]" v-for="(subVal, subParam) in Selected[param]" :key="subParam" @click.stop="paramClick(subParam, param)">
          <a-row>
            <a-col :span="11">
              <span><strong>{{subParam}}</strong></span>
            </a-col>
            <a-col :span="11">
              <span v-show="subParam!=nowFocus">  {{subVal}}</span>
              <a-auto-complete 
                type="text" 
                :data-source="dataSource"
                v-model.trim.lazy="Selected[param][subParam]"
                v-show="subParam==nowFocus"
                @keydown.enter="inputEnter"
                @blur="paramExit(param, subParam, $event)"
                @search="onSearchSub"
                @focus="paramFocusSub"
                :ref="'input'+subParam"
                spellcheck="false"
              />
            </a-col>
            <a-icon 
              class="subDelete" 
              type="close-circle" 
              theme="twoTone" 
              twoToneColor="red"
              @click.stop="deleteParam(subParam, param, 'object')"
            />
          </a-row>
        </li>
      </ul>

      <!-- If parameter type is an array-->
      <ul class="list-group mt-2" v-if="Selected[param] && Selected[param].constructor == Array">
        <li class="list-group-item list-group-item-action subParamList border-0 border-start rounded-0" :class="warningStyles[subParam]" v-for=" subParam in Selected[param]" :key="subParam" @click.stop="paramClick(subParam, param)">
          <a-row>
            <a-col :span="22">
              <span><strong>{{subParam}}</strong></span>
            </a-col>
            <a-icon 
              class="subDelete" 
              type="close-circle" 
              theme="twoTone" 
              twoToneColor="red"
              @click.stop="deleteParam(subParam, param, 'array')"
            />
          </a-row>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name:'UpperRightSelectList',
  props:['streamInfo'],
  data() {
    return {
      nowFocus:'',        // the name of focusing parameter input 
      busy:false,
      dataSource:[],      // auto complete's data source
      currentParam:'',    // selected parameter
      currentDict:'',     
      ColorValueType:{              // value type's showing colors
        string:'orange',
        int:'blue',
        float:'cyan',
        boolean:'green',
        dictionary:'purple',
        flags:'pink'
      }
    }
  },
  computed:{

    // current stream's parameter showing on the list
    Selected(){
      return this.streamInfo.params
    },
    currentFormat:{
      get(){
        return this.streamInfo.format
      }
    },

    // load parameter guidance, 
    // and markers' information(e.g {video:['-c:v'], audio:['-c:a']}), 
    // and encoders' info
    ...mapState('indexData', ['showingParams', 'markParams', 'encodersInfo', 'videoOptions', 'audioOptions']),

    // mark the parameters who are not in the guidance
    warningStyles(){
      var dict = {}
      for (let [key, value] of Object.entries(this.Selected)){
        if ( value && value.constructor == Object){
          for (let subKey of Object.keys(value)){
            if (this.showingParams[this.currentFormat][key] && this.showingParams[this.currentFormat][key]['subValues'] && subKey in this.showingParams[this.currentFormat][key]['subValues'])
              dict[subKey] = ''
            else
              dict[subKey] = 'list-group-item-warning'
          }
        }
        if (this.showingParams[this.currentFormat] && key in this.showingParams[this.currentFormat])
          dict[key] = ''
        else if (key.slice(0, key.indexOf(':')>-1 ? key.indexOf(':') : key.length) in this.videoOptions)
          dict[key] = ''
        else if (key.slice(0, key.indexOf(':')>-1 ? key.indexOf(':') : key.length) in this.audioOptions)
          dict[key] = ''
        else
          dict[key] = 'list-group-item-warning'
      }
      return dict
    }
  },
  methods: {

    // show the input slot when user clicks certain parameter
    // and send the parameter info to the parameter candidate list
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
      this.switchStream()
      if (father){
        this.currentDict = father
        this.$bus.$emit('searchParameter', father, this.streamInfo.streamType)
        this.$bus.$emit('showGuidance', param, this.showingParams[this.currentFormat][father]['subValues'][param])
      }  
      else{
        this.$bus.$emit('searchParameter', param, this.streamInfo.streamType)
        if (this.showingParams[this.currentFormat][param])
          this.$bus.$emit('showGuidance', param, this.showingParams[this.currentFormat][param])
        else if (this.streamInfo.streamType == 'video'){
          var markIndex = param.indexOf(':')>-1 ? param.indexOf(':') : param.length
          this.$bus.$emit('showGuidance', param, this.videoOptions[param.slice(0, markIndex)])
        }
        else if (this.streamInfo.streamType == 'audio'){
          var markIndex = param.indexOf(':')>-1 ? param.indexOf(':') : param.length
          this.$bus.$emit('showGuidance', param, this.audioOptions[param.slice(0, markIndex)])
        }
      }  
    },

    inputEnter(event){
      console.log('enterDown:', event);
      event.target.blur()
    },


    // After finishing inputing value(lose focus), update the parameter value
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

    // Update the focusing stream
    // after user clicking this stream param list
    switchStream(format = null){
      if (format)
        this.$bus.$emit('refreshParameter', format)
      this.$bus.$emit('switchStream', this.streamInfo.streamId)
    },
    triggerFormatSelection(format){
      this.nowFocus = this.nowFocus == format ? '' : format
      this.$refs.formSelect.focus()
    },
    // update parameter value to App
    sendParam(params){
      this.$bus.$emit('updateParams', params, this.streamInfo.streamType, this.streamInfo.streamId)
    },

    deleteParam(param, father, type){
      this.$bus.$emit('deleteParam', this.streamInfo.streamId, param, father, type)
      this.switchStream()
    },

    // gather auto complete's candidate 
    // when the clicked paramerter has limited or recorded values
    onSearch(){
      try {
        console.log(this.currentParam);
        var sliceIndex = this.nowFocus.indexOf(':')>-1 ? this.nowFocus.indexOf(':') : this.nowFocus.length
        if (this.showingParams[this.currentFormat][this.nowFocus]
         && this.showingParams[this.currentFormat][this.nowFocus]['subValues'])
        {
          this.dataSource = Object.keys(this.showingParams[this.currentFormat][this.nowFocus]['subValues'])
        }
        else if ( this.streamInfo.streamType == 'video' && this.videoOptions[this.nowFocus.slice(0, sliceIndex)]['subValues'])
          this.dataSource = Object.keys(this.videoOptions[this.nowFocus.slice(0, sliceIndex)]['subValues'])
        else if ( this.streamInfo.streamType == 'audio' && this.audioOptions[this.nowFocus.slice(0, sliceIndex)]['subValues'])
          this.dataSource = Object.keys(this.audioOptions[this.nowFocus.slice(0, sliceIndex)]['subValues'])
      } catch (error) {
        console.log('%c Object Read Error', 'color:orange');
        console.log(`%c ${error}`, 'color:red');
        console.log(sliceIndex);
        console.log(this.videoOptions[this.nowFocus.slice(0, sliceIndex>-1 ? sliceIndex : this.nowFocus.length)]);
      }
    },
    onSearchSub(){
      console.log('current Dict', this.currentDict)
      try {
        console.log('current Dict', this.currentDict)
        if (this.showingParams[this.currentFormat][this.currentDict]
         && this.showingParams[this.currentFormat][this.currentDict]['subValues']
         && this.showingParams[this.currentFormat][this.currentDict]['subValues'][this.nowFocus]
         && this.showingParams[this.currentFormat][this.currentDict]['subValues'][this.nowFocus]['subValues'])
        {
          this.dataSource = Object.keys(this.showingParams[this.currentFormat][this.currentDict]['subValues'][this.nowFocus]['subValues'])
        }
      } catch (error) {
        console.log('%c Object Read Error', 'color:orange')
        console.log(`%c ${error}`, 'color:red')
      }
    },

    // Format Selection Filter 
    filterFormat(input, option){
      return option.componentOptions.children[0].
      componentOptions.children[1].
      componentOptions.children[0].text.trim().indexOf(input)>-1
    },

    FormatExit(format){
      this.$bus.$emit('changeStreamFormat', format, this.streamInfo.streamId)
      this.nowFocus = ''
    },
    paramFocus(){
      this.onSearch()
    },
    paramFocusSub(){
      this.onSearchSub()
    },
  },
  beforeMount() {
  },
}
</script>

<style scoped>
  #divParamPicked{
    height: 100%;
  }

  .delete{
		float: right;
		display: none;
	}
  .subDelete{
		float: right;
		display: none;
	}

  .subParamList:hover .subDelete{
		display: block;
	}
  .paramList:hover .delete{
    display: block;
  }
  .titleList{
    background-color: rgb(55, 165, 255);
    color:white
  }
</style>