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
import { ColorHelper } from '@/common/color.js';
export default {
  name: 'inventory-information-card',
  props: ['label', 'type'],
  data() {
    return {
      hexColor: "#000000"
    }
  },
  mounted() {
    this.hexColor = ColorHelper(this.type);
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
