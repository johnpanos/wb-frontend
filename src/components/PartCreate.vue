<template>
  <el-container direction="vertical">
    <h1>Create Part</h1>
    <el-steps :active="step" finish-status="success" :align-center="true">
      <el-step title="Part"></el-step>
      <el-step title="Vendor"></el-step>
      <el-step title="Location"></el-step>
    </el-steps>
    <el-form v-if="step == 0" style="margin-top: 20px;" ref="form" :model="partInfo" label-width="120px">
      <el-form-item label="Name">
        <el-input v-model="partInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="Nomenclature">
        <el-input v-model="partInfo.nomenclature"></el-input>
      </el-form-item>
      <el-form-item label="Initial Quantity">
        <el-input-number v-model="partInfo.quantity" :min="0" :max="1000"></el-input-number>
      </el-form-item>
      <el-form-item label="Low Quantity">
        <el-input-number v-model="partInfo.minQuantity" :min="0" :max="1000"></el-input-number>
      </el-form-item>
    </el-form>
    <el-form v-if="step == 1" style="margin-top: 20px;" ref="form" label-width="120px">
      <el-container v-for="(info, i) in vendorInfo" v-bind:key="i">
        <el-form-item label="Vendor">
          <el-select v-model="vendorInfo[i].vendor" placeholder="Select">
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
      <el-form-item>
        <el-button type="primary" @click="addVendorInfo">Add Vendor Information</el-button>
      </el-form-item>
    </el-form>
    <el-form v-if="step == 2" style="margin-top: 20px;" ref="form" label-width="120px">
        <el-form-item label="Location">
          <el-select v-model="locationInfo.location" placeholder="Select">
            <el-option
              v-for="location in locations"
              :key="location.id"
              :label="location.name"
              :value="location">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Sublocation">
          <el-input v-model="locationInfo.sublocation" placeholder="Sublocation"></el-input>
        </el-form-item>
    </el-form>
    <div v-if="step == 3">
      <p>Name: {{ partInfo.name }}</p>
      <p>Nomenclature: {{ partInfo.nomenclature }}</p>
      <p>Initial Quantity: {{ partInfo.quantity }}</p>
      <p>Low Quantity: {{ partInfo.minQuantity }}</p>
      <p>Location: {{ locationInfo.location.name }}</p>
      <p>Sublocation: {{ locationInfo.sublocation }}</p>
    </div>
      <p style="color: red;">{{ errorText }}</p>
    <div>
      <el-button v-if="step > 0" @click="previous" type="danger">Previous</el-button>
      <el-button style="margin-top: 12px;" @click="next" type="success">Next</el-button>
    </div>
  </el-container>
</template>

<script>
import { InventoryService } from '../common/api.js';
export default {
  name: 'PartCreate',
  data() {
    return {
      step: 0,
      vendors: [],
      locations: [],
      partInfo: {
        name: '',
        nomenclature: '',
        quantity: 0,
        minQuantity: 1
      },
      vendorInfo: [],
      locationInfo: {
        location: null,
        sublocation: ''
      },
      errorText: ''
    }
  },
  computed: {
    partName() {
      return this.partInfo.name;
    },
    nomenclature() {
      return this.partInfo.nomenclature;
    }
  },
  watch: {
    partName(newValue, oldValue) {
      this.partInfo.name = newValue.toUpperCase().replace('”', '"');
    },
    nomenclature(newValue, oldValue) {
      this.partInfo.nomenclature = newValue.toUpperCase().replace(' ', '_');
    }
  },
  methods: {
    next() {
      const { step } = this;
      this.errorText = '';

      switch(step) {
        case 0:
          if (this.partInfo.name.length < 5) {
            this.errorText = 'Name needs to be at least 5 characters';
          }
          if (this.partInfo.nomenclature.length < 5) {
            this.errorText = 'Nomeclature needs to be at least 5 characters';
          }
          break;
        case 1:
          this.vendorInfo.map(info => {
            if (info.partNumber.length < 1) {
              this.errorText = 'Part Number cannot be empty';
            }
          });
          break;
      }

      if (this.errorText.length === 0) {
        this.step++;
      }

      //if (this.step++ > 2) this.createPart();
    },
    previous() {
      if (this.step > 0)
        --this.step
    },
    addVendorInfo() {
      this.vendorInfo.push({
        vendor: this.vendors[0],
        partNumber: ''
      });
    },
    deleteVendorInfo(i) {
      this.vendorInfo.splice(i, 1);
    },
    createPart() {
      InventoryService.createPart({
        ...this.partInfo,
        ...this.locationInfo
      }).then(response => {
        this.vendorInfo.map(vendorInformation => {
          InventoryService.addVendorInformationToPart(response.data.id, vendorInformation.partNumber, vendorInformation.vendor.id).then(() => {
            this.$router.push('/inventory');
          });
        });
      });
    }
  },
  mounted() {
    InventoryService.getVendors().then(response => {
      this.vendors = response.data;
    });
    InventoryService.getLocations().then(response => {
      this.locations = response.data.content;
    });
  }
}
</script>

<style>

</style>
