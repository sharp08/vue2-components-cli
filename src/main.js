import Vue from 'vue'
import App from './App.vue'
// 按需加载方式
// import { MyButton, MyInput } from './components'
// Vue.use(MyButton)
// Vue.use(MyInput)

// 全量引入方式
import MyUI from './components'
Vue.use(MyUI)

// 从打好的包引入
// import MyUI from '../lib/MyUI.umd'
// import '../lib/MyUI.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
