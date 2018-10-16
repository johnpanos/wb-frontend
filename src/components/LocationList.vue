<template>
  <el-container direction="vertical">
    <el-dialog
      title="Create New Location"
      :visible.sync="createDialogVisible"
      width="45%">
      <el-form>
        <el-form-item label="Location Name">
          <el-input v-model="locationName"></el-input>
        </el-form-item>
      </el-form>
      <p style="color: red;">{{ errorText }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click.end="createDialogVisible = false">Cancel</el-button>
        <el-button @click.end="createLocation" type="primary">Create</el-button>
      </span>
    </el-dialog>
    <el-row type="flex" :gutter="10">
      <el-col :offset="22" :span="2">
        <el-button style="width: 100%;" @click.end="createDialogVisible = true" type="primary" icon="el-icon-edit"></el-button>
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
    </el-table>
  </el-container>
</template>

<script>
import { InventoryService } from '../common/api.js';
export default {
  name: 'LocationList',
  data() {
    return {
      locations: [],
      createDialogVisible: false,
      locationName: '',
      errorText: ''
    }
  },
  methods: {
    createLocation() {
      this.errorText = '';
      if (this.locationName.length < 3) {
        this.errorText = 'Location name must be greater than 3 characters!';
        return;
      }
      if (this.locationName.indexOf(' ') > -1) {
        this.errorText = 'Location name cannot have spaces!';
        return;
      }
      InventoryService.createLocation(this.locationName).then(() => {
        this.refreshLocations();
        this.locationName = '';
        this.errorText = '';
        this.createDialogVisible = false;
      }).catch(() => {
        this.errorText = 'That location already exists!';
      });
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
