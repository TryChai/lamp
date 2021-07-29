import wx from "weixin-js-sdk";
import api from "./api/require/index";
import Cookies from "js-cookie";
var appusers = Cookies.get("user")
  ? JSON.parse(Cookies.get("user"))
  : {
      uid: 0
    };
const wxApi = {
  wechatAuth(authUrl, device) {
    api.getWx
      .wxConfig({
        url: decodeURIComponent(device == "ios" ? window.entryUrl : authUrl)
      })
      .then(res => {
        if (res.code == 200) {
          var data = res.result;
          wx.config({
            debug: appusers.uid == 510 ? true : false, // 开启调试模式
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
              "onMenuShareTimeline", //分享给好友
              "onMenuShareAppMessage", //分享到朋友圈
              "onMenuShareQQ", //分享到QQ
              "onMenuShareQZone", //分享到空间
              "onMenuShareWeibo", //分享到微博
              "updateAppMessageShareData",
              "updateTimelineShareData",
              "openLocation",
              "getLocation",
              "hideMenuItems",
              'scanQRCode',
              'startRecord',
              'stopRecord',   
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
        }
      }),
      wx.ready(() => {
        // 如果需要定制ready回调方法

        wx.hideMenuItems({
          menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });
      });
    wx.error(() => {
      // location.assign(authUrl)
      // this.wechatAuth(authUrl,device)
      // alert('失败')
      var index = sessionStorage.getItem("index");
      if (index) {
        sessionStorage.setItem("index", 2);
      } else {
        // alert(res.errMsg);
        sessionStorage.setItem("index", 1);
      }
    });
  },
  ShareTimeline(option) {
    wx.updateTimelineShareData({
      title: option.title, // 分享标题
      desc: option.desc, // 分享描述
      link: option.link, // 分享链接
      imgUrl: option.imgUrl, // 分享图标
      success() {
        // 用户成功分享后执行的回调函数
        option.success();
      },
      cancel() {
        // 用户取消分享后执行的回调函数
        option.error();
      }
    });
  },
  /**
   * [ShareAppMessage 微信分享给朋友]
   * @param {[type]} option [分享信息]
   * @param {[type]} success [成功回调]
   * @param {[type]} error   [失败回调]
   */
  ShareAppMessage(option) {
    wx.updateAppMessageShareData({
      title: option.title, // 分享标题
      desc: option.desc, // 分享描述
      link: option.link, // 分享链接
      imgUrl: option.imgUrl, // 分享图标
      success() {
        // 用户成功分享后执行的回调函数
        option.success();
      },
      cancel() {
        // 用户取消分享后执行的回调函数
        option.error();
      }
    });
  },
  /**
   * [ToLocation 导航]
   * @param {[type]} option [分享信息]
   * @param {[type]} success [成功回调]
   * @param {[type]} error   [失败回调]
   */
  ToLocation(obj) {
    wx.openLocation({
      latitude: parseFloat(obj.latitude),
      longitude: parseFloat(obj.longitude),
      name: obj.name,
      address: obj.address,
      scale: 14,
      infoUrl: obj.infoUrl
    });
  }
};

export default wxApi;
