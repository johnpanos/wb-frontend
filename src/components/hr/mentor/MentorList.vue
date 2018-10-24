<template>
  <el-container direction="vertical">
    <el-row type="flex" justify="end">
      <el-button style="width: 60px;" @click.end="$router.push('/hr/mentors/create')" type="primary" icon="el-icon-edit"></el-button>
    </el-row>
    <h1>Mentors</h1>
    <el-table
      border
      v-loading="loading"
      :data="mentors"
      :default-sort = "{prop: 'lastName', order: 'descending'}">
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
        label="Phone">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Operations"
        width="160">
        <template slot-scope="scope">
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
  name: 'MentorList',
  data() {
    return {
      loading: false,
      mentors: []
    }
  },
  methods: {
    getMentors() {
      this.loading = true;
      HRService.getMentors().then(mentors => {
        this.loading = false;
        this.mentors = mentors.data;
      }); 
    },
    onEdit(scope) {
      this.$router.push('/hr/mentors/update/' + scope.row.id);
    },
    onDelete(scope) {
      const { row } = scope;
      this.$confirm(`Are you sure you want to delete the mentor ${row.firstName} ${row.lastName}?`).then(() => {
          this.$confirm(`THIS ACTION CANNOT BE UNDONE. ARE YOU SURE YOU WANT ${row.firstName} ${row.lastName} TO BE DELETED?`).then(() => {
            HRService.deleteMentor(row.id).then(() => {
              this.getMentors();
            });
          });
        });
    }
  },
  mounted() {
    this.getMentors();
  }
}
</script>

<style>

</style>
