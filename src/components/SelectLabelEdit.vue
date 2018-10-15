<template>
  <div style="display: inline-block;">
    <el-select v-if="editing" v-bind:value="value" @change="updateInput" placeholder="Select">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <p v-if="!editing" style="display: inline;">{{ label }}</p>
  </div>
</template>

<script>
export default {
  name: 'SelectLabelEdit',
  props: ['options', 'label', 'value', 'editing'],
  methods: {
    updateInput(input) {
      this.$emit('input', input);
    }
  }
}
</script>

<style>

</style>
