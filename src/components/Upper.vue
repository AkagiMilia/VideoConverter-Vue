<template>
  <div class="row" id="divUpper">
    <UpperLeft></UpperLeft>
    <UPperRight/>
  </div>
</template>

<script>
import UpperLeft from './UpperLeft.vue'
import UPperRight from './UpperRight.vue'
export default {
  name:'Upper',
  components:{
    UpperLeft,
    UPperRight
  }
}
</script>

<style scoped>
  #divUpper{
      height: 80%;
  }

</style>