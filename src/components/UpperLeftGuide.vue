<template>
  <div class="col shadow-sm bg-body rounded mt-3" id="divGuidiance">
    <h1>{{paramGuidance.title}}</h1>
    <p>{{paramGuidance.info}}</p>
  </div>
</template>

<script>
export default {
  name:'UpperLeftGuide',
  data() {
    return {
      paramGuidance:{
        title:'',
        info:''
      }
    }
  },
  methods: {
    updatGuidance(param){
      console.log('got you!');
      this.paramGuidance['title'] = param.name
      this.paramGuidance['info'] = param.explanation
    }
  },
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