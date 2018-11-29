<template>
  <el-container direction="vertical" v-loading="loading">
    <h1>Create Purchase Order</h1>
    <el-form ref="form" :rules="rules" :model="purchaseOrder" label-position="left" label-width="150px">
      <el-form-item label="Part Name" prop="partName">
        <el-input v-model="purchaseOrder.partName" :disabled="partPresent" />
      </el-form-item>
      <el-form-item label="Part Number" prop="partNumber">
        <el-input v-model="purchaseOrder.partNumber" :disabled="partPresent" />
      </el-form-item>
      <el-form-item label="Needed By" prop="needByDate">
        <el-date-picker
          v-model="purchaseOrder.needByDate"
          type="date"
          placeholder="Pick a day"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Quantity" prop="quantity">
        <el-input-number v-model="purchaseOrder.quantity" :min="1" :max="1000000" />
      </el-form-item>
      <el-form-item label="Cost Per Item (in $)" prop="costPerItem">
        <el-input-number v-model="purchaseOrder.costPerItem" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item label="Link to Part" prop="url">
        <el-input v-model="purchaseOrder.url" />
      </el-form-item>
      <el-form-item label="ASAP">
        <el-switch v-model="purchaseOrder.asap">
        </el-switch>
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="onCancel" type="danger">Cancel</el-button>
      <el-button @click="onSubmit" type="success">Submit</el-button>
    </div>
  </el-container>
</template>

<script>
import { InventoryService, PurchaseOrderService } from '@/common/api.js';
export default {
  props: ['partId'],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        }
      },
      loading: false,
      purchaseOrder: {
        needByDate: this.getInitialDate(),
        partName: '',
        partNumber: '',
        quantity: 1,
        costPerItem: 1.0,
        url: '',
        part: null,
        asap: false
      },
      rules: {
        partName: [
          { required: true, message: 'Please input a part name', trigger: 'blur' },
          { min: 4, message: 'Length should be at least 4 characters', trigger: 'blur' },
        ],
        partNumber: [
          { required: true, message: 'Please input a part number', trigger: 'blur' },
          { min: 4, message: 'Length should be at least 4 characters', trigger: 'blur' },
        ],
        needByDate: [
          { required: true, message: 'Please specify a date', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: 'Please input a quantity', trigger: 'blur' }
        ],
        costPerItem: [
          { required: true, message: 'Please input a cost per item', trigger: 'blur' }
        ],
        url: [
          { required: true, message: 'Please input a URL', trigger: 'blur' },
          { min: 4, message: 'Length should be at least 6 characters', trigger: 'blur' },
          { type: 'url', message: 'Please enter a valid URL', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    partPresent() {
      return this.partId != null;
    } 
  },
  methods: {
    onCancel() {
      this.$router.back();
    },
    fillInPart() {
      InventoryService.getPartById(this.partId)
        .then(response => {
          const part = response.data;
          this.purchaseOrder.partName = part.name;
          this.loading = false;
          part.vendorInformation.map(info => {
            this.purchaseOrder.partNumber = this.purchaseOrder.partNumber + info.vendor.name + ": " + info.partNumber + "; ";
          });
        })
        .catch();
    },
    getInitialDate() {
      var date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    },
    onSubmit() {
      this.loading = true;
      this.$refs.form.validate(valid => {
        if (valid) {
          PurchaseOrderService.createPurchaseOrder(this.purchaseOrder).then(response => {
            console.log(response);
            this.$router.push('/inventory');
          });
        } else {
          this.loading = false;
        }
      });
    }
  },
  mounted() {
    if (this.partPresent) {
      this.loading = true;
      this.purchaseOrder.part = {
        id: this.partId
      }
      this.fillInPart();
    }
  }
}
</script>

<style>

</style>
