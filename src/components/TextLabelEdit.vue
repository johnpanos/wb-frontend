<template>
  <div v-bind:style="inline ? 'display: inline-block' : ''">
    <el-input v-if="editing" v-bind:value="value" @input="updateInput"></el-input>
    <p v-if="!editing">{{ value }}</p>
  </div>
</template>

<script>
export default {
  name: 'TextLabelEdit',
  props: ['value', 'inline', 'editing'],
  methods: {
    updateInput(input) {
      this.$emit('input', input);
    }
  }
}
</script>

<style>

</style>
