<template>
  <el-form style="margin-top: 20px;" ref="form" label-width="120px">
    <el-container v-for="(info, i) in vendorInfo" v-bind:key="i">
      <el-form-item label="Vendor" label-width="60px">
        <el-select v-model="info.vendor" value-key="id" placeholder="Select">
          <el-option
            v-for="vendor in vendors"
            :key="vendor.id"
            :label="vendor.name"
            :value="vendor">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Part Number">
        <el-input v-model="vendorInfo[i].partNumber" placeholder="Part Number"></el-input>
      </el-form-item>
      <el-button type="danger" @click="deleteVendorInfo(i)" icon="el-icon-delete" style="margin-bottom: 22px; margin-left: 15px;" circle></el-button>
    </el-container>
      <el-button type="primary" @click="addVendorInfo">Add Vendor Information</el-button>
  </el-form>
</template>

<script>
export default {
  props: ['vendors', 'vendorInfo', 'deleteVendorInfo', 'addVendorInfo']
}
</script>

<style>

</style>
