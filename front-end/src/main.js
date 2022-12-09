import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router';
import store from './store'
import './plugins'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'font-awesome/css/font-awesome.css'
import { sync } from 'vuex-router-sync';
import axios from 'axios'

Vue.config.productionTip = false

//It adds a route module into the store, which contains the state representing the current route
//store.state.route.path   // current path (string)
//store.state.route.params // current params (object)
//store.state.route.query  // current query (object)
sync(store, router)

const token = localStorage.getItem('token');

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.headers.common['Authorization'] = token;

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
  beforeCreate() {
		this.$store.commit('authentication/initializeStore');
	}
}).$mount('#app')
