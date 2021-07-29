<template>
  <div class="nowaddress" :style="{ color: color }">
    <div class="address_left" v-show="showaddress == true">
      <van-icon name="location" />
      <span>{{ nowaddress }}</span>
    </div>
  </div>
</template>
<script>

//ag 与正北方向的顺时针夹角
//sp 当前速度
var setCoor = function (lai, lon, speed, course, time) {
  window.vue2.$api.getDriver.driver_text({ str: `111` })
  window.vue2.$api.getDriver.driver_text({ str: `${lai}, ${lon}, ${speed}, ${course},${window.vue2.$route.fullPath}` })
  if (window.vue2.position) {
    window.vue2.position.latitude = lai;
    window.vue2.position.longitude = lon;
    window.vue2.position.speed = speed || 0;
    window.vue2.position.course = course || 0;
    window.vue2.get_nearstore(lai, lon, speed, course);
  }
};
window.setCoor = setCoor;
var configAuthSate = function (type, result) {
  /*
     备注：
    type 1 定位 2 相册 3 相机
    result 1 授权访问成功 0 失败
     */
  if (type == 1 && result == 1) {
    // window.vue2.get_nearstore(
    //   window.vue2.position.latitude,
    //   window.vue2.position.longitude
    // );
  } else if (type == 1 && (result == 0 || result == "0")) {
    window.vue2.failaddress();
  }
};
window.configAuthSate = configAuthSate;
import wx from "weixin-js-sdk";
import { Dialog } from "vant";
import { mapState } from "vuex";
import driver from '@/assets/js/fnc/driver.js'
export default {
  name: "getaddress",
  data () {
    return {
      continuousFlag: false,
      address: "当前位置未知",
      position: {
        latitude: null,
        longitude: null,
      },
      usedAdd: {},
      KEY: "QUEBZ-7FO3W-EBQRR-RRCFM-6DUC3-ZYBHX",
    };
  },
  props: {

    //是否需要转换成高德经纬度
    isturnGAODE: {
      type: Boolean,
      default: false,
    },
    //是否需要解析详细地址
    isDetail: {
      type: Boolean,
      default: true,
    },
    // @@是否自动获取定位
    isauto: {
      type: Boolean,
      default: true,
    },

    // 文字颜色
    color: {
      type: String,
      default: "#ffffff",
    },

    //显示地址
    showaddress: {
      type: Boolean,
      default: true,
    },

    //具体位置
    specific_address: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      nowposition: (state) => state.nowposition,
    }),
    nowaddress () {
      if (this.specific_address == true && this.nowposition.address) {
        return `${this.nowposition.address}`;
      } else if (
        `${this.nowposition.city || ""}${this.nowposition.area || ""}`
      ) {
        return `${this.nowposition.city || ""}${this.nowposition.area || ""}`;
      } else if (
        `${this.nowposition.province || ""}${this.nowposition.city || ""}`
      ) {
        return `${this.nowposition.province || ""}${this.nowposition.city || ""
          }`;
      } else {
        return "当前位置未知";
      }
    },
  },

  mounted () {
    window.vue2 = this;
  },
  components: {
    [Dialog.name]: Dialog,
  },
  created () {
    if (this.isauto == true) {
      this.getnowaddress();
    }
  },

  methods: {
    //结束间隔second秒请求获取当前最新位置
    endContinuous () {
      window.vue2 = this;
      driver.stopContinuousLocation();
    },
    //开启间隔second秒请求获取当前最新位置
    startContinuous (second) {
      window.vue2 = this;
      driver.continuousLocation(Number(second));
    },
    //获取当前位置
    get_nearstore (latitude, longitude, speed, course) {
      if (!latitude || !longitude) {
        return;
      }
      this.position.latitude = latitude;
      this.position.longitude = longitude;
      if (this.isturnGAODE == true) {
        driver.MapLoader().then(aMap => {
          var gps = [longitude, latitude,];
          AMap.convertFrom(gps, 'gps', (status, result) => {
            if (result.info === 'ok' && result.locations[0]) {
              var lnglats = result.locations; // Array.<LngLat>
              var saveobj = {
                latitude: lnglats[0].lat,
                longitude: lnglats[0].lng,
                speed: speed || '',
                course: course || '',
              };
              this.$store.commit("setNowPosition", saveobj);
              this.$emit("sendAddress", saveobj);
            }
          });
        })

      } else if (this.isDetail == true) {
        var that = this;
        let url =
          "https://apis.map.qq.com/ws/geocoder/v1?&poi_options=address_format=short&get_poi=0";
        let locationdata = `${latitude},${longitude}`;
        this.$jsonp(url, {
          key: this.KEY,
          callbackName: "QQmap",
          output: "jsonp",
          location: locationdata,
        })
          .then((json) => {
            if (json.status == 121) {
              this.$toast.fail(json.message)
              return
            }
            let address_ar = json.result;
            var saveobj = {};
            saveobj.province = address_ar.address_component.province || "";
            saveobj.city = address_ar.address_component.city || "";
            saveobj.area = address_ar.address_component.district || "";
            saveobj.town = address_ar.address_component.street || "";
            saveobj.latitude = latitude || "";
            saveobj.longitude = longitude || "";
            saveobj.address = address_ar.address || "";
            that.address = address_ar.address || "";
            saveobj.speed = speed || '';
            saveobj.course = course || '';
            that.$store.commit("setNowPosition", saveobj);
            that.$emit("sendAddress", saveobj);
          })
          .catch(() => {
          });
      } else {
        var saveobj = {
          latitude: latitude,
          longitude: longitude,
          speed: speed || '',
          course: course || '',
        };
        this.$store.commit("setNowPosition", saveobj);
        this.$emit("sendAddress", saveobj);
      }

    },
    getnowaddress () {
      window.vue2 = this;
      switch (true) {
        case this.$fnc.isWx() &&
          this.$store.state.config.plugin &&
          this.$store.state.config.plugin.wxgzhbb &&
          this.$store.state.config.plugin.wxgzhbb.is_open == 1:
          var that = this;
          // eslint-disable-next-line no-case-declarations
          const toast = this.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: "spinner",
            message: "加载中...",
          });
          var obj = this.$store.state.appShareObj;
          obj.isGetLocation = true;
          that.$wxshare(obj, function (res, type) {
            toast.clear();
            if (type == 1) {
              that.position.latitude = res.latitude;
              that.position.longitude = res.longitude;

              console.log('x2')
              that.get_nearstore(res.latitude, res.longitude);
            } else if (type == 2) {
              // that.$toast.fail("用户拒绝授权获取地理位置");
              that.failaddress(); //获取定位失败
            } else {
              that.failaddress(); //获取定位失败
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
            // this.$fnc.postData({ type: "dw", data: "xxxxx" });
            var data = { type: "getCoor" };
            this.$fnc.postData(data);
          }

          break;
        default:
          this.failaddress();
          break;
      }
    },

    failaddress () {

      var xcx =
        navigator.userAgent.indexOf("miniProgram") !== -1 ? true : false;
      if (xcx == true) {
        //如果小程序端 失败
        if (localStorage.getItem("NowPosition")) {
          //获取进入时小程序写的缓存
          var obj = JSON.parse(localStorage.getItem("NowPosition"));
          var geocoder = new qq.maps.Geocoder();
          if (obj.latitude && obj.longitude && geocoder) {
            var that = this;
            var latLng = new qq.maps.LatLng(obj.latitude, obj.longitude);
            geocoder.getAddress(latLng);
            geocoder.setComplete(function (result) {
              if (result.detail.addressComponents) {
                var objXcx = {};
                objXcx.province =
                  result.detail.addressComponents.province || "";
                objXcx.city = result.detail.addressComponents.city || "";
                objXcx.area = result.detail.addressComponents.district || "";
                objXcx.town = result.detail.addressComponents.town || "";
                objXcx.latitude = result.detail.location.lat || "";
                objXcx.longitude = result.detail.location.lng || "";
                objXcx.address = result.detail.address || "";
                that.$emit("sendAddress", objXcx);

                console.log(444444444)
                that.$store.commit("setNowPosition", objXcx);
              } else {
                that.$emit("sendAddress", obj);

                console.log(5555555555)
                that.$store.commit("setNowPosition", obj);
              }
            });
          } else {
            this.$emit("sendAddress", obj);

            console.log(666666)
            this.$store.commit("setNowPosition", obj);
          }
          return;
        } else {
          this.address = "获取当前地址失败";
          this.$emit("sendAddress", {});
          return;
        }
      }

      //获取定位失败使用腾讯api定位方法
      var geolocation = new qq.maps.Geolocation(
        "QUEBZ-7FO3W-EBQRR-RRCFM-6DUC3-ZYBHX",
        "myMap"
      );
      geolocation.getLocation(
        (res) => {

          // 如果可以定位到当前区，则直接写入，反之则查询经纬度
          if (res.city) {
            var obj = {
              latitude: res.lat,
              longitude: res.lng,
              province: res.province || "",
              city: res.city,
              area: res.district,
              town: "",
              address: res.addr,
            };

            console.log(787777777)
            this.$store.commit("setNowPosition", obj);

            this.$emit("sendAddress", obj);
          } else {

            console.log('x3')
            this.get_nearstore(res.lat, res.lng);
          }
        },
        (rej) => {
          this.getIpAddress();
        }
      );
    },

    getIpAddress () {
      var that = this;
      let url = "https://apis.map.qq.com/ws/location/v1/ip";
      // let locationdata = `${latitude},${longitude}`;
      this.$jsonp(url, {
        key: this.KEY,
        callbackName: "QQmap",
        output: "jsonp",
      })
        .then((json) => {
          let address_ar = json.result;
          var saveobj = {};
          saveobj.province = address_ar.ad_info.province || "";
          saveobj.city = address_ar.ad_info.city || "";
          saveobj.area = address_ar.ad_info.district || "";
          saveobj.town = "";
          saveobj.address = "";
          saveobj.latitude = address_ar.location.lat || "";
          saveobj.longitude = address_ar.location.lng || "";

          console.log(88888888888)
          this.$store.commit("setNowPosition", saveobj);
          this.$emit("sendAddress", saveobj);
        })
        .catch(() => {
          this.address = "获取当前地址失败";
          this.$emit("sendAddress", {});
        });
    },
    showPosition (position) {
      try {
        this.position.latitude = position.coords.latitude;
        this.position.longitude = position.coords.longitude;

        console.log('x4')
        this.get_nearstore(this.position.latitude, this.position.longitude);
      } catch (error) {
        this.address = "获取当前地址失败";
      }
    },
    failCallback (error) {
      this.address = "获取当前地址失败";
    },
  },
};
</script>
<style lang="less" scoped>
.nowaddress {
  width: 100%;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  .address_left {
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