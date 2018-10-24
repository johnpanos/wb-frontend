<template>
  <div>
    <el-row type="flex" justify="space-between" align="middle">
      <h1 v-if="!loading">{{ part.name }}</h1>
      <div v-permission="['ADMIN', 'MENTOR', 'INV_EDIT']">
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
             <div ref="qrCode"></div>
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
import { InventoryService } from '@/common/api.js';
import TextLabelEdit from '@/components/TextLabelEdit';
import SelectLabelEdit from '@/components/SelectLabelEdit';
import PartVendorInformationControl from '@/components/form/PartVendorInformationControl';
import permission from '@/directive/permission';
import { setTimeout } from 'timers';
export default {
  name: 'PartView',
  directives: {
    permission
  },
  components: {
    TextLabelEdit,
    SelectLabelEdit,
    PartVendorInformationControl
  },
  data() {
    return {
      loading: true,
      part: {
        name: '',
        nomenclature: '',
        quantity: 0,
        minQuantity: 1
      },
      editing: false,
      locations: [],
      vendors: [],
      requestDeleteVendorInfoIds: []
    }
  },
  computed: {
    id() {
      return this.part.id;
    },
    partName() {
      return this.part.name;
    },
    nomenclature() {
      return this.part.nomenclature;
    }
  },
  watch: {
    id() {
      setTimeout(() => {
        new QArt({
          size: 300,
          value: this.part.id.toString(),
          imagePath: '/qrbase.png',
          filter: 'color'
        }).make(this.$refs.qrCode);
      }, 10);
    },
    partName(newValue) {
      this.part.name = newValue.toUpperCase().replace('”', '"');
    },
    nomenclature(newValue) {
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
