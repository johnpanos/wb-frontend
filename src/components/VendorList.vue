<template>
  <el-container direction="vertical">
    <edit-vendor-modal :visible="editModalVisible" :vendor="selectedVendor" :onClose="onEditModalClose" />
    <el-row type="flex" :gutter="10">
      <el-col :offset="20" :span="4">
        <show-if-has-role :roles="['ADMIN', 'MENTOR']">
          <el-dropdown style="width: 100%" trigger="click" placement="bottom" @command="handleCommand">
            <el-button round style="width: 100%">Actions<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="delete">Delete Vendor(s)</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </show-if-has-role>
      </el-col>
      <el-col :span="2">
        <el-button style="width: 100%;" @click.end="openCreateModal" type="primary" icon="el-icon-edit"></el-button>
      </el-col>
    </el-row>
    <el-table
        :data="vendors"
        v-loading="loading"
        border
        style="width: 100%; margin-top: 20px;"
        empty-text="No Vendors Found"
        @cell-click="onCellClick"
        @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="60">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name"
        width="150">
      </el-table-column>
      <el-table-column
        label="Website">
        <template slot-scope="scope">
          <a :href="scope.row.website" target="_blank">{{ scope.row.website }}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="Address">
        <template slot-scope="scope">
          <a :href="'http://maps.google.com/?q=' + scope.row.address" target="_blank">{{ scope.row.address }}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="Email">
        <template slot-scope="scope">
          <a :href="'mailto:' + scope.row.email">{{ scope.row.email }}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="Phone Number">
        <template slot-scope="scope">
          <a :href="'tel:' + scope.row.phoneNumber">{{ scope.row.phoneNumber }}</a>
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
import { InventoryService } from '../common/api.js';
import EditVendorModal from './EditVendorModal';
export default {
  name: 'VendorList',
  components: {
    EditVendorModal
  },
  data() {
    return {
      loading: false,
      vendors: [],
      editModalVisible: false,
      selectedVendor: null
    }
  },
  methods: {
    refreshVendors() {
      this.loading = true;
      InventoryService.getVendors().then(response => {
        this.vendors = response.data;
        this.loading = false;
      });
    },
    openCreateModal() {
      this.selectedVendor = {
        name: '',
        website: '',
        address: '',
        email: '',
        phone: ''
      };
      this.editModalVisible = true;
    },
    onEditModalClose() {
      this.editModalVisible = false;
      this.refreshVendors();
    },
    onCellClick(row) {
      console.log(row)
      this.selectedVendor = row;
      this.editModalVisible = true;
    },
    handleSelectionChange(selected) {
      this.selectedVendors = selected;
    },
    handleCommand(command) {
      switch(command) {
        case 'delete':
          this.selectedVendors.map(vendor => {
            InventoryService.deleteVendor(vendor.id).then(this.refreshVendors);
          });
          break;
      }
    },
  },
  mounted() {
    this.refreshVendors();
  }
}
</script>

<style>

</style>
