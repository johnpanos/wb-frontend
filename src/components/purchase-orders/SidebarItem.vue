<template>
  <div>
    <el-row>
      <el-col :span="6" class="sidebar-left-label">
        {{ label }}
      </el-col>
      <el-col :span="18">
        <slot></slot>
      </el-col>
    </el-row>
    <div class="divider" />
  </div>
</template>

<script>
export default {
  props: ['label']
}
</script>

<style>
.sidebar-left-label {
  color: #909399;
}
.divider {
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #909399;
  width: 100%;
  height: 1px;
}
</style>
