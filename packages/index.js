/**
 * Copyright (c) 2023 重庆隆志科技有限公司. All rights reserved.
 * author: yangfeng
 * blog: https://www.jianshu.com/u/71a7345bdabf
 * date: 2024/01/08
 * remark: 如果要分发gantt-chart-vue源码，需在本文件顶部保留此文件头信息！！
 */

import ganttChartVue from './components/ganttChartVue/index.vue'

const components = [
    ganttChartVue
]
// 定义install方法
const install = function (Vue) {
    if (install.installed) return
    install.installed = true
    // 遍历注册所有的组件
    components.forEach(component => {
        Vue.component(component.name, component)
    })
}

// 对于那些没有在应用中使用模块化系统的用户，他们往往将通过 <script> 标签引用你的插件，并期待插件无需调用 Vue.use() 便会自动安装 。
// 你可以在插件最后添加如下几行代码来实现自动安装：
// 判断是否是直接引入文件，如果Vue是全局对象自动安装插件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
export default ganttChartVue
export {
    install
}