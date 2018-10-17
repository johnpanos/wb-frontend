<template>
  <div>
    <slot v-if="canShow()"></slot>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { PermissionService } from '../../common/permissions.js';
export default {
  name: 'ShowIfHasRole',
  props: ['roles'],
  computed: mapState({
    user: state => state.authentication.user,
  }),
  methods: {
    canShow() {
      if (this.user == null) {
        return false;
      }

      return PermissionService.hasRole(this.user, this.roles);
    }
  }
}
</script>

<style>

</style>
