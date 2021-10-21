import Vue from 'vue'
import App from './App.vue'
import _global from './globalData'

Vue.config.productionTip = false
Vue.prototype.GLOBAL = _global

const vm = new Vue({
  el:'#app',
  // render: h => h(App),
  data:{
    greeting:'哈哈哈'
  },
  render: create => create(App)
})
console.log(vm);
