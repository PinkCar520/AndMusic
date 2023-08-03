// 月份、日期、小时等小于10时前面补0
const zeroFill = function (value: number) {
  return value < 10 ? "0" + value : value;
};
// 时间戳转日期
export function formatDate(time = +new Date()) {
  var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
  var year = date.getFullYear();
  var month = zeroFill(date.getMonth() + 1);
  var day = zeroFill(date.getDate());
  // var hours = zeroFill(date.getHours());
  // var minutes = zeroFill(date.getMinutes());
  // var seconds = zeroFill(date.getSeconds());
  // 整理好的数据返回出去
  // console.log((date.getTime() * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')); // 2022年05月29日
  return year + "." + month + "." + day + "";
  // return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g,'-');  // 2022-05-29
}
// 播放量
export function viewCounts(value: number) {
  return Math.round(value / 10000) + "万";
}
// 音频时长格式化
export function formatDuration(musicTime: number) {
  var min = zeroFill(Math.floor(musicTime / 60));
  var second = zeroFill(Math.floor(musicTime % 60));
  return min + ":" + second;
}
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}

/**
 * fun：防抖处理的函数
 * delay：延时的时间
 * immediate：是否使用立即执行 true立即执行 false非立即执行
 */
// 防抖函数
// export function debounce(fn, delay: number) {
//   // 定时器
//   let timer = null;
//   // 是否立即执行
//   let immediate = true;
//   // 作为返回值
//   return function () {
//     // 判断定时器是否存在,存在就清除定时器
//     if (timer) {
//       clearTimeout(timer);
//     }
//     if (immediate) {
//       // 立即执行,改变this指向为当前对象
//       fn.call(this);
//       immediate = false;
//     } else {
//       // 非立即执行
//       timer = setTimeout(() => {
//         immediate = true;
//         // 改变this指向为当前对象
//         fn.call(this);
//       }, delay);
//     }
//   };
// }
