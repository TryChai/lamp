import { Toast } from "vant";
import axios from "axios";
import router from "../../../router";
import wx from "weixin-js-sdk";
import Cookies from "js-cookie";
import store from "../../../store/index";

import api from "../../../assets/js/api/require/index";
const getTimeFormat = function (time, hs) {
  //time 1398250549490
  //时间数字转2014-04-23 18:55:49 格式
  // php 后端时间戳返回10位数，补3个 000
  if (
    time == "0" ||
    time == "0000" ||
    time == "" ||
    time == "null" ||
    time == null ||
    time == "undefined" ||
    isNaN(time)
  ) {
    return "~~";
  }
  time = time + "";
  var date = "";
  if (time.length >= 13) {
    date = new Date(parseInt(time));
  } else {
    date = new Date(parseInt(time + "000"));
  }
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var s =
    ":" +
    (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
  if (hs == undefined) {
    return Y + M + D + h + m;
  } else if (hs == "md") {
    return M.replace("-", "月") + D.replace(" ", "日");
  } else if (hs == "ymd") {
    return Y + M + D;
  } else if (hs == "hms") {
    return h + m + s;
  } else if (hs == "ymdhms") {
    return Y + M + D + h + m + s;
  } else {
    return h + m;
  }
};
const getTimeHour = function (time) {
  //time 1398250549490
  //时间数字转2014-04-23 18:55:49 格式

  // php 后端时间戳返回10位数，补3个 000
  if (time == "0" || time == "0000") {
    return "";
  }
  time = time + "";
  var date = "";
  if (time.length >= 13) {
    date = new Date(parseInt(time));
  } else {
    date = new Date(parseInt(time + "000"));
  }
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return h + m;
};
const regexp = function (ex, str) {
  if (ex.test(str)) {
    return true;
  } else {
    return false;
  }
};
const getImgUrl = function (url, sex) {
  if (sex == "sex") {
    if (url && (url.indexOf("http") >= 0 || url.indexOf("api") >= 0)) {
      return url;
    } else if (url == null || url == "null" || url == "") {
      return "";
    } else {
      return "/api/" + url;
    }
  } else if (url == "" || url == undefined) {
    return require("../../img/productDefault.jpg");
  }
  if (url == "" || url == "null" || url == undefined) {
    return require("../../img/productDefault.jpg");
  } else if (url.indexOf("api") >= 0) {
    return url;
  } else if (url.indexOf("data") >= 0) {
    return url;
  } else if (
    url.indexOf("img") >= 0 ||
    url.indexOf("api") >= 0 ||
    url.indexOf("http") >= 0
  ) {
    return url;
  } else {
    return "/api/" + url;
  }
};
const toFixedZ = function (num, decimal) {
  num = num + "";
  num = num.toString();
  // decimal= decimal || 2;
  decimal = decimal >= 2 && decimal < 4 ? 2 : decimal;
  decimal = decimal == "0" ? 0 : decimal || 2;
  let index = num.indexOf(".");
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1);
  } else {
    num = num.substring(0);
  }
  if (isNaN(num)) {
    return 0;
  }
  return parseFloat(num).toFixed(decimal);
};
const getMonthAndDay = function (time, bool) {
  if (time == "" || time == undefined) return "";
  time = time + "";
  var date = "";
  if (time.length >= 13) {
    date = new Date(parseInt(time));
  } else {
    date = new Date(parseInt(time + "000"));
  }
  var M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  if (!bool) {
    return M + "月" + D + "日";
  } else {
    return M + "." + D;
  }
};

const mstime = function (time) {
  if (time == "0" || time == "0000") {
    return "";
  }
  time = time + "";
  var date = "";
  if (time.length >= 13) {
    date = new Date(parseInt(time));
  } else {
    date = new Date(parseInt(time + "000"));
  }
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var s =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() + "";

  return M + D + h + s;
};

const tel = function (number) {
  // number = Number(number)
  var ua = window.navigator.userAgent.toLowerCase();
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        window.location.href = "tel:" + number;
      } else {
        // eslint-disable-next-line no-undef
        ykAPP.phone(number);
      }
    } else {
      var data = {
        type: "call",
        text: number,
      };
      postData(data);
    }
  } else {
    window.location.href = "tel:" + number;
  }
};
const ykAppUpImage = function (src) {
  var ua = window.navigator.userAgent.toLowerCase();
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        try {
          // eslint-disable-next-line no-undef
          ykAPP.downImage([src]);
        } catch (error) {
          Toast.fail("未调用到appios");
        }
      } else {
        try {
          // eslint-disable-next-line no-undef
          if (src.indexOf("data:") >= 0) {
            // eslint-disable-next-line no-undef
            ykAPP.downBase64Image(src);
          } else {
            getImageBase64(src, (res) => {
              // eslint-disable-next-line no-undef
              ykAPP.downBase64Image(res);
            });
          }
        } catch (error) {
          Toast.fail("未调用到app安卓");
        }
      }
    } else {
      var data = {
        type: "download",
        data: src,
      };
      postData(data);
    }
  } else {
    // var a = document.createElement("a");
    // var event = new MouseEvent("click");

    // a.download = getTimeFormat(new Date().getTime())+"img";
    // a.href = src;

    // a.dispatchEvent(event);
    let image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function () {
      let canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      let context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, image.width, image.height);
      let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
      let a = document.createElement("a"); // 生成一个a元素
      let event = new MouseEvent("click"); // 创建一个单击事件
      a.download = name || "photo"; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = src;
  }
};
const ykAPPCopy = function (str) {
  var ua = window.navigator.userAgent.toLowerCase();
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        // eslint-disable-next-line no-undef
        // Toast.success("开始调用APP")
        // eslint-disable-next-line no-undef
        ykAPP.copy(str);

        Toast.success("复制成功");
      } else {
        Toast.fail("未调用到app");
      }
    } else {
      Toast.fail("复制失败");
    }
  } else {
    var data = {
      type: "copy",
      text: str,
    };
    postData(data);
  }
};

const getNyr = function (time, types) {
  if (
    time == "0" ||
    time == "0000" ||
    time == "" ||
    time == "null" ||
    time == "undefined"
  ) {
    return "";
  }
  time = time + "";
  var date = "";
  if (time.length >= 13) {
    date = new Date(parseInt(time));
  } else {
    date = new Date(parseInt(time + "000"));
  }
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";

  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  if (types == 'ms') {
    return M + D + h + m;
  } else {
    return Y + M + D;
  }

};

const timeRange = function (day) {
  var time = new Date().getTime();
  var endTime = parseInt(day) * 24 * 60 * 60 * 1000;
  time = time + endTime;
  var date = "";
  if (time.length >= 13) {
    date = new Date(parseInt(time));
  } else {
    date = new Date(parseInt(time));
  }
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  return Y + M + D + h + m;
};
const arrOrObj = function (array) {
  // 数组转对象
  var arr = {};
  for (var i in array) {
    var str = array[i].split(":");
    arr[str[0]] = str[1];
  }
  return arr;
};

const isWx = function () {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    //是微信
    return true;
  } else {
    return false;
  }
};

const isXcx = function () {
  let p = new Promise((resolve, reject) => {
    try {
      if (isWx()) {
        wx.miniProgram.getEnv((res) => {
          if (res.miniprogram) {
            resolve("true");
          } else {
            resolve("false");
          }
        });
      } else {
        reject("web");
      }
    } catch (error) {
      reject("web");
    }
  });
  return p;
};

const imgCompress = function (path, callback) {
  var img = new Image();
  img.src = path;
  Toast.clear();
  Toast.loading({
    mask: true,
    message: "上传中...",
    duration: 0,
  });
  // base64地址图片加载完毕后执行
  img.onload = () => {
    // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    // 图片原始尺寸
    var originWidth = img.width;
    var originHeight = img.height;
    // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
    var maxWidth = 750,
      maxHeight = 750;
    // 目标尺寸
    var targetWidth = originWidth,
      targetHeight = originHeight;
    // 图片尺寸超过最大尺寸的限制
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > maxWidth / maxHeight) {
        // 更改宽度，按照宽度限定尺寸
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
      } else {
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
      }
    }
    //对图片进行缩放
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // 清除画布
    context.clearRect(0, 0, targetWidth, targetHeight);
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 图片压缩
    context.drawImage(img, 0, 0, targetWidth, targetHeight);
    /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
    //压缩后的base64文件
    var newUrl = canvas.toDataURL("image/jpeg", 0.92);

    let file = convertBase64UrlToBlob(newUrl);

    var fd = new FormData();
    fd.append("file", file, "file_" + Date.parse(new Date()) + ".jpg");
    // fd.append("folder", 'product');

    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axios.post("/api/common/upload/index/", fd, config).then((res) => {
      Toast.clear();
      if (res.data.code == 200) {
        if (typeof callback === "function") {
          //调用它，既然我们已经确定了它是可调用的
          callback(res.data.result);
          Toast.success("上传成功");
        }
        return true;
      } else {
        Toast.fail("上传失败");
        return false;
      }
    });
  };
};
const convertBase64UrlToBlob = function (urlData) {
  let bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
  //处理异常,将ascii码小于0的转换为大于0
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: "image/png",
  });
};

var parentNode = null;
var node = null;
const getNode = function (json, nodeId) {
  //1.第一层 root 深度遍历整个JSON
  for (var i = 0; i < json.length; i++) {
    if (node) {
      break;
    }
    var obj = json[i];
    //没有就下一个
    if (!obj || !obj.id) {
      continue;
    }

    //2.有节点就开始找，一直递归下去
    // console.log(obj.url.indexOf(nodeId))
    if (obj.id == nodeId) {
      //找到了与nodeId匹配的节点，结束递归
      obj.index = i;
      node = obj;
      break;
    } else {
      //3.如果有子节点就开始找
      if (obj.z) {
        //4.递归前，记录当前节点，作为parent 父亲
        obj.index = i;
        parentNode = obj;
        //递归往下找
        getNode(obj.z, nodeId);
      } else {
        //跳出当前递归，返回上层递归
        continue;
      }
    }
  }

  //5.如果木有找到父节点，置为null，因为没有父亲
  if (!node) {
    parentNode = null;
  }

  //6.返回结果obj
  return {
    parentNode: parentNode,
    node: node,
  };
};
const getCheck = function (arr, data, city = []) {
  if (typeof data === "object") {
    for (let i = 0; arr[i] !== undefined; i++) {
      for (let j = 0; data[j] !== undefined; j++) {
        if (arr[i] === data[j].id) {
          city.push(data[j]);
        }
      }
    }
    for (let i = 0; data[i] !== undefined; i++) {
      this.getCheck(arr, data[i].z, city);
    }
  }
  return city;
};
const getImageBase64 = function (path, callback) {
  var protocol = "http:" || location.protocol;
  path = path.replace(/https:/, protocol);
  var img = new Image();
  img.crossOrigin = "anonymous";
  img.src = path;
  img.onload = function () {
    // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    // 图片原始尺寸
    var originWidth = img.width;
    var originHeight = img.height;
    // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
    var maxWidth = 750,
      maxHeight = 750;
    // 目标尺寸
    var targetWidth = originWidth,
      targetHeight = originHeight;
    // 图片尺寸超过最大尺寸的限制
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > maxWidth / maxHeight) {
        // 更改宽度，按照宽度限定尺寸
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
      } else {
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
      }
    }
    //对图片进行缩放
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // 清除画布
    context.clearRect(0, 0, targetWidth, targetHeight);
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 图片压缩
    context.drawImage(img, 0, 0, targetWidth, targetHeight);

    var dataURL = canvas.toDataURL("image/jpeg");
    callback.call(this, dataURL); //回掉函数获取Base64编码
    canvas = null;
  };
};
const isWeb = function () {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    return false;
  } else {
    return true;
  }
};
const isapp = function () {
  //是否为app环境
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/isapp/i) == "isapp") {
    return true;
  }
  return false;
};

const deleteNumber = function (str) {
  str = str + "";
  return str.replace(/[0-9]/gi, "");
};

const oneArrTwoArr = function (arr, n) {
  let objArray = arr;
  let len = objArray.length;
  n = n || 4; //假设每行显示4个
  let lineNum = len % n === 0 ? len / n : Math.floor(len / n + 1);
  let res = [];
  for (let i = 0; i < lineNum; i++) {
    let temp = objArray.slice(i * n, i * n + n);
    res.push(JSON.parse(JSON.stringify(temp)));
  }
  return res;
};
const isYkAPP = function () {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    return true;
  } else {
    return false;
  }
};
const playVideo = function (url, direction, autoplay, full) {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    try {
      // eslint-disable-next-line no-undef
      ykAPP.playVideo(url, direction, autoplay, full);
    } catch (error) {
      Toast("您当前版本过低，请下载最新版本");
    }
  } else {
    Toast("您当前版本过低，请下载最新版本");
  }
};

const toLinks = function (url) {
  if (url) {
    if (url.indexOf("http") >= 0 || url.indexOf("www") >= 0) {
      location.href = url;
    } else {
      router.push(url);
    }
  }
};
const toNews = function (row) {
  if (row.link) {
    window.location.href = row.link;
  } else if (row.aid) {
    router.push("/news/news_detail?news_id=" + row.aid);
  } else {
    router.push("/news/news_detail?news_id=" + row.id);
  }
};
const postData = function (data) {
  window.webkit.messageHandlers.ykApp.postMessage({ data });
};
const appShare = function (title, title1, url, url1, desc, img) {
  // number = Number(number)
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0" || isnewapp == undefined || isnewapp == "undefined") {
      try {
        // eslint-disable-next-line no-undef
        ykAPP.shareTitleTextUrlOneUrlTwo(title, title, url, url, desc, img);
      } catch (error) {
        // eslint-disable-next-line no-undef
        ykAPP.shareTitleTextUrlOneUrlTwo(title, title, url, url);
      }
    } else {
      var data = {
        type: "share",
        url: url,
        title: title,
        text: desc,
        imageurl: img,
      };
      postData(data);
    }
  }
};
const appOpenUrl = function (url) {
  // number = Number(number)
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      ykAPP.goTb(url);
    } else {
      var data = {
        type: "openurl",
        data: url,
      };
      postData(data);
    }
  }
};
const appAlipay = function (datas) {
  //app支付宝支付
  // number = Number(number)
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      ykAPP.aliPay(datas);
    } else {
      var data = {
        type: "alipay",
        data: datas,
      };
      postData(data);
    }
  }
};
const appScan = function () {
  // number = Number(number)
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      ykAPP.scan();
    } else {
      var data = {
        type: "scan",
        data: "",
      };
      postData(data);
    }
  }
};
const appNav = function (lai, lon) {
  //app支付宝支付
  // number = Number(number)
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      ykAPP.getLatitudeLongitude(lai, lon);
    } else {
      var data = {
        type: "navigation",
        lai: lai,
        lon: lon,
      };
      postData(data);
    }
  }
};
const appPlayVideo = function (url, direction, autoplay, full) {
  //app支付宝支付
  // number = Number(number)
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      playVideo(url, direction, autoplay, full);
    } else {
      var data = {
        type: "video",
        videoUrl: url,
      };
      postData(data);
    }
  }
};
const appWxLogin = function () {
  //app登录
  // number = Number(number)
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      ykAPP.wxLogin();
    } else {
      var data = {
        type: "wxLogin",
      };
      postData(data);
    }
  }
};
const appAlipayLogin = function (appid, username, appsecret) {
  //app支付宝登录
  // number = Number(number)
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      try {
        // eslint-disable-next-line no-undef
        ykAPP.aliLogin(appid, username, appsecret);
      } catch (error) {
        // eslint-disable-next-line no-undef
        ykAPP.aliLogin();
      }
    } else {
      var data = {
        type: "aliLogin",
        appid,
        username,
        appsecret,
      };
      postData(data);
    }
  }
};

const appdouyinLogin = function () {
  //抖音登录
  // number = Number(number)
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      ykAPP.tikTokLogin();
    } else {
      var data = {
        type: "douyinLogin",
      };
      postData(data);
    }
  }
};
const appSinaLogin = function () {
  //新浪登录
  // number = Number(number)
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      ykAPP.sinaLogin();
    } else {
      var data = {
        type: "sinaLogin",
      };
      postData(data);
    }
  }
};
const appIosLogin = function () {
  //app登录
  // number = Number(number)
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
    } else {
      var data = {
        type: "appleLogin",
      };
      postData(data);
    }
  }
};
const appJumpAction = function () {
  //
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  // number = Number(number)
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      try {
        // eslint-disable-next-line no-undef
        ykAPP.jump(window.location.href);
      } catch (error) {
        console.log(1);
      }
    } else {
      var data = {
        type: "jump",
        url: window.location.href,
      };
      postData(data);
    }
  }
};
const appface = function (jsonstr) {
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      try {
        // eslint-disable-next-line no-undef
        ykAPP.face(jsonstr);
      } catch (error) { }
    } else {
      var data = {
        type: "authenticate",
        data: jsonstr,
      };
      postData(data);
    }
  }
};
const get_int_dec = function (num, type) {
  // @type  int-整数部分 ,dec - 小数部分
  num = num + "";
  num = num.toString();
  var decimal = 2;
  decimal = decimal >= 2 && decimal < 6 ? 2 : decimal;
  decimal = decimal == "0" ? 0 : decimal || 2;
  let index = num.indexOf(".");
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1);
  } else {
    num = num.substring(0);
  }
  num = parseFloat(num).toFixed(decimal);
  if (type == "int") {
    return parseInt(num);
  } else if (type == "dec") {
    return "." + num.toString().split(".")[1] || ".00";
  }
};
const goLink = function (val) {
  if (
    navigator.userAgent.indexOf("miniProgram") != -1 &&
    val == "/supplier/new-shops"
  ) {
    window.location.href = `${window.location.origin}/supplier/new-shops`;
  } else if (val == "/page/producting") {
    Toast({ message: "正在开发中...", duration: 1500 });
  } else if (val.indexOf("tel") >= 0 && val.indexOf("num") >= 0) {
    //拨打电话 /tel?num=xxxxxxxxxxx
    getUrlquery(val, "num") && tel(getUrlquery(val, "num"));
  } else if (val == "" || val == null || val == undefined) {
    // Toast.fail("功能暂时未开放");
  } else if (/.*[\u4e00-\u9fa5]+.*$/.test(val)) {
    Toast({ message: val, duration: 1500 });
  } else {
    if (
      (val + "").indexOf("http") >= 0 ||
      (val + "").indexOf("www") >= 0 ||
      val == "/supplier/new-shops"
    ) {
      window.location.href = val;
    } else {
      router.push(val);
    }
  }
};
const getUrlquery = function (url, queryName) {
  var reg = new RegExp("(^|&?)" + queryName + "=([^&]*)(&|$)", "i");
  var r = url.match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  } else {
    return null;
  }
};

/* app下载视频 */
const appdownvideo = function (url) {
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      try {
        // eslint-disable-next-line no-undef
        ykAPP.downVideo(url);
      } catch (error) { }
    } else {
      var data = {
        type: "downVideo",
        url: url,
      };
      postData(data);
    }
  }
};
/* app开始录音 */
const appstartRecord = function () {
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      try {
        // eslint-disable-next-line no-undef
        ykAPP.startRecord();
      } catch (error) { }
    } else {
      var data = {
        type: "startRecord",
      };
      postData(data);
    }
  }
};
/* app停止录音 */
const appstopRecord = function () {
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      try {
        // eslint-disable-next-line no-undef
        ykAPP.stopRecord();
      } catch (error) { }
    } else {
      var data = {
        type: "stopRecord",
      };
      postData(data);
    }
  }
};
/* app取消录音 */
const appcancelRecord = function () {
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      try {
        // eslint-disable-next-line no-undef
        ykAPP.cancleRecord();
      } catch (error) { }
    } else {
      var data = {
        type: "cancleRecord",
      };
      postData(data);
    }
  }
  /* app录制短视频 */
};
const appRecordVideo = function () {
  var isnewapp;
  try {
    isnewapp = Cookies.get("newapp") || "0";
  } catch (error) {
    isnewapp = "0";
  }
  if (isnewapp == undefined) {
    isnewapp = "0";
  }
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/ykapp/i) == "ykapp") {
    if (isnewapp == "0") {
      // eslint-disable-next-line no-undef
      try {
        // eslint-disable-next-line no-undef
        ykAPP.shortVideoRecord();
      } catch (error) { }
    } else {
      var data = {
        type: "shortVideoRecord",
      };
      postData(data);
    }
  }
};
const record_footprint = function (obj) {
  //添加浏览记录
  api.getPage.add_footprint(obj);
};

const urlparse = function (url) {
  // let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345','&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substr(1).split("=");
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};
const Base64Uploadimg = function (baseStr, is_tip = true) {
  return new Promise((resove, reject) => {
    let file = convertBase64UrlToBlob(baseStr);
    var fd = new FormData();
    fd.append("file", file, "file_" + Date.parse(new Date()) + ".jpg");
    // fd.append("folder", 'product');

    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    axios.post("/api/common/upload/index/", fd, config).then((res) => {
      Toast.clear();
      if (res.data.code == 200) {
        is_tip && Toast.success("上传成功");
        resove(res.data.result);
      } else {
        is_tip && Toast.fail("上传失败");
        reject(false);
      }
    });
  });
};

// 计算日期 多少分钟前
const timeago = function (dateTimeStamp) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp * 1000;
  if (diffValue < 0) {
    return "";
  }
  var result = "";
  var minC = diffValue / minute;
  var hourC = diffValue / hour;
  var dayC = diffValue / day;
  var weekC = diffValue / week;
  var monthC = diffValue / month;
  if (monthC >= 1 && monthC <= 3) {
    result = " " + parseInt(monthC) + "月前";
  } else if (weekC >= 1 && weekC <= 3) {
    result = " " + parseInt(weekC) + "周前";
  } else if (dayC >= 1 && dayC <= 6) {
    result = " " + parseInt(dayC) + "天前";
  } else if (hourC >= 1 && hourC <= 23) {
    result = " " + parseInt(hourC) + "小时前";
  } else if (minC >= 1 && minC <= 59) {
    result = " " + parseInt(minC) + "分钟前";
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = "刚刚";
  } else {
    var datetime = new Date();
    datetime.setTime(dateTimeStamp * 1000);
    var Nyear = datetime.getFullYear();
    var Nmonth =
      datetime.getMonth() + 1 < 10
        ? "0" + (datetime.getMonth() + 1)
        : datetime.getMonth() + 1;
    var Ndate =
      datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    result = Nyear + "-" + Nmonth + "-" + Ndate;
  }
  return result;
};

//跳转登录页
const toLoginPage = function (params) {
  if (
    router.currentRoute.fullPath.indexOf("login") == -1 &&
    router.currentRoute.fullPath.indexOf("applets") == -1
  ) {
    var is_wx_login = sessionStorage.getItem("is_wx_login") || "1";
    if (isWx()) {
      sessionStorage.setItem("url", location.href);
      localStorage.setItem("login-url", router.currentRoute.fullPath);
      var index = localStorage.getItem("toappletsIndex") || 0;
      isXcx().then((res) => {
        if (res == "true" || res == true) {
          if (index == undefined || index == 0) {
            localStorage.setItem("toappletsIndex", index + 1);
            if (
              localStorage.getItem("applets_uid") &&
              localStorage.getItem("applets_user_key")
            ) {
              router.push("/page/applets");
            } else {
              wx.miniProgram.navigateTo({
                url: `/pages/login/login?final_link=${router.currentRoute.fullPath}`,
              });
            }
          }
        } else if (is_wx_login == 1) {
          router.replace({
            path: "/wxlogin",
            query: {
              redirect: router.currentRoute.fullPath,
            },
          });
        } else {
          router.replace({
            path: "/login",
            query: {
              redirect: router.currentRoute.fullPath,
            },
          });
        }
      });
    } else {
      router.replace({
        path: "/login",
        query: {
          redirect: router.currentRoute.fullPath,
        },
      });
    }
    store.state.isLogin = false;
    store.state.user = {};
    store.state.imreward = "";
    Cookies.remove("user");
    Cookies.remove("user_username");
    if (Cookies.get("appletUser")) {
      //如果存在applerUser cookie 也去除
      Cookies.remove("appletUser");
    }
  }
};
export default {
  regexp,
  getImgUrl,
  toFixedZ,
  getMonthAndDay,
  getTimeFormat,
  getTimeHour,
  mstime,
  tel,
  getNyr,
  ykAPPCopy,
  timeRange,
  arrOrObj,
  isWx,
  isXcx,
  imgCompress,
  getNode,
  ykAppUpImage,
  getCheck,
  getImageBase64,
  isWeb,
  isapp,
  deleteNumber,
  oneArrTwoArr,
  isYkAPP,
  playVideo,
  toLinks,
  toNews,
  postData,
  appShare,
  appOpenUrl,
  appAlipay,
  appScan,
  appNav,
  appPlayVideo,
  appWxLogin,
  appAlipayLogin,
  appdouyinLogin,
  appSinaLogin,
  appIosLogin,
  appJumpAction,
  get_int_dec,
  appface,
  goLink,
  getUrlquery,
  appdownvideo,
  appstartRecord,
  appstopRecord,
  appcancelRecord,
  appRecordVideo,
  record_footprint,
  urlparse,
  Base64Uploadimg,
  timeago,
  toLoginPage,
};
