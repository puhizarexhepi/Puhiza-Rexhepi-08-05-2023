import Vue from 'vue'
import App from './App.vue'
import '@/plugins/element'
import router from './services/router'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
