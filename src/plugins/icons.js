import Vue from 'vue'

// or import all icons if you don't care about bundle size
import 'vue-awesome/icons'

/* Register component with one of 2 methods */

import Icon from 'vue-awesome/components/Icon'

// globally (in your main .js file)
Vue.component('v-icon', Icon)

// or locally (in your component file)
export default {
  components: {
    'v-icon': Icon
  }
}