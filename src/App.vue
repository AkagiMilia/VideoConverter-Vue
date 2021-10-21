<template>
  <div class="col-12" id="divAll" v-cloak :style="{opacity}">
    <Upper></Upper>
    <Lower/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Upper from './components/Upper.vue'
import Lower from './components/Lower.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Upper,
    Lower
  },
  data() {
    return {
      hwName:'',
      greeting:'哈哈哈',
      num:this.GLOBAL.num,
      opacity:1
    }
  },
  mounted() {
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

html,body{
    background-color: rgb(238, 238, 238);
    height: 77%;
    width: 99%;
}

[v-cloak]{
    display: none;
}

#divAll{
    padding-left: 2%;
    height: 100%;
}

.myDivStyles{
    margin-top: 2%;
    background-color: white;
    border-width: 3px;
    border-radius: 10px;
    border-color: rgb(148, 148, 148);
    border-style:solid;
}
</style>
