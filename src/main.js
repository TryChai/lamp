import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import wx from "weixin-js-sdk";
import "./assets/css/base.css";
import global from './global.js'

// import VueParticles from 'vue-particles'
// Vue.use(VueParticles)

import tim from "./tim";
import TIM from "tim-js-sdk";

import "../src/assets/icon/iconfont.css";
import "../src/assets/icon/iconfont1.css";
import Cookies from "js-cookie";

import "font-awesome.css";

import animate from "animate.css";

Vue.use(animate);

window.tim = tim;

window.TIM = TIM;
Vue.prototype.$bus = new Vue(); // event Bus 用于无关系组件间的通信。
Vue.prototype.tim = tim;
Vue.prototype.TIM = TIM;

import "@babel/polyfill";
import Es6Promise from "es6-promise";
Es6Promise.polyfill();

import waterfall from "vue-waterfall2";
Vue.use(waterfall);

import "amfe-flexible";

//移动端点击300ms延迟
import FastClick from "fastclick";

const str = navigator.userAgent.toLowerCase();
const ver = str.match(/cpu iphone os (.*?) like mac os/);

import wxApi from "../src/assets/js/wechatConfig";
Vue.prototype.wxApi = wxApi;

if (!ver) {
  // 非IOS系统
  // 引入fastclick 做相关处理
  FastClick.attach(document.body);
} else {
  if (parseInt(ver[1]) < 11) {
    // 引入fastclick 做相关处理
    FastClick.attach(document.body);
  }
}

//api接口
import api from "../src/assets/js/api/require/index";
Vue.prototype.$api = api;

//注册过滤器
import filters from "./assets/js/filter/filter";
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

// 长连接
var klineServe = "";
if (window.location.protocol == "http:") {
  klineServe = "ws://47.107.110.127:8080";
} else {
  // klineServe = "wss://47.107.110.127:8080";
  klineServe = "wss://show26.vi5.cn";
}
Vue.prototype.klineServe = klineServe;

import upImg from "../src/assets/js/uploadImg";
Vue.prototype.$upImg = upImg;
//密码RSA加密
import getCode from "../src/assets/js/createRsa";
Vue.prototype.$getCode = getCode;
//Vant 全局组件
//Vant 全局组件

import VueJsonp from "vue-jsonp";
Vue.use(VueJsonp);

import {
  Row,
  Col,
  Cell,
  CellGroup,
  Lazyload,
  Dialog,
  Toast,
  Tab,
  Tabs,
  Popup,
  Uploader,
  Icon,
  NavBar,
  Button,
  DropdownMenu,
  DropdownItem,
  Search,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  NoticeBar,
  RadioGroup,
  Radio,
  NumberKeyboard,
  Switch,
  Rate,
  Divider,
  Field,
  Picker,
  List,
  Loading,

} from "vant";
Vue.use(Row)
  .use(Col)
  .use(Cell)
  .use(CellGroup)
  .use(Dialog)
  .use(Toast)
  .use(Tab)
  .use(Tabs)
  .use(Popup)
  .use(Uploader)
  .use(Icon)
  .use(NavBar)
  .use(Button)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Search)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(NoticeBar)
  .use(RadioGroup)
  .use(Radio)
  .use(Divider)
  .use(NumberKeyboard)
  .use(Switch)
  .use(Field)
  .use(Picker)
  .use(List)
  .use(Loading)
  .use(Rate);
const options = {
  error: require("../src/assets/img/productDefault.jpg"),
};
Vue.use(Lazyload, options);

//通用函数
import fnc from "../src/assets/js/fnc/fnc.js";
Vue.prototype.$fnc = fnc;
//路由跳转
import Navigation from "vue-navigation";
Vue.use(Navigation, {
  router,
});

Vue.prototype.windowScorll = function() {
  window.scroll(0, 0);
};

//复制
import clipboard from "clipboard";
Vue.prototype.clipboard = clipboard;

var appusers = Cookies.get("user")
  ? JSON.parse(Cookies.get("user"))
  : {
      uid: 0,
    };
Vue.prototype.appusers = appusers;

Vue.config.productionTip = false;

Vue.prototype.toBack = function() {
  var path = sessionStorage.getItem("to") || "/";
  if (path == "/") {
    router.push({
      path: path,
    });
  } else {
    router.go(-1);
  }
};
Vue.prototype.$h = (name) => {
  return name;
};
//顶部进度条
import NProgress from "nprogress"; //引入自定义css是为了覆盖掉默认的进度条的颜色
import "./assets/css/nprogress.css";
NProgress.configure({
  easing: "ease", // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});
var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

import { wxshare } from "../src/assets/js/wxShare";
Vue.use(wxshare);


router.beforeEach((to, from, next) => {
  // console.log(to)
  fnc.appJumpAction();
  var username = Cookies.get("user_username")
    ? Cookies.get("user_username")
    : "undefined";

  var user = Cookies.get("user") ? false : true; // 得到登陆状态 false是已登录;
  if (user) {
    localStorage.setItem("toappletsIndex", 0);
  }

  var isProductLocking = Cookies.get("isProductLocking")
    ? Cookies.get("isProductLocking")
    : "0";
  var isNewsLocking = Cookies.get("isNewsLocking")
    ? Cookies.get("isNewsLocking")
    : "0";
  var isEwmLocking = Cookies.get("isEwmLocking")
    ? Cookies.get("isEwmLocking")
    : "0";
  var is_wx_login = sessionStorage.getItem("is_wx_login") || "1"; //微信自动登录
  var isxcx = navigator.userAgent.indexOf("miniProgram") !== -1 ? true : false;

  //小程序第一次访问时，会回调回经纬度从而获取位置
  if (
    to.query.latitude &&
    to.query.longitude &&
    navigator.userAgent.indexOf("miniProgram") !== -1
  ) {
    var obj = {
      latitude: to.query.latitude,
      longitude: to.query.longitude,
    };
    localStorage.setItem("NowPosition", JSON.stringify(obj));
  }
  // app端未登陆 直接跳转登陆页面
  if (fnc.isapp() && user) {
    next({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    });
    return;
  }
  if (to.name == "applets_service") {
    //小程序客服
    try {
      wx.miniProgram.navigateTo({
        url: `/pages/service/service`,
      });
    } catch (error) {
      next({
        path: "/",
      }); // 未登陆
    }
  }
  if (to.name == "supplierdetails") {
    //拦截供应商详情页
    next({
      path: "/supplier/suppliershopdetails",
      query: {
        id: to.query.id,
      },
    });
  }
  
 
  if (to.name == "shops-con") {
    //拦截供应商详情页
    var supStr = "";
    if (to.query.cate) {
      supStr += "&cate=" + to.query.cate;
    }
    if (to.query.shop_is_home) {
      supStr += "&shop_is_home=" + to.query.shop_is_home;
    }
    if (str == "") {
      next("/supplier/new-shops");
    } else {
      next("/supplier/new-shops?" + supStr);
    }
  }

  //微信分享
  let authUrl = `${window.location.origin}${to.fullPath}`;
  if (!sessionStorage.getItem("url")) {
    sessionStorage.setItem("url", window.entryUrl);
  }
  if (isxcx) {
    window.wechaturl = window.location + "";
  }
  if (to.path != "/") {
    if (isiOS && fnc.isWx()) {
      if (window.entryUrl == "" || window.entryUrl == undefined) {
        window.entryUrl = authUrl; // 将后面的参数去除
      }
    }
  }
  if (!fnc.isWx()) {
    // NProgress.start();
  }
  if (
    from.path != to.path &&
    from.path != "/" &&
    to.path.indexOf("login") == -1
  ) {
    sessionStorage.setItem("to", from.path);
  }

  var foot = Cookies.get("foot") ? JSON.parse(Cookies.get("foot")) : "";
  var reg_permission = sessionStorage.getItem("reg_permission") || "0";

  var isTo = to.path.indexOf("/im") >= 0 || to.path.indexOf("/setting") >= 0;

  var isMember =
    to.path.indexOf("/member") >= 0 || to.path.indexOf("/setting") >= 0; //会员中心

  var appStock = {
    config: {},
    loginConfig: {},
    user: {},
  };
  if (sessionStorage.getItem("appstore")) {
    appStock = JSON.parse(sessionStorage.getItem("appstore"));
  }
 
  if (
    JSON.stringify(store.state.config) == "{}" &&
    JSON.stringify(appStock.config) == "{}"
  ) {
    store.dispatch("getconfig");
  } else if (JSON.stringify(store.state.language_list) == "{}") {
    //如果缓存有值，但是语言包没有值，
    store.dispatch("getlanguage");
  }
  if (
    JSON.stringify(store.state.loginConfig) == "{}" &&
    JSON.stringify(appStock.loginConfig) == "{}"
  ) {
    store.dispatch("getLoginConfig");
  }
  if (
    JSON.stringify(store.state.user) == "{}" &&
    !user &&
    JSON.stringify(appStock.user) == "{}"
  ) {
    store.dispatch("getUser");
  }
 
  if (isTo && reg_permission == "1" && store.state.user.tid == 0) {
    store.commit("setTsShare", true);
  } else if (
    isTo &&
    store.state.user.tel == "" &&
    store.state.config.shop.reg_tel == "1"
  ) {
    // store.commit("setShowBingPhone", true);
    router.push("/bind?redirect=/im/imindex");
  }
 
  //会员中心 未绑定手机号 拦截跳转
  if (
    isMember &&
    store.state.user.tel == "" &&
    store.state.config.shop.reg_tel == "1"
  ) {
    router.push("/bind?redirect=/member/member");
  }
 
  //分享页面是否能锁粉
  if (
    to.query.tshare &&
    user &&
    is_wx_login == "1" &&
    fnc.isWx() &&
    to.query.tshare != "undefined" &&
    to.query.tshare != "" &&
    to.path.indexOf("login") == -1
  ) {
   
    if (isxcx) {
      localStorage.setItem("login-url", to.fullPath);
      if (
        localStorage.getItem("applets_uid") &&
        localStorage.getItem("applets_user_key")
      ) {
        next({ path: "/page/applets" });
      } else {
        wx.miniProgram.navigateTo({
          url: `/pages/login/login`,
        });
      }
    } else {
      next({
        path: "/wxlogin",
        query: {
          redirect: location.href,
          tshare: to.query.tshare,
        },
      });
    }
  } else if (
    to.query.tshare &&
    user &&
    to.query.tshare != "undefined" &&
    to.query.tshare != "" &&
    to.path.indexOf("login") == -1
  ) {
    next({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    }); // 未登陆
  } else if (to.name == "news_detail") {
    var newObj = {};
    newObj.news_id = to.query.news_id;

    if (to.query.tid != appusers.uid) {
      newObj.is_share = to.query.tid;
    }
    newObj.tid = appusers.uid;

    if (isNewsLocking == "1") {
      newObj.tshare = username;
    } else {
      newObj.tshare = to.query.tshare || "undefined";
    }
    if (!to.query.tshare || to.query.tid != appusers.uid) {
      next({
        path: to.path,
        query: newObj,
      });
    } else {
      next();
    }
  } else if (to.name == "ewm") {
    var newObj = {};
    
    newObj.tid = appusers.uid;

    if (isEwmLocking == "1") {
      newObj.tshare = username;
    } else {
      newObj.tshare = to.query.tshare || "undefined";
    }

    if (!to.query.tshare || to.query.tid != appusers.uid) {
      next({
        path: to.path,
        query: newObj,
      });
    } else {
      next();
    }
  } else if ((to.name == "shopdetails" || to.name == "study") && !user) {
    var obj = {};
    obj.id = to.query.id;
    if (to.query.cid) {
      obj.cid = to.query.id;
    }
    obj.showVideo = to.query.showVideo || 0;
    if (to.query.tid != appusers.uid) {
      obj.is_share = to.query.tid;
    }
    obj.tid = appusers.uid;
    if (isProductLocking == "1") {
      obj.tshare = username;
    } else {
      obj.tshare = to.query.tshare || "undefined";
    }
    if (to.query.mid) {
      obj.mid = to.query.mid;
    }
    if (!to.query.tshare || to.query.tid != appusers.uid) {
      next({
        path: to.path,
        query: obj,
      });
    } else {
      next();
    }
  } else if (to.matched.some((m) => m.meta.uth)) {
    var xcxVerify = 0;
    if (navigator.userAgent.indexOf("miniProgram") !== -1) {
      var xcxCookie = Cookies.get("appletUser") ? true : false; //是否包含小程序appletUser cookie
      if (xcxCookie == true) {
        xcxVerify = 1;
      }
    } else {
      xcxVerify = 1;
    }

    if (!user && xcxVerify == 1) {
      //用户已登录
      if (
        !is_wx_login &&
        JSON.stringify(store.state.user) == "{}" &&
        !user &&
        JSON.stringify(appStock.user) == "{}"
      ) {
        store.dispatch("getUser");
      }
      if (to.path == "/" || to.path == "/index") {
        if (foot) {
          next({
            path: foot.links,
          });
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      // 未登陆
      const isWx = fnc.isWx();
      if (isWx) {
        if (isxcx) {
          //小程序端
          localStorage.setItem("login-url", to.fullPath);
          if (
            localStorage.getItem("applets_uid") &&
            localStorage.getItem("applets_user_key")
          ) {
            next({ path: "/page/applets" });
          } else {
            wx.miniProgram.navigateTo({
              url: `/pages/login/login`,
            });
          }
        } else if (is_wx_login == 1) {
          //公众号端
          next({
            path: "/wxlogin",
            query: {
              redirect: to.fullPath,
            },
          });
        } else {
          next({
            path: "/login",
            query: {
              redirect: to.fullPath,
            },
          });
        }
      } else {
        next({
          path: "/login",
          query: {
            redirect: to.fullPath,
          },
        }); // 未登陆
      }
      store.commit("loginOut");
    }
  } else {
    if (to.path == "/" || to.path == "/index") {
      
      if (foot) {
        next({
          path: foot.links,
        });
      } else {
        next();
      }
    } else {
      next();
    }
  }

  var a = sessionStorage.getItem("urlIndex") || 1;
  
  if (
    isiOS &&
    fnc.isWx() &&
    from.path == "/" &&
    to.path == location.pathname &&
    a == 1 &&
    to.path != "/" &&
    to.path.indexOf("/index") == -1 &&
    to.path.indexOf("applets") == -1 &&
    !user
  ) {
    
    location.assign(to.fullPath);
    sessionStorage.setItem("urlIndex", 0);
  } else {
    sessionStorage.removeItem("urlIndex");
  }
  // NProgress.done();
});

router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  // NProgress.done();
});
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});
new Vue({
  router: router,
  store: store,
  global,
  render: (h) => h(App),
}).$mount("#app");
import VueRouter from 'vue-router'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

