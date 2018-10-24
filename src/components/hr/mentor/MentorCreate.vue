<template>
  <el-container direction="vertical" v-loading="loading">
    <div @click="onBack">
      <el-button type="primary" plain>Back</el-button>
    </div>
    <h1>Create Mentor</h1>
    <el-form ref="form" :rules="rules" :model="user">
      <el-form-item>
        <el-col :span="8">
          <el-form-item label="First Name" prop="firstName">
            <el-input v-model="user.firstName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Middle Name" prop="middleName">
            <el-input v-model="user.middleName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Last Name" prop="lastName">
            <el-input v-model="user.lastName"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item v-if="!userId" label="Password" prop="password">
        <el-input v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-col :span="12">
          <el-form-item label="Email" prop="email">
            <el-input v-model="user.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Phone" prop="cellPhone">
            <el-input v-model="user.cellPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="Gender" prop="gender">
        <el-select v-model="user.gender" placeholder="Gender">
          <el-option
            label="Male"
            value="MALE">
          </el-option>
            <el-option
            label="Female"
            value="FEMALE">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Birthday" prop="birthday">
        <el-date-picker
          v-model="user.birthday"
          type="date"
          placeholder="Pick a day">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <el-button @click="onFormSubmit" type="success">{{ this.userId ? 'Update' : 'Create' }}</el-button>
  </el-container>
</template>

<script>
import { HRService } from '@/common/api';
export default {
  name: 'MentorCreate',
  props: ['userId'],
  methods: {
    onBack() {
      this.$router.back();
    },
    onFormSubmit() {
      this.$refs.form.validate((valid) => {
        console.log(valid);
        if (valid) {
          if (this.user.id) {
            HRService.updateUser(this.user).then(response => {
              this.finish();
            }).catch(response => {
              this.$message.error('An unknown error occured');
            });
          } else {
            HRService.createMentor(this.user).then(response => {
              this.finish();
            }).catch(response => {
              this.$message.error('An error occured, the email is in use');
            });
          }
        }
      });
    },
    finish() {
      this.$router.push('/hr/mentors');
    }
  },
  mounted() {
    if (this.userId) {
      this.loading = true;
      HRService.getUser(this.userId).then(response => {
        this.user = response.data;
        this.loading = false;
      }).catch(() => {
        this.$message.error('No mentor found with the ID: ' + this.userId);
        this.finish();
      });
    }
  },
  filters: {
    user: {
      email(value) {
        return value.toLowerCase();
      }
    }
  },
  data() {
    return {
      loading: false,
      user: {
        email: '',
        password: '',
        cellPhone: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: 'MALE',
        birthday: new Date()
      },
      rules: {
        email: [
          { required: true, message: 'Please input an email', trigger: 'blur' },
          { min: 4, message: 'Length should be at least 4 characters', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'Please input a password', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' }
        ],
        cellPhone: [
          { required: true, message: 'Please input a phone number', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' }
        ],
        firstName: [
          { required: true, message: 'Please input a name', trigger: 'blur' },
          { min: 2, message: 'Length should be at least 2 characters', trigger: 'blur' }
        ],
        middleName: [
          { required: true, message: 'Please input a name', trigger: 'blur' },
          { min: 2, message: 'Length should be at least 2 characters', trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: 'Please input a name', trigger: 'blur' },
          { min: 2, message: 'Length should be at least 2 characters', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style>

</style>
