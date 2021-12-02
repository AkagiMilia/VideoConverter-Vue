<template>
  <a-row class="border px-3 border-end-0 border-start-0 overflow-auto" :style="{height:localHeight+'px'}">
    <h3>{{paramGuidance.title}}</h3>
    <p style="whiteSpace: pre-line">{{paramGuidance.info}}</p>
  </a-row>
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