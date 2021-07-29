const md5 = require("md5");
import Cookies from "js-cookie";
import store from "./../../../../src/store/index";

const AudioVideoCall = {
  postData: function(data) {
    window.webkit.messageHandlers.ykApp.postMessage({
      data,
    });
  },
  /* 音视频登录*/
  audiovideoLogin: function() {
    var isnewapp;
    try {
      isnewapp = Cookies.get("newapp") || "0";
    } catch (error) {
      isnewapp = "0";
    }
    if (isnewapp == undefined) {
      isnewapp = "0";
    }
    var obj = {
      id: store.state.user.id,
      userName: store.state.user.nickname || store.state.user.username,
      avatar: store.state.user.avatar,
    };
    var json_str = JSON.stringify(obj);
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/ykapp/i) == "ykapp") {
      if (isnewapp == "0") {
        // eslint-disable-next-line no-undef
        try {
          // eslint-disable-next-line no-undef
          ykAPP.loginWithUser(json_str);
        } catch (error) {}
      } else {
        var data = {
          type: "loginWithUser",
          data: json_str,
        };
        this.postData(data);
      }
    }
  },
  /* 音视频退出*/
  audiovideoLogout: function() {
    var isnewapp;
    try {
      isnewapp = Cookies.get("newapp") || "0";
    } catch (error) {
      isnewapp = "0";
    }
    if (isnewapp == undefined) {
      isnewapp = "0";
    }
    var json_str = JSON.stringify(obj);
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/ykapp/i) == "ykapp") {
      if (isnewapp == "0") {
        // eslint-disable-next-line no-undef
        try {
          // eslint-disable-next-line no-undef
          ykAPP.logout();
        } catch (error) {}
      } else {
        var data = {
          type: "logout",
        };
        this.postData(data);
      }
    }
  },
  //音频通话
  audiocall(json_str) {
    console.log(json_str)
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
          ykAPP.audioCall(json_str);
        } catch (error) {}
      } else {
        var data = {
          type: "audioCall",
          data: json_str,
        };
        this.postData(data);
      }
    }
  },
  //视频通话
  videocall(json_str) {
    console.log(json_str);
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
          ykAPP.videoCall(json_str);
        } catch (error) {}
      } else {
        var data = {
          type: "videoCall",
          data: json_str,
        };
        this.postData(data);
      }
    }
  },
};
export default AudioVideoCall;
