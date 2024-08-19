<template>
  <span class="label-yc">
    <!-- tag前的样式, 比如加个锁样式什么的 -->
    <i :class="['taglabel-bf', tagItem.preIcon || '']"></i>
    {{ tagItem.label }}
    <!-- tag后的样式，显示三点，代表有操作菜单 -->
    <i class="taglabel-af" v-if="showOperateMark"></i>
  </span>
</template>

<script>
export default {
  name: 'tagItemLabel',
  props: {
    tagItem: {
      type: Object,
      default() {
        return {}
      }
    },
    // 是否显示右侧菜单标记
    showOperateMark: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.label-yc {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

.taglabel-bf {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
}

// 圆
.com-circle {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #ffffff;
  display: block;
}

.taglabel-af {
  transform: translateY(-50%);
  top: 50%;
  position: absolute;
  right: 3px;
  @extend .com-circle;

  &::before {
    @extend .com-circle;
    content: ' ';
    position: relative;
    top: -6px;
  }

  &::after {
    @extend .com-circle;
    content: ' ';
    position: relative;
    top: 3px;
  }
}
</style>