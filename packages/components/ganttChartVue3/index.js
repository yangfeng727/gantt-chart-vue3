import {dayjs} from "element-plus";

// 生成唯一uuid
export function uuid(len, radix) {
  var chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}

const toStr = Function.prototype.call.bind(Object.prototype.toString);

export function isObjectObject(t) {
  return toStr(t) === "[object Object]";
}
export function isObjectString(t) {
  return toStr(t) === "[object String]";
}
export function isObjectArray(t) {
  return toStr(t) === "[object Array]";
}
export function isObjectNull(t) {
  return toStr(t) === "[object Null]";
}
export function isObjectUnde(t) {
  return toStr(t) === "[object Undefined]";
}
export function isObjectFunction(t) {
  return toStr(t) === "[object Function]";
}

// 对象合并
export function mergeObj(target, ...arg) {
  return arg.reduce((acc, cur) => {
    if (!isObjectObject(cur)) {
      return acc;
    } else {
      return Object.keys(cur).reduce((subAcc, key) => {
        const srcVal = cur[key];
        if (isObjectObject(srcVal)) {
          subAcc[key] = mergeObj(subAcc[key] ? subAcc[key] : {}, srcVal);
        } else if (isObjectArray(srcVal)) {
          // series: []，下层数组直接赋值
          subAcc[key] = srcVal.map((item, idx) => {
            if (isObjectObject(item)) {
              const curAccVal = subAcc[key] ? subAcc[key] : [];
              return mergeObj(curAccVal[idx] ? curAccVal[idx] : {}, item);
            } else {
              return item;
            }
          });
        } else {
          subAcc[key] = srcVal;
        }
        return subAcc;
      }, acc);
    }
  }, target);
}

// 对象克隆
export function cloneObj(obj) {
  let o = null;
  if (Object.prototype.toString.call(obj) === "[object Array]") {
    o = [];
    for (let i = 0; i < obj.length; i++) {
      o.push(cloneObj(obj[i]));
    }
  } else if (Object.prototype.toString.call(obj) === "[object Object]") {
    o = {};

    for (let x in obj) {
      o[x] = cloneObj(obj[x]);
    }
  } else {
    o = obj;
  }
  return o;
}

/**
 * 判断指定dom节点是否是具有定位属性的节点 - 即：position为 absolute | relative | fixed
 * @param _node
 * @returns {boolean}
 */
export function judgeIsLocateNode(_node) {
  let cssStyle = window.getComputedStyle(_node, null);
  return cssStyle.position !== "static"; // 不是默认的就是有定位的
}

/**
 * 获取指定节点的有定位的父节点
 * @param ele 子节点
 * @param flag 父节点类或id选择器或者元素节点名称，eg： 类：.app | id: #app | 元素节点名称 body 或者 flag直接是dom对象
 * @returns {HTMLElement | null}
 */
export function findLocateParentNode(ele) {
  if (!ele) return null;
  let parent = ele.parentNode;

  let locateParentNode = null; // 有定位父节点
  while (parent && parent.nodeName !== "BODY" && parent.nodeName !== "HTML") {
    if (judgeIsLocateNode(parent)) {
      // 是定位节点
      locateParentNode = parent;
      break;
    }
    parent = parent.parentNode;
  }

  // 默认是body
  if (!locateParentNode) {
    locateParentNode = document.getElementsByTagName("body")[0];
  }

  return locateParentNode;
}

export const utils = {
  // 日期操作
  _date: {
    // 格式化date
    format(date, format = "YYYY-MM-DD HH:mm:ss") {
      return dayjs(date).format(format);
    },
    add(date = "", num = 1, unit = "day") {
      return dayjs(date).add(num, unit);
    },
  },
  // 判断val是否为空
  isNull(val) {
    return (
      val === null || val === void 0 || val === "" || val.toString() === "NaN"
    );
  },

  /**
   * 获取val值，若为空则使用默认值
   * @param {*} val
   * @param {*} dt val为空时的默认值
   * @param {*} unit 单位
   * @returns string|number|boolean
   */
  getStrVal(val, dt = "", unit = "") {
    return !this.isNull(val) ? val + unit : dt;
  },

  // 获取css属性值的单位，如：px、rem、%
  getUnit(val = "") {
    return (val.match(/[^.\d]*/gi) || []).find((item) => item) || "";
  },
  // 去掉值后的单位：eg： 10px -> 10
  delValUnit(val, unit) {
    if (!unit) {
      unit = this.getUnit(val); //
      if (!unit) return val;
    }
    let reg = new RegExp(unit + "$", "ig");
    return val.replace(reg, "");
  },

  // 禁止鼠标右键
  oncontextmenuDisabled(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  },

  //#region dom操作

  setDOMH(dom, h) {
    if (!dom || !dom.style) return;
    dom.style.height = h + "px";
  },
  setDOMW(dom, w) {
    if (!dom || !dom.style) return;
    dom.style.width = w + "px";
  },
  // 获取dom 宽高
  getDOMWH(dom) {
    let _dom = dom || {};
    return {
      w: _dom.offsetWidth || 0,
      h: _dom.offsetHeight || 0,
    };
  },

  //#endregion dom操作

  //#region canvas

  // 清除画布
  clearCanvas(canvas) {
    if (!canvas) return;
    let ctx = canvas.getContext("2d");
    // ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.restore();
  },
  // 设置canvas 宽高
  setCanvasWH(canvas, width, height) {
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
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
  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  },
  smoothScroll({
    startPosition, // 开始位置
    distance, // 距离开始位置的距离
    duration= 300, // 动画持续时间 ms
    callBack
  }={duration: 300}){
    // 开始动画
    let startTimeStamp = null

    let render=(timeStamp)=>{
      !startTimeStamp && (startTimeStamp = timeStamp)
      let progress = timeStamp - startTimeStamp
      // console.log(timeStamp, progress, 11111)
      let run = this.easeInOutQuad(progress, startPosition, distance, duration)
      callBack && callBack(run)
      if(progress<duration){
        requestAnimationFrame(render)
      }
    }
    requestAnimationFrame(render)
  }
};

// 边界范围内移动
export function moveInBoundary({
  contentDom, // 边界盒子dom
  dragDom, // 拖拽的盒子dom
  left,
  top,
}) {
  let minLeft = 0;
  let minTop = 0;
  let maxLeft = contentDom.offsetWidth - dragDom.offsetWidth;
  let maxTop = contentDom.offsetHeight - dragDom.offsetHeight;
  if (left < minLeft) {
    left = minLeft;
  }
  if (top < minTop) {
    top = minTop;
  }
  if (left > maxLeft) {
    left = maxLeft;
  }
  if (top > maxTop) {
    top = maxTop;
  }
  return {
    left,
    top,
  };
}

/**
 * 判断tag是否进入指定禁用行范围
 * @param param0
 * @returns boolean
 */
export function tagIsTouchDisabledRow({
  disabledYMin, // 禁用行Y最小值
  disabledYMax, // 禁用行Y最大值
  tagHeight, // tag 的高度
  tagTop, // tag 的css top值
}) {
  return tagTop > disabledYMin - tagHeight && tagTop < disabledYMax;
}
