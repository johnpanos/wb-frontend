<template>
  <el-container direction="vertical">
    <h1>Inventory</h1>
    <el-row :gutter="20" class="inventory-information">
      <el-col :span="6">
        <inventory-action-card label="Add a Part" type="success" @click="createPart">
          <v-icon name="plus" scale="3" />
        </inventory-action-card>
      </el-col>
      <el-col :span="6">
        <inventory-information-card label="Out of Stock" type="danger">
          <p>{{ outOfStockCount }}</p>
        </inventory-information-card>
      </el-col>
      <el-col :span="6">
        <inventory-information-card label="In Order" type="warning">
          <p>{{ inOrder }}</p>
        </inventory-information-card>
      </el-col>
      <el-col :span="6">
        <inventory-information-card label="All Parts" type="primary">
          <p>{{ partCount }}</p>
        </inventory-information-card>
      </el-col>
    </el-row>
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
import InventoryActionCard from '@/components/inventory/InventoryActionCard';
import InventoryInformationCard from '@/components/inventory/InventoryInformationCard';
import { InventoryService, PurchaseOrderService } from '@/common/api';
export default {
  components: {
    PartList,
    VendorList,
    LocationList,
    InventoryActionCard,
    InventoryInformationCard
  },
  data() {
    return {
      partCount: 0,
      outOfStockCount: 0,
      inOrder: 0
    }
  },
  methods: {
    createPart() {
      this.$router.push('/inventory/parts/create');
    }
  },
  mounted() {
    InventoryService.getPartCount().then(response => {
      this.partCount = response.data;
    });
    InventoryService.getPartLowCount().then(response => {
      this.outOfStockCount = response.data;
    });
    PurchaseOrderService.getPurchaseOrderCount().then(response => {
      this.inOrder = response.data;
    });
  }
}
</script>

<style>
.inventory-information {
  margin-bottom: 20px;
}
</style>
