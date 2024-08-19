<!-- /**
 * Copyright (c) 2023 重庆隆志科技有限公司. All rights reserved.
 * author: yangfeng
 * blog: https://www.jianshu.com/u/71a7345bdabf
 * date: 2024/01/08
 * remark: 如果要分发gantt-chart-vue源码，需在本文件顶部保留此文件头信息！！
 */ -->
<!-- 甘特图标签 -->
<template>
  <div :class="[
    'tagItem',
    moving ? 'moving' : '',
    this.dragable ? 'dragable' : '',
    showSelected && tagItem.selected ? 'selected' : '',
  ]" :style="tagItem.style" @mousedown.stop="moveBox" ref="dragBoxRef" @contextmenu.stop="contextmenuHandle"
    @click.stop="clickHandle" tabindex="-2" @blur.capture="tagBlur">
    <!-- 不显示 tip -->
    <template v-if="closeTip">
      <!-- 显示的tag值 -->
      <span :class="['tagLabel', tagItem.className]">
        <tagItemLabel :tag-item="tagItem" :showOperateMark="showOperateMark" />
      </span>
    </template>
    <template v-else>
      <el-popover popper-class="ganTTTagTip" placement="right" width="206" v-model:visible="visibleTip" :show-arrow="false"
        :offset="0">
        <!-- tag tip 插槽 -->
        <slot name="tagTip" :tagData="tagItem">
          {{ tagItem.label }}
        </slot>
        <template #reference>
          <span :class="['tagLabel', tagItem.className]" @pointerenter="showTagTip(true)"
            @pointermove="showTagTip(true)" @pointerleave="showTagTip(false)">
            <!-- 显示的tag值 -->
            <tagItemLabel :tag-item="tagItem" :showOperateMark="showOperateMark" />
          </span>
        </template>

      </el-popover>
    </template>
  </div>
</template>

<script>
import { ElPopover } from 'element-plus'
import { cloneObj, findLocateParentNode, utils } from './index'
import tagItemLabel from './tagItemLabel.vue'
export default {
  name: 'tagItem',
  components: {
    // element ui
    ElPopover: ElPopover,

    tagItemLabel
  },
  props: {
    tagItem: {
      type: Object,
      default() {
        return {}
      }
    },
    // tag是否可以拖拽
    dragable: {
      type: Boolean,
      default: true
    },
    // 拖动tag点的回调事件 - 因为需要考虑各种边界条件、因此交由父组件处理
    tagMoveCallback: {
      type: Function,
      default: null
    },
    // 是否关闭 tip，默认显示tip
    closeTip: {
      type: Boolean,
      default: false
    },
    // 是否显示右侧菜单标记, true：tag后的样式，显示三点，代表有操作菜单，false: 不显示
    showOperateMark: {
      type: Boolean,
      default: false
    },
    // 是否显示tag选中 - false 不会显示选中效果
    showSelected: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      utils,
      moving: false, // 正在拖拽盒子
      changeWHing: false, // 正在拖拽点改变宽高
      visibleTip: false,
      // 解决tag click 与 tag move事件冲突问题
      moved: false, // 前一刻是否移动过 - 用于区分点击事件和move事件
      changeTimer: null
    }
  },
  methods: {
    // 右键菜单
    contextmenuHandle(e) {
      this.$emit('contextmenu', {
        e,
        tagItem: this.tagItem,
        // 其他参数直接回传，父组件不必重新计算
        dragable: this.dragable,
        closeTip: this.closeTip,
        showOperateMark: this.showOperateMark
      })
      return utils.oncontextmenuDisabled(e)
    },
    tagBlur() {
      // console.log('tagBlur 111')
      this.$emit('blur')
    },
    // 因为点击tag 会触发mousedown，mouseup，但不会触发mousemove，因此可以利用这点来区分点击还是拖动
    clickHandle(e) {
      if (this.moving || this.moved) return // 正在移动或者移动过，都不算作点击事件 
      // console.log('click', e)
      this.$emit('click', {
        e,
        tagItem: this.tagItem,
        // 其他参数直接回传，父组件不必重新计算
        dragable: this.dragable,
        closeTip: this.closeTip,
        showOperateMark: this.showOperateMark
      })
    },
    // 获取到浏览器左上角的距离
    getToContainerXY(e) {
      return {
        x: e.x || e.pageX,
        y: e.y || e.pageY
      }
    },
    // 添加移除鼠标事件
    addRemoveMouseEvent(callback) {
      // 鼠标移动
      let moveHandle = (moveE) => {
        callback && callback(moveE)
      }

      // 移除鼠标事件
      let clearMouseEvent = () => {
        window.removeEventListener('mousemove', moveHandle)
        window.removeEventListener('mouseup', clearMouseEvent)
        this.changeChangeWHing(false)
        this.changeMoveing(false)
        this.$emit('changeEnd')
      }
      window.addEventListener('mousemove', moveHandle, false)
      window.addEventListener('mouseup', clearMouseEvent, false)
    },
    // changeTageItem(obj = {}) {
    //   this.$emit('change', mergeObj({
    //     ...this.tagItem
    //   }, obj))
    // },
    changeChangeWHing(bool = false) {
      this.changeWHing = bool
    },
    changeMoveing(bool = false) {
      this.moving = bool
      if (this.moving) { // 关闭tag详情
        this.showTagTip(false)
      }
    },
    moveBox(e) {
      // console.log('mousedown', e)
      if (e && +e.button === 2) return // 鼠标右键不触发
      if (!this.dragable) return // 不可拖拽
      if (this.changeWHing) return // 正在拖拽点改变宽高，返回

      let recordTagItem = cloneObj(this.tagItem)
      this.changeMoveing(true)

      this.$emit('tagDragStart', {
        tagItem: this.tagItem
      })
      // 都以浏览器为左边和上面为基准，因为鼠标事件获取到的是距离浏览器的距离
      // 1.获取拖拽盒子有定位的父节点距离浏览器的距离
      let LocateParentNode = findLocateParentNode(this.$refs['dragBoxRef'])
      let canvasBoxLeft = 0
      let canvvasBoxTop = 0
      if (LocateParentNode) {
        let info = LocateParentNode.getBoundingClientRect()
        canvasBoxLeft = info.left
        canvvasBoxTop = info.top
      }

      // 2.被拖拽盒子距离有定位父节点左、上的距离信息
      let boxLeft = this.$refs['dragBoxRef'].offsetLeft
      let boxTop = this.$refs['dragBoxRef'].offsetTop

      // 3.鼠标在被拖拽盒子中按下的位置距离信息【距离浏览器】
      let { x: mouseLeft, y: mouseTop } = this.getToContainerXY(e) // 鼠标点击位置，距离画布边界的距离

      // 4.计算出鼠标按下点距离拖拽盒子左侧、顶部的距离 保证后续拖拽时鼠标位置相对拖拽盒子不变
      // 若发现拖动有偏移考虑是否是边框引起的
      let toBox_X = mouseLeft - boxLeft - canvasBoxLeft // 鼠标距离盒子左侧距离 鼠标距离浏览器左侧距离 - 拖拽盒子距离有定位父节点左侧距离 - 有定位父节点距离左侧距离浏览器左侧距离
      let toBox_Y = mouseTop - boxTop - canvvasBoxTop // 鼠标距离盒子顶部距离

      this.addRemoveMouseEvent((moveE) => {
        let { x, y } = this.getToContainerXY(moveE) // 鼠标点击位置，距离画布边界的距离

        // 以防万一 一定要重新获取！！ -- 不然在父级同步修改滚动距离时会计算错误
        let info = LocateParentNode.getBoundingClientRect()
        let canvasBoxLeft = info.left
        let canvvasBoxTop = info.top

        let left = x - toBox_X - canvasBoxLeft
        let top = y - toBox_Y - canvvasBoxTop
        this.tagMoveCallback && this.tagMoveCallback(
          moveE, // 鼠标event
          {
            tagItemDom: this.$refs['dragBoxRef'], // 当前拖动的tag dom
            tagItemOld: recordTagItem, // 当前拖动前的item
            tagItem: this.tagItem, // 当前拖动的item
            left, // 拖动盒子现在的left 像素
            top, // 拖动盒子现在的top 像素

            toBox_X,
            toBox_Y
          }
        )

        // 移动后延迟清空，延迟的目的是为了先触发clickHandle判断
        this.moved = true // 记录移动时间
        clearTimeout(this.changeTimer)
        // 定时清空，代表鼠标移动结束
        this.changeTimer = setTimeout(() => {
          this.moved = false
        }, 500)
      })
    },
    showTagTip(bool = false) {
      if (this.moving) {
        this.visibleTip = false
      } else {
        this.visibleTip = bool
      }
    },
  },
  mounted() {
  },
  beforeDestroy() {
    clearTimeout(this.changeTimer)
  }
}
</script>

<style lang="scss" scoped>
// 画布内tag
.tagItem {
  position: absolute;
  width: 0;
  height: 0;
  left: 0;
  top: 0;
  z-index: 4;
  background-color: #365be4;
  // padding: 3px;
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: transform ease 0.2s;

  &.dragable {
    cursor: move;
  }

  &.moving {
    // cursor: move;
    box-shadow: rgb(1, 10, 21) 0px 0px 16px;
    z-index: 9;
  }

  // 是否选中
  &.selected {
    outline: 2px dashed red;
  }

  .tagLabel {
    // line-height: normal;
    // pointer-events: none;
    user-select: none;
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 15px;
    box-sizing: border-box;
  }

  :deep(>span) {
    width: 100%;
    height: 100%;
  }

  :deep(.el-popover__reference-wrapper) {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="scss">

.ganTTTagTip {
  --el-bg-color-overlay: rgba(17, 21, 43, 0.75);
  --el-border-color-light: transparent;
  --el-text-color-regular: #FFFFFF;

  color: #ffffff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  box-sizing: border-box;
  padding: 10px;
  font-family: PingFangSC-Medium;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 500;

  $mg: 5px;

  &.el-popper[data-popper-placement^=left] {
    margin-right: $mg;
  }

  &.el-popper[data-popper-placement^=right] {
    margin-left: $mg;
  }

  &.el-popper[data-popper-placement^=top] {
    margin-bottom: $mg;
  }

  &.el-popper[data-popper-placement^=bottom] {
    margin-top: $mg;
  }
}
</style>