<template>
  <el-container direction="vertical">
    <el-row type="flex" justify="end">
      <el-button style="width: 60px;" @click.end="$router.push('/hr/students/create')" type="primary" icon="el-icon-edit"></el-button>
    </el-row>
    <h1>Students</h1>
    <el-table
      border
      v-loading="loading"
      :data="students"
      :default-sort = "{prop: 'lastName', order: 'descending'}">
      <el-table-column
        sortable
        prop="student.powerSchoolId"
        label="ID"
        width="50">
      </el-table-column>
      <el-table-column
        sortable
        prop="firstName"
        label="First Name">
      </el-table-column>
      <el-table-column
        sortable
        prop="middleName"
        label="Middle Name">
      </el-table-column>
      <el-table-column
        sortable
        prop="lastName"
        label="Last Name">
      </el-table-column>
      <el-table-column
        sortable
        prop="gender"
        label="Gender">
      </el-table-column>
      <el-table-column
        sortable
        prop="birthday"
        label="Birthday">
      </el-table-column>
      <el-table-column
        sortable
        prop="cellPhone"
        label="Phone"
        width="150">
      </el-table-column>
      <el-table-column
        sortable
        prop="student.shirtSize"
        label="Shirt">
      </el-table-column>
      <el-table-column
        sortable
        prop="student.poloSize"
        label="Polo">
      </el-table-column>
      <el-table-column
        sortable
        label="FRC"
        width="50">
        <template slot-scope="scope">
          {{ scope.row.student.inFRC ? 'YES' : 'NO' }}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="FTC"
        width="50">
        <template slot-scope="scope">
          {{ scope.row.student.inFTC ? 'YES' : 'NO' }}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        label="FLL"
        width="50">
        <template slot-scope="scope">
          {{ scope.row.student.inFLL ? 'YES' : 'NO' }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Operations"
        width="275">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="onPermissions(scope)"
            type="primary"
            size="small">
            Permissions
          </el-button>
          <el-button
            @click.native.prevent="onEdit(scope)"
            type="info"
            size="small">
            Edit
          </el-button>
          <el-button
            @click.native.prevent="onDelete(scope)"
            type="danger"
            size="small">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
import { HRService } from '@/common/api';
export default {
  name: 'StudentList',
  data() {
    return {
      loading: false,
      students: []
    }
  },
  methods: {
    getStudents() {
      this.loading = true;
      HRService.getStudents().then(students => {
        this.loading = false;
        this.students = students.data;
      }); 
    },
    onPermissions(scope) {
      this.$router.push('/hr/students/permissions/' + scope.row.id);
    },
    onEdit(scope) {
      this.$router.push('/hr/students/update/' + scope.row.id);
    },
    onDelete(scope) {
      const { row } = scope;
      this.$confirm(`Are you sure you want to delete the student ${row.firstName} ${row.lastName}?`).then(() => {
        this.$confirm(`THIS ACTION CANNOT BE UNDONE. ARE YOU SURE YOU WANT ${row.firstName} ${row.lastName} TO BE DELETED?`).then(() => {
          HRService.deleteUser(row.id).then(() => {
            this.getStudents();
          });
        });
      });
    }
  },
  mounted() {
    this.getStudents();
  }
}
</script>

<style>

</style>
