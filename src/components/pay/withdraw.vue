<template>
  <div class="container pay_bg">
    <div class="draw">
      <van-nav-bar title="提现" left-text left-arrow class="navbar" @click-left="toBack">
        <p slot="right">
          <router-link :to="{path:'record',query:{type:'2'}}">提现记录</router-link>
        </p>

      </van-nav-bar>
      <div class="draw_sel_account">
        <van-cell-group title="选择提现账户">
          <van-cell title="" is-link style="padding-left: 0; padding-right: 0" @click="sel(1)">
            <template slot="title">
              <div class="draw_sel_account_item">
                <div class="draw_sel_account_icon" v-if="JSON.stringify(sel_account)!='{}'">
                  <img v-if="sel_account.type == '微信'" src="./../../assets/img/pay/wx.png" alt="">
                  <img v-else-if="sel_account.type == '支付宝'" src="./../../assets/img/pay/zfb2.png" alt="">
                  <img v-else src="./../../assets/img/pay/card.png" alt="">
                </div>
                <div class="recharge_account_sel_logo_p recharge_account_sel_logo_p1">
                  <p>{{sel_account.type}}</p>
                  <p>{{sel_account.account}}</p>
                  <p v-if="JSON.stringify(sel_account)=='{}'">请选择提现账号</p>
                </div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group title="选择提现类型">
          <van-cell title="" is-link style="padding-left: 0; padding-right: 0" @click="sel(2)">
            <template slot="title">
              <div class="draw_sel_account_item">
                <div class="draw_sel_account_icon">

                  <img src="./../../assets/img/pay/money.png" alt="" v-if="sel_type.iden=='money'">
                  <img src="./../../assets/img/pay/tx.png" alt="" v-else-if="sel_type.iden=='amount'">
                  <img src="./../../assets/img/pay/yue.png" alt="" v-else-if="sel_type.iden=='integral'">
                  <img src="./../../assets/img/pay/tx.png" alt="" v-else>

                </div>
                <div class="recharge_account_sel_logo_p recharge_account_sel_logo_p1">
                  <p>{{sel_type.title}}</p>
                  <p>可用{{sel_type.title}}:{{sel_type.money}}</p>
                </div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>

      </div>
      <div class="draw_money">
        <div class="recharge_top_content">
          <p class="recharge_title">提现金额</p>
          <span>￥</span>
          <input @blur="windowScorll" type="number" v-model="money">

        </div>

      </div>

      <p class="real_money" v-if="real_money != 0 && sel_type.iden != 'supply'"> 实际到账金额： {{real_money}}</p>

      <div class="draw_btn">
        <van-button type="info" size="large" @click="submit_draw">{{draw_data.button_text || '预计24小时内到账，确认提现'}}</van-button>
        <span class="draw_btn_point" v-if="this.sel_type.iden != 'supply'">{{draw_data.ye_help}}</span>

      </div>
    </div>
    <van-popup v-model="sel_show" class="model" position="right" :overlay='false'>
      <seldraw :type="type" :box_show="sel_show" @get_back="get_back" @back_account="get_back_account" @back_type="get_back_type"></seldraw>
    </van-popup>

  </div>
</template>

<script>
import seldraw from '@/components/pay/sel_draw.vue'
import { setTimeout } from 'timers';
export default {
  name: "withdraw",
  data () {
    return {
      real_money: 0,
      money: "",
      key_show: true,    //键盘可见
      draw_option: [],
      draw_data: [],
      sel_account: {},
      sel_type: {
        id: "0",
        money: "",
        iden: "money",
        title: "余额"
      },
      type: 1,
      draw_show: true,          //提现是否可见
      sel_show: false,         //选择组件是否可见
    }
  },
  components: {
    seldraw,
  },
  created () {
    this.get_draw_option();
    this.get_draw_data();
  },
  filters: {
    topercent (val) {
      return val * 100;
    },

  },
  methods: {

    submit_draw () {
      if (this.money <= 0) {
        this.$toast.fail("金额不能小于0");
        return false;
      }
      this.$dialog.confirm({
        message: "是否提现 " + this.sel_type.title + ' ' + this.money + '?'
      }).then(() => {
        var params = {
          money: this.money,
          pay: this.sel_account.type,
          iden: this.sel_type.iden,
        };
        this.$api.getPay.submit_draw(params).then(res => {
          if (res.code == 200) {
            this.$toast.fail(res.result);
            setTimeout(() => {
              this.$router.push({ path: 'record', query: { type: '2' } });
            }, 3000)

          }
        })
      }).catch()

    },
    get_back_type (item) {            //监听到返回的提现类型
      this.draw_show = true;
      this.sel_show = false;
      this.sel_type = item;
    },
    get_back_account (item) {         //监听到返回的提现账户
      this.draw_show = true;
      this.sel_show = false;
      this.sel_account = item;
    },
    get_back () {         //监听到在选择时返回
      this.draw_show = true;
      this.sel_show = false;
    },
    sel (id) {
      this.type = id;
      this.draw_show = false;
      this.sel_show = true;
    },

    get_draw_data () {
      this.$api.getPay.getdraw_index({}).then(res => {
        if (res.code == 200) {
          this.draw_data = res.result;
          if (this.$route.query.iden) {
            this.sel_type = res.result.balance.find((item, i) => {
              return item.iden == this.$route.query.iden;
            })
          } else {
            this.sel_type = res.result.balance[0];
          }
        }
      });
    },
    get_draw_option () {
      this.$api.getPay.get_recharge_item({}).then(res => {
        if (res.code == 200) {
          this.draw_option = res.result.pay;
          // this.sel_account=res.result.pay[0]
          var userinfo = this.$store.state.user || [];

          // if(res.result.pay[0].title=='支付宝'){
          //     this.sel_account.account=userinfo.alipay;
          // }else if(res.result.pay[0].title=='微信'){
          //    this.sel_account.account=userinfo.wechat;
          // }else{
          //     this.sel_account.account=userinfo.bank_card;
          // }

          // this.sel_account.type=res.result.pay[0].title;

        }
      });
    },

  },

  watch: {
    $route (to, from) {
      this.draw_show = true,
        this.sel_show = false;
      if (from.path.indexOf('setting' >= 0)) {
        this.get_draw_option();
        this.get_draw_data();
      }

    },
    money (old, after) {
      var money = Number(this.money);
      var ye_bl = Number(this.money) * this.draw_data.ye_fee * 0.001
      var gys_bl = Number(this.money) * this.draw_data.gys_fee * 0.001
      var real = money - ye_bl - gys_bl
      this.real_money = this.$fnc.toFixedZ(real)
      return
    }
  }

}
</script>

<style scoped>
@import "./../../assets/css/pay.css";
.real_money {
  width: 85%;
  margin: 0 auto;
  font-size: 14px;
  padding-top: 15px;
}
</style>