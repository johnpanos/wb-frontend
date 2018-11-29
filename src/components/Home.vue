<template>
  <el-container>
    <el-header style="display: flex; justify-content: space-between; align-items: center;">
      <h1>myWB</h1>
      <div v-if="token != null">
        <el-button @click.end="passwordDialogVisible = true" type="text">Change Password</el-button>
        <el-button @click.end="logout" type="danger" round>Logout</el-button>
      </div>
    </el-header>
    <el-container>
      <change-password-dialog :visible="passwordDialogVisible" :onClose="() => passwordDialogVisible = false" />
      <el-aside width="180px">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu router>
                <show-if-has-role :roles="['ADMIN', 'MENTOR']">
                  <el-submenu index="1">
                    <template slot="title">
                      <v-icon name="users" />
                      <span>HR</span>
                    </template>
                    <el-menu-item class="menu-item" index="/hr/mentors">Mentors</el-menu-item>
                    <el-menu-item class="menu-item" index="/hr/students">Students</el-menu-item>
                  </el-submenu>
                </show-if-has-role>
              <el-menu-item index="/inventory"><v-icon name="archive" />Inventory</el-menu-item>
              <el-menu-item index="/purchase-orders"><v-icon name="parachute-box" />Purchase Orders</el-menu-item>
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
import { mapState } from 'vuex';
import Login from '@/components/Login.vue';
import ShowIfHasRole from '@/components/permissions/ShowIfHasRole';
import ChangePasswordDialog from '@/components/hr/user/ChangePasswordDialog';
import { AuthService } from '@/common/api';
export default {
  name: 'Home',
  components: {
    Login,
    ShowIfHasRole,
    ChangePasswordDialog
  },
  data() {
    return {
      passwordDialogVisible: false
    }
  },
  computed: mapState({
    token: state => state.authentication.token,
    notification: state => state.notification.notification,
    message: state =>  state.notification.message
  }),
  watch: {
    notification(newValue, oldValue) {
      this.$notify({
        title: this.notification.title,
        message: this.notification.message,
        type: this.notification.type
      });
    },
    message(newValue, oldValue) {
      if (newValue != oldValue) {
        this.$message({
          message: this.message.message,
          type: this.message.type
        });
      }
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('authentication/logout');
      this.$router.push('/login');
    }
  },
  mounted() {
    if (this.token != null) {
      this.$store.dispatch('authentication/updateUser');
    }
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
.el-submenu .el-menu-item {
  min-width: 0 !important;
}
</style>
