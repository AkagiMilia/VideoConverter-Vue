<template>
  <div class="col shadow-sm bg-body rounded mt-3" id="divParamPicked">
    <ul class="list-group"  @click="checkForm('video')">
      <li class="list-group-item" v-for="(value, param) in videoSelected" :key="param" @click="paramClick(param)">
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
          <li class="list-group-item" v-for="(subVal, subParam) in videoSelected[param]" :key="subParam" @click.stop="paramClick(subParam)">
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
    videoSelected:{
      get(){
        var obj = {}
        for (let [key, value] of Object.entries(this.currentParameter['video'])){
          if (!value.includes('=')){
            obj[key]=value
          }   
          else{
            var objSub = {}
            value = value.split(':')
            for (let val of value){
              val = val.split('=')
              objSub[val[0]] = val[1]
            }
            obj[key] = objSub
          }
        }
        return {...obj}
      }
    }
  },
  watch:{
 
  },
  methods: {
    // checkSub(param){
    //   var show = true
    //   this.$dataBase.get("select * from "+this.currentForm+" where name='"+param+"'", (err,row)=>{
    //     console.log('this parameter is: ', param)
    //     this.theRow = {...row}
    //   })
    //   console.log('the result is: ',this.theRow)
    //   if (!this.theRow) 
    //     show = true
    //   else if (this.theRow.multiChild == '1') 
    //     show = false
    //   else
    //     show = true
    //   this.theRow = {}
    //   return true
    // },
    paramClick(param){
      this.nowFocus = param
      this.$nextTick(function(){
        var refName = 'input'+param
        this.$refs[refName][0].focus()
        // console.log(this.$refs[refName]);
      })
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
          if (typeof value != 'object')
            newObj[key] = value
          else{
            var valueString = ''
            for (let [subKey, subVal] of Object.entries(value)){
              valueString += subKey+'='+subVal+':'
            }
            valueString = valueString.substr(0, valueString.length-1)
            newObj[key] = valueString
          }
        }
        this.$bus.$emit('updateParams', this.currentProjectId, newObj, 'video')
    }
  },
  beforeMount() {
    Object.keys(this.currentParameter['video']).forEach((key)=>{
      if (key.includes('-c:')){
        this.currentForm = this.currentParameter['video'][key]
        console.log('this for is:', this.currentForm);
        return
      }
    })
    console.log(typeof this.videoSelected['-crf'] == 'object')
  },
}
</script>

<style scoped>
  #divParamPicked{
    height: 100%;
}
</style>