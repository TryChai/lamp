<template>
  <div class="nowaddress">
    <div class="address_left">
      <van-icon name="location" />
      <span @click="$router.push('/page/team_leader?redirect=page/vip')">{{address}}</span>
      <!-- <van-icon name="play" /> -->
    </div>
    <div class="address_right" v-show="showbtn">
      <!-- <span @click="failaddress">
                <van-icon name="scan" />
                获取位置
            </span> -->
      <span @click="scan">
        <van-icon name="scan" />
        扫码
      </span>
      <span @click="$router.push('/order/mention/page')">
        <van-icon name="qr-invalid" />取货
      </span>
    </div>
  </div>
</template>
<script>
var setCoor = function (lai, lon) {
  window.vue.position.latitude = lai;
  window.vue.position.longitude = lon;
  window.vue.get_nearstore(lai, lon);
};
window.setCoor = setCoor;
var configAuthSate = function (type, result) {
  /*
     备注：
    type 1 定位 2 相册 3 相机
    result 1 授权访问成功 0 失败
     */
  if (type == 1 && result == 1) {
    window.vue.get_nearstore(
      window.vue.position.latitude,
      window.vue.position.longitude
    );
  } else if (type == 1 && result == 0) {
    window.vue.failaddress();
  }
  if (type == 1 && result == "0") {
    window.vue.failaddress(); //获取定位失败
  }
};
window.configAuthSate = configAuthSate;
import wx from "weixin-js-sdk";
import Cookies from "js-cookie";
import {
  Dialog
} from 'vant';

export default {
  name: "nowaddress",
  data () {
    return {
      address: "正在获取位置...",
      position: {
        latitude: null,
        longitude: null,
      },
      usedAdd: {}
    };
  },
  props: {
    //是否顯示 自提和掃碼按鍵
    showbtn: {
      type: Boolean,
      default: true
    },
  },
  mounted () {
    window.vue = this;
    window.setScanText = this.setScanText;
  },
  components: {
    [Dialog.name]: Dialog
  },
  created () {
    var usedAdd = JSON.parse(sessionStorage.getItem("usedAddress"));
    if (usedAdd && usedAdd != undefined) {
      this.usedAdd = usedAdd;
      if (this.usedAdd.city || this.usedAdd.title) {
        this.address = this.usedAdd.city + this.usedAdd.title;
        sessionStorage.setItem("now_address", JSON.stringify(this.address));
      }
    }
    // 是否第一次获取定位信息
    var now_address = JSON.parse(sessionStorage.getItem("now_address")) || "";
    if (now_address) {
      this.address = now_address;
    } else {
      this.getnowaddress();
    }
  },
  methods: {
    setScanText (str) {
      //新版app扫描回调
      var that = this;
      if (str.indexOf('/order/mention/code?id=') >= 0) {
        Dialog.confirm({
          title: '是否确认取货',
        }).then(() => {
          let to = str.indexOf('?id=');
          let from = str.indexOf('&VNK');
          let id = "";
          if (from == -1) {
            id = str.substring(to + 4)
          } else {
            id = str.substring(to + 4, from)
          }
          var params = {
            id: id
          }
          that.$api.getOrder.complect_mention(params).then(res1 => {
            if (res1.code == 200) {
              that.$toast.success('操作成功')
            }
          })
        }).catch(() => {

        });
      }
    },
    scan () {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == 'ykapp') {
        var data = {
          type: "scan",
          data: "xxxxx"
        };
        this.postData(data);
      } else if (this.$fnc.isWx()) {
        var that = this;
        // wx.ready(() => {
        wx.scanQRCode({
          needResult: 1,
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            let str = res.resultStr
            if (str.indexOf('/order/mention/code?id=') >= 0) {
              Dialog.confirm({
                title: '是否确认取货',
              }).then(() => {
                let to = str.indexOf('?id=');
                let from = str.indexOf('&VNK');
                let id = "";
                if (from == -1) {
                  id = str.substring(to + 4)
                } else {
                  id = str.substring(to + 4, from)
                }
                var params = {
                  id: id
                }
                that.$api.getOrder.complect_mention(params).then(res1 => {
                  if (res1.code == 200) {
                    that.$toast.success('操作成功')
                  }
                })
              }).catch(() => {

              });
            }
          },
          fail: function (rej) {
            wx.miniProgram.navigateTo({
              url: `/pages/code/code`,
            });
          }
        });
        // })
      } else {
        this.$toast.fail('调起摄像头失败')
      }
    },
    //获取附近店铺
    get_nearstore (latitude, longitude) {
      var params = {};
      this.position.latitude = latitude
      this.position.longitude = longitude
      this.$store.commit('setNowPosition', {
        latitude: latitude,
        longitude: longitude,
      })
      // localStorage.setItem('NowPosition', JSON.stringify(this.position));
      if (this.usedAdd && (this.usedAdd.city || this.usedAdd.title)) {
        this.address = this.usedAdd.city + this.usedAdd.title;
        sessionStorage.setItem("now_address", JSON.stringify(this.address));
        return;
      }
      params.latitude = latitude;
      params.longitude = longitude;
      this.$api.getOrder.get_nearstore(params).then(res => {
        if (res.code == 200 && res.result != null && res.result != '') {
          this.address = res.result.title;
          sessionStorage.setItem("now_address", JSON.stringify(res.result.title));
          //保存团长信息
          var user = Cookies.get('user') ? false : true;
          if (res.result.id == 0 || !res.result.id) {
            return
          }
          if (!user) {
            this.$api.getPage.saveExtractId({
              id: res.result.id
            }).then(res => {
              if (res.code == 200) {
                return;
              }
            })
          } else {
            // this.$toast.fail("请先登录！")
            sessionStorage.setItem("extract_id", res.result.id);
          }

        } else {
          this.address = "附近暂无门店"
        }
      })
    },
    getnowaddress () {
      switch (true) {
        case this.$fnc.isWx():
          var that = this;
          // eslint-disable-next-line no-case-declarations
          const toast = this.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: "spinner",
            message: "加载中..."
          });
          var obj = this.$store.state.appShareObj;
          obj.isGetLocation = true;
          that.$wxshare(obj, function (res, type) {
            toast.clear();
            if (type == 1) {
              that.position.latitude = res.latitude;
              that.position.longitude = res.longitude;
              that.get_nearstore(res.latitude, res.longitude);
            } else if (type == 2) {
              that.$toast.fail("用户拒绝授权获取地理位置");
              setTimeout(() => {
                that.failaddress(); //获取定位失败
              }, 1500);
            } else {
              setTimeout(() => {
                that.failaddress(); //获取定位失败
              }, 1500);
            }
          });
          break;
        case this.$fnc.isapp() || this.$fnc.isYkAPP():
          var newapp;
          try {
            newapp = this.$store.state.config.shop.newapp;
          } catch (error) {
            newapp = "0";
          }
          if (newapp == "0") {
            try {
              // eslint-disable-next-line no-undef
              ykAPP.getCoor();
            } catch (error) {
              // eslint-disable-next-line no-undef
              this.position.latitude = ykAPP.getLatitude(); // 纬度，浮点数，范围为90 ~ -90
              // eslint-disable-next-line no-undef
              this.position.longitude = ykAPP.getlongitude(); // 经度，浮点数，范围为180 ~ -180。
            }
          } else {
            var data = {
              type: "getCoor"
            };
            this.$fnc.postData(data);
          }
          if (this.position.latitude != "" && this.position.longitude != "") {
            this.get_nearstore(this.position.latitude, this.position.longitude);
          }
          // }
          break;
        default:
          this.failaddress();
          break;
      }
    },

    //获取定位失败使用浏览器定位方法
    failaddress () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition, this.failCallback);
      } else {
        this.address = "获取当前地址失败";
        if (this.usedAdd && (this.usedAdd.city || this.usedAdd.title)) {
          this.address = this.usedAdd.city + this.usedAdd.title;
          sessionStorage.setItem("now_address", JSON.stringify(this.address));
          return;
        }
      }
    },
    showPosition (position) {
      try {
        this.position.latitude = position.coords.latitude;
        this.position.longitude = position.coords.longitude;
        this.get_nearstore(this.position.latitude, this.position.longitude);
      } catch (error) {
        this.address = "获取当前地址失败";
        if (this.usedAdd && (this.usedAdd.city || this.usedAdd.title)) {
          this.address = this.usedAdd.city + this.usedAdd.title;
          sessionStorage.setItem("now_address", JSON.stringify(this.address));
          return;
        }
      }
    },
    failCallback (error) {
      this.address = "获取当前地址失败";
      this.$store.dispatch("getUser");
      if (this.$store.state.user.extract_ar) {
        this.address = this.$store.state.user.extract_ar.title;
        sessionStorage.setItem("now_address", JSON.stringify(this.address));
      }
      if (this.usedAdd && (this.usedAdd.city || this.usedAdd.title)) {
        this.address = this.usedAdd.city + this.usedAdd.title;
        sessionStorage.setItem("now_address", JSON.stringify(this.address));
        return;
      }
    },
  },
}
</script>
<style lang="less" scoped>
.nowaddress {
  width: 100%;
  color: #ffffff;
  background-color: transparent;
  display: flex;
  justify-content: space-between;

  align-items: center;
  font-size: 14px;

  .address_left {
    // width: 70%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .van-icon {
      font-size: 18px;
      margin-right: 5px;
    }

    .van-icon:nth-of-type(2) {
      -moz-transform: rotate(90deg);
      -o-transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
    }

    > span {
      //   width: 160px;
      font-size: 14px;
      font-weight: bold;
      overflow: hidden;
      //隐藏部分显示为省略号
      text-overflow: ellipsis;
      //禁止文本自动换行
      white-space: nowrap;
    }
  }

  .address_right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 10px;

      .van-icon {
        font-size: 18px;
      }
    }
  }
}
</style>
