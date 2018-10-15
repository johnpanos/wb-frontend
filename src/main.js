import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import VueQrcode from '@xkeshi/vue-qrcode';
import store from './store/index.js';
import Login from './components/Login.vue';
import PartCreate from './components/PartCreate.vue';
import Inventory from './components/Inventory.vue';
import PartView from './components/PartView.vue';
import ApiService from './common/api';
import icons from './plugins/icons';

Vue.component(VueQrcode.name, VueQrcode);

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueRouter);

ApiService.init();

const routes = [
  { path: '/login', component: Login },
  { path: '/inventory', component: Inventory },
  { path: '/inventory/parts/create', component: PartCreate },
  { path: '/inventory/part/:partId', component: PartView, props: true }
];

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  if (to.path == '/login' && store.state.authentication.token != null) {
    next({
      path: '/',
      params: { nextUrl: to.fullPath }
    });
  }
  if (to.path != '/login' && store.state.authentication.token == null) {
    next({
      path: '/login',
      params: { nextUrl: to.fullPath }
    });
  } else {
    next();
  }
});


new Vue({
  render: h => h(App),
  router,
  store,
  icons
}).$mount('#app')
