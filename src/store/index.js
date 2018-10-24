import Vue from 'vue';
import Vuex from 'vuex';
import AuthenticationStore from './AuthenticationStore';
import PartStore from './PartStore';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    authentication: AuthenticationStore,
    parts: PartStore
  }
});

export default store;