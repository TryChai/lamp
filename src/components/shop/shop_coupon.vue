<template>
  <div class="shop_coupon">
    <van-nav-bar left-text left-arrow class="navbar" title="我的红包" @click-left="toBack"></van-nav-bar>
    <van-sticky>
      <div class="fx coupon_top">
        <p :class="tab_active == 0?'active':''" @click="tab_change(0)">未使用</p>
        <p :class="tab_active == 1?'active':''" @click="tab_change(1)">已使用</p>
        <p :class="tab_active == 2?'active':''" @click="tab_change(2)">兑红包</p>
      </div>
    </van-sticky>
    <div class="coupon_body" v-if="tab_active ==0 && JSON.stringify(couponlist) !='[]' && JSON.stringify(couponlist) !='{}'">
      <couponItem1 v-for="(item,i) in couponlist" :key="i" :item="item" />
    </div>
    <div class="coupon_body" v-else-if="tab_active == 1 && JSON.stringify(couponlist) !='[]' &&  JSON.stringify(couponlist) !='{}'">
      <couponItem2 v-for="(item,i) in couponlist" :key="i" :item="item" />
    </div>
    <div class="coupon_body" v-else-if="tab_active == 2 && JSON.stringify(couponlist) !='[]' &&  JSON.stringify(couponlist) !='{}'">
      <couponItem3 v-for="(item,i) in couponlist" :key="i" :item="item" @changeTab="tab_change" />
    </div>
    <div class="coupon_empty" v-else>
      <img src="@/assets/img/empty.png" />
      <p>暂无更多数据</p>
    </div>
  </div>
</template>

<script>
import { Sticky } from "vant";
import couponItem1 from "@/components/shop/coupon/coupon-item-1.vue";
import couponItem2 from "@/components/shop/coupon/coupon-item-2.vue";
import couponItem3 from "@/components/shop/coupon/coupon-item-3.vue";
export default {
  name: "shop_coupon",
  components: {
    [Sticky.name]: Sticky,
    couponItem1,
    couponItem2,
    couponItem3
  },
  data () {
    return {
      tab_active: this.$route.query.active || 0,
      couponlist: []
    };
  },
  created () {
    this.upCallback();
  },
  methods: {
    buy_btn (type, item) {
      if (item.sid == 0) {
        this.$router.push({ path: "/page/vip", query: { iden: "home" } });
      } else if (type == 1) {
        this.$router.push({
          path: "/supplier/supplierdetails",
          query: { id: item.sid }
        });
      } else if (type == 2) {
        this.$router.push({
          path: "/shop/shopdetails",
          query: { id: item.pid }
        });
      } else {
        this.$router.push({ path: "/page/vip", query: { iden: "home" } });
      }
    },
    upCallback () {
      if (this.tab_active == 1) {
        this.$api.getShop.get_coupon_uselist({}).then(res => {
          if (res.code == 200) {
            this.couponlist = res.result;
          }
        });
      } else if (this.tab_active == 2) {
        this.$api.getShop.coupon_packet_list({}).then(res => {
          if (res.code == 200) {
            this.couponlist = res.result;
          }
        });
      } else {
        this.$api.getShop.get_coupon_list({}).then(res => {
          if (res.code == 200) {
            this.couponlist = res.result;
          }
        });
      }
    },
    tab_change (e) {
      this.tab_active = e;
      this.couponlist = [];
      this.upCallback();
    }
  },
  filters: {}
};
</script>

<style lang="less" scoped>
.shop_coupon {
  width: 100%;
  height: 100%;
  font-size: 14px;
  overflow: auto;
  background-color: #f2f2f2;
  .coupon_top {
    width: 100%;
    padding: 5px 8px;
    background: #ffffff;
    > p {
      width: 30%;
      text-align: center;
      color: #8b8b8b;
    }
    > p.active {
      color: #f8703d;
      font-weight: bold;
    }
  }
  .coupon_body {
    width: 94.5%;
    margin: 16px auto 0 auto;
    > div {
      width: 100%;
    }
    > p {
      width: 100%;
    }
    > img {
      width: 100%;
    }
  }
  .coupon_empty {
    width: 94.5%;
    margin: 16px auto 0 auto;
    text-align: center;
    font-size: 12px;
    color: #888888;
    > img {
      width: 50%;
    }
  }
}
</style>