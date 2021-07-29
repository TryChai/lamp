<template>
  <div class="add_order_footer">
    <!-- <div class="fx">
      <p>是否开具发票</p>
      <p>
        <van-switch v-model="checked"  active-value='1' inactive-value='0' size="23px"/>
      </p>
    </div> -->

    <div class="fx" v-if="orderInfo.types == 2">
      <p>商品{{ $store.state.config.shop.integral_cn || "积分" }}</p>
      <p>
        {{ $store.state.config.shop.integral_cn || "积分" }}：{{
          $fnc.toFixedZ(orderInfo.cart[0].data[0].pro.score_rob)
        }}
      </p>
    </div>
    <div class="fx" v-else>
      <p>供奉金额</p>
      <p>S${{ $fnc.toFixedZ(orderInfo.sum_original_price) }}</p>
    </div>

    <div class="fx" v-if="orderInfo.address && is_lifting == 0">
      <p>总运费</p>
      <p v-if="orderInfo.sum_mail > 0">
        <span>+</span>
        ￥{{ $fnc.toFixedZ(orderInfo.sum_mail) }}
      </p>
      <p v-else>免邮</p>
    </div>
    <div class="fx" v-if="is_integral == 1">
      <p>{{ $store.state.config.shop.integral_cn || "积分" }}抵扣</p>
      <p>
        <span>-</span>
        ￥{{ orderInfo.integral.integral_dk_money }}
      </p>
    </div>
    <div class="fx" v-if="couponPrice > 0">
      <p>红包卷抵扣</p>
      <p>
        <span>-</span>
        ￥{{ $fnc.toFixedZ(couponPrice) }}
      </p>
    </div>
    <!-- <div class="fx"
            v-if="orderInfo.rating_discount !=null && Number(orderInfo.rating_discount) != 10 ">
            <p>会员折扣</p>
            <p>
                {{orderInfo.rating_discount}}折
            </p>
        </div> -->
    <div
      class="fx"
      v-if="
        orderInfo.offer != null &&
        Number(orderInfo.offer) != 0 &&
        orderInfo.types != 6 &&
        orderInfo.types != 2
      "
    >
      <p>优惠价格</p>
      <p>-{{ $fnc.toFixedZ(orderInfo.offer) }}</p>
    </div>
    <div class="fx" v-if="orderInfo.types == 6">
      <p>预售定金</p>
      <p>
        {{ $fnc.toFixedZ(orderInfo.sum_price) }}
      </p>
    </div>
  </div>
</template>

<script>
import { Switch } from "vant";
export default {
  components: {
    [Switch.name]: Switch,
  },
  data() {
    return {
      checked: 0,
    };
  },
  props: {
    orderInfo: {
      type: Object,
      default: () => ({}),
    },
    is_integral: [Number, String],
    couponPrice: [Number, String],
    is_lifting: [Number, String],
  },
  watch: {
    checked(val) {
      this.$emit("getIsInvoice", val);
    },
  },
};
</script>


<style lang="less" scoped>
.add_order_footer {
  line-height: 1;
  font-size: 14px;
  padding: 0 16px;
  margin-bottom: 10px;
  > div {
    padding: 15px 0;
    > p:first-child {
      font-size: 16px;
      font-weight: bold;
      color: #070707;
    }
    > p:last-child {
      font-size: 14px;
      color: #000000;
    }
  }
}
</style>
