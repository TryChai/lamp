/* eslint-disable */
import axios from "axios";
import router from "../../../router";
import Cookies from "js-cookie";
import store from "../../../store/index";
import fnc from "./../fnc/fnc";
var md5 = require("md5");
import wx from "weixin-js-sdk";
import { Toast } from "vant";
Toast.allowMultiple();

var isLoading = false;
var count = 0;
var Timer = null;

const toLogin = () => {
  if (
    router.currentRoute.fullPath.indexOf("login") == -1 &&
    router.currentRoute.fullPath.indexOf("applets") == -1
  ) {
    var is_wx_login = sessionStorage.getItem("is_wx_login") || "1";
    if (fnc.isWx()) {
      sessionStorage.setItem("url", location.href);
      localStorage.setItem("login-url", router.currentRoute.fullPath);
      var index = localStorage.getItem("toappletsIndex") || 0;

      fnc.isXcx().then((res) => {
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
      //????????????applerUser cookie ?????????
      Cookies.remove("appletUser");
    }
  }
};
/**
 * ??????????????????
 * TIME_OUT???ERR_OK
 */
export const TIME_OUT = 120000; // ??????????????????
// export const baseUrl = process.env.BASE_URL   // ????????????url????????????????????????process.env?????????????????????????????????????????????????????????
// ???????????????
var instance = axios.create({
  timeout: 120000,
});

instance.defaults.baseURL = "/api";

// ??????????????????
instance.defaults.timeout = TIME_OUT;
instance.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
// ??????????????????
instance.interceptors.request.use(
  (config) => {
    var bool = false;
    var arr = [
      "/mobile/plugin_im/sms",
      "news/news_lists",
      "mobile/coupon/get_new_coupon",
      "mobile/page/product",
      "juhe_recharge/init",
      "/mobile/lesson/lesson_stage_hit",
      "drag/come_over_news",
      "drag/come_news",
      "news/news_tj",
      "news/product",
      "product/cart_number",
      "ucenter/user_all",
      "plugin_big/ask",
      "product/lists",
      "order_pay/product",
      "news_collect",
      "page/product",
      "price",
      "recent_transaction",
      "recommend",
      "is_have_user",
      "finger_lists",
      "success",
      "search",
      "reward",
      "seven_day",
      "come_over",
      "im_text",
      "come",
      "plugin_open_all",
      "config",
      "is_remark",
      "seven_day",
      "is_sign",
      "number",
      "microshop/my_lists",
      "live/live_save",
      "power/plugin_open_one",
      "live/live_like",
      "live/now_playback",
      "live/live_index",
      "live/live_open_online",
      "microshop/lists",
      "live/tourists",
      "auction/info",
      "live/video_volume",
      "driving/member",
      "driving/member2",
      "driving/position",
    ]; //?????????load
    var url = config.url;
    for (var i in arr) {
      if (url.indexOf(arr[i]) != -1) {
        bool = true;
        break;
      } else {
        bool = false;
      }
    }

    //??????????????? ??????????????????3s??????????????????
    if (Timer) {
      count = 0;
      clearInterval(Timer);
    }
    Timer = setInterval(() => {
      count += 1;
      if (count >= 2 && !bool) {
        Toast.loading({
          mask: false,
          message: "?????????...",
          duration: 0,
        });
      }
    }, 1000);
    // Toast.loading({
    //   mask: false,
    //   message: "?????????...",
    //   duration: 0,
    // });
    // if (!bool) {
    //   console.log(Timer);
    //   Toast.loading({
    //     mask: false,
    //     message: "?????????...",
    //     duration: 0,
    //   });
    // }

    var user = Cookies.get("user")
      ? JSON.parse(Cookies.get("user"))
      : {
          uid: "",
          user_key: "",
        };

    const uid = user.uid;

    config.headers.uid = uid || "";
    const meid = "";
    var extra = "";
    config.headers.meid = meid;

    if (config.data.indexOf("extra") >= 0) {
      extra = "applets";
    }
    config.headers.extra = extra;

    const time = parseInt(new Date().getTime() / 1000) + "";
    config.headers.timestamp = time;

    const user_key = user.user_key;
    var str = config.data;
    // str = str.replace(/undefined/gi, "");
    var url = "";
    if (str == "") {
      url =
        "user_key=" +
        user_key +
        "&uid=" +
        uid +
        "&timestamp=" +
        time +
        "&meid=" +
        "" +
        "&extra=" +
        extra;
    } else {
      url =
        str +
        "&user_key=" +
        user_key +
        "&uid=" +
        uid +
        "&timestamp=" +
        time +
        "&meid=" +
        "" +
        "&extra=" +
        extra;
    }
    var arr = url.split("&");

    for (var i in arr) {
      if (arr[i].indexOf("%") >= 0) {
        arr[i] = decodeURIComponent(arr[i]);
      }
    }

    let obj = {};
    let arr2 = arr;
    arr2.forEach((item) => {
      item = item.split("=");
      var two = "";
      for (let index = 1; index < item.length; index++) {
        if (item.length > 2) {
          two = two + item[index] + "=";
        } else {
          two = two + item[index];
        }
      }
      if (item.length > 2) {
        two = two.substring(0, two.length - 1);
      }
      obj[item[0]] = two;
    });
    var obj_str = Object.keys(obj).sort();
    var str = "";

    obj_str.forEach((item) => {
      str = str + `${item}=${obj[item] || ""}&`;
    });
    str = str.substring(0, str.length - 1);
    // console.log(str);
    config.data += "&sign=" + md5("@" + str + "@");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ???????????????????????????token????????????
instance.interceptors.response.use(
  (response) => {
    // var isReg=response.config.url.indexOf("is_have_user")==-1;  // finger_lists????????????
    var isReg = false;
    var arr = [
      "is_have_user",
      "finger_lists",
      "success",
      "search",
      "reward",
      "seven_day",
    ];
    var url = response.config.url.slice(
      response.config.url.lastIndexOf("/") + 1
    );

    if (arr.indexOf(url) >= 0) {
      isReg = false;
    } else {
      isReg = true;
    }

    let { data } = response;
    // setTimeout(()=>{
    if (Timer) {
      count = 0;
      clearInterval(Timer);
    }
    Toast.clear(true);

    // },300)
    if (data.code == 200) {
      return Promise.resolve(data);
    } else if (data.result == "ID????????????") {
    } else if (data.code == 603) {
      //??????????????????
      sessionStorage.setItem("is_wx_login", "0");

      if (data.result) {
        Toast.fail(data.result);
      }
      store.state.isLogin = false;
      store.state.user = {};
      store.state.imreward = "";
      setTimeout(() => {
        toLogin();
      }, 3000);
    } else if (data.code == 602 || data.code == 606 || data.code == 401) {
      //???????????????
      if (data.result) {
        Toast.fail(data.result);
      }
      store.state.isLogin = false;
      store.state.user = {};
      store.state.imreward = "";
      setTimeout(() => {
        toLogin();
      }, 3000);
    } else if (data.code == 604) {
      //??????????????????????????? uid???user_key ??????????????????????????????
      localStorage.removeItem("applets_uid");
      localStorage.removeItem("applets_user_key");

      wx.miniProgram.navigateTo({
        url: `/pages/login/login?final_link=${router.currentRoute.fullPath}`,
      });
    } else if (data.code == 10007) {
      Toast.fail(data.result);
      setTimeout(() => {
        router.go(-1);
      }, 3000);
    } else if (data.code == 10008) {
      //???????????????????????????????????????????????????
      if (data.result.info) {
        Toast.fail(data.result.info);
        setTimeout(() => {
          router.replace(data.result.url);
        }, 3000);
      } else {
        if (data.result.url.substring(0, 4) == "http") {
          if (
            sessionStorage.getItem("is_XcX") &&
            !sessionStorage.getItem("isiOS") &&
            fnc.isWx()
          ) {
            window.location.href =
              window.location.origin + "/#" + data.result.url + "&VNK=b0277841";
          } else {
            window.location.href = data.result.url;
          }
        } else {
          // var parseobj = fnc.urlparse(data.result.url);
          // router.push({
          //   path: "/login",
          //   query: {
          //     redirect: parseobj.redirect || parseobj.url,
          //     tshare: parseobj.tshare || "",
          //   },
          // });
          router.replace(data.result.url);
        }
      }
    } else if (data.code == 10010) {
      //?????????10010  ???????????????replace
      if (data.result.info) {
        Toast(data.result.info);
        setTimeout(() => {
          router.replace(data.result.url);
        }, 500);
      }
    } else {
      if (data.code != 10004 && isReg) {
        Toast.fail(data.result);
      }
    }
    return Promise.resolve(data);
  },
  (error) => {
    if (Timer) {
      count = 0;
      clearInterval(Timer);
    }
    Toast.clear(true);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          break;
        case 403:
          toLogin();
          break;

        // 404???????????????
        case 404:
          break;

        default:
        // Toast.fail("???????????????????????????");
      }
    }
    return Promise.reject(error.response);
  }
);

export default instance;
