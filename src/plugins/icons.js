import Vue from 'vue'

// Import only icons we use to save the bundle size
import 'vue-awesome/icons/archive';
import 'vue-awesome/icons/users';
import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/parachute-box';
import 'vue-awesome/icons/bell';

import Icon from 'vue-awesome/components/Icon';

Vue.component('v-icon', Icon);

export default {
  components: {
    'v-icon': Icon
  }
}