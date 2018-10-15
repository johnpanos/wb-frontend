<template>
  <el-container>
    <el-header style="display: flex; justify-content: space-between; align-items: center;">
      <h1>myWB</h1>
      <div>
        <el-button v-if="token != null" @click.end="logout" type="danger" round>Logout</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="150px">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              router>
              <el-menu-item index="/inventory"><v-icon name="archive" />Inventory</el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-main>
          <transition name="fade">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Login from './Login.vue';
import { mapState } from 'vuex';
export default {
  name: 'Home',
  props: {
    msg: String
  },
  components: {
    Login
  },
  computed: mapState({
    token: state => state.authentication.token,
  }),
  methods: {
    logout() {
      this.$store.dispatch('authentication/logout');
      this.$router.push('/login');
    }
  },
  mounted() {
  }
}
</script>

<style>
body > .el-container {
  margin-bottom: 0;
}
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}
.fade-enter-active {
  transition-delay: .25s;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
.fa-icon {
  margin-right: 5px;
}
</style>
