import wx from "weixin-js-sdk";
import api from "./api/require/index";
import fnc from "./fnc/fnc";
import Cookies from "js-cookie";
var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var isxcx = u.indexOf("miniProgram") !== -1 ? true : false;
var appusers = Cookies.get("user")
  ? JSON.parse(Cookies.get("user"))
  : {
      uid: 0,
    };
export const wxshare = {
  install: (Vue) => {
    Vue.prototype.$wxshare = (msg, callback) => {
      if (fnc.isWx()) {
        if (isxcx == true) {
          wx.miniProgram.postMessage({
            data: {
              title: msg.desc,
              piclink: msg.imgUrl,
              desc: msg.desc,
              url: msg.link,
            },
          });
        }
        api.getWx
          .wxConfig({
            url: encodeURIComponent(
              isiOS
                ? window.entryUrl
                : isxcx == true
                ? window.wechaturl
                : location.href.split("#")[0]
            ),
          })
          .then((res) => {
            if (res.code === 200) {
              // 通过config接口注入权限验证配置
              var data = res.result;
              wx.config({
                debug: false,
                // debug: appusers.uid == 745 ? true : false, // 开启调试模式
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名，见附录1
                jsApiList: [
                  "onMenuShareQQ", //分享到QQ
                  "onMenuShareQZone", //分享到空间
                  "onMenuShareWeibo", //分享到微博
                  "updateAppMessageShareData", //分享给好友1.4
                  "updateTimelineShareData", //分享到朋友圈1.4
                  "getLocation",
                  "openLocation",
                  "hideMenuItems",
                  "showMenuItems",
                  "scanQRCode",
                  "startRecord",
                  "stopRecord",
                ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              });
              /*eslint-disable */
              let share_config = {
                share: {
                  imgUrl: msg.imgUrl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
                  desc: msg.desc, // 摘要,如果分享到朋友圈的话，不显示摘要。
                  title: msg.title, // 分享卡片标题
                  link: msg.link, // 分享出去后的链接，这里可以将链接设置为另一个页面。
                  isShow: msg.isShow,
                  isGetLocation: msg.isGetLocation,
                },
              };
              // 点击修改要分享的内容
              wx.ready(function() {
                wx.updateAppMessageShareData(share_config.share); // 分享给好友
                wx.updateTimelineShareData(share_config.share); // 分享到朋友圈
                wx.onMenuShareQQ(share_config.share); // 分享到QQ
                wx.onMenuShareWeibo(share_config.share); // 分享到腾讯微博
                wx.onMenuShareQZone(share_config.share); // 分享到空间

                if (share_config.share.isGetLocation) {
                  wx.getLocation({
                    type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function(res) {
                      callback(res, 1);
                    },
                    cancel: function(rej) {
                      // that.$toast.fail("用户拒绝授权获取地理位置", rej);
                      console.log("用户拒绝授权获取地理位置");
                      console.log(JSON.stringify(rej));
                      callback(rej, 2);
                    },
                    fail: function(rej) {
                      callback(rej, 3);
                      console.log("获取位置信息失败");
                      // that.$toast.fail("获取位置信息失败", JSON.stringify(rej));
                      console.log(JSON.stringify(rej));
                    },
                  });
                }

                wx.hideMenuItems({
                  menuList: ["menuItem:copyUrl"], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
              });

              wx.error(function(res) {
                var index = sessionStorage.getItem("index");
                if (index) {
                  sessionStorage.setItem("index", 2);
                } else {
                  // alert(res.errMsg);
                  sessionStorage.setItem("index", 1);
                }

                //打印错误消息。及把 debug:false,设置为debug:ture就可以直接在网页上看到弹出的错误提示
              });
            } else {
            }
          })
          .catch((rej) => {
            console.log(rej);
          });
      } else {
        // console.log(`${store.state.uaType}浏览器不用索取微信分享签名了`)
        return;
      }
    };
  },
};
