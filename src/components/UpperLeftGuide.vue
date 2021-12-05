<template>
  <a-card class="overflow-auto border-end-0 border-bottom-0 border-start-0 border-1 " :style="{height:localHeight+'px'}">
    <h4 slot="title" class="m-0">
      {{paramGuidance.title}}
    </h4>
    <a-row >
      <p class="fs-6" style="whiteSpace: pre-line">{{paramGuidance.info}}</p>
    </a-row>  
  </a-card>
</template>

<script>
export default {
  name:'UpperLeftGuide',
  props:['localHeight'],
  data() {
    return {
      paramGuidance:{
        title:'',
        info:''
      }
    }
  },
  methods: {
    updatGuidance(key, param){
      console.log('got you!');
      this.paramGuidance['title'] = key
      this.paramGuidance['info'] = param.explanation
    }
  },

  // update guidance showing after receiving information
  beforeMount() {
    this.$bus.$on('showGuidance', this.updatGuidance)
  },
}
</script>

<style scoped>
	#divGuidiance{
      height:30%;
      position:relative;
  }
</style>