import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import settings from "./assets/js/settings";
import eth from "./assets/js/eth";
import abi from "./assets/js/abi";
import cookies from 'vue-cookies'
import ajax from "assets/js/ajax";
import Snackbar from "@varlet/ui/es/snackbar";
import Dialog from "@varlet/ui/es/dialog";
import '@varlet/ui/es/dialog/style/index.js'
import '@varlet/ui/es/snackbar/style/index.js'
import '@varlet/touch-emulator'

const app = createApp(App)

app.config.globalProperties.$eth = eth
app.config.globalProperties.$abi = abi
app.config.globalProperties.$settings = settings
app.config.globalProperties.$cookies = cookies
app.config.globalProperties.$ajax = ajax
app.config.globalProperties.$tip = Snackbar
app.config.globalProperties.$dialog = Dialog

app.use(store)
app.use(router)
app.mount('#app')