const md5 = require("md5");
import Cookies from "js-cookie";
import store from "./../../../../src/store/index";

// const APPNAME = store.state.config.shop.live_url;
const video = {
  // StreamName  --直播间ID       推流

  pushUrl: function(StreamName, APPNAME) {
    const pull_url = "rtmp://vidt.inexcn.cn";
    const pull_key = "W5IrZWgCXx";
    let part_url = "/" + APPNAME + "/" + StreamName;
    let time = Date.parse(new Date()) / 1000 + 30 * 60;
    let concatStr = part_url + "-" + time + "-0-0-" + pull_key;
    let md5str = md5(concatStr);
    let authKey = time + "-0-0-" + md5str;
    let final_url = pull_url + part_url + "?auth_key=" + authKey;
    return final_url;
  },

  //StreamName --直播间ID   拉流
  playUrl: function(StreamName, type, APPNAME) {
    const HOST = "vid.inexcn.cn"; //域名
    const pull_key = "mB9QTchDyZ";
    let time = Date.parse(new Date()) / 1000 + 30 * 60;
    let strRtmp =
      "/" + APPNAME + "/" + StreamName + "-" + time + "-0-0-" + pull_key;
    let strFlv =
      "/" + APPNAME + "/" + StreamName + ".flv-" + time + "-0-0-" + pull_key;
    let strm3u8 =
      "/" + APPNAME + "/" + StreamName + ".m3u8-" + time + "-0-0-" + pull_key;
    let urlRtmp = `rtmp://${HOST}/${APPNAME}/${StreamName}?auth_key=${time}-0-0-${md5(
      strRtmp
    )}`;
    let urlFlv = `http://${HOST}/${APPNAME}/${StreamName}.flv?auth_key=${time}-0-0-${md5(
      strFlv
    )}`;
    2;
    let urlm3u8 = `http://${HOST}/${APPNAME}/${StreamName}.m3u8?auth_key=${time}-0-0-${md5(
      strm3u8
    )}`;
    if (type == "rtmp") {
      return urlRtmp;
    } else if (type == "flv") {
      return urlFlv;
    } else {
      return urlm3u8;
    }
  },

  postData: function(data) {
    window.webkit.messageHandlers.ykApp.postMessage({
      data,
    });
  },
  /* app直播下播*/
  closeLive: function() {
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
          ykAPP.closeLive();
        } catch (error) {}
      } else {
        var data = {
          type: "closeLivePush",
          data: "",
        };
        this.postData(data);
      }
    }
  },

  /*摄像头旋转 0 前置 1 后置*/
  liveCameraRotate: function(type) {
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
          ykAPP.liveCameraRotate(type);
        } catch (error) {}
      } else {
        var data = {
          type: "liveCameraRotate",
          data: type,
        };
        this.postData(data);
      }
    }
  },

  // liveBeautyBuffing(int value) 磨皮
  // liveBeautyBigEye(int value) 大眼
  // liveBeautyThinFace(int value) 瘦脸
  liveBeautyBuffing: function(num) {
    var isnewapp;
    try {
      isnewapp = Cookies.get("newapp") || "0";
    } catch (error) {
      isnewapp = "0";
    }
    if (isnewapp == undefined) {
      isnewapp = "0";
    }
    console.log("磨皮", num);
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/ykapp/i) == "ykapp") {
      if (isnewapp == "0") {
        // eslint-disable-next-line no-undef
        try {
          // eslint-disable-next-line no-undef
          ykAPP.liveBeautyBuffing(num);
        } catch (error) {}
      } else {
        var data = {
          type: "liveBeautyBuffing",
          value: num,
        };
        this.postData(data);
      }
    }
  },
  liveBeautyBigEye: function(num) {
    var isnewapp;
    try {
      isnewapp = Cookies.get("newapp") || "0";
    } catch (error) {
      isnewapp = "0";
    }
    if (isnewapp == undefined) {
      isnewapp = "0";
    }
    console.log("大眼", num);
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/ykapp/i) == "ykapp") {
      if (isnewapp == "0") {
        // eslint-disable-next-line no-undef
        try {
          // eslint-disable-next-line no-undef
          ykAPP.liveBeautyBigEye(num);
        } catch (error) {}
      } else {
        var data = {
          type: "liveBeautyBigEye",
          value: num,
        };
        this.postData(data);
      }
    }
  },
  liveBeautyThinFace: function(num) {
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
          ykAPP.liveBeautyThinFace(num);
        } catch (error) {}
      } else {
        var data = {
          type: "liveBeautyThinFace",
          value: num,
        };
        this.postData(data);
      }
    }
  },

  //调起录制
  openVideoRecord: function(url) {
    console.log(url, "调起录制shortVideoRecord");
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
          ykAPP.shortVideoRecord(url);
        } catch (error) {}
      } else {
        var data = {
          type: "shortVideoRecord",
          url: url,
        };
        this.postData(data);
      }
    }
  },
  //退出录制
  closeVideoRecord: function() {
    console.log("退出录制shortVideoExist");
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
          ykAPP.shortVideoExist();
        } catch (error) {}
      } else {
        var data = {
          type: "shortVideoExist",
        };
        this.postData(data);
      }
    }
  },
  //设置短视频时长 默认15S
  setRecordTime: function(time) {
    console.log(time, "设置短视频时长shortVideoTimeLength");
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
          ykAPP.shortVideoTimeLength(time);
        } catch (error) {}
      } else {
        var data = {
          type: "shortVideoTimeLength",
          value: time,
        };
        this.postData(data);
      }
    }
  },

  //设置短视频美白 默认70
  setRecordWhite: function(value) {
    console.log(value, "设置短视频美白 shortVideoBeautyWhite");
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
          ykAPP.shortVideoBeautyWhite(value);
        } catch (error) {}
      } else {
        var data = {
          type: "shortVideoBeautyWhite",
          value: value,
        };
        this.postData(data);
      }
    }
  },

  //设置短视频磨皮 默认40
  setRecordBeautySkin: function(value) {
    console.log(value, "设置短视频磨皮 shortVideoBeautySkin");
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
          ykAPP.shortVideoBeautySkin(value);
        } catch (error) {}
      } else {
        var data = {
          type: "shortVideoBeautySkin",
          value: value,
        };
        this.postData(data);
      }
    }
  },

  //设置短视频切换摄像头 //0 正面 1 反面
  setRecordCamerDirct: function(value) {
    console.log(value, "设置短视频切换摄像头,shortVideoSwitchCameraDirct");
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
          ykAPP.shortVideoSwitchCameraDirct(value);
        } catch (error) {}
      } else {
        var data = {
          type: "shortVideoSwitchCameraDirct",
          cameraDirct: value,
        };
        this.postData(data);
      }
    }
  },

  // 触发延时拍摄
  delayVideoRecord: function() {
    console.log("触发延时拍摄,shortVideoDelay");
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
          ykAPP.shortVideoDelay();
        } catch (error) {}
      } else {
        var data = {
          type: "shortVideoDelay",
        };
        this.postData(data);
      }
    }
  },

  //开始录制
  startVideoRecord: function() {
    console.log("开始录制,shortVideoStart");
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
          ykAPP.shortVideoStart();
        } catch (error) {}
      } else {
        var data = {
          type: "shortVideoStart",
        };
        this.postData(data);
      }
    }
  },

  //停止录制
  stopVideoRecord: function() {
    console.log("暂停录制,shortVideoStop");
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
          ykAPP.shortVideoStop();
        } catch (error) {}
      } else {
        var data = {
          type: "shortVideoStop",
        };
        this.postData(data);
      }
    }
  },

  saveVideoRecord: function() {
    console.log("完成录制上传视频,shortVideoFinish");
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
          ykAPP.shortVideoFinish();
        } catch (error) {}
      } else {
        var data = {
          type: "shortVideoFinish",
        };
        this.postData(data);
      }
    }
  },
};
export default video;
