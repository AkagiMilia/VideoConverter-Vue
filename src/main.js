import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('./src/data/database.db');

const vm = new Vue({
  el:'#app',
  // render: h => h(App),
  data:{
  },
  render: create => create(App),
  beforeCreate(){
    Vue.prototype.$bus = this
    Vue.prototype.$dataBase = new sqlite3.Database('./src/data/database.db')
  },
  beforeDestroy(){
    this.$dataBase.close()
  }
})
console.log(vm);
// console.log(db)
