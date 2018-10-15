import Vue from 'vue';
import Vuex from 'vuex';
import AuthenticationStore from './AuthenticationStore';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    authentication: AuthenticationStore
  }
});

export default store;