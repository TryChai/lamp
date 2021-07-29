<template>
  <div class="add_order_con">
    <van-nav-bar title="确认订单" left-text left-arrow class="navbar" :border="false" @click-left="toBack"
        @click-right="$router.replace('/order/orderlist')">
      <!-- <span slot="right" style="color: #707070"> 订单中心 </span> -->
    </van-nav-bar>
    <div class="shop_detail">
        <div class="shop_content">
          <div class="fx">
            <div class="title">{{orderInfo.cart[0].data[0].pro.title}}</div>
            <div class="money">S${{$fnc.toFixedZ(orderInfo.cart[0].data[0].pro.price)}}</div>
          </div>
        </div>
          <div class="shop_content">
          <div class="fx">
            <div class="title">{{orderInfo.cart[0].data[0].sku_cn}}</div>
            <div class="money1">x{{orderInfo.cart[0].data[0].number}}</div>
          </div>
        </div>
        
    </div>
    <addOrderHead @getAddressItem="getAddressItem" ref="address" class="bgwrite add_order_item_head" v-if="
        orderInfo.is_virtual == 0 &&
        orderInfo.types != 14 &&
        form.is_lifting == 0
      " :address_id="orderInfo.address_id" :address="orderInfo.address || {}" />

    <addOrderlifting @toggleLliftings="toggleLliftings" @toLifiting="toLifiting" :is_lifting="form.is_lifting" :orderInfo="orderInfo" v-if="
        orderInfo.is_lifting == 1 &&
        orderInfo.types != 14 &&
        orderInfo.types != 13
      " />

    <van-cell-group class="add-order-lifting-swiper" v-if="
        orderInfo.is_lifting == 1 &&
        orderInfo.types != 14 &&
        orderInfo.types != 13
      ">
      <van-switch-cell v-model="form.is_lifting" :active-value="1" :inactive-value="0" title="是否自提" active-color="#F32A0B" />
    </van-cell-group>

    <addOrderStore class="bgwrite add_order_item_head" v-if="orderInfo.is_virtual == 0 && orderInfo.types == 14" :store="orderInfo.store || {}" />

    <addOrderPayWay @getPayWayId="getPayWayId" v-if="sum > 0" />

    <addOrderProduct :cart="orderInfo.cart" :money="orderInfo.sum_original_price" :number="orderInfo.sum_number" @showProductList="showPro = true" />

    <van-popup v-model="showPro" get-container="body" position="bottom" style="width: 100%; height: 80%">
      <div class="addOrderDetails">
        <van-nav-bar :title="'供奉清单（共' + orderInfo.sum_number + '件）'" left-arrow class="navbar" :border="false" @click-left="showPro = false" />
        <addOrderDetails :ref="`order_detail-${i}`" :card="item" :is_lifting="orderInfo.is_lifting" v-for="(item, i) in orderInfo.cart" :key="i" />
      </div>
    </van-popup>

    <addOrderGroupbuy :orderInfo="orderInfo" @setGbTypes="setGbTypes" @setGbNum="setGbNum"
        v-if="orderInfo.types == 19 && orderInfo.is_groupbuy == 1" />

    <addOrderCoupon class="bgwrite" :coupon="orderInfo.red" @setHb="setHb" @getClosePop="getClosePop"
        v-if="orderInfo.red && orderInfo.red.length > 0" />
    <addOrderMoney :integral="orderInfo.integral" v-if="
        orderInfo.integral.user_integral > 0 &&
        orderInfo.integral.integral_dk_money > 0
      " class="bgwrite" @getIsIntegral="getIsIntegral" />

    <addOrderFooter :orderInfo="orderInfo" :couponPrice="couponPrice" :is_lifting="form.is_lifting" :is_integral="form.is_integral"
        @getIsInvoice="getIsInvoice" class="bgwrite" v-if="orderInfo.types != 24" />

    <add-order-friend @toFriend="getFriend" v-if="orderInfo.is_order_help == 1" @toCheckFriend="getCheckFriend" class="addorder_last_child bgwrite" />

    <div style="width: 100%; height: 70px"></div>
    <div class="fx order_footer_btn">
      <div v-if="orderInfo.types == 2">
        <span>{{ $store.state.config.shop.integral_cn || "积分" }}</span>
        {{ $fnc.toFixedZ(orderInfo.score_rob) }}
      </div>
      <div v-else><span>S$</span>{{ $fnc.toFixedZ(sum) }}</div>
      <div>
        <van-button type="danger" @click="sunOrder" :color="$store.state.config.shop.button_bj_color || ''">
          提交订单
        </van-button>
      </div>
    </div>
    <van-popup v-model="show" get-container="body" style="background-color: transparent; top: 45%">
      <not-address-title @toSendType="getSendType" />
    </van-popup>

    <van-dialog v-model="show_offline" :title="payInfo.title" show-cancel-button @confirm="$router.replace('/order/orderlist')"
        :showCancelButton="false">
      <van-cell-group>
        <van-cell title="开户名" :value="payInfo.username" />
        <van-cell title="开户账号" :value="payInfo.key" />
        <van-cell title="银行" :value="payInfo.app_id" />
        <van-cell title="银行网点" :value="payInfo.app_secret" />
        <p class="order-offline"><span>*</span>订单打款后，请联系管理员审核</p>
      </van-cell-group>
    </van-dialog>

    <van-popup v-model="showPass" class="pop_pass tc">
      <div>
        <p class="p_title">输入密码</p>
        <van-cell-group>
          <van-field @blur="windowScorll" v-model="password" type="password" label="密码" placeholder="请输入支付密码" required />
        </van-cell-group>
        <p class="forget_pwd">
          <span @click="$router.push('/setting/pay_password').catch(() => {})">忘记密码</span>
        </p>
        <van-button type="info" @click="cikHb">确认支付</van-button>
      </div>
    </van-popup>
  </div>
</template>


<script>
import addOrderHead from "@/components/currency/order/addOrder/addOrderHead.vue";
import addOrderMoney from "@/components/currency/order/addOrder/addOrderMoney.vue";
import addOrderCoupon from "@/components/currency/order/addOrder/addOrderCoupon.vue";
// import addOrderTypes from '@/components/currency/order/addOrder/addOrderTypes.vue';
import addOrderDetails from "@/components/currency/order/addOrder/addOrderDetails.vue";
import addOrderFooter from "@/components/currency/order/addOrder/addOrderFooter.vue";
import addOrderFriend from "@/components/currency/order/addOrder/addOrderFriend.vue";
import addOrderlifting from "@/components/currency/order/addOrder/addOrderlifting.vue";
import addOrderStore from "@/components/currency/order/addOrder/addOrderStore.vue";
import notAddressTitle from "@/components/currency/order/addOrder/not-address-title.vue";
import addOrderGroupbuy from "@/components/currency/order/addOrder/addOrderGroupbuy.vue";
import addOrderPayWay from "@/components/currency/order/addOrder/addOrderPayWay.vue";
import addOrderProduct from "@/components/currency/order/addOrder/addOrderProduct.vue";

import { mapState } from "vuex";
import { SwitchCell, RadioGroup, Radio, Field } from "vant";
import wx from "weixin-js-sdk";
export default {
  components: {
    [SwitchCell.name]: SwitchCell,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Field.name]: Field,
    addOrderHead,
    addOrderMoney,
    addOrderCoupon,
    addOrderDetails,
    addOrderFooter,
    addOrderFriend,
    addOrderlifting,
    addOrderStore,
    notAddressTitle,
    addOrderGroupbuy,
    addOrderPayWay,
    addOrderProduct,
    // addOrderTypes
  },
  data () {
    return {
      remark: [],
      orderInfo: {
        integral: {},
      },
      sum: 0,
      form: {
        id_str: "",
        is_integral: 0, //是否积分抵用
        red_id: "", //使用红包ID
        is_invoice: 0, //是否使用发票,
        reserve_time: "",
        friend: "",
        is_lifting: 0,
        gb_types: 0,
        gb_num: "",
      },
      couponPrice: 0,
      isChenkFriend: false,
      show: false,
      selAddressId: "",
      showPro: false,
      payInfo: {},
      show_offline: false,
      showPass: false,
      password: "",
      orderId: "",
    };
  },
  created () {
    console.log(JSON.parse(this.$route.query.obj))
    if (localStorage.getItem("pay_order_id")) {
      var payOrderId = localStorage.getItem("pay_order_id");
      localStorage.removeItem("pay_order_id");
      this.$router.replace("/order/payorder?id=" + payOrderId);
    } else {
      this.getOrder();
    }
  },
  computed: {
    ...mapState({
      nowposition: (state) => state.nowposition,
    }),
  },
  methods: {
    payMoney () {
      var that = this;
      if (that.payInfo.iden == "offline") {
        that.show_offline = true;
      } else if (that.payInfo.supplier_need_secret == 1) {
        that.showPass = true;
        that.password = "";
      } else if (that.payInfo.supplier_need_secret == 2) {
        that.$toast.fail("前往设置支付密码");
        setTimeout(() => {
          that.$router.replace({
            path: "/setting/pay_password",
            query: { redirect: "/order/payorder?id=" + that.orderId },
          });
        }, 1500);
      } else {
        var params1 = {};
        params1.id = that.orderId || "";
        params1.pay_id = that.payInfo.id;
        that.$api.getOrder.subPayOrder(params1).then((res) => {
          localStorage.setItem("pay_order_id", that.orderId);
          // if (that.payInfo.iden == "wechat_app") {
          //   setTimeout(() => {
          //     location.reload();
          //   }, 400);
          // }
          if (res.code == 200 && res.result.is_pay == 1) {
            that.$toast.loading({
              duration: 0,
              forbidClick: true,
              loadingType: "spinner",
              message: "支付中",
            });
            setTimeout(() => {
              if (res.result.types == 4) {
                that.$router.replace(
                  "/assemble/assembledetails?id=" + res.result.id
                );
              } else {
                that.$router.replace("/order/paydetails?id=" + res.result.id);
              }
            }, 1500);
          }
          if (res.code == 200 && res.result.is_alipay_app == 1) {
            that.$fnc.appAlipay(res.result.data);

            if (res.result.types == 4) {
              that.$router.replace(
                "/assemble/assembledetails?id=" + res.result.id
              );
            } else {
              that.$router.replace("/order/paydetails?id=" + res.result.id);
            }
          }
          if (res.code == 200 && res.result.is_wechat_applets == 1) {
            wx.miniProgram.navigateTo({
              url: `/pages/wxpay/wxpay?oid=${res.result.oid}`,
            });
          }
        });
      }
    },
    cikHb () {
      try {
        var that = this;
        this.showPass = false;
        var params = {};
        params.id = that.orderId || "";
        params.pay_id = that.payInfo.id;
        params.password = this.$getCode(this.password);

        that.$api.getOrder.subPayOrder(params).then((res) => {
          localStorage.setItem("pay_order_id", that.orderId);
          if (res.code == 200 && res.result.is_pay == 1) {
            that.$toast.loading({
              duration: 0, // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              loadingType: "spinner",
              message: "支付中",
            });
            setTimeout(() => {
              if (res.result.types == 4) {
                this.$router.replace(
                  "/assemble/assembledetails?id=" + res.result.id
                );
              } else {
                this.$router.replace("/order/paydetails?id=" + res.result.id);
              }
            }, 1500);
          }
          if (res.code == 200 && res.result.is_alipay_app == 1) {
            this.$fnc.appAlipay(res.result.data);
            if (res.result.types == 4) {
              this.$router.replace(
                "/assemble/assembledetails?id=" + res.result.id
              );
            } else {
              this.$router.replace("/order/paydetails?id=" + res.result.id);
            }
          }
          if (res.code == 200 && res.result.is_wechat_applets == 1) {
            wx.miniProgram.navigateTo({
              url: `/pages/wxpay/wxpay?oid=${res.result.oid}`,
            });
          }
        });
      } catch (err) {
        this.$router.replace("/order/payorder?id=" + that.orderId);
      }
    },
    getPayWayId (val) {
      this.payInfo = val;
    },
    setGbNum (val) {
      this.form.gb_num = val;
    },
    setGbTypes (val) {
      this.form.gb_types = val;
    },
    getSendType (bool) {
      if (bool) {
        this.$refs.address.show = true;
      }
      this.show = false;
    },
    toggleLliftings (val) {
      this.form.is_lifting = val;
      this.total();
    },
    toLifiting (id) {
      console.log(id, id);
      this.form.lifting_id = id;
    },
    getCheckFriend (val) {
      this.isChenkFriend = val;
    },
    getFriend (username) {
      this.form.friend = username;
    },
    getSendTime (time) {
      this.form.reserve_time = time;
    },
    getAddressItem (item) {
      this.selAddressId = item.id;
      this.$set(this.orderInfo, "address", item);
      this.getOrder();
    },
    sunOrder () {
      var that = this;
      if (that.orderId && that.orderId != "" && that.orderId != undefined) {
        this.payMoney();
        return false;
      }
      if (this.sum > 0 && !this.payInfo.id) {
        that.$toast.fail("请选择支付方式");
        return false;
      }
      if (
        that.orderInfo.types == 19 &&
        that.orderInfo.is_groupbuy == 1 &&
        this.form.gb_types == 1 &&
        this.form.gb_num == ""
      ) {
        that.$toast.fail("请输入参团次数");
        return false;
      }
      if (
        that.orderInfo.is_virtual == 0 &&
        that.orderInfo.address == undefined &&
        that.orderInfo.types != 14 &&
        that.form.is_lifting == 0
      ) {
        that.$toast.fail("请先添加收货地址");
        return false;
      }
      if (this.isChenkFriend && this.form.friend == "") {
        that.$toast.fail("请输入好友用户名");
        return;
      }
      if (this.orderInfo.is_lifting == 1) {
        try {
          this.form.latitude = this.$store.state.nowposition.latitude || 0;
          this.form.longitude = this.$store.state.nowposition.longitude || 0;
        } catch (error) {
          this.form.latitude = 0;
          this.form.longitude = 0;
        }
      }
      var params = {};
      params = that.form;
      params.id_str = that.$store.state.order || "";
      if (
        that.orderInfo.is_virtual == 0 &&
        that.orderInfo.types != 14 &&
        that.form.is_lifting == 0
      ) {
        params.address_id = that.orderInfo.address.id || "";
        params.mail_latitude = that.orderInfo.address.latitude || "";
        params.mail_longitude = that.orderInfo.address.longitude || "";
      }
      var remark_json = [];
      this.orderInfo.cart.forEach((item, i) => {
        var key = `order_detail-${i}`;
        if (
          this.$refs[key] &&
          this.$refs[key][0].remark &&
          this.$refs[key][0].remark != ""
        ) {
          var obj = {};
          obj.sid = item.info.sid;
          obj.value = this.$refs[key][0].remark;
          remark_json.push(obj);
        }
      });
      params.remarks = JSON.stringify(remark_json);
      //新增的/心愿/是否心愿隐藏/匿名
      if(this.$route.query.show_wish){
        params.wish_content=this.$route.query.show_wish;
      }
      if(this.$route.query.obj){
        params.wish_content=JSON.parse(this.$route.query.obj);
      }
      if(this.$route.query.is_public){
        params.is_public=this.$route.query.is_public;
      }
      if(this.$route.query.is_anonymous){
        params.is_anonymous=this.$route.query.is_anonymous;
      }
      that.$dialog
        .confirm({
          message: "是否确认现在去支付？",
        })
        .then(() => {
          that.$api.getOrder.setOrder(params).then((res) => {
            if (this.orderInfo.types = 1) {
              this.$store.dispatch("getYcCardModuleList");
            } else {
              this.$store.dispatch("getCardNum");
            }
            if (res.code == 200) {
              var str = res.result;
              if (isNaN(Number(str))) {
                that.$router.replace(str);
              } else {
                that.orderId = res.result;
                try {
                  that.payMoney();
                } catch (err) {
                  this.$router.replace("/order/payorder?id=" + res.result);
                }
              }
            }
          });
        })
        .catch(() => { });
    },
    total () {
      var sum = 0;
      sum =
        Number(this.orderInfo.sum_price) +
        Number(this.orderInfo.sum_mail) -
        Number(this.couponPrice) -
        Number(this.orderInfo.save_money);
      this.sum = sum;
      if (this.form.is_lifting == 1) {
        this.sum = Number(this.sum) - Number(this.orderInfo.sum_mail);
      }
      if (this.sum <= 0) {
        this.sum = 0;
      }
      return this.sum;
    },
    getClosePop (price) {
      this.couponPrice = price;
      this.form.red_id = "";
      this.sum = this.total();
    },
    setHb (item) {
      if (item.money > Number(this.orderInfo.sum_price)) {
        this.$toast("商品金额应大于红包金额");
      } else {
        this.form.red_id = item.id;
        this.couponPrice = item.money;
        this.sum = this.total();
      }
    },
    getIsInvoice (bool) {
      this.form.is_invoice = bool;
    },
    getIsIntegral (bool) {
      this.form.is_integral = bool;

      if (bool == 1) {
        this.sum =
          Number(this.sum) - Number(this.orderInfo.integral.integral_dk_money);
      } else {
        this.sum =
          Number(this.sum) + Number(this.orderInfo.integral.integral_dk_money);
      }
    },
    getOrder () {
      var params = {};
      var store = JSON.parse(sessionStorage.getItem("appstore"));
      if (
        this.$store.state.config.plugin &&
        this.$store.state.config.plugin.xxmk.is_open == 1
      ) {
        try {
          params.latitude = this.$store.state.nowposition.latitude || 0;
          params.longitude = this.$store.state.nowposition.longitude || 0;
        } catch (error) { }
      }
      var id = this.$route.query.id || this.$store.state.order || store.order;
      params.id_str = id || "";

      if (this.selAddressId) {
        params.address_id = this.selAddressId;
      }
      //如果自提模块有开

      this.$api.getOrder.addOrder(params).then((res) => {
        if (res.code == 200) {
          if (!res.result.save_money) {
            res.result.save_money = 0;
          }
          this.orderInfo = res.result;
          if (
            this.orderInfo.is_lifting == 1 &&
            this.orderInfo.lifting.length > 0
          ) {
            let usedAdd = JSON.parse(sessionStorage.getItem("usedAddress"));
            if (usedAdd && usedAdd != undefined) {
              this.form.lifting_id = usedAdd.id;
            } else {
              this.form.lifting_id = this.orderInfo.lifting[0].id;
            }
          }
          this.sum =
            Number(this.orderInfo.sum_price) + Number(this.orderInfo.sum_mail); //默认自提为关 需要加上邮费
          if (
            Number(this.orderInfo.save_money) &&
            Number(this.orderInfo.save_money) != 0
          ) {
            this.sum = this.sum - Number(this.orderInfo.save_money);
          }
          if (
            this.orderInfo.is_virtual == 0 &&
            this.orderInfo.types != 14 &&
            !this.orderInfo.address_id &&
            this.orderInfo.is_lifting == 0
          ) {
            this.show = true;
          }
        }
      });
    },
  },
};
</script>


<style lang="less" scoped>
.addorder_last_child {
  margin-bottom: 10px;
}
.add_order_item_head {
  border-radius: 0 0 10px 10px;
}
.add_order_con {
  background: #f3f3f3;
  overflow: auto;
  .navbar {
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.16);
  }
}
.add_order_item {
  border-radius: 10px;
}
.add_order_details_title {
  font-size: 14px;
  height: 44px;
  line-height: 44px;
  padding-left: 16px;
}
.order_footer_btn {
  line-height: 1;
  z-index: 10;
  font-size: 14px;
  background: #fff;
  padding: 5px 16px;
  position: fixed;
  bottom: 0;
  width: 100%;
  font-family: "gilroy";
  > div:first-child {
    color: #f3160d;
    font-size: 22px;
    font-weight: bold;
    > span {
      font-size: 14px;
    }
  }
  > div {
    > button {
      border-radius: 27px;
      height: 38px;
      line-height: 38px;
      font-weight: bold;
      background: linear-gradient(to right top, #f2140c, #f34a0c);
      width: 119px;
    }
  }
}

.addOrderDetails {
  width: 100%;
  height: 100%;
  background: #f4f5f6;
  font-size: 14px;
  overflow: auto;
}
.add-order-lifting-swiper .van-cell .van-cell__title {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
}
.pop_pass {
  width: 95%;
  padding: 10px 16px 10px;
  .p_title {
    padding: 10px 0;
    font-size: 15px;
    font-weight: bold;
  }

  .forget_pwd {
    width: 100%;
    text-align: right;
    margin-top: 5px;
    line-height: 0.3;

    span {
      font-size: 13px;
      color: #1ba2ff;
    }
  }

  .van-cell {
    align-items: center;
  }
  button {
    margin: 20px 0;
  }
}
.order-offline {
  font-size: 14px;
  padding: 8px 16px;
  color: #666;
  display: flex;
  align-items: center;
  span {
    color: red;
    margin-right: 6px;
  }
}
.shop_detail{
  border-bottom: 1px solid #f3f3f3;
  background-color: #fff;
  padding: 10px 15px 5px 15px;
  .shop_content{
    margin-bottom: 5px;
    .title{
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        color: #333333;
        font-size: 18px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        // width: 85%;
    }
    .money{
      margin-left: 16px;
      font-size: 16px;
      color: #ff5a00!important;
    }
    .money1{
      margin-left:12px;
      font-size: 14px;
      color: #333!important;
    }
  }
}
</style>
