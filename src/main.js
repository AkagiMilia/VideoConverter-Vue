import Vue from 'vue'
// import Antd from 'ant-design-vue'
import { 
  Button, 
  Card,
  Col,
  Row,
  Checkbox,
  Icon,
  Input,
  Tabs,
  Tag,
  AutoComplete,
  Modal,
  Steps,
  Space
} from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import store from './store/index'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import infiniteScroll from 'vue-infinite-scroll'
Vue.config.productionTip = true

// var sqlite3 = require('sqlite3').verbose();
import sqlite3 from 'sqlite3'
// var db = new sqlite3.Database('./src/data/database.db');
// Vue.use(Antd)
Vue.use(Button) 
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Checkbox)
Vue.use(Icon)
Vue.use(Input)
Vue.use(Tabs)
Vue.use(Tag)
Vue.use(AutoComplete)
Vue.use(Modal)
Vue.use(Steps)
Vue.use(Space)

Vue.use(VueVirtualScroller)
Vue.use(infiniteScroll)

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
