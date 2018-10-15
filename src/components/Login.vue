<template>
  <el-container direction="vertical" style="margin-top:50px;">
    <el-row type="flex" justify="center">
      <el-col :lg="8" :md="12" :sm="12">
        <el-card>
          <div>
            <h1>Login</h1>
          </div>
          <el-form ref="form" :model="form">
            <el-form-item label="Email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="Password">
              <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
          </el-form>
          <p style="margin-bottom: 10px; color: red;">{{ error }}</p>
          <el-button type="primary" @click.end="login">Login</el-button>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import { AuthService } from '../common/api.js';
export default {
  name: 'login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    // Login and show error if incorrect
    login() {
      this.error = '';
      AuthService.login(this.form.email, this.form.password).then(response => {
        console.log(response);
        console.log(response.data.token);
        this.$store.dispatch('authentication/updateTokenAndSave', response.data.token);
        this.$message({
          message: 'Authentication Successful',
          type: 'success'
        });
        this.$router.push("/authentication-successful");
      }).catch(() => {
        this.error = 'Invalid credentials';
      });
    }
  }
}
</script>

<style>

</style>
