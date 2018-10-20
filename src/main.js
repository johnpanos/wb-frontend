import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import VueQrcode from '@xkeshi/vue-qrcode';
import store from './store/index.js';
import Login from './components/Login.vue';
import PartCreate from './components/PartCreate.vue';
import Inventory from './components/Inventory.vue';
import PartView from './components/PartView.vue';
import AuthenticationSuccessful from './components/AuthenticationSuccessful.vue';
import ApiService from './common/api';
import { PermissionService } from './common/permissions';
import icons from './plugins/icons';

Vue.component(VueQrcode.name, VueQrcode);

Vue.config.productionTip = false

locale.use(lang);
Vue.use(ElementUI);
Vue.use(VueRouter);

ApiService.init();

const routes = [
  { path: '/login', component: Login },
  { path: '/inventory', component: Inventory },
  { path: '/inventory/parts/create', component: PartCreate, meta: {
      allowedRoles: ['ADMIN', 'MENTOR']
    }
  },
  { path: '/inventory/part/:partId', component: PartView, props: true },
  { path: '/authentication-successful', component: AuthenticationSuccessful }
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
    const allowedRoles = to.matched.some(record => record.meta.allowedRoles);
    const user = store.state.authentication.user;

    if (allowedRoles && user != null) {
      if (PermissionService.hasRole(user, to.meta.allowedRoles)) {
        next();
      } else {
        next({
          path: '/',
          params: { nextUrl: to.fullPath }
        });
      }
    } else {
      next();
    }
  }
});


new Vue({
  render: h => h(App),
  router,
  store,
  icons
}).$mount('#app')
