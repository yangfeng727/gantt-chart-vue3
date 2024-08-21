<template>
  <div id="app">
    <h1>源码测试</h1>
    <ganttDemo />
    <h1>编译后代码测试</h1>
    <ganttDemoProduction/>
  </div>
</template>

<script>
import ganttDemo from './components/ganttDemo.vue'
import ganttDemoProduction from './components/ganttDemoProduction.vue'

export default {
  name: 'App',
  components: {
    ganttDemo,
    ganttDemoProduction
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
}

h1{
  padding: 5px 20px;
}
</style>
