import ApiService, { AuthService } from '../common/api';

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') == 'null' ? null : localStorage.getItem('token'),
    user: localStorage.getItem('user') == 'null' ? null : JSON.parse(localStorage.getItem('user'))
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
    logout({ commit, dispatch }) {
      localStorage.setItem('token', null);
      localStorage.setItem('user', null);
      AuthService.logout();
      commit('updateToken', null);
      dispatch('serverNotification/logout', null, { root: true });
    },
    updateUser({ commit, dispatch }) {
      AuthService.getUserInfo().then(user => {
        localStorage.setItem('user', JSON.stringify(user.data));
        commit('updateUser', user.data);
        dispatch('serverNotification/fetch', null, { root: true });
      });
    }
  }
}