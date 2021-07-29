import Vue from "vue";
import Vuex from "vuex";
import conversation from "./modules/conversation";
import group from "./modules/group";
import imUser from "./modules/imUser";
import friend from "./modules/friend";
import blacklist from "./modules/blacklist";
import fnc from "../assets/js/fnc/fnc";
import api from "../assets/js/api/require/index";
import wx from "weixin-js-sdk";
import router from "../router";
import Cookies from "js-cookie";
import card from "./modules/card";
import ycCard from "./modules/ycCard";
import live from "./modules/live";
import hotel from "./modules/hotel";
import driver from "./modules/driver";
import lamp from "./modules/lamp";
import axios from "axios";

import Vconsole from "vconsole";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    index: 0,
    language_list: {}, //语言列表
    language_type: [], //语言全部类型
    nowlanguage: {}, //当前选择的语言
    client_Msg: {}, // crm客户数据
    nowposition: {},
    app_turnshow: false,
    car_num: 0,
    current: Date.now(), // 当前时间
    intervalID: 0,
    user: {},
    config: {},
    imreward: "",
    order: "",
    isTg: false,
    appTitle: "",
    showBingPhone: false,
    isTsShare: false,
    isSupplier: false,
    wxShare: {},
    imUserList: [],
    isShowWxAppShare: false,
    unStatusShop: "",
    loginConfig: {},
    appShareObj: {},
    showTabar: false,
    appUuid: "",
    cardList: [],
    defaultAddress: {},
    terminalType: "-1",
    coinIden: "",
    couponItem: {}, // 选中的红包
    is_huobi_links: 0
  },
  mutations: {
    setIsHuobiLinks(state, val) {
      state.is_huobi_links = val;
    },
    setCouponItem(state, obj) {
      state.couponItem = obj;
    },
    set_nowlanguage(state, obj) {
      state.nowlanguage = obj;
      var data = {};
      if (localStorage.getItem("languagelist")) {
        data = JSON.parse(localStorage.getItem("languagelist"));
      } else if (state.language_list) {
        data = state.language_list;
      } else {
        data = {};
      }

      if (
        JSON.stringify(data) == "{}" ||
        JSON.stringify(state.nowlanguage) == "{}"
      ) {
        Vue.prototype.$h = (name) => {
          return name;
        };
      } else {
        Vue.prototype.$h = (name) => {
          if (JSON.stringify(obj) == "{}") {
            //当前选择的语言为空
            return name;
          } else {
            var lan = obj.iden;
            // console.log(data[lan])
            if (data[lan] && data[lan][name]) {
              return data[lan][name];
            } else {
              return name;
            }
          }
        };
        // router.go(0);
      }
    },
    set_languagelist(state, obj) {
      state.language_list = obj;
    },
    set_languagetype(state, arr) {
      state.language_type = arr;
    },
    coinIden(state, iden) {
      state.coinIden = iden;
    },
    set_client_Msg(state, msg) {
      state.client_Msg = msg;
    },
    setNowPosition(state, nowposition) {
      // var arr = [
      //   {
      //     longitude: 119.34285164,
      //     latitude: 26.05252266,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.34225082,
      //     latitude: 26.05073949,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.34353828,
      //     latitude: 26.05108648,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.34408545,
      //     latitude: 26.05279254,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.34463263,
      //     latitude: 26.05366002,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.34538364,
      //     latitude: 26.05351544,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.34750795,
      //     latitude: 26.05286965,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.35178876,
      //     latitude: 26.0515877,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.35497522,
      //     latitude: 26.05069129,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.35871959,
      //     latitude: 26.04964065,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.36276436,
      //     latitude: 26.04847434,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.36367631,
      //     latitude: 26.04725981,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.36467409,
      //     latitude: 26.04359688,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.36448097,
      //     latitude: 26.04139907,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      //   {
      //     longitude: 119.36145544,
      //     latitude: 26.04316311,
      //     province: "福建省",
      //     city: "福州",
      //     speed: 1,
      //     course: 361,
      //   },
      // ];
      // if (arr[state.index]) {
      //   state.nowposition = arr[state.index];
      //   state.index++;
      // } else {
      //   state.index = 0;
      // }

      // console.log(
      //   nowposition.latitude,
      //   nowposition.longitude,
      //   nowposition.speed,
      //   nowposition.course,
      //   "index.js"
      // );
      state.nowposition = nowposition;
    },
    setTerminal(state) {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //第一个微信端
        fnc.isXcx().then((res) => {
          if (res == "true" || res == true) {
            state.terminalType = "4"; //小程序
          } else {
            state.terminalType = "3"; //公众号
          }
        });
      } else if (ua.match(/ykapp/i) == "ykapp") {
        state.terminalType = "1"; //第二个app
      } else {
        state.terminalType = "2"; //剩下的网页
      }
    },
    setDefaultAddress(state, defaultAddress) {
      state.defaultAddress = defaultAddress;
    },
    setCardList(state, cardList) {
      state.cardList = cardList;
    },
    setAppUuid(state, appUuid) {
      state.appUuid = appUuid;
    },
    setShowTabbar(state, showTabar) {
      state.showTabar = showTabar;
    },
    setAppShareObj(state, appShareObj) {
      state.appShareObj = appShareObj;
    },
    restAppShareObj(state) {
      var imgUrl = state.config.shop.logo || "";
      if (imgUrl.indexOf("http") == -1) {
        imgUrl =
          window.location.protocol + "//" + window.location.host + imgUrl;
      }
      var obj = {
        title: document.title,
        desc: document.title + "欢迎您！",
        link: location.href,
        imgUrl: imgUrl,
      };
      state.appShareObj = obj;
    },
    setLoginConfig(state, loginConfig) {
      state.loginConfig = loginConfig;
    },
    set_turnshow(state, flag) {
      state.app_turnshow = flag;
    },
    setUnStatusShop(state, unStatusShop) {
      state.unStatusShop = unStatusShop;
    },
    setShowShare(state, isShowWxAppShare) {
      state.isShowWxAppShare = isShowWxAppShare;
    },
    set_carnum(state, num) {
      state.car_num = num;
      if (num == 0) {
        state.cardList = [];
      }
    },
    startComputeCurrent(state) {
      state.intervalID = setInterval(() => {
        state.current = Date.now();
      }, 1000);
    },
    stopComputeCurrent(state) {
      clearInterval(state.intervalID);
      state.intervalID = 0;
    },
    setImUserList(state, imUserList) {
      state.imUserList = imUserList;
    },
    setWxShare(state, wxShare) {
      state.wxShare = wxShare;
    },
    setShowBingPhone(state, showBingPhone) {
      state.showBingPhone = showBingPhone;
    },
    setIsSupplier(state, isSupplier) {
      state.isSupplier = isSupplier;
    },
    setTsShare(state, isTsShare) {
      state.isTsShare = isTsShare;
    },
    setIsTg(state, isTg) {
      state.isTg = isTg;
    },
    setAppTitle(state, appTitle) {
      state.appTitle = appTitle;
    },
    setUser(state, obj) {
      var user = {
        uid: obj.uid,
        user_key: obj.user_key,
      };
      //user_username
      Cookies.set("user_username", obj.username, {
        expires: 365,
      });
      Cookies.set("user", user, {
        expires: 365,
      });

      //如果要额外写入小程序cookies
      if (obj.xcxCookies == true) {
        Cookies.set("appletUser", user, {
          expires: 365,
        });
      }
      state.user = obj;

      try {
        // eslint-disable-next-line no-undef
        ykAPP.loginSuccess();
      } catch (error) {
        new Error(error);
      }
    },
    setConfig(state, obj) {
      if (location.href.indexOf("feiyan") >= 0) {
        document.title = "福州人，快来查看你附近的疫情信息";
      } else {
        document.title = obj.shop.head;
      }

      try {
        if (obj.shop.newapp) {
          Cookies.set("newapp", obj.shop.newapp + "", {
            expires: 360,
          });
        } else {
          Cookies.set("newapp", 0, {
            expires: 360,
          });
        }
      } catch (error) {
        Cookies.set("newapp", "0", {
          expires: 360,
        });
      }
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (fnc.isYkAPP() && !isiOS) {
        //安卓App方法还是执行以前的，ios 调用新的
        Cookies.set("newapp", "0", {
          expires: 360,
        });
        obj.shop.newapp = 0;
      }

      state.config = obj;

      if (
        obj.shop.is_product_locking != undefined &&
        obj.shop.is_product_locking == "1"
      ) {
        Cookies.set("isProductLocking", 1, {
          expires: 360,
        });
      } else {
        Cookies.set("isProductLocking", 0, {
          expires: 360,
        });
      }
      if (
        obj.shop.is_news_locking != undefined &&
        obj.shop.is_news_locking == "1"
      ) {
        Cookies.set("isNewsLocking", 1, {
          expires: 360,
        });
      } else {
        Cookies.set("isNewsLocking", 0, {
          expires: 360,
        });
      }
      if (
        obj.shop.is_tgm_locking != undefined &&
        obj.shop.is_tgm_locking == "1"
      ) {
        Cookies.set("isEwmLocking", 1, {
          expires: 360,
        });
      } else {
        Cookies.set("isEwmLocking", 0, {
          expires: 360,
        });
      }

      var user = Cookies.get("user") ? true : false;
      var isxcx =
        navigator.userAgent.indexOf("miniProgram") !== -1 ? true : false;
      try {
        sessionStorage.setItem("reg_permission", obj.shop.reg_permission);
        if (obj.shop.is_wx_login) {
          sessionStorage.setItem("is_wx_login", 1);
        } else {
          sessionStorage.setItem("is_wx_login", "0");
        }
        if (
          obj.plugin.zyfh.is_open == 1 &&
          location.href.indexOf("shopdetails") >= 0 &&
          !user &&
          location.href.indexOf("login") == -1
        ) {
          if (obj.shop.is_wx_login == 1) {
            sessionStorage.setItem("url", location.href);
            if (location.href.indexOf("regshare") == -1) {
              fnc.isXcx().then((res) => {
                if (res == "true" || res == true) {
                  if (
                    localStorage.getItem("applets_uid") &&
                    localStorage.getItem("applets_user_key")
                  ) {
                    router.push("/page/applets");
                  } else {
                    wx.miniProgram.navigateTo({
                      url: `/pages/login/login?redirect=` + location.href,
                    });
                  }
                } else {
                  router.replace({
                    path: "/wxlogin",
                  });
                }
              });
            } else {
              fnc.isXcx().then((res) => {
                if (res == "true" || res == true) {
                  if (
                    localStorage.getItem("applets_uid") &&
                    localStorage.getItem("applets_user_key")
                  ) {
                    this.$router.push("/page/applets");
                  } else {
                    wx.miniProgram.navigateTo({
                      url:
                        `/pages/login/login?tshare=` +
                        location.href.split("&regshare=")[1].split("&")[0],
                    });
                  }
                } else {
                  router.replace({
                    path: "/wxlogin",
                    query: {
                      tshare: location.href
                        .split("&regshare=")[1]
                        .split("&")[0],
                    },
                  });
                }
              });
            }
          }
          // else {
          //   if (location.href.indexOf("regshare") == -1) {
          //     router.replace({
          //       path: "/login",
          //       query: {
          //         redirect: router.currentRoute.fullPath,
          //       },
          //     });
          //   } else {
          //     router.replace({
          //       path: "/login",
          //       query: {
          //         share: location.href.split("&regshare=")[1].split("&")[0],
          //         rk: 1,
          //         redirect: router.currentRoute.fullPath,
          //       },
          //     });
          //   }
          // }
        }
      } catch (error) {
        new Error("未返回reg_permission");
      }
      if (obj.footer && obj.footer.length > 0) {
        Cookies.set("foot", obj.footer[0]);
      }
      if (
        obj.shop.cnzz_url != undefined &&
        obj.shop.cnzz_url != null &&
        obj.shop.cnzz_url != ""
      ) {
        var script = document.getElementsByTagName("script");
        var bool = true;
        var el = null;
        for (var i in script) {
          if (script[i].src == obj.shop.cnzz_url) {
            bool = false;
            break;
          }
        }
        if (bool) {
          el = document.createElement("script");
          el.type = "text/javascript";
          el.src = obj.shop.cnzz_url;
          document.getElementsByTagName("head")[0].appendChild(el);
        }
      }
    },
    loginOut(state) {
      state.user = {};
      state.imreward = "";
      Cookies.remove("user");
      Cookies.remove("user_username");
      if (Cookies.get("appletUser")) {
        //如果存在applerUser cookie 也去除
        Cookies.remove("appletUser");
      }
    },
    setImReward(state, time) {
      state.imreward = time;
    },
    setOrder(state, order) {
      state.order = order;
    },
  },
  actions: {
    getlanguage(context) {
      var flag =
        context.state.config.plugin ||
        JSON.parse(sessionStorage.getItem("appstore")).config.plugin;
      if (flag.dyy && flag.dyy.is_open == 1) {
        //获取语言类型
        api.getPage.get_languagetype({}).then((res) => {
          if (res.code == 200) {
            context.commit("set_languagetype", res.result);
            //获取语言数据
            var str = "/api/common/language/index";
            axios.get(str).then((res2) => {
              if (res2.status == 200) {
                var data = {};
                try {
                  data = JSON.parse(JSON.stringify(res2.data));
                } catch (error) {
                  data = JSON.parse(JSON.stringify(res2));
                }
                localStorage.setItem("languagelist", JSON.stringify(data));
                context.commit("set_languagelist", data);

                var nowlan = {};
                try {
                  var obj = JSON.parse(localStorage.getItem("nowlan")); //获取当前选择的语言
                  if (typeof obj == "object" && obj.iden && obj.title) {
                    nowlan = obj;
                  } else {
                    nowlan = {};
                  }
                } catch (error) {
                  nowlan = {};
                }
                context.commit("set_nowlanguage", nowlan);
              }
            });
          }
        });
      } else {
        Vue.prototype.$h = (name) => {
          return name;
        };
      }
    },
    getCoinList(context) {
      api.getCoin.getCoinList({}).then((res) => {
        if (res.code == 200 && res.result.data && res.result.data[0]) {
          context.commit("coinIden", res.result.data[0].iden);
        }
        if (res.code == 200 && res.result.is_huobi_links) {
          context.commit("setIsHuobiLinks", res.result.is_huobi_links);
        }
      });
    },
    getCardList(context, id) {
      var params = {};
      if (id) {
        params.sid = id;
      }
      api.getShop.getCardList(params).then((res) => {
        if (res.code == 200) {
          context.commit("setCardList", res.result);
        }
      });
    },
    getLoginConfig(context) {
      api.getUser
        .getLoginBg({
          cate: "vue_login_bg",
        })
        .then((res) => {
          if (res.code == 200) {
            context.commit("setLoginConfig", res.result);
          }
        });
    },
    getCardNum(context) {
      api.getShop.get_carnum({}).then((res) => {
        if (res.code == 200) {
          context.commit("set_carnum", res.result);
        }
      });
    },
    getUser(context) {
      var user = Cookies.get("user") ? true : false;
      if (user) {
        api.getUser.getUserInfo({}).then((res) => {
          if (res.code == 200) {
            context.commit("setUser", res.result);
          }
        });
      }
    },
    getconfig(context) {
      api.getUser.getConfig({}).then((res) => {
        if (res.code == 200) {
          context.commit("setConfig", res.result);
          sessionStorage.setItem(
            "reg_permission",
            res.result.shop.reg_permission
          );
          sessionStorage.setItem("is_wx_login", res.result.shop.is_wx_login);

          //开启debug 前台调试控制台
          if (
            res.result.shop &&
            res.result.shop.is_debug &&
            res.result.shop.is_debug == 1
          ) {
            var vConsole = "";
            vConsole = new Vconsole();
            Vue.use(vConsole);
          }

          //如果开启语言包插件
          context.dispatch("getlanguage");
        }
      });
    },
    getAurora(context, aurora_id) {
      api.getUser
        .getAuroraId({
          aurora_id,
        })
        .then(() => { });
    },
  },
  modules: {
    conversation,
    group,
    friend,
    blacklist,
    imUser,
    card,
    ycCard,
    live,
    hotel,
    lamp,
    driver,
  },
});
