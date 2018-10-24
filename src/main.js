import Vue from 'vue';
import App from './App.vue';
import ApiService from '@/common/api';

import elementui from '@/plugins/elementui';
import qrcode from '@/plugins/qrcode';
import router from '@/plugins/router';
import store from '@/store/index.js';
import icons from '@/plugins/icons';

Vue.config.productionTip = false;

ApiService.init();

new Vue({
  render: h => h(App),
  router,
  store,
  icons
}).$mount('#app');
