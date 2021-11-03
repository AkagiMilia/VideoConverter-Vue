<template>
  <div class="col shadow-sm bg-body rounded mt-3 ms-3" id="divParamLists">
    <ul class="list-group">
      <li class="list-group-item" v-for="(param) in parameterObject" :key='param.name' @click="addParam(param)">
        <span>{{param.name}}</span>
        <span> {{param.valueType}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'UpperRightParams',
  props:['showingParams', 'currentAudio', 'currentVideo','currentFormat'],
  data(){
    return{
      parameterObject:{},
      parameterList:[],
      isSubParam:false
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
        for(let value of this.showingParams[searchType]){
          if (value.name == param){
            if (value.multiChild == '1'){
              var sql = "select * from subValue "
              sql += "where format = '"+searchType+"' "
              sql += "and paraName = '"+param+"'"
              console.log(`sql:`, sql)
              this.$dataBase.all(sql, (err, rows)=>{
                this.parameterObject = rows
              })
              this.isSubParam = true
              break
            }
            else
              this.isSubParam = false
              this.parameterObject = this.showingParams[searchType]
            break
          }
        }
        // this.parameterObject = this.showingParams[this.currentVideo]
      }
      console.log('current parameter list is:\n', this.parameterObject)
    },
    addParam(param){
      if (param.paraName){
        console.log('I am a subParam')
        this.$bus.$emit('addParam', 'video', param.name, param.paraName)
      }
      else{
        this.$bus.$emit('addParam', 'video', param.name, null)
      }
    },
    refreshParameter(curV){
      console.log(`refesh:`, curV)
      this.parameterObject = this.showingParams[curV]
    },
    empitParameter(){
      this.parameterObject = {}
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
</style>