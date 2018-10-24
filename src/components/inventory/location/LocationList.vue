<template>
  <el-container direction="vertical">
    <el-dialog
      title="Create New Location"
      :visible.sync="createDialogVisible"
      width="45%">
      <el-form>
        <el-form-item label="Location Name">
          <el-input v-model="location.name"></el-input>
        </el-form-item>
      </el-form>
      <p style="color: red;">{{ errorText }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click.end="createDialogVisible = false">Cancel</el-button>
        <el-button @click.end="createLocation" type="primary">Create</el-button>
      </span>
    </el-dialog>
    <el-row type="flex" :gutter="10">
      <el-col v-permission="['ADMIN', 'MENTOR', 'INV_EDIT']" :offset="22" :span="2">
        <el-button style="width: 100%;" @click.end="openCreate" type="primary" icon="el-icon-edit"></el-button>
      </el-col>
    </el-row>
    <el-table
        :data="locations"
        border
        style="width: 100%; margin-top: 20px;"
        empty-text="No Locations Found">
      <el-table-column
        prop="id"
        label="ID"
        width="60">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name">
      </el-table-column>
      <show-if-has-role :roles="['ADMIN', 'MENTOR', 'INV_EDIT']">
        <el-table-column
          fixed="right"
          label="Operations"
          width="155">
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
      </show-if-has-role>
    </el-table>
  </el-container>
</template>

<script>
import { InventoryService } from '@/common/api.js';
import ShowIfHasRole from '@/components/permissions/ShowIfHasRole';
import permission from '@/directive/permission';
export default {
  name: 'LocationList',
  directives: {
    permission
  },
  components: {
    ShowIfHasRole
  },
  data() {
    return {
      locations: [],
      createDialogVisible: false,
      locationName: '',
      location: {
        name: ''
      },
      errorText: ''
    }
  },
  methods: {
    openCreate() {
      this.location = {
        name: ''
      }
      this.createDialogVisible = true;
    },
    onEdit(scope) {
      const { row } = scope;
      this.location = row;
      this.createDialogVisible = true;
    },
    onDelete({ row }) {
      this.$confirm(`Are you sure you want to delete the location ${row.name}? All parts contained in the location will be deleted as well.`).then(() => {
        this.$confirm(`THIS ACTION CANNOT BE UNDONE. ARE YOU SURE YOU WANT ${row.name} TO BE DELETED FOREVER?`).then(() => {
          InventoryService.deleteLocation(row.id).then(() => {
            this.refreshLocations();
          }).catch(() => {
            this.$message.error('An error occured deleting the location');
          });
        });
      });
    },
    createLocation() {
      this.errorText = '';
      if (this.location.name.length < 3) {
        this.errorText = 'Location name must be greater than 3 characters!';
        return;
      }
      if (this.location.name.indexOf(' ') > -1) {
        this.errorText = 'Location name cannot have spaces!';
        return;
      }
      if (this.location.id) {
        InventoryService.updateLocation(this.location.id, this.location).then(() => {
          this.refreshLocations();
          this.errorText = '';
          this.createDialogVisible = false;
        }).catch(() => {
          this.errorText = 'An error occured';
        });
      } else {
        InventoryService.createLocation(this.location.name).then(() => {
          this.refreshLocations();
          this.errorText = '';
          this.createDialogVisible = false;
        }).catch(() => {
          this.errorText = 'That location already exists!';
        });
      }
    },
    refreshLocations() {
      InventoryService.getLocations().then(response => {
        this.locations = response.data.content;
      });
    }
  },
  mounted() {
    this.refreshLocations();
  }
}
</script>

<style>

</style>
