<template>
    <div class="pay_details_con"
        id="payDetails">

        <div class="pay_details_head">
            <i></i>
            <p>
                <van-icon name="checked"
                    size="24px"
                    color="#fff" />
                <span>{{info.is_pay?'支付成功':'支付中...'}}</span>
            </p>
            <p>实付￥ {{$fnc.toFixedZ(info.money)}}</p>
            <p v-if="info.send_score">{{info.send_score}}</p>
            <div class="tc">
                <van-button round
                    size="small"
                    replace
                    to='/index'
                    type="default">返回首页</van-button>
                <van-button round
                    size="small"
                    replace
                    to='/pay/life/record'
                    type="default">查看订单</van-button>
            </div>
        </div>
        <div class="pay_details_oder fx">
            <van-icon name="checked"
                color="#2c77ea"
                size="28px"
                style="padding-right:10px;padding-left:5px"></van-icon>
            <div>
                <p>您的订单编号为：{{info.oid}}</p>
                <p>支付时间：{{$fnc.getTimeFormat(info.pay_time)}}</p>
            </div>
        </div>
        <div class="pay_details_con">
            <!-- <couponItem/> -->
            <!-- <img src="../../../assets/img/order/04.png" alt> -->
            <div class="pay_details_con_title">
                <p>
                    <van-icon name="bell" />
                    <span>安全提醒</span>
                </p>
                <div class="pay_details_con_title_d1">
                    平台不会通过任何非官方电话，QQ，微信，与您联系，也不会要求您点击链接进行退款或取消订单</div>

            </div>
        </div>

    </div>
</template>

<script>



export default {
    name: "life_paydetail",
    components: {

    },
    data () {
        return {
            info: {},
            list: []
        };
    },

    created () {

        this.getOrderInfo();

    },
    methods: {


        getOrderInfo () {
            var params = {};
            params.id = this.$route.query.id || "";
            this.$api.getPay.get_life_success(params).then(res => {
                if (res.code == 200) {
                    //已支付
                    this.info = res.result;
                }
            });


        }
    }
};
</script>


<style lang="less" scoped>
.scol {
    position: fixed;
    top: 0;
    width: 100%;
}
.order_prod {
    overflow: auto;
    width: 100%;
}
.pay_details_con {
    background: #f3f3f3;

    line-height: 1;
    overflow: auto;
    font-size: 14px;
    > img {
        max-width: 100%;
    }
    .pay_details_head {
        height: 186px;
        background: url("../../../assets/img/pay/life_detail.png") no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
        > p:nth-child(2) {
            text-align: center;
            margin-top: 35px;
            i {
                vertical-align: bottom;
            }
            span {
                font-size: 23px;
                font-weight: bold;
                color: #fff;
            }
        }
        > p:nth-child(3) {
            color: #fff;
            text-align: center;
            margin-top: 14px;
        }
        > p:nth-child(4) {
            color: #fff;
            text-align: center;
            margin-top: 14px;
        }
        > div {
            margin-top: 10px;
            > button {
                margin: 0 10px;
                width: 125px;
                color: #ffffff;
                background: none;
                border: 1px solid #fff;
            }
        }
    }
    .pay_details_oder {
        background: #fff;
        padding: 10px 8px;
        margin: -28px 12px 0;
        border-radius: 10px;
        justify-content: flex-start;
        > img {
            width: 36px;
            height: 36px;
            margin-right: 11px;
        }
        > div {
            color: #999999;
            > p {
                font-size: 13px;
            }
            > p + p {
                margin-top: 6px;
            }
        }
    }
    .pay_details_con {
        margin: 12px 12px;
    }
    > .pay_details_con_title {
        margin: 19px 0 0;
        > p {
            color: #252525;
            margin-bottom: 13px;
            i {
                vertical-align: bottom;
                margin-right: 5px;
            }
        }
        > div.pay_details_con_title_d1 {
            font-size: 14px;
            line-height: 1.4;
            color: #999999;
            margin-bottom: 13px;
        }
        > div.fx {
            justify-content: center;
            > img {
                max-width: 100%;
            }
            > span {
                font-size: 18px;
                font-weight: bold;
                color: #2d2d2d;
            }
        }
    }
}
</style>
