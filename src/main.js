import Vue from 'vue'
// import Antd from 'ant-design-vue'
import { 
  Button, Card, Col, Row,
  Checkbox, Icon, Input, Tabs,
  Tag, AutoComplete, Modal, Steps, 
  Space, Collapse, Popover, Upload,
  List, Radio, Select, InputNumber, 
  Tooltip, Empty, Drawer, 
  Progress, message
} from 'ant-design-vue'

import App from './App.vue'
// import 'ant-design-vue/dist/antd.css'
import store from './store/index'
import infiniteScroll from 'vue-infinite-scroll'


Vue.config.productionTip = true

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
Vue.use(Collapse)
Vue.use(Popover)
Vue.use(Upload)
Vue.use(Radio)
Vue.use(Select)
Vue.use(InputNumber)
Vue.use(List)
Vue.use(Tooltip)
Vue.use(Empty)
Vue.use(Drawer)
Vue.use(Progress)

Vue.use(infiniteScroll)

// Initialize Vue
const vm = new Vue({

  // render every thing to the part
  // whose ID is "app" in index.html
  el:'#app',
  
  // Vuex
  store,

  // render Component App
  render: create => create(App),
  beforeCreate(){
    // Add event bus to Vue
    Vue.prototype.$bus = this
    // Ant-Design: message handler
    Vue.prototype.$message = message
  },
  beforeDestroy(){
  }
})
console.log(vm);
