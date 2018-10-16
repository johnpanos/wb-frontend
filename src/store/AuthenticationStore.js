import ApiService from '../common/api';

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') == 'null' ? null : localStorage.getItem('token')
  },
  mutations: {
    updateToken(state, token) {
      state.token = token;
      ApiService.setHeader();
    }
  },
  actions: {
    updateTokenAndSave({ commit }, token) {
      localStorage.setItem('token', token);
      commit('updateToken', token);
    },
    logout({ commit }) {
      localStorage.setItem('token', null);
      commit('updateToken', null);
    }
  }
}