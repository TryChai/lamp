<template>
  <div class="supplier-index-con">
    <van-nav-bar title left-text="商户中心" left-arrow class="navbar" @click-left="toBack">
      <div slot="right" style="color:rgb(25, 137, 250)" @click="dia_show = true">
        <van-icon name="location-o" size="20px" slot="right" />
        {{params.town}}
      </div>
    </van-nav-bar>
    <div class="search_box" style="margin:0 !important">
      <van-search v-model="search" placeholder="请输入店铺名" show-action shape="round" @search="search_btn">
        <div slot="action" @click="search_btn">搜索</div>
      </van-search>
    </div>
    <supplier-index-head v-if="info.navigation.is_show=='1' && info.navigation.banner.length>0" :menuList="info.navigation.banner" />
    <supplier-index-swiper v-if="info.slide.is_show=='1'" :slide="info.slide.banner" />
    <supplier-index-shops v-if="info.merchant.is_show=='1' && info.merchant.pro != undefined && info.merchant.pro.length>0"
        :pro="info.merchant.pro" />
    <div v-if="info.merchant.pro != undefined && info.merchant.pro.length == 0" class="empty_shop" style>
      <img src="./../../../assets/img/empty.png" alt />
      <p>暂未发现商家..</p>
    </div>
    <van-dialog v-model="dia_show" title="获取位置" show-cancel-button @confirm="save_position">
      <div style="height:60px;">
        <van-cell title="地区" :value="cateTitle" style="font-size:14px" @click="seladdressshow = true">
          <van-icon name="arrow" slot="right-icon" size="14px" />
        </van-cell>
      </div>
    </van-dialog>

    <selAddress :level="4" :show="seladdressshow" @confirm="confirmaddress"></selAddress>

  </div>
</template>

<script>
import SupplierIndexHead from "@/components/currency/supplier/supplierIndex/SupplierIndexHead";
import SupplierIndexSwiper from "@/components/currency/supplier/supplierIndex/SupplierIndexSwiper";
import SupplierIndexShops from "@/components/currency/supplier/supplierIndex/SupplierIndexShops";
import { Field, Search } from "vant";
import wx from "weixin-js-sdk";
import axios from "axios";

import selAddress from "@/components/currency/selAddress/selAddress"

export default {
  name: "SupplierIndex",
  components: {
    SupplierIndexHead,
    SupplierIndexSwiper,
    SupplierIndexShops,
    [Field.name]: Field,
    [Search.name]: Search,
    selAddress
  },
  data () {
    return {
      seladdressshow: false,
      search: "",
      position: {
        latitude: "", //纬度
        longitude: "" //精度
      },
      notice: "",
      addressLists: [],
      mobileSelect4: Object,
      params: {
        province: "",
        city: "",
        area: "",
        town: ""
      },
      cateTitle: "请选择所在地区",
      address: {},
      data: "",
      title: "",
      dia_show: false,

      info: {
        slide: {
          banner: [],
          is_show: "1"
        },
        navigation: {
          banner: [],
          is_show: "1"
        },
        merchant: {
          pro: [],
          is_show: "1"
        }
      }
    };
  },
  created () {
    localStorage.removeItem("position");
    this.getSupplierPage();
  },
  mounted () {

  },
  methods: {
    confirmaddress (data) {
      this.params.province = data[0] || '';
      this.params.city = data[1] || '';
      this.params.area = data[2] || '';
      this.params.town = data[3] || '';
      this.cateTitle = `${data[0] || ''}${data[1] || ''}${data[2] || ''}${data[3] || ''} `
      this.notice = "";
      this.seladdressshow = false;
    },
    search_btn () {
      this.info.merchant = {};
      var params = {};
      params.title = this.search;
      this.$api.getSupplier.search_supplier_title(params).then(res => {
        if (res.code == 200) {
          this.info.merchant = res.result.info.merchant;
          this.info.merchant.is_show = 1;
        }
      });
    },
    get_cate () {
      this.$api.getSupplier
        .get_supplier_cate({ cate: this.$route.query.cate })
        .then(res => {
          if (res.code == 200) {
            this.info.merchant.pro = res.result.info.merchant.pro;
          }
        });
    },
    get_position () {
      wx.getLocation({
        type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          var obj = {};
          obj.latitude = res.latitude;
          obj.longitude = res.longitude;
          alert(latitude, longitude);
          // this.get_address(this.position.latitude, this.position.longitude);
        },
        cancel: function (res) {
          alert("用户拒绝授权获取地理位置");
        }
      });
    },
    save_position () {
      //弹出框确认保存地址信息
      this.notice = this.cateTitle;
      // localStorage.setItem('position', JSON.stringify(this.params))//22
      this.under_address();
    },
    open_sel () {
      this.mobileSelect4.updateWheels(this.addressLists);
      this.mobileSelect4.show();
      this.search = "";
    },

    get_address (lat, lng) {
      //根据经纬度获取商户
      var latitude = {};
      latitude.latitude = lat;
      latitude.longitude = lng;
      // localStorage.setItem('latitude', JSON.stringify(latitude))//11
      this.$api.getSupplier.get_address_supplier(latitude).then(res => {
        this.info.merchant = res.result.info.merchant;
      });
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
          let address = json.result.address;
          this.notice = address;
          this.params.town = address;
        })
        .catch(err => { });
    },
    supplier_three () {
      //根据定位获取商户
      switch (true) {
        case this.$fnc.isWx():
          // if (localStorage.getItem('latitude') != null) {
          //     this.position = JSON.parse(localStorage.getItem('latitude'));
          //     this.get_address(this.position.latitude, this.position.longitude)
          // } else {
          this.$toast.fail("获取位置信息中", 3000);
          var that = this;
          setTimeout(() => {
            wx.ready(() => {
              wx.getLocation({
                type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                  var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                  var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                  that.position.latitude = latitude;
                  that.position.longitude = longitude;
                  that.$toast.fail("获取位置信息成功");
                  that.get_address(latitude, longitude);
                },
                cancel: function (rej) {
                  that.$toast.fail("获取位置信息失败", rej);
                  that.supplier_two();
                }
              });
            });
          }, 1500);
          // }
          break;
        case this.$fnc.isapp() || this.$fnc.isYkAPP():
          if (localStorage.getItem("latitude") != null) {
            // this.position = JSON.parse(localStorage.getItem('latitude'));
            this.get_address(this.position.latitude, this.position.longitude);
          } else {
            // eslint-disable-next-line no-undef
            this.position.latitude = ykAPP.getLatitude(); // 纬度，浮点数，范围为90 ~ -90
            // eslint-disable-next-line no-undef
            this.position.longitude = ykAPP.getlongitude(); // 经度，浮点数，范围为180 ~ -180。
            if (this.position.latitude != "" && this.position.longitude != "") {
              this.get_address(this.position.latitude, this.position.longitude);
            } else {
              this.supplier_two();
            }
          }
          break;
        default:
          this.supplier_two();
          break;
      }
    },
    under_address () {
      //根据地区获取商户
      let params = {};
      params.province = this.params.province;
      params.city = this.params.city;
      params.area = this.params.area;
      params.town = this.params.town;
      this.$api.getSupplier.get_pageaddress(params).then(res => {
        //2
        if (res.code == 200) {
          this.info.merchant = res.result.info.merchant;
        }
      });
    },
    supplier_two () {
      if (JSON.parse(localStorage.getItem("position"))) {
        this.params = JSON.parse(localStorage.getItem("position"));
        this.notice = `${this.params.province}${this.params.city}${this.params.area}${this.params.town}`;
        this.under_address();
      } else {
        this.dia_show = true;
      }
    },
    getSupplierPage (params) {
      var params = params || {};
      this.$api.getSupplier.supplierPage(params).then(res => {
        if (res.code == 200) {
          this.info.slide = res.result.info.slide;
          this.info.navigation = res.result.info.navigation;
          this.supplier_home = res.result.supplier_home;
          this.info.merchant = res.result.info.merchant;
          if (this.$route.query.cate) {
            this.get_cate();
          } else {
            this.supplier_three();
            // switch (true) {
            //     case this.supplier_home == 1:
            //         this.info.merchant = res.result.info.merchant
            //         break;
            //     case this.supplier_home == 2:
            //         this.supplier_two();
            //         break;
            //     case this.supplier_home == 3:
            //         this.supplier_three();
            //         break;
            //     default:
            //         break;
            // }
          }
        }
      });
    }
  },
  watch: {}
};
</script>


<style lang="less" scoped>
.supplier-index-con {
  font-size: 14px;
  line-height: 1;
  background: #f3f3f3;
  overflow: auto;

  > div:not(:first-child) {
    // margin-top: 10px;
    margin-bottom: 10px;
  }
}
.empty_shop {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.empty_shop p {
  font-size: 12px;
  color: #999999;
}
</style>

