export default {
  state: {
    notification: null,
    message: null
  },
  getters: {
    notification(state) {
      return state.notification;
    },
    message(state) {
      return state.message;
    }
  },
  mutations: {
    setNotification(state, notification) {
      state.notification = notification;
    },
    setMessage(state, message) {
      state.message = message;
    }
  },
  actions: {
    notificationError({ commit }, notification) {
      commit('setNotification', {
        type: 'error',
        title: notification.title,
        message: notification.message
      });
    },
    messageError({ commit }, text) {
      commit('setMessage', {
        type: 'error',
        message: text
      });
    }
  }
}