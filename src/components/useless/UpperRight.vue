<template>
  <div class="col" id="divUpperRight">
    <div class="row" id="divUpperRightRow">
      <UpperRightSelect/>
      <UpperRightParams/>
    </div>
  </div>
</template>

<script>
import UpperRightSelect from './UpperRightSelect.vue'
import UpperRightParams from './UpperRightParams.vue'
export default {
  name:'UpperRight',
  components:{
    UpperRightSelect,
    UpperRightParams
  }
}
</script>

<style scoped>
  #divUpperRight{
    height:92.5%
  }
  #divUpperRightRow{
    height: 100%;
  }
</style>