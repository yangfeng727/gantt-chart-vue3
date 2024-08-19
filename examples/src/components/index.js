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