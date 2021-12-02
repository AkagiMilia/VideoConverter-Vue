<template>
  <a-col :span="12" class="border border-start-0 border-end-0" id="divParamPicked">
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="divSelectList" :style="{height:localHeight+'px'}">
    <!-- show lists of stream's parameters-->
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
  props:['currentParameter','currentProjectId', 'localHeight'],
  data() {
    return {
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
  div::-webkit-scrollbar-thumb{
    background-color:rgb(55, 165, 255);
  }
  div::-webkit-scrollbar{
    background-color:rgb(240, 248, 255);
    /* border-left-color: rgb(169, 216, 255); */
  }
</style>