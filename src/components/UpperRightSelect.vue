<template>
  <div class="col shadow-sm bg-body rounded mt-3" id="divParamPicked">
    <UpperRightSelectList
      :currentParameter="currentParameter"
      :currentFormat="currentVideo"
      type="video"
    />
    <UpperRightSelectList
      :currentParameter="currentParameter"
      :currentFormat="currentAudio"
      type="audio"
    />
  </div>
</template>

<script>
import UpperRightSelectList from './UpperRightSelectList.vue'
export default {
  name:'UpperRightSelect',
  components:{
    UpperRightSelectList,
  },
  props:['currentParameter','currentProjectId','currentVideo', 'currentAudio'],
  data() {
    return {
      thereIsNothingHere:null
    }
  },
}
</script>

<style scoped>
  #divParamPicked{
    height: 100%;
}
</style>