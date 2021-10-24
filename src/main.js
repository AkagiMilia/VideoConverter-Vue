import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

const vm = new Vue({
  el:'#app',
  // render: h => h(App),
  data:{
  },
  render: create => create(App),
  beforeCreate(){
    Vue.prototype.$bus = this
  },
})
console.log(vm);
