<template>
  <el-container direction="vertical" v-loading="loading">
    <div @click="onBack">
      <el-button type="primary" plain>Back</el-button>
    </div>
    <h1>Create Student</h1>
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
      <el-form-item v-if="!studentId" label="Password" prop="password">
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
    <el-form ref="studentForm" :rules="studentRules" :model="user.student">
      <el-form-item label="PowerSchool ID" prop="grade">
        <el-input-number v-model="user.student.powerSchoolId" :min="1" :max="5000"></el-input-number>
      </el-form-item>
      <el-form-item label="Grade" prop="grade">
        <el-input-number v-model="user.student.grade" :min="3" :max="12"></el-input-number>
      </el-form-item>
      <el-form-item label="Backup Email" prop="backupEmail">
        <el-input v-model="user.student.backupEmail"></el-input>
      </el-form-item>
      <el-form-item label="Shirt Size" prop="shirtSize">
        <el-select v-model="user.student.shirtSize" placeholder="Shirt Size">
          <el-option
            v-for="size in sizes"
            :key="size"
            :label="size"
            :value="size">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Polo Size" prop="poloSize">
        <el-select v-model="user.student.poloSize" placeholder="Polo Size">
          <el-option
            v-for="size in sizes"
            :key="size"
            :label="size"
            :value="size">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Team Status">
        <el-checkbox v-model="user.student.inFLL" label="FLL"></el-checkbox>
        <el-checkbox v-model="user.student.inFTC" label="FTC"></el-checkbox>
        <el-checkbox v-model="user.student.inFRC" label="FRC"></el-checkbox>
      </el-form-item>
    </el-form>
    <el-button @click="onFormSubmit" type="success">{{ this.studentId ? 'Update' : 'Create' }}</el-button>
  </el-container>
</template>

<script>
import { HRService } from '@/common/api';
export default {
  name: 'StudentCreate',
  props: ['studentId'],
  methods: {
    onBack() {
      this.$router.back();
    },
    onFormSubmit() {
      this.$refs.form.validate(valid => {
        this.$refs.studentForm.validate(studentValid => {
          if (valid && studentValid) {
            if (this.user.id) {
              HRService.updateStudent(this.user).then(response => {
                this.finish();
              }).catch(response => {
                this.$message.error('An error occured, the email is in use');
              });
            } else {
              HRService.createStudent(this.user).then(response => {
                this.finish();
              }).catch(response => {
                this.$message.error('An error occured, the email is in use');
              });
            }
          }
        });        
      });
    },
    finish() {
      this.$router.push('/hr/students');
    }
  },
  mounted() {
    if (this.studentId) {
      this.loading = true;
      HRService.getUser(this.studentId).then(response => {
        this.user = response.data;
        this.loading = false;
      }).catch(() => {
        this.$message.error('No student found with the ID: ' + this.studentId);
        this.finish();
      });
    }
  },
  computed: {
    email() {
      return this.user.email;
    },
    backupEmail() {
      return this.user.student.backupEmail;
    }
  },
  watch: {
    email(newValue, oldValue) {
      this.user.email = newValue.toLowerCase().replace(' ', '');
    },
    backupEmail(newValue) {
      this.user.student.backupEmail = newValue.toLowerCase().replace(' ', '');
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
        birthday: new Date(),
        student: {
          powerSchoolId: 0,
          grade: 5,
          backupEmail: '',
          shirtSize: '',
          poloSize: '',
          inFLL: false,
          inFTC: false,
          inFRC: false
        }
      },
      sizes: [
        'Youth XS',
        'Youth S',
        'Youth M',
        'Youth L',
        'Youth XL',
        'Youth XXL',
        'Adult XS',
        'Adult S',
        'Adult M',
        'Adult L',
        'Adult XL',
        'Adult XXL',
      ],
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
      },
      studentRules: {
        backupEmail: [
          { required: true, message: 'Please input an email', trigger: 'blur' },
          { min: 4, message: 'Length should be at least 4 characters', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' },
        ],
        grade: [
          { required: true, message: 'Please input a grade', trigger: 'blur' }
        ],
        powerSchoolId: [
          { required: true, message: 'Please input a PowerSchool ID', trigger: 'blur' }
        ],
        shirtSize: [
          { required: true, message: 'Please input a Shirt Size', trigger: 'blur' }
        ],
        poloSize: [
          { required: true, message: 'Please input a Polo Size', trigger: 'blur' }
        ],
      }
    }
  }
}
</script>

<style>

</style>
