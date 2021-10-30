<template>
  <div class="col shadow-sm bg-body rounded mt-3" id="divParamPicked">
    <ul class="list-group"  @click="checkForm('video')">
      <li class="list-group-item" v-for="(value, param) in currentParameter.video" :key="param">
        <span>{{param}}</span>
        <span v-if="typeof videoSelected[param] == 'object'">  {{value}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'UpperRightSelect',
  props:['parameters','currentProjectId','showingParams','currentVideo', 'currentAudio'],
  data() {
    return {
      currentForm:'',
      selectedParam:'',
      hasMultiChild:{},
      objectName:'object'
    }
  },
  computed:{
    currentParameter:{
      get(){
        return this.parameters.filter(project => project.projectId == this.currentProjectId)[0]
      }
    },
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
        return obj
      }
    }
  },
  watch:{
    currentVideo:{
      // immediate:true,
      handler(val,oldVal){
          var paramList = this.showingParams[val]
          paramList.forEach((param)=>{
            this.hasMultiChild[param.name] = param.multiChild
          })
      }
    }
  },
  methods: {
    checkForm(type){

    },
    checkSub(param){
      var show = true
      this.$dataBase.get("select * from "+this.currentForm+" where name='"+param+"'", (err,row)=>{
        console.log('this parameter is: ', param)
        this.theRow = {...row}
      })
      console.log('the result is: ',this.theRow)
      if (!this.theRow) 
        show = true
      else if (this.theRow.multiChild == '1') 
        show = false
      else
        show = true
      this.theRow = {}
      return true
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