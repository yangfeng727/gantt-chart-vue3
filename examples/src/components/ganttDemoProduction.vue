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

<script>

import '../../../dist/style.css';
import ganttChartVue3 from '../../../dist/gantt-chart-vue3.js';
export default {
    components: {
        ganttChartVue3,
    },
    data() {
        return {
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
        };
    },
    methods: {
        // tag拖拽结束
        tagDragEnd(data) {
            console.log("tag拖拽结束", data);
            let rows = this.$refs["ganTT"].getRowsData();
            console.log("甘特图数据：", rows);
        },
        // tag 右键菜单点击
        tagMenuBtnClick(data) {
            console.log("tag 右键菜单点击", data);
        },
        // 左侧任务菜单
        taskMenuBtnClick(data) {
            console.log("左侧任务菜单点击", data);
        },
    },
};
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