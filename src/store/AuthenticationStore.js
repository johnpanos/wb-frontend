import ApiService from '../common/api';

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') == 'null' ? null : localStorage.getItem('token')
  },
  mutations: {
    updateToken(state, token) {
      console.log("aye:" + token)
      state.token = token;
      ApiService.setHeader();
    }
  },
  actions: {
    updateTokenAndSave({ commit }, token) {
      localStorage.setItem('token', token);
      this.commit('authentication/updateToken', token);
    },
    logout({ commit }) {
      localStorage.setItem('token', null);
      this.commit('authentication/updateToken', null);
    }
  }
}