<template>
  <el-container direction="vertical">
    <el-table
        :data="vendors"
        border
        style="width: 100%; margin-top: 20px;"
        empty-text="No Vendors Found">
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
export default {
  name: 'VendorList',
  data() {
    return {
      search: '',
      vendors: [],
      quantityPart: {
        name: '',
        quantity: 0
      },
      quantityDialog: false,
      newQuantity: 0,
      currentPage: 1,
      selectedParts: []
    }
  },
  methods: {
    refreshVendors() {
      InventoryService.getVendors().then(response => {
        this.vendors = response.data;
      });
    },
  },
  mounted() {
    this.refreshVendors();
  }
}
</script>

<style>

</style>
