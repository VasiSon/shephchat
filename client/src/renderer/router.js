import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '@/components/SignIn'
import SignUp from '@/components/SignUp'
import Main from '@/components/Main'

import store from '@/store'

import {
		ROUTE_SIGN_IN,
		ROUTE_SIGN_UP,
		ROUTE_MAIN,
} from '@/constants'

Vue.use(Router)

export default new Router({
	mode: 'history',
    base: process.env.BASE_URL,
	routes: [
		{
			path: ROUTE_SIGN_IN,
			name: ROUTE_SIGN_IN,
			component: SignIn,
		},
		{
			path: ROUTE_SIGN_UP,
			name: ROUTE_SIGN_UP,
			component: SignUp,
		},
		{
			path: ROUTE_MAIN,
			name: ROUTE_MAIN,
			component: Main,
			beforeEnter: (to, from, next) => {
				if(!store.state.authUser.id){
					next(ROUTE_SIGN_IN)
				} else {
					next()
				}
			}
		},
		{
			path: '*',
			redirect: ROUTE_SIGN_IN, 
		},
	]
})
