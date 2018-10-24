<template>
  <el-dialog
    title="Vendor"
    :visible="visible"
    :before-close="onClose"
    width="45%"
    v-if="vendor != null">
    <el-form ref="form" :rules="rules" :model="vendor">
      <el-form-item label="Name" prop="name">
        <el-input v-model="vendor.name"></el-input>
      </el-form-item>
      <el-form-item label="Website" prop="website">
        <el-input v-model="vendor.website"></el-input>
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <el-input v-model="vendor.address"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="vendor.email"></el-input>
      </el-form-item>
      <el-form-item label="Phone Number" prop="phoneNumber">
        <el-input v-model="vendor.phoneNumber"></el-input>
      </el-form-item>
    </el-form>
    <p style="color: red;">{{ errorText }}</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click.end="onClose">Cancel</el-button>
      <el-button @click.end="submitForm" type="primary">{{ editing ? 'Save' : 'Create '}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { InventoryService } from '@/common/api.js';
export default {
  name: 'EditVendorModal',
  props: ['visible', 'vendor', 'onClose', 'onSave'],
  data() {
    return {
      errorText: '',
      rules: {
        name: [
          { required: true, message: 'Please input vendor name', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' }
        ],
        website: [
          { required: true, message: 'Please input a website', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'Please input an address', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input an email', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: 'Please input a phone number', trigger: 'blur' },
          { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    editing() {
      return this.vendor.id != null
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.vendor.id != null) {
            InventoryService.updateVendor(this.vendor.id, this.vendor).then(this.onClose);
          } else {
            InventoryService.createVendor(this.vendor).then(this.onClose);
          }
          this.onClose();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style>

</style>
