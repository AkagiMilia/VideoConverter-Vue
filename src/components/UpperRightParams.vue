<template>
  <div class="col shadow-sm bg-body rounded mt-3 ms-3" id="divParamLists">
    <ul class="list-group">
      <li class="list-group-item">
        <span>-preset</span>
        <span>string</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'UpperRightParams',
  data(){
    return{
      parameterList:[]
    }
  },
  beforeMount() {
    
  },
  mounted(){
    this.$dataBase.all('select * from libx265', (err, rows)=>{
      console.log('@');
      console.log(rows);
    })
    
}
}
</script>

<style scoped>
  #divParamLists{
    height: 100%;
}
</style>