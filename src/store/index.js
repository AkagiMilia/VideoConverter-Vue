// Vuex 
import Vuex from 'vuex'
import Vue from 'vue'
import indexData from './indexData.js'

Vue.use(Vuex)
export default new Vuex.Store({
  modules:{
    indexData
  }
})