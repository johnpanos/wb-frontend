<template>
  <el-alert
    title="Authentication Successful"
    type="success"
    :description="getWelcomeText()"
    show-icon>
  </el-alert>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'AuthenticationSuccessful',
  computed: mapState({
    user: state => state.authentication.user,
  }),
  methods: {
    getWelcomeText() {
      const { user } = this;
      if (!user) {
        return 'Loading...';
      }
      return `Welcome to myWB, ${user.firstName}. Please select on option on the left sidebar to get started.`
    }
  }
}
</script>

<style>

</style>
