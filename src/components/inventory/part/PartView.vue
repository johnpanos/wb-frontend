<template>
  <el-container direction="vertical" v-loading="loading">
    <el-row v-if="currentPart != null" type="flex" justify="space-between" align="middle">
      <h1 v-if="!loading">{{ currentPart.name }}</h1>
      <div v-permission="['ADMIN', 'MENTOR', 'INV_EDIT']">
        <el-button v-if="!editing && !loading" type="success" round @click="startPurchaseOrder">Purchase</el-button>
        <el-button v-if="!editing && !loading" @click="editing = true" type="info">Edit</el-button>
        <el-button v-if="editing" @click="onSave" type="success">Save</el-button>
        <el-button v-if="editing" @click="onCancel" type="danger">Cancel</el-button>
      </div>
    </el-row>
    <el-container direction="vertical">
      <template v-if="currentPart != null">
        <el-row type="flex">
          <el-col>
            <h3>Name</h3>
            <text-label-edit v-model="currentPart.name" :editing="editing" />
          </el-col>
          <el-col>
            <h3>Nomenclature</h3>
            <text-label-edit v-model="currentPart.nomenclature" :editing="editing" />
          </el-col>
          <el-col>
            <h3>QR Code</h3>
            <qrcode :value="id" :options="{ size: 200 }"></qrcode>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <h3>Location</h3>
            <select-label-edit v-model="currentPart.location.id" :label="currentPart.location.name" :editing="editing" :options="locations" />-<text-label-edit v-model="currentPart.sublocation" :editing="editing" :inline="true" />
          </el-col>
          <el-col>
            <h3>Quantity</h3>
            <p>{{ currentPart.quantity }}</p>
          </el-col>
          <el-col>
            <h3>Minimum Quantity</h3>
            <p v-if="!editing">{{ currentPart.minQuantity }}</p>
            <el-input-number v-if="editing" v-model="currentPart.minQuantity" :min="1" :max="10000"></el-input-number>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <h2>Vendor Information</h2>
            <PartVendorInformationControl
              v-if="editing"
              :addVendorInfo="addVendorInfo"
              :deleteVendorInfo="deleteVendorInfo"
              :vendorInfo="currentPart.vendorInformation"
              :vendors="vendors" />
            <p
              v-if="!editing"
              v-for="vendorInfo in currentPart.vendorInformation"
              v-bind:key="vendorInfo.id"
            ><span style="font-weight:bold;">{{ vendorInfo.vendor.name }}:</span> {{ vendorInfo.partNumber }}</p>
          </el-col>
        </el-row>
      </template>
    </el-container>
  </el-container>
</template>

<script>
import { InventoryService } from '@/common/api.js';
import TextLabelEdit from '@/components/TextLabelEdit';
import SelectLabelEdit from '@/components/SelectLabelEdit';
import PartVendorInformationControl from '@/components/form/PartVendorInformationControl';
import permission from '@/directive/permission';
import { mapGetters } from 'vuex';
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
  computed: {
    ...mapGetters(['part', 'loading']),
    currentPart: {
      set(part) {
        this.$store.commit('setPart', part);
      },
      get() {
        return this.part;
      }
    },
    id() {
      return this.currentPart.id;
    },
    partName() {
      return this.currentPart.name;
    },
    nomenclature() {
      return this.currentPart.nomenclature;
    }
  },
  data() {
    return {
      editing: false,
      locations: [],
      vendors: [],
      requestDeleteVendorInfoIds: []
    }
  },
  watch: {
    partName(newValue) {
      console.log('part name')
      this.currentPart.name = newValue.toUpperCase().replace('”', '"');
    },
    nomenclature(newValue) {
      this.currentPart.nomenclature = newValue.toUpperCase().replace(' ', '_');
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
      this.$store.dispatch('getPart', this.partId);
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
      this.currentPart.vendorInformation.push({
        id: null,
        vendor: this.vendors[0],
        partNumber: ''
      });
    },
    deleteVendorInfo(i) {
      if (this.currentPart.vendorInformation[i].id != null) {
        this.requestDeleteVendorInfoIds.push(this.currentPart.vendorInformation[i].id);
      }
      this.currentPart.vendorInformation.splice(i, 1);
    },
    onCancel() {
      this.editing = false;
      this.getPart();
    },
    onSave() {
      this.editing = false;

      this.requestDeleteVendorInfoIds.map(id => {
        this.$store.dispatch('deleteVendorInfo', id);
      });

      this.requestDeleteVendorInfoIds = [];

      this.$store.dispatch('updatePart', this.currentPart);
    },
    startPurchaseOrder() {
      this.$router.push('/inventory/purchase/create?part=' + this.id);
    }
  }
}
</script>

<style>
</style>
