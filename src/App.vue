<template>
  <Home />
</template>

<script>
import Home from './components/Home.vue';

export default {
  name: 'app',
  components: {
    Home
  }
}
</script>

<style>
html, body {
  margin: 0;
  display: flex;
  flex: 1;
  height: 100vh;
  font-family: "Helvetica Neue", "Helvetica";
}
p {
  margin: 0;
  padding: 0;
}
</style>
