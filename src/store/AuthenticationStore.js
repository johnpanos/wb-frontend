import ApiService, { AuthService } from '../common/api';

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') == 'null' ? null : localStorage.getItem('token'),
    user: null
  },
  mutations: {
    updateToken(state, token) {
      state.token = token;
      ApiService.setHeader();
    },
    updateUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    updateTokenAndSave({ commit, dispatch }, token) {
      localStorage.setItem('token', token);
      commit('updateToken', token);
      dispatch('updateUser');
    },
    logout({ commit }) {
      localStorage.setItem('token', null);
      commit('updateToken', null);
    },
    updateUser({ commit }) {
      AuthService.getUserInfo().then(user => {
        commit('updateUser', user.data);
      });
    }
  }
}