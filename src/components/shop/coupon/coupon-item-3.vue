<template>
  <div class="couponItem3">
    <div class="fx couponItem3_top">
      <img v-if="item.shop_logo" :src="$fnc.getImgUrl(item.shop_logo)" alt />
      <span>{{item.shop_title}}</span>
      <span class="fx" @click="goToStore(item.cdn_sid)">
        去逛逛
        <van-icon name="arrow" />
      </span>
    </div>
    <div v-for="(r,i) in item.red" :key="i">
      <div class="fx couponItem3_detail1" v-if="r.cdn_pid > 0">
        <img :src="$fnc.getImgUrl(r.p_piclink)" alt />
        <div class="fx ci3_div_info">
          <p class="ci3_div_info_p1">
            <span class="price_regular">
              <small>￥</small>
              <b>{{$fnc.get_int_dec(r.money,'int')}}</b>
              <i>{{$fnc.get_int_dec(r.money,'dec')}}</i>
            </span>
            <span>满{{r.cdn_xfm}}可用</span>
          </p>
          <p class="ci3_div_info_p2 van-ellipsis">{{r.p_title}}</p>
          <p class="ci3_div_info_p3">领后{{r.lifetime}}天有效</p>
        </div>
        <div class="fx ci3_div_btn">
          <p v-if="r.pay_types !=0">
            <span class="price_regular">
              <small v-if="r.pay_types ==2">￥</small>
              <b>{{r.jf_change}}</b>
              <i v-if="r.pay_types ==1">积分</i>
            </span>
          </p>
          <van-button type="warning" size="mini" round v-if="r.txt && r.txt == 1">已领取</van-button>
          <van-button type="warning" size="mini" round @click="toGetCoupon(r)" v-else>{{r.pay_types==0?'立即领取':'立即兑换'}}</van-button>
          <div class="ci3_div_liubai liubai1"></div>
          <div class="ci3_div_liubai liubai2"></div>
        </div>
      </div>
      <div class="fx couponItem3_detail2" v-else>
        <div class="ci3_div_img">
          <img src="@/assets/img/smallcon/red.png" alt />
        </div>
        <div class="fx ci3_div_info1">
          <p class="ci3_div_info1_p1">
            <span class="price_regular">
              <small>￥</small>
              <b>{{$fnc.get_int_dec(r.money,'int')}}</b>
              <i>{{$fnc.get_int_dec(r.money,'dec')}}</i>
            </span>
            <span>满{{r.cdn_xfm}}可用</span>
          </p>
          <p class="ci3_div_info1_p2 van-ellipsis">{{r.title}}</p>
          <p class="ci3_div_info1_p3">领后{{r.lifetime}}天有效</p>
        </div>
        <div class="fx ci3_div_btn1">
          <p v-if="r.pay_types !=0">
            <span class="price_regular">
              <small v-if="r.pay_types ==2">￥</small>
              <b>{{r.jf_change}}</b>
              <i v-if="r.pay_types ==1">积分</i>
            </span>
          </p>
          <van-button type="warning" size="mini" round v-if="r.txt && r.txt == 1">已领取</van-button>
          <van-button type="warning" size="mini" round @click="toGetCoupon(r)" v-else>{{r.pay_types==0?'立即领取':'立即兑换'}}</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "couponItem3",
  components: {},
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data () {
    return {};
  },
  created () { },
  methods: {
    goToStore (id) {
      if (id > 0) {
        this.$router.push({
          path: "/supplier/supplierdetails",
          query: { id: id },
        });
      } else {
        this.$router.push('/');
      }
    },
    toGetCoupon (item) {
      item.money = Math.floor(parseFloat(item.money) * 100) / 100;
      if (item.pay_types == 1) {
        this.$dialog
          .confirm({
            message: `是否消耗${item.jf_change}积分\n兑换${item.money}元优惠券`,
          })
          .then(() => {
            this.$api.getShop.exchange_mark({ id: item.id }).then((res) => {
              if (res.code == 200) {
                this.$toast.success("兑换成功");
                setTimeout(() => {
                  this.$emit("changeTab", 0);
                }, 1500);
              }
            });
          })
          .catch(() => { });
      } else if (item.pay_types == 2) {
        this.$dialog
          .confirm({
            message: `是否消耗￥${item.jf_change}\n兑换${item.money}元优惠券`,
          })
          .then(() => {
            this.$api.getShop.coupon_packet_ye({ id: item.id }).then((res) => {
              if (res.code == 200) {
                var str = res.result;
                if (isNaN(Number(str))) {
                  this.$emit("changeTab", 0);
                } else {
                  this.$router.replace("/order/payorder?id=" + res.result);
                }
              }
            });
          })
          .catch(() => { });
      } else if (item.pay_types == 0) {
        this.$api.getShop.getCoupon({ id: item.id }).then((res) => {
          if (res.code == 200) {
            this.$toast.success("领取成功");
            setTimeout(() => {
              this.$emit("changeTab", 0);
            }, 1500);
          }
        });
      }
    },
  },
  filters: {},
};
</script>

<style lang="less" scoped>
.couponItem3 {
  width: 100%;
  background-color: #fff;
  margin-bottom: 16px;
  padding: 10px;
  border-radius: 15px;
  > div {
    width: 100%;
    height: 100%;
  }
  .couponItem3_top {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    justify-content: flex-start;
    padding-bottom: 8px;
    > img {
      border-radius: 6px;
      width: 30px;
      height: 30px;
      margin-right: 8px;
    }
    > span:nth-of-type(1) {
      width: 240px;
      font-weight: bold;
      font-size: 16px;
      margin-right: auto;
      white-space: nowrap;
      text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      overflow: hidden;
    }
    > span:nth-of-type(2) {
      color: #949494;
      font-size: 12px;
      line-height: 1;
    }
  }
  .couponItem3_detail1 {
    width: 100%;
    height: 80px;
    background: #ffe5d4;
    margin: 10px 0;
    padding: 10px 8px;
    border-radius: 10px;
    > img {
      border-radius: 10px;
      width: 60px;
      height: 60px;
    }
    .ci3_div_info {
      width: 180px;
      flex-wrap: wrap;
      padding: 0 3px 0 6px;
      align-items: flex-start;
      justify-content: flex-start;
      > p {
        width: 100%;
        font-size: 12px;
        line-height: 1.2;
        color: #ff5a00;
      }
      .ci3_div_info_p1 {
        font-family: "gilroy" !important;
        .price_regular {
          margin-right: 5px;
          > small {
            font-size: 10px;
            font-weight: bold;
          }
          > b {
            font-size: 22px;
          }
          i {
            font-size: 12px;
            font-weight: normal;
            font-style: normal;
          }
        }
        > span:nth-of-type(2) {
          letter-spacing: 0.5px;
        }
      }
      .ci3_div_info_p2 {
        padding-bottom: 6px;
      }
      .ci3_div_info_p3 {
        color: #6c6666;
        font-size: 10px;
      }
    }
    .ci3_div_btn {
      position: relative;
      flex-wrap: wrap;
      justify-content: center;
      width: 74px;
      height: 100%;
      padding-left: 6px;
      border-left: 1px dashed #ff5a00;
      text-align: center;
      > p {
        width: 100%;
        color: #ff5a00;
        font-family: "gilroy" !important;
        line-height: 1;
        .price_regular {
          margin-right: 5px;
          > small {
            font-size: 10px;
            font-weight: bold;
          }
          > b {
            font-size: 14px;
          }
          i {
            margin-left: 2px;
            font-size: 10px;
            font-weight: normal;
            font-style: normal;
          }
        }
      }
      .van-button {
        width: 68px;
        font-size: 13px;
        padding-top: 2px;
        background: linear-gradient(to right, #fc9600, #ff580a);
      }
      .ci3_div_liubai {
        position: absolute;
        width: 15px;
        height: 15px;
        background-color: #fff;
        border-radius: 50%;
      }
      .ci3_div_liubai.liubai1 {
        top: -18px;
        left: -8px;
      }
      .ci3_div_liubai.liubai2 {
        bottom: -18px;
        left: -8px;
      }
    }
  }
  .couponItem3_detail2 {
    height: 80px;
    margin: 10px 0;
    border-radius: 10px;
    background: linear-gradient(to right, #ff735c, #fd3f31);
    .ci3_div_img {
      padding: 10px 0 10px 8px;
      > img {
        border-radius: 10px;
        width: 60px;
        height: 60px;
      }
    }
    .ci3_div_info1 {
      width: 175px;
      flex-wrap: wrap;
      padding: 0 3px 0 6px;
      align-items: flex-start;
      justify-content: flex-start;
      > p {
        width: 100%;
        font-size: 12px;
        line-height: 1.2;
        color: #fff0c3;
      }
      .ci3_div_info1_p1 {
        font-family: "gilroy" !important;
        .price_regular {
          margin-right: 5px;
          > small {
            color: #fff0c3;
            font-size: 10px;
            font-weight: bold;
          }
          > b {
            color: #fff0c3;
            font-size: 22px;
          }
          i {
            color: #fff0c3;
            font-size: 12px;
            font-weight: normal;
            font-style: normal;
          }
        }
        > span:nth-of-type(2) {
          letter-spacing: 0.5px;
        }
      }
      .ci3_div_info1_p2 {
        padding-bottom: 6px;
      }
      .ci3_div_info1_p3 {
        font-size: 10px;
      }
    }
    .ci3_div_btn1 {
      flex-wrap: wrap;
      justify-content: center;
      width: 88px;
      height: 100%;
      padding: 10px 8px 10px 10px;
      border-left: 2px solid #ff6153;
      text-align: center;
      border-radius: 35px 0 0 35px;
      > p {
        width: 100%;
        color: #fff0c3;
        font-family: "gilroy" !important;
        line-height: 1;
        .price_regular {
          margin-right: 5px;
          > small {
            color: #fff0c3;
            font-size: 10px;
            font-weight: bold;
          }
          > b {
            color: #fff0c3;
            font-size: 14px;
          }
          i {
            color: #fff0c3;
            margin-left: 2px;
            font-size: 10px;
            font-weight: normal;
            font-style: normal;
          }
        }
      }
      .van-button {
        font-size: 13px;
        width: 70px;
        padding-top: 2px;
        color: #d22018;
        background: linear-gradient(to right, #ffedd9, #fbb06c);
      }
    }
  }
}
</style>