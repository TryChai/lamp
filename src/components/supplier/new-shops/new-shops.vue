<template>
  <div class="mes-nes-box" ref="shopsIndex">
    <div class="shops-box-bg" :style="{ background: supplier_background }">
      <shopsHead style="z-index: 9" :paramsCity="params" :dia_show="dia_show" :size_color="size_color" :size_color1="size_color1" :headers="headers"
          @showTabs="getShowTabs" @emitAddress="getemitAddress" @searchTitle="getSearch_btn" @hidePop="getHidePop" />
    </div>

    <shop-swiper v-if="
        info.slide.is_show == '1' &&
        info.slide.banner &&
        info.slide.banner.length > 0
      " class="new-shops-swiper" :slide="info.slide.banner" />

    <supplier-index-head v-if="info.navigation.is_show == '1' && info.navigation.banner.length > 0" :menuList="info.navigation.banner" />

    <shops-model :partList="partList" v-if="partList.length > 0" background="transparent" style="margin: 10px auto" />

    <shops-horizontal-shop :product="info.product" v-if="info.product.is_show == 1 && !$route.query.cate" />

    <div v-if="shop_list && shop_list.length > 0">
      <supplier-shop-item v-for="(item, i) in shop_list" :key="i" :item="item" />
    </div>

    <div style="display: none">
      <getaddress @sendAddress="recaddress" ref="getaddress"></getaddress>
    </div>

    <transition name="go-top">
      <img v-if="btnFlag" class="go-top" src="@/assets/img/top.png" @click="backTop" />
    </transition>
  </div>
</template>

<script>
import shopsHead from "./new-shops-head/shops-head";
import shopSwiper from "../shops/shops-swiper/shops-swiper";
import SupplierIndexHead from "@/components/currency/supplier/supplierIndex/SupplierIndexHead";
import { Divider, List } from "vant";
import wx from "weixin-js-sdk";
import shopsHorizontalShop from "../shops/shops-horizontal-shop/shops-horizontal-shop";
import SupplierIndexShops from "@/components/currency/supplier/supplierIndex/SupplierIndexShops";
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
import shopsModel from "../shops/shops-model/shops-model";
import getaddress from "@/components/currency/getaddress";
import SupplierShopItem from "@/components/currency/supplier/supplierShop/SupplierShopItem";

export default {
  data () {
    return {
      supplier_isshop: "1", //点击头部tab 1 搜索商品 2 搜索供应商
      size_color1: "",
      size_color: "",
      cate: "",
      partList: [],
      dia_show: false,
      info: {
        slide: {
          banner: [],
          is_show: "1",
        },
        navigation: {
          banner: [],
          is_show: "0",
        },
        merchant: {
          pro: [],
          is_show: "1",
        },
        product: {
          is_show: "0",
          pro: [],
          title: "",
          title_en: "",
        },
      },
      params: {
        province: "",
        city: "",
        area: "",
        town: "",
      },
      position: {
        latitude: "",
        longitude: "",
      },
      supplier_background: "",
      headers: [],
      is_serach: "",
      shop_list: [],
      btnFlag: false,
      scrollTop: 0,
    };
  },
  components: {
    shopsHead,
    shopSwiper,
    SupplierIndexHead,
    [Divider.name]: Divider,
    shopsHorizontalShop,
    SupplierIndexShops,
    indexshoplist,
    shopsModel,
    [List.name]: List,
    getaddress,
    SupplierShopItem,
  },
  created () {
    this.$store.commit("restAppShareObj");
    var checkSupplierCity = localStorage.getItem("checkSupplierCity");
    var address = localStorage.getItem("supplier-address");
    if (checkSupplierCity != undefined) {
      this.params = JSON.parse(checkSupplierCity);
    } else if (address != undefined) {
      this.params = JSON.parse(address);
    }
    var position = localStorage.getItem("latitude");
    if (position) {
      this.position = JSON.parse(position);
    }
    this.onLoad();
  },
  mounted () {
    this.$nextTick(() => {
      this.getSupplierPage();
    });
    this.$refs.shopsIndex.addEventListener("scroll", this.scrollToTop);
  },
  destroyed () {
    this.$refs.shopsIndex.removeEventListener("scroll", this.scrollToTop);
  },
  activated () {
    this.$refs.shopsIndex.scrollTop = this.scrollTop;
  },
  methods: {
    getShowTabs (val) {
      this.show = val;
    },
    getemitAddress (params) {
      localStorage.setItem("supplier-address", JSON.stringify(params));
      this.params = params;
      if (this.$route.query.shop_is_home) {
        params.shop_is_home = 1;
      }
      this.onLoad();
    },
    getSearch_btn (title) {
      this.search_btn(title);
    },
    getHidePop () { },
    scrollToTop () {
      var that = this;
      that.scrollTop = this.$refs.shopsIndex.scrollTop;
      if (that.scrollTop > 200) {
        that.btnFlag = true;
      } else {
        that.btnFlag = false;
      }
    },
    backTop () {
      const that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5);
        this.$refs.shopsIndex.scrollTop = document.body.scrollTop =
          that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    recaddress (val) {
      this.position = {
        latitude: val.latitude,
        longitude: val.longitude,
      };
      localStorage.setItem("latitude", JSON.stringify(this.position));
      this.params = {
        province: val.province || "",
        city: val.city || "",
        area: val.area || "",
        town: val.town || "",
      };
      try {
        var dwCity = {
          province: val.province,
          city: val.city,
          dw: true,
        };
        localStorage.setItem("dw-city", JSON.stringify(dwCity));
        localStorage.setItem("checkSupplierCity", JSON.stringify(this.params));
        that.toUpdateCity(dwCity);
      } catch { }
      localStorage.setItem("supplier-address", JSON.stringify(this.params));
      this.onLoad();
    },
    search_btn (title) {
      this.shop_list = [];
      var params = {};
      params.title = title;
      if (this.$route.query.shop_is_home) {
        params.shop_is_home = 1;
      }
      this.$api.getSupplier.search_supplier_title(params).then((res) => {
        if (res.code == 200) {
          try {
            this.shop_list = res.result.info.merchant.pro || [];
          } catch {
            this.shop_list = [];
          }
        }
      });
    },
    onLoad () {
      let params = {};
      if (this.$route.query.shop_is_home) {
        params.shop_is_home = 1;
      }

      params.province = this.params.province;
      params.city = this.params.city;
      // params.area = this.params.area || "";
      // params.town = this.params.town || "";
      if (this.position.latitude) {
        params.latitude = this.position.latitude || "";
        params.longitude = this.position.longitude || "";
      }
      this.$api.getSupplier.get_pageaddress(params).then((res) => {
        if (res.code == 200) {
          try {
            this.shop_list = res.result.info.merchant.pro || [];
          } catch {
            this.shop_list = [];
          }
        }
      });
    },
    getSupplierPage (datas) {
      var params = datas || {};
      if (this.$route.query.shop_is_home) {
        params.shop_is_home = 1;
      }
      this.$api.getSupplier.supplierPage(params).then((res) => {
        if (res.code == 200) {
          if (res.result.module) {
            this.partList = res.result.module;
          }
          this.headers = res.result.headers;
          this.info.slide = res.result.info.slide;
          this.info.navigation = res.result.info.navigation;
          this.info.product = res.result.info.product;
          this.info.merchant = res.result.info.merchant;

          if (res.result.supplier_background) {
            if (res.result.supplier_background.indexOf("#") >= 0) {
              this.supplier_background = res.result.supplier_background;
            } else {
              this.supplier_background =
                "url(" + res.result.supplier_background + ") no-repeat";
            }
          }
          var colors = res.result.size_color;
          if (colors.split("|")[0]) {
            this.size_color = colors.split("|")[0];
          }
          if (colors.split("|")[1]) {
            this.size_color1 = colors.split("|")[1];
          }
          this.supplier_isshop = res.result.supplier_isshop;
        }
      });
    },
  },
};
</script>

<style lang='less' scoped>
.mes-nes-box {
  width: 100%;
  height: 100%;
  padding-bottom: 50px;
  overflow: auto;
  font-size: 14px;
  background: #f4f4f4;

  .shops-box-bg {
    width: 100%;
    height: 100px;
  }

  .new-shops-swiper {
    margin-top: -50px;
  }
}

.go-top {
  animation-duration: 0.5s;
  z-index: 9990;
  position: fixed;
  right: 10px;
  bottom: 60px;
  width: 36px;
  border-radius: 50%;
}
.go-top-enter,
.go-top-leave-to {
  opacity: 0;
}
.go-top-enter-to,
.go-top-leave {
  opacity: 1;
}
.go-top-enter-active,
.go-top-leave-active {
  transition: 2s;
}
</style>