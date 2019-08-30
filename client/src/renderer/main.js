import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'

import 'bootstrap/dist/js/bootstrap.min.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/styles.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

new Vue({
	components: { App },
	router,
	store,
	template: '<App/>'
}).$mount('#app')
