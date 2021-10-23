<template>
  <div class="row" id="divLower">
    <LowerCodeArea/>
    <LowerCodeDisplay/>
  </div>
</template>

<script>
import LowerCodeArea from './LowerCodeArea.vue'
import LowerCodeDisplay from './LowerCodeDisplay.vue'
export default {
  name:'Lower',
  components:{
    LowerCodeArea,
    LowerCodeDisplay
  }
}
</script>

<style scoped>
  #divLower{
    height: auto;
    margin-top: 1%;
}
</style>