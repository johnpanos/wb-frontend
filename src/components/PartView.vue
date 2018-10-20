<template>
  <div>
    <el-row type="flex" justify="space-between" align="middle">
      <h1 v-if="!loading">{{ part.name }}</h1>
      <show-if-has-role :roles="['ADMIN', 'MENTOR']">
        <div>
          <el-button v-if="!editing && !loading" @click="editing = true" type="primary">Edit</el-button>
          <el-button v-if="editing" @click="onSave" type="primary">Save</el-button>
          <el-button v-if="editing" @click="onCancel" type="danger">Cancel</el-button>
        </div>
      </show-if-has-role>
    </el-row>
    <el-container v-loading="loading" direction="vertical">
      <template v-if="part != null">
        <el-row type="flex">
          <el-col>
            <h3>Name</h3>
            <text-label-edit v-model="partName" :editing="editing" />
          </el-col>
          <el-col>
            <h3>Nomenclature</h3>
            <text-label-edit v-model="nomenclature" :editing="editing" />
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
            <p>{{ part.quantity }}</p>
          </el-col>
          <el-col>
            <h3>Minimum Quantity</h3>
            <p v-if="!editing">{{ part.minQuantity }}</p>
            <el-input-number v-if="editing" v-model="part.minQuantity" :min="1" :max="10000"></el-input-number>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <h2>Vendor Information</h2>
            <PartVendorInformationControl
              v-if="editing"
              :addVendorInfo="addVendorInfo"
              :deleteVendorInfo="deleteVendorInfo"
              :vendorInfo="part.vendorInformation"
              :vendors="vendors" />
            <p
              v-if="!editing"
              v-for="vendorInfo in part.vendorInformation"
              v-bind:key="vendorInfo.id"
            ><span style="font-weight:bold;">{{ vendorInfo.vendor.name }}:</span> {{ vendorInfo.partNumber }}</p>
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
import PartVendorInformationControl from './form/PartVendorInformationControl';
import ShowIfHasRole from './permissions/ShowIfHasRole';
export default {
  name: 'PartView',
  components: {
    TextLabelEdit,
    SelectLabelEdit,
    PartVendorInformationControl,
    ShowIfHasRole
  },
  data() {
    return {
      loading: true,
      part: null,
      editing: false,
      locations: [],
      vendors: [],
      requestDeleteVendorInfoIds: []
    }
  },
  computed: {
    partName() {
      if (!this.part) {
        return '';
      }
      return this.part.name || '';
    },
    nomenclature() {
      if (!this.part) {
        return '';
      }
      return this.part.nomenclature || '';
    }
  },
  watch: {
    partName(newValue, oldValue) {
      this.part.name = newValue.toUpperCase().replace('”', '"');
    },
    nomenclature(newValue, oldValue) {
      this.part.nomenclature = newValue.toUpperCase().replace(' ', '_');
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
    addVendorInfo() {
      this.part.vendorInformation.push({
        id: null,
        vendor: this.vendors[0],
        partNumber: ''
      });
    },
    deleteVendorInfo(i) {
      if (this.part.vendorInformation[i].id != null) {
        this.requestDeleteVendorInfoIds.push(this.part.vendorInformation[i].id);
      }
      this.part.vendorInformation.splice(i, 1);
    },
    onCancel() {
      this.editing = false;
      this.getPart();
    },
    onSave() {
      this.editing = false;
      this.loading = true;
      InventoryService.updatePartLocation(this.part.id, this.part.location.id).catch(() => {
        this.$message.error('There was an error updating the part location: ' + this.part.name);
        this.getPart();
      });
      this.requestDeleteVendorInfoIds.map(id => {
        InventoryService.deletePartVendorInformation(id);
      });
      InventoryService.updatePart(this.part).then(() => {
        this.part.vendorInformation.map(vendorInfo => {
          if (vendorInfo.id != null) {
            InventoryService.updatePartVendorInformation(vendorInfo.id, vendorInfo).then(() => {
              this.getPart();
            });
          } else {
            InventoryService.addVendorInformationToPart(this.part.id, vendorInfo.partNumber, vendorInfo.vendor.id).then(() => {
              this.getPart();
            });
          }
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
