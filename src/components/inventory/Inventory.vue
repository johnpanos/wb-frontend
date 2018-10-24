<template>
  <el-container direction="vertical">
    <h1>Inventory</h1>
    <el-tabs type="border-card">
      <el-tab-pane label="Parts">
        <part-list />
      </el-tab-pane>
      <el-tab-pane label="Vendors">
        <vendor-list />
      </el-tab-pane>
      <el-tab-pane label="Locations">
        <location-list />
      </el-tab-pane>
    </el-tabs>
    
  </el-container>
</template>

<script>
import PartList from '@/components/inventory/part/PartList';
import VendorList from '@/components/inventory/vendor/VendorList';
import LocationList from '@/components/inventory/location/LocationList';
export default {
  components: {
    PartList,
    VendorList,
    LocationList
  }
}
</script>

<style>

</style>
