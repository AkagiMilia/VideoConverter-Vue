<template>
  <div class="col shadow-sm bg-body rounded mt-3" id="divParamPicked">
    <ul class="list-group">
      <li class="list-group-item" v-for="(value, param) in videoSelected" :key="param" @click.stop="paramClick(param, 'video')">
        <span>{{param}}</span>
        <span v-if="typeof videoSelected[param] == 'string'" v-show="param!=nowFocus">  {{value}}</span>
        <input 
          type="text" 
          v-if="typeof videoSelected[param] == 'string'"
          v-model.trim.lazy="videoSelected[param]"
          v-show="param==nowFocus"
          @blur="paramExit(param, null, $event)"
          :ref="'input'+param"
          />
        <ul class="list-group" v-if="typeof videoSelected[param] == 'object'">
          <li class="list-group-item" v-for="(subVal, subParam) in videoSelected[param]" :key="subParam" @click.stop="paramClick(subParam, 'video', param)">
            <span>{{subParam}}</span>
            <span v-show="subParam!=nowFocus">  {{subVal}}</span>
            <input 
              type="text" 
              v-model.trim.lazy="videoSelected[param][subParam]"
              v-show="subParam==nowFocus"
              @blur="paramExit(param, subParam, $event)"
              :ref="'input'+subParam"
              />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'UpperRightSelect',
  props:['currentParameter','currentProjectId','showingParams','currentVideo', 'currentAudio'],
  data() {
    return {
      currentForm:'',
      selectedParam:'',
      hasMultiChild:{},
      objectName:'object',
      nowFocus:'',
    }
  },
  computed:{
    videoSelected(){
      return this.currentParameter['video']
    }
  },
  watch:{
 
  },
  methods: {
    paramClick(param, type, father=null){
      this.nowFocus = param
      this.$nextTick(function(){
        var refName = 'input'+param
        if (refName in this.$refs)
          this.$refs[refName][0].focus()
        // console.log(this.$refs[refName]);
      })
      if (father)
        this.$bus.$emit('searchParameter', father, type)
      else
        this.$bus.$emit('searchParameter', param, type)
    },
    paramExit(param,subParam,event){
      console.log('param:',param);
      console.log('subParam:',subParam);
      if (!event.target.value.trim()){
        if (subParam)
          this.videoSelected[param][subParam] = '1'
        else
          this.videoSelected[param] = '1'
      }
      this.nowFocus = ''
      this.sendParam({...this.videoSelected})
    },
    sendParam(curVal){
      var newObj = {}
        for (let [key, value] of Object.entries(curVal)){
          newObj[key] = value
        }
        this.$bus.$emit('updateParams', newObj, 'video')
    }
  },
  beforeMount() {
    // Object.keys(this.currentParameter['video']).forEach((key)=>{
    //   if (key.includes('-c:')){
    //     this.currentForm = this.currentParameter['video'][key]
    //     console.log('this for is:', this.currentForm);
    //     return
    //   }
    // })
    // console.log(typeof this.videoSelected['-crf'] == 'object')
  },
}
</script>

<style scoped>
  #divParamPicked{
    height: 100%;
}
</style>