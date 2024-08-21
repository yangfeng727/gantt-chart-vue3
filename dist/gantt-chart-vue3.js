import { dayjs as U, ElPopover as Z, ElButton as ee, ElDialog as te, ElDatePicker as ie, ElMessage as $ } from "element-plus";
import { openBlock as T, createElementBlock as p, createElementVNode as c, normalizeClass as B, createTextVNode as W, toDisplayString as b, createCommentVNode as G, resolveComponent as I, normalizeStyle as w, withModifiers as k, createVNode as L, createBlock as Q, withCtx as C, renderSlot as J, withDirectives as A, vShow as X, normalizeProps as z, guardReactiveProps as K, mergeProps as le, Fragment as M, renderList as R } from "vue";
function se(e, t) {
  var i = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), l = [], s;
  t = t || i.length;
  {
    var a;
    for (l[8] = l[13] = l[18] = l[23] = "-", l[14] = "4", s = 0; s < 36; s++)
      l[s] || (a = 0 | Math.random() * 16, l[s] = i[s == 19 ? a & 3 | 8 : a]);
  }
  return l.join("");
}
Function.prototype.call.bind(Object.prototype.toString);
function N(e) {
  let t = null;
  if (Object.prototype.toString.call(e) === "[object Array]") {
    t = [];
    for (let i = 0; i < e.length; i++)
      t.push(N(e[i]));
  } else if (Object.prototype.toString.call(e) === "[object Object]") {
    t = {};
    for (let i in e)
      t[i] = N(e[i]);
  } else
    t = e;
  return t;
}
function ae(e) {
  return window.getComputedStyle(e, null).position !== "static";
}
function ne(e) {
  if (!e) return null;
  let t = e.parentNode, i = null;
  for (; t && t.nodeName !== "BODY" && t.nodeName !== "HTML"; ) {
    if (ae(t)) {
      i = t;
      break;
    }
    t = t.parentNode;
  }
  return i || (i = document.getElementsByTagName("body")[0]), i;
}
const o = {
  // 日期操作
  _date: {
    // 格式化date
    format(e, t = "YYYY-MM-DD HH:mm:ss") {
      return U(e).format(t);
    },
    add(e = "", t = 1, i = "day") {
      return U(e).add(t, i);
    }
  },
  // 判断val是否为空
  isNull(e) {
    return e == null || e === "" || e.toString() === "NaN";
  },
  /**
   * 获取val值，若为空则使用默认值
   * @param {*} val
   * @param {*} dt val为空时的默认值
   * @param {*} unit 单位
   * @returns string|number|boolean
   */
  getStrVal(e, t = "", i = "") {
    return this.isNull(e) ? t : e + i;
  },
  // 获取css属性值的单位，如：px、rem、%
  getUnit(e = "") {
    return (e.match(/[^.\d]*/gi) || []).find((t) => t) || "";
  },
  // 去掉值后的单位：eg： 10px -> 10
  delValUnit(e, t) {
    if (!t && (t = this.getUnit(e), !t))
      return e;
    let i = new RegExp(t + "$", "ig");
    return e.replace(i, "");
  },
  // 禁止鼠标右键
  oncontextmenuDisabled(e) {
    return e.stopPropagation(), e.preventDefault(), !1;
  },
  //#region dom操作
  setDOMH(e, t) {
    !e || !e.style || (e.style.height = t + "px");
  },
  setDOMW(e, t) {
    !e || !e.style || (e.style.width = t + "px");
  },
  // 获取dom 宽高
  getDOMWH(e) {
    let t = e || {};
    return {
      w: t.offsetWidth || 0,
      h: t.offsetHeight || 0
    };
  },
  //#endregion dom操作
  //#region canvas
  // 清除画布
  clearCanvas(e) {
    if (!e) return;
    e.getContext("2d").clearRect(0, 0, e.width, e.height);
  },
  // 设置canvas 宽高
  setCanvasWH(e, t, i) {
    e && (e.width = t, e.height = i, e.style.width = t + "px", e.style.height = i + "px");
  },
  //#endregion canvas
  /**
   * 使用ease-in-out曲线作为默认的滚动效果
   * @param {*} t 当前动画时间
   * @param {*} b 起点距离
   * @param {*} c 终点距离
   * @param {*} d 动画持续时间
   * @returns 
   */
  easeInOutQuad(e, t, i, l) {
    return e /= l / 2, e < 1 ? i / 2 * e * e + t : (e--, -i / 2 * (e * (e - 2) - 1) + t);
  },
  smoothScroll({
    startPosition: e,
    // 开始位置
    distance: t,
    // 距离开始位置的距离
    duration: i = 300,
    // 动画持续时间 ms
    callBack: l
  } = { duration: 300 }) {
    let s = null, a = (g) => {
      !s && (s = g);
      let f = g - s, r = this.easeInOutQuad(f, e, t, i);
      l && l(r), f < i && requestAnimationFrame(a);
    };
    requestAnimationFrame(a);
  }
};
function re({
  contentDom: e,
  // 边界盒子dom
  dragDom: t,
  // 拖拽的盒子dom
  left: i,
  top: l
}) {
  let s = 0, a = 0, g = e.offsetWidth - t.offsetWidth, f = e.offsetHeight - t.offsetHeight;
  return i < s && (i = s), l < a && (l = a), i > g && (i = g), l > f && (l = f), {
    left: i,
    top: l
  };
}
function q({
  disabledYMin: e,
  // 禁用行Y最小值
  disabledYMax: t,
  // 禁用行Y最大值
  tagHeight: i,
  // tag 的高度
  tagTop: l
  // tag 的css top值
}) {
  return l > e - i && l < t;
}
const E = (e, t) => {
  const i = e.__vccOpts || e;
  for (const [l, s] of t)
    i[l] = s;
  return i;
}, oe = {
  name: "tagItemLabel",
  props: {
    tagItem: {
      type: Object,
      default() {
        return {};
      }
    },
    // 是否显示右侧菜单标记
    showOperateMark: {
      type: Boolean,
      default: !1
    }
  }
}, he = { class: "label-yc" }, ge = {
  key: 0,
  class: "taglabel-af"
};
function fe(e, t, i, l, s, a) {
  return T(), p("span", he, [
    c("i", {
      class: B(["taglabel-bf", i.tagItem.preIcon || ""])
    }, null, 2),
    W(" " + b(i.tagItem.label) + " ", 1),
    i.showOperateMark ? (T(), p("i", ge)) : G("", !0)
  ]);
}
const de = /* @__PURE__ */ E(oe, [["render", fe], ["__scopeId", "data-v-66e88bcf"]]), ue = {
  name: "tagItem",
  components: {
    // element ui
    ElPopover: Z,
    tagItemLabel: de
  },
  props: {
    tagItem: {
      type: Object,
      default() {
        return {};
      }
    },
    // tag是否可以拖拽
    dragable: {
      type: Boolean,
      default: !0
    },
    // 拖动tag点的回调事件 - 因为需要考虑各种边界条件、因此交由父组件处理
    tagMoveCallback: {
      type: Function,
      default: null
    },
    // 是否关闭 tip，默认显示tip
    closeTip: {
      type: Boolean,
      default: !1
    },
    // 是否显示右侧菜单标记, true：tag后的样式，显示三点，代表有操作菜单，false: 不显示
    showOperateMark: {
      type: Boolean,
      default: !1
    },
    // 是否显示tag选中 - false 不会显示选中效果
    showSelected: {
      type: Boolean,
      default: !1
    },
    // tooltip 宽度
    tipWdith: {
      type: [String, Number],
      default: 206
    },
    // 鼠标是否可进入到 tag的 tooltip 中， 同 element plus tooltip enterable -- vue3 甘特图特有属性
    tipEnterable: {
      type: Boolean,
      default: !1
      // 默认不可以进入
    }
  },
  data() {
    return {
      utils: o,
      moving: !1,
      // 正在拖拽盒子
      changeWHing: !1,
      // 正在拖拽点改变宽高
      visibleTip: !1,
      // 解决tag click 与 tag move事件冲突问题
      moved: !1,
      // 前一刻是否移动过 - 用于区分点击事件和move事件
      changeTimer: null
    };
  },
  methods: {
    // 右键菜单
    contextmenuHandle(e) {
      return this.$emit("tagContextmenu", {
        e,
        tagItem: this.tagItem,
        // 其他参数直接回传，父组件不必重新计算
        dragable: this.dragable,
        closeTip: this.closeTip,
        showOperateMark: this.showOperateMark
      }), o.oncontextmenuDisabled(e);
    },
    tagBlur() {
      this.$emit("tagBlur");
    },
    // 因为点击tag 会触发mousedown，mouseup，但不会触发mousemove，因此可以利用这点来区分点击还是拖动
    clickHandle(e) {
      this.moving || this.moved || this.$emit("tagClick", {
        e,
        tagItem: this.tagItem,
        // 其他参数直接回传，父组件不必重新计算
        dragable: this.dragable,
        closeTip: this.closeTip,
        showOperateMark: this.showOperateMark
      });
    },
    // 获取到浏览器左上角的距离
    getToContainerXY(e) {
      return {
        x: e.x || e.pageX,
        y: e.y || e.pageY
      };
    },
    // 添加移除鼠标事件
    addRemoveMouseEvent(e) {
      let t = (l) => {
        e && e(l);
      }, i = () => {
        window.removeEventListener("mousemove", t), window.removeEventListener("mouseup", i), this.changeChangeWHing(!1), this.changeMoveing(!1), this.$emit("changeEnd");
      };
      window.addEventListener("mousemove", t, !1), window.addEventListener("mouseup", i, !1);
    },
    // changeTageItem(obj = {}) {
    //   this.$emit('change', mergeObj({
    //     ...this.tagItem
    //   }, obj))
    // },
    changeChangeWHing(e = !1) {
      this.changeWHing = e;
    },
    changeMoveing(e = !1) {
      this.moving = e, this.moving && this.showTagTip(!1);
    },
    moveBox(e) {
      if (e && +e.button == 2 || !this.dragable || this.changeWHing) return;
      let t = N(this.tagItem);
      this.changeMoveing(!0), this.$emit("tagDragStart", {
        tagItem: this.tagItem
      });
      let i = ne(this.$refs.dragBoxRef), l = 0, s = 0;
      if (i) {
        let n = i.getBoundingClientRect();
        l = n.left, s = n.top;
      }
      let a = this.$refs.dragBoxRef.offsetLeft, g = this.$refs.dragBoxRef.offsetTop, { x: f, y: r } = this.getToContainerXY(e), h = f - a - l, d = r - g - s;
      this.addRemoveMouseEvent((n) => {
        let { x: u, y: m } = this.getToContainerXY(n), y = i.getBoundingClientRect(), x = y.left, v = y.top, D = u - h - x, H = m - d - v;
        this.tagMoveCallback && this.tagMoveCallback(
          n,
          // 鼠标event
          {
            tagItemDom: this.$refs.dragBoxRef,
            // 当前拖动的tag dom
            tagItemOld: t,
            // 当前拖动前的item
            tagItem: this.tagItem,
            // 当前拖动的item
            left: D,
            // 拖动盒子现在的left 像素
            top: H,
            // 拖动盒子现在的top 像素
            toBox_X: h,
            toBox_Y: d
          }
        ), this.moved = !0, clearTimeout(this.changeTimer), this.changeTimer = setTimeout(() => {
          this.moved = !1;
        }, 500);
      });
    },
    showTagTip(e = !1) {
      this.moving ? this.visibleTip = !1 : this.visibleTip = e;
    }
  },
  mounted() {
  },
  beforeDestroy() {
    clearTimeout(this.changeTimer);
  }
};
function ce(e, t, i, l, s, a) {
  const g = I("tagItemLabel"), f = I("el-popover");
  return T(), p("div", {
    class: B([
      "tagItem",
      s.moving ? "moving" : "",
      this.dragable ? "dragable" : "",
      i.showSelected && i.tagItem.selected ? "selected" : ""
    ]),
    style: w(i.tagItem.style),
    onMousedown: t[4] || (t[4] = k((...r) => a.moveBox && a.moveBox(...r), ["stop"])),
    ref: "dragBoxRef",
    onContextmenu: t[5] || (t[5] = k((...r) => a.contextmenuHandle && a.contextmenuHandle(...r), ["stop"])),
    onClick: t[6] || (t[6] = k((...r) => a.clickHandle && a.clickHandle(...r), ["stop"])),
    tabindex: "-2",
    onBlurCapture: t[7] || (t[7] = (...r) => a.tagBlur && a.tagBlur(...r))
  }, [
    i.closeTip ? (T(), p("span", {
      key: 0,
      class: B(["tagLabel", i.tagItem.className])
    }, [
      L(g, {
        "tag-item": i.tagItem,
        showOperateMark: i.showOperateMark
      }, null, 8, ["tag-item", "showOperateMark"])
    ], 2)) : (T(), Q(f, {
      key: 1,
      "popper-class": "ganTTTagTip",
      placement: "right",
      width: i.tipWdith,
      visible: s.visibleTip,
      "onUpdate:visible": t[3] || (t[3] = (r) => s.visibleTip = r),
      "show-arrow": !1,
      offset: 0,
      enterable: i.tipEnterable
    }, {
      reference: C(() => [
        c("span", {
          class: B(["tagLabel", i.tagItem.className]),
          onPointerenter: t[0] || (t[0] = (r) => a.showTagTip(!0)),
          onPointermove: t[1] || (t[1] = (r) => a.showTagTip(!0)),
          onPointerleave: t[2] || (t[2] = (r) => a.showTagTip(!1))
        }, [
          L(g, {
            "tag-item": i.tagItem,
            showOperateMark: i.showOperateMark
          }, null, 8, ["tag-item", "showOperateMark"])
        ], 34)
      ]),
      default: C(() => [
        J(e.$slots, "tagTip", { tagData: i.tagItem }, () => [
          W(b(i.tagItem.label), 1)
        ], !0)
      ]),
      _: 3
    }, 8, ["width", "visible", "enterable"]))
  ], 38);
}
const me = /* @__PURE__ */ E(ue, [["render", ce], ["__scopeId", "data-v-dd4eeaa7"]]), Te = {
  name: "yTimeLine",
  props: {
    visible: {
      type: Boolean,
      default: !1
    },
    left: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: "时间线"
    },
    // 颜色
    color: {
      type: String,
      default: "#000000"
    }
  },
  data() {
    return {};
  }
};
function pe(e, t, i, l, s, a) {
  return A((T(), p("div", {
    class: "timeLine",
    style: w({ left: i.left })
  }, [
    c("span", {
      class: "timeBox",
      style: w({ backgroundColor: i.color })
    }, [
      c("i", {
        style: w({ borderTopColor: i.color })
      }, null, 4),
      W(" " + b(i.title), 1)
    ], 4),
    c("span", {
      class: "line",
      style: w({ borderLeftColor: i.color })
    }, null, 4)
  ], 4)), [
    [X, i.visible]
  ]);
}
const we = /* @__PURE__ */ E(Te, [["render", pe], ["__scopeId", "data-v-cab0e786"]]);
let S;
const O = 4, ye = 28, _ = 28, V = 5, De = 100;
let Y = 2;
const P = 2 * O + Math.min(_, ye);
Y = Y < 0 ? 1 : Y;
let j = 2 * O + Y * _ + (Y - 1) * V;
j = Math.max(j, P);
const be = {
  name: "gantt-chart-vue3",
  // model: {
  //   prop: 'markLineTime',
  //   event: 'changeMarkLineTime'
  // },
  components: {
    // element ui
    ElButton: ee,
    ElDialog: te,
    ElDatePicker: ie,
    tagItem: me,
    yTimeLine: we
  },
  props: {
    // 是否只读，最高优先级，禁用所有编辑功能，如拖拽，右键菜单等
    readOnly: {
      type: Boolean,
      default: !1
    },
    // 禁用行是否不触发事件，tag不可拖动到禁用行，不触发右键菜单 true：禁止拖入 false：可以拖入
    disabledRowSilent: {
      type: Boolean,
      default: !1
    },
    // 是否显示tag选中 - false 不会显示选中效果
    showSelected: {
      type: Boolean,
      default: !1
    },
    /*
     是否开启甘特图高度自适应：
     true：限定在父级设置的高度范围内，超出将显示纵向滚动条，如果父容器未设置高度，将以初始渲染的高度为准，后续都限定在此高度范围内
     false：甘特图自动撑开，特别注意父容器不要设置高度！！！
    */
    selfAdaptionGanTTHeight: {
      type: Boolean,
      default: !0
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
        ];
      }
    },
    // 甘特图标题
    title: {
      type: String,
      // required: true,
      default: "甘特图"
    },
    // 初始显示的甘特图列开始时间
    startDate: {
      type: String,
      // required: true,
      default: "2023/12/01"
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
      validator: function(e) {
        return e >= 0;
      }
    },
    // 除了dateDuration任务持续时间，当tag横向拖动到右边界时，可以往后几天时间
    IncreaseDayNum: {
      type: Number,
      default: 0,
      validator: function(e) {
        return e >= 0;
      }
    },
    // 列-时间显示成的格式
    timeFormat: {
      type: String,
      default: "YYYY-MM-DD"
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
        ];
      }
    },
    // 是否显示标线 - 只读模式下标线功能未禁止
    showMarkLine: {
      type: Boolean,
      default: !1
    },
    markLineTime: {
      // 标记线对应的时间
      type: String,
      default: ""
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
        ];
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
        ];
      }
    },
    // tag拖拽结束是否显示时间选择框
    dragTagEndShowTimeDialog: {
      type: Boolean,
      default: !1
    },
    // tag拖动的避让效果，只是单纯显示，原理: 修改translateX(x)，这样不会对原始数据造成影响
    //【注意!!!：开启此功能后，将导致某些tag含有translateX 偏移，从而让甘特图表现异常-正确用法时每次拖动结束【比如调接扣计算】，然后重新渲染整个甘特图】
    openTagMoveDodgeAnimate: {
      type: Boolean,
      default: !1
    },
    // tooltip 宽度
    tipWdith: {
      type: [String, Number],
      default: 206
    },
    // 鼠标是否可进入到 tag的 tooltip 中， 同 element plus tooltip enterable -- vue3 甘特图特有属性
    tipEnterable: {
      type: Boolean,
      default: !1
      // 默认不可以进入
    },
    // 样式部分 >>
    // 甘特图背景色
    ganttBgColor: {
      type: String,
      default: "#ffffff"
    },
    // 停用行-背景色
    disabledBgColor: {
      type: String,
      default: "#ececec"
    },
    // 画布左侧 “类目列” 宽
    paintLeft: {
      type: String,
      default: "80px"
    },
    // 画布顶部 “时间列” 高
    paintTop: {
      type: String,
      default: "40px"
    },
    // 网格线的颜色
    gridLineColor: {
      type: String,
      default: "#dddddd"
    }
    // 样式部分 <<
  },
  data() {
    return {
      rowMinRowHeight: P + "px",
      ganTTBottomHeight: 0,
      // 底部剩余最大高度 - 用于 自适应高度 功能
      utils: o,
      isFirstInit: !0,
      // 是否初次渲染
      scrolledXPercent: 0,
      // 记录横向滚动的百分比 - 甘特图resize后需要保证横向滚动百分比不变，也就是之前列从哪里开始的，resize后也从哪里开始  
      // 防抖
      tickTimer: null,
      scrollTimer: null,
      rowsInfo: [],
      // 行信息
      colsInfo: [],
      // 列信息
      // 画布内拖拽区域
      paintBoxInfo: {
        width: 0,
        height: 0
      },
      tagList: [],
      // 画布中的tag
      // 正在拖拽的信息
      draging: {
        tagItemOld: {},
        // 拖拽前tag Data
        tagItem: {},
        // 拖拽的tag Data
        tagItemDom: null,
        // 拖拽的tag Dom
        left: 0,
        top: 0
      },
      historyDraging: {
        // 存储上次拖拽的信息，用于优化交互效果
        left: null,
        top: null
      },
      dodgeTagsInfo: {},
      // 格式为：{tagId:translateX(xx)} 存储避让的tag信息，拖拽结束先显示避让后的效果
      // 移动tag时显示的，纵向时间线
      movingTimeLine: {
        visible: !1,
        left: "0px",
        title: "",
        color: "#000000"
      },
      // 点击图时显示的时间线
      markLine: {
        visible: !1,
        left: "0px",
        title: "",
        color: "red"
      },
      // 显示当前时间的时间线
      currentTimeLine: {
        visible: !1,
        left: "0px",
        title: "",
        color: "#000000"
      },
      tickCurrentTimer: null,
      // 定时获取当前时间的定时器
      // 右键菜单相关
      rightMenuTemObj: {},
      // 左侧任务列操作菜单相关
      taskMenu: {
        visible: !1,
        btnList: [],
        // 操作按钮
        selectRow: {},
        // 选中行
        style: {
          left: "0px",
          top: "0px"
        }
      },
      // tag右键操作菜单
      tagMenu: {
        visible: !1,
        btnList: [],
        // 操作按钮
        selectTag: {},
        // 选中行
        style: {
          left: "0px",
          top: "0px"
        }
      },
      autoCloseTagMenu: !0,
      // 是否自动关闭tag右键菜单 - 因为事件冲突，默认tag失去焦点时关闭tag菜单。两种情况除外 1.点击其tag menu 2.打开其他tag menu
      // tag时间选择
      tagTimeDialog: {
        visible: !1,
        timeRange: [],
        tag: {}
        // 需要修改的tag
      },
      pickerOptions: {
        shortcuts: [{
          text: "最近一周",
          onClick(e) {
            const t = /* @__PURE__ */ new Date(), i = /* @__PURE__ */ new Date();
            i.setTime(i.getTime() - 3600 * 1e3 * 24 * 7), e.$emit("pick", [i, t]);
          }
        }, {
          text: "最近一个月",
          onClick(e) {
            const t = /* @__PURE__ */ new Date(), i = /* @__PURE__ */ new Date();
            i.setTime(i.getTime() - 3600 * 1e3 * 24 * 30), e.$emit("pick", [i, t]);
          }
        }, {
          text: "最近三个月",
          onClick(e) {
            const t = /* @__PURE__ */ new Date(), i = /* @__PURE__ */ new Date();
            i.setTime(i.getTime() - 3600 * 1e3 * 24 * 90), e.$emit("pick", [i, t]);
          }
        }]
      }
    };
  },
  watch: {
    // 行列数据和甘特图有强关联，数据改变需要重新渲染
    rows: {
      handler() {
        console.log("ganTT rows change..."), this.init();
      },
      deep: !0
    },
    startDate: {
      handler() {
        this.init();
      }
    },
    dateDuration: {
      handler() {
        this.init();
      }
    },
    decreaseDayNum: {
      handler() {
        this.init();
      }
    },
    IncreaseDayNum: {
      handler() {
        this.init();
      }
    },
    // #region 标记线逻辑
    // 标记线
    showMarkLine: {
      handler() {
        this.showAxisTime(this.markLineTime);
      }
    },
    // 标记时间
    markLineTime: {
      handler() {
        this.showAxisTime(this.markLineTime);
      }
    }
    //#endregion 标记线逻辑
  },
  computed: {
    // 标题宽
    paintLeftVal() {
      return +o.delValUnit(this.paintLeft);
    },
    // 标题高
    paintTopVal() {
      return +o.delValUnit(this.paintTop);
    }
  },
  methods: {
    /**
     * 在画布盒子中的宽 - 像素px 转为 百分比
     * @param {*} pxw 像素宽
     * @param {*} repair 是否在后面补百分号
     */
    reW(e, t = !0) {
      let i = (Number(e || 0) / o.getDOMWH(this.$refs.paintBoxRefDom).w * 100).toFixed(2);
      return t ? `${i}%` : i;
    },
    /**
     * 在画布盒子中的高 - 像素px 转为 百分比
     * @param {*} pxH 像素高
     * @param {*} repair 是否在后面补百分号
     */
    reH(e, t = !0) {
      let i = (Number(e || 0) / o.getDOMWH(this.$refs.paintBoxRefDom).h * 100).toFixed(2);
      return t ? `${i}%` : i;
    },
    /**
     * 将时间(毫秒)转为最小时间粒度 - 现在甘特图是以分钟为粒度，后面需要扩展再说
     * @param {*} time 具体时间或者时间戳差值
     * @param {*} isTimeStap time是否是时间戳
     */
    dealTime(e, t = !1) {
      let i = e;
      return t || (i = new Date(e).getTime()), i / 1e3 / 60;
    },
    // 将最小时间粒度转为毫秒
    dealTimeToMs(e) {
      return e * 60 * 1e3;
    },
    // 整个甘特图的时间范围
    getGanTTimeRange() {
      if (this.colsInfo.length <= 0) return null;
      let e = (/* @__PURE__ */ new Date(`${this.colsInfo[0].label} 00:00:00`)).getTime(), t = (/* @__PURE__ */ new Date(`${this.colsInfo[this.colsInfo.length - 1].label} 23:59:59`)).getTime();
      return {
        startTime: e,
        endTime: t
      };
    },
    // 获取横向 1px 对应的最小时间粒度【分钟】
    getPxOfTimeParticle() {
      let e = this.$refs.paintBoxRefDom;
      if (this.colsInfo.length <= 0 || !e) return !1;
      let { startTime: t, endTime: i } = this.getGanTTimeRange();
      return ((i - t) / 1e3 / 60).toFixed(0) / o.getDOMWH(e).w;
    },
    // 将时间差 - 毫秒时间戳 转为 在甘特图【.box-paint】中的横向距离
    timeStampGapToInfeedDistance(e) {
      let t = this.dealTime(e, !0);
      return Number(t / this.getPxOfTimeParticle()).toFixed(6);
    },
    /**
     * 将left 转为 横向的时间维度
     * @param {*} left 距离 paintBoxRefDom 画布左侧距离
     * @param {*} startTime 开始时间，默认任务开始时间
     */
    getStartTimeByLeft(e = 0, t) {
      if (this.colsInfo.length <= 0) return !1;
      t = new Date(t).getTime() || (/* @__PURE__ */ new Date(`${this.colsInfo[0].label} 00:00:00`)).getTime();
      let i = this.dealTimeToMs(e * this.getPxOfTimeParticle());
      return o._date.format(t + i, "YYYY/MM/DD HH:mm:ss");
    },
    /**
     * 将在画布中的时间转为在 paintBoxRefDom 画布中的left
     * @param {*} time 画布中的时间
     */
    getLeftByStartTime(e = "") {
      if (!e) return 0;
      if (this.colsInfo.length <= 0) return !1;
      let t = this.dealTime(`${this.colsInfo[0].label} 00:00:00`);
      if (e < t)
        return console.error("开始时间小于甘特图任务开始时间"), !1;
      let i = this.dealTime(e), l = this.getPxOfTimeParticle();
      return Number((i - t) / l).toFixed(6);
    },
    /**
    * 将画布【paintBoxRefDom】中的left 转为在甘特图【ganttBoxRefDom】中的left
    * @param {*} left
    */
    canvasLeftToGanTTLeft(e) {
      return +e - this.getScrollLeft() + this.paintLeftVal;
    },
    /**
     * 甘特图【ganttBoxRefDom】中的left 转为 画布【paintBoxRefDom】中的left
     * @param {*} left 
     */
    ganTTLeftToCanvasLeft(e) {
      return +e - this.paintLeftVal + this.getScrollLeft();
    },
    // #region 计算落点位置
    /**
     * 在box-paint 盒子中的像素坐标转数据坐标
     * @param {*} x paintBoxRefDom 中该点的像素坐标x
     * @param {*} y paintBoxRefDom 中该点的像素坐标y
     * @returns
     */
    pixelToDataCoordinate(e, t) {
      let i = this.getRowIndexByTop(t);
      return {
        x: e,
        y: t,
        // 横纵坐标
        coords: [
          this.getStartTimeByLeft(e),
          i > -1 ? this.rowsInfo[i].label : null
        ]
      };
    },
    /**
     * 生成禁用行对应的纵坐标数组
     * @return {min:number,max:number}[]
     */
    getDisabledYS() {
      let e = 0, t = [];
      return this.rowsInfo.map((i) => {
        i.disabled && t.push({
          min: e,
          // 起点y
          max: e + i.h
          // 终点y
        }), e += i.h;
      }), t;
    },
    // 获取指定行索引前的第一个非禁用行索引
    getPreNoDisabledRowIndex(e = 0) {
      let t = this.rowsInfo, i = e - 1;
      if (i < 0) return -1;
      for (; i >= 0 && t[i].disabled; i--)
        ;
      return i < 0 ? -1 : i;
    },
    // 获取指定行索引后的第一个非禁用行索引
    getNextNoDisabledRowIndex(e = 0) {
      let t = this.rowsInfo, i = e + 1;
      if (i >= this.rowsInfo.length) return -1;
      for (; i < t.length && t[i].disabled; i++)
        ;
      return i >= this.rowsInfo.length ? -1 : i;
    },
    // 判断指定的纵向 画布内y（像素）是否在禁用行中
    judgeYisInDisabledRow(e) {
      let t = this.getDisabledYS();
      for (let i = 0; i < t.length; i++) {
        let { min: l, max: s } = t[i];
        if (e >= l && e <= s)
          return !0;
      }
      return !1;
    },
    // 根据tag距离画布顶部的top值匹配其所在行索引-注意是往下的，比如刚好等于第一行高，那么rowindex应该是2
    getRowIndexByTop(e = 0) {
      let t = 0, i = this.rowsInfo, l = 0;
      for (let s = 0; s < i.length; s++) {
        let a = i[s];
        if (t += a.h, e < t) {
          l = s;
          break;
        }
      }
      return l;
    },
    //根据rowsInfo中的行索引，返回其top值
    getTopByRowIndex(e = 0) {
      let t = 0, i = this.rowsInfo;
      for (let l = 0; l < i.length; l++) {
        let s = i[l];
        if (e === l)
          break;
        t += s.h;
      }
      return t;
    },
    // #endregion 计算落点位置
    //#region tag 相关
    /**
     * 获取当前tag是否可以拖动
     * 拖动优先级为：
     * @param {*} tag 
     */
    tagItemDragable(e = {}) {
      return !e || !Object.keys(e).length || this.readOnly ? !1 : o.isNull(e.dragable) ? !!this.getLegendConfig(e).dragable : e.dragable;
    },
    /**
     * 获取当前tag是否应该关闭tip提示
     * tip 显示的优先级为：当前tag 设置的closeTip > 当前tag对应legend设置的closeTip > 最后都没设置的默认显示tip
     * @param {*} tag 
     */
    tagItemCloseTip(e = {}) {
      if (!e || !Object.keys(e).length) return;
      let t = this.getLegendConfig(e), i = o.isNull(t.closeTip);
      return o.isNull(e.closeTip) ? i ? !1 : t.closeTip : e.closeTip;
    },
    // 判断tag是否有操作菜单
    tagHasOperateMenu(e) {
      let t = this.getLegendConfig(e);
      return t.btnList && t.btnList.length > 0;
    },
    // 获取tag 对应 legend的配置
    getLegendConfig(e) {
      return this.legend.find((t) => t.type == e.type) || {};
    },
    // 获取 row 中的所有tag集合,返回对象格式如： {type:[tag1, tag2,...],type2:[tag1, tag2,...]}
    getTagsMapByRowItem(e = {}) {
      if (!e || !Object.keys(e).length) return {};
      let t = {};
      return (e.tags || []).map((l) => {
        t[l.type] || (t[l.type] = []), t[l.type].push(l);
      }), t;
    },
    // 根据起止时间计算 在甘特图中 tag的宽和left值,注意：参数起止时间必须是完整时间 如：2023/10/04 02:10:00
    calcTagLeftAndWidth(e, t) {
      if (!e || !t) return null;
      if (this.colsInfo.length <= 0) return !1;
      let i = this.dealTime(`${this.colsInfo[0].label} 00:00:00`);
      if (e < i)
        return console.error("开始时间小于甘特图任务开始时间"), !1;
      let l = this.dealTime(e), a = this.dealTime(t) - l;
      if (a < 0)
        return console.error("开始时间要小于结束时间"), null;
      let g = this.getPxOfTimeParticle();
      return {
        left: Number((l - i) / g).toFixed(6) + "px",
        width: Number(a / g).toFixed(6) + "px"
      };
    },
    /**
     * 根据所属行的label，与tag的类型来计算tag的 top、高度
     * @param {*} parentKey tag所在行label
     * @param {*} tagType tag对应的legend 类型
     */
    calcTagTopAndHeight(e, t) {
      return {
        top: this.calcTagOffsetCanvasTop(e, t) + "px",
        // top: top + 'px',
        height: _ + "px"
        // tag 高度固定
      };
    },
    /**
     * 新增tag节点
     * @param {*} tagItem tag节点
     * @param {*} rowParent 所在行
     * @return boolean 操作成功 | 失败
     */
    addTag(e = {}, t = {}) {
      if (!e || !Object.keys(e).length || !t || !Object.keys(t).length) return !1;
      let i = this.factoryTag(e, t);
      return this.tagList.push(i), this.tagChangThenRefreshAll(), !0;
    },
    /**
     * 修改tag节点
     * @param {*} tagId 生成的甘特图tag唯一id
     * @param {*} newTagItem 修改后的tag
     * @param {*} refreshGTT 修改tag后是否需要刷新甘特图，不涉及宽高计算变化的可以不调用刷新，提高性能
     * @return boolean 操作成功 | 失败
     */
    updateTag(e, t, i = !0) {
      return e ? (this.tagList = this.tagList.map((l) => l.tagId === e ? {
        ...t,
        // 重新计算时间差
        timeStampDiffer: new Date(t.endTime).getTime() - new Date(t.startTime).getTime()
        // 开始时间与结束时间的时间差 - tag 拖动时需要保证时间差不变
      } : l), this.backfillTagListToRowsInfo(), i && this.refreshGTTWH(), !0) : !1;
    },
    /**
     * 删除tag节点
     * @param {*} tagId 生成的甘特图tag唯一id
     * @return boolean 操作成功 | 失败
     */
    deleteTag(e) {
      return e ? (this.tagList = this.tagList.filter((t) => t.tagId !== e), this.tagChangThenRefreshAll(), !0) : !1;
    },
    /**
     * tag 移动前
     *  */
    tagDragStart(e = {}) {
      this.$emit("tagDragStart", e);
    },
    /**
     * tag 位置移动结束
     * 甘特图的移动结束只是为了确定当前left，top所在行（label），列（开始、结束时间）信息，更新后走渲染逻辑即可
     */
    tagChangeEnd() {
      let { tagItemOld: e, tagItem: t, tagItemDom: i, left: l, top: s } = this.draging, a = s, g = this.rowsInfo.map((h) => ({
        label: h.label,
        h: h.h
      }));
      if (this.disabledRowSilent) {
        if (this.rowsInfo.filter((d) => d.disabled).length === this.rowsInfo.length) return;
        if (t && t.style) {
          let d = this.getDisabledYS(), n = 0, u = a;
          o.getDOMWH(this.$refs.paintBoxRefDom).h;
          let m = o.getDOMWH(i).h;
          for (; n !== d.length; ) {
            n = 0;
            for (let y = 0; y < d.length; y++) {
              n++;
              let { max: x, min: v } = d[y];
              if (q({
                disabledYMin: v,
                // 禁用行Y最小值
                disabledYMax: x,
                // 禁用行Y最大值
                tagHeight: m,
                // tag 的高度
                tagTop: u
                // tag 的css top值
              })) {
                n = 0;
                let D = 0, H = this.getRowIndexByTop(u);
                u > v || u === 0 ? (D = this.getNextNoDisabledRowIndex(H), D < 0 && (D = this.getPreNoDisabledRowIndex(H))) : (D = this.getPreNoDisabledRowIndex(H + 1), D < 0 && (D = this.getNextNoDisabledRowIndex(H + 1))), u = this.getTopByRowIndex(D);
                break;
              }
            }
          }
          a = u;
        }
      }
      let f = this.getRowIndexByTop(a), r = g[f].label;
      this.tagList.some((h) => {
        if (h.tagId === t.tagId)
          return h.parentKey = r, h.startTime = this.getStartTimeByLeft(l), h.endTime = o._date.format(new Date(h.startTime).getTime() + h.timeStampDiffer, "YYYY/MM/DD HH:mm:ss"), !0;
      }), this.tagChangThenRefreshAll(), this.$emit("tagDragEnd", {
        ...this.draging
      }), this.dragTagEndShowTimeDialog && this.draging.tagItemDom && this.openTagTimeDialog(this.draging.tagItem), this.draging.tagItemOld = {}, this.draging.tagItem = {}, this.draging.tagItemDom = null, this.historyDraging = {
        left: null,
        top: null
      }, this.clearGuideLine();
    },
    //#region tag 拖动避让效果
    /**
     * tag避让
     * @param {*} preTagItem 前一个tag
     * @param {*} nextTags 前一个tag后面的所有tag -- 即可能需要加上避让效果的tags
     */
    dodgeTag(e = {}, t = []) {
      if (!e || !Object.keys(e).length || !t || !t.length) return;
      let i = e._dodge;
      i ? i.startTime : new Date(e.startTime).getTime();
      let l = i ? i.endTime : new Date(e.endTime).getTime(), s = t[0], a = new Date(s.startTime).getTime(), g = new Date(s.endTime).getTime(), f = l - a;
      f > 0 && (s.style.transform = `translateX(${this.timeStampGapToInfeedDistance(f)}px)`, s._dodge = {
        startTime: a + f,
        endTime: g + f
      }, this.dodgeTagsInfo[s.tagId] = s.style.transform);
      let r = t.slice(1);
      r.length && this.dodgeTag(s, r);
    },
    /**
     * 去掉指定_tagItem的避让效果
     * @param {*} _tagItem 
     */
    clearTagDodge(e) {
      e.style.transform = "translateX(0)", delete e._dodge;
    },
    // 拖动tag时当前行后面的tag有避让效果
    tagMoveDodgeAnimate(e = {}) {
      if (!this.openTagMoveDodgeAnimate || !e || !Object.keys(e).length) return;
      let t = o.delValUnit(e.style.left), i = o.delValUnit(e.style.top), l = this.getStartTimeByLeft(t), s = o._date.format(new Date(l).getTime() + e.timeStampDiffer, "YYYY/MM/DD HH:mm:ss"), a = this.getRowIndexByTop(i), g = this.rowsInfo[a].label, r = this.tagList.filter((d) => d.tagId !== e.tagId && d.type === e.type && d.dragable !== !1).filter((d) => d.parentKey === g);
      this.dodgeTagsInfo = {}, this.tagList.map((d) => this.clearTagDodge(d));
      let h = r.filter((d) => new Date(d.startTime).getTime() > new Date(l).getTime());
      h.sort((d, n) => new Date(d.startTime).getTime() - new Date(n.startTime).getTime()), this.dodgeTag({
        ...e,
        startTime: l,
        endTime: s
      }, h);
    },
    //#endregion tag 拖动避让效果
    // tag 拖动事件
    tagMove(e, { tagItemDom: t, tagItemOld: i, tagItem: l, left: s, top: a, toBox_X: g, toBox_Y: f }) {
      if (this.historyDraging.left === null && (this.historyDraging.left = s), this.historyDraging.top === null && (this.historyDraging.top = a), this.clearGuideLine(), this.closeAllMenu("tagMove"), !t) return;
      let r = o.getDOMWH(t).w, h = o.getDOMWH(t).h;
      if (this.disabledRowSilent) {
        let n = this.getDisabledYS();
        if (n.length === this.rowsInfo.length) return;
        let u = !1;
        n.map(({ max: m, min: y }) => {
          q({
            disabledYMin: y,
            // 禁用行Y最小值
            disabledYMax: m,
            // 禁用行Y最大值
            tagHeight: h,
            // tag 的高度
            tagTop: a
            // tag 的css top值
          }) && (u = !0);
        }), u ? t.style.cursor = "not-allowed" : t.style.cursor = "move";
      }
      let d = re({
        contentDom: this.$refs.paintBoxRefDom,
        // 边界盒子dom
        dragDom: t,
        // 拖拽的盒子dom
        left: s,
        top: a
      });
      s = d.left, a = d.top;
      {
        let n = s - this.historyDraging.left, u = a - this.historyDraging.top, m = this.getScrollLeft();
        this.getTimeColW();
        let y = o.getDOMWH(this.$refs.boxRightRefDom).w;
        n < 0 && s < m ? this.scrollGanTTXTo(s) : n > 0 && s + r > y + m && this.scrollGanTTXTo(m + (s + r - y - m));
        let x = this.getScrollTop(), v = o.getDOMWH(this.$refs.boxRightRefDom).h;
        u < 0 && a < x ? this.scrollGanTTYTo(a) : u > 0 && a + h > v + x && this.scrollGanTTYTo(x + (a + h - v - x));
      }
      l.style.left = s + "px", l.style.top = a + "px", this.tagMoveDodgeAnimate(l), this.draging = {
        tagItemOld: i,
        // 拖拽前tag Data
        tagItem: l,
        // 拖拽的tag Data
        tagItemDom: t,
        // 拖拽的tag Dom
        left: s,
        top: a
      }, this.historyDraging = {
        left: s,
        top: a
      }, this.drawMoveGuideLineY(s, a);
    },
    // 构造原始甘特图中的tag格式，最终提供给外部使用 - 注意：tagId 是甘特图内增删改的唯一标志，每次init()后,tagid将更新
    backfillTag(e = {}) {
      return {
        ...e.data || {},
        // tag数据，这部分属性以当前tag为准
        tagId: e.tagId,
        // 生成唯一id
        startTime: e.startTime || "",
        // tag 对应开始时间
        endTime: e.endTime || "",
        // tag 对应结束时间
        label: e.label || "甘特图 tag",
        // tag上显示的文本
        type: e.type || "",
        // 所属legend
        closeTip: e.closeTip,
        // 关闭tip
        dragable: e.dragable,
        // 是否可以拖动，注意：只有true|false才取这个，代表是配置了的,undefined 等代表未配置，默认是可以拖动的
        className: e.className,
        // 自定义tag 样式名
        selected: e.selected,
        // 当前tag是否选中-有选中样式
        preIcon: e.preIcon,
        // tag前的图标
        hide: e.hide
        // 是否隐藏此tag
      };
    },
    /**
     * tag 构造
     * @param {*} tagItem tag节点
     * @param {*} rowParent 所在行
     * @return {} tag 对象
     */
    factoryTag(e = {}, t = {}) {
      let i = this.backfillTag(e), l = {
        data: e,
        // 存储原始数据
        // 其他属性用于辅助交互
        parentKey: t.label || "",
        // 记录所属父节点 - 行
        ...i,
        tagId: i.tagId || `tag-${(/* @__PURE__ */ new Date()).getTime()}-${se()}`,
        // 生成唯一id
        timeStampDiffer: new Date(e.endTime).getTime() - new Date(e.startTime).getTime(),
        // 开始时间与结束时间的时间差 - tag 拖动时需要保证时间差不变
        style: {
          // css
          top: 0,
          width: "auto",
          left: 0,
          height: _ + "px",
          // 默认高度
          transform: "translateX(0)"
          // 用于实现拖拽避让动画
        }
      };
      this.dodgeTagsInfo[l.tagId] && (l.style.transform = this.dodgeTagsInfo[l.tagId]);
      let s = this.calcTagLeftAndWidth(l.startTime, l.endTime);
      s && (l.style.left = s.left, l.style.width = s.width);
      let a = this.calcTagTopAndHeight(l.parentKey, l.type);
      return a && (l.style.top = a.top, l.style.height = a.height), l;
    },
    // 生成tag一维数据
    createTagList() {
      let e = [];
      this.rowsInfo.map((t) => {
        let i = (t.tags || []).map((l) => this.factoryTag(l, t));
        e = e.concat(i);
      }), this.tagList = e, this.verticalTag();
    },
    // 垂直居中tag 【原理：修改每个tag的top值实现】 - 前提是 this.rowsInfo 计算完成！
    verticalTag() {
      let e = {};
      this.tagList.map((l) => {
        let s = +o.delValUnit(l.style.top);
        e[l.parentKey] || (e[l.parentKey] = s), s > e[l.parentKey] && (e[l.parentKey] = s);
      });
      let t = 0, i = O;
      this.rowsInfo.map((l) => {
        let s = l.label, a = +l.h;
        o.isNull(e[s]) || (e[s] = t + a - Number(e[s]) - _ - i), t += l.h;
      }), this.tagList.map((l) => {
        o.isNull(e[l.parentKey]) || (l.style.top = +o.delValUnit(l.style.top) + Number((e[l.parentKey] / 2 || 0).toFixed(4)) + "px");
      });
    },
    // 将taglist回填到rowsInfo中，新增、删除、修改tag“完成后“需要调用此方法，以保证rowsInfo 与 tagList数据同步
    // 注意：只修改数据，但不会影响宽高改变的，不需要再调用刷新方法
    backfillTagListToRowsInfo() {
      this.rowsInfo = this.rowsInfo.map((e) => ({
        ...e,
        tags: this.tagList.filter((t) => t.parentKey === e.label).map((t) => this.backfillTag(t))
      }));
    },
    //#endregion tag 相关
    //#region tag 时间选择,更改tag的开始结束时间
    //【因为粒度没办法精确到1px - 1分钟程度，只能用户手动矫正，
    //特别注意：tag渲染是将时间维度转为像素的，时间是肯定不会不在渲染过程被修改，只要不去拖动，那就一定是设定的时间】
    closeTagTimeDialog() {
      this.tagTimeDialog.visible = !1, this.$emit("closeTagTimeDialog");
    },
    // 确定
    confirmTagTimeDlaiog() {
      let e = this.tagTimeDialog.tag, t = this.tagTimeDialog.timeRange;
      if (!t || !t.length || !t[0] || !t[1]) return $({
        message: "请选择时间",
        type: "warning"
      });
      let i = t[0], l = t[1];
      if (new Date(i).getTime() > new Date(l).getTime()) return $({
        message: "开始时间应小于结束时间",
        type: "warning"
      });
      this.updateTag(e.tagId, {
        ...e,
        startTime: i,
        endTime: l
      }), this.closeTagTimeDialog();
    },
    openTagTimeDialog(e = {}) {
      if (!e || !Object.keys(e).length) return;
      let { startTime: t, endTime: i } = e;
      !t || !i || (this.tagTimeDialog.tag = e, this.tagTimeDialog.timeRange = [t, i], this.tagTimeDialog.visible = !0);
    },
    //#endregion tag 时间选择
    //#region tag 选中
    // 点击
    tagClickHandle(e) {
      if (this.readOnly) return;
      let { e: t, tagItem: i } = e;
      this.$emit("tagClick", {
        e: t,
        // 鼠标e
        tag: i
      });
    },
    // 清空所有tag的选中状态
    clearAllTagSelected() {
      this.tagList.map((e) => {
        e.selected = !1;
      }), this.backfillTagListToRowsInfo();
    },
    //#endregion tag 选中
    //#region tag 右键菜单
    // 失去焦点关闭菜单
    tagblurHandle() {
      this.autoCloseTagMenu = !0, setTimeout(() => {
        if (this && this.tagMenu_close && this.autoCloseTagMenu)
          try {
            this.tagMenu_close();
          } catch (e) {
            console.log("tagblurHandle error：", e);
          }
      }, 400);
    },
    // tag 右键菜单回调
    tagContextmenuHandle(e) {
      this.closeAllMenu("tagContextmenuHandle"), this.autoCloseTagMenu = !1;
      let { tagItem: t, showOperateMark: i } = e;
      if (this.readOnly || !i) return;
      let l = this.getLegendConfig(t), s = t.style, a = +o.delValUnit(s.left), g = +o.delValUnit(s.top), f = +o.delValUnit(s.width), r = +o.delValUnit(s.height), h = 5, d = a + f, n = g;
      this.tagMenu = {
        ...this.tagMenu,
        visible: !0,
        btnList: l.btnList || [],
        // 操作按钮
        selectTag: {
          ...t
        }
        // 选中tag
      }, this.$nextTick(() => {
        let u = this.$refs.tagMenuRefDom, m = this.$refs.paintBoxRefDom;
        if (!m || !u) return;
        let { w: y, h: x } = o.getDOMWH(m), { w: v, h: D } = o.getDOMWH(u);
        d + v + h > y ? d = a - v - h : d = d + h, n + D > x && (n = g - D + r), n = Math.max(n, 0), this.tagMenu = {
          ...this.tagMenu,
          style: {
            left: d + "px",
            top: n + "px"
          }
        };
      }), this.$emit("tagContextmenu", {
        tag: t
      });
    },
    tagMenu_close() {
      this.tagMenu = {
        ...this.tagMenu,
        visible: !1,
        btnList: [],
        selectTag: {}
      };
    },
    /**
    * tag右键操作菜单事件
    * @param {*} e 鼠标e
    * @param {*} menuItem 菜单触发项
    * @param {*} btnIndex 菜单触发索引
    */
    tagMenuBtnClickHandle(e, t, i) {
      this.readOnly || !t || t.disabled || (this.$emit("tagMenuBtnClick", {
        e,
        // 鼠标e
        target: t,
        // 菜单触发项
        triggerIndex: i,
        // 菜单触发索引
        tag: {
          ...this.tagMenu.selectTag
        }
      }), this.tagMenu_close());
    },
    //#endregion tag 右键菜单
    //#region 网格线canvas
    // 画线
    drawGridLine(e, t = [], i = []) {
      !t.length === 2 || !i.length === 2 || (e.beginPath(), e.moveTo(t[0] + 0.5, t[1] + 0.5), e.lineTo(i[0] + 0.5, i[1] + 0.5), e.lineWidth = 1, e.strokeStyle = this.gridLineColor, e.lineCap = "butt", e.stroke());
    },
    // 绘制禁用行
    drawDisabledRow(e) {
      if (!e) return;
      let t = e.getContext("2d"), i = 0, l = 0;
      this.rowsInfo.map((s) => {
        s.disabled && (t.fillStyle = this.disabledBgColor, t.fillRect(i, l, e.width, s.h)), l += s.h;
      });
    },
    // 绘制网格、禁用行背景色
    drawGridCanvas() {
      let e = this.$refs.canvasGridRefDom;
      if (!e) return;
      let t = e.width, i = e.height, l = e.getContext("2d");
      o.clearCanvas(e), this.drawDisabledRow(e);
      {
        let s = this.rowsInfo, a = 0;
        s.map((r, h) => {
          a += r.h, (h !== 0 || h !== s.length - 1) && this.drawGridLine(l, [0, a], [t, a]);
        });
        let g = this.colsInfo, f = 0;
        g.map((r, h) => {
          f += r.w, (h !== 0 || h !== g.length - 1) && this.drawGridLine(l, [f, 0], [f, i]);
        });
      }
      {
        let s = this.$refs.canvasGanttRefDom;
        if (!s) return;
        let a = s.width - 1.2, g = s.height - 1.2, f = s.getContext("2d"), r = {
          leftTop: [0, 0],
          rightTop: [a, 0],
          rightBottom: [a, g],
          // 最后一个，因为+0.5后会超出。因此减去一点
          leftBottom: [0, g]
        };
        this.drawGridLine(f, r.leftTop, r.rightTop), this.drawGridLine(f, r.rightTop, r.rightBottom), this.drawGridLine(f, r.leftBottom, r.rightBottom), this.drawGridLine(f, r.leftTop, r.leftBottom), this.drawGridLine(f, [0, this.paintTopVal], [a, this.paintTopVal]), this.drawGridLine(f, [this.paintLeftVal, 0], [this.paintLeftVal, g]);
        let h = this.$refs.ganttBoxRefDom;
        if (!h) return;
        let d = h.querySelectorAll(".stat-bottom") || [], n = s.height, u = s.width;
        for (let m = d.length - 1; m >= 0; m--) {
          let y = d[m];
          n -= o.getDOMWH(y).h, this.drawGridLine(f, [0, n], [u, n]);
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
    drawMoveGuideLineY(e, t) {
      let i = this.$refs.canvasGuideBoxRefDom;
      if (!i) return;
      i.offsetHeight;
      let l = i.getContext("2d");
      l.setLineDash([5]), l.lineWidth = 1, l.beginPath();
      let s = t;
      l.moveTo(0, s), l.lineTo(e, s), l.strokeStyle = "rgba(0,0,0,0.2)", l.stroke(), e >= this.getScrollLeft() ? this.movingTimeLine = {
        ...this.movingTimeLine,
        visible: !0,
        left: this.canvasLeftToGanTTLeft(e) + "px",
        title: o._date.format(this.getStartTimeByLeft(e), "HH:mm")
      } : this.movingTimeLine.visible = !1;
    },
    // 清除参考线
    clearGuideLine() {
      o.clearCanvas(this.$refs.canvasGuideBoxRefDom), this.movingTimeLine.visible = !1;
    },
    //#endregion 参考线
    //#region 宽高计算
    /**
     * 计算指定tag类型在行内的top，注意是距离当前行顶部的距离
     * @param {*} parentKey 行标志-label
     * @param {*} tagType 行内的哪个类型的tag，也就是legend的类型
     */
    calcTagInRowTop(e, t) {
      if (!e || o.isNull(t)) return 0;
      let l = this.rowsInfo.find((h) => h.label === e), s = this.getTagsMapByRowItem(l), a = _, g = this.legend, f = V, r = 0;
      for (let h = 0; h < g.length; h++) {
        let d = g[h], n = d.type === t;
        if (s[d.type] && !n && (r += f + a), n)
          break;
      }
      return r += O, r;
    },
    /**
     * 计算指定tag类型距离画布顶部的距离
     * @param {*} parentKey 行标志-label
     * @param {*} tagType 行内的哪个类型的tag，也就是legend的类型
     */
    calcTagOffsetCanvasTop(e, t) {
      if (!e || o.isNull(t)) return 0;
      let i = this.calcRowTopByRowLabel(e), l = this.calcTagInRowTop(e, t);
      return i + l;
    },
    /**
     * 通用方法-无副作用
     * 计算 “第几行” 距离 paintBoxRefDom 画布顶部距离 【注意：不包含当前行高度，是当前行顶部距离画布顶部的距离】
     * @param {*} rowIndex 第几行的索引，注意是0开始的
     */
    calcRowTopByRowIndex(e = 0) {
      let t = this.rowsInfo, i = 0;
      for (let l = 0; l < t.length; l++) {
        let s = t[l];
        if (l === e)
          break;
        i += s.h;
      }
      return i;
    },
    /**
     * 根据行label获取当前行距离画布【paintBoxRefDom】顶部的距离
     * @param {*} parentKey 
     */
    calcRowTopByRowLabel(e = "") {
      if (!e) return 0;
      let i = this.rowsInfo.findIndex((s) => s.label === e);
      return i < 0 ? 0 : this.calcRowTopByRowIndex(i);
    },
    /**
     * 通用方法-无副作用 - 注意这里计算的是 “高度自适应” 前的高度，也就是实际高度
     * 计算甘特图对应行的行高 - 即RowsInfo中每行对应的行高，动态计算的，因为tag行是动态的
     * 【注意：这是最小高度】
     * @param {*} rowItem this.rowsInfo 的单项
     * @returns {number} 行高
     */
    calcRowHeightByRowsInfoItem(e = {}) {
      let t = 2 * O, i = this.getTagsMapByRowItem(e), l = Object.keys(i).length;
      return l > 0 && (t += l * _ + (l - 1) * V, t = Math.max(t, j)), Math.max(t, P);
    },
    // 将宽高同步到dom
    renderToDom() {
      let e = this.$refs.ganttBoxRefDom;
      if (!e) return;
      let t = +this.colsInfo.reduce((l, s) => l += Number(s.w), 0), i = +this.rowsInfo.reduce((l, s) => l += Number(s.h), 0);
      this.paintBoxInfo.width = t, this.paintBoxInfo.height = i;
      {
        let l = this.$refs.paintBoxRefDom;
        l.style.width = t + "px", l.style.height = i + "px";
      }
      (e.querySelectorAll(".paint-row") || []).forEach((s, a) => {
        o.setDOMH(s, this.rowsInfo[a].h);
      }), (e.querySelectorAll(".paint-col") || []).forEach((s, a) => {
        o.setDOMW(s, this.colsInfo[a].w);
      });
      {
        let l = this.$refs.ganttBoxRefDom, s = this.$refs.canvasGanttRefDom;
        o.setCanvasWH(s, o.getDOMWH(l).w, o.getDOMWH(l).h);
      }
      {
        let l = this.$refs.canvasGridRefDom;
        o.setCanvasWH(l, t, i);
      }
      {
        let l = this.$refs.canvasGuideBoxRefDom;
        o.setCanvasWH(l, t, i);
      }
    },
    /**
     * 列信息构造
     * @param {*} param0 
     */
    factoryColsInfoItem({ w: e, t }) {
      return {
        w: e,
        // 列宽
        label: o._date.format(t, "YYYY-MM-DD")
        // 时间
      };
    },
    // 计算甘特图每行高度，每列宽度，重要函数，渲染前提是这里的计算正确！！！
    calcWHCore(e = []) {
      (!e || !e.length) && (e = this.rowsInfo);
      let t = this.$refs.headerBoxRefDom;
      if (!t || !t.parentNode) return;
      let i = o.getDOMWH(t).w, l = Math.max(De, (i / this.dateDuration).toFixed(2)), s = Array.from({ length: this.dateDuration }).map((f, r) => this.factoryColsInfoItem({
        w: l,
        t: o._date.add(this.startDate, r, "day")
      }));
      if (s.length > 0) {
        let f = [s[0].label, s.at(-1).label], r = [], h = [], d = Math.abs(+this.decreaseDayNum);
        d > 0 && (r = Array.from({ length: d }).map((u, m) => this.factoryColsInfoItem({
          w: l,
          t: o._date.add(f[0], -1 * (m + 1), "day")
        })));
        let n = Math.abs(+this.IncreaseDayNum);
        n > 0 && (h = Array.from({ length: n }).map((u, m) => this.factoryColsInfoItem({
          w: l,
          t: o._date.add(f[1], m + 1, "day")
        }))), s = [...r.reverse(), ...s, ...h];
      } else
        return console.error("任务持续时间为空！甘特图渲染失败！");
      this.colsInfo = s;
      let a = e.map((f) => ({
        ...f,
        h: +this.calcRowHeightByRowsInfoItem(f)
        // 计算当前行的行高
      }));
      this.rowsInfo = a;
      let g = this.$refs.ganttBoxRefDom;
      if (g) {
        if (this.selfAdaptionGanTTHeight) {
          let { h: f } = o.getDOMWH(g), r = f - this.paintTopVal - this.getSummaryRowsHeight();
          r <= 0 && (r = this.rowsInfo.reduce((d, n) => d + n.h, 0));
          let h = a.reduce((d, n) => d + n.h, 0);
          if (r >= h) {
            let d = 0;
            a.map((u) => {
              u.tags && u.tags.length && d++;
            });
            let n = Number(((r - h) / d).toFixed(6));
            a.map((u) => {
              u.tags && u.tags.length && (u.h = Math.floor(n + u.h));
            });
          }
          this.ganTTBottomHeight = r;
        }
        this.rowsInfo = a;
      }
    },
    // 获取时间标题的单列宽
    getTimeColW() {
      return this.colsInfo.length && this.colsInfo[0].w || 0;
    },
    // 获取任务持续时间范围内的列宽总和
    getDurationTimeWidth() {
      return this.getTimeColW() * this.dateDuration;
    },
    // 获取合计行高度
    getSummaryRowsHeight() {
      let e = this.$refs.ganttBoxRefDom;
      if (!e) return 0;
      let t = e.querySelectorAll(".stat-bottom") || [], i = 0;
      for (let l = t.length - 1; l >= 0; l--) {
        let s = t[l];
        i += o.getDOMWH(s).h;
      }
      return i;
    },
    // 刷新甘特图宽高
    refreshGTTWH() {
      this.calcWHCore(), this.renderToDom(), this.drawGridCanvas(), this.createTagList(), this.showAxisTime(this.markLineTime), this.tickTimeLineHandle();
    },
    // tag 变化后需要调用的更新函数
    tagChangThenRefreshAll() {
      this.backfillTagListToRowsInfo(), this.refreshGTTWH();
    },
    //#endregion 宽高计算
    //#region 需求-任务持续时间加减n天
    // 获取任务持续时间前 “减n天” 在甘特图画布中的宽度
    getdecreaseDayWidth() {
      return this.getTimeColW() * Math.abs(this.decreaseDayNum);
    },
    //#endregion 需求-任务持续时间加减n天
    //#region 横向滚动 scroll
    // 滚动到上次滚动条百分比位置
    scrollXToLastPercent() {
      let e = this.$refs.scrollXBarDom;
      e && this.scrolledXPercent >= 0 && this.scrollGanTTXTo(e.scrollWidth * this.scrolledXPercent / 100);
    },
    // 初始化横向滚动条初始距离，初始时应该滚到任务持续时间区间范围内
    scrollToDurationTime() {
      this.scrollGanTTXTo(this.getdecreaseDayWidth());
    },
    // 横向滚动到指定位置
    scrollGanTTXTo(e = 0) {
      let t = this.$refs.scrollXBarDom;
      t && (t.scrollLeft = e || 0);
    },
    // 获取横向滚动距离
    getScrollLeft() {
      let e = this.$refs.scrollXBarDom;
      return e ? e.scrollLeft : 0;
    },
    scrollXHandle(e) {
      this.closeAllMenu("scrollXHandle");
      let t = this.$refs.ganttBoxRefDom, i = this.$refs.scrollXBarDom, l = this.$refs.paintBoxRefDom;
      if (!t || !i || !l) return;
      let s = t.querySelectorAll(".scrollX"), a = -1 * (this.getScrollLeft() || 0);
      s.forEach((g) => {
        g.style.transform = `translateX(${a}px)`;
      }), l.style.left = `${a}px`, this.showAxisTime(this.markLineTime), this.tickTimeLineHandle(), this.scrolledXPercent = Number((this.getScrollLeft() / i.scrollWidth).toFixed(6)) * 100;
    },
    addScrollXEvent() {
      let e = this.$refs.scrollXBarDom;
      e && e.addEventListener("scroll", this.scrollXHandle, !1);
    },
    removeScrollXEvent() {
      let e = this.$refs.scrollXBarDom;
      e && e.removeEventListener("scroll", this.scrollXHandle);
    },
    //#endregion 横向滚动 scroll
    //#region 纵向滚动 scroll
    // 纵向滚动到指定位置
    scrollGanTTYTo(e = 0) {
      let t = this.$refs.scrollYBarDom;
      t && (t.scrollTop = e || 0);
    },
    // 获取纵向滚动距离
    getScrollTop() {
      let e = this.$refs.scrollYBarDom;
      return e ? e.scrollTop : 0;
    },
    // 纵向滚动条滚动位置变化，同步到其他纵向滚动项
    scrollYHandle(e) {
      this.closeAllMenu("scrollYHandle");
      let t = this.$refs.ganttBoxRefDom, i = this.$refs.scrollYBarDom;
      if (!t || !i) return;
      let l = t.querySelectorAll(".scrollY"), s = -1 * (this.getScrollTop() || 0);
      l.forEach((a) => {
        a.style.transform = `translateY(${s}px)`;
      });
    },
    // 鼠标滚轮滚动，滚动条滚动
    mousewheelHandle(e) {
      let t = this.$refs.scrollYBarDom;
      t && t.scrollHeight !== t.offsetHeight && (e.stopPropagation(), e.preventDefault(), this.scrollTimer && clearTimeout(this.scrollTimer), this.scrollTimer = setTimeout(() => {
        let i = -e.deltaY || e.wheelDeltaY, l = this.$refs.scrollYBarDom;
        if (!l) return;
        let s = l.scrollTop, a = o.getDOMWH(l).h / 6;
        i < 0 || (a = -1 * a), l.scrollTop = s + a, this.scrollYHandle();
      }));
    },
    addScrollYEvent() {
      let e = this.$refs.scrollYBarDom, t = this.$refs.paintBoxRefDom;
      !e || !t || (e.addEventListener("scroll", this.scrollYHandle, !1), t.addEventListener("mousewheel", this.mousewheelHandle, !1));
    },
    removeScrollYEvent() {
      this.scrollTimer && clearTimeout(this.scrollTimer);
      let e = this.$refs.scrollYBarDom, t = this.$refs.paintBoxRefDom;
      !e || !t || (e.removeEventListener("scroll", this.scrollYHandle), t.removeEventListener("mousewheel", this.mousewheelHandle, !1));
    },
    //#endregion 纵向滚动 scroll
    //#region 点击图时，显示纵向标记线，用于筛选当前时间下贯穿的tag
    clickShowMarkLine(e) {
      if (!this.showMarkLine) return;
      let t = e.x || e.pageX || 0, i = this.$refs.ganttBoxRefDom;
      if (!i) return;
      let { left: l } = i.getBoundingClientRect(), s = t - l;
      if (s < this.paintLeftVal) return;
      let a = this.ganTTLeftToCanvasLeft(s), g = this.getStartTimeByLeft(a);
      this.showAxisTime(g), this.$emit("changeMarkLineClick", {
        markLineTime: g,
        // 时间
        inTags: this.getTimePierceTags(g)
      });
    },
    /**
     * 显示时间线
     * @param {*} time 时间线对应的时间 - 是画布中的！
     * @param {*} ganttLeft 甘特图left！
     */
    showAxisTime(e = "", t) {
      if (!this.showMarkLine || !e) {
        this.markLine.visible = !1;
        return;
      }
      this.markLine = {
        ...this.markLine,
        visible: !0,
        left: o.isNull(t) ? this.canvasLeftToGanTTLeft(this.getLeftByStartTime(e)) + "px" : t,
        title: o._date.format(e, "HH:mm")
      }, this.$emit("update:markLineTime", e);
    },
    //#endregion 点击图时，显示纵向标记线，用于筛选当前时间下贯穿的tag
    //#region 定时标记当前时间
    hide_TickTimerLine() {
      this.currentTimeLine.visible = !1;
    },
    // 当前时间-标记线
    tickTimeLineHandle() {
      let e = this.getGanTTimeRange();
      if (!e) return this.hide_TickTimerLine();
      let { startTime: t, endTime: i } = e, l = (/* @__PURE__ */ new Date()).getTime();
      if (l > i || l < t) return this.hide_TickTimerLine();
      let s = this.getLeftByStartTime(l);
      s >= this.getScrollLeft() ? this.currentTimeLine = {
        ...this.currentTimeLine,
        visible: !0,
        left: this.canvasLeftToGanTTLeft(s) + "px",
        title: o._date.format(l, "HH:mm")
      } : this.hide_TickTimerLine();
    },
    // 来根时间线标记当前时间
    init_TickTimer() {
      clearTimeout(this.tickCurrentTimer), this.tickCurrentTimer = setTimeout(() => {
        this.tickTimeLineHandle(), this.init_TickTimer();
      }, 1e3);
    },
    //#endregion 定时标记当前时间
    //#region 右键菜单
    rightMenu_init() {
      let e = this.$refs.paintBoxRefDom;
      e && (e.oncontextmenu = (t) => {
        let i = t || window.event;
        if (i.preventDefault(), this.closeAllMenu("rightMenu_init"), this.readOnly || this.draging.tagItemDom)
          return !1;
        let l = this.$refs.rightClickMenuRefDom;
        if (!l) return;
        let s = i.offsetX, a = i.offsetY;
        if (this.disabledRowSilent && this.judgeYisInDisabledRow(a))
          return !1;
        l.style.display = "block", this.rightMenuTemObj = this.pixelToDataCoordinate(s, a);
        let { w: g, h: f } = o.getDOMWH(this.$refs.boxRightRefDom), r = this.getScrollTop() || 0, h = this.getScrollLeft() || 0, { w: d, h: n } = o.getDOMWH(l);
        return d + s > g + h && (s = s - d), a + n > f + r && (a = a - n), l.style.left = s + "px", l.style.top = a + "px", !1;
      });
    },
    // 关闭右键菜单
    rightMenu_close() {
      let e = this.$refs.rightClickMenuRefDom;
      e && (e.style.display = "none");
    },
    /**
     * 菜单事件
     * @param {*} e 鼠标e
     * @param {*} menuItem 菜单触发项
     * @param {*} btnIndex 菜单触发索引
     */
    rightClickMenuEvent(e, t, i) {
      this.readOnly || !t || t.disabled || (this.$emit("rightClickMenuClick", {
        e,
        // 鼠标e
        target: t,
        // 菜单触发项
        triggerIndex: i,
        // 菜单触发索引
        coordsInfo: this.rightMenuTemObj
      }), this.rightMenu_close());
    },
    //#endregion 右键菜单
    //#region 左侧任务列操作菜单
    taskMenu_Open(e, t = {}) {
      if (e.stopPropagation(), e.preventDefault(), this.closeAllMenu("taskMenu_Open"), this.readOnly || !t || !Object.keys(t).length) return;
      let i = [];
      if (t.taskMenuList ? i = t.taskMenuList : i = this.taskMenuList, i.length) {
        let l = this.calcRowTopByRowLabel(t.label), s = this.paintLeftVal + 4, a = this.paintTopVal + l + t.h - this.getScrollTop() - 10;
        this.taskMenu.visible = !0, this.taskMenu.btnList = i, this.taskMenu = {
          ...this.taskMenu,
          visible: !0,
          btnList: i,
          selectRow: {
            ...t
          }
        }, this.$nextTick(() => {
          let g = this.$refs.ganttBoxRefDom, f = this.$refs.taskMenuRefDom;
          if (g && f) {
            let r = o.getDOMWH(g).h, h = o.getDOMWH(f).h;
            h + a > r && (a = r - h);
          } else
            return;
          this.taskMenu = {
            ...this.taskMenu,
            style: {
              left: s + "px",
              top: a + "px"
            }
          };
        });
      } else
        this.taskMenu_close();
    },
    // 关闭
    taskMenu_close() {
      this.taskMenu = {
        ...this.taskMenu,
        visible: !1,
        btnList: [],
        selectRow: {}
      };
    },
    /**
     * 左侧任务列操作菜单事件
     * @param {*} e 鼠标e
     * @param {*} menuItem 菜单触发项
     * @param {*} btnIndex 菜单触发索引
     */
    taskMenuBtnClick(e, t, i) {
      this.readOnly || !t || t.disabled || (this.$emit("taskMenuBtnClick", {
        e,
        // 鼠标e
        target: t,
        // 菜单触发项
        triggerIndex: i,
        // 菜单触发索引
        rowData: {
          ...this.taskMenu.selectRow,
          tags: this.getTagsByRowLabel(this.taskMenu.selectRow.label)
        }
      }), this.taskMenu_close());
    },
    //#endregion 左侧任务列操作菜单
    //#region 重要的事件参数构造
    // 获取指定label行下的所有tags
    getTagsByRowLabel(e = "") {
      return e ? this.tagList.filter((t) => t.parentKey === e).map((t) => this.backfillTag(t)) : [];
    },
    // 获取指定时间贯穿的所有tag
    getTimePierceTags(e = "") {
      if (!e) return [];
      let t = [], i = new Date(e).getTime();
      return this.tagList.map((l) => {
        let { startTime: s, endTime: a } = l;
        i >= new Date(s).getTime() && i <= new Date(a).getTime() && t.push({
          ...l,
          data: this.backfillTag(l)
        });
      }), t;
    },
    // 获取甘特图完整行数据 - 格式和props.rows一致
    getRowsData() {
      return this.backfillTagListToRowsInfo(), this.refreshGTTWH(), this.rowsInfo.map((e) => {
        let t = {
          ...e,
          tags: e.tags.map((i) => {
            let l = {
              ...i
            };
            return delete l.tagId, l;
          })
        };
        return delete t.h, t;
      });
    },
    // 获取所有被选中的tag
    getAllSelectedTags() {
      let e = [];
      return this.tagList.map((t) => {
        t.selected && e.push({
          ...t,
          data: this.backfillTag(t)
        });
      }), e;
    },
    //#endregion 重要的事件参数
    // 关闭甘特图所有菜单
    closeAllMenu(e) {
      this.rightMenu_close(), this.taskMenu_close(), this.tagMenu_close();
    },
    // 甘特图失去焦点
    ganTTblur() {
      this.closeAllMenu("ganTTblur");
    },
    // 甘特图点击
    ganTTClick(e) {
      this.closeAllMenu("ganTTClick"), this.clickShowMarkLine(e);
    },
    // 画布resize -重新计算相关布局元素
    event_windowResize() {
      clearTimeout(this.tickTimer), this.tickTimer = setTimeout(() => {
        console.log("甘特图 resize...");
        try {
          this.closeAllMenu("event_windowResize"), this.refreshGTTWH(), this.isFirstInit && this.$nextTick(() => {
            this.isFirstInit = !1, this.scrollToDurationTime();
          });
        } catch (e) {
          console.error("甘特图 resize error：", e);
        }
      }, 50);
    },
    // 注意：每次init后tagid将重新生成，用之前的tagid将无法匹配
    init() {
      this.dodgeTagsInfo = {}, this.calcWHCore(N(this.rows)), this.addEvents(), this.init_TickTimer();
    },
    addEvents() {
      this.removeEvents();
      let e = this.$refs.ganttBoxRefDom;
      S = new ResizeObserver(this.event_windowResize), S.observe(e), this.addScrollXEvent(), this.addScrollYEvent(), this.rightMenu_init();
    },
    removeEvents() {
      let e = this.$refs.ganttBoxRefDom;
      e && (S == null || S.unobserve(e)), this.removeScrollXEvent(), this.removeScrollYEvent(), clearTimeout(this.tickCurrentTimer);
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.removeEvents();
  }
}, xe = { class: "gantt-chart-wrap" }, ve = { ref: "canvasGanttRefDom" }, Me = { class: "header-right" }, ke = {
  class: "scrollX",
  ref: "headerBoxRefDom"
}, Le = { class: "name" }, Re = ["onContextmenu"], Be = { class: "name" }, Ie = {
  class: "box-right",
  ref: "boxRightRefDom"
}, Ce = {
  class: "box-paint scrollY",
  ref: "paintBoxRefDom",
  style: { "text-align": "right" }
}, _e = { ref: "canvasGridRefDom" }, He = {
  ref: "canvasGuideBoxRefDom",
  style: { "z-index": "99" }
}, Se = ["onClick"], Oe = ["onClick"], Ye = {
  class: "scrollXBar",
  ref: "scrollXBarDom"
}, We = {
  class: "scrollYBar",
  ref: "scrollYBarDom"
}, Ne = { class: "stat-bottom_right" }, Ee = { class: "scrollX" }, Ge = { class: "name" }, Ae = ["onClick"], Xe = { class: "dialog-footer" };
function Ve(e, t, i, l, s, a) {
  const g = I("yTimeLine"), f = I("tagItem"), r = I("el-date-picker"), h = I("el-button"), d = I("el-dialog");
  return T(), p("div", xe, [
    c("div", {
      class: "gap",
      style: w({ background: i.ganttBgColor })
    }, null, 4),
    c("div", {
      style: w({ background: i.ganttBgColor }),
      tabindex: "-2",
      class: "gantt-chart-box",
      ref: "ganttBoxRefDom",
      onClick: t[5] || (t[5] = (...n) => a.ganTTClick && a.ganTTClick(...n)),
      onBlur: t[6] || (t[6] = (...n) => a.ganTTblur && a.ganTTblur(...n)),
      onContextmenu: t[7] || (t[7] = (...n) => s.utils.oncontextmenuDisabled && s.utils.oncontextmenuDisabled(...n))
    }, [
      L(g, z(K(s.currentTimeLine)), null, 16),
      L(g, z(K(s.markLine)), null, 16),
      L(g, le(s.movingTimeLine, { style: { "z-index": "20" } }), null, 16),
      c("canvas", ve, "您的浏览器不支持 HTML5 canvas标签", 512),
      c("div", {
        class: "row-header",
        style: w({ height: i.paintTop })
      }, [
        c("span", {
          class: "gt-title",
          ref: "titleRefDom",
          style: w({ width: i.paintLeft, height: i.paintTop })
        }, b(i.title), 5),
        c("div", Me, [
          c("div", ke, [
            (T(!0), p(M, null, R(s.colsInfo, (n, u) => (T(), p("span", {
              class: "paint-col",
              key: u
            }, [
              c("span", Le, b(s.utils._date.format(n.label, i.timeFormat)), 1),
              c("i", {
                class: "sLine",
                style: w({ background: i.gridLineColor })
              }, null, 4)
            ]))), 128))
          ], 512)
        ])
      ], 4),
      c("div", {
        class: "row-bottom",
        style: w({ height: s.ganTTBottomHeight ? s.ganTTBottomHeight + "px" : "" })
      }, [
        c("div", {
          class: "box-left scrollY",
          style: w({ width: i.paintLeft })
        }, [
          (T(!0), p(M, null, R(s.rowsInfo, (n, u) => (T(), p("div", {
            class: B({
              "paint-row": !0,
              disabled: n.disabled,
              canSelected: i.taskMenuList.length || n.taskMenuList,
              selected: s.taskMenu.selectRow && s.taskMenu.selectRow.label === n.label
            }),
            key: u,
            style: w({ backgroundColor: n.disabled ? i.disabledBgColor : "" }),
            onContextmenu: k((m) => a.taskMenu_Open(m, n), ["stop"])
          }, [
            c("span", Be, b(n.label), 1),
            c("i", {
              class: "sLine",
              style: w({ background: i.gridLineColor })
            }, null, 4)
          ], 46, Re))), 128))
        ], 4),
        c("div", Ie, [
          c("div", Ce, [
            c("canvas", _e, "您的浏览器不支持 HTML5 canvas标签", 512),
            c("canvas", He, "您的浏览器不支持 HTML5 canvas标签", 512),
            c("div", {
              class: "rightClickMenu",
              ref: "rightClickMenuRefDom",
              onContextmenu: t[1] || (t[1] = (...n) => s.utils.oncontextmenuDisabled && s.utils.oncontextmenuDisabled(...n))
            }, [
              c("ul", null, [
                (T(!0), p(M, null, R(i.rightClickMenuList, (n, u) => (T(), p("li", {
                  class: B({ disabled: n.disabled }),
                  onClick: k((m) => a.rightClickMenuEvent(m, n, u), ["stop"]),
                  onContextmenu: t[0] || (t[0] = k((...m) => s.utils.oncontextmenuDisabled && s.utils.oncontextmenuDisabled(...m), ["stop"])),
                  key: `${n}-${u}}}`
                }, b(n.label), 43, Se))), 128))
              ])
            ], 544),
            A(c("ul", {
              class: "tag-menu",
              ref: "tagMenuRefDom",
              style: w(s.tagMenu.style),
              onClick: t[3] || (t[3] = (n) => s.autoCloseTagMenu = !1)
            }, [
              (T(!0), p(M, null, R(s.tagMenu.btnList, (n, u) => (T(), p("li", {
                key: `${n.label}-${u}}`,
                class: B({ disabled: n.disabled }),
                onClick: k((m) => a.tagMenuBtnClickHandle(m, n, u), ["stop"]),
                onContextmenu: t[2] || (t[2] = k((...m) => s.utils.oncontextmenuDisabled && s.utils.oncontextmenuDisabled(...m), ["stop"]))
              }, b(n.label), 43, Oe))), 128))
            ], 4), [
              [X, s.tagMenu.visible]
            ]),
            (T(!0), p(M, null, R(s.tagList, (n) => (T(), p(M, null, [
              n.hide ? G("", !0) : (T(), Q(f, {
                key: n.tagId,
                tipWdith: i.tipWdith,
                tagItem: n,
                tagMoveCallback: a.tagMove,
                onTagDragStart: a.tagDragStart,
                onChangeEnd: a.tagChangeEnd,
                style: w({ background: a.getLegendConfig(n).color || "#000000" }),
                dragable: a.tagItemDragable(n),
                closeTip: a.tagItemCloseTip(n),
                showOperateMark: a.tagHasOperateMenu(n),
                showSelected: i.showSelected,
                onTagContextmenu: a.tagContextmenuHandle,
                onTagClick: a.tagClickHandle,
                onTagBlur: a.tagblurHandle,
                tipEnterable: i.tipEnterable
              }, {
                tagTip: C(({ tagData: u }) => [
                  J(e.$slots, "tagTip", { tagData: u }, void 0, !0)
                ]),
                _: 2
              }, 1032, ["tipWdith", "tagItem", "tagMoveCallback", "onTagDragStart", "onChangeEnd", "style", "dragable", "closeTip", "showOperateMark", "showSelected", "onTagContextmenu", "onTagClick", "onTagBlur", "tipEnterable"]))
            ], 64))), 256))
          ], 512),
          c("div", Ye, [
            c("div", {
              style: w({ width: this.paintBoxInfo.width + "px" })
            }, null, 4)
          ], 512)
        ], 512),
        c("div", We, [
          c("div", {
            style: w({ height: this.paintBoxInfo.height + "px" })
          }, null, 4)
        ], 512)
      ], 4),
      (T(!0), p(M, null, R(i.summaryRows, (n, u) => (T(), p("div", {
        class: "stat-bottom",
        key: u
      }, [
        n.length > 0 ? (T(), p(M, { key: 0 }, [
          c("div", {
            class: "stat-bottom_title",
            style: w({ width: i.paintLeft, minHeight: s.rowMinRowHeight })
          }, b(n[0]), 5),
          c("div", Ne, [
            c("div", Ee, [
              (T(!0), p(M, null, R(s.colsInfo, (m, y) => (T(), p("span", {
                class: "stat-bottom_col",
                key: `${u}-${y}`,
                style: w({ width: `${s.colsInfo[y] ? s.colsInfo[y].w : 0}px` })
              }, [
                c("span", Ge, b(n[y + 1]), 1),
                c("i", {
                  class: "sLine",
                  style: w({ background: i.gridLineColor })
                }, null, 4)
              ], 4))), 128))
            ])
          ])
        ], 64)) : G("", !0)
      ]))), 128)),
      A(c("ul", {
        class: "task-menu",
        ref: "taskMenuRefDom",
        style: w(s.taskMenu.style)
      }, [
        (T(!0), p(M, null, R(s.taskMenu.btnList, (n, u) => (T(), p("li", {
          key: `${n.label}-${u}}`,
          class: B({ disabled: n.disabled }),
          onClick: k((m) => a.taskMenuBtnClick(m, n, u), ["stop"]),
          onContextmenu: t[4] || (t[4] = k((...m) => s.utils.oncontextmenuDisabled && s.utils.oncontextmenuDisabled(...m), ["stop"]))
        }, b(n.label), 43, Ae))), 128))
      ], 4), [
        [X, s.taskMenu.visible]
      ])
    ], 36),
    L(d, {
      title: "时间选择",
      modelValue: s.tagTimeDialog.visible,
      "onUpdate:modelValue": t[9] || (t[9] = (n) => s.tagTimeDialog.visible = n),
      width: "450px",
      "close-on-click-modal": !1
    }, {
      footer: C(() => [
        c("span", Xe, [
          L(h, { onClick: a.closeTagTimeDialog }, {
            default: C(() => [
              W("取 消")
            ]),
            _: 1
          }, 8, ["onClick"]),
          L(h, {
            type: "primary",
            onClick: a.confirmTagTimeDlaiog
          }, {
            default: C(() => [
              W("确 定")
            ]),
            _: 1
          }, 8, ["onClick"])
        ])
      ]),
      default: C(() => [
        c("div", null, [
          L(r, {
            modelValue: s.tagTimeDialog.timeRange,
            "onUpdate:modelValue": t[8] || (t[8] = (n) => s.tagTimeDialog.timeRange = n),
            type: "datetimerange",
            "picker-options": s.pickerOptions,
            "range-separator": "-",
            "start-placeholder": "开始日期",
            "end-placeholder": "结束日期",
            "value-format": "yyyy/MM/dd HH:mm:ss"
          }, null, 8, ["modelValue", "picker-options"])
        ])
      ]),
      _: 1
    }, 8, ["modelValue"])
  ]);
}
const Pe = /* @__PURE__ */ E(be, [["render", Ve], ["__scopeId", "data-v-f58ae14c"]]), je = [
  Pe
], F = function(e) {
  F.installed || (F.installed = !0, je.forEach((t) => {
    e.component(t.name, t);
  }));
};
typeof window < "u" && window.Vue && F(window.Vue);
export {
  Pe as default,
  F as install
};
