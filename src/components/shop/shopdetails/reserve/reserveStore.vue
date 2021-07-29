<template>
  <div style="height:100%;padding-bottom: 76px;">
    <div class="reserveStore">
      <van-nav-bar title="选择服务门店" left-text left-arrow class="navbar" @click-left="close" />

      <div class="fx rescity" @click="showCity = !showCity">
        <div>
          <span>{{params.province}}</span>
        </div>
        <div>
          <span>{{params.city}}</span>
        </div>
      </div>

      <div class="city_menu" id="city_menu" :class="{showPop:showCity}">
        <van-popup
          class="city_menu_pop"
          get-container="#city_menu"
          v-model="showCity"
          position="top"
          :overlay="false"
        >
          <reserveCitys @setProvCity="getProvCity"></reserveCitys>
        </van-popup>
      </div>
      <div class="have_store" v-if="JSON.stringify(info)!='[]'">
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell v-for="(data,i) in info" :key="i" @click="setStore(data)">
              <van-radio slot="icon" :name="data.id" />
              <div class="store_radio" slot="title">
                <img v-lazy="data.piclink" alt />
                <div class="stra1_con">
                  <p>{{data.title}}</p>
                  <p>
                    已服务
                    <span>{{data.count}}</span>&nbsp;单
                  </p>
                  <p>{{data.province + data.city + data.area + data.town + data.add}}</p>
                </div>
              </div>
              <div class="stra2_con" slot="default">
                <div class="location" @click="toDh(data)" v-if="data.distance>0">
                  <p v-show="data.distance>0">{{data.distance>=1000?data.distance/1000+'km':data.distance+'m'}}</p>
                  <van-icon name="location-o" color="#222222" size="0.5rem" />
                </div>
              </div>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="empty_store" v-else>
        <img src="../../../../assets/img/empty.png" alt />
        <p>该地区暂无门店</p>
      </div>
    </div>
    <div class="store_btn">
      <van-button class="btn_red" type="default" @click="addStore">确定门店</van-button>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import reserveCitys from "./reserveCitys.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
import wx from "weixin-js-sdk";
export default {
  components: {
    reserveCitys,
    MescrollVue
  },
  props: {
    shopInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      radio: 0,
      params: {
        province: "省份",
        city: "城市"
      },
      showCity: false,
      info: [],
      position: {
        latitude: "",
        longitude: ""
      },
      store: {}
    };
  },
  created() {},
  mounted() {
    var address = localStorage.getItem("reserve-address");
    if (address) {
      this.params = JSON.parse(address);
      this.getStoreList(this.params);
    } else {
      this.supplier_three();
    }
  },
  methods: {
    setStore(val) {
      this.store = val;
      this.radio = val.id;
    },
    addStore() {
      if (this.store.id) {
        this.$emit("setStore", this.store);
        this.$emit("closeStore");
      } else {
        this.$toast.fail("请选择门店");
      }
    },
    close() {
      this.$emit("closeStore");
    },
    getProvCity(val, flag) {
      this.params = val;
      if (flag) {
        this.showCity = false;
        localStorage.setItem("reserve-address", JSON.stringify(val));
        this.getStoreList(this.params);
      }
    },
    getStoreList(params) {
      params = params || {};
      if (localStorage.getItem("latitude") != null) {
        this.position = JSON.parse(localStorage.getItem("latitude"));
      }
      if (this.position.latitude) {
        params.latitude = this.position.latitude || "";
        params.longitude = this.position.longitude || "";
      }
      params.sid = this.shopInfo.sid;
      this.$api.getShop.reserve_store_lists(params).then(res => {
        if (res.code == 200) {
          this.info = res.result;
        }
      });
    },
    supplier_two() {
      var address = localStorage.getItem("reserve-address");
      if (address) {
        this.params = JSON.parse(address);
        this.getStoreList(this.params);
      } else {
        this.showCity = true; //弹出选择地区
      }
    },
    async supplier_three() {
      //  是微信端或者app端  获取定位，如果是手机浏览器端或者获取不到经纬度 判断缓存如果有选择过地区，
      //  左上角显示缓存的地区，请求缓存地区的接口，如果没有缓存那么左上角显示选择地区，请求的是推荐店铺的接口
      //  根据定位获取商户
      switch (true) {
        case this.$fnc.isWx():
          if (localStorage.getItem("latitude") != null) {
            this.position = JSON.parse(localStorage.getItem("latitude"));
            this.get_address(this.position.latitude, this.position.longitude);
          } else {
            this.$toast("获取位置信息中", 1000);
            var that = this;
            await wx.ready(() => {
              wx.getLocation({
                type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function(res) {
                  var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                  var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                  that.position.latitude = latitude;
                  that.position.longitude = longitude;
                  console.log("getLocation", that.position);
                  that.get_address(latitude, longitude);
                },
                cancel: function(rej) {
                  that.$toast.fail("获取位置信息失败", rej);
                  that.supplier_two();
                }
              });
            });
          }
          break;
        case this.$fnc.isapp() || this.$fnc.isYkAPP():
          this.position.latitude = ykAPP.getLatitude(); // 纬度，浮点数，范围为90 ~ -90
          this.position.longitude = ykAPP.getlongitude(); // 经度，浮点数，范围为180 ~ -180。
          if (this.position.latitude != "" && this.position.longitude != "") {
            this.get_address(this.position.latitude, this.position.longitude);
          } else {
            this.supplier_two();
          }
          break;
        default:
          this.supplier_two();
          break;
      }
    },
    get_address(lat, lng) {
      console.log(lat, lng);
      //根据经纬度获取商户
      var latitude = {};
      latitude.latitude = lat;
      latitude.longitude = lng;
      this.position = latitude;
      var that = this;
      localStorage.setItem("latitude", JSON.stringify(latitude)); //11

      //获取具体位置
      const KEY = "QUEBZ-7FO3W-EBQRR-RRCFM-6DUC3-ZYBHX";
      let url =
        "https://apis.map.qq.com/ws/geocoder/v1?&poi_options=address_format=short&get_poi=0";
      let locationdata = `${lat},${lng}`; //纬度，经度
      this.$jsonp(url, {
        key: KEY,
        callbackName: "QQmap",
        output: "jsonp",
        location: locationdata
      })
        .then(json => {
          let address = json.result;
          var dz = localStorage.getItem("reserve-address");
          if (!dz) {
            that.params.province = address.address_component.province;
            that.params.city = address.address_component.city;
          }
          var dwCity = {
            province: address.address_component.province,
            city: address.address_component.city,
            dw: true
          };
          localStorage.setItem("reserve-address", JSON.stringify(dwCity));

          that.getStoreList(that.params);
        })
        .catch(err => {});
    },
    toDh(item) {
      console.log(item);
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == "ykapp") {
        this.isApp = true; //第二个app
      }
      var that = this;
      if (that.isApp) {
        try {
          this.$fnc.appNav(that.position.latitude, that.position.longitude);
        } catch (error) {
          that.$toast.fail("App地图跳转失败");
        }
      } else if (that.$fnc.isWx()) {
        var obj = {};
        obj.latitude = parseFloat(that.position.latitude);
        obj.longitude = parseFloat(that.position.longitude);
        obj.name = item.title;
        obj.address = item.province + item.city + item.area + item.add;
        obj.scale = 14;
        obj.infoUrl =
          location.origin + "/shop/shopdetails?id=" + that.shopInfo.id;
        // this.wxApi.ToLocation(obj);
        wx.openLocation(obj);
      } else {
        that.$toast.fail("地图跳转失败");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.empty_store {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  > img {
    width: 45%;
  }
  > p {
    font-size: 12px;
    color: #999999;
  }
}
.have_store {
  width: 100%;
  height: 100%;
  // padding-bottom: 70px;
  .van-radio {
    // padding: 15px 15px 10px;
    // align-items: flex-start;
    padding-right: 10px;
  }
  .store_radio {
    display: flex;
    justify-content: flex-start;
    > img {
      width: 80px;
      height: 100%;
    }
    .stra1_con {
      margin-left: 10px;
      width: 185px;
      > p {
        font-size: 13px;
        color: #a9a9a9;
        line-height: 1.8;
        > span {
          color: #f2140c;
        }
      }
      > p:nth-child(1) {
        font-size: 16px;
        color: #222;
      }
    }
  }
  .stra2_con {
    // margin-left: 8px;
    // position: relative;
    .location {
      // position: absolute;
      // bottom: 0;
      text-align: center;
      > p {
        font-size: 12px;
        color: #a9a9a9;
        // text-align: center;
        line-height: 1;
      }
    }
  }
}
.store_btn {
  height: 70px;
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  z-index: 1;
  background: #fff;
  padding: 5px 0;
  .btn_red {
    width: 340px;
    height: 46px;
    line-height: 46px;
    display: block;
    margin: 0 auto;
    background: linear-gradient(to right top, #f2140c, #f34a0c);
    color: #fff;
    border-radius: 27px;
    margin-top: 10px;
  }
}
.city_menu {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  top: 95px;
  overflow: hidden;
  max-height: 0;
  z-index: 10;
  transition: all 0.3s ease-out, -webkit-transform 0.3s ease-out;
  display: flex;
}
.city_menu_pop {
  position: absolute;
  max-height: 100%;
  height: 100%;//ceil(100%-8px);
  border-radius: 0;
}
.showPop {
  max-height: 100% !important;
}
.reserveStore {
  height: 100%;
  overflow: auto;
  // padding-bottom: 76px;
  position: relative;
  .rescity {
    justify-content: flex-start;
    height: 50px;
    font-weight: bold;
    > div {
      width: 50%;
      text-align: center;
      > span {
        position: relative;
        width: 50%;
        color: #323233;
        font-size: 15px;
        padding: 0 6px 0 0;
        text-align: center;
      }
      > span::after {
        position: absolute;
        top: 50%;
        right: -4px;
        margin-top: -5px;
        border: 3px solid;
        border-color: transparent transparent currentColor currentColor;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        opacity: 0.8;
        content: "";
      }
    }
  }
}
</style>
