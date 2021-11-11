import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import store from './store/index'
Vue.config.productionTip = false

// var sqlite3 = require('sqlite3').verbose();
import sqlite3 from 'sqlite3'
// var db = new sqlite3.Database('./src/data/database.db');
Vue.use(Antd)

const vm = new Vue({
  el:'#app',
  // render: h => h(App),
  store,
  render: create => create(App),
  beforeCreate(){
    Vue.prototype.$bus = this
    const path = require('path')
    const dbPath = path.join(process.env.BASE_URL, 'data/database.db')
    console.log('__dirname:', __dirname);
    console.log('__filename:', __filename);
    console.log('dbPath:',dbPath);
    // Vue.prototype.$dataBase = new sqlite3.Database('./src/data/database.db')
  },
  beforeDestroy(){
    // this.$dataBase.close()
  }
})
console.log(vm);
// console.log(db)
