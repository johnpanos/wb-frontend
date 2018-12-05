<template>
  <el-container>
    <el-header style="display: flex; justify-content: space-between; align-items: center;">
      <h1>myWB</h1>
      <div v-if="token != null">
        <el-badge :value="unseenNotificationCount" v-bind:class="{ 'notification-badge': true, 'notification-badge-hide': unseenNotificationCount === 0 }">
          <el-popover
            placement="bottom"
            width="300"
            trigger="click">
            <hr />
            <div v-for="(notif, i) in notifications" v-bind:key="notif.id">
              <p>{{ notif.title }} </p>
              <p>{{ notif.description }}</p>
              <el-button @click="onNotificationClick(notif.url)">Open</el-button>
              <el-button @click="onNotificationDismiss(i)">Dismiss</el-button>
              <hr />
            </div>
            <el-button slot="reference" circle><v-icon name="bell" /></el-button>
          </el-popover>
        </el-badge>
        <!-- <el-button @click.end="passwordDialogVisible = true" type="text">Change Password</el-button> -->
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
              <show-if-has-role :roles="['ADMIN', 'MENTOR', 'PO_VIEW', 'PO_EDIT']">
                <el-menu-item index="/purchase-orders"><v-icon name="parachute-box" />Purchase Orders</el-menu-item>
              </show-if-has-role>
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
      passwordDialogVisible: false,
      unseenNotificationCount: 0
    }
  },
  computed: mapState({
    token: state => state.authentication.token,
    notification: state => state.notification.notification,
    message: state =>  state.notification.message,
    notifications: state => state.serverNotification.notifications
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
    },
    notifications() {
      this.unseenNotificationCount = this.notifications.filter(a => a.seen === false).length;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('authentication/logout');
      this.$store.dispatch('serverNotification/logout');
      this.$router.push('/login');
    },
    onNotificationClick(url) {
      window.location.href = url;
    },
    onNotificationDismiss(i) {
      this.$store.dispatch('serverNotification/dismiss', i);
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
.notification-badge {
  margin-right: 10px;
}
.notification-badge sup {
  transform: translateY(-10%) translateX(80%) !important;
}
.notification-badge-hide sup {
  display: none;
}
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
li svg {
  margin-right: 5px;
}
.el-submenu .el-menu-item {
  min-width: 0 !important;
}
</style>
