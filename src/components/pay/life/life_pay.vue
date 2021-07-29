<template>
    <div class="pay_con life_pay">
        <van-nav-bar title="提交支付"
            left-text
            left-arrow
            class="navbar"
            :border="false"
            @click-left="toBack" />
        <div v-if="info.is_pay>=0">
            <div class="pay_time">
                <p>￥{{$fnc.toFixedZ(info.money)}}</p>
                <span>
                    支付剩余时间：
                    <downtime :day="time"
                        :hour="hour"
                        :minute="minute"
                        style="display: inline-block;"
                        :second="second"
                        :show-colon="false"
                        time="days"
                        backgroundColor="none"
                        splitorColor="#969696"
                        color="#969696"
                        @timeup="timeup"></downtime>
                </span>
            </div>
            <van-radio-group v-model="pay_id"
                class="pay_con_item">
                <van-cell-group>
                    <van-cell class="c1"
                        clickable
                        @click="pay_id = item.id"
                        v-for="(item,i) in info.pay"
                        :key="i">
                        <template slot="title">
                            <img :src="item.piclink"
                                class="c1_i"
                                alt="">
                            <span class="custom-text">{{item.title}}</span>
                        </template>
                        <van-radio :name="item.id" />
                    </van-cell>
                </van-cell-group>
            </van-radio-group>

            <van-button type="primary"
                size="large"
                class="pay_order_btn"
                @click="subPay">确认支付</van-button>
        </div>

        <div v-else
            class="endTime">
            <p>{{info.info}}</p>
            <div>
                <van-button type="danger"
                    :replace="true"
                    to="/shop/shopindex">返回首页</van-button>
                <van-button type="danger"
                    :replace="true"
                    to="/member/member">返回用户中心</van-button>
            </div>
        </div>

    </div>

</template>

<script>
import { RadioGroup, Radio } from "vant";
import { setTimeout } from 'timers';
import downtime from "@/components/currency/downtime/downtime.vue"
export default {
    name: "life_pay",
    components: {
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        downtime
    },
    data () {
        return {
            pay_id: '',
            info: {},
            currentTime: 0,
            startTime: 0,
            endTime: 0,
            time: 0,
            hour: 0,
            minute: 0,
            second: 0,
        };
    },
    created () {
        this.getPayInfo();
    },
    methods: {
        timeup () {
            this.getPayInfo();
        },
        getPayInfo () {

            var params = {};
            params.id = this.$route.query.id || '';
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                params.pay_type = '1';                                      //第一个微信端
            } else if (ua.match(/ykapp/i) == 'ykapp') {
                params.pay_type = '2';                           //第二个app
            } else {
                params.pay_type = '3';          //剩下的网页
            }
            this.$api.getPay.get_lifepay(params).then(res => {
                if (res.code == 200) {
                    this.info = res.result;
                    var date = res.result.time;
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

            })
        },
        subPay () {
            var that = this;
            that.$dialog.confirm({
                title: '支付',
                message: '是否支付' + that.$fnc.toFixedZ(that.info.money)
            }).then(() => {
                // on confirm
                var params = {};
                params.id = that.$route.query.id || '';
                params.pay_id = that.pay_id;
                that.$api.getPay.submit_lifepay(params).then(res => {
                    if (res.code == 200 && res.result.is_pay == 1) {
                        that.$toast.loading({
                            duration: 0,       // 持续展示 toast
                            forbidClick: true, // 禁用背景点击
                            loadingType: 'spinner',
                            message: '支付中'
                        });
                        setTimeout(() => {
                            this.$router.replace("/pay/life/detail?id=" + res.result.id)
                        }, 2000)
                    }
                    if (res.code == 200 && res.result.is_alipay_app == 1) {
                       this.$fnc.appAlipay(res.result.data)//支付宝支
                        this.$router.replace("/pay/life/detail?id=" + that.$route.query.id)

                    }
                })
            }).catch(() => {
                // on cancel
            });

        },
    }
};
</script>


<style lang="less" scoped>
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
    background: linear-gradient(to right top, #0f8be5, #71bfff);
    border: none !important;
    // position: absolute;
    width: 100%;
    // bottom: 0;
    margin-top: 20px;
}
.pay_con_item {
    border-radius: 10px;
    overflow: hidden;
    margin: 0 10px;
}
.pay_con {
    background: #f0f0f0;
    line-height: 1;
    font-size: 14px;
    position: relative;
    .pay_time {
        text-align: center;
        height: 104px;
        overflow: hidden;
        > p {
            font-size: 24px;
            font-weight: bold;
            color: #323232;
            margin: 22px 0 11px;
        }
        > span {
            font-size: 13px;
            background: #e9e9e9;
            border-radius: 27px;
            color: #969696;
            display: inline-block;
            padding: 6px 10px;
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
    margin-right: 15px;
    width: 40px;
    height: 40px;
}
</style>
