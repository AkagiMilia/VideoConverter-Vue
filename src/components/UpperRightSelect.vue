<template>
  <div class="col shadow-sm bg-body rounded mt-3" id="divParamPicked">
    <ul class="list-group"  @click="checkForm('video')">
      <li class="list-group-item" v-for="(value, param) in currentParameter.video" :key="param">
        <span>{{param}}</span>
        <span v-if="checkSub(param)">  {{value}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'UpperRightSelect',
  props:['parameters','currentProjectId','showingParams'],
  data() {
    return {
      currentForm:'',
      selectedParam:'',
      show:true
    }
  },
  computed:{
    currentParameter:{
      get(){
        return this.parameters.filter(project => project.projectId == this.currentProjectId)[0]
      }
    },
  },
  methods: {
    checkForm(type){
      Object.keys(this.currentParameter[type]).forEach((key)=>{
        if (key.startsWith('-c:')){
          this.currentForm = this.currentParameter[type][key]
          console.log('this for is:', this.currentForm);
          return
        }
      })
      
    },
    checkSub(param){
      
      this.$dataBase.get("select * from "+this.currentForm+" where name='"+param+"'", (err,row)=>{
        console.log('this parameter is: ', param)
        console.log('the result is: ',row)
        if (!row) 
          this.show = true
        else if (row.multiChild == '1') 
          this.show = false
        else
          this.show = true
      })
      return true
    }
  },
  beforeMount() {
    Object.keys(this.currentParameter['video']).forEach((key)=>{
      if (key.startsWith('-c:')){
        this.currentForm = this.currentParameter['video'][key]
        console.log('this for is:', this.currentForm);
        return
      }
    })
  },
}
</script>

<style scoped>
  #divParamPicked{
    height: 100%;
}
</style>