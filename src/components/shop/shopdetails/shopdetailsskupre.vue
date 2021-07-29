<template>
  <div class="sku_con">
    <div class="fx shops_info van-hairline--bottom">
      <div>
        <img
          @click="show_pic(shopItem.piclink)"
          v-lazy="shopItem.piclink"
          alt
        />
      </div>
      <div class="sku_d2">
        <p class="sp1" v-if="shopInfo.types == 7">
          <small>￥</small>
          {{ get_price() }}
        </p>
        <p class="sp1" v-else-if="shopInfo.types == 2">
          <small>{{ $store.state.config.shop.integral_cn || "积分" }}：</small>
          {{ $fnc.toFixedZ(shopInfo.score_rob) }}
        </p>
        <p class="sp1" v-else-if="shopInfo.types == 4 && is_pintuan == true">
          <small>￥</small>
          {{ $fnc.toFixedZ(group.group_price) }}
        </p>
        <p class="sp1" v-else>
          <small>￥</small>
          {{ shopItem.price || shopInfo.price }}
        </p>
        <p class="sp2" v-if="shopItem.hid || shopInfo.hid">
          商品编号：{{ shopItem.hid || shopInfo.hid }}
        </p>
        <p class="sp2">库存：{{ shopItem.stock || shopInfo.stock }}件</p>
      </div>
      <van-icon
        name="close"
        coolr="#969799"
        @click="closePop"
        size="20px"
        class="close_sku"
      />
    </div>
    <div
      class="shops_d2 van-hairline--bottom van-hairline--top"
      v-if="shopInfo.attr && shopInfo.attr.length > 0"
    >
      <div v-for="(item, i) in shopInfo.attr" :key="i">
        <p class="shops_d2_p">{{ item.title }}</p>
        <div class="guige">
          <span
            :class="[
              parentList[i] == it.parent_id + ':' + it.sku_id ? 'ac_tive' : '',
            ]"
            v-for="(it, ii) in item.info"
            :key="ii"
            @click="showGg(it, i)"
            >{{ it.sku_title }}</span
          >
        </div>
      </div>
    </div>

    <!-- 预约 -->
    <div class="shops_d4 van-hairline--bottom" @click="set_reserve_store">
      <p>选择门店</p>
      <van-cell :title="reserve_store" icon="shop-o" is-link></van-cell>
    </div>

    <div class="shops_d4 van-hairline--bottom" @click="set_reserve_time">
      <p>选择预约时间</p>
      <van-cell :title="reserve_time" icon="clock-o" is-link></van-cell>
    </div>

    <div class="shops_d2 shops_d3 van-hairline--bottom">
      <div>
        <p class="fx shops_d2_p" v-if="shopInfo.types == 2">我要兑换</p>
        <p class="fx shops_d2_p" v-else>
          我要买：
          <van-stepper
            v-model="number"
            :max="shopItem.stock || shopInfo.stock"
            integer
          />
        </p>
        <div
          class="buy"
          v-if="shopInfo.day_limit_buy > 0 || shopInfo.all_limit_buy > 0"
        >
          <span v-if="shopInfo.day_limit_buy > 0"
            >每{{ shopInfo.day_limit }}天限购{{
              shopInfo.day_limit_buy
            }}件</span
          >
          <!-- <span v-if="shopInfo.day_limit_buy>0">每天限购{{shopInfo.day_limit_buy}}件</span> -->
          <span v-if="shopInfo.all_limit_buy > 0"
            >总限购{{ shopInfo.all_limit_buy }}件</span
          >
        </div>
      </div>
    </div>

    <van-button class="btn_team" type="default" @click="addCart"
      >确定</van-button
    >
    <van-popup
      v-model="showStore"
      position="bottom"
      :overlay="true"
      get-container="body"
      style="border-radius: 0; height: 100%"
    >
      <reserveStore
        :shopInfo="shopInfo"
        @setStore="getStore"
        @closeStore="getCloseStore"
      />
    </van-popup>

    <van-popup
      v-model="showTime"
      position="bottom"
      :overlay="true"
      get-container="body"
      style="border-radius: 0; height: 100%"
    >
      <reserveTime
        :storeInfo="storeInfo"
        :shopInfo="shopInfo"
        @setTime="getTime"
        @closeTime="getCloseTime"
      />
    </van-popup>
  </div>
</template>

<script>
import { Stepper, ImagePreview } from "vant";
import { setTimeout } from "timers";
import reserveStore from "./reserve/reserveStore";
import reserveTime from "./reserve/reserveTime";
export default {
  components: {
    [Stepper.name]: Stepper,
    [ImagePreview.name]: ImagePreview,
    reserveStore,
    reserveTime,
  },
  props: {
    is_pintuan: {
      type: Boolean,
      default: false,
    },
    shopInfo: {
      type: Object,
      default: () => ({}),
    },
    toAut: {
      type: Number,
      default: 0,
    },
    group_types: {
      type: String,
      default: "",
    },
    group: {
      type: Object,
      default: () => ({}),
    },
    group_id: {
      type: String,
      default: "",
    },
    is_car: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: 1,
      showList: [],
      parentList: [],
      shopItem: { piclink: "", iden: "" },
      showBtn: true,
      number: 1,
      skuItemImg: "",
      showStore: false,
      showTime: false,
      reserve_store: "请选择门店",
      reserve_time: "请选择预约时间",
      storeInfo: {},
    };
  },
  mounted() {
    if (JSON.stringify(this.shopInfo != "{}")) {
      var arr = this.shopInfo.attr;

      for (var i in arr) {
        if (arr[i].info.length == 1) {
          this.parentList[i] =
            arr[i].info[0].parent_id + ":" + arr[i].info[0].sku_id;
        } else {
          this.parentList[i] = "";
        }
      }
      this.$nextTick(() => {
        this.parentList.splice();
        this.shopItem.piclink = this.shopInfo.piclink;
      });
    }
  },
  methods: {
    //预约
    set_reserve_store() {
      this.showStore = true;
    },
    getCloseStore() {
      this.showStore = false;
    },
    getStore(val) {
      this.storeInfo = val;
      this.reserve_store = val.title;
      this.reserve_time = "请选择预约时间";
      this.shopInfo.reserve_time = "";
    },
    set_reserve_time() {
      if (this.storeInfo.id) {
        this.showTime = true;
      } else {
        this.$toast.fail("请先选择门店");
      }
    },
    getTime(val) {
      this.reserve_time = this.$fnc.getTimeFormat(val);
      this.shopInfo.reserve_time = val;
    },
    getCloseTime(val) {
      if (val) {
        this.showTime = false;
        this.showStore = true;
      }
      this.showTime = false;
    },

    show_pic(pic) {
      var arr = [];
      arr[0] = pic;
      ImagePreview(arr);
    },
    get_price() {
      if (this.shopItem.price) {
        return this.$fnc.toFixedZ(
          this.shopItem.price * this.shopInfo.discount_rob * 0.1,
          2
        );
      } else {
        return this.shopInfo.activity.limited_price;
      }
    },
    showGg(sku, index) {
      var l = 0,
        arr = [],
        a = [],
        that = this,
        skuList = [],
        str = "",
        skuIdList = [];

      if (
        that.parentList[index] &&
        that.parentList[index] == sku.parent_id + ":" + sku.sku_id
      ) {
        that.parentList[index] = "";
        skuIdList[index] = "";
      } else {
        that.parentList[index] = sku.parent_id + ":" + sku.sku_id;
        skuIdList[index] = sku.sku_id;
      }
      that.parentList.splice();

      l = that.shopInfo.attr.length || 0;
      arr = that.parentList;
      a = arr.filter((item) => {
        return item;
      });

      if (a.length == l) {
        skuList = that.shopInfo.sku_json;
        str = a.join("@");
        for (var i = 0; i <= skuList.length; i++) {
          if (skuList[i] != undefined && str == skuList[i].iden) {
            if (!skuList[i].piclink) {
              this.skuItemImg = this.shopItem.piclink;
            }
            this.shopItem = skuList[i];
            if (skuList[i].rating_json && skuList[i].rating_json.length > 0) {
              for (var j in skuList[i].rating_json) {
                if (
                  this.$store.state.user.rating ==
                    skuList[i].rating_json[j].id &&
                  skuList[i].rating_json[j].price > 0
                ) {
                  this.shopItem.price = skuList[i].rating_json[j].price;
                }
              }
            }
            break;
          }
        }
        var a = [];
        var attr = this.shopInfo.attr;
        for (var i in attr) {
          if (attr[i].info) {
            for (var j in attr[i].info) {
              a.push(attr[i].info[j]);
            }
          }
        }
        var iden = [];

        if (this.shopItem.iden && this.shopItem.iden.indexOf("@") >= 0) {
          iden = this.shopItem.iden.split("@");
        } else if (this.shopItem.iden) {
          iden = this.shopItem.iden.split();
        }
        for (var k in a) {
          for (var j in iden) {
            if (a[k].parent_id + ":" + a[k].sku_id == iden[j] && a[k].piclink) {
              this.skuItemImg = a[k].piclink;
              break;
            }
          }
        }
      } else {
        // var pic = this.shopItem.piclink
        this.showBtn = true;
        var img = sku.piclink;
        if (img) {
          this.skuItemImg = img;
        }
      }
      if (this.skuItemImg) {
        this.$set(this.shopItem, "piclink", this.skuItemImg);
      } else {
        this.skuItemImg = "";
      }

      var eIndex = 0;
      for (var e in this.parentList) {
        if (this.parentList[e] == "") {
          eIndex++;
        }
      }
      if (eIndex >= this.parentList.length) {
        this.skuItemImg = "";
        this.$set(this.shopItem, "piclink", this.shopInfo.piclink);
      }
    },
    closePop() {
      this.$emit("closePop");
    },
    addCart() {
      var params = {};
      params.pid = this.shopInfo.id;
      params.sku_iden = this.parentList.join("@");
      params.number = this.number;
      params.reserve_id = this.storeInfo.id;
      params.reserve_time = this.shopInfo.reserve_time;

      if (this.group_types != undefined && this.group_types) {
        params.group_types = this.group_types;
      }
      if (this.group_id != undefined && this.group_id) {
        params.group_id = this.group_id;
      }
      if (this.is_car) {
        this.$emit("add_car_success", params);
        return;
      }
      if (this.$route.query.mid) {
        params.mid = this.$route.query.mid;
      }
      this.$api.getShop.addCart(params).then((res) => {
        if (res.code == 200) {
          this.getCardNumber();
          this.$toast.success("加入成功");
          if (res.result.types > 0) {
            this.$store.commit("setOrder", res.result.id);
            this.$router.push("/order/addorder");
          } else {
            if (this.toAut == 0) {
              // setTimeout(()=>{
              this.$emit("closePop");
              // this.$router.push("/shop/shopcard");
              // },2000)
            } else {
              // setTimeout(()=>{
              this.$store.commit("setOrder", res.result.id);
              this.$router.push("/order/addorder");
              // },2000)
            }
          }
        } else if (res.code == 404 && res.result == "请先绑定手机号") {
          this.$emit("closePop");
          setTimeout(() => {
            // this.$store.commit("setShowBingPhone", true);
            this.$router.push("/bind");
          }, 1500);
        }
      });
    },
    getCardNumber(params) {
      this.$api.getShop.getCardNumber({}).then((res) => {
        if (res.code == 200) {
          this.shopInfo.cart_number = res.result;
          this.$store.commit("set_carnum", res.result);
        }
      });
    },
  },
};
</script>


<style lang="less" scoped>
.btn_team {
  width: 340px;
  height: 46px;
  line-height: 46px;
  display: block;
  margin: 0 auto;
  background: linear-gradient(to right top, #f2140c, #f34a0c);
  color: #fff;
  border-radius: 27px;
  margin-top: 30px;
  margin-bottom: 10px;
}
.sku_con {
  padding: 0px 16px 10px;
  line-height: 1;
  position: relative;
  .shops_info {
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    width: 100%;
    padding: 10px 16px 10px 0;
    left: 0;
    top: 0px;
    > div:first-child {
      width: 120px;
      height: 120px;
      position: relative;
      background: #f8f8f8;
      img {
        border-radius: 10px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
      }
    }
    > div.sku_d2 {
      margin-left: 10px;
      padding-top: 20px;

      .sp1 {
        > small {
          font-size: 12px;
        }
        color: #f53f26;
        font-family: "PingFangSC-Regular";
        font-weight: bold;
        font-size: 17px;
      }
      .sp2 {
        color: #818181;
        padding-top: 10px;
        font-size: 12px;
      }
    }
    .close_sku {
      position: absolute;
      right: 0;
      top: 20px;
    }
  }
  .shops_d2 {
    padding-bottom: 10px;
    > div {
      padding-top: 12px;
      > p.shops_d2_p {
        font-size: 14px;
        color: #323233;
        padding-bottom: 10px;
      }
      > div.buy > span:not(:first-child) {
        margin-left: 10px;
      }
      > div.buy > span {
        display: inline-block;
        color: #f44;
        font-size: 12px;
      }
      > div.guige {
        > span {
          display: inline-block;
          box-sizing: border-box;
          min-width: 52px;
          height: 28px;
          margin: 0 10px 10px 0;
          padding: 5px 9px;
          color: #323233;
          font-size: 12px;
          line-height: 16px;
          text-align: center;
          border: 1px solid #969799;
          border-radius: 3px;
        }
        span.ac_tive {
          color: #fff;
          background: #f44;
          border-color: #f44;
        }
      }
    }
  }
  .shops_d4 {
    padding-bottom: 10px;
    p {
      font-size: 14px;
      color: #323233;
      padding-top: 10px;
    }
    .van-cell {
      padding: 10px 0;
    }
  }
}
</style>
