<template>
  <div>
    <div class="add_order_coupon fx" @click="showPop">
      <div><b>优惠券</b></div>
      <div>
        <span class="sp1" v-if="coupon && coupon.length == 0">
          暂无可使用优惠券
        </span>
        <span class="sp2" v-else-if="couponPrice">
          {{ "- ￥" + $fnc.toFixedZ(couponPrice) }}
        </span>

        <div class="tipcoupon" v-else-if="usenum && usenum > 0">
          {{usenum}}张可用
        </div>
        <van-icon name="arrow" color="#575757" size="14" />
      </div>
      <!-- 优惠券列表 -->
    </div>
    <van-popup v-model="showList" position="bottom" class="coupon_popup" get-container="body">
      <coupon @closePop="getClosePop" @setHb="setHb" :defaultCoupon="false" :coupon="coupon" />
    </van-popup>
  </div>
</template>

<script>
import coupon from "@/components/currency/shop/coupon.vue";
export default {
  components: {
    coupon,
  },
  computed: {
    usenum () {
      var num = 0
      this.coupon.forEach((item, i) => {
        if (item.is_cat == 1) {
          num++;
        }
      })
      return num || 0;
    },
  },
  props: {
    coupon: {
      type: Array,
      default: () => {
        [];
      },
    },
  },
  data () {
    return {
      checked: false,
      showList: false,
      couponPrice: "",
    };
  },
  methods: {
    showPop () {
      if (this.coupon.length > 0) {
        this.showList = true;
      }
    },
    setHb (item) {
      this.$nextTick(() => {
        this.couponPrice = item.money;
        this.showList = false;
        this.$emit("setHb", item);
      });
    },
    getClosePop () {
      this.couponPrice = "";
      this.$emit("getClosePop", 0);
      this.showList = false;
    },
  },
};
</script>


<style lang="less" scoped>
.coupon_popup {
  height: 95%;
  border-radius: 0;
  .van-tabs__nav {
    align-items: center;
  }
}
.add_order_coupon {
  line-height: 1.4;
  padding: 14px 16px;
  color: #333333;
  font-size: 14px;
  align-items: center;
  margin-bottom: 1px;
  b {
    font-size: 16px;
    color: #070707;
  }
  > div:last-child {
    display: flex;
    justify-content: center;
    align-items: center;
    > span.sp1 {
      color: #c7c7c7;
      margin-right: 13px;
    }
    > span.sp2 {
      color: red;
      margin-right: 13px;
    }
    > i {
      vertical-align: middle;
    }
    > div {
      background: linear-gradient(to right top, #f2140c, #f34a0c);
      color: #fff;
      padding: 2px 5px;
      margin-right: 5px;
    }
  }
}
.tipcoupon {
}
</style>
