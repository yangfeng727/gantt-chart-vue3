# gantt-chart-vue3 一个使用vue3.x开发的甘特图组件
[npm 地址](https://www.npmjs.com/package/gantt-chart-vue3?activeTab=readme)
这个组件是我“被裁员期间”抽空给之前呆过的公司 **【重庆隆志科技有限公司】** 写的，大家**在二次开发的时候记得保留代码顶部的版权声明文件哦。**
```
<!-- /**
 * Copyright (c) 2023 重庆隆志科技有限公司. All rights reserved.
 * author: yangfeng
 * blog: https://www.jianshu.com/u/71a7345bdabf
 * date: 2024/01/08
 * remark: 如果要分发gantt-chart-vue源码，需在本文件顶部保留此文件头信息！！
 */ -->
```

## 目录说明
examples/packages/components 下是 gantt-chart-vue3 组件源码  
examples下是demo代码，进入examples目录下执行 `npm i 和 npm run dev` 启动项目demo  

## 环境支持
node 大于 node 18.0.0

## vue2.x 支持
vue2.x 请使用 [gantt-chart-vue](https://github.com/yangfeng727/gantt-chart-vue?tab=readme-ov-file)

## vue3.x 支持
是 [gantt-chart-vue](https://github.com/yangfeng727/gantt-chart-vue?tab=readme-ov-file) 升级版本，用于支持 vue3.x

## 特别说明
如果你的项目没有用到 element plus，gantt-chart-vue3 也是可以正常使用的，做了打包优化，内部只会引入几个用到的 element plus 组件与样式。

## 功能
* 1.甘特图精度显示到“分钟”。
* 2.甘特图支持只读模式。
* 3.甘特图支持点击显示标记线，标记线多个甘特图联动，通过 v-model:markLineTime 实现。
* 4.支持在甘特图中标记当前时间-时间线，前提是当前时间在任务开始结束区间内。
* 5.甘特图支持底部支持显示统计行。
* 6.甘特图支持是否开启甘特图高度自适应：  
    true：限定在父级设置的高度范围内，超出将显示纵向滚动条，如果父容器未设置高度，将以初始渲染的高度为准，后续都限定在此高度范围内。  
    false：甘特图自动撑开，特别注意父容器不要设置高度！！！
* 7.甘特图支持右键菜单，通过rightClickMenuList属性配置。
* 8.甘特图支持给左侧任务列配置右键菜单，通过taskMenuList属性配置。  
    任务列菜单 - 每行的菜单都一样，若想给某行单独设置不同的菜单，则给row 对应行赋值 taskMenuList
* 9.每行任务支持同时显示多种类型的tag，可拖动tag到其他行列，不同类型tag将在不同行显示。
* 10.拖动tag时tag左侧显示时间线。
* 11.支持给任务行设置是否禁用，禁用行可设置是否响应事件【不响应则不可拖入禁用行】，可通过disabledRowSilent属性控制是否开启。
* 12.tag tooltip 采用 el-popover实现, 默认显示tag的tooltip、支持单个tag的tip关闭、使用插槽父组件可自行修改tag tooltip内容。
  tip 显示的优先级为：当前tag 设置的closeTip > 当前tag对应legend设置的closeTip > 都没设置则默认显示tip。**gantt-chart-vue3 新增 tipEnterable 可以选择鼠标是否可进入到 tip 中。**
* 13.tag支持右键菜单，tag 右键菜单功能，菜单在legend中配置，点击菜单按钮抛出参数。
* 14.想要时间更精确，当tag拖动，结束后可以弹窗选择起止时间，可通过dragTagEndShowTimeDialog控制是否开启此功能。
* 15.tag 支持点击显示选中效果tag selected为true即可，可以全局关闭，提供获取所有选中项，清空所有选中项api。
* 16.tag 前可以显示自定义图标，就是个类名放到tag前的 `<i>` 标签里面，推荐使用iconfont。
* 17.甘特图支持实现任务持续时间加减n天显示，tag拖动到有滚动条边界时滚动条滚动。
* 18.甘特图支持tag拖动时，后面tag的避让效果。  
    特别注意：拖动结束后需要重新触发甘特图init方法才会清除避让信息！这部分是垃圾数据，只是为了有个避让效果，和甘特图本身数据无关

## 注意
甘特图tag是以左上角点位置判断拖到的哪行。甘特图时间列宽度是根据 “甘特图总宽度 - paintLeft” 的剩余宽度均分得到的，每列设有最小列宽，计算的总宽度大于剩余宽度时将显示横向滚动条。

## 效果图
![图1](./docAssets/img1.png)
![图2](./docAssets/img2.png)
![动态图](./docAssets/gif.gif)

## 安装
npm i gantt-chart-vue3 -S

## 引入

### 方式一：main.js中全局引入
```js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// 引入 gantt-chart-vue3
import "gantt-chart-vue3/dist/style.css";
import * as ganttChartVue3 from "gantt-chart-vue3";

let app = createApp(App);

app.use(ganttChartVue3);

app.mount("#app");

```
### 方式三：组件内单独引入
```vue
<script setup>
  import "gantt-chart-vue3/dist/style.css";
  import ganttChartVue3 from 'gantt-chart-vue3';
</script>
```

### 基础使用
``` vue
<template>
  <div class="wrap">
    <ul class="legend-box">
      <li v-for="(item, index) in ganTT1Option.legend" :key="index">
        <span :style="{ backgroundColor: item.color }"></span>
        {{ item.label }}
      </li>
    </ul>
    <!-- 默认值测试 -->
    <gantt-chart-vue3 ref="ganTT" v-bind="ganTT1Option" @tagDragEnd="tagDragEnd" @tagMenuBtnClick="tagMenuBtnClick"
      @taskMenuBtnClick="taskMenuBtnClick" />
  </div>
</template>

<script setup>
import { ref, reactive, toRefs } from 'vue'

import "gantt-chart-vue3/dist/style.css";
import ganttChartVue3 from 'gantt-chart-vue3';

const data = reactive({
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
            label: "菜单1",
            disabled: false,
          },
          {
            label: "菜单2",
            disabled: false,
          },
          {
            label: "菜单3",
            disabled: false,
          },
        ],
      },
      {
        label: "生产实绩",
        color: "#39c236",
        type: 2, // 用于判定同一网格行内具体所属行
        dragable: true, // 此类型tag是否可以拖动，也可以在rows中配置单个tag是否可以拖动
        closeTip: false, // 显示tag tip，也可以在rows中配置单个tag是否关闭提示
      },
      {
        label: "计划停机1",
        color: "#f5212d",
        type: 3, // 用于判定同一网格行内具体所属行
        closeTip: true, // 关闭此大类的tag tip，若tag自行设置有closeTip，则以tag 内的为准
        dragable: false, // 此类型tag是否可以拖动，也可以在rows中配置单个tag是否可以拖动
      },
      {
        label: "计划停机2",
        color: "#ff9c1b",
        type: 4, // 用于判定同一网格行内具体所属行
        closeTip: false, // 关闭此大类的tag tip，若tag自行设置有closeTip，则以tag 内的为准
        dragable: false, // 此类型tag是否可以拖动，也可以在rows中配置单个tag是否可以拖动
      },
    ],
    rows: [
      {
        label: "项目A",
        tags: [
          {
            startTime: "2023/12/06 02:10:00",
            endTime: "2023/12/07 06:00:00",
            label: "可拖拽，显示tip",
            type: 1,
            preIcon: "iconfont icon-shijian", // tag前的图标
          },
          {
            startTime: "2023/12/01 02:10:00",
            endTime: "2023/12/03 06:10:00",
            label: "生产实绩 tag",
            type: 2,
          },
          {
            startTime: "2023/12/01 02:10:00",
            endTime: "2023/12/03 06:10:00",
            label: "禁止拖拽，关闭tip --- 1",
            type: 3,
          },
          {
            startTime: "2023/12/03 08:00:00",
            endTime: "2023/12/05 10:10:00",
            label: "禁止拖拽，关闭tip --- 2",
            type: 3,
          },
          {
            startTime: "2023/12/01 02:10:00",
            endTime: "2023/12/03 06:10:00",
            label: "禁止拖拽，显示tip，计划停机2,完成度90%",
            type: 4,
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
  },
})
const {
  ganTT1Option
} = toRefs(data)
const ganTT = ref()

// tag拖拽结束
const tagDragEnd = () => {
  console.log("tag拖拽结束", data);
  let rows = ganTT.value.getRowsData();
  console.log("甘特图数据：", rows);
}

// tag 右键菜单点击
const tagMenuBtnClick = (data) => {
  console.log("tag 右键菜单点击", data);
}

const taskMenuBtnClick = (data) => {
  console.log("左侧任务菜单点击", data);
}

</script>

<style scoped>
.wrap {
  padding: 20px;
}

.legend-box {
  list-style: none;
  width: 100%;
  align-items: center;
  display: flex;
  padding: 0;
  margin: 0;
}

.legend-box li {
  list-style: none;
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.legend-box li span {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  margin-right: 5px;
}
</style>
```

# 一、组件 props 属性值介绍，可查看源码 `examples/packages/components/ganttChartVue3/index.vue` 查看所有props
## readOnly
`boolean`，是否只读，最高优先级，为true会禁用所有编辑功能，如拖拽，右键菜单等
## disabledRowSilent
`boolean`，禁用行是否不触发事件，tag不可拖动到禁用行，不触发右键菜单。 true：禁止拖入， false：可以拖入。【注：“禁用行” 是根据rows中每个item的 disabled 属性判断的，disabled:true 代表此行为禁用行，禁用行背景色为 disabledBgColor 的值】
## showSelected
`boolean`，是否显示tag选中 - false 不会显示选中效果，true 显示选中效果【tag是否选中是通过rows中每个item的 selected 控制的】
![tag选中效果.gif](./docAssets/tag选中效果.gif)

## selfAdaptionGanTTHeight
`boolean`，是否开启甘特图高度自适应：  
true：限定在父级设置的高度范围内，超出将显示纵向滚动条，如果父容器未设置高度，将以初始渲染的高度为准，后续都限定在此高度范围内  
false：甘特图自动撑开，特别注意父容器不要设置高度！！！  

## legend
类型为：
``` typescript
interface Ilegendtype{
  color: string;
  type: number;
  dragable?: boolean;
  closeTip?: boolean;
  btnList: {
    label:string;
    disabled?: boolean;
  }[]
}
type Ilegend = Ilegendtype[]
```
甘特图的类型数组，重要！！！，用于控制每行tag的颜色以及行的顺序。完整值例子如：
```js
[
    {
    color: '#365ce5',
    type: 1, // 用于判定同一网格行内具体所属行
    dragable: true, // 此类型tag是否可以拖动，也可以在rows中配置单个tag是否可以拖动
    closeTip: false, // 显示tag tip，也可以在rows中配置单个tag是否关闭提示
    btnList: [ // 右键菜单按钮列表
        {
        label: '开启tag选中',
        disabled: false
        },
        {
        label: '关闭tag选中',
        disabled: false
        },
        {
        label: 'tag前添加图标',
        disabled: false
        }
        ]
    }
]
```
* color: 这种类型tag的背景色【tip：想要设置tag自己的样式请在rows对应项中设置tags的className修改】
* type: 用于判定同一网格行内具体所属行
* dragable: 此类型tag是否可以拖动，也可以在rows中配置单个tag是否可以拖动
* closeTip: 此类型是否显示tag tip，也可以在rows中配置单个tag是否关闭提示，true：不显示tip false：显示tip
* btnList: tag上的右键菜单按钮列表，也可以设置是否禁用某个按钮，效果为:
![右键菜单按钮](./docAssets/右键菜单按钮.png)  
【注意：tag后面显示三个点，代表有操作菜单】

## title
`string`，甘特图标题，默认值：'甘特图'。
## startDate
`string`，初始显示的甘特图列开始时间，默认值：'2023/12/01'。重要！！！
## dateDuration
`number`，任务持续时间 - 从开始时间计算，默认值：7。重要！！！
![任务持续时间](./docAssets/任务持续时间.png)
## decreaseDayNum
`number`，除了dateDuration任务持续时间，当tag横向拖动到左边界时，可以往前几天时间。需求说明：
    如甘特图为7+2天，如果tag往左移出了，甘特图时间轴需要 - 1天；往右移出则 + 1 天，此时甘特图出现横向滚动条。
## IncreaseDayNum
`number`，除了dateDuration任务持续时间，当tag横向拖动到右边界时，可以往后几天时间。
## timeFormat
`string`，标题列时间显示成的格式，默认：'YYYY-MM-DD'。
## rows
甘特图行数据，重要！！！类型为：
``` typescript
interface Itags{
    startTime: string; // 此tag的开始时间，注意是完整时间，如：'2023/12/01 02:10:00'
    endTime: string; // 此tag的结束时间，注意是完整时间，如：'2023/12/03 06:10:00'
    label: string; // tag上显示的文本
    type: number; // 同 legend 中的type类型 Ilegendtype.type，用于判断显示在同一任务行中的哪一行
    closeTip?: boolean; // 不显示此tag的tip，注意：只有true|false才会生效
    dragable?: boolean; // 此类型tag是否可以拖动,优先级最高，不设置将取legend的dragable，都没有则禁止拖动，注意：只有true|false才会生效
    className?: string; // 可单独设置tag样式名，可以同时设置多个，如：'classA classB'，将给此tag加上样式classA和样式classB
    selected?: boolean; // 当前tag是否选中-有选中样式
    preIcon?: string; // tag 前可以显示自定义图标，就是个类名放到tag前的 <i> 标签里面，推荐使用iconfont，如'el-icon-video-camera-solid'
    hide?: boolean; // 是否隐藏此tag
}

interface Ibtn{
    label: string; // 按钮名称
    disabled?: boolean; // 是否禁用
}

interface IRowsItem{
 label: string; // 任务行名称
 disabled?: boolean; // 当前行是否标记为禁用行，若props.disabledRowSilent设置为true，将禁止tag拖入禁用行
 tags: Itags[];
 h?:number; // 甘特图内部会用的变量，不用传，传了也会被覆盖
 taskMenuList?: Ibtn[]; // 当前任务行中任务列的右键菜单，参数和效果同 props.taskMenuList
 // 其他属性，将不做任何修改，可以存储其他前端数据
 [[propName: string]: any;]
}

type IRows = IRowsItem[]

```
## summaryRows
`string[]`，甘特图底部统计行。注意上面的任务时间【包括加减n天】有几列这里就得有几列。  
如：
```js
    // 甘特图底部统计行
    summaryRows: {
        type: Array,
        default() {
        return [
           ['合计1', '1', '2', '3', '1', '2', '3', ''],
           ['合计2', 'a', 'b', 'c', 'd', 'e', 'f', '11'],
        ]
        }
    },
```
![底部合计行](./docAssets/底部合计行.png)
## showMarkLine
`boolean`，是否显示 markLineTime 对应时间的标记线，注意：只读模式下标线功能未禁止，同样可以显示和标记。
## markLineTime
`string`，标记线对应的时间，注意是完整时间，如：'2023/10/04 06:10:00'。标记线的功能为：点击甘特图内容区域，在点击的时间显示一条纵向线，后续可搭配 getTimePierceTags 方法获取所有被指定时间贯穿的tag。demo中有例子，感兴趣可以运行起来看看。
如图：
![贯穿tag的标记线.png](./docAssets/贯穿tag的标记线.png)
## rightClickMenuList
甘特图右键菜单里面的按钮，类型为：
```typescript
interface Ibtn{
    label: string; // 按钮名称
    disabled?: boolean; // 是否禁用
}
type IrightClickMenuList = Ibtn[]
```
值如：
```js
    rightClickMenuList: {
      type: Array,
      default() {
        return [
                {
                    label: '新增模型xx',
                    disabled: true
                },
                {
                    label: '新增停机xx',
                    disabled: false // 是否禁用
                }
        ]
      }
    },
```
效果图：
![甘特图右键菜单](./docAssets/甘特图右键菜单.png)

## taskMenuList
任务列菜单 - 每行的菜单都一样，若想给某行单独设置不同的菜单，则给row 对应行赋值 `taskMenuList`，上面props.rows中有讲到过。  
类型为：
```typescript
interface Ibtn{
    label: string; // 按钮名称
    disabled?: boolean; // 是否禁用
}
type ItaskMenuList = Ibtn[]
```
值如：
```js
    taskMenuList: {
      type: Array,
      default() {
        return [
                {
                    label: '停产',
                    disabled: false // 是否禁用
                },
                {
                    label: '启用',
                    disabled: false // 是否禁用
                }
        ]
      }
    },
```
效果图：
![任务列菜单](./docAssets/任务列菜单.png)
![任务列菜单2](./docAssets/任务列菜单2.png)
## dragTagEndShowTimeDialog
`boolean`，tag拖拽结束是否显示时间选择框，默认：false。
![拖拽结束显示时间框](./docAssets/拖拽结束显示时间框.gif)
## openTagMoveDodgeAnimate
`boolean`，tag拖动的避让效果，只是单纯显示，原理: 修改translateX(x)，这样不会对原始数据造成影响，非必要不用开启此功能。  
**【注意!!!：开启此功能后，将导致某些tag含有translateX 偏移，从而让甘特图表现异常-正确用法是每次拖动结束【比如调接口计算】，然后重新渲染整个甘特图】**
![tag避让效果](./docAssets/tag避让效果.gif)

## tipWdith
`string | number`，tooltip 宽度，默认206px。

## tipEnterable
`boolean`，vue3 甘特图特有属性：鼠标是否可进入到 tag的 tooltip 中， 同 element plus tooltip enterable。

### 下面几个 props 属性是样式属性
## ganttBgColor
`string`，甘特图背景色，默认：'#ffffff'。
## disabledBgColor
`string`，停用|禁用行-背景色，默认：'#ececec'。
## paintLeft
`string`，画布左侧 “类目列” 宽，默认：'80px'。
## paintTop
`string`，画布顶部 “时间列” 高，默认：'40px'。
## gridLineColor
`string`，网格线的颜色，默认：'#dddddd'。

# 二、组件内抛出的事件

## **tagDragStart** tag拖动前，参数为当前tag的数据
```typescript
type ITagItem = {
        data: Itags; // Itags 为之前的 props.rows 中的Itags类型，用于存储原始数据
        parentKey: string; // 记录所属父节点 - 行
        tagId: string; // 内部生成的用于区分tag的唯一id
        timeStampDiffer: number; // 开始时间与结束时间的时间差 - tag 拖动时需要保证时间差不变
        style: { // 当前tag的样式信息
            top: number | string;
            width: number | string;
            left: number | string;
            height: number | string; // 高度
            transform: string; // 用于实现拖拽避让动画
        }
    } & Required<Itags>
interface IParams{
    tagItem: ITagItem;
}
$emit('tagDragStart', params: IParams) // IParams 也就是源码中factoryTag方法的返回值类型
```

## **tagDragEnd** tag拖动结束
```typescript
interface IParams{
    tagItemOld: ITagItem; // 拖拽前tag Data
    tagItem: ITagItem; // 拖拽的tag Data
    tagItemDom: HTMLElement; // 拖拽的tag Dom
    left: number; // 拖动结束相对于甘特图画布【即不包含横纵滚动的画布】的left
    top: number; // 拖动结束相对于甘特图画布【即不包含横纵滚动的画布】的top
}
$emit('tagDragEnd', params: IParams)
```

## **closeTagTimeDialog** 当 dragTagEndShowTimeDialog 为true，tag拖动结束后会打开时间选择弹窗用于精确控制tag的起止时间，当弹窗关闭时触发此事件
```typescript
$emit('closeTagTimeDialog')
```

## **tagClick** tag点击事件
```typescript
interface IParams{
    e: MouseEvent; // 鼠标点击事件参数e
    tag: ITagItem; // 同上
}
$emit('tagClick', params: IParams)
```

## **tagContextmenu** tag上鼠标右键事件
```typescript
interface IParams{
     tag: ITagItem; // 同上
}
$emit('tagContextmenu', params: IParams)
```

## **tagMenuBtnClick** tag上打开的右键菜单点击事件。【注意：前提是 legend 中当前类型的 btnList 有值，不然菜单都没有】
```typescript
interface IParams{
    e: MouseEvent; // 鼠标点击事件参数e
    target: {
      label: string; // 按钮名称
      disabled?: boolean; // 是否禁用
    }, // 菜单触发项
    triggerIndex: btnIndex; // 菜单触发索引
    tag: ITagItem; // 同上
}
$emit('tagMenuBtnClick', params: IParams)
```
![右键菜单按钮](./docAssets/右键菜单按钮.png)

## **changeMarkLineClick** showMarkLine 为 true 时，点击甘特图触发该事件。【注意：左侧任务栏不会触发此事件。】
```typescript
interface IParams{
    markLineTime: string, // 当前点击点在甘特图内对应的时间
    inTags: ITagItem[] // 当前时间贯穿的所有tag
}
$emit('changeMarkLineClick', params:IParams)
```

## **update:markLineTime** showMarkLine 为 true 时，markLineTime的值，vue2 使用 markLineTime.sync，vue3 使用 v-model:markLineTime 可以实现多个图标记线联动效果，见demo。
```typescript
$emit('update:markLineTime', params:string)
```

## **rightClickMenuClick** 甘特图画布区域内右键菜单点击。
```typescript
interface IParams{
    e: MouseEvent; // 鼠标点击事件参数e
    target: {
        label: string;
        disabled?: boolean;
    }; // 菜单触发项 - 即 rightClickMenuList 的item项
    triggerIndex: number; // 菜单触发索引 - rightClickMenuList 中的索引
    coordsInfo: {
        x: number; // 鼠标右键触发点x坐标像素，注：是相对于甘特图画布【即不包含横纵滚动的画布】的
        y: number; // 鼠标右键触发点y坐标像素，注：是相对于甘特图画布【即不包含横纵滚动的画布】的
        coords: [string, string] // x,y像素坐标转成的数据坐标
    };
}
$emit('rightClickMenuClick', params:IParams)
```

## **taskMenuBtnClick** 左侧任务列操作菜单点击事件。
```typescript
interface IBtn{
    label: string;
    disabled?: boolean; // 是否禁用
}
interface IParams{
    e: MouseEvent; // 鼠标点击事件参数e
    target: IBtn, // 菜单触发项
    triggerIndex: number; // 菜单触发索引
    rowData: {
        h: number;
        label: string;
        tags: ITagItem[]
        taskBtnList: IBtn[]
    }
}
$emit('taskMenuBtnClick', params:IParams)
```

# 三、组件重要实例方法介绍
## getRowsData() 获取甘特图完整行数据, 格式和props.rows一致
```typescript
interface IGanttChartVueInstance{
   getRowsData(): IRowsItem[];
}
```

## getTimePierceTags('2023/10/04 06:10:00') 获取指定时间贯穿的所有tag
```typescript
interface IGanttChartVueInstance{
   getTimePierceTags(time:string): ITagItem[];
}
```

## clearAllTagSelected() 清空所有tag的选中状态，将 selected 都设置为 false
```typescript
interface IGanttChartVueInstance{
   clearAllTagSelected(): void;
}
```

## getAllSelectedTags() 获取所有被选中的tag，也就是将 selected 为 true 的过滤出来
```typescript
interface IGanttChartVueInstance{
   getAllSelectedTags(): ITagItem[];
}
```

## updateTag(tagId, newTagItem, refreshGTT) 修改tag节点，比如修改此节点的selected、className、closeTip等等属性
```typescript
interface IGanttChartVueInstance{
    /**
     * 修改tag节点
     * @param {*} tagId 生成的甘特图tag唯一id
     * @param {*} newTagItem 修改后的tag
     * @param {*} refreshGTT 修改tag后是否需要刷新甘特图，不涉及宽高计算变化的可以不调用刷新，提高性能
     * @return boolean 操作成功 | 失败
     */
    updateTag(tagId: string,newTagItem: ITagItem, refreshGTT: boolean): boolean; // 操作成功返回 true，失败返回false
}
```

## deleteTag(tagId) 删除tag节点
```typescript
interface IGanttChartVueInstance{
    /**
     * 删除tag节点
     * @param {*} tagId 生成的甘特图tag唯一id
     * @return boolean 操作成功 | 失败
     */
    deleteTag(tagId: string): boolean; // 操作成功返回 true，失败返回false
}
```

## getTagsByRowLabel(label) 获取指定label行下的所有tags
```typescript
interface IGanttChartVueInstance{
    /**
     * @param {*} rowLabel 左侧任务栏的label
     */
    getTagsByRowLabel(rowLabel: string): ITagItem[];
}
```
# 四、slots 插槽

## tagTip 插槽可以自定义 tag 的 tooltip 效果，tag tooltip 是基于 element-plus 的 el-popover 实现的。
```vue
    <!-- tag tip内容 -->
    <template #tagTip="{ tagData }">
        <div class="myTagTip">
            <p>标题：</p>
            <p>自定义tag内容： {{ tagData.label + 'abcdef' }}</p>
            <p>说明11111</p>
        </div>
    </template>

```
# 五、其他说明
文档中部分类型相同的没有再列举，全局搜索下就找到了，实例方法只是列举了几个常用的，应该能满足大部分需求了。源码注释很清晰，大家也可以二次开发，不过记得保留版权声明，或者提个issue，我看到了有时间就来改。如果 github 上文档里面的图片显示不出来，可以把项目下载下来在本地查看，引用的图片都在里面。

# 关于打包发布遇到的问题

### 从 vue2.x 升级到 vue3.x 版本
1.将 element-ui 改为了 element-plus，其中 Popover 修改了下，element-ui 版本的 Popover 不能直接拿来使用。  
2.源码内部 tag 事件名称修改，如在 vue2.x 版本的 click 改为 tagClick，contextmenu 改为tagContextmenu，blur 改为 tagBlur。因为发现取原生事件名称将导致事件重复触发，其中一次由原生事件触发。

### dayjs 模块
element plus 内部包含了 dayjs 模块，因而不用单独引入。

### 打包发布时分离 element plus
因为vite 打包提供了 rollupOptions.external 可以分离 element plus，这样编译后的体积更小。在发布后的 package.json 里声明了的 element plus 的依赖，因此无论用户的项目是否有安装 element plus，都可以保证甘特图正常使用。

### 样式问题
甘特图样式被分离出去了，因此使用甘特图的时候要单独再引入样式。  
分离 element plus 后甘特图内按需导入用到的 element plus 组件与其样式。  
```js
// element-plus 导入组件样式
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/date-picker/style/css'
import { ElMessage, ElButton, ElDialog, ElDatePicker } from 'element-plus'
```
后改为 element plus 官网提到的 unplugin-element-plus 插件，用于替代上面手动导入样式的写法，这种方式也避免了 element plus 后续升级了如果目录变化了，样式加载不出来的情况。  
需要注意的是**目录修改了，之前 packages 目录是在外面的，现在需要挪到 examples 目录里面**，因为 import element-plus 样式的时候找不到文件，是 vite 框架问题？element-plus 组件可以访问，为啥样式就不行，留到后面再找下原因？使用 unplugin-element-plus 插件也要求 packages 目录在examples 目录里面。
