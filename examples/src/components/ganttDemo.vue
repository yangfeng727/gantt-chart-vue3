<!-- 甘特图vue2 -->
<template>
  <div class="wrap">
    <div class="header" v-if="showOther">
      <span>显示模式：</span>
      <el-select style="width: 200px;" v-model="showMode" placeholder="请选择" @change="filterGanTTTags">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <div class="legend">
        <span><i :style="{ backgroundColor: legendAll[0].color }"></i>{{ legendAll[0].label }}</span>
        <span><i :style="{ backgroundColor: legendAll[1].color }"></i>{{ legendAll[1].label }}</span>
        <span><i :style="{ backgroundColor: legendAll[2].color }"></i></span>
        <span><i :style="{ backgroundColor: legendAll[3].color }"></i>{{ legendAll[3].label }}</span>
      </div>

      <el-checkbox v-model="showMarkLine" style="margin-left: 20px">显示标记线</el-checkbox>

      <el-button type="primary" style="margin-left: 20px" @click="logParams">打印重要参数</el-button>
    </div>
    <div class="bottom">
      <div :class="{ 'left-box': true, showDetail: showDetail }">
        <div class="gt1" style="height: 400px">
          <!-- 默认值测试 -->
          <ganttChartVue ref="ganTT1" v-bind="ganTT1Option" :showMarkLine="showOther ? showMarkLine : false"
            v-model:markLineTime="markLineTime" @changeMarkLineClick="changeMarkLineClick1"
            @rightClickMenuClick="rightClickMenuClick1" @taskMenuBtnClick="taskMenuBtnClick"
            @tagMenuBtnClick="tagMenuBtnClick1" />
        </div>

        <div style="margin-top: 50px" v-if="showOther">
          <el-button type="primary" @click="withdraw">撤回</el-button>
        </div>
        <div v-if="showOther" class="gt1">
          <!-- 调用demo -->
          <ganttChartVue ref="ganTT2" v-bind="ganTT2Option" :showMarkLine="showMarkLine"
            v-model:markLineTime="markLineTime" @changeMarkLineClick="changeMarkLineClick2"
            @rightClickMenuClick="rightClickMenuClick2" @taskMenuBtnClick="taskMenuBtnClick"
            @tagDragStart="tagDragStart" @tagDragEnd="tagDragEnd2" @tagContextmenu="tagContextmenuHandle2"
            @tagMenuBtnClick="tagMenuBtnClick2" @tagClick="tagClick2" @closeTagTimeDialog="closeTagTimeDialog">
            <!-- tag tip内容 -->
            <template #tagTip="{ tagData }">
              <div class="myTagTip">
                <p>标题：</p>
                <p>自定义tag内容： {{ tagData.label + "abcdef" }}</p>
                <p>说明11111</p>
              </div>
            </template>
          </ganttChartVue>
        </div>
      </div>
      <div v-if="showOther" :class="{ 'right-box': true, showDetail: showDetail }">
        <div class="arrow" @click="changeShowDetail">详细信息</div>
        <!-- 内容 -->
        <div class="detail-content" v-if="showDetail">
          <p>详细信息xxxx。。。。</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { cloneObj } from "./index";
import ganttChartVue from "../../packages/components/ganttChartVue3/index.vue"; // 本地调试
// import ganttChartVue from '../../../dist/gantt-chart-vue.umd.min.js' // 测试编译后的文件

export default {
  components: {
    ganttChartVue,
  },
  data() {
    return {
      showOther: true, // 调试
      showMode: 1,
      options: [
        {
          label: "图2显示全部",
          value: 1,
        },
        {
          label: "图2不显示停机",
          value: 2,
        },
      ],
      legendAll: [
        {
          label: "模型预排",
          color: "#365ce5",
          type: 1, // 用于判定同一网格行内具体所属行
        },
        {
          label: "生产实绩",
          color: "#39c236",
          type: 2, // 用于判定同一网格行内具体所属行
        },
        {
          label: "计划停机1",
          color: "#f5212d",
          type: 3, // 用于判定同一网格行内具体所属行
        },
        {
          label: "计划停机",
          color: "#ff9c1b",
          type: 4, // 用于判定同一网格行内具体所属行
        },
      ],
      showDetail: false,

      ganTT1Option: {
        readOnly: false, // 只读模式
        title: "甘特图",
        legend: [
          {
            label: "模型预排",
            color: "#365ce5",
            type: 1, // 用于判定同一网格行内具体所属行
            dragable: true, // 此类型tag是否可以拖动，也可以在rows中配置单个tag是否可以拖动
            closeTip: false, // 显示tag tip，也可以在rows中配置单个tag是否关闭提示
            btnList: [
              // 右键菜单按钮列表
              {
                label: "tag menu btn1",
                disabled: false,
              },
              {
                label: "tag menu btn2",
                disabled: false,
              },
              {
                label: "tag menu btn3禁用",
                disabled: true,
              },
            ],
          },
          {
            label: "生产实绩",
            color: "#39c236",
            type: 2, // 用于判定同一网格行内具体所属行
          },
          {
            label: "计划停机1",
            color: "#f5212d",
            type: 3, // 用于判定同一网格行内具体所属行
            closeTip: true, // 关闭此大类的tag tip，若tag自行设置有closeTip，则以tag 内的为准
          },
          {
            label: "计划停机2",
            color: "#ff9c1b",
            type: 4, // 用于判定同一网格行内具体所属行
          },
        ],
        rows: [
          {
            label: "项目A",
            tags: [
              // 注意：属性在 backfillTag 方法中声明才会生效，其他数据会统一放到 tag.data 中,属于不被承认的外部数据，虽然也能实现。。。
              {
                startTime: "2023/12/01 02:10:00",
                endTime: "2023/12/03 06:10:00",
                label: "关闭tag的hover tip效果",
                type: 2,
                closeTip: true, // 不显示此tag的tip，注意：只有true|false才会生效
                dragable: true, // 此类型tag是否可以拖动,优先级最高，不设置将取legend的dragable，都没有则禁止拖动，注意：只有true|false才会生效
                className: "tagSpecial", // 可单独设置tag样式名
                selected: false, // 当前tag是否选中-有选中样式
                preIcon: "iconfont icon-shijian", // tag前的图标
                hide: false, // 是否隐藏此tag
              },
              {
                startTime: "2023/12/01 02:10:00",
                endTime: "2023/12/03 06:10:00",
                label: "关闭此类型tip-1",
                type: 3,
              },
              {
                startTime: "2023/12/01 02:10:00",
                endTime: "2023/12/03 06:10:00",
                label: "计划停机2,完成度90%",
                type: 4,
              },
              {
                startTime: "2023/12/03 08:00:00",
                endTime: "2023/12/05 10:10:00",
                label: "关闭此类型tip-2",
                type: 3,
              },
              {
                startTime: "2023/12/06 02:10:00",
                endTime: "2023/12/07 06:00:00",
                label: "tag右键菜单展示demo",
                type: 1,
              },
            ],
          },
          {
            label: "项目B",
            tags: [
              {
                startTime: "2023/12/06 02:10:00",
                endTime: "2023/12/07 06:10:00",
                label: "模型预排1111,xx吨,完成度90%",
                type: 1,
              },
              {
                startTime: "2023/12/01 02:10:00",
                endTime: "2023/12/03 06:10:00",
                label: "xxxx,xx吨,完成度90%",
                type: 3,
              },
            ],
          },
          {
            label: "项目C",
            tags: [],
          },
          {
            label: "项目D",
            tags: [
              {
                startTime: "2023/12/01 02:10:00",
                endTime: "2023/12/03 06:10:00",
                label: "xxxx,xx吨,完成度90%",
                type: 1,
              },
            ],
          },
          {
            label: "项目E",
            tags: [],
          },
          {
            label: "项目F",
            tags: [],
          },
          {
            label: "项目G",
            disabled: true, // 禁止响应事件
            tags: [],
          },
          {
            label: "项目H",
            tags: [],
          },
        ],
        startDate: "2023/12/01",
        dateDuration: 7,
      },

      // 甘特图配置项
      ganTT2Option: {
        title: "甘特图2",
        readOnly: false,
        disabledRowSilent: false,
        legend: [
          {
            label: "第一行tag",
            color: "#365ce5",
            type: 1, // 用于判定同一网格行内具体所属行
            dragable: true, // 此类型tag是否可以拖动
            closeTip: false, // 是否关闭tag tip
            btnList: [
              // 右键菜单按钮列表
              {
                label: "开启tag选中",
                disabled: false,
              },
              {
                label: "关闭tag选中",
                disabled: false,
              },
              {
                label: "清除所有tag选中",
                disabled: false,
              },
              {
                label: "获取所有选中tag",
                disabled: false,
              },
              {
                label: "加锁",
                value: "addPreIcon", // 自定义的唯一key，用于点击后匹配
                disabled: false,
              },
              {
                label: "合并",
                value: "merge", // 自定义的唯一key，用于点击后匹配
                disabled: false,
              },
            ],
          },
          {
            label: "第二行tag",
            color: "#39c236",
            type: 2, // 用于判定同一网格行内具体所属行
            dragable: false, // 此类型tag是否可以拖动
          },
        ],
        startDate: "2023/12/01",
        dateDuration: 7,
        // 任务列菜单 - 每行的菜单都一样，若想给某行单独设置不同的菜单，则给row 对应行赋值 taskMenuList
        taskMenuList: [
          {
            label: "停产",
            disabled: false, // 是否禁用
          },
          {
            label: "启用",
            disabled: false, // 是否禁用
          },
        ],
        // 甘特图行数据和每行的tag
        rows: [
          {
            label: "菜单不同",
            taskMenuList: [
              {
                label: "不同的菜单1",
                disabled: true, // 是否禁用
              },
              {
                label: "不同的菜单2",
                disabled: false, // 是否禁用
              },
            ],
            tags: [
              {
                startTime: "2023/12/02 02:10:00",
                endTime: "2023/12/03 06:10:00",
                label: "生产实绩,此tag不显示tip",
                type: 2,
                closeTip: true, // 不显示tip
                className: "", // 可单独设置tag样式名
                selected: false, // 是否选中
                preIcon: "iconfont icon-chakan",
              },
              {
                startTime: "2023/12/01 02:10:00",
                endTime: "2023/12/03 06:00:00",
                label: "计划停机，同一行，但是颜色不同",
                className: "haltTag", // 可单独设置tag样式名
                type: 1,
                dragable: true, // 此类型tag是否可以拖动
              },
              {
                startTime: "2023/12/04 02:10:00",
                endTime: "2023/12/05 06:00:00",
                label: "停机，tag不可拖动",
                className: "planHaltTag", // 可单独设置tag样式名
                type: 1,
                dragable: false, // 此类型tag是否可以拖动
              },
              {
                startTime: "2023/12/05 12:10:00",
                endTime: "2023/12/06 06:00:00",
                label: "xxxx,xx吨,完成度90%",
                type: 1,
              },
            ],
          },
          {
            label: "项目B",
            tags: [
              {
                startTime: "2023/12/06 02:10:00",
                endTime: "2023/12/07 06:10:00",
                label: "模型预排1111,xx吨,完成度90%",
                type: 1,
              },
            ],
          },
          {
            label: "项目C",
            disabled: true, // 禁止响应事件
            tags: [],
          },
          {
            label: "项目D",
            tags: [
              {
                startTime: "2023/12/01 02:10:00",
                endTime: "2023/12/03 06:10:00",
                label: "xxxx,xx吨,完成度90%",
                type: 1,
              },
            ],
          },
          {
            label: "项目E",
            tags: [],
          },
        ],
        // 合计行
        summaryRows: [
          ["合计1", "1", "2", "3", "1", "2", "3", ""],
          ["合计2", "a", "b", "c", "d", "e", "f", "11"],
        ],
        // 甘特图右键菜单
        rightClickMenuList: [
          {
            label: "新增模型xx",
            disabled: true,
          },
          {
            label: "新增停机xx",
            disabled: false, // 是否禁用
          },
        ],
        // tag拖拽结束是否显示时间选择框
        dragTagEndShowTimeDialog: true,
        // 是否显示tag 选中效果
        showSelected: false,

        // 甘特图为7+2天
        decreaseDayNum: 1, // 显示前一天
        IncreaseDayNum: 1, // 显示后一天

        // tag拖动的避让效果，原理: 修改translateX(x)，这样不会对原始数据造成影响
        openTagMoveDodgeAnimate: true, // 开启
        selfAdaptionGanTTHeight: false, // 关闭高度自适应，采用高度撑开模式
      },

      // 显示标记线
      showMarkLine: false,
      markLineTime: "2023/10/04 06:10:00",

      selectTagIds: [], // 甘特图内部的获取选中没有顺序，另外来个变量存储

      recordPreStep: null, // 存储上一步，用于撤回
    };
  },
  mounted() {
    this.filterGanTTTags();
  },
  methods: {
    // 筛选
    filterGanTTTags() {
      let rows = this.ganTT2Option.rows;
      if (+this.showMode === 1) {
        // 全部显示
        this.ganTT2Option.rows = rows.map((item) => {
          item.tags.map((subItem) => {
            subItem.hide = false;
          });
          return item;
        });
      } else {
        // 筛选
        this.ganTT2Option.rows = rows.map((item) => {
          item.tags.map((subItem) => {
            if (subItem.className) {
              subItem.hide = true;
            }
          });
          return item;
        });
      }
    },
    logParams() {
      let ganTT1 = this.$refs["ganTT1"];
      let ganTT2 = this.$refs["ganTT2"];
      console.log(
        "ganTT1 标记线贯穿tags",
        ganTT1.getTimePierceTags(this.markLineTime)
      );
      console.log(
        "ganTT2 标记线贯穿tags",
        ganTT2.getTimePierceTags(this.markLineTime)
      );

      console.log("ganTT1 甘特图数据", ganTT1.getRowsData());
      console.log("ganTT2 甘特图数据", ganTT2.getRowsData());

      console.log(
        "ganTT1 项目B这行下的所有tags",
        ganTT1.getTagsByRowLabel("项目B")
      );
    },
    changeShowDetail(bool = false) {
      this.showDetail = !this.showDetail;
    },
    changeMarkLineClick1(data) {
      console.log(data, 1);
    },
    changeMarkLineClick2(data) {
      console.log(data, 2);
    },

    // 甘特图右键菜单
    rightClickMenuClick1(data) {
      console.log("甘特图右键菜单点击", data);
    },
    // 甘特图右键菜单
    rightClickMenuClick2(data) {
      console.log("甘特图右键菜单点击", data);
      switch (+data.triggerIndex) {
        // 点击按钮1
        case 0:
          console.log("点击按钮0");
          break;
        case 1:
          console.log("点击按钮1");
          break;
      }
    },
    // 左侧任务菜单
    taskMenuBtnClick(data) {
      console.log("左侧任务菜单点击", data);
    },
    // tag拖拽结束
    tagDragEnd2(data) {
      console.log("tag拖拽结束", data);
    },
    tagDragStart() {
      this.saveStep();
    },
    saveStep() {
      this.recordPreStep = cloneObj(this.$refs["ganTT2"].getRowsData());
    },
    withdraw() {
      if (this.recordPreStep) {
        this.ganTT2Option.rows = this.recordPreStep;
        this.recordPreStep = null;
      } else {
        this.$message({
          message: "只能撤回一步",
          type: "warning",
        });
      }
    },
    // tag拖动结束后的时间选择弹窗关闭事件
    closeTagTimeDialog() {
      // 存储数据
      this.ganTT2Option.rows = this.$refs["ganTT2"].getRowsData();
      console.log("注意：rows 改变将触发甘特图init方法，会清除避让信息");
    },
    // tag上右键菜单按钮
    tagMenuBtnClick1(data) {
      console.log("tag上右键菜单按钮", data);
    },
    // tag上右键菜单按钮
    tagMenuBtnClick2(data) {
      console.log("tag上右键菜单按钮", data);
      let { tag, triggerIndex, target } = data;

      switch (target.label) {
        case "开启tag选中": //
          this.ganTT2Option.showSelected = true;
          break;
        case "关闭tag选中": //
          this.ganTT2Option.showSelected = false;
          break;
        case "清除所有tag选中": //
          this.$refs["ganTT2"].clearAllTagSelected();
          break;
        case "获取所有选中tag": //
          let selectedTags = this.$refs["ganTT2"].getAllSelectedTags();
          console.log("所有选中tag", selectedTags);
          break;
      }

      // 根据索引匹配、或者label、或者自定义的唯一key，自由发挥

      if (target.value === "addPreIcon") {
        // tag前添加图标
        this.$refs["ganTT2"].updateTag(
          tag.tagId,
          {
            ...tag,
            preIcon: !tag.preIcon ? "iconfont icon-warn" : "",
          },
          false
        );
      }

      if (target.value === "merge") {
        // 合并
        if (this.selectTagIds.length < 2)
          return this.$message({
            message: "请选择需要合并的两项",
            type: "warning",
          });
        this.$confirm("确定合并已选中的两个订单?", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let selectedTagsInGanTT = this.$refs["ganTT2"].getAllSelectedTags(); // 获取已经选中的tag
            console.log("已选中的两个订单:", selectedTagsInGanTT);
          })
          .catch(() => { });
      }
    },
    // tag 点击
    tagClick2(data) {
      console.log("tag 点击", data);
      if (!this.ganTT2Option.showSelected) return; // 不可选择

      let tagItem = data.tag;
      if (+tagItem.type !== 1)
        return this.$message({
          message: "只有第一行可以选中",
          type: "warning",
        });

      let tagId = tagItem.tagId;
      let isInRecord = this.selectTagIds.includes(tagId); // 当前tag是否存储到历史中
      let _selected = !tagItem.selected; // 选中状态
      let selectedTagsInGanTT = this.$refs["ganTT2"].getAllSelectedTags(); // 获取已经选中的tag

      if (this.selectTagIds.length) {
        // 之前有选中项
        let firstSelectedTagId = this.selectTagIds[0]; // 第一个id
        let firstSelectedTag = selectedTagsInGanTT.find(
          (_item) => _item.tagId === firstSelectedTagId
        );
        if (!firstSelectedTag) {
          // 没有匹配项，说明甘特图中的tagid 重新生成了了 -- 之前的id无意义，建议给每个tag来个唯一id这样就会避免这种情况【如这个demo，撤回后这部分选中状态将消失】
          // 这里将丢失之前的选中顺序
          this.selectTagIds = selectedTagsInGanTT.map((_it) => _it.tagId); // 重新获取图里面的
          if (!this.selectTagIds.length) return; // 选中状态tag移动报错bug修复
          firstSelectedTagId = selectedTagsInGanTT[0].tagId;
          firstSelectedTag = selectedTagsInGanTT[0];
        }
        let recordRowLabel = firstSelectedTag.parentKey; // 之前选的哪行
        if (recordRowLabel !== tagItem.parentKey)
          return this.$message({
            message: "请选择相同行",
            type: "warning",
          });

        // 取消之前那个tag选中
        if (!isInRecord && _selected && this.selectTagIds.length >= 2) {
          this.selectTagIds.shift();
          this.$refs["ganTT2"].updateTag(
            firstSelectedTagId,
            {
              ...firstSelectedTag,
              selected: false,
            },
            false
          );
        }
      }

      // 更新tag选中状态
      this.selectTagIds = this.selectTagIds.filter((id) => id !== tagId);
      _selected && this.selectTagIds.push(tagId);
      this.$refs["ganTT2"].updateTag(
        tagId,
        {
          ...tagItem,
          selected: _selected,
        },
        false
      );
    },

    // tag上鼠标右键 --- 用来更改左侧菜单显示
    tagContextmenuHandle2({ tag }) {
      let findLgend = this.ganTT2Option.legend.find(
        (item) => item.type === tag.type
      );
      let findLegendItem = findLgend.btnList.find(
        (item) => item.value === "addPreIcon"
      );
      findLegendItem.label = tag.preIcon ? "解锁" : "加锁";
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  color: #11152b;
  overflow-x: hidden;
}

.gt1 {
  width: 100%;
  margin-top: 10px;
  // height: 400px;

  &:first-child {
    margin-top: 0;
  }
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;

  .legend {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    >span {
      margin-left: 24px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      &:last-child {
        margin-left: 0;
      }
    }

    i {
      display: block;
      margin-right: 6px;
      width: 16px;
      height: 16px;
      border-radius: 3px;
    }
  }
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;

  .left-box {
    flex: auto;
    overflow: hidden;

    &.showDetail {
      width: calc(100% - 300px);
    }
  }

  .right-box {
    position: relative;
    margin-left: 53px;
    flex: none;
    background: #f0f2f5;
    border: 1px solid rgba(233, 235, 240, 1);
    border-radius: 8px;
    transition: all ease 0.2s;

    &.showDetail {

      // transform: translateX(100%);
      .detail-content {
        width: 300px;
      }
    }

    .detail-content {
      transition: all ease 0.2s;
      width: 0;
    }

    .arrow {
      position: absolute;
      left: 0;
      top: 50%;
      width: 32px;
      height: 142px;
      background: #505776;
      border-radius: 8px 0px 0px 8px;
      transform: translate(-100%, -50%);
      cursor: pointer;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      writing-mode: tb;
      color: #ffffff;
      font-size: 16px;
    }
  }
}

.myTagTip {
  p {
    margin: 0;
  }
}

// 计划停机
:deep(.haltTag) {
  background-color: #ff9c1b;
}

// 停机
:deep(.planHaltTag) {
  background-color: #f5212d;
}
</style>