<template>
  <el-container direction="vertical">
    <edit-vendor-modal :visible="editModalVisible" :vendor="selectedVendor" :onClose="onEditModalClose" />
    <el-row type="flex" :gutter="10" v-permission="['ADMIN', 'MENTOR', 'INV_EDIT']">
      <el-col :offset="20" :span="4">
        <el-dropdown style="width: 100%" trigger="click" placement="bottom" @command="handleCommand">
          <el-button round :disabled="selectedVendors.length < 1" style="width: 100%">Actions<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="delete">Delete Vendor(s)</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
      <show-if-has-role :roles="['ADMIN', 'MENTOR', 'INV_EDIT']">
        <el-table-column
          fixed="right"
          label="Operations"
          width="100">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="onEdit(scope)"
              type="text"
              size="small">
              Edit
            </el-button>
          </template>
        </el-table-column>
      </show-if-has-role>
    </el-table>
  </el-container>
</template>

<script>
import { InventoryService } from '@/common/api';
import { PermissionService } from '@/common/permissions';
import EditVendorModal from '@/components/inventory/vendor/EditVendorModal';
import ShowIfHasRole from '@/components/permissions/ShowIfHasRole';
import permission from '@/directive/permission';
export default {
  name: 'VendorList',
  directives: {
    permission
  },
  components: {
    EditVendorModal,
    ShowIfHasRole
  },
  data() {
    return {
      loading: false,
      vendors: [],
      editModalVisible: false,
      selectedVendor: null,
      selectedVendors: []
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
    onEdit(scope) {
      this.selectedVendor = scope.row;
      this.editModalVisible = true;
    },
    handleSelectionChange(selected) {
      this.selectedVendors = selected;
    },
    handleCommand(command) {
      switch(command) {
        case 'delete':
          this.$confirm(`Are you sure you want to delete ${this.selectedVendors.length} vendor(s)?`)
            .then(_ => {
              this.selectedVendors.map(vendor => {
                InventoryService.deleteVendor(vendor.id).then(this.refreshVendors);
              });
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
