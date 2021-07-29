<template>
  <div class="container pay_bg">
    <van-nav-bar title="充值" left-text left-arrow class="navbar" @click-left="toBack">
      <p slot="right">
        <router-link :to="{path: 'record',query:{type:'1'}}">充值记录</router-link>
      </p>
    </van-nav-bar>
    <div class="recharge_top">
      <div class="recharge_top_content" v-if="sel_account != '礼品卡'">
        <p class="recharge_title">充值金额</p>
        <span>￥</span>
        <input @blur="windowScorll" type="number" v-model="money">
      </div>
    </div>
    <div class="recharge_account">
      <div class="recharge_account_content">
        <p class="recharge_title">请选择充值方式</p>
        <div class="recharge_account_sel">
          <van-radio-group v-model="sel_account">
            <van-cell-group>
              <van-cell v-for="item in recharge_option" :key='item.id' clickable @click="sel_account = item.id,sel_info=item"
                  style="padding-left: 0; padding-right: 0">
                <template slot="title">
                  <div class="recharge_account_cell">
                    <van-radio :name="item.id" />
                    <div class="recharge_account_sel_logo">
                      <img :src="$fnc.getImgUrl(item.piclink)" alt="">
                    </div>
                    <div class="recharge_account_sel_logo_p">
                      <p>{{item.title}}</p>
                      <p>{{item.title}}账户支付充值金额</p>
                    </div>
                  </div>
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
      </div>
    </div>
    <div class="recharge_account" style="margin-top: 15px;" v-if="$store.state.config.plugin.czk && $store.state.config.plugin.czk.is_open==1">
      <div class="recharge_account_content">
        <div class="recharge_account_sel">
          <van-radio-group v-model="sel_account">
            <van-cell-group>
              <van-cell clickable @click="sel_account = '礼品卡'" style="padding-left: 0; padding-right: 0">
                <template slot="title">
                  <div class="recharge_account_cell">
                    <van-radio name="礼品卡" />
                    <div class="recharge_account_sel_logo">
                      <img src="../../assets/img/pay/card.png" alt="">
                    </div>
                    <div class="recharge_account_sel_logo_p">
                      <p>礼品卡支付</p>
                      <p>礼品卡支付账户支付充值金额</p>
                    </div>
                  </div>
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
      </div>
    </div>

    <div class="recharge_account_btn">
      <van-button type="info" size="large" :disabled="isdisabledFn" :class="isDisabl ? 'disable_btn':'' " @click="recharge_submit()">下一步</van-button>
    </div>
    <van-dialog v-model="show" :title="sel_info.title" show-cancel-button @confirm="show = false" :showCancelButton="false">
      <van-cell-group>
        <van-cell title="开户名" :value="sel_info.username" />
        <van-cell title="开户账号" :value="sel_info.key" />
        <van-cell title="银行" :value="sel_info.app_id" />
        <van-cell title="银行网点" :value="sel_info.app_secret" />
        <p class="order-offline">
          <span>*</span>订单打款后，请联系管理员审核
        </p>
      </van-cell-group>
    </van-dialog>

    <van-popup v-model="gift_show" position="bottom" :style="{ height: '40%' }" closeable close-icon="close">
      <div class="gift_recharge">
        <p>我的礼品卡</p>
        <div class="gift_form">
          <van-field v-model="gift.code" label-width="50" label-class="gift_label" label="卡号" placeholder="请输入您的卡号" />
          <van-field v-model="gift.password" label-width="50" label-class="gift_label" label="密码" type="password" placeholder="请输入密码" />
        </div>
        <div class="gift_btn" @click="rechargeGift">
          <van-button type="danger">确认充值</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  setTimeout
} from 'timers';

import {
  Dialog,
  Field
} from 'vant';
import wx from 'weixin-js-sdk'
export default {
  name: "recharge",
  data () {
    return {
      show: false,
      row: {},
      sel_info: {},
      money: "", //余额
      sel_account: "", //支付方式
      key_show: true, //键盘可见
      recharge_option: [],
      isDisabl: false, //控制按钮是否可用
      gift_show: false,//礼品卡显示
      gift: {
        code: "",
        password: ""
      }
    }
  },
  components: {
    [Dialog.name]: Dialog,
    [Field.name]: Field
  },
  created () {
    this.get_recharge_option();
  },
  computed: {
    isdisabledFn () {
      if ((this.money != "" && this.sel_account != "") || this.sel_account == '礼品卡') {
        return this.isDisabl = false;
      } else {
        return this.isDisabl = true;
      }
    }
  },
  methods: {
    rechargeGift () {
      if (this.gift.code == "") {
        this.$toast.fail("请输入礼品卡号");
        return;
      } else if (this.gift.password == "") {
        this.$toast.fail("请输入密码");
        return;
      }
      //礼品卡充值
      this.$api.getGift.rechargeGiftCard(this.gift).then(res => {
        if (res.code == 200) {
          this.$toast.success(res.result);
          this.$router.replace("/pay/record?type=1");
        }
      })
    },
    recharge_submit () {
      if (this.sel_account == '礼品卡') {
        this.gift_show = true;
        return;
      }
      //提交充值
      var that = this;
      if (this.money <= 0) {
        this.$toast.fail("金额不能小于0");
        return false;
      }
      this.$dialog.confirm({
        message: "是否充值" + this.money + '元?'
      }).then(() => {
        this.$api.getPay.submit_recharge({
          money: this.money,
          pay_id: this.sel_account
        }).then(res => {
          if (res.code == 200 && this.sel_info.iden == "offline") {
            this.show = true;
            return
          }
          if (res.code == 200 && res.result.is_pay == 1) {
            that.$toast.loading({
              duration: 0, // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              loadingType: 'spinner',
              message: '支付中'
            });
            setTimeout(() => {
              this.$router.replace("/pay/paydetails?id=" + res.result.id)
            }, 2000)
          }
          if (res.code == 200 && res.result.is_alipay_app == 1) {
            try {
              this.$fnc.appAlipay(res.result.data) //支付宝支
            } catch (error) {
              this.$toast.fail("支付调起失败")
            }
            this.$router.replace("/pay/paydetails?id=" + res.result.id)
          }
          if (res.code == 200 && res.result.is_wechat_applets == 1) {
            wx.miniProgram.navigateTo({
              url: `/pages/wxpay/wxpay?oid=${res.result.oid}`
            });
          }
        })
      }).catch()

    },
    get_recharge_option () {
      var params = {};
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') { //第一个微信端
        wx.miniProgram.getEnv((res) => {
          if (res.miniprogram) {
            params.pay_type = '4'; //小程序    
          } else {
            params.pay_type = '1'; //公众号
          }
        })
      } else if (ua.match(/ykapp/i) == 'ykapp') {
        params.pay_type = '2'; //第二个app
      } else {
        params.pay_type = '3'; //剩下的网页
      }

      this.$api.getPay.get_recharge_item(params).then(res => {
        if (res.code == 200) {
          this.recharge_option = res.result.pay;
        }
      });
    },
  },
  filters: {
    toFix (val) {
      return parseFloat(val).toFixed(2);
    }
  }
}
</script>

<style lang="less" scoped>
@import "./../../assets/css/pay.css";

.disable_btn {
  border: 1px solid #cccccc;
  background-color: #cccccc;
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

.gift_recharge {
  margin: 0 15px;
  height: 100%;
  > p {
    font-size: 18px;
    text-align: center;
    margin-top: 10px;
  }

  .gift_form {
    .van-cell {
      border-bottom: 1px solid #d6d6d6;
      padding: 10px 0;
    }
  }

  .gift_btn {
    margin-top: 50px;
    .van-button--normal {
      width: 100%;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
