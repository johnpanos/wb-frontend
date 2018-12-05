import { NotificationService } from '@/common/api';

export default {
  namespaced: true,
  state: {
    notifications: []
  },
  getters: {
    notifications(state) {
      return state.notifications;
    }
  },
  mutations: {
    setNotifications(state, notifications) {
      state.notifications = notifications;
    },
    dismiss(state, index) {
      state.notifications.splice(index, 1);
    }
  },
  actions: {
    fetch({ commit }) {
      NotificationService.getNotifications().then(response => {
        commit('setNotifications', response.data);
      });
    },
    logout({ commit }) {
      commit('setNotifications', []);
    },
    dismiss({ commit, state }, index) {
      NotificationService.dismissNotification(state.notifications[index].id).then(() => {
        commit('dismiss', index);
      });
    }
  }
}