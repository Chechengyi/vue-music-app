import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutation'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
// vuex的调试工具 开发环境为true开启debug
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: debug,
  plugins: debug? [createLogger()]: []
})


