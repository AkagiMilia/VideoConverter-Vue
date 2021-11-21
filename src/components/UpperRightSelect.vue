<template>
  <a-col :span="12" class="shadow-sm border px-3" id="divParamPicked">
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="divSelectList" :style="{height:localHeight+'px'}">
    <UpperRightSelectList
      v-for="stream in currentParameter"
      :key="stream.streamId"
      :streamInfo="stream"
    />
    </div>
  </a-col>
</template>

<script>
import UpperRightSelectList from './UpperRightSelectList.vue'
export default {
  name:'UpperRightSelect',
  components:{
    UpperRightSelectList,
  },
  props:['currentParameter','currentProjectId','currentVideo', 'currentAudio', 'localHeight'],
  data() {
    return {
      thereIsNothingHere:null,
      busy:false
    }
  },
  methods: {
    loadMore(){
      this.busy = false
    }
  },  
}
</script>

<style scoped>
  #divParamPicked{
    height: 100%;
  }
  .divSelectList {
    overflow: auto;
  }
</style>