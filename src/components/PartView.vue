<template>
  <div>
    <el-row type="flex" justify="space-between" align="middle">
      <h1 v-if="!loading">{{ part.name }}</h1>
      <div>
        <el-button v-if="!editing && !loading" @click="editing = true" type="primary">Edit</el-button>
        <el-button v-if="editing" @click="onSave" type="primary">Save</el-button>
        <el-button v-if="editing" @click="onCancel" type="danger">Cancel</el-button>
      </div>
    </el-row>
    <el-container v-loading="loading" direction="vertical">
      <template v-if="part != null">
        <el-row type="flex">
          <el-col>
            <h3>Name</h3>
            <text-label-edit v-model="part.name" :editing="editing" />
          </el-col>
          <el-col>
            <h3>Nomenclature</h3>
            <text-label-edit v-model="part.nomenclature" :editing="editing" />
          </el-col>
          <el-col>
            <h3>QR Code</h3>
            <qrcode :value="part.id" :options="{ size: 200 }"></qrcode>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <h3>Location</h3>
            <select-label-edit v-model="part.location.id" :label="part.location.name" :editing="editing" :options="locations" />-<text-label-edit v-model="part.sublocation" :editing="editing" :inline="true" />
          </el-col>
          <el-col>
            <h3>Quantity</h3>
            <text-label-edit v-model="part.quantity" />
          </el-col>
          <el-col>
            <h3>Minimum Quantity</h3>
            <text-label-edit v-model="part.minQuantity" />
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <h2>Vendor Information</h2>
            <p v-for="vendorInfo in part.vendorInformation" v-bind:key="vendorInfo.id"><select-label-edit v-model="vendorInfo.vendor.id" :label="vendorInfo.vendor.name" :editing="editing" :options="vendors" />: <text-label-edit v-model="vendorInfo.partNumber" :editing="editing" :inline="true" /></p>
          </el-col>
        </el-row>
      </template>
    </el-container>
  </div>
</template>

<script>
import { InventoryService } from '../common/api.js';
import TextLabelEdit from './TextLabelEdit';
import SelectLabelEdit from './SelectLabelEdit';
export default {
  name: 'PartView',
  components: {
    TextLabelEdit,
    SelectLabelEdit
  },
  data() {
    return {
      loading: true,
      part: null,
      editing: false,
      locations: [],
      vendors: []
    }
  },
  props: ['partId'],
  mounted() {
    this.getPart();
    this.getLocations();
    this.getVendors();
  },
  methods: {
    getPart() {
      this.loading = true;
      InventoryService.getPartById(this.partId).then(response => {
        this.part = response.data;
        this.loading = false;
      }).catch(() => {
        this.$message({
          showClose: true,
          message: 'No part was found with ID specified',
          type: 'error',
          duration: 10000
        });
        this.$router.push('/inventory');
      });
    },
    getLocations() {
      InventoryService.getLocations().then(response => {
        this.locations = response.data.content;
      });
    },
    getVendors() {
      InventoryService.getVendors().then(response => {
        this.vendors = response.data;
      });
    },
    onCancel() {
      this.editing = false;
      this.getPart();
    },
    onSave() {
      this.editing = false;
      this.loading = true;
      InventoryService.updatePart(this.part).then(() => {
        InventoryService.updatePartLocation(this.part.id, this.part.location.id).then(() => {
          this.part.vendorInformation.map(vendorInfo => {
            InventoryService.updatePartVendorInformation(vendorInfo.id, vendorInfo).then(() => {
              this.getPart();
            });
          });         
        });
      }).catch(() => {
        this.$message.error('There was an error updating the part: ' + this.part.name);
        this.getPart();
      });
    }
  }
}
</script>

<style>
</style>
