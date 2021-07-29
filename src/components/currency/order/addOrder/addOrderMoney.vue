<template>
  <div class="add_order_money fx">
    <div class="add_order_money_d1">
      <p style="line-height: 1.4">
        可用{{ $fnc.toFixedZ(integral.integral_dk_per, 0)
        }}{{ $store.state.config.shop.integral_cn || "积分" }}抵扣{{
          $fnc.toFixedZ(integral.integral_dk_money)
        }}元
      </p>
    </div>
    <div>
      <van-switch
        v-model="checked"
        active-value="1"
        inactive-value="0"
        active-color="#F32A0B"
        size="23px"
      />
    </div>
  </div>
</template>

<script>
import { Switch } from "vant";
export default {
  components: {
    [Switch.name]: Switch,
  },
  props: {
    integral: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      checked: 0,
    };
  },
  watch: {
    checked(val) {
      this.$emit("getIsIntegral", val);
    },
  },
};
</script>


<style lang="less" scoped>
.add_order_money {
  line-height: 1;
  margin-bottom: 10px;
  padding: 10px 16px;
  color: #333333;
  font-size: 14px;
  align-items: center;
  .add_order_money_d1 {
    font-size: 15px;
    font-weight: bold;
    color: #070707;
    font-family: "gilroy";
  }
}
</style>
