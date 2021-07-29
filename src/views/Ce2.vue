<template>
  <div class="ce-shi">
    <van-nav-bar title="app方法测试" left-text left-arrow class="navbar" @click-left="toBack" />
    wxData：{{wxData}}

    <div>
      <van-button type="info" size="large" @click="onOtherLogin('6')">IOS-微博授权登录</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="onOtherLogin('3')">IOS-QQ授权登录</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="onOtherLogin('4')">IOS-抖音授权登录</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="onOtherLogin('5')">IOS-apple登录</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="onOtherLogin('6')">IOS-新浪登录</van-button>
    </div>
    <van-button type="info" size="large" @click="copy1" class="copy" style="cursor: pointer" onclick :data-clipboard-text="JSON.stringify(wxData)"
        data-clipboard-action="copy">复制wxData</van-button>
    storeUuid:{{storeUuid}}
    <div>
      <van-button type="info" size="large" @click="get_phoneqx">安卓获取设备码权限</van-button>
    </div>

    <div>
      <van-button type="info" size="large" @click="share">分享</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="toPhone">打电话</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="copy">复制</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="onAliPay">支付宝支付</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="onWXPay">微信支付</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="goTb">打开页面</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="getLatitudeLongitude">定位</van-button>
    </div>
    <div>
      videoId:{{videoId}}
      <br />
      object:{{object}}
      <van-button type="info" size="large" @click="shootVideo">录制视频</van-button>
    </div>
    <div>
      <p>scanResult: {{scanResult}}</p>
      <van-button type="info" size="large" @click="scan">扫描</van-button>
    </div>
    <div>
      <p>lai：{{lai}}</p>
      <p>lon：{{lon}}</p>
      <p>speed：{{speed}}</p>
      <p>course：{{course}}</p>
      <van-button type="info" size="large" @click="onCoor">ios经纬</van-button>
      <van-button type="info" size="large" @click="andDw">安卓经纬</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="getLatitudeLongitude">onNav</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="onPlayVideo">播放视频</van-button>
    </div>
    <div>
      wxData：{{wxData}}
      <van-button type="info" size="large" @click="onWXLogin">微信登录</van-button>
      <van-button type="info" size="large" @click="onWXLogin1">安卓微信登录</van-button>
      <van-button type="info" size="large" @click="onAlipayLogin">ios支付宝登录</van-button>
      <van-button type="info" size="large" @click="onAlipayLogin1">安卓支付宝登录</van-button>
      <van-button type="info" size="large" @click="onOtherLogin1('3')">QQ登录</van-button>
      <van-button type="info" size="large" @click="onOtherLogin1('4')">抖音登录</van-button>
      <van-button type="info" size="large" @click="onOtherLogin1('6')">新浪登录</van-button>
      <van-button type="info" size="large" @click="copy1" class="copy" style="cursor: pointer" onclick :data-clipboard-text="JSON.stringify(wxData)"
          data-clipboard-action="copy">复制wxData</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="onIos">ios多图下载</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="onAnd">安卓多图下载</van-button>
    </div>
    <div>
      uuid: {{uuid}}
      <br />
      storeUuid:{{storeUuid}}
      <van-button type="info" size="large" @click="onUuid">安卓uuid</van-button>
      <van-button type="info" size="large" @click="get_equipment_device">安卓获取设备权限</van-button>

    </div>

    <div>
      <van-button type="info" size="large" @click="onUuid_ios">IOS uuid</van-button>
    </div>

    <div>
      <p>测试图片上传</p>

    </div>

    <!-- <div>
      <van-button type="info" size="large" @click="onPlayVideo">支付宝登录</van-button>
    </div>-->

  </div>
</template>

<script>
import { mapState } from "vuex";
//oc调用js
var setCoor = function (lai, lon,speed,course,time) {
  console.log(lai, lon)
  window.vue.lai = lai;
  window.vue.lon = lon;
  window.vue.speed = speed;
  window.vue.course = course;
};
window.setCoor = setCoor;

var configAuthSate = function (type, result) {
  /*
     备注：
    type 1 定位 2 相册 3 相机 4 设备码权限
    result 1 授权访问成功 0 失败
     */
  if (type == 1 && result == 1) {
    window.vue.$toast("定位授权成功");
  } else if (type == 1 && result == 0) {
    window.vue.$toast("定位授权失败");
  } else if (type == 4 && result == 0) {
    window.vue.$toast("设备码授权失败");
  } else if (type == 4 && result == 1) {
    window.vue.get_equipment_device();
  }
};
window.configAuthSate = configAuthSate;

var configAuthLoginResult = function (type, data) {
  /*
     备注：
    type 1 微信 2 支付宝 3 qq 4抖音 5apple 6新浪
    data 授权信息(json串)
     */
  if (type == 1) {
    window.vue.wxData = data;
  }
  if (type == 2) {
    window.vue.wxData = data;
  }
  if (type == 3) {
    window.vue.wxData = data;
  }
  if (type == 4) {
    window.vue.wxData = data;
  }
  if (type == 5) {
    window.vue.wxData = data;
  }
  if (type == 6) {
    window.vue.wxData = data;
  }
};

window.configAuthLoginResult = configAuthLoginResult;

var configDeviceId = function (uuid) {
  window.vue.uuid = uuid;
}
window.configDeviceId = configDeviceId;



import { Field } from "vant";
export default {
  name: "ce-shi",
  data () {
    return {
      speed: '',
      course: '',
      lai: "",
      lon: "",
      phone: "18888888888",
      str: "测试复制",
      img:
        "https://inexweb.oss-cn-shenzhen.aliyuncs.com/yunpt/resource/image/banner/201909/a6d39dfe87e9030823130ed13013d4e6.jpg",
      videoId: "",
      object: "",
      title: "测试分享标题",
      links: location.href,
      latitude: 26.053776,
      longitude: 119.341393,
      latitude1: "",
      longitude1: "",
      url: "http://item.taobao.com/item.htm?id=589345775798",
      scanResult: "",
      wxData: {},
      uuid: ''
    };
  },
  computed: {
    ...mapState({
      storeUuid: state => state.appUuid,
    }),

  },
  components: {
    [Field.name]: Field
  },
  created () { },
  mounted () {
    window.vue = this;
    window.setScanText = this.setScanText;
    window.configVideoInfo = this.configVideoInfo;

  },
  methods: {
    onUuid_ios () {
      var data = { "type": "devicePermission" };
      this.postData(data);
    },
    get_equipment_device () {
      try {
        // eslint-disable-next-line no-undef
        ykAPP.devicePermission()
      } catch (error) {
        this.$toast('错误1')
      }
    },
    onOtherLogin1 (type) {

      switch (true) {
        case type == 3:
          try {
            // eslint-disable-next-line no-undef
            ykAPP.qqLogin()
          } catch (error) {
            this.$toast('错误1')
          }
          break;
        case type == 4:
          try {
            // eslint-disable-next-line no-undef
            ykAPP.tikTokLogin()
          } catch (error) {
            this.$toast('错误2')
          }
          break;

        case type == 6:
          try {
            // eslint-disable-next-line no-undef
            ykAPP.sinaLogin()
          } catch (error) {
            this.$toast('错误2')
          }
          break;
        default:
          break;
      }
    },
    onOtherLogin (type) {
      var data = {};
      switch (true) {
        case type == 3:
          data = { "type": "qqLogin" }
          break;
        case type == 4:
          data = { "type": "douyinLogin" }
          break;
        case type == 5:
          data = { "type": "appleLogin" }
          break;
        case type == 6:
          data = { "type": "sinaLogin" }
          break;
        default:
          break;
      }
      this.postData(data);
    },

    getuuid () {
      try {
        // eslint-disable-next-line no-undef
        this.$store.commit("setAppUuid", ykAPP.deviceId());
      } catch (error) {
        this.$toast('错误')
      }
    },
    get_phoneqx () {
      try {
        // eslint-disable-next-line no-undef
        ykAPP.devicePermission();
      } catch (error) {
        this.$toast('错误')
      }
    },
    onUuid () {
      try {
        // eslint-disable-next-line no-undef
        this.uuid = ykAPP.deviceId()
      } catch (error) {
        this.$toast('错误')
      }
    },

    onAlipayLogin () {
      var data = { "type": "aliLogin" };
      this.postData(data);
    },
    onAlipayLogin1 () {
      try {
        // eslint-disable-next-line no-undef
        ykAPP.aliLogin()
      } catch (error) {
        this.$toast('错误')
      }

    },
    onAnd () {
      var images = [
        "https://inexweb.oss-cn-shenzhen.aliyuncs.com/yunpt/resource/image/banner/201909/a6d39dfe87e9030823130ed13013d4e6.jpg",
        "https://inexweb.oss-cn-shenzhen.aliyuncs.com/yingke/resource/image/banner/201908/78cbd760607a901adddea3d886d819e9.png"
      ];
      // eslint-disable-next-line no-undef
      ykAPP.downImage(images);
    },
    onIos () {
      var images = [
        "https://inexweb.oss-cn-shenzhen.aliyuncs.com/yunpt/resource/image/banner/201909/a6d39dfe87e9030823130ed13013d4e6.jpg",
        "https://inexweb.oss-cn-shenzhen.aliyuncs.com/yingke/resource/image/banner/201908/78cbd760607a901adddea3d886d819e9.png"
      ];
      var data = {
        type: "download",
        data: images
      };
      this.postData(data);
    },
    onWXLogin () {
      this.$fnc.appWxLogin();
    },
    onWXLogin1 () {
      try {
        // eslint-disable-next-line no-undef
        ykAPP.wxLogin();
      } catch (error) {
        this.$toast("错误");
      }
    },
    configVideoInfo (videoID, videoObj) {
      this.videoId = videoID;
      this.object = videoObj;
    },
    andDw () {
      // eslint-disable-next-line no-undef
      ykAPP.getCoor();
    },
    setScanText (str) {
      //新版app扫描回调
      this.scanResult = str;
    },
    onNav () {
      var data = { type: "navigation", lai: 26.0471255, lon: 119.33022111 };
      this.postData(data);
    },
    onPlayVideo () {
      var data = {
        type: "video",
        videoUrl:
          "http://static.tripbe.com/videofiles/20121214/9533522808.f4v.mp4"
      };
      this.postData(data);
    },
    onCoor () {
      var data = { type: "getCoor" };
      this.postData(data);
    },
    onAliPay () {
      var params = {};
      var that = this;
      params.id = "441";
      params.pay_id = "7";
      that.$api.getOrder.subPayOrder(params).then(res => {
        if (res.code == 200 && res.result.is_alipay_app == 1) {
          try {
            // eslint-disable-next-line no-undef
            var data = { type: "alipay", data: res.result.data };
            this.postData(data);
          } catch (error) {
            this.$toast("请在app打开");
          }
        }
      });
    },
    onWXPay () {
      var params = {};
      var that = this;
      params.id = "441";
      params.pay_id = "7";
      that.$api.getOrder.subPayOrder(params).then(res => {
        if (res.code == 200 && res.result.is_pay == 1) {
          try {
            // eslint-disable-next-line no-undef
            var data = { type: "wxpay", data: res.data.result };
            this.postData(data);
          } catch (error) {
            this.$toast("请在app打开");
          }
        }
      });
    },
    scan () {
      try {
        // eslint-disable-next-line no-undef
        var data = { type: "scan", data: "xxxxx" };
        this.postData(data);
      } catch (error) {
        this.$toast("请在app打开");
      }
    },
    downLoad () {
      try {
        // eslint-disable-next-line no-undef
        var data = { type: "download", data: this.img };
        this.postData(data);
      } catch (error) {
        this.$toast("请在app打开");
      }
    },
    goTb () {
      try {
        // eslint-disable-next-line no-undef
        var data = { type: "openurl", data: this.url };
        this.postData(data);
      } catch (error) {
        this.$toast("请在app打开");
      }
    },

    getLatitudeLongitude () {
      try {
        // eslint-disable-next-line no-undef
        var data = { type: "dw", data: "xxxxx" };
        this.postData(data);
      } catch (error) {
        this.$toast("请在app打开");
      }
    },
    share () {
      //
      try {
        // eslint-disable-next-line no-undef
        var data = {
          type: "share",
          url: "http://www.baidu.com",
          title: "测试分享标题"
        };
        this.postData(data);
      } catch (error) {
        this.$toast("请在app打开");
      }
    },

    shootVideo () {
      try {
        // eslint-disable-next-line no-undef
        var data = { type: "lz", data: "xxxxx" };
        this.postData(data);
      } catch (error) {
        this.$toast("请在app打开");
      }
    },
    toPhone () {
      try {
        // eslint-disable-next-line no-undef
        var data = { type: "call", text: "18750596080" };
        this.postData(data);
      } catch (error) {
        this.$toast("请在app打开");
      }
    },
    copy () {
      try {
        // eslint-disable-next-line no-undef
        var data = { type: "copy", text: "复制文本" };
        this.postData(data);
      } catch (error) {
        this.$toast("请在app打开");
      }
    },
    copy1 () {
      let _this = this;
      let value = this.$store.state.user.share || "";
      let clipboard = new this.clipboard(".copy");

      clipboard.on("success", function (e) {
        _this.$toast.success("复制成功");
        e.clearSelection();
      });
      clipboard.on("error", function () {
        // _this.$toast.success('调用app方法');
        _this.$fnc.ykAPPCopy(JSON.stringify(this.wxData));
      });
    },
    postData (data) {
      window.webkit.messageHandlers.ykApp.postMessage({ data });
    }
  }
};
</script>
<style lang='less' scoped>
.ce-shi {
  font-size: 14px;
  line-height: 1.2;
  height: 100%;
  overflow: auto;
  > div {
    margin: 10px 0;
  }
}
</style>
