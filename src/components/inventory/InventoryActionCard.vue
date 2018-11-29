<template>
  <a @click="$emit('click')" class="inventory-action-button">
    <inventory-information-card :label="label" :type="type">
      <slot></slot>
    </inventory-information-card>
  </a>
</template>

<script>
import InventoryInformationCard from '@/components/inventory/InventoryInformationCard';
export default {
  props: ['label', 'type'],
  components: {
    InventoryInformationCard
  }
}
</script>

<style>
.inventory-action-button {
  width: 100%;
  border: 0;
  padding: 0;
  background-color: transparent;
}
</style>
