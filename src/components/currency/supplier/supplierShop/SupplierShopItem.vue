<template>
  <div class="sup-shop-item">
    <div class="fx sup-item-one">
      <img :src="$fnc.getImgUrl(item.shop_logo)" @click="toSupplier" />
      <div>
        <div class="fx">
          <p class="van-ellipsis shop_title">
            {{ item.shop_title }}
          </p>
          <p class="fx jindian" @click="toSupplier">
            <span>进店</span>
            <van-icon name="arrow" />
          </p>
        </div>
        <div class="fx" style="justify-content: flex-start">
          <i class="fa fa-star rate_i" caria-hidden="true"></i>
          <span class="rate">5.0 </span>
          <span class="number">{{ item.product_number || 0 }}件商品 </span>
          <span class="distance" v-if="item.distance && item.distance > 0">
            距您{{ toDistance }}
          </span>
          <i
            class="fa fa-location-arrow distance_i"
            v-if="item.distance && item.distance > 0"
            @click="toDh"
          ></i>
        </div>
      </div>
    </div>
    <div class="sup-item-tow" v-if="item.shop_recommend">
      <van-tag color="#ffb400">介绍</van-tag>
      {{ item.shop_recommend || "暂无介绍" }}
    </div>
    <div class="fx sup-item-three">
      <div
        v-for="(it, indexd) in item.product_lists"
        :key="indexd"
        @click="
          $router.push('/shop/shopdetails?tid=' + appusers.uid + '&id=' + it.id)
        "
        class="sup_product"
      >
        <img :src="it.piclink" v-lazy="it.piclink" alt="" />
        <p class="van-ellipsis">
          {{ it.title }}
        </p>
        <p class="price_regular">
          <small>￥</small>
          <b>{{ $fnc.get_int_dec(it.price, "int") }}</b>
          <i>{{ $fnc.get_int_dec(it.price, "dec") }}</i>
          <span v-if="it.market_price > 0">
            ￥{{ $fnc.toFixedZ(it.market_price) }}
          </span>
        </p>
      </div>
      <div
        class="fx empty"
        v-if="item.product_lists && item.product_lists.length == 0"
      >
        更多商品在陆续赶来~
      </div>
    </div>
  </div>
</template>


<script>
import { Tag, Rate } from "vant";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      value: 5,
    };
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    toDistance() {
      if (this.item.distance >= 1000) {
        return this.item.distance / 1000 + "KM";
      } else {
        return this.item.distance + "M";
      }
    },
  },
  components: {
    [Tag.name]: Tag,
    [Rate.name]: Rate,
  },
  methods: {
    toSupplier() {
      if (this.$route.query.shop_is_home) {
        this.$router.push("/shop/cateimg?id=" + this.item.id);
      } else {
        this.$router.push("/supplier/supplierdetails?id=" + this.item.id);
      }
    },
    toDh() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == "ykapp") {
        this.isApp = true; //第二个app
      }
      var that = this;
      if (that.isApp) {
        try {
          that.$fnc.appNav(that.item.shop_latitude, that.item.shop_longitude);
        } catch (error) {
          that.$toast.fail("App地图跳转失败");
        }
      } else if (that.$fnc.isWx()) {
        var obj = {};
        obj.latitude = parseFloat(that.item.shop_latitude);
        obj.longitude = parseFloat(that.item.shop_longitude);
        obj.name = that.item.shop_title;
        obj.address =
          that.item.shop_province +
          that.item.shop_city +
          that.item.shop_area +
          that.item.shop_town +
          that.item.shop_address;
        obj.scale = 14;
        obj.infoUrl =
          location.origin + "/supplier/supplierdetails?id=" + that.item.id;

        var isxcx = sessionStorage.getItem("is_XcX") || false;
        if (isxcx == true || isxcx == "true") {
          wx.miniProgram.navigateTo({
            url: `/pages/map/map?latitude=${obj.latitude}&longitude=${obj.longitude}&name=${obj.name}&address=${obj.address}`,
          });
        } else {
          this.wxApi.ToLocation(obj);
        }
      } else {
        this.$toast.fail("请在微信或者app打开");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.sup-shop-item {
  width: 94%;
  background: #fff;
  border-radius: 10px;
  margin: 10px auto;
  padding: 12px 10px;
  font-size: 14px;

  .sup-item-one {
    width: 100%;
    align-items: flex-start;

    > img {
      width: 45px;
      height: 45px;
      margin-right: 10px;
    }

    .shop_title {
      width: 220px;
      font-size: 17px;
      font-weight: bold;
      line-height: 1.6;
    }

    .jindian {
      width: 50px;
      margin-left: 10px;
      font-weight: bold;
      font-size: 17px;
      line-height: 1.6;
      .van-icon {
        font-size: 14px;
      }
    }

    .rate_i {
      font-size: 12px;
      color: #ffb400;
      margin-right: 2px;
    }
    .rate {
      color: #ffb400;
      font-size: 12px;
      margin-right: 10px;
    }

    .number {
      font-size: 12px;
      color: rgb(85, 86, 88);
      margin-right: 10px;
    }
    .distance {
      font-size: 12px;
      color: rgb(85, 86, 88);
      margin-right: 3px;
    }
    .distance_i {
      font-size: 13px;
      color: rgb(85, 86, 88);
    }
  }

  .sup-item-tow {
    width: 100%;
    margin-top: 10px;
    line-height: 1.5;
  }

  .sup-item-three {
    width: 100%;
    margin-top: 10px;

    .empty {
      width: 100%;
      justify-content: center;
      height: 80px;
      color: #777;
    }

    .sup_product {
      width: 106px;
      img {
        width: 106px;
        height: 106px;
        object-fit: cover;
        border-radius: 8px;
      }
      > p:nth-of-type(1) {
        font-size: 15px;
        margin-top: 2px;
      }
      .price_regular {
        line-height: 1;
        margin-top: 3px;
        > small {
          font-size: 12px;
        }
        > b {
          font-size: 17px;
        }
        > i {
          font-size: 14px;
          font-weight: normal;
          font-style: normal;
        }
        > span {
          font-size: 10px;
          color: #999999;
          text-decoration: line-through;
          margin-left: 2px;
        }
      }
    }
  }
}
</style>

