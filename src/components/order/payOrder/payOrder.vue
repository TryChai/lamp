<template>
  <div class="payOrder">
    <van-nav-bar
      title="支付"
      left-arrow
      class="navbar"
      :border="false"
      @click-left="$router.replace('/member/member')"
      @click-right="$router.replace('/order/orderlist')"
    >
      <!-- <span slot="right" style="color: #707070"> 订单中心 </span> -->
    </van-nav-bar>
    <div v-if="info.is_pay >= 0" style="overflow: hidden">
      <div class="pay_time">
        <div class="shop_detail">
            <div class="shop_content">
              <div class="fx">
                <div class="title1">{{info.supplier.shop_title}}</div>
                <div class="money">S${{$fnc.toFixedZ(info.product[0].money)}}</div>
              </div>
            </div>
             <div class="shop_content">
              <div class="fx">
                <div class="title1" style="color:#5c5c5c;font-size:12px;">{{info.supplier.shop_recommend}}</div>
                <div class="money1">x{{info.product[0].number}}</div>
              </div>
            </div>
            
        </div>
        <p>S${{ $fnc.toFixedZ(info.money) }}</p>
        <span>
          支付剩余时间：
          <downtime
            :day="time"
            :hour="hour"
            :minute="minute"
            style="display: inline-block"
            :second="second"
            :show-colon="false"
            time="days"
            backgroundColor="none"
            splitorColor="#5c5c5c"
            color="#5c5c5c"
            @timeup="timeup"
          ></downtime>
        </span>
      </div>
      <van-radio-group v-model="pay_id" class="payOrder_item">
        <van-cell-group>
          <van-cell
            class="c1"
            clickable
            @click="sel_pay(item)"
            v-for="(item, i) in info.pay"
            :key="i"
          >
            <template slot="title">
              <img :src="item.piclink" class="c1_i" alt />
              <span class="custom-text">{{ item.title }}</span>
            </template>
            <van-radio :name="item.id" checked-color="#FD5401" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>

      <van-button
        size="large"
        class="pay_order_btn"
        @click="subPay"
        :color="$store.state.config.shop.button_bj_color || ''"
      >
        确认支付
      </van-button>
    </div>

    <div v-else class="endTime">
      <p>{{ info.info }}</p>
    </div>

    <van-popup v-model="showPass" class="pop_pass tc">
      <div>
        <p class="p_title">输入密码</p>
        <van-cell-group>
          <van-field
            @blur="windowScorll"
            v-model="password"
            type="password"
            label="密码"
            placeholder="请输入支付密码"
            required
          />
        </van-cell-group>
        <p class="forget_pwd">
          <span @click="$router.push('/setting/pay_password').catch(() => {})">忘记密码</span>
        </p>
        <van-button type="info" @click="cikHb">确认支付</van-button>
      </div>
    </van-popup>

    <van-dialog
      v-model="show"
      :title="row.title"
      show-cancel-button
      @confirm="onConfirm"
      :showCancelButton="false"
    >
      <van-cell-group>
        <van-cell title="开户名" :value="row.username" />
        <van-cell title="开户账号" :value="row.key" />
        <van-cell title="银行" :value="row.app_id" />
        <van-cell title="银行网点" :value="row.app_secret" />
        <p class="order-offline"><span>*</span>订单打款后，请联系管理员审核</p>
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { RadioGroup, Radio, Field } from "vant";
import { setTimeout } from "timers";
import downtime from "@/components/currency/downtime/downtime.vue";
import wx from "weixin-js-sdk";

export default {
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Field.name]: Field,
    downtime,
  },
  data() {
    return {
      pay_needpass: 0,
      pay_title: "",
      password: "",
      showPass: false,
      pay_id: "",
      info: {},
      currentTime: 0,
      startTime: 0,
      endTime: 0,
      time: 0,
      hour: 0,
      minute: 0,
      second: 0,
      show: false,
      row: {},
      isWx: "0",
    };
  },
  created() {
    this.getPayInfo();

    setTimeout(() => {
      this.$store.dispatch("getCardNum");
    }, 500);
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      //第一个微信端
      this.$fnc.isXcx().then((res) => {
        if (res == "true" || res == true) {
          this.isWx = "4"; //小程序
        } else {
          this.isWx = "3"; //公众号
        }
      });
    } else if (ua.match(/ykapp/i) == "ykapp") {
      this.isWx = "1"; //第二个app
    } else {
      this.isWx = "2"; //剩下的网页
    }
  },
  methods: {
    uploadShare() {
      this.show = false;
      this.$fnc.ykAppUpImage(this.imgUrl);
    },
    onConfirm() {
      this.show = false;
    },
    sel_pay(item) {
      this.pay_id = item.id;
      this.pay_title = item.title;
      this.pay_needpass = item.supplier_need_secret || 0;
    },
    cikHb() {
      var that = this;
      this.showPass = false;
      var params = {};
      params.id = that.$route.query.id || "";
      params.pay_id = that.pay_id;
      params.password = this.$getCode(this.password);
      that.$api.getOrder.subPayOrder(params).then((res) => {
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
      });
    },
    timeup() {
      this.getPayInfo();
    },
    get_paytype() {
      var that = this;
      let p = new Promise(function (resolve, reject) {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          wx.miniProgram.getEnv((res) => {
            if (res.miniprogram) {
              resolve("4");
            } else {
              resolve("1");
            }
          });
        } else if (that.$fnc.isapp() || that.$fnc.isYkAPP()) {
          resolve("2"); //第二个app
        } else {
          resolve("3"); //剩下的网页
        }
      });
      return p;
    },
    getPayInfo() {
      var params = {};
      params.id = this.$route.query.id || "";
      this.get_paytype().then((res) => {
        params.pay_type = res;
        this.$api.getOrder.payOrder(params).then((res) => {
          if (res.code == 200) {
            this.info = res.result;
            var date = res.result.time;
            if (this.info.pay.length > 0) {
              this.pay_id = this.info.pay[0].id;
              this.pay_needpass = this.info.pay[0].supplier_need_secret;
            }
            this.time = parseInt(date / 3600 / 24);
            this.hour = parseInt(date / 3600) - 24;
            this.time = Math.floor(date / (60 * 60 * 24));
            this.hour = Math.floor((date - this.time * 24 * 60 * 60) / 3600);
            this.minute = Math.floor(
              (date - this.time * 24 * 60 * 60 - this.hour * 3600) / 60
            );
            this.second = Math.floor(
              date -
                this.time * 24 * 60 * 60 -
                this.hour * 3600 -
                this.minute * 60
            );
          }
        });
      });
    },
    subPay() {
      var that = this;
      that.$dialog
        .confirm({
          title: "支付",
          message: "是否支付" + that.$fnc.toFixedZ(that.info.money),
        })
        .then(() => {
          var iden = "";
          for (var i in that.info.pay) {
            if (that.pay_id == that.info.pay[i].id) {
              iden = that.info.pay[i].iden;
              that.row = that.info.pay[i];
              break;
            }
          }

          if (iden == "offline") {
            this.show = true;
          } else if (that.pay_needpass == 1) {
            //输密碼
            this.showPass = true;
            this.password = "";
          } else if (that.pay_needpass == 2) {
            this.$toast.fail("前往设置支付密码");
            var url = this.$route.fullpath;
            setTimeout(() => {
              this.$router.push({
                path: "/setting/pay_password",
                query: { redirect: url },
              });
            }, 1500);
          } else {
            //不用输入密码
            var params = {};
            params.id = that.$route.query.id || "";
            params.pay_id = that.pay_id;
            that.$api.getOrder.subPayOrder(params).then((res) => {
              if (iden == "wechat_app") {
                //微信app支付 回退回来页面布局放大
                setTimeout(() => {
                  location.reload();
                }, 400);
              }
              if (res.code == 200 && res.result.is_pay == 1) {
                that.$toast.loading({
                  duration: 0, // 持续展示 toast
                  forbidClick: true, // 禁用背景点击
                  loadingType: "spinner",
                  message: "支付中",
                });
                setTimeout(() => {
                  if (res.result.types == 4) {
                    that.$router.replace(
                      "/assemble/assembledetails?id=" + res.result.id
                    );
                  } else {
                    that.$router.replace(
                      "/order/paydetails?id=" + res.result.id
                    );
                  }
                }, 1500);
              }
              if (res.code == 200 && res.result.is_alipay_app == 1) {
                // eslint-disable-next-line no-undefapplets

                // eslint-disable-next-line no-undef
                that.$fnc.appAlipay(res.result.data); //支付宝支

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
        });
    },
  },
  watch: {
    $route(to, from) {
      if (from.name == "pay_password") {
        this.getPayInfo();
      }
    },
  },
};
</script>


<style lang="less" scoped>
.custom-text {
  font-weight: 15px;
  font-weight: bold;
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
.endTime {
  > p {
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    color: red;
    padding: 10px 0;
    margin: 30px 0;
  }
  > div {
    text-align: center;
    button {
      margin: 0 10px;
    }
  }
}
.pay_order_btn {
  border: none !important;
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 49px;
  background: #f23818;
  color: #fff;
}
.payOrder_item {
  border-radius: 10px;
  overflow: hidden;
  margin: 0 10px;
}
.payOrder {
  background: #f4f5f6;
  line-height: 1;
  font-size: 14px;
  position: relative;
  overflow: auto;
  padding-bottom: 80px;
  .pay_time {
    text-align: center;
    // height: 104px;
    overflow: hidden;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px 10px;
    padding: 15px 15px;
    > p {
      font-size: 30px;
      font-weight: bold;
      margin: 22px 0 11px;
      color: #ff2751;
    }
    > span {
      font-size: 14px;
      background: #eff0f2;
      border-radius: 13px;
      color: #5c5c5c;
      display: inline-block;
      padding: 0 10px;
      height: 26px;
      line-height: 26px;
    }
  }
}
.c1 {
  padding: 20px 15px !important;
}
.c1 .van-radio {
  justify-content: flex-end;
  height: 100%;
}
.c1,
.van-cell:not(:last-child)::after {
  left: 0;
}
.c1 .c1_i {
  vertical-align: middle;
  margin-right: 10px;
  width: 30px;
  height: 30px;
}
.pop_pass {
  width: 95%;
  padding: 10px 16px 10px;
  .p_title {
    padding: 10px 0;
    font-size: 15px;
    font-weight: bold;
  }
  
  .forget_pwd{
    width: 100%;
    text-align: right;
    margin-top: 5px;
    // line-height: 0.3;
    
    span{
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
.info_pay_btn {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 50px;
  overflow: hidden;
}
.info_pay_btn span {
  font-size: 14px;
  color: #323232;
  padding: 10px 25px;
}
.upload_shaer_img {
  position: relative;
  width: 95%;
  margin: 0 auto;
  max-height: 95%;
  i {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
.imgUrl {
  display: block;
  max-width: 100%;
  margin: 0 auto;
}
.upload_shaer {
  width: 100%;
  background-color: transparent;
}
.upload_shaer_btn {
  padding-top: 10px;
  color: #fff;
  font-size: 14px;
  position: relative;
  text-align: center;
  .upload_img_ewm {
    display: block;
    width: 34px;
    margin: 0 auto;
  }
  span {
    display: inline-block;
    margin-top: 20px;
  }
}
.sao {
  color: #606060;
  font-size: 14px;
  margin-top: 4px;
}
.shop_detail{
  border-bottom: 1px solid #f3f3f3;
  .shop_content{
    margin-bottom: 15px;
    .title1{
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        color: #333333;
        font-size: 15px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        // width: 85%;
    }
    .money{
      margin-left: 20px;
      color: #ff5a00!important;
    }
    .money1{
      margin-left: 20px;
      color: #333!important;
    }
  }
}
</style>
