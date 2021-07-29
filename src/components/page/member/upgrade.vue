<template>
  <div class="upgrade">
    <div class="upgrade_bg">
      <van-nav-bar
        title="会员中心"
        left-arrow
        class="navbar"
        :border="false"
        @click-left="toBack()"
      />

      <div class="personal_infor">
        <div>
          <img
            :src="
              userinfo.avatar != ''
                ? $fnc.getImgUrl(userinfo.avatar)
                : require('@/assets/img/member/sex1.png')
            "
          />
        </div>
        <div>
          <p class="name">
            {{ userinfo.nickname ? userinfo.nickname : userinfo.username }}
          </p>
          <p class="level">
            <span style="color: #777">等级：</span
            >{{ userinfo.rating_cn || "----" }}
          </p>
          <p class="time">
            <span style="color: #777">到期时间：</span
            >{{ $fnc.getTimeFormat(userinfo.vip_time) }}
          </p>
        </div>
      </div>
    </div>

    <div class="selectlist">
      <div
        v-for="(item, i) in paylist"
        :key="i"
        :class="{ selected: selindex == i }"
        @click="selpay(item, i)"
      >
        <div class="select_name">{{ item.title }}</div>
        <div class="select_price">
          <p>￥</p>
          {{ $fnc.toFixedZ(item.price) }}
        </div>
        <p class="select_old_price">￥{{ $fnc.toFixedZ(item.market_price) }}</p>
        <div class="renew">
          <p>有效期{{ item.day }}天</p>
        </div>
      </div>
    </div>

    <div class="pay_method" v-if="selItem.id">
      <div class="title">
        <p style="color: #ba894e; white-space: nowrap">
          {{ selItem.rating_cn }}：
        </p>
        <p>
          立即支付<span>{{ $fnc.toFixedZ(selItem.price) }}</span
          >元即可成为{{ selItem.rating_cn }}
        </p>
      </div>
    </div>

    <div class="upgrade_pay">
      <van-radio-group v-model="sel_account">
        <van-cell-group>
          <van-cell
            v-for="item in payType"
            :key="item.id"
            clickable
            @click="
              sel_account = item.id;
              pay_needpass = item.supplier_need_secret || 0;
            "
            style="padding-left: 0; padding-right: 0"
            :border="false"
          >
            <template slot="title">
              <div class="upgrade_pay_cell">
                <div class="upgrade_pay_logo">
                  <img :src="$fnc.getImgUrl(item.piclink)" alt />
                </div>
                <div class="upgrade_pay_logo_p">
                  <p>{{ item.title }}</p>
                </div>
              </div>
            </template>
            <template slot="right-icon">
              <van-radio :name="item.id" checked-color="#FFAA01" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>

    <div class="upgrade_img" v-if="vip.background">
      <img :src="$fnc.getImgUrl(vip.background)" />
    </div>

    <div class="fx button_footer">
      <p @click="buy">成为{{ selItem.rating_cn }}</p>
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
          <span @click="$router.push('/setting/pay_password').catch(() => {})">
            忘记密码
          </span>
        </p>
        <van-button type="info" @click="cikHb">确认支付</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { RadioGroup, Radio, Field } from "vant";
import wx from "weixin-js-sdk";
export default {
  name: "upgrade",
  data() {
    return {
      radio: "1",
      userinfo: {},
      selindex: -1,
      paylist: [],
      vip: {
        background: "",
        color: "",
      },
      payType: [],
      sel_account: "",
      pay_needpass: 0,
      selItem: {},
      show: false,
      row: {},
      password: "",
      showPass: false,
      orderId: "",
    };
  },
  computed: {},
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Field.name]: Field,
  },
  created() {
    this.get_member();
    this.getVIP();
  },
  methods: {
    buy() {
      if (this.selindex < 0) {
        this.$toast.fail("请选择要购买的权益");
        return;
      } else if (this.sel_account == "") {
        this.$toast.fail("请选择支付方式");
        return;
      }
      var that = this;
      that.$dialog
        .confirm({
          title: "提示",
          message: "是否确认购买" + this.paylist[this.selindex].title,
        })
        .then(() => {
          that.$api.getPage
            .buy_member_upgrade({ id: this.paylist[this.selindex].id })
            .then((res) => {
              if (res.code == 200) {
                this.orderId = res.result;
                this.subPay(res.result);
              }
            });
        })
        .catch(() => {});
    },
    subPay(id) {
      var iden = "";
      for (var i in this.payType) {
        if (this.sel_account == this.payType[i].id) {
          iden = this.payType[i].iden;
          this.row = this.payType[i];
          break;
        }
      }
      if (iden == "offline") {
        this.show = true;
        return;
      } else if (this.pay_needpass == 1) {
        //输密碼
        this.showPass = true;
        this.password = "";
        return;
      } else if (this.pay_needpass == 2) {
        this.$toast.fail("前往设置支付密码");
        var url = this.$route.fullpath;
        setTimeout(() => {
          this.$router.push({
            path: "/setting/pay_password",
            query: { redirect: url },
          });
        }, 1500);
        return;
      }
      var params = {};
      params.id = id;
      params.pay_id = this.sel_account;

      this.$api.getOrder.subPayOrder(params).then((res) => {
        if (res.code == 200 && res.result.is_pay == 1) {
          this.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: "spinner",
            message: "支付中",
          });
          setTimeout(() => {
            this.$router.replace("/order/paydetails?id=" + res.result.id);
          }, 1500);
        }
        if (res.code == 200 && res.result.is_alipay_app == 1) {
          this.$fnc.appAlipay(res.result.data); //支付宝支
          this.$router.replace("/order/paydetails?id=" + res.result.id);
        }
      });
    },
    cikHb() {
      var that = this;
      this.showPass = false;
      var params = {};
      params.id = that.orderId;
      params.pay_id = that.sel_account;
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
            this.$router.replace("/order/paydetails?id=" + res.result.id);
          }, 1500);
        }
        if (res.code == 200 && res.result.is_alipay_app == 1) {
          this.$fnc.appAlipay(res.result.data);
          this.$router.replace("/order/paydetails?id=" + res.result.id);
        }
      });
    },
    selpay(item, i) {
      this.selItem = item;
      this.selindex = i;
    },
    getVIP() {
      this.$api.getPage.get_member_upgrade({}).then((res) => {
        if (res.code == 200) {
          this.paylist = res.result;
          if (this.paylist && this.paylist[0]) {
            this.selItem = this.paylist[0];
            this.selindex = 0;
          }
        }
      });
    },
    get_member() {
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
      this.$api.getPage.get_memberlist(params).then((res) => {
        if (res.code == 200) {
          this.product = res.result.info.product.pro;
          this.vip.background = res.result.vip_page_background;
          this.vip.color = res.result.vip_page_background_color;
          this.ava = res.result.avatar;
          this.name = res.result.nickname;
          this.link = res.result.username;
          this.userinfo = res.result.user;
          this.payType = res.result.pay;
          if (this.payType && this.payType[0]) {
            this.sel_account = this.payType[0].id || "";
            this.pay_needpass = this.payType[0].supplier_need_secret || 0;
          }
        }
      });
    },
  },
  watch: {
    $route(to, from) {
      if (from.name == "pay_password") {
        this.get_member();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.upgrade {
  width: 100%;
  height: 100%;
  overflow: auto;
  font-size: 14px;
  padding-bottom: 52px;

  .upgrade_bg {
    width: 100%;
    background: url(../../../assets/img/mem_shop/back.png) no-repeat top;
    background-size: 100% 150px;

    /deep/.navbar {
      background: transparent;
      .van-nav-bar__left i {
        color: #fff;
      }
      .van-nav-bar__title {
        color: #fff;
      }
    }

    .personal_infor {
      width: 92%;
      margin: 10px auto;
      padding: 14px 10px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      background-image: linear-gradient(90deg, #fddfa9, #ffbd4f);

      > div:first-of-type {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 54px;
          height: 54px;
          border-radius: 100%;
        }
      }
      > div:last-of-type {
        margin-left: 10px;
        line-height: 1.1;
        .name {
          font-size: 17px;
          margin-bottom: 6px;
          font-weight: bold;
        }
        .level {
          font-size: 12px;
          margin-bottom: 6px;
        }
        .time {
          font-size: 12px;
        }
      }
    }
  }

  .selectlist {
    width: 92%;
    margin: 10px auto;
    display: flex;
    overflow-x: auto;

    > div {
      flex-shrink: 0;
      width: 125px;
      height: 125px;
      border: 1px solid #f2f2f2;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 18px;
      border-radius: 5px;
      margin-right: 10px;
      box-shadow: 0 0 3px rgb(235, 235, 235);
      background-color: #fff;
      line-height: 1.1;
      .select_name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .select_price {
        font-size: 20px;
        display: flex;
        align-items: baseline;
        color: #ba894e;
        margin-bottom: 10px;
        font-family: "gilroy";
        font-weight: bold;
        > p {
          font-size: 12px;
        }
      }
      .select_old_price {
        font-size: 12px;
        color: #b9b9b9;
        margin-bottom: 7px;
        position: relative;
        font-family: "gilroy";
        text-decoration: line-through;
      }
      .renew {
        background-color: #e4b46c;
        height: 16px;
        border-radius: 3px;
        padding: 0 6px;
        > p {
          font-size: 11px;
          line-height: 16px;
          color: #fffbd6;
        }
      }
    }
    .selected {
      position: relative;
    }
    .selected::after {
      content: "已选择";
      position: absolute;
      z-index: 3;
      top: 0;
      left: 0;
      padding: 2px;
      font-size: 12px;
      line-height: 12px;
      background-color: #424242;
      color: #baa789;
      border-top-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }

  .pay_method {
    width: 92%;
    margin: 10px auto;
    margin-top: 25px;

    .title {
      font-size: 14px;
      line-height: 1.2;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      > span {
        font-family: "gilroy";
      }
    }
  }

  .upgrade_pay {
    width: 94%;
    margin: 10px auto;
    .upgrade_pay_cell {
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
    }
    .upgrade_pay_logo {
      height: 30px;
      width: 30px;
      margin-right: 10px;
    }
    .upgrade_pay_logo img {
      width: 100%;
    }
    .upgrade_pay_logo_p {
      font-size: 14px;
      color: #000000;
      line-height: 22px;
    }
  }

  .upgrade_img {
    width: 100%;
    padding-bottom: 60px;
    img {
      width: 100%;
    }
  }

  .button_footer {
    position: fixed;
    bottom: 50px;
    width: 100%;
    height: 60px;
    background: #fff;
    justify-content: center;
    p {
      width: 96%;
      background-image: linear-gradient(90deg, #fee3b4, #fdbd4f);
      border-radius: 50px;
      height: 48px;
      font-size: 18px;
      line-height: 18px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #7c4f0e;
    }
  }
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
</style>