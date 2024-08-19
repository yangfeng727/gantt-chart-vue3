<template>
  <div id="app">
    <ganttDemo />
  </div>
</template>

<script>
import ganttDemo from './components/ganttDemo.vue'

export default {
  name: 'App',
  components: {
    ganttDemo
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
