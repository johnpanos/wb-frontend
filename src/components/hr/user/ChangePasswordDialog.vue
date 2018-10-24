<template>
  <el-dialog
    title="Change Password"
    :visible="visible"
    :before-close="onClose"
    width="45%">
    <el-form>
      <el-form-item label="New Password" prop="password">
        <el-input v-model="password"></el-input>
      </el-form-item>
    </el-form>
    <p style="color: red;">{{ errorText }}</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click.end="onClose">Cancel</el-button>
      <el-button @click.end="changePassword" type="primary">Change</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { HRService } from '@/common/api.js';
import { mapState } from 'vuex';
export default {
  name: 'ChangePasswordDialog',
  props: ['visible', 'onClose'],
  computed: mapState({
    user: state => state.authentication.user,
  }),
  data() {
    return {
      password: '',
      errorText: ''
    }
  },
  methods: {
    changePassword() {
      this.errorText = '';
      if (this.password.length > 5) {
        HRService.changePassword(this.password).then(() => {
          this.$message({
            message: 'The password has been changed successfully',
            type: 'success'
          });
          this.onClose();
          this.password = '';
        }).catch(() => {
          this.$message.error('An error occured changing the password');
          this.onClose();
          this.password = '';
        });
      } else {
        this.errorText = 'Password needs to be more than 5 characters long';
      }
    }
  }
}
</script>

<style>

</style>
