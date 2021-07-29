<template>
    <div class="container pay_bg">
        <van-nav-bar title="保证金充值"
            left-text
            left-arrow
            class="navbar"
            @click-left="toBack">

        </van-nav-bar>
        <div class="recharge_top">
            <div class="recharge_top_content">
                <p class="recharge_title">充值金额</p>
                <span>￥</span>
                <input @blur="windowScorll"
                    type="number"
                    v-model="money">
            </div>
        </div>
        <div class="recharge_account">
            <div class="recharge_account_content">
                <p class="recharge_title">选择支付账户</p>
                <div class="recharge_account_sel">
                    <van-radio-group v-model="sel_account">
                        <van-cell-group>
                            <van-cell v-for="item in recharge_option"
                                :key='item.id'
                                clickable
                                @click="sel_account = item.id"
                                style="padding-left: 0; padding-right: 0">
                                <template slot="title">
                                    <div class="recharge_account_cell">
                                        <van-radio :name="item.id" />
                                        <div class="recharge_account_sel_logo">
                                            <img :src="$fnc.getImgUrl(item.piclink)"
                                                alt="">
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
        <div class="recharge_account_btn">
            <van-button type="info"
                size="large"
                :disabled="isdisabledFn"
                :class="isDisabl ? 'disable_btn':'' "
                @click="recharge_submit()">下一步</van-button>
        </div>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
import wx from 'weixin-js-sdk'
export default {
    name: "auctionrecharge",
    data () {
        return {
            money: "",               //余额
            sel_account: "",         //支付方式
            key_show: true,          //键盘可见
            recharge_option: [],
            isDisabl: false,           //控制按钮是否可用
        }
    },
    created () {
        this.money = this.$fnc.toFixedZ(this.$route.query.money)
        this.get_recharge_option();
    },
    computed: {
        isdisabledFn () {
            if (this.money != "" && this.sel_account != "") {
                return this.isDisabl = false;
            } else {
                return this.isDisabl = true;
            }
        }
    },
    methods: {

        recharge_submit () {
            //提交充值
            var that = this;
            if (this.money <= 0) {
                this.$toast.fail("金额不能小于0");
                return false;
            }
            this.$dialog.confirm({
                message: "是否充值" + this.money + '元?'
            }).then(() => {
                this.$api.getPay.submit_recharge({ money: this.money, pay_id: this.sel_account, cate: 'margin' }).then(res => {
                    if (res.code == 200 && res.result.is_pay == 1) {
                        that.$toast.loading({
                            duration: 0,       // 持续展示 toast
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
                            this.$fnc.appAlipay(res.result.data)//支付宝支
                        } catch (error) {
                            this.$toast.fail("支付调起失败")
                        }
                        this.$router.replace("/pay/paydetails?id=" + res.result.id)
                    }
                    if (res.code == 200 && res.result.is_wechat_applets == 1) {
                        wx.miniProgram.navigateTo({ url: `/pages/wxpay/wxpay?oid=${res.result.oid}` });
                    }
                })
            }).catch()

        },
        get_recharge_option () {
            var params = {};
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {     //第一个微信端
                wx.miniProgram.getEnv((res) => {
                    if (res.miniprogram) {
                        params.pay_type = '4';                  //小程序    
                    } else {
                        params.pay_type = '1';                  //公众号
                    }
                })
            } else if (ua.match(/ykapp/i) == 'ykapp') {
                params.pay_type = '2';                           //第二个app
            } else {
                params.pay_type = '3';          //剩下的网页
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

<style scoped>
@import "./../../../../assets/css/pay.css";
.disable_btn {
    border: 1px solid #cccccc;
    background-color: #cccccc;
}
</style>