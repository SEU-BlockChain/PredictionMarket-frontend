import {createStore} from 'vuex'

export default createStore({
  state: {
    is_init: false,
    is_login: false,
    is_stuff: false,
    user: {username: "未登录用户"},
    web3: null,
    web3_init: false,
    web3_type: null,
    web3_account: null
  },
  mutations: {
    initialize(state) {
      state.is_init = true
    },
    login(state, user) {
      state.is_login = true
      state.is_stuff = user.is_stuff
      state.user = user
      state.user.description = user.description ? user.description : "无"
      state.user.address = user.address ? user.address : "未设置"
      state.user.phone = user.phone ? user.phone : "未绑定"
    },
    logout(state) {
      state.is_login = false
      state.user = {username: "未登录用户"}
    },
    get_web3(state, res) {
      state.web3 = res[0]
      state.web3_type = res[1]
      state.web3_init = true
    },
    change_account(state, account) {
      state.web3_account = account
    }
  },
  actions: {},
  modules: {}
})
