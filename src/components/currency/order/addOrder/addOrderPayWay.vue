<template>
  <div class="addOrderPayWay">
    <van-radio-group v-model="pay" v-if="payList && payList.length > 0">
      <div class="fx" v-for="(pay, p) in payList" :key="p" v-show="p < num">
        <p>
          <img :src="pay.piclink" />
          <span>{{ pay.title }}</span>
        </p>
        <van-radio :name="pay" checked-color="#FD5501"></van-radio>
      </div>
      <p
        class="fx"
        v-if="payList && payList.length > num"
        @click="num = payList.length"
      >
        <span>其他付款方式（更多优惠）</span>
        <van-icon name="arrow-down" size="10" />
      </p>
    </van-radio-group>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
export default {
  components: {},
  props: {},
  data() {
    return {
      pay: "",
      num: 2,
      payList: [],
    };
  },
  mounted() {
    this.getPayList();
  },
  methods: {
    getPayList() {
      var params = {};
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //第一个微信端
        wx.miniProgram.getEnv((res) => {
          if (res.miniprogram) {
            params.pay_type = "4"; //小程序
          } else {
            params.pay_type = "1"; //公众号
          }
        });
      } else if (ua.match(/ykapp/i) == "ykapp") {
        params.pay_type = "2"; //第二个app
      } else {
        params.pay_type = "3"; //剩下的网页
      }

      this.$api.getOrder.order_pay_new_lists(params).then((res) => {
        if (res.code == 200) {
          this.payList = res.result.pay;
          if (res.result.pay && res.result.pay[0]) {
            this.pay = res.result.pay[0];
            this.$emit("getPayWayId", this.pay);
          }
        }
      });
    },
  },
  watch: {
    pay(val) {
      this.$emit("getPayWayId", val);
    },
  },
};
</script>


<style lang="less" scoped>
.addOrderPayWay {
  width: 100%;
  font-size: 14px;
  .van-radio-group {
    width: 100%;
    background: #ffffff;
    padding: 0 16px;
    margin: 10px 0;
    > div {
      width: 100%;
      border-bottom: 1px solid #eeeff0;
      height: 60px;
      &:last-child {
        border-bottom: none;
      }

      img {
        margin-right: 10px;
        width: 30px;
        height: 30px;
      }

      span {
        font-weight: bold;
        font-size: 15px;
        line-height: 1;
      }
    }

    > p {
      width: 100%;
      height: 36px;
      color: #959596;
      line-height: 1;
      justify-content: center;
      font-size: 13px;
    }
  }
}
</style>
