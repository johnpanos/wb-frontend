<template>
  <el-card shadow="hover">
    <div slot="header" class="clearfix">
      <span>{{ part.name }} - <em>Smart Part Connect™</em></span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="onViewPartClick">View Part</el-button>
    </div>
    <el-row :gutter="12" class="part-card-row">
      <el-col :span="12">
        <p>Name</p>
        <p>{{ part.name }}</p>
      </el-col>
      <el-col :span="12">
        <p>Nomenclature</p>
        <p>{{ part.nomenclature }}</p>
      </el-col>
      <el-col :span="12">
        <p>Quantity</p>
        <p>{{ part.quantity }}</p>
      </el-col>
      <el-col :span="12">
        <p>Minimum Quantity</p>
        <p>{{ part.minQuantity }}</p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  props: ['part'],
  methods: {
    onViewPartClick() {
      this.$router.push('/inventory/part/' + this.part.id);
    }
  }
}
</script>

<style>
.part-card-row div {
  margin-bottom: 10px;
}
</style>
