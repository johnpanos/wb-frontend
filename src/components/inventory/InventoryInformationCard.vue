<template>
  <el-card :body-style="{ padding: '0' }" shadow="hover">
    <div class="inventory-card-body" v-bind:style="{ color: hexColor }">
      <slot>
      </slot>
    </div>
    <div class="inventory-card-bottom" v-bind:style="{ backgroundColor: hexColor }">
      <p>{{ label }}</p>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'inventory-information-card',
  props: ['label', 'type'],
  data() {
    return {
      hexColor: "#000000"
    }
  },
  mounted() {
    switch(this.type) {
      default:
      case "primary":
        this.hexColor = "#409EFF";
        break;
      case "success":
        this.hexColor = "#67C23A"
        break;
      case "warning":
        this.hexColor = "#E6A23C";
        break;
      case "danger":
        this.hexColor = "#F56C6C";
        break;
    }
  }
}
</script>

<style>
.inventory-card-body {
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
}

.inventory-card-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  text-align: center;
  color: white;
}
</style>
