<!-- /**
 * Copyright (c) 2023 重庆隆志科技有限公司. All rights reserved.
 * author: yangfeng
 * blog: https://www.jianshu.com/u/71a7345bdabf
 * date: 2024/01/08
 * remark: 如果要分发gantt-chart-vue源码，需在本文件顶部保留此文件头信息！！
 */ -->

<!-- 甘特图vue2

  author：yangfeng
  start date：2023/11/xx

  主要是将甘特图每行渲染出来，将每个tag的起止时间放到正确位置

  实现思路：
 【.】计算宽高 -- finished
 【.】绘制网格线、禁用行色块，记得先清空 -- finished
  这里特别说明下网格：
  网格分三部分：1.css .sLine 画的标题分割线 2.canvasGridRefDom 画的内容区域网格 3.canvasGanttRefDom 补充
  这么麻烦？因为要考虑到横向滚动，纵向滚动【后续可以扩展的功能】，再加上overflow：hidden让子元素无法显示，
  若设置为visible又无法滚动，或者会让内部需要隐藏的元素又显示出来，最终用这三步才实现~~~
 【.】整个甘特图支持横向滚动条，宽度足够时横向自适应铺满，不够时显示横向滚动。重要！-- finished
 【.】标题栏颜色--外部自行修改css实现，不提取到props了，减少参数 -- finished
 【.】渲染初始 tag -- finished
 【.】底部支持显示统计行 -- finished
 【.】拖动tag时显示时间线 -- finished
 【.】点击显示标记线，标记线多个甘特图联动 .sync 实现 -- finished
 【.】画布内右键菜单，抛出事件 -- finished
 【.】提供内部新增、修改、删除tag的方法 -- finished
 【.】左侧任务栏提供操作菜单，可以配置全部菜单或者单独配置某行菜单，支持按钮禁用 -- finished
 【.】提供甘特图只读模式readOnly -- finished
 【.】tag拖动，结束后弹窗选择起止时间，可选择是否开启此功能 -- finished
 【.】tag tooltip 采用 el-popover实现, 默认显示tag的tooltip、支持单个tag的tip关闭、使用插槽父组件可自行修改tag tooltip内容。
  tip 显示的优先级为：当前tag 设置的closeTip > 当前tag对应legend设置的closeTip > 最后都没设置的默认显示tip -- finished
 【.】tag 右键菜单功能，菜单在legend中配置，点击菜单按钮抛出参数 -- finished
 【.】tag 支持点击显示选中效果tag selected为true即可，可以全局关闭，提供获取所有选中项，清空所有选中项api -- finished
 【.】tag 前可以显示自定义图标，就是个类名放到tag前的<i> 标签里面，推荐使用iconfont -- finished
 【.】tag新增 hide 字段，可控制单个tag是否显示。hide 为 true 即可隐藏此tag -- finished
 【.】在甘特图中标记当前时间-时间线，前提是当前时间在任务开始结束区间内 -- finished
 【.】甘特图支持给有数据行设置最小高度 -- finished
 【.】控制tag拖动是否可以拖动 1.配置legend中当前行类型tag的dragable 2.配置rows中每个tag 的dragable -- finished
 【.】高度自适应实现思路【注意：若父级盒子未设置高度，则初始默认撑开，若设置了高度，则限定在高度范围内】
      gantt-chart-wrap 盒子高度是外层盒子的高度，需要自适应的。减去底部合计行，顶部时间标题行高度是剩下的拖拽画布高度，注意因为tag在里面可以拖动，因此考虑生成上下滚动条
      注意：甘特图高度自适应是指将甘特图限定在父容器高度范围内，若不想显示纵向滚动条，则关闭自适应高度的功能，甘特图将撑开，此时父容器不用设置高度
 【.】甘特图实现任务持续时间加减n天显示，tag拖动到有滚动条边界时时滚动条滚动  -- finished
 【.】甘特图实现tag拖动时，后面tag的避让效果。特别注意：拖动结束后需要重新触发甘特图init方法才会清除避让信息！这部分是垃圾数据，只是为了有个避让效果，和甘特图本身数据无关！  -- finished

  待自行优化点，也可以选择不优化，优化后可提升一点性能，我懒得去改：
  1.tooltip 单独提出来，只渲染一次。现在采用el-popover每个tag都会生成自己的tooltip，导致dom有点浪费。
-->
<template>
  <div class="gantt-chart-wrap">
    <!-- 顶部间隙,留给时间线展示用 -->
    <div class="gap" :style="{ background: ganttBgColor }"></div>
    <div :style="{ background: ganttBgColor }" tabindex="-2" class="gantt-chart-box" ref="ganttBoxRefDom"
      @click="ganTTClick" @blur="ganTTblur" @contextmenu="utils.oncontextmenuDisabled">
      <!-- 纵向时间线 - 显示当前时间 -->
      <yTimeLine v-bind="currentTimeLine" />
      <!-- 纵向时间线 - 点击图时显示的时间线 -->
      <yTimeLine v-bind="markLine" />
      <!-- 纵向时间线 - 移动tag时显示的 -->
      <yTimeLine v-bind="movingTimeLine" style="z-index: 20;" />

      <!-- canvas 绘制标题网格线 -->
      <canvas ref="canvasGanttRefDom">您的浏览器不支持 HTML5 canvas标签</canvas>

      <!-- 顶部时间行 -->
      <div class="row-header" :style="{ height: paintTop }">
        <span class="gt-title" ref="titleRefDom" :style="{ width: paintLeft, height: paintTop }">{{ title }}</span>
        <!-- 标题列 -->
        <div class="header-right">
          <div class="scrollX" ref="headerBoxRefDom">
            <span class="paint-col" v-for="(col, cIndex) in colsInfo" :key="cIndex">
              <span class="name">{{ utils._date.format(col.label, timeFormat) }}</span>
              <!-- 分割线 -->
              <i class="sLine" :style="{ background: gridLineColor }"></i>
            </span>
          </div>
        </div>

      </div>
      <div class="row-bottom" :style="{ height: ganTTBottomHeight ? ganTTBottomHeight + 'px' : '' }">
        <!-- 第一列-任务列，每行对应的任务名称 -->
        <div class="box-left scrollY" :style="{ width: paintLeft }">
          <div :class="{
            'paint-row': true,
            'disabled': row.disabled,
            'canSelected': taskMenuList.length || row.taskMenuList,
            'selected': taskMenu.selectRow && taskMenu.selectRow.label === row.label
          }" v-for="(row, rIndex) in rowsInfo" :key="rIndex"
            :style="{ 'backgroundColor': row.disabled ? disabledBgColor : '' }"
            @contextmenu.stop="taskMenu_Open($event, row)">
            <span class="name">{{ row.label }}</span>
            <!-- 分割线 -->
            <i class="sLine" :style="{ background: gridLineColor }"></i>
          </div>
        </div>
        <!-- 画布盒子 -->
        <div class="box-right" ref="boxRightRefDom">
          <!-- 真实画布区域 -->
          <div class="box-paint scrollY" ref="paintBoxRefDom" style="text-align: right;">
            <!-- canvas 绘制色块、网格线 -->
            <canvas ref="canvasGridRefDom">您的浏览器不支持 HTML5 canvas标签</canvas>
            <!-- canvas 绘制参考线 -->
            <canvas ref="canvasGuideBoxRefDom" style="z-index: 99;">您的浏览器不支持 HTML5 canvas标签</canvas>

            <!-- 甘特图右键菜单 -->
            <div class="rightClickMenu" ref="rightClickMenuRefDom" @contextmenu="utils.oncontextmenuDisabled">
              <ul>
                <li :class="{ 'disabled': mItem.disabled }" @click.stop="rightClickMenuEvent($event, mItem, btnIndex)"
                  @contextmenu.stop="utils.oncontextmenuDisabled" v-for="(mItem, btnIndex) in rightClickMenuList"
                  :key="`${mItem}-${btnIndex}}}`">{{
                    mItem.label }}</li>
              </ul>
            </div>

            <!-- tag右侧操作菜单 -->
            <ul class="tag-menu" ref="tagMenuRefDom" v-show="tagMenu.visible" :style="tagMenu.style"
              @click="autoCloseTagMenu = false">
              <li v-for="(tagBtnItem, tagBtnIndex) in tagMenu.btnList" :key="`${tagBtnItem.label}-${tagBtnIndex}}`"
                :class="{ 'disabled': tagBtnItem.disabled }"
                @click.stop="tagMenuBtnClickHandle($event, tagBtnItem, tagBtnIndex)"
                @contextmenu.stop="utils.oncontextmenuDisabled">
                {{ tagBtnItem.label }}</li>
            </ul>

            <!-- 内部标签 -->
            <template v-for="item in tagList">
              <tagItem :key="item.tagId" v-if="!item.hide" :tipWdith="tipWdith" :tagItem="item" :tagMoveCallback="tagMove"
                @tagDragStart="tagDragStart" @changeEnd="tagChangeEnd"
                :style="{ background: getLegendConfig(item).color || '#000000' }" :dragable="tagItemDragable(item)"
                :closeTip="tagItemCloseTip(item)" :showOperateMark="tagHasOperateMenu(item)"
                :showSelected="showSelected" @tagContextmenu="tagContextmenuHandle" @tagClick="tagClickHandle"
                @tagBlur="tagblurHandle" :tipEnterable="tipEnterable">

                <!-- tag hover显示的内容插槽 -->
                <template #tagTip="{ tagData }">
                  <slot name="tagTip" :tagData="tagData"></slot>
                </template>

              </tagItem>
            </template>
          </div>
          <!-- 横向滚动条,借助div，这里将功能独立出去是为了让滚动条高度和画布高度分离，不影响计算 -->
          <div class="scrollXBar" ref="scrollXBarDom">
            <div :style="{ width: this.paintBoxInfo.width + 'px' }"></div>
          </div>
        </div>

        <!-- 纵向滚动条,借助div，这里将功能独立出去是为了让滚动条高度和画布高度分离，不影响计算 -->
        <div class="scrollYBar" ref="scrollYBarDom">
          <div :style="{ height: this.paintBoxInfo.height + 'px' }"></div>
        </div>
      </div>

      <!-- 底部-展示的统计行 -->
      <div class="stat-bottom" v-for="(suArr, suIndex) in summaryRows" :key="suIndex">
        <template v-if="suArr.length > 0">
          <div class="stat-bottom_title" :style="{ width: paintLeft, minHeight: rowMinRowHeight }">{{ suArr[0] }}</div>
          <div class="stat-bottom_right">
            <div class="scrollX">
              <span class="stat-bottom_col" v-for="(col, cIndex) in colsInfo" :key="`${suIndex}-${cIndex}`"
                :style="{ width: `${colsInfo[cIndex] ? colsInfo[cIndex].w : 0}px` }">
                <span class="name">{{ suArr[cIndex + 1] }}</span>
                <!-- 分割线 -->
                <i class="sLine" :style="{ background: gridLineColor }"></i>
              </span>
            </div>
          </div>
        </template>
      </div>

      <!-- 左侧任务列操作菜单 -->
      <ul class="task-menu" ref="taskMenuRefDom" v-show="taskMenu.visible" :style="taskMenu.style">
        <li v-for="(taskBtnItem, taskBtnIndex) in taskMenu.btnList" :key="`${taskBtnItem.label}-${taskBtnIndex}}`"
          :class="{ 'disabled': taskBtnItem.disabled }"
          @click.stop="taskMenuBtnClick($event, taskBtnItem, taskBtnIndex)"
          @contextmenu.stop="utils.oncontextmenuDisabled">
          {{ taskBtnItem.label }}</li>
      </ul>
    </div>

    <!-- tag时间选择 -->
    <el-dialog title="时间选择" v-model="tagTimeDialog.visible" width="450px" :close-on-click-modal="false">
      <div>
        <el-date-picker v-model="tagTimeDialog.timeRange" type="datetimerange" :picker-options="pickerOptions"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          value-format="yyyy/MM/dd HH:mm:ss">
        </el-date-picker>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeTagTimeDialog">取 消</el-button>
          <el-button type="primary" @click="confirmTagTimeDlaiog">确 定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>
<script>

import { ElMessage, ElButton, ElDialog, ElDatePicker } from 'element-plus'
import { utils, moveInBoundary, tagIsTouchDisabledRow, uuid, cloneObj } from './index'
import tagItem from './tagItem.vue'
import yTimeLine from './yTimeLine.vue'

let resizeObserver;
const rowPaddingTop = 4; // 单元格纵向padding
const rowContentHeight = 28 // 单元格行高，不包含上下padding 【注意：不要小于tagHeight高度】
const tagHeight = 28 // tag 高度
const tagMarginTop = 5 // tag 纵向margin高度
const headerCellMinWidth = 100 // 顶部标题栏，每列最小宽度
let minSowTagRow = 2 // 有数据时，单行内至少显示几行tag - 需求是任务行不能太矮，至少也要显示两行高度

// 计算的高度-不用改
const minRowHeight = 2 * rowPaddingTop + Math.min(...[tagHeight, rowContentHeight]) // 行最小高度 - 无数据的行
minSowTagRow = minSowTagRow < 0 ? 1 : minSowTagRow
let hasTagsDataMinRowHeight = 2 * rowPaddingTop + minSowTagRow * tagHeight + (minSowTagRow - 1) * tagMarginTop // -有数据的行 - 至少显示几行tag【需求：有数据的行高度要高点】 - 第一行 tag 不需要margin-top
hasTagsDataMinRowHeight = Math.max(...[hasTagsDataMinRowHeight, minRowHeight]) // 有数据行的最小高度

export default {
  name: 'gantt-chart-vue3',
  // model: {
  //   prop: 'markLineTime',
  //   event: 'changeMarkLineTime'
  // },
  components: {
    // element ui
    ElButton,
    ElDialog,
    ElDatePicker,

    tagItem,
    yTimeLine,
  },
  props: {
    // 是否只读，最高优先级，禁用所有编辑功能，如拖拽，右键菜单等
    readOnly: {
      type: Boolean,
      default: false
    },
    // 禁用行是否不触发事件，tag不可拖动到禁用行，不触发右键菜单 true：禁止拖入 false：可以拖入
    disabledRowSilent: {
      type: Boolean,
      default: false
    },
    // 是否显示tag选中 - false 不会显示选中效果
    showSelected: {
      type: Boolean,
      default: false
    },

    /*
     是否开启甘特图高度自适应：
     true：限定在父级设置的高度范围内，超出将显示纵向滚动条，如果父容器未设置高度，将以初始渲染的高度为准，后续都限定在此高度范围内
     false：甘特图自动撑开，特别注意父容器不要设置高度！！！
    */
    selfAdaptionGanTTHeight: {
      type: Boolean,
      default: true
    },

    // 甘特图类型
    legend: {
      type: Array,
      // required: true,
      default() {
        return [
          // {
          //   label: '模型预排',
          //   color: '#365ce5',
          //   type: 1, // 用于判定同一网格行内具体所属行
          //   dragable: true, // 此类型tag是否可以拖动，也可以在rows中配置单个tag是否可以拖动
          //   closeTip: false, // 显示tag tip，也可以在rows中配置单个tag是否关闭提示
          //   btnList: [ // 右键菜单按钮列表
          //     {
          //       label: '开启tag选中',
          //       disabled: false
          //     },
          //     {
          //       label: '关闭tag选中',
          //       disabled: false
          //     },
          //     {
          //       label: 'tag前添加图标',
          //       disabled: false
          //     }
          //   ]
          // },
          // {
          //   label: '生产实绩',
          //   color: '#39c236',
          //   type: 2, // 用于判定同一网格行内具体所属行
          // },
          // {
          //   label: '计划停机1',
          //   color: '#f5212d',
          //   type: 3, // 用于判定同一网格行内具体所属行
          //   closeTip: true // 关闭此大类的tag tip，若tag自行设置有closeTip，则以tag 内的为准
          // },
          // {
          //   label: '计划停机2',
          //   color: '#ff9c1b',
          //   type: 4 // 用于判定同一网格行内具体所属行
          // }
        ]
      }
    },
    // 甘特图标题
    title: {
      type: String,
      // required: true,
      default: '甘特图'
    },
    // 初始显示的甘特图列开始时间
    startDate: {
      type: String,
      // required: true,
      default: '2023/12/01'
    },
    // 任务持续时间 - 从开始时间计算
    dateDuration: {
      type: Number,
      // required: true,
      default: 7
    },

    /*
    说明：
    甘特图为7+2天，如果tag往左移出了，甘特图时间轴需要 - 1天；往右移出则 + 1 天，此时甘特图需要出现滚动条
    */
    // 除了dateDuration任务持续时间，当tag横向拖动到左边界时，可以往前几天时间
    decreaseDayNum: {
      type: Number,
      default: 0,
      validator: function (value) {
        return value >= 0
      }
    },
    // 除了dateDuration任务持续时间，当tag横向拖动到右边界时，可以往后几天时间
    IncreaseDayNum: {
      type: Number,
      default: 0,
      validator: function (value) {
        return value >= 0
      }
    },

    // 列-时间显示成的格式
    timeFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    // 甘特图行
    rows: {
      type: Array,
      // required: true,
      default: () => [
        // {
        //   label: '项目A',
        //   tags: [ // 注意：属性在 backfillTag 方法中声明才会生效，其他数据会统一放到 tag.data 中,属于不被承认的外部数据，虽然也能实现。。。
        //     {
        //       startTime: '2023/12/01 02:10:00',
        //       endTime: '2023/12/03 06:10:00',
        //       label: '关闭tag的hover tip效果',
        //       type: 2,
        //       closeTip: true, // 不显示此tag的tip，注意：只有true|false才会生效
        //       dragable: true, // 此类型tag是否可以拖动,优先级最高，不设置将取legend的dragable，都没有则禁止拖动，注意：只有true|false才会生效
        //       className: 'tagSpecial', // 可单独设置tag样式名
        //       selected: false, // 当前tag是否选中-有选中样式
        //       preIcon: 'el-icon-video-camera-solid', // tag前的图标
        //       hide: false // 是否隐藏此tag
        //     },
        //     {
        //       startTime: '2023/12/01 02:10:00',
        //       endTime: '2023/12/03 06:10:00',
        //       label: '关闭此类型tip-1',
        //       type: 3
        //     },
        //     {
        //       startTime: '2023/12/01 02:10:00',
        //       endTime: '2023/12/03 06:10:00',
        //       label: '计划停机2,完成度90%',
        //       type: 4
        //     },
        //     {
        //       startTime: '2023/12/03 08:00:00',
        //       endTime: '2023/12/05 10:10:00',
        //       label: '关闭此类型tip-2',
        //       type: 3
        //     },
        //     {
        //       startTime: '2023/12/06 02:10:00',
        //       endTime: '2023/12/07 06:00:00',
        //       label: 'tag右键菜单展示demo',
        //       type: 1
        //     },
        //   ]
        // },
        // {
        //   label: '项目B',
        //   tags: [
        //     {
        //       startTime: '2023/12/06 02:10:00',
        //       endTime: '2023/12/07 06:10:00',
        //       label: '模型预排1111,xx吨,完成度90%',
        //       type: 1
        //     },
        //     {
        //       startTime: '2023/12/01 02:10:00',
        //       endTime: '2023/12/03 06:10:00',
        //       label: 'xxxx,xx吨,完成度90%',
        //       type: 3
        //     },
        //   ]
        // },
        // {
        //   label: '项目C',
        //   tags: []
        // },
        // {
        //   label: '项目D',
        //   tags: [
        //     {
        //       startTime: '2023/12/01 02:10:00',
        //       endTime: '2023/12/03 06:10:00',
        //       label: 'xxxx,xx吨,完成度90%',
        //       type: 1
        //     },
        //   ]
        // },
        // {
        //   label: '项目E',
        //   tags: []
        // },
        // {
        //   label: '项目F',
        //   tags: []
        // },
        // {
        //   label: '项目G',
        //   disabled: true, // 禁止响应事件
        //   tags: []
        // },
        // {
        //   label: '项目H',
        //   tags: []
        // },
      ]
    },
    // 甘特图底部统计行
    summaryRows: {
      type: Array,
      default() {
        return [
          // ['合计1', '1', '2', '3', '1', '2', '3'],
          // ['合计2', 'a', 'b', 'c', 'd', 'e', 'f'],
        ]
      }
    },
    // 是否显示标线 - 只读模式下标线功能未禁止
    showMarkLine: {
      type: Boolean,
      default: false
    },
    markLineTime: { // 标记线对应的时间
      type: String,
      default: ''
    },

    // 甘特图右键菜单里面的按钮
    rightClickMenuList: {
      type: Array,
      default() {
        return [
          // {
          //   label: '新增模型',
          //   disabled: false
          // },
          // {
          //   label: '新增停机',
          //   disabled: false // 是否禁用
          // }
        ]
      }
    },
    // 任务列菜单 - 每行的菜单都一样，若想给某行单独设置不同的菜单，则给row 对应行赋值 taskMenuList
    taskMenuList: {
      type: Array,
      default() {
        return [
          // {
          //   label: '停产',
          //   disabled: false // 是否禁用
          // },
          // {
          //   label: '启用',
          //   disabled: false // 是否禁用
          // }
        ]
      }
    },

    // tag拖拽结束是否显示时间选择框
    dragTagEndShowTimeDialog: {
      type: Boolean,
      default: false
    },

    // tag拖动的避让效果，只是单纯显示，原理: 修改translateX(x)，这样不会对原始数据造成影响
    //【注意!!!：开启此功能后，将导致某些tag含有translateX 偏移，从而让甘特图表现异常-正确用法时每次拖动结束【比如调接扣计算】，然后重新渲染整个甘特图】
    openTagMoveDodgeAnimate: {
      type: Boolean,
      default: false
    },

    // tooltip 宽度
    tipWdith: {
      type: [String,Number],
      default: 206
    },

    // 鼠标是否可进入到 tag的 tooltip 中， 同 element plus tooltip enterable -- vue3 甘特图特有属性
    tipEnterable:{
      type: Boolean,
      default: false // 默认不可以进入
    },

    // 样式部分 >>
    // 甘特图背景色
    ganttBgColor: {
      type: String,
      default: '#ffffff'
    },
    // 停用行-背景色
    disabledBgColor: {
      type: String,
      default: '#ececec'
    },
    // 画布左侧 “类目列” 宽
    paintLeft: {
      type: String,
      default: '80px'
    },
    // 画布顶部 “时间列” 高
    paintTop: {
      type: String,
      default: '40px'
    },
    // 网格线的颜色
    gridLineColor: {
      type: String,
      default: '#dddddd'
    }
    // 样式部分 <<
  },
  data() {
    return {
      rowMinRowHeight: minRowHeight + 'px',
      ganTTBottomHeight: 0, // 底部剩余最大高度 - 用于 自适应高度 功能
      utils,

      isFirstInit: true, // 是否初次渲染
      scrolledXPercent: 0, // 记录横向滚动的百分比 - 甘特图resize后需要保证横向滚动百分比不变，也就是之前列从哪里开始的，resize后也从哪里开始  
      // 防抖
      tickTimer: null,
      scrollTimer: null,
      rowsInfo: [], // 行信息
      colsInfo: [], // 列信息
      // 画布内拖拽区域
      paintBoxInfo: {
        width: 0,
        height: 0
      },
      tagList: [], // 画布中的tag

      // 正在拖拽的信息
      draging: {
        tagItemOld: {}, // 拖拽前tag Data
        tagItem: {}, // 拖拽的tag Data
        tagItemDom: null, // 拖拽的tag Dom
        left: 0,
        top: 0
      },
      historyDraging: { // 存储上次拖拽的信息，用于优化交互效果
        left: null,
        top: null
      },
      dodgeTagsInfo: {}, // 格式为：{tagId:translateX(xx)} 存储避让的tag信息，拖拽结束先显示避让后的效果

      // 移动tag时显示的，纵向时间线
      movingTimeLine: {
        visible: false,
        left: '0px',
        title: '',
        color: '#000000'
      },
      // 点击图时显示的时间线
      markLine: {
        visible: false,
        left: '0px',
        title: '',
        color: 'red'
      },
      // 显示当前时间的时间线
      currentTimeLine: {
        visible: false,
        left: '0px',
        title: '',
        color: '#000000'
      },
      tickCurrentTimer: null, // 定时获取当前时间的定时器

      // 右键菜单相关
      rightMenuTemObj: {
      },

      // 左侧任务列操作菜单相关
      taskMenu: {
        visible: false,
        btnList: [], // 操作按钮
        selectRow: {}, // 选中行
        style: {
          left: '0px',
          top: '0px'
        }
      },
      // tag右键操作菜单
      tagMenu: {
        visible: false,
        btnList: [], // 操作按钮
        selectTag: {}, // 选中行
        style: {
          left: '0px',
          top: '0px'
        }
      },
      autoCloseTagMenu: true, // 是否自动关闭tag右键菜单 - 因为事件冲突，默认tag失去焦点时关闭tag菜单。两种情况除外 1.点击其tag menu 2.打开其他tag menu

      // tag时间选择
      tagTimeDialog: {
        visible: false,
        timeRange: [],
        tag: {} // 需要修改的tag
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  watch: {
    // 行列数据和甘特图有强关联，数据改变需要重新渲染
    rows: {
      handler() {
        console.log('ganTT rows change...')
        this.init()
      },
      deep: true
    },
    startDate: {
      handler() {
        this.init()
      }
    },
    dateDuration: {
      handler() {
        this.init()
      }
    },
    decreaseDayNum: {
      handler() {
        this.init()
      }
    },
    IncreaseDayNum: {
      handler() {
        this.init()
      }
    },

    // #region 标记线逻辑
    // 标记线
    showMarkLine: {
      handler() {
        this.showAxisTime(this.markLineTime)
      }
    },
    // 标记时间
    markLineTime: {
      handler() {
        this.showAxisTime(this.markLineTime)
      }
    }
    //#endregion 标记线逻辑
  },
  computed: {
    // 标题宽
    paintLeftVal() {
      return +utils.delValUnit(this.paintLeft)
    },
    // 标题高
    paintTopVal() {
      return +utils.delValUnit(this.paintTop)
    },

  },
  methods: {

    /**
     * 在画布盒子中的宽 - 像素px 转为 百分比
     * @param {*} pxw 像素宽
     * @param {*} repair 是否在后面补百分号
     */
    reW(pxw, repair = true) {
      let val = (Number(pxw || 0) / utils.getDOMWH(this.$refs['paintBoxRefDom']).w * 100).toFixed(2)
      return repair ? `${val}%` : val
    },
    /**
     * 在画布盒子中的高 - 像素px 转为 百分比
     * @param {*} pxH 像素高
     * @param {*} repair 是否在后面补百分号
     */
    reH(pxH, repair = true) {
      let val = (Number(pxH || 0) / utils.getDOMWH(this.$refs['paintBoxRefDom']).h * 100).toFixed(2)
      return repair ? `${val}%` : val
    },

    /**
     * 将时间(毫秒)转为最小时间粒度 - 现在甘特图是以分钟为粒度，后面需要扩展再说
     * @param {*} time 具体时间或者时间戳差值
     * @param {*} isTimeStap time是否是时间戳
     */
    dealTime(time, isTimeStap = false) {
      let _tt = time
      if (!isTimeStap) {
        _tt = new Date(time).getTime()
      }
      return _tt / 1000 / 60
    },
    // 将最小时间粒度转为毫秒
    dealTimeToMs(timeLd) {
      return timeLd * 60 * 1000
    },

    // 整个甘特图的时间范围
    getGanTTimeRange() {
      if (this.colsInfo.length <= 0) return null
      let startTime = new Date(`${this.colsInfo[0].label} 00:00:00`).getTime()
      let endTime = new Date(`${this.colsInfo[this.colsInfo.length - 1].label} 23:59:59`).getTime()

      return {
        startTime,
        endTime
      }
    },

    // 获取横向 1px 对应的最小时间粒度【分钟】
    getPxOfTimeParticle() {
      let paintBoxDom = this.$refs['paintBoxRefDom']
      if (this.colsInfo.length <= 0 || !paintBoxDom) return false
      let { startTime, endTime } = this.getGanTTimeRange()
      // 如时间跨度9天：9*24*60 = 12960 分钟，最小粒度 1px = 12960/500【假设甘特图宽500】= 25.92
      return (((endTime - startTime) / 1000 / 60).toFixed(0) / utils.getDOMWH(paintBoxDom).w)
    },

    // 将时间差 - 毫秒时间戳 转为 在甘特图【.box-paint】中的横向距离
    timeStampGapToInfeedDistance(timeMs) {
      let _stime = this.dealTime(timeMs, true)
      return Number(_stime / this.getPxOfTimeParticle()).toFixed(6)
    },

    /**
     * 将left 转为 横向的时间维度
     * @param {*} left 距离 paintBoxRefDom 画布左侧距离
     * @param {*} startTime 开始时间，默认任务开始时间
     */
    getStartTimeByLeft(left = 0, startTime) {
      if (this.colsInfo.length <= 0) return false
      startTime = new Date(startTime).getTime() || new Date(`${this.colsInfo[0].label} 00:00:00`).getTime()
      let period = this.dealTimeToMs(left * this.getPxOfTimeParticle()) // left 值转为 毫秒

      return utils._date.format(startTime + period, 'YYYY/MM/DD HH:mm:ss')
    },

    /**
     * 将在画布中的时间转为在 paintBoxRefDom 画布中的left
     * @param {*} time 画布中的时间
     */
    getLeftByStartTime(time = '') {
      if (!time) return 0
      if (this.colsInfo.length <= 0) return false

      let startGTTTime = this.dealTime(`${this.colsInfo[0].label} 00:00:00`)// 甘特图任务开始时间
      if (time < startGTTTime) {
        console.error('开始时间小于甘特图任务开始时间')
        return false
      }
      // 转为分钟
      let _stime = this.dealTime(time)
      let pxOfTimeParticle = this.getPxOfTimeParticle()
      return Number((_stime - startGTTTime) / pxOfTimeParticle).toFixed(6)
    },

    /**
    * 将画布【paintBoxRefDom】中的left 转为在甘特图【ganttBoxRefDom】中的left
    * @param {*} left
    */
    canvasLeftToGanTTLeft(left) {
      return +left - this.getScrollLeft() + this.paintLeftVal
    },
    /**
     * 甘特图【ganttBoxRefDom】中的left 转为 画布【paintBoxRefDom】中的left
     * @param {*} left 
     */
    ganTTLeftToCanvasLeft(left) {
      return +left - this.paintLeftVal + this.getScrollLeft()
    },

    // #region 计算落点位置

    /**
     * 在box-paint 盒子中的像素坐标转数据坐标
     * @param {*} x paintBoxRefDom 中该点的像素坐标x
     * @param {*} y paintBoxRefDom 中该点的像素坐标y
     * @returns
     */
    pixelToDataCoordinate(x, y) {

      let currentRowIndex = this.getRowIndexByTop(y)
      return {
        x,
        y,
        // 横纵坐标
        coords: [
          this.getStartTimeByLeft(x),
          currentRowIndex > -1 ? this.rowsInfo[currentRowIndex].label : null,
        ]
      }
    },

    /**
     * 生成禁用行对应的纵坐标数组
     * @return {min:number,max:number}[]
     */
    getDisabledYS() {
      let y = 0;
      let disabedYArr = [] // 禁止进入的纵向范围数组
      this.rowsInfo.map(subItem => {
        if (subItem.disabled) {
          disabedYArr.push({
            min: y, // 起点y
            max: y + subItem.h // 终点y
          })
        }
        y += subItem.h
      })
      return disabedYArr
    },

    // 获取指定行索引前的第一个非禁用行索引
    getPreNoDisabledRowIndex(rowIndex = 0) {
      let rowsInfo = this.rowsInfo
      let i = rowIndex - 1
      if (i < 0) return -1 // 没有上一行
      for (; i >= 0; i--) {
        let item = rowsInfo[i]
        if (!item.disabled) {
          break
        }
      }
      if (i < 0) return -1 // 没有上一行
      return i
    },

    // 获取指定行索引后的第一个非禁用行索引
    getNextNoDisabledRowIndex(rowIndex = 0) {
      let rowsInfo = this.rowsInfo
      let i = rowIndex + 1
      if (i >= this.rowsInfo.length) return -1 // 没有下一行
      for (; i < rowsInfo.length; i++) {
        let item = rowsInfo[i]
        if (!item.disabled) {
          break
        }
      }
      if (i >= this.rowsInfo.length) return -1 // 没有下一行
      return i
    },

    // 判断指定的纵向 画布内y（像素）是否在禁用行中
    judgeYisInDisabledRow(y) {
      let disabedYArr = this.getDisabledYS() // 禁用行
      for (let i = 0; i < disabedYArr.length; i++) {
        let { min, max } = disabedYArr[i]
        if (y >= min && y <= max) {
          return true
        }
      }
      return false
    },

    // 根据tag距离画布顶部的top值匹配其所在行索引-注意是往下的，比如刚好等于第一行高，那么rowindex应该是2
    getRowIndexByTop(top = 0) {
      let y = 0
      let rowsInfo = this.rowsInfo
      let findRowIndex = 0
      for (let i = 0; i < rowsInfo.length; i++) {
        let item = rowsInfo[i]
        y += item.h
        if (top < y) {
          findRowIndex = i
          break
        }
      }
      return findRowIndex
    },
    //根据rowsInfo中的行索引，返回其top值
    getTopByRowIndex(rowIndex = 0) {
      let y = 0
      let rowsInfo = this.rowsInfo
      for (let i = 0; i < rowsInfo.length; i++) {
        let item = rowsInfo[i]
        if (rowIndex === i) {
          break
        }
        y += item.h
      }
      return y
    },

    // #endregion 计算落点位置

    //#region tag 相关

    /**
     * 获取当前tag是否可以拖动
     * 拖动优先级为：
     * @param {*} tag 
     */
    tagItemDragable(tag = {}) {
      if (!tag || !Object.keys(tag).length) return false
      if (this.readOnly) return false // 只读模式不可拖动

      if (utils.isNull(tag.dragable)) { // 没有设置，取legend的配置
        let lengendItem = this.getLegendConfig(tag)
        return !!lengendItem.dragable
      } else { // 取tag的配置
        return tag.dragable
      }
    },

    /**
     * 获取当前tag是否应该关闭tip提示
     * tip 显示的优先级为：当前tag 设置的closeTip > 当前tag对应legend设置的closeTip > 最后都没设置的默认显示tip
     * @param {*} tag 
     */
    tagItemCloseTip(tag = {}) {
      if (!tag || !Object.keys(tag).length) return
      let lengendItem = this.getLegendConfig(tag)
      let type_closeTip = utils.isNull(lengendItem.closeTip) // 当前legend类型是否设置了关闭tip
      if (utils.isNull(tag.closeTip)) { // 没有给tag单独设置
        if (type_closeTip) { // 也没有给大类设置关闭
          return false // 则不关闭tip
        } else { // 大类设置了则以大类的配置为准
          return lengendItem.closeTip
        }
      }

      // 单独设置了以自己的为准
      return tag.closeTip
    },

    // 判断tag是否有操作菜单
    tagHasOperateMenu(tag) {
      let lengendItem = this.getLegendConfig(tag)
      return lengendItem.btnList && lengendItem.btnList.length > 0
    },

    // 获取tag 对应 legend的配置
    getLegendConfig(_tagItem) {
      return this.legend.find(item => item.type == _tagItem.type) || {}
    },

    // 获取 row 中的所有tag集合,返回对象格式如： {type:[tag1, tag2,...],type2:[tag1, tag2,...]}
    getTagsMapByRowItem(rowItem = {}) {
      if (!rowItem || !Object.keys(rowItem).length) return {}
      let tagTypeObj = {}
      let tags = rowItem.tags || []
      tags.map(subItem => {
        tagTypeObj[subItem.type] || (tagTypeObj[subItem.type] = [])
        tagTypeObj[subItem.type].push(subItem)
      })

      return tagTypeObj
    },

    // 根据起止时间计算 在甘特图中 tag的宽和left值,注意：参数起止时间必须是完整时间 如：2023/10/04 02:10:00
    calcTagLeftAndWidth(startTime, endTime) {
      if (!startTime || !endTime) return null
      if (this.colsInfo.length <= 0) return false

      let startGTTTime = this.dealTime(`${this.colsInfo[0].label} 00:00:00`)// 甘特图任务开始时间
      if (startTime < startGTTTime) {
        console.error('开始时间小于甘特图任务开始时间')
        return false
      }
      // 转为分钟

      let _stime = this.dealTime(startTime)
      let _etime = this.dealTime(endTime)
      let sp = _etime - _stime
      if (sp < 0) {
        console.error('开始时间要小于结束时间')
        return null
      }
      let pxOfTimeParticle = this.getPxOfTimeParticle()
      // 甘特图起止时间
      return {
        left: Number((_stime - startGTTTime) / pxOfTimeParticle).toFixed(6) + 'px',
        width: Number(sp / pxOfTimeParticle).toFixed(6) + 'px'
      }
    },

    /**
     * 根据所属行的label，与tag的类型来计算tag的 top、高度
     * @param {*} parentKey tag所在行label
     * @param {*} tagType tag对应的legend 类型
     */
    calcTagTopAndHeight(parentKey, tagType) {

      // let rowsInfo = this.rowsInfo
      // let findRow = null
      // 1.计算tag对应行距离画布顶部的距离 rowTop
      // let rowTop = 0
      // for (let i = 0; i < rowsInfo.length; i++) {
      //   let item = rowsInfo[i]
      //   if (item.label === parentKey) {
      //     findRow = item
      //     break
      //   } else {
      //     rowTop += item.h
      //   }
      // }
      // if (!findRow) return null

      // // 2.计算行内tag距离当前行顶部的距离 rowInTop ，【当前行有几种类型的tag，当前tag又是在第几行，按legend顺序向下累加，获取tag在行内的top】
      // let h = tagHeight // tag 高度固定
      // let rowInTop = 0
      // let tagTypeObj = this.getTagsMapByRowItem(findRow) // 当前行所有tag
      // // let tagTypeNum = Object.keys(tagTypeObj).length

      // let legendData = this.legend
      // let tagMarginBottom = tagMarginTop
      // for (let i = 0; i < legendData.length; i++) {
      //   let item = legendData[i]
      //   let isThis = item.type === tagType // tag是不是这个类型
      //   if (tagTypeObj[item.type] && !isThis) { // 行里面有这个类型，且当前tag在后面
      //     rowInTop += tagMarginBottom + h
      //   }
      //   if (isThis) {
      //     break
      //   }
      // }
      // rowInTop += rowPaddingTop

      // // 3.加起来就是tag距离画布顶端的距离
      // let top = rowTop + rowInTop

      return {
        top: this.calcTagOffsetCanvasTop(parentKey, tagType) + 'px',
        // top: top + 'px',
        height: tagHeight + 'px' // tag 高度固定
      }
    },

    /**
     * 新增tag节点
     * @param {*} tagItem tag节点
     * @param {*} rowParent 所在行
     * @return boolean 操作成功 | 失败
     */
    addTag(tagItem = {}, rowParent = {}) {
      if (!tagItem || !Object.keys(tagItem).length) return false
      if (!rowParent || !Object.keys(rowParent).length) return false

      let newTagItem = this.factoryTag(tagItem, rowParent)
      this.tagList.push(newTagItem)

      // tag 变化后需要调用的更新函数
      this.tagChangThenRefreshAll()
      return true
    },
    /**
     * 修改tag节点
     * @param {*} tagId 生成的甘特图tag唯一id
     * @param {*} newTagItem 修改后的tag
     * @param {*} refreshGTT 修改tag后是否需要刷新甘特图，不涉及宽高计算变化的可以不调用刷新，提高性能
     * @return boolean 操作成功 | 失败
     */
    updateTag(tagId, newTagItem, refreshGTT = true) {
      if (!tagId) return false
      this.tagList = this.tagList.map(item => {
        if (item.tagId === tagId) {
          return {
            ...newTagItem,
            // 重新计算时间差
            timeStampDiffer: new Date(newTagItem.endTime).getTime() - new Date(newTagItem.startTime).getTime(), // 开始时间与结束时间的时间差 - tag 拖动时需要保证时间差不变
          }
        }
        return item
      })

      this.backfillTagListToRowsInfo() // tag变化了，刷新rowsInfo

      // tag 变化后需要调用的更新函数
      refreshGTT && this.refreshGTTWH() // 刷新甘特图宽高
      return true
    },
    /**
     * 删除tag节点
     * @param {*} tagId 生成的甘特图tag唯一id
     * @return boolean 操作成功 | 失败
     */
    deleteTag(tagId) {
      if (!tagId) return false
      this.tagList = this.tagList.filter(item => item.tagId !== tagId)

      // tag 变化后需要调用的更新函数
      this.tagChangThenRefreshAll()
      return true
    },
    /**
     * tag 移动前
     *  */
    tagDragStart(param = {}) {
      this.$emit('tagDragStart', param)
    },
    /**
     * tag 位置移动结束
     * 甘特图的移动结束只是为了确定当前left，top所在行（label），列（开始、结束时间）信息，更新后走渲染逻辑即可
     */
    tagChangeEnd() {
      let { tagItemOld, tagItem, tagItemDom, left, top } = this.draging // 将 draging 横向信息转成时间信息存入对应时间tag

      let finalTop = top

      let rows = this.rowsInfo.map(item => {
        return {
          label: item.label,
          h: item.h
        }
      })

      // 1.进入禁用行矫正位置 - 目前只支持y方向 【不允许拖拽到禁用行】
      if (this.disabledRowSilent) {
        let disabledRows = this.rowsInfo.filter(item => item.disabled)
        if (disabledRows.length === this.rowsInfo.length) return // 全部是禁用行
        if (tagItem && tagItem.style) {
          let disabedYArr = this.getDisabledYS() // 禁用行纵向边界数组
          let num = 0
          let correctTop = finalTop
          let paintHeight = utils.getDOMWH(this.$refs['paintBoxRefDom']).h
          let _tagHeight = utils.getDOMWH(tagItemDom).h

          while (num !== disabedYArr.length) { // 直到矫正到非禁用行
            num = 0
            for (let i = 0; i < disabedYArr.length; i++) {
              num++;
              let { max, min } = disabedYArr[i]
              if (tagIsTouchDisabledRow({
                disabledYMin: min, // 禁用行Y最小值
                disabledYMax: max, // 禁用行Y最大值
                tagHeight: _tagHeight, // tag 的高度
                tagTop: correctTop, // tag 的css top值
              })) { // 进入禁用行
                num = 0
                let correctRowIndex = 0
                let _currentRowIndex = this.getRowIndexByTop(correctTop)
                // console.log(_currentRowIndex, 333)
                // 以tag左上角为基准准
                if (correctTop > min || correctTop === 0) { // 左上角大于最小值，说明整个进入了禁用行，矫正到下一行
                  // 获取下一个非禁用行
                  correctRowIndex = this.getNextNoDisabledRowIndex(_currentRowIndex)
                  if (correctRowIndex < 0) {// 后面没有，往前找
                    correctRowIndex = this.getPreNoDisabledRowIndex(_currentRowIndex)
                  }
                } else { // 矫正到上一行
                  correctRowIndex = this.getPreNoDisabledRowIndex(_currentRowIndex + 1) // +1 是因为当前左上角在上一行,tag接触到了禁用区域，真实禁用区域是下一行的
                  if (correctRowIndex < 0) {// 前面没有，往后找
                    correctRowIndex = this.getNextNoDisabledRowIndex(_currentRowIndex + 1)
                  }
                }
                correctTop = this.getTopByRowIndex(correctRowIndex)
                break // 重新循环
              }
            }
          }
          // tagItem.style.top = correctTop + 'px'
          finalTop = correctTop
        }
      }

      // 2.矫正top在行内的正确位置，相同类型的tag在一行
      let currentRowIndex = this.getRowIndexByTop(finalTop)
      let newRowLabel = rows[currentRowIndex].label
      {
        // 更新tag所属行
        this.tagList.some(sub => {
          if (sub.tagId === tagItem.tagId) {
            // 拖拽结束后更新tag所属行、列的开始时间 【最终目的】
            sub.parentKey = newRowLabel
            sub.startTime = this.getStartTimeByLeft(left)
            // sub.endTime = this.getStartTimeByLeft(left + utils.getDOMWH(tagItemDom).w) // 根据宽度计算结束时间，这样有误差---pass
            sub.endTime = utils._date.format(new Date(sub.startTime).getTime() + sub.timeStampDiffer, 'YYYY/MM/DD HH:mm:ss')
            return true
          }
        })

        // tag 变化后需要调用的更新函数
        this.tagChangThenRefreshAll()
      }

      this.$emit('tagDragEnd', {
        ...this.draging
      })

      if (this.dragTagEndShowTimeDialog && this.draging.tagItemDom) { // 打开tag时间选择框
        this.openTagTimeDialog(this.draging.tagItem)
      }

      // 清空拖拽信息
      this.draging.tagItemOld = {}
      this.draging.tagItem = {}
      this.draging.tagItemDom = null

      this.historyDraging = {
        left: null,
        top: null
      }

      // 清除参考线
      this.clearGuideLine()

    },

    //#region tag 拖动避让效果

    /**
     * tag避让
     * @param {*} preTagItem 前一个tag
     * @param {*} nextTags 前一个tag后面的所有tag -- 即可能需要加上避让效果的tags
     */
    dodgeTag(preTagItem = {}, nextTags = []) {
      if (!preTagItem || !Object.keys(preTagItem).length || !nextTags || !nextTags.length) return
      // 前一个tag
      let _dodge = preTagItem._dodge
      let before_startTime = _dodge ? _dodge.startTime : new Date(preTagItem.startTime).getTime() // 因为此函数会递归调用，需要判断此tag是否是已经避让过的tag
      let before_endTime = _dodge ? _dodge.endTime : new Date(preTagItem.endTime).getTime()

      // 紧跟着的后面一个tag
      let afterTagItem = nextTags[0]
      let after_startTime = new Date(afterTagItem.startTime).getTime()
      let after_endTime = new Date(afterTagItem.endTime).getTime()
      let timeStampGap = before_endTime - after_startTime // 需要避让多长时间

      if (timeStampGap > 0) { // 覆盖，后面的需要向后避让
        afterTagItem.style.transform = `translateX(${(this.timeStampGapToInfeedDistance(timeStampGap))}px)`
        // 临时用于避让的前端辅助变量,拖动完成后清除 - 因为动画使用translateX实现，将变换后的时间存入，让后面的tag根据此信息判断是否需要向后避让
        afterTagItem._dodge = {
          startTime: after_startTime + timeStampGap,
          endTime: after_endTime + timeStampGap
        }
        // 存储避让信息
        this.dodgeTagsInfo[afterTagItem.tagId] = afterTagItem.style.transform
      }

      let _nextTags = nextTags.slice(1)
      if (!_nextTags.length) return
      this.dodgeTag(afterTagItem, _nextTags) // 递归操作后面的tag
    },

    /**
     * 去掉指定_tagItem的避让效果
     * @param {*} _tagItem 
     */
    clearTagDodge(_tagItem) {
      _tagItem.style.transform = `translateX(0)`
      delete _tagItem._dodge // 临时用于避让的前端辅助变量
    },

    // 拖动tag时当前行后面的tag有避让效果
    tagMoveDodgeAnimate(dragTagItem = {}) {
      if (!this.openTagMoveDodgeAnimate) return // 未开启此功能，返回
      if (!dragTagItem || !Object.keys(dragTagItem).length) return

      // 获取拖动tag的信息
      let left = utils.delValUnit(dragTagItem.style.left)
      let top = utils.delValUnit(dragTagItem.style.top)
      let startTime = this.getStartTimeByLeft(left)
      let endTime = utils._date.format(new Date(startTime).getTime() + dragTagItem.timeStampDiffer, 'YYYY/MM/DD HH:mm:ss')

      // 1.找到tag在哪一行 - 拖动过程中parentKey变化，只能通过top值重新查找
      let currentRowIndex = this.getRowIndexByTop(top)
      let newRowLabel = this.rowsInfo[currentRowIndex].label

      // 过滤tags
      let filterTypeTags = this.tagList.filter(item => item.tagId !== dragTagItem.tagId && item.type === dragTagItem.type && item.dragable !== false) // 过滤掉当前tag、过滤当前类型的所有tags、且不是禁止拖动的tag
      let thisRowTags = filterTypeTags.filter(item => item.parentKey === newRowLabel) // 当前行所有tag

      // 2.当前行中 将tag前的tags还原到正确位置
      // let beforeTags = thisRowTags.filter(item=>new Date(item.startTime).getTime() <= new Date(startTime).getTime()) // tag前面的tags
      // beforeTags.map(item=>this.clearTagDodge(item))

      // 清除之前的副作用
      this.dodgeTagsInfo = {}
      this.tagList.map(item => this.clearTagDodge(item))

      // 3.查找当前tag后面的tags
      let afterTags = thisRowTags.filter(item => new Date(item.startTime).getTime() > new Date(startTime).getTime()) // tag后面的tags
      afterTags.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) // 排序
      this.dodgeTag({
        ...dragTagItem,
        startTime,
        endTime,
      }, afterTags)

      // 4.清除其他行tag避让后的副作用
      // let otherRowTags = filterTypeTags.filter(item=>item.parentKey !== newRowLabel)
      // otherRowTags.map(item=>this.clearTagDodge(item))
    },

    //#endregion tag 拖动避让效果

    // tag 拖动事件
    tagMove(mouseEvent, { tagItemDom, tagItemOld, tagItem, left, top, toBox_X, toBox_Y }) {

      // 存储上次的拖拽信息，用于判断当前拖动的方向
      if (this.historyDraging.left === null) {
        this.historyDraging.left = left
      }
      if (this.historyDraging.top === null) {
        this.historyDraging.top = top
      }

      // console.log(tagItemDom, tagItem, left, top, 'tagMove')
      this.clearGuideLine() // 清除参考线
      this.closeAllMenu('tagMove')
      if (!tagItemDom) return
      let tagItemDomWidth = utils.getDOMWH(tagItemDom).w
      let tagItemDomHeight = utils.getDOMWH(tagItemDom).h

      // 1.不可拖动到禁用行
      if (this.disabledRowSilent) {

        let disabedYArr = this.getDisabledYS() // 禁用行
        if (disabedYArr.length === this.rowsInfo.length) return // 全部是禁用行
        let inDisabledRow = false
        disabedYArr.map(({ max, min }) => {
          if (tagIsTouchDisabledRow({
            disabledYMin: min, // 禁用行Y最小值
            disabledYMax: max, // 禁用行Y最大值
            tagHeight: tagItemDomHeight, // tag 的高度
            tagTop: top, // tag 的css top值
          })) { // 进入禁用行
            inDisabledRow = true
          }
        })

        if (inDisabledRow) { // 进入禁用行
          tagItemDom.style.cursor = "not-allowed";
        } else {
          tagItemDom.style.cursor = "move";
        }

      }

      // 边界条件处理 start ----

      // 1.拖动范围限制在画布区域
      let dealObj = moveInBoundary({
        contentDom: this.$refs['paintBoxRefDom'], // 边界盒子dom
        dragDom: tagItemDom, // 拖拽的盒子dom
        left,
        top
      })
      left = dealObj.left
      top = dealObj.top

      // 拖动tag时，若有滚动条，跟着滚动
      {

        // 获取拖动方向
        let _dx = left - this.historyDraging.left // 大于0 tag向右拖动，小于0 tag向左拖动
        let _dy = top - this.historyDraging.top // 大于0 tag向下拖动，小于0 tag向上拖动

        // 横向滚动
        let _scrollLeft = this.getScrollLeft()
        let colWidth = this.getTimeColW()
        let showWidth = utils.getDOMWH(this.$refs['boxRightRefDom']).w // 甘特图中画布区显示的宽度
        if (_dx < 0 && left < _scrollLeft) { // 拖动到左侧滚动区域
          // this.scrollGanTTXTo(Math.floor(left / colWidth) * colWidth)
          this.scrollGanTTXTo(left)
        } else if (_dx > 0 && left + tagItemDomWidth > showWidth + _scrollLeft) { // 拖动到右侧滚动区域
          this.scrollGanTTXTo(_scrollLeft + (left + tagItemDomWidth - showWidth - _scrollLeft))
        }

        // 纵向滚动
        let _scrollTop = this.getScrollTop()
        let showHeight = utils.getDOMWH(this.$refs['boxRightRefDom']).h // 甘特图中画布区显示的宽度
        if (_dy < 0 && top < _scrollTop) {
          this.scrollGanTTYTo(top)
        } else if (_dy > 0 && top + tagItemDomHeight > showHeight + _scrollTop) {
          this.scrollGanTTYTo(_scrollTop + (top + tagItemDomHeight - showHeight - _scrollTop))
        }
      }

      tagItem.style.left = left + 'px'
      tagItem.style.top = top + 'px'
      // 边界条件处理 end ----

      // 拖动避让动画
      this.tagMoveDodgeAnimate(tagItem)

      // 记录拖拽信息
      this.draging = {
        tagItemOld: tagItemOld, // 拖拽前tag Data
        tagItem: tagItem, // 拖拽的tag Data
        tagItemDom: tagItemDom, // 拖拽的tag Dom
        left: left,
        top: top
      }
      this.historyDraging = {
        left: left,
        top: top
      }

      // 绘制参考线
      this.drawMoveGuideLineY(left, top)
    },

    // 构造原始甘特图中的tag格式，最终提供给外部使用 - 注意：tagId 是甘特图内增删改的唯一标志，每次init()后,tagid将更新
    backfillTag(tagItem = {}) {
      let obj = {
        ...(tagItem.data || {}),
        // tag数据，这部分属性以当前tag为准
        tagId: tagItem.tagId, // 生成唯一id
        startTime: tagItem.startTime || '', // tag 对应开始时间
        endTime: tagItem.endTime || '', // tag 对应结束时间
        label: tagItem.label || '甘特图 tag', // tag上显示的文本
        type: tagItem.type || '', // 所属legend
        closeTip: tagItem.closeTip, // 关闭tip
        dragable: tagItem.dragable, // 是否可以拖动，注意：只有true|false才取这个，代表是配置了的,undefined 等代表未配置，默认是可以拖动的
        className: tagItem.className, // 自定义tag 样式名
        selected: tagItem.selected, // 当前tag是否选中-有选中样式
        preIcon: tagItem.preIcon, // tag前的图标
        hide: tagItem.hide, // 是否隐藏此tag
      }

      return obj
    },
    /**
     * tag 构造
     * @param {*} tagItem tag节点
     * @param {*} rowParent 所在行
     * @return {} tag 对象
     */
    factoryTag(tagItem = {}, rowParent = {}) {
      let tagGTTconfig = this.backfillTag(tagItem)
      let _item = {
        data: tagItem, // 存储原始数据
        // 其他属性用于辅助交互
        parentKey: rowParent.label || '', // 记录所属父节点 - 行
        ...tagGTTconfig,
        tagId: tagGTTconfig.tagId || `tag-${new Date().getTime()}-${uuid()}`, // 生成唯一id
        timeStampDiffer: new Date(tagItem.endTime).getTime() - new Date(tagItem.startTime).getTime(), // 开始时间与结束时间的时间差 - tag 拖动时需要保证时间差不变
        style: { // css
          top: 0,
          width: 'auto',
          left: 0,
          height: tagHeight + 'px', // 默认高度
          transform: 'translateX(0)', // 用于实现拖拽避让动画
        }
      }

      // 保留拖拽end后的闪避效果
      if (this.dodgeTagsInfo[_item.tagId]) {
        _item.style.transform = this.dodgeTagsInfo[_item.tagId]
      }

      // style横向信息赋值
      let style_horizontal = this.calcTagLeftAndWidth(_item.startTime, _item.endTime)
      if (style_horizontal) {
        _item.style.left = style_horizontal.left
        _item.style.width = style_horizontal.width
      }

      // style纵向信息赋值
      let style_vertical = this.calcTagTopAndHeight(_item.parentKey, _item.type)
      if (style_vertical) {
        _item.style.top = style_vertical.top
        _item.style.height = style_vertical.height
      }

      return _item
    },
    // 生成tag一维数据
    createTagList() {
      let tagList = []
      this.rowsInfo.map(row => {
        let arr = (row.tags || []).map(tagItem => this.factoryTag(tagItem, row))
        tagList = tagList.concat(arr)
      })

      this.tagList = tagList

      this.verticalTag() // 垂直居中tag
    },

    // 垂直居中tag 【原理：修改每个tag的top值实现】 - 前提是 this.rowsInfo 计算完成！
    verticalTag() {

      // 1.获取每行内的tag的最大 top
      let obj = {}
      this.tagList.map(item => {
        let top = +utils.delValUnit(item.style.top)
        obj[item.parentKey] || (obj[item.parentKey] = top)
        if (top > obj[item.parentKey]) {
          obj[item.parentKey] = top
        }
      })

      // 2.计算行内tag下的剩余高度
      let y = 0
      let rowPaddingBottom = rowPaddingTop
      this.rowsInfo.map(row => {
        let rowKey = row.label
        let rowHeight = +row.h
        if (!utils.isNull(obj[rowKey])) {
          obj[rowKey] = y + rowHeight - Number(obj[rowKey]) - tagHeight - rowPaddingBottom
          // if (rowHeight <= hasTagsDataMinRowHeight) {
          //   obj[rowKey] = y + rowHeight - Number(obj[rowKey]) - tagHeight - rowPaddingBottom
          // } else { // 高度被撑开的不用处理
          //   obj[rowKey] = ''
          // }
        }
        y += row.h
      })

      // 3.给tag赋值
      this.tagList.map(item => {
        if (!utils.isNull(obj[item.parentKey])) {
          item.style.top = +utils.delValUnit(item.style.top) + Number((obj[item.parentKey] / 2 || 0).toFixed(4)) + 'px'
        }
      })

    },

    // 将taglist回填到rowsInfo中，新增、删除、修改tag“完成后“需要调用此方法，以保证rowsInfo 与 tagList数据同步
    // 注意：只修改数据，但不会影响宽高改变的，不需要再调用刷新方法
    backfillTagListToRowsInfo() {
      this.rowsInfo = this.rowsInfo.map(row => {
        return {
          ...row,
          tags: this.tagList.filter(tagItem => tagItem.parentKey === row.label).map(tagItem => {
            return this.backfillTag(tagItem)
          })
        }
      })
    },

    //#endregion tag 相关

    //#region tag 时间选择,更改tag的开始结束时间

    //【因为粒度没办法精确到1px - 1分钟程度，只能用户手动矫正，
    //特别注意：tag渲染是将时间维度转为像素的，时间是肯定不会不在渲染过程被修改，只要不去拖动，那就一定是设定的时间】

    closeTagTimeDialog() {
      this.tagTimeDialog.visible = false
      this.$emit('closeTagTimeDialog')
    },
    // 确定
    confirmTagTimeDlaiog() {
      let tag = this.tagTimeDialog.tag
      let range = this.tagTimeDialog.timeRange
      if (!range || !range.length || !range[0] || !range[1]) return ElMessage({
        message: '请选择时间',
        type: 'warning'
      });
      let startT = range[0]
      let endT = range[1]
      if (new Date(startT).getTime() > new Date(endT).getTime()) return ElMessage({
        message: '开始时间应小于结束时间',
        type: 'warning'
      });
      this.updateTag(tag.tagId, {
        ...tag,
        startTime: startT,
        endTime: endT
      })
      this.closeTagTimeDialog()
    },
    openTagTimeDialog(tagItem = {}) {
      if (!tagItem || !Object.keys(tagItem).length) return
      let { startTime, endTime } = tagItem
      if (!startTime || !endTime) return
      this.tagTimeDialog.tag = tagItem
      this.tagTimeDialog.timeRange = [startTime, endTime]
      this.tagTimeDialog.visible = true
    },

    //#endregion tag 时间选择

    //#region tag 选中

    // 点击
    tagClickHandle(param) {
      if (this.readOnly) return // 只读模式
      let { e, tagItem } = param
      this.$emit('tagClick', {
        e,// 鼠标e
        tag: tagItem
      })
    },

    // 清空所有tag的选中状态
    clearAllTagSelected() {
      this.tagList.map(item => {
        item.selected = false
      })
      this.backfillTagListToRowsInfo() // tag变化了，刷新rowsInfo
    },

    //#endregion tag 选中

    //#region tag 右键菜单

    // 失去焦点关闭菜单
    tagblurHandle() {
      /*
       首先tag 的事件不能冒泡
       但这样父级就无法触发失去焦点从而关闭此菜单
       用tag 的失去焦点事件后又无法触发后面的tag的右键菜单按钮，因为blur事件先触发，
       最终用个全局变量来控制。。。
      */
      this.autoCloseTagMenu = true
      // 延迟，让其他不关闭菜单的事件给开关赋值
      setTimeout(() => {
        if (this && this.tagMenu_close && this.autoCloseTagMenu) {
          try {
            this.tagMenu_close()
          } catch (e) {
            console.log('tagblurHandle error：', e)
          }
        }
      }, 400)
    },

    // tag 右键菜单回调
    tagContextmenuHandle(param) {
      // console.log('tagcontextmenuHandle', param)

      // 关闭其他菜单
      this.closeAllMenu('tagContextmenuHandle')
      this.autoCloseTagMenu = false // 阻止tag失去焦点自动关闭tag menu
      let { tagItem, showOperateMark } = param
      if (this.readOnly || !showOperateMark) return

      // 获取tag样式
      let lengendItem = this.getLegendConfig(tagItem)
      let tagStyle = tagItem.style
      let tagX = +utils.delValUnit(tagStyle.left)
      let tagY = +utils.delValUnit(tagStyle.top)
      let tagW = +utils.delValUnit(tagStyle.width)
      let tagH = +utils.delValUnit(tagStyle.height)

      // 计算理论值
      let ofx = 5 // 加点偏移
      let left = tagX + tagW
      let top = tagY

      this.tagMenu = {
        ...this.tagMenu,
        visible: true,
        btnList: lengendItem.btnList || [], // 操作按钮
        selectTag: {
          ...tagItem
        }, // 选中tag
      }

      this.$nextTick(() => {
        let tagMenuRefDom = this.$refs['tagMenuRefDom'] // tag右键菜单
        let paintBoxDom = this.$refs['paintBoxRefDom'] // 画布
        // 实际值-考虑边界
        if (!paintBoxDom || !tagMenuRefDom) return
        let { w: boxW, h: boxH } = utils.getDOMWH(paintBoxDom)
        let { w: tagMenuW, h: tagMenuH } = utils.getDOMWH(tagMenuRefDom)

        if (left + tagMenuW + ofx > boxW) {
          left = tagX - tagMenuW - ofx
        } else {
          left = left + ofx
        }
        if (top + tagMenuH > boxH) {
          top = tagY - tagMenuH + tagH
        }
        top = Math.max(...[top, 0])

        this.tagMenu = {
          ...this.tagMenu,
          style: {
            left: left + 'px',
            top: top + 'px'
          }
        }
      })

      // tag 鼠标右键
      this.$emit('tagContextmenu', {
        tag: tagItem
      })
    },
    tagMenu_close() {
      this.tagMenu = {
        ...this.tagMenu,
        visible: false,
        btnList: [],
        selectTag: {}
      }
    },
    /**
    * tag右键操作菜单事件
    * @param {*} e 鼠标e
    * @param {*} menuItem 菜单触发项
    * @param {*} btnIndex 菜单触发索引
    */
    tagMenuBtnClickHandle(e, menuItem, btnIndex) {
      if (this.readOnly || !menuItem || menuItem.disabled) return
      this.$emit('tagMenuBtnClick', {
        e,// 鼠标e
        target: menuItem, // 菜单触发项
        triggerIndex: btnIndex, // 菜单触发索引
        tag: {
          ...this.tagMenu.selectTag,
        }
      })
      this.tagMenu_close()
    },
    //#endregion tag 右键菜单

    //#region 网格线canvas

    // 画线
    drawGridLine(ctx, beginPoints = [], endPoints = []) {
      if (!beginPoints.length === 2 || !endPoints.length === 2) return
      ctx.beginPath();
      // canvas画线太粗并且模糊解决方法：+0.5 而且canvas不能设置box-sizing: border-box;设置了也不行
      ctx.moveTo(beginPoints[0] + 0.5, beginPoints[1] + 0.5);
      ctx.lineTo(endPoints[0] + 0.5, endPoints[1] + 0.5);
      ctx.lineWidth = 1
      ctx.strokeStyle = this.gridLineColor
      ctx.lineCap = "butt";

      ctx.stroke();
    },

    // 绘制禁用行
    drawDisabledRow(canvas) {
      if (!canvas) return
      let ctx = canvas.getContext('2d');
      let x = 0
      let y = 0
      this.rowsInfo.map(item => {
        if (item.disabled) {
          ctx.fillStyle = this.disabledBgColor;
          ctx.fillRect(x, y, canvas.width, item.h); // fillRect(x, y, width, height)：绘制一个填充的矩形。
        }
        y += item.h
      })
    },

    // 绘制网格、禁用行背景色
    drawGridCanvas() {
      let canvas = this.$refs['canvasGridRefDom']
      if (!canvas) return
      let width = canvas.width
      let height = canvas.height
      let ctx = canvas.getContext('2d');
      utils.clearCanvas(canvas)

      // 禁用行背景
      this.drawDisabledRow(canvas)

      // 内容区域-网格
      {
        // 行
        let rows = this.rowsInfo
        let y = 0
        // this.drawGridLine(ctx, [0, y], [width, y])
        // y += this.paintTopVal
        // this.drawGridLine(ctx, [0, y], [width, y])
        rows.map((item, index) => {
          // this.drawGridLine(ctx, [0, y], [width, y])
          y += item.h
          // if (index === rows.length - 1) { // 最后一行，因为+0.5后会超出。因此-1
          //   this.drawGridLine(ctx, [0, y - 1], [width, y - 1])
          // } else {
          //   this.drawGridLine(ctx, [0, y], [width, y])
          // }
          if (index !== 0 || index !== rows.length - 1) {
            this.drawGridLine(ctx, [0, y], [width, y])
          }
        })

        // 列
        let cols = this.colsInfo
        let w = 0
        // this.drawGridLine(ctx, [w, 0], [w, height])
        // w += this.paintLeftVal
        // this.drawGridLine(ctx, [w, 0], [w, height])
        cols.map((item, index) => {
          // this.drawGridLine(ctx, [w, 0], [w, height])
          w += item.w
          // if (index === cols.length - 1) { // 最后一列，因为+0.5后会超出。因此-1
          //   this.drawGridLine(ctx, [w - 1, 0], [w - 1, height])
          // } else {
          //   this.drawGridLine(ctx, [w, 0], [w, height])
          // }
          if (index !== 0 || index !== cols.length - 1) {
            this.drawGridLine(ctx, [w, 0], [w, height])
          }
        })
      }

      // 标题栏、整体-网格 - 补充没有绘制到的区域
      {
        let ganttCanvas = this.$refs['canvasGanttRefDom']
        if (!ganttCanvas) return
        let _width = ganttCanvas.width - 1.2
        // let _height = this.paintBoxInfo.height + this.paintTopVal - 1.2 // 取这个是因为横向可能有滚动条
        let _height = ganttCanvas.height - 1.2
        let _ctx = ganttCanvas.getContext('2d');

        let points = {
          leftTop: [0, 0],
          rightTop: [_width, 0],
          rightBottom: [_width, _height], // 最后一个，因为+0.5后会超出。因此减去一点
          leftBottom: [0, _height]
        }
        // console.log(points, 111)

        // 边框
        this.drawGridLine(_ctx, points.leftTop, points.rightTop) // 上
        this.drawGridLine(_ctx, points.rightTop, points.rightBottom) // 右
        this.drawGridLine(_ctx, points.leftBottom, points.rightBottom) // 下
        this.drawGridLine(_ctx, points.leftTop, points.leftBottom) // 左

        // 标题
        this.drawGridLine(_ctx, [0, this.paintTopVal], [_width, this.paintTopVal])
        this.drawGridLine(_ctx, [this.paintLeftVal, 0], [this.paintLeftVal, _height])

        // 底部-展示的统计行
        let ganttBoxRefDom = this.$refs['ganttBoxRefDom']
        if (!ganttBoxRefDom) return
        let tjRowNodes = ganttBoxRefDom.querySelectorAll('.stat-bottom') || []
        let _y = ganttCanvas.height
        let _x = ganttCanvas.width
        // 从后面向上减就不用考虑标题行因素
        for (let i = tjRowNodes.length - 1; i >= 0; i--) {
          let nodeItem = tjRowNodes[i]
          _y -= utils.getDOMWH(nodeItem).h
          this.drawGridLine(_ctx, [0, _y], [_x, _y])
        }
      }

    },

    //#endregion 网格线canvas

    //#region 参考线

    /**
     * 绘制拖动时的参考线
     * @param {*} x .box-paint 盒子中的二维坐标
     * @param {*} y .box-paint 盒子中的二维坐标
     */
    drawMoveGuideLineY(x, y) {
      let canvas = this.$refs['canvasGuideBoxRefDom']
      if (!canvas) return
      let height = canvas.offsetHeight
      let ctx = canvas.getContext('2d');
      // clearGuideLine()
      ctx.setLineDash([5]);
      ctx.lineWidth = 1
      ctx.beginPath();
      // 纵向
      // ctx.moveTo(x, 0);
      // ctx.lineTo(x, height);
      // ctx.strokeStyle = '#000000'
      // ctx.stroke();

      // 横向
      let ht = y
      ctx.moveTo(0, ht);
      ctx.lineTo(x, ht);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'
      ctx.stroke();

      // 拖动时显示的时间线，标记tag左侧时间方便用户体验
      if (x >= this.getScrollLeft()) {
        this.movingTimeLine = {
          ...this.movingTimeLine,
          visible: true,
          left: this.canvasLeftToGanTTLeft(x) + 'px',
          title: utils._date.format(this.getStartTimeByLeft(x), 'HH:mm')
        }
      } else {
        this.movingTimeLine.visible = false
      }

    },
    // 清除参考线
    clearGuideLine() {
      utils.clearCanvas(this.$refs['canvasGuideBoxRefDom'])

      // 清除时间线
      this.movingTimeLine.visible = false
    },

    //#endregion 参考线

    //#region 宽高计算

    /**
     * 计算指定tag类型在行内的top，注意是距离当前行顶部的距离
     * @param {*} parentKey 行标志-label
     * @param {*} tagType 行内的哪个类型的tag，也就是legend的类型
     */
    calcTagInRowTop(parentKey, tagType) {
      if (!parentKey || utils.isNull(tagType)) return 0

      let rowsInfo = this.rowsInfo
      let findRow = rowsInfo.find(row => row.label === parentKey)
      let tagTypeObj = this.getTagsMapByRowItem(findRow) // 当前行所有tag

      let th = tagHeight // tag 高度固定
      let legendData = this.legend
      let tagMarginBottom = tagMarginTop
      let rowInTop = 0
      for (let i = 0; i < legendData.length; i++) {
        let item = legendData[i]
        let isThis = item.type === tagType // tag是不是这个类型
        if (tagTypeObj[item.type] && !isThis) { // 行里面有这个类型，且当前tag在后面
          rowInTop += tagMarginBottom + th
        }
        if (isThis) {
          break
        }
      }
      rowInTop += rowPaddingTop // 加上上边距
      return rowInTop
    },

    /**
     * 计算指定tag类型距离画布顶部的距离
     * @param {*} parentKey 行标志-label
     * @param {*} tagType 行内的哪个类型的tag，也就是legend的类型
     */
    calcTagOffsetCanvasTop(parentKey, tagType) {
      if (!parentKey || utils.isNull(tagType)) return 0
      let rowTop = this.calcRowTopByRowLabel(parentKey)

      // 计算tag 距离所在行顶部距离 - 注意这里是当前行内
      let rowInTop = this.calcTagInRowTop(parentKey, tagType)
      return rowTop + rowInTop
    },

    /**
     * 通用方法-无副作用
     * 计算 “第几行” 距离 paintBoxRefDom 画布顶部距离 【注意：不包含当前行高度，是当前行顶部距离画布顶部的距离】
     * @param {*} rowIndex 第几行的索引，注意是0开始的
     */
    calcRowTopByRowIndex(rowIndex = 0) {
      let rowsInfo = this.rowsInfo
      let y = 0
      for (let i = 0; i < rowsInfo.length; i++) {
        let item = rowsInfo[i]
        if (i === rowIndex) {
          break
        } else {
          y += item.h
        }
      }

      return y
    },

    /**
     * 根据行label获取当前行距离画布【paintBoxRefDom】顶部的距离
     * @param {*} parentKey 
     */
    calcRowTopByRowLabel(parentKey = '') {
      if (!parentKey) return 0
      let rowsInfo = this.rowsInfo
      let findRowIndex = rowsInfo.findIndex(row => row.label === parentKey)
      if (findRowIndex < 0) return 0
      let rowTop = this.calcRowTopByRowIndex(findRowIndex)
      return rowTop
    },

    /**
     * 通用方法-无副作用 - 注意这里计算的是 “高度自适应” 前的高度，也就是实际高度
     * 计算甘特图对应行的行高 - 即RowsInfo中每行对应的行高，动态计算的，因为tag行是动态的
     * 【注意：这是最小高度】
     * @param {*} rowItem this.rowsInfo 的单项
     * @returns {number} 行高
     */
    calcRowHeightByRowsInfoItem(rowItem = {}) {
      let h = 2 * rowPaddingTop

      // tag 累计高度【包括margin】 整行高度 = row 上下padding + tag margintop【第一行tag不计算margin】 + tag高度
      let tagTypeObj = this.getTagsMapByRowItem(rowItem)
      let tagTypeNum = Object.keys(tagTypeObj).length
      if (tagTypeNum > 0) { // 内有tag
        h += (tagTypeNum * tagHeight + (tagTypeNum - 1) * tagMarginTop)

        // 有数据的行高度不一样，至少也比 hasTagsDataMinRowHeight 高
        h = Math.max(...[h, hasTagsDataMinRowHeight])
      }

      return Math.max(...[h, minRowHeight])
    },

    // 将宽高同步到dom
    renderToDom() {
      let gbRefDom = this.$refs['ganttBoxRefDom']
      if (!gbRefDom) return
      // tag拖拽区域
      let paintWidth = +this.colsInfo.reduce((pre, next) => pre += Number(next.w), 0)
      let paintHeight = +this.rowsInfo.reduce((pre, next) => pre += Number(next.h), 0)

      // 存储方便使用
      this.paintBoxInfo.width = paintWidth
      this.paintBoxInfo.height = paintHeight

      {
        let paintBoxDom = this.$refs['paintBoxRefDom']
        paintBoxDom.style.width = paintWidth + 'px'
        paintBoxDom.style.height = paintHeight + 'px'
      }

      // 行
      {
        let nodes = gbRefDom.querySelectorAll('.paint-row') || []
        nodes.forEach((dom, index) => {
          utils.setDOMH(dom, this.rowsInfo[index].h)
        })
      }
      // 列
      {
        let nodes = gbRefDom.querySelectorAll('.paint-col') || []
        nodes.forEach((dom, index) => {
          utils.setDOMW(dom, this.colsInfo[index].w)
        })
      }
      { // 全屏甘特图的网格【宽高为整个甘特图宽高】 - 用于补充“画布内网格”未绘制的区域
        let gtDom = this.$refs['ganttBoxRefDom']
        let canvas = this.$refs['canvasGanttRefDom']
        utils.setCanvasWH(canvas, utils.getDOMWH(gtDom).w, utils.getDOMWH(gtDom).h)
      }
      // 画布内网格canvas
      {
        let canvas = this.$refs['canvasGridRefDom']
        utils.setCanvasWH(canvas, paintWidth, paintHeight)
      }
      { // 拖拽区域画布内canvas
        let canvas = this.$refs['canvasGuideBoxRefDom']
        utils.setCanvasWH(canvas, paintWidth, paintHeight)
      }
    },

    /**
     * 列信息构造
     * @param {*} param0 
     */
    factoryColsInfoItem({ w, t }) {
      return {
        w: w, // 列宽
        label: utils._date.format(t, 'YYYY-MM-DD') // 时间
      }
    },

    // 计算甘特图每行高度，每列宽度，重要函数，渲染前提是这里的计算正确！！！
    calcWHCore(rows = []) {
      // 计算列 - 列宽
      if (!rows || !rows.length) { // 默认读之前的行数据，因为可能拖动了，用props的行会丢失
        rows = this.rowsInfo
      }
      let headerDom = this.$refs['headerBoxRefDom'] // 标题
      if (!headerDom || !headerDom.parentNode) return
      let headerWidth = utils.getDOMWH(headerDom).w
      let wd = Math.max(...[headerCellMinWidth, (headerWidth / this.dateDuration).toFixed(2)])
      let colsInfo = Array.from({ length: this.dateDuration }).map((item, index) => {
        return this.factoryColsInfoItem({
          w: wd,
          t: utils._date.add(this.startDate, index, 'day')
        })
      })

      // 任务持续时间加减n天，需要在任务持续时间前后来个加减n天
      if (colsInfo.length > 0) {
        let durationArr = [colsInfo[0].label, colsInfo.at(-1).label]
        let preArr = []
        let nextArr = []
        // 前 
        let preDay = Math.abs(+this.decreaseDayNum)
        if (preDay > 0) {
          preArr = Array.from({ length: preDay }).map((item, index) => {
            return this.factoryColsInfoItem({
              w: wd,
              t: utils._date.add(durationArr[0], -1 * (index + 1), 'day')
            })
          })
        }

        // 后
        let nextDay = Math.abs(+this.IncreaseDayNum)
        if (nextDay > 0) {
          nextArr = Array.from({ length: nextDay }).map((item, index) => {
            return this.factoryColsInfoItem({
              w: wd,
              t: utils._date.add(durationArr[1], index + 1, 'day')
            })
          })
        }

        colsInfo = [...preArr.reverse(), ...colsInfo, ...nextArr]

      } else {
        return console.error('任务持续时间为空！甘特图渲染失败！')
      }

      this.colsInfo = colsInfo

      // 计算行 - 实际高度【高度 = 无tag行最小高度+ 有tag行高度(最小tag所在行高或者撑开的高度)】
      let rowsInfo = rows.map(item => {
        return {
          ...item,
          h: +this.calcRowHeightByRowsInfoItem(item), // 计算当前行的行高
        }
      })
      this.rowsInfo = rowsInfo

      // 甘特图高度处理
      let ganttBoxRefDom = this.$refs['ganttBoxRefDom']
      if (!ganttBoxRefDom) return
      // 高度自适应 - 剩余高度太多则分配多余高度到有数据行
      if (this.selfAdaptionGanTTHeight) {// 开启高度自适应
        let { h: ganttHeight } = utils.getDOMWH(ganttBoxRefDom) // 获取自适应高度
        let remainHeight = ganttHeight - this.paintTopVal - this.getSummaryRowsHeight() // 总高-标题高-合计行高 = 剩余画布高度
        if (remainHeight <= 0) { // 父盒子没有设置最小高度则默认撑开 - 注意：只是初始渲染的高度，后面都以这个为准
          remainHeight = this.rowsInfo.reduce((pre, next) => pre + next.h, 0)
        }
        let realH = rowsInfo.reduce((pre, next) => pre + next.h, 0) // 计算实际计算高度
        if (remainHeight >= realH) {// 剩余高度大于计算高度,需要重新分配高度，有tag的数据行平分多出来的高度
          // 计算有几行有tag数据
          let hasTagRowsNum = 0
          rowsInfo.map(item => {
            if (item.tags && item.tags.length) {
              hasTagRowsNum++
            }
          })

          // 分配剩下的高度
          let zlH = Number(((remainHeight - realH) / hasTagRowsNum).toFixed(6))
          rowsInfo.map(item => {
            if (item.tags && item.tags.length) {
              item.h = Math.floor(zlH + item.h)
            }
          })

        } else { // 实际高度超出-则显示纵向滚动条，保证中间部分高度拉满
        }
        this.ganTTBottomHeight = remainHeight
      }

      this.rowsInfo = rowsInfo
    },
    // 获取时间标题的单列宽
    getTimeColW() {
      if (!this.colsInfo.length) return 0
      return this.colsInfo[0].w || 0
    },
    // 获取任务持续时间范围内的列宽总和
    getDurationTimeWidth() {
      return this.getTimeColW() * this.dateDuration
    },
    // 获取合计行高度
    getSummaryRowsHeight() {
      let ganttBoxRefDom = this.$refs['ganttBoxRefDom']
      if (!ganttBoxRefDom) return 0
      let tjRowNodes = ganttBoxRefDom.querySelectorAll('.stat-bottom') || []
      let h = 0
      for (let i = tjRowNodes.length - 1; i >= 0; i--) {
        let nodeItem = tjRowNodes[i]
        h += utils.getDOMWH(nodeItem).h
      }
      return h
    },

    // 刷新甘特图宽高
    refreshGTTWH() {
      this.calcWHCore()
      this.renderToDom()
      this.drawGridCanvas()
      this.createTagList() // 生成tag数据

      // 标记线
      this.showAxisTime(this.markLineTime)
      this.tickTimeLineHandle() // 当前时间-标记线
    },

    // tag 变化后需要调用的更新函数
    tagChangThenRefreshAll() {
      this.backfillTagListToRowsInfo() // tag变化了，刷新rowsInfo
      // 重走渲染逻辑 - 因为行高是自动撑开的，因此需要刷新
      this.refreshGTTWH() // 刷新甘特图宽高，刷新关联数据
    },

    //#endregion 宽高计算

    //#region 需求-任务持续时间加减n天

    // 获取任务持续时间前 “减n天” 在甘特图画布中的宽度
    getdecreaseDayWidth() {
      return this.getTimeColW() * Math.abs(this.decreaseDayNum)
    },

    //#endregion 需求-任务持续时间加减n天

    //#region 横向滚动 scroll

    // 滚动到上次滚动条百分比位置
    scrollXToLastPercent() {
      let scrollXBarDom = this.$refs['scrollXBarDom'] // 横向滚动条
      if (!scrollXBarDom) return
      this.scrolledXPercent >= 0 && this.scrollGanTTXTo(scrollXBarDom.scrollWidth * this.scrolledXPercent / 100)
    },

    // 初始化横向滚动条初始距离，初始时应该滚到任务持续时间区间范围内
    scrollToDurationTime() {
      this.scrollGanTTXTo(this.getdecreaseDayWidth())
    },
    // 横向滚动到指定位置
    scrollGanTTXTo(value = 0) {
      let scrollXBarDom = this.$refs['scrollXBarDom'] // 横向滚动条
      if (!scrollXBarDom) return
      scrollXBarDom.scrollLeft = value || 0
    },
    // 获取横向滚动距离
    getScrollLeft() {
      let scrollXBarDom = this.$refs['scrollXBarDom'] // 横向滚动条
      if (!scrollXBarDom) return 0
      return scrollXBarDom.scrollLeft
    },
    scrollXHandle(e) {
      this.closeAllMenu('scrollXHandle') // 关闭弹出的其他菜单，避免复杂定位问题

      let ganttBoxRefDom = this.$refs['ganttBoxRefDom']
      let scrollXBarDom = this.$refs['scrollXBarDom'] // 横向滚动条
      let scrollContentDom = this.$refs['paintBoxRefDom'] // 横向需要跟着滚动条滚动的内容
      if (!ganttBoxRefDom || !scrollXBarDom || !scrollContentDom) return
      let headerDomNodes = ganttBoxRefDom.querySelectorAll('.scrollX') // 需要跟着横向滚动的标题
      let scrollLeft = -1 * (this.getScrollLeft() || 0)
      headerDomNodes.forEach(nodeItem => {
        // nodeItem.style.left = scrollLeft + 'px'
        nodeItem.style.transform = `translateX(${scrollLeft}px)`
      })
      scrollContentDom.style.left = `${scrollLeft}px`

      // 标记线更新位置
      this.showAxisTime(this.markLineTime)
      this.tickTimeLineHandle()

      // 记录滚动百分比
      this.scrolledXPercent = Number((this.getScrollLeft() / scrollXBarDom.scrollWidth).toFixed(6)) * 100
    },
    addScrollXEvent() {
      let scrollXBarDom = this.$refs['scrollXBarDom'] // 横向滚动条
      if (!scrollXBarDom) return
      scrollXBarDom.addEventListener('scroll', this.scrollXHandle, false)
    },
    removeScrollXEvent() {
      let scrollXBarDom = this.$refs['scrollXBarDom'] // 横向滚动条
      if (!scrollXBarDom) return
      scrollXBarDom.removeEventListener('scroll', this.scrollXHandle)
    },

    //#endregion 横向滚动 scroll

    //#region 纵向滚动 scroll

    // 纵向滚动到指定位置
    scrollGanTTYTo(value = 0) {
      let scrollYBarDom = this.$refs['scrollYBarDom'] // 纵向滚动条
      if (!scrollYBarDom) return
      scrollYBarDom.scrollTop = value || 0
    },

    // 获取纵向滚动距离
    getScrollTop() {
      let scrollYBarDom = this.$refs['scrollYBarDom'] // 纵向滚动条
      if (!scrollYBarDom) return 0
      return scrollYBarDom.scrollTop
    },
    // 纵向滚动条滚动位置变化，同步到其他纵向滚动项
    scrollYHandle(e) {
      this.closeAllMenu('scrollYHandle') // 关闭弹出的其他菜单，避免复杂定位问题

      let ganttBoxRefDom = this.$refs['ganttBoxRefDom']
      let scrollYBarDom = this.$refs['scrollYBarDom'] // 纵向滚动条
      if (!ganttBoxRefDom || !scrollYBarDom) return
      let scrollDoms = ganttBoxRefDom.querySelectorAll('.scrollY') // 需要跟着纵向滚动的内容
      let scrollTop = -1 * (this.getScrollTop() || 0)
      scrollDoms.forEach(nodeItem => {
        nodeItem.style.transform = `translateY(${scrollTop}px)`
      })
    },
    // 鼠标滚轮滚动，滚动条滚动
    mousewheelHandle(e) {
      let scrollYBarDom = this.$refs['scrollYBarDom'] // 纵向滚动条
      if (!scrollYBarDom) return
      if (scrollYBarDom.scrollHeight === scrollYBarDom.offsetHeight) return // 【在甘特图内滚动鼠标，若甘特图有滚动条，滚动时触发的甘特图的滚动，没有则使用默认的滚动效果，也就是触发外层页面的滚动】

      // 甘特图内有滚动条，则实现甘特图内部滚动效果
      e.stopPropagation()
      e.preventDefault()
      // 防抖
      this.scrollTimer && clearTimeout(this.scrollTimer)
      this.scrollTimer = setTimeout(() => {
        let dy = -e.deltaY || e.wheelDeltaY;
        let scrollYBarDom = this.$refs['scrollYBarDom'] // 纵向滚动条
        if (!scrollYBarDom) return
        let scrollTop = scrollYBarDom.scrollTop
        let distance = utils.getDOMWH(scrollYBarDom).h / 6; // 每次滚动6分之一
        if (dy < 0) {
          // console.log('向下');
        } else {
          // console.log('向上');
          distance = -1 * distance
        }
        scrollYBarDom.scrollTop = scrollTop + distance
        this.scrollYHandle()
      })
    },
    addScrollYEvent() {
      let scrollYBarDom = this.$refs['scrollYBarDom'] // 纵向滚动条
      let paintBoxRefDom = this.$refs['paintBoxRefDom'] // 画布内容
      if (!scrollYBarDom || !paintBoxRefDom) return
      scrollYBarDom.addEventListener('scroll', this.scrollYHandle, false)
      paintBoxRefDom.addEventListener('mousewheel', this.mousewheelHandle, false)
    },
    removeScrollYEvent() {
      this.scrollTimer && clearTimeout(this.scrollTimer)
      let scrollYBarDom = this.$refs['scrollYBarDom'] // 纵向滚动条
      let paintBoxRefDom = this.$refs['paintBoxRefDom'] // 画布内容
      if (!scrollYBarDom || !paintBoxRefDom) return
      scrollYBarDom.removeEventListener('scroll', this.scrollYHandle)
      paintBoxRefDom.removeEventListener('mousewheel', this.mousewheelHandle, false)
    },

    //#endregion 纵向滚动 scroll

    //#region 点击图时，显示纵向标记线，用于筛选当前时间下贯穿的tag
    clickShowMarkLine(e) {
      if (!this.showMarkLine) return
      let eventX = (e.x || e.pageX) || 0 // 点击事件触发x
      let ganttBoxRefDom = this.$refs['ganttBoxRefDom']
      if (!ganttBoxRefDom) return
      let { left } = ganttBoxRefDom.getBoundingClientRect()
      let x = eventX - left // 点击位置距离甘特图左侧距离
      if (x < this.paintLeftVal) return // 点击的不是画布区域
      let canvasLeft = this.ganTTLeftToCanvasLeft(x)
      let currentTime = this.getStartTimeByLeft(canvasLeft)
      this.showAxisTime(currentTime)

      // 抛出当前时间贯穿的tags
      this.$emit('changeMarkLineClick', {
        markLineTime: currentTime, // 时间
        inTags: this.getTimePierceTags(currentTime)
      })
    },

    /**
     * 显示时间线
     * @param {*} time 时间线对应的时间 - 是画布中的！
     * @param {*} ganttLeft 甘特图left！
     */
    showAxisTime(time = '', ganttLeft) {
      if (!this.showMarkLine || !time) { // 不显示
        this.markLine.visible = false
        return
      }
      this.markLine = {
        ...this.markLine,
        visible: true,
        left: !utils.isNull(ganttLeft) ? ganttLeft : this.canvasLeftToGanTTLeft(this.getLeftByStartTime(time)) + 'px',
        title: utils._date.format(time, 'HH:mm')
      }
      // console.log(time, 222)
      this.$emit('update:markLineTime', time)
    },
    //#endregion 点击图时，显示纵向标记线，用于筛选当前时间下贯穿的tag

    //#region 定时标记当前时间

    hide_TickTimerLine() {
      this.currentTimeLine.visible = false
    },
    // 当前时间-标记线
    tickTimeLineHandle() {
      let tRange = this.getGanTTimeRange()
      if (!tRange) return this.hide_TickTimerLine()
      let { startTime, endTime } = tRange
      let currentTime = new Date().getTime()
      if (currentTime > endTime || currentTime < startTime) return this.hide_TickTimerLine()
      // 时间范围内
      let x = this.getLeftByStartTime(currentTime)
      if (x >= this.getScrollLeft()) { // 考虑横向滚动条 - 左侧标题栏遮住的不显示
        this.currentTimeLine = {
          ...this.currentTimeLine,
          visible: true,
          left: this.canvasLeftToGanTTLeft(x) + 'px',
          title: utils._date.format(currentTime, 'HH:mm'),
        }
      } else {
        this.hide_TickTimerLine()
      }
    },
    // 来根时间线标记当前时间
    init_TickTimer() {
      clearTimeout(this.tickCurrentTimer)
      this.tickCurrentTimer = setTimeout(() => {
        this.tickTimeLineHandle()
        this.init_TickTimer()
      }, 1000)
    },

    //#endregion 定时标记当前时间

    //#region 右键菜单

    rightMenu_init() {
      let paintBoxRefDom = this.$refs['paintBoxRefDom']
      if (!paintBoxRefDom) return
      // 自定义鼠标右键菜单栏
      paintBoxRefDom.oncontextmenu = (ev) => {
        let e = ev || window.event;
        // console.log(ev, '鼠标右键')
        e.preventDefault();
        // e.stopPropagation();

        // 关闭其他菜单
        this.closeAllMenu('rightMenu_init')

        // 只读模式
        if (this.readOnly) return false

        // 1.正在拖动时不可打开右键菜单
        if (this.draging.tagItemDom) {
          return false;
        }

        // 显示右键菜单
        let _menu = this.$refs['rightClickMenuRefDom']
        if (!_menu) return
        // 显示自定义的菜单调整位置
        let x = e.offsetX // 鼠标指针位置相对于触发事件的对象的 x 坐标和y坐标
        let y = e.offsetY
        // 2.禁用行中不可以打开右键菜单
        if (this.disabledRowSilent && this.judgeYisInDisabledRow(y)) {
          return false;
        }

        _menu.style.display = 'block';

        // 记录位置
        this.rightMenuTemObj = this.pixelToDataCoordinate(x, y)

        // 处理边界显示问题
        let { w: paintW, h: paintH } = utils.getDOMWH(this.$refs['boxRightRefDom']) // 画布可视区宽高
        let scrollTop = this.getScrollTop() || 0; // 获取垂直滚动条位置
        let scrollLeft = this.getScrollLeft() || 0; // 获取水平滚动条位置
        let { w, h } = utils.getDOMWH(_menu) // 菜单宽高

        if (w + x > paintW + scrollLeft) {
          x = x - w
        }
        if (y + h > paintH + scrollTop) {
          y = y - h
        }

        _menu.style.left = x + 'px';
        _menu.style.top = y + 'px';
        // console.log(this.rightMenuTemObj, this.rightMenuTemObj.coords)
        return false;  //阻止系统右键菜单
      }

      // 失去焦点 - 关闭菜单
      // paintBoxRefDom.onblur = () => {
      //   // console.log('画布失去焦点 - 关闭菜单')
      //   this.rightMenu_close()
      // }
    },
    // 关闭右键菜单
    rightMenu_close() {
      let _menu = this.$refs['rightClickMenuRefDom']
      if (!_menu) return
      _menu.style.display = 'none';
    },

    /**
     * 菜单事件
     * @param {*} e 鼠标e
     * @param {*} menuItem 菜单触发项
     * @param {*} btnIndex 菜单触发索引
     */
    rightClickMenuEvent(e, menuItem, btnIndex) {
      if (this.readOnly || !menuItem || menuItem.disabled) return
      this.$emit('rightClickMenuClick', {
        e,// 鼠标e
        target: menuItem, // 菜单触发项
        triggerIndex: btnIndex, // 菜单触发索引
        coordsInfo: this.rightMenuTemObj
      })
      this.rightMenu_close()
    },

    //#endregion 右键菜单

    //#region 左侧任务列操作菜单

    taskMenu_Open(e, row = {}) {
      e.stopPropagation();
      e.preventDefault();

      // 关闭其他菜单
      this.closeAllMenu('taskMenu_Open')

      if (this.readOnly) return // 只读模式
      if (!row || !Object.keys(row).length) return
      let taskBtnList = []
      // 行内单独设置的优先，没有就使用全局配置的任务列菜单
      if (row.taskMenuList) {
        taskBtnList = row.taskMenuList
      } else {
        taskBtnList = this.taskMenuList
      }
      if (taskBtnList.length) {
        let rowTop = this.calcRowTopByRowLabel(row.label)

        let x = this.paintLeftVal + 4 // 带点偏移
        let y = this.paintTopVal + rowTop + row.h - this.getScrollTop() - 10 // 带点偏移

        this.taskMenu.visible = true
        this.taskMenu.btnList = taskBtnList
        this.taskMenu = {
          ...this.taskMenu,
          visible: true,
          btnList: taskBtnList,
          selectRow: {
            ...row
          }
        }
        this.$nextTick(() => {
          // 边界处理
          let ganttBoxRefDom = this.$refs['ganttBoxRefDom']
          let taskMenuRefDom = this.$refs['taskMenuRefDom']
          if (ganttBoxRefDom && taskMenuRefDom) {
            let gth = utils.getDOMWH(ganttBoxRefDom).h
            let menuh = utils.getDOMWH(taskMenuRefDom).h
            if (menuh + y > gth) {
              y = gth - menuh
            }
          } else {
            return
          }

          this.taskMenu = {
            ...this.taskMenu,
            style: {
              left: x + 'px',
              top: y + 'px'
            }
          }
        })

      } else {
        this.taskMenu_close()
      }
    },
    // 关闭
    taskMenu_close() {
      this.taskMenu = {
        ...this.taskMenu,
        visible: false,
        btnList: [],
        selectRow: {}
      }
    },
    /**
     * 左侧任务列操作菜单事件
     * @param {*} e 鼠标e
     * @param {*} menuItem 菜单触发项
     * @param {*} btnIndex 菜单触发索引
     */
    taskMenuBtnClick(e, menuItem, btnIndex) {
      if (this.readOnly || !menuItem || menuItem.disabled) return
      this.$emit('taskMenuBtnClick', {
        e,// 鼠标e
        target: menuItem, // 菜单触发项
        triggerIndex: btnIndex, // 菜单触发索引
        rowData: {
          ...this.taskMenu.selectRow,
          tags: this.getTagsByRowLabel(this.taskMenu.selectRow.label)
        }
      })
      this.taskMenu_close()
    },

    //#endregion 左侧任务列操作菜单

    //#region 重要的事件参数构造

    // 获取指定label行下的所有tags
    getTagsByRowLabel(rowLabel = '') {
      if (!rowLabel) return []
      return this.tagList.filter(item => item.parentKey === rowLabel).map(item => this.backfillTag(item))
    },

    // 获取指定时间贯穿的所有tag
    getTimePierceTags(time = '') {
      if (!time) return []
      let arr = []
      let timeStamp = new Date(time).getTime()
      this.tagList.map(item => {
        let { startTime, endTime } = item
        if (timeStamp >= new Date(startTime).getTime() && timeStamp <= new Date(endTime).getTime()) {
          arr.push({
            ...item,
            data: this.backfillTag(item)
          })
        }
      })
      return arr
    },

    // 获取甘特图完整行数据 - 格式和props.rows一致
    getRowsData() {
      // 刷新rowsInfo -> 刷新dom -> 重新生成taglist
      this.backfillTagListToRowsInfo()
      this.refreshGTTWH() // 刷新甘特图宽高，刷新关联数据

      return this.rowsInfo.map(row => {
        let item = {
          ...row,
          tags: row.tags.map(tgItem => {
            let tgItemCopy = {
              ...tgItem
            }
            // 删除甘特图辅助变量
            delete tgItemCopy.tagId
            return tgItemCopy
          })
        }
        // 删除甘特图辅助变量
        delete item.h

        return item
      })
    },

    // 获取所有被选中的tag
    getAllSelectedTags() {
      let arr = []
      this.tagList.map(item => {
        if (item.selected) {
          arr.push({
            ...item,
            data: this.backfillTag(item)
          })
        }
      })

      return arr
    },

    //#endregion 重要的事件参数

    // 关闭甘特图所有菜单
    closeAllMenu(eventHandle) {
      // console.log('触发函数:', eventHandle)
      // 关闭右键菜单
      this.rightMenu_close()
      this.taskMenu_close()
      this.tagMenu_close()
    },

    // 甘特图失去焦点
    ganTTblur() {
      // console.log('甘特图失去焦点')
      this.closeAllMenu('ganTTblur')
    },
    // 甘特图点击
    ganTTClick(e) {
      // console.log('甘特图点击')
      this.closeAllMenu('ganTTClick')
      this.clickShowMarkLine(e)
    },
    // 画布resize -重新计算相关布局元素
    event_windowResize() {
      clearTimeout(this.tickTimer)
      this.tickTimer = setTimeout(() => {
        console.log('甘特图 resize...')
        try {
          this.closeAllMenu('event_windowResize')
          this.refreshGTTWH() // 计算甘特图宽高

          // 初次渲染时滚动横向滚动条到任务开始时间位置
          if (this.isFirstInit) {
            this.$nextTick(() => {
              this.isFirstInit = false
              this.scrollToDurationTime()
            })
          } else { // 滚动到上次滚动条百分比位置 - 保证resize后展示的列的位置一致 - 有问题，未实现！
            // this.$nextTick(()=>{
            //   this.scrollXToLastPercent()
            // })
          }
        } catch (error) {
          console.error('甘特图 resize error：', error)
        }
      }, 50)
    },
    // 注意：每次init后tagid将重新生成，用之前的tagid将无法匹配
    init() {
      // 清空变量
      this.dodgeTagsInfo = {} // tag拖动的避让效果变量，每次重新init渲染时清空

      this.calcWHCore(cloneObj(this.rows)) // 初始根据props生成行列数据
      this.addEvents()
      this.init_TickTimer() // 来根时间线标记当前时间
    },
    addEvents() {
      this.removeEvents()

      let boxDom = this.$refs['ganttBoxRefDom']
      // 1.指定resize事件
      resizeObserver = new ResizeObserver(this.event_windowResize) // 会在绘制前和布局后调用 resize 事件，因此不用提前调用 event_windowResize 方法
      // 2.指定该resize事件的触发dom
      resizeObserver.observe(boxDom);

      this.addScrollXEvent()

      // 启用高度自适应功能-监控纵向滚动条
      // if(this.selfAdaptionGanTTHeight){
      this.addScrollYEvent()
      // }

      // 右键菜单
      this.rightMenu_init()
    },
    removeEvents() {
      let ganttBoxRefDom = this.$refs['ganttBoxRefDom']
      ganttBoxRefDom && resizeObserver?.unobserve(ganttBoxRefDom) // 结束对指定 Element 的监听。

      // 横向纵向滚动条
      this.removeScrollXEvent()
      this.removeScrollYEvent()

      // 清除定时器 - 定时刷新当前时间
      clearTimeout(this.tickCurrentTimer)
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.removeEvents()
  }
}
</script>

<style lang="scss" scoped>
@mixin scrollBar($trackColor: transparent, $thumbColor: #84899155) {
  &::-webkit-scrollbar-track-piece {
    background: $trackColor;
    border-radius: 20px;
  }

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: $thumbColor;
    border-radius: 20px;
  }
}

@mixin eclipse {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

$activeColor: #365BE4;
$activeBg: #E8EDFF;

.gt-title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  box-sizing: border-box;
}

.gantt-chart-wrap {
  // padding-top: 25px;
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  overflow: hidden;
}

.gap {
  height: 25px;
  width: 100%;
  flex: none;
  position: relative;
  z-index: 5;
}

.gantt-chart-box {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {

    .scrollXBar,
    .scrollYBar {
      opacity: 1 !important;
    }
  }

  >canvas {
    left: 0;
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 7;
    pointer-events: none;
  }

  @mixin cm {
    position: relative;
    z-index: 2;
  }

  // 标题列通用样式
  .headerCol {
    flex: none;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;

    >.name {
      @include eclipse;
      width: 100%;
      box-sizing: border-box;
    }

    // grid y
    .sLine {
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      height: 100%;
      background: #000000;
      z-index: 3;
      pointer-events: none;

      &:first-child {
        display: none;
      }
    }
  }

  .scrollX {
    display: flex;
    flex-direction: flex-start;
    align-items: center;
    height: 100%;
    flex: none;
    position: relative;
  }

  $headerBg: #e9ebf0;

  .row-header {
    @include cm;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    background-color: $headerBg;
    box-sizing: border-box;
    z-index: 5;

    .header-right {
      flex: auto;
      height: 100%;
      overflow: hidden;

      .paint-col {
        @extend .headerCol;
        // &:first-child .sLine {
        //   display: none;
        // }
      }
    }

  }

  .row-bottom {
    @include cm;
    display: flex;
    justify-content: space-between;

    .box-left {
      display: flex;
      flex-direction: column;
      flex: none;
      position: relative;

      .paint-row {
        width: 100%;
        flex: none;
        text-align: center;
        justify-content: center;
        display: flex;
        align-items: center;
        background-color: #fafafa;
        position: relative;
        box-sizing: border-box;

        &.disabled {
          flex: none;
          color: #B5B6BF;
        }

        &.canSelected {
          // 可以打开任务操作菜单
          cursor: pointer;

          &:hover {
            opacity: 0.7;
          }
        }

        $arrowWd: 8px;

        &.selected {
          &::after {
            content: ' ';
            pointer-events: none;
            position: absolute;
            right: -7px;
            bottom: -7px;
            border-right: $arrowWd solid $activeColor;
            border-top: $arrowWd solid transparent;
            border-left: $arrowWd solid transparent;
            border-bottom: $arrowWd solid transparent;
            transform: rotate(225deg);
          }
        }

        // &:first-child .sLine {
        //   display: none;
        // }

        >.name {
          @include eclipse;
          width: 100%;
        }

        // grid x
        .sLine {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 1px;
          background: #000000;
          z-index: 3;
          pointer-events: none;
        }
      }
    }

    .box-right {
      flex: auto;
      overflow: hidden;
      position: relative;

      // .box-paint-scroll {
      //   overflow-y: hidden;
      //   overflow-x: auto;
      //   width: 100%;
      //   height: 100%;
      //   @include scrollBar;
      // }
    }

    // 画布区域
    .box-paint {
      // background-color: #dddddd;
      position: relative;
      box-sizing: border-box;

      canvas {
        left: 0;
        top: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
      }
    }

    // 滚动条
    .scrollXBar {
      transition: all ease 0.2s;
      opacity: 0.3;
      position: absolute;
      left: 0;
      bottom: 0;
      overflow-y: hidden;
      overflow-x: auto;
      width: 100%;
      height: 10px;
      z-index: 999;
      @include scrollBar;

      >div {
        height: 10px;
      }
    }

    .scrollYBar {
      transition: all ease 0.2s;
      opacity: 0.3;
      position: absolute;
      right: 0;
      top: 0;
      overflow-y: auto;
      overflow-x: hidden;
      height: 100%;
      width: 10px;
      z-index: 999;
      @include scrollBar;

      >div {
        width: 10px;
      }
    }
  }

  // 最后的统计行
  .stat-bottom {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background-color: $headerBg;
    position: relative;
    z-index: 5;

    .stat-bottom_title {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-bottom_right {
      flex: auto;
      height: auto;
      overflow: hidden;

      .stat-bottom_col {
        text-align: center;
        @extend .headerCol;
      }
    }
  }
}

.menu-common {
  box-sizing: border-box;
  background: #FFFFFF;
  box-shadow: 0px 4px 12px 0px rgba(82, 92, 108, 0.16);
  border-radius: 4px;
  color: #11152B;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #11152B;
  line-height: 18px;
  font-weight: 400;
  text-align: center;
}

// 鼠标右键菜单
.rightClickMenu {
  min-width: 104px;
  position: absolute;
  left: 0;
  top: 0;
  display: none;
  z-index: 7;
  transition: top ease 0.2s;
  user-select: none;
  @extend .menu-common;
  // padding: 5px;

  ul,
  li {
    list-style: none;
  }

  ul {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;

    li {
      font-size: 14px;
      cursor: pointer;
      box-sizing: border-box;
      padding: 5px 8px;
      // background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;

      &.disabled {
        cursor: not-allowed;
        background-color: #dddddd;
      }

      &:not(.disabled):hover {
        color: $activeColor;
        background-color: $activeBg;
      }
    }
  }
}

// 左侧任务列菜单
.task-menu {
  min-width: 76px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  transition: top ease 0.2s;
  user-select: none;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  @extend .menu-common;

  li {
    list-style: none;
    font-size: 14px;
    cursor: pointer;
    box-sizing: border-box;
    padding: 5px 8px;
    // background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000000;

    &.disabled {
      cursor: not-allowed;
      background-color: #dddddd;
    }

    &:not(.disabled):hover {
      color: $activeColor;
      background-color: $activeBg;
    }
  }
}

// 右键tag菜单
.tag-menu {
  @extend .task-menu;
}

// 单独更改tag样式 demo
:deep(.tagSpecial) {
  font-weight: bold;
  color: #000000;
}
</style>