<template>
  <div class="col shadow-sm bg-body rounded mt-3" id="divParamPicked">
    <UpperRightSelectList
      :currentParameter="currentParameter"
      :showingParams="showingParams"
      type="video"
    />
    <UpperRightSelectList
      :currentParameter="currentParameter"
      :showingParams="showingParams"
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
  props:['currentParameter','currentProjectId','showingParams','currentVideo', 'currentAudio'],
  data() {
    return {
    }
  },
}
</script>

<style scoped>
  #divParamPicked{
    height: 100%;
}
</style>