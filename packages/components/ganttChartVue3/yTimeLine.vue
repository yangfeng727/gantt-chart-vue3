<!-- 纵向时间线 -->
<template>
  <div class="timeLine" v-show="visible" :style="{ left: left }">
    <span class="timeBox" :style="{ backgroundColor: color }">
      <!-- 底部的箭头 -->
      <i :style="{ borderTopColor: color }"></i>
      {{ title }}
    </span>
    <span class="line" :style="{ borderLeftColor: color }"></span>
  </div>
</template>

<script>
export default {
  name: 'yTimeLine',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    left: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '时间线'
    },
    // 颜色
    color: {
      type: String,
      default: '#000000'
    }
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.timeLine {
  position: absolute;
  left: 300px;
  top: 0;
  height: 100%;
  z-index: 10;
  pointer-events: none;

  .line {
    height: 100%;
    width: 1px;
    border-left: 1px #000000 dashed;
    position: absolute;
    left: 0;
    top: 0;
    transform: translateX(-50%);
    z-index: 1;
  }

  .timeBox {
    margin-top: -5px;
    left: 0;
    position: absolute;
    top: 0;
    background-color: #000000;
    border-radius: 1px;
    width: 44px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    transform: translate(-50%, -100%);
    color: #ffffff;
    z-index: 2;
    font-size: 14px;
    font-weight: normal;

    $wd: 5px;
    >i{
      position: absolute;
      left: 50%;
      border-top: $wd solid #000000;
      border-left: $wd solid transparent;
      border-bottom: $wd solid transparent;
      border-right: $wd solid transparent;
      bottom: 1px;
      transform: translate(-50%, 100%);
    }
  }
}
</style>