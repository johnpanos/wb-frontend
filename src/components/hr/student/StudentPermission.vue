<template>
  <el-container direction="vertical" v-loading="loading">
    <h1>Student Permissions</h1>
    <el-transfer
      :titles="['Permissions', this.user.firstName + ' ' + this.user.lastName]"
      v-model="user.roles"
      :data="roles">
    </el-transfer>
    <div style="margin-top: 20px;">
      <el-button type="danger" @click="$router.back()">Cancel</el-button>
      <el-button type="primary" @click="updateStudentRoles">Update</el-button>
    </div>
  </el-container>
</template>

<script>
import { HRService } from '@/common/api';
export default {
  name: 'StudentPermission',
  props: ['studentId'],
  data() {
    return {
      loading: false,
      user: {
        roles: []
      },
      roles: []
    }
  },
  methods: {
    getUser() {
      this.loading = true;
      HRService.getUser(this.studentId).then(response => {
        this.user = response.data;
        this.user.roles = this.user.roles.map(role => role.id);
        if (this.user.type != 'STUDENT') {
          this.$router.push('/hr/students');
        }
        HRService.getRoles().then(roleResponse => {
          this.roles = roleResponse.data.map(role => {
            const disabled = role.name == 'MENTOR'  ||
                             role.name == 'ADMIN'   ||
                             role.name == 'STUDENT' ||
                             role.name == 'USER';
            return { key: role.id, label: role.name, disabled: disabled }
          });
          this.loading = false;
        });
      });
    },
    updateStudentRoles() {
      this.loading = true;
      HRService.updateStudentRoles(this.user.id, this.user.roles).then(() => {
        this.$router.back();
      });
    }
  },
  mounted() {
    this.getUser();
  }
}
</script>

<style>

</style>
