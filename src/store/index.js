import Vue from 'vue';
import Vuex from 'vuex';
import AuthenticationStore from './AuthenticationStore';
import PartStore from './PartStore';
import NotificationStore from './NotificationStore';
import ServerNotification from './ServerNotification';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    authentication: AuthenticationStore,
    parts: PartStore,
    notification: NotificationStore,
    serverNotification: ServerNotification
  }
});

export default store;