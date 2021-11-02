<template>
  <div class="col shadow-sm bg-body rounded mt-3 ms-3" id="divParamLists">
    <ul class="list-group">
      <li class="list-group-item" v-for="(param) in parameterObject" :key='param.name'>
        <span>{{param.name}}</span>
        <span></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'UpperRightParams',
  props:['showingParams', 'currentAudio', 'currentVideo'],
  data(){
    return{
      parameterObject:{},
      parameterList:[]
    }
  },
  methods: {
    displayParameter(param, type){
      if (type == 'video'){
        for(let value of this.showingParams[this.currentVideo]){
          if (value.name == param){
            if (value.multiChild == '1'){
              var sql = "select * from subValue "
              sql += "where format = '"+this.currentVideo+"' "
              sql += "and paraName = '"+param+"'"
              console.log(`sql:`, sql)
              this.$dataBase.all(sql, (err, rows)=>{
                console.log(`rows:`, rows)
                this.parameterObject = rows
              })
              break
            }
            else
              this.parameterObject = this.showingParams[this.currentVideo]
            break
          }
        }
        // this.parameterObject = this.showingParams[this.currentVideo]
      }
      console.log('current parameter list is:\n', this.parameterObject)
    }
  },
  beforeMount() {
    this.$bus.$on('searchParameter', this.displayParameter)
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