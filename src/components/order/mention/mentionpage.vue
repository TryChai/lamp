<template>
    <div class="mentionindex">
        <van-icon name="arrow-left"
            @click="toBack()"
            class="mention_top_left" />
        <van-swipe class="my-swipe"
            ref="swipebox"
            v-if="orderlist && orderlist.length > 0"
            @change="onChange"
            indicator-color="white">
            <van-swipe-item v-for="(orderitem,i) in  orderlist"
                :key="i">
                <div class="mention_top">
                    <div class="mention_box">
                        <div>
                            <div :id="'qrcodeorder' + i"
                                v-show="orderitem.receivetype == '今日可取'"
                                class="ewm">
                            </div>
                            <img src="./../../../assets/img/order/mention_img.png"
                                v-show="orderitem.receivetype == '明日可领取'"
                                alt="">
                            <p>{{orderitem.receivetype || ''}}</p>
                            <p>请勿泄露二维码</p>
                            <p @click="$router.push('/order/orderdetails?id=' + orderitem.id)">
                                订单号：{{orderitem.oid}}</p>
                        </div>
                        <div v-if="orderitem.lifting_ar">
                            <p>{{orderitem.lifting_ar.title}} </p>
                            <p>{{orderitem.lifting_ar.province + orderitem.lifting_ar.city+orderitem.lifting_ar.area+orderitem.lifting_ar.add}}
                            </p>
                        </div>
                    </div>
                </div>
            </van-swipe-item>

        </van-swipe>
        <div class="mention_top"
            v-else>
            <div class="mention_box mention_box_no">

                <img src="./../../../assets/img/empty.png"
                    alt="">
                <p>暂无订单快去下单吧！</p>
            </div>
        </div>
        <div class="mention_shop">
            <p><span></span>可选订单</p>
            <div class="mention_shop_box">
                <div class="mention_shop_box_over"
                    v-if="orderlist && orderlist.length > 0">
                    <div class="mention_shop_item"
                        v-for="(item,i) in orderlist"
                        :key="i"
                        @click="ordersel(item,i)">
                        <img :src="$fnc.getImgUrl(item.product[0].piclink || '')"
                            v-if="item.product"
                            alt="">
                        <span :class="{orderactive:nowindex == i ?true:false}"></span>
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'
export default {
    name: "mention_page",
    data () {
        return {
            nowindex: 0,
            // order: {

            // },
            orderlist: [],
        };
    },
    components: {
    },
    computed: {
        //当前显示的取货状态
        // receivetype () {
        //     let now = this.$fnc.getMonthAndDay(Date.parse(new Date()));
        //     let receive = this.$fnc.getMonthAndDay(Number(this.order.pay_time) + 86400);
        //     if (now != receive) {
        //         return '明日可领取'
        //     } else {
        //         return '今日可取'
        //     }
        // },

    },
    created () {
        this.getinfo();

    },
    methods: {
        onChange (i) {
            this.nowindex = i
        },
        ordersel (item, i) {
            // this.nowindex = i
            this.$refs.swipebox.swipeTo(i)
        },
        qrcode () {
            this.$nextTick(() => {

            })
        },
        getinfo () {
            this.$api.getOrder.get_mentionlist({}).then(res => {
                this.orderlist = res.result
                if (res.result && res.result.length > 0) {
                    this.order = res.result[0];
                    this.qrcode();
                    this.$nextTick(() => {
                        this.orderlist.forEach((item, i) => {
                            var id = 'qrcodeorder' + i;
                            var now = this.$fnc.getMonthAndDay(Date.parse(new Date()));
                            var receive = this.$fnc.getMonthAndDay(Number(item.pay_time) + 86400);
                            if (now != receive) {
                                this.$set(this.orderlist[i], 'receivetype', '今日可取')
                            } else {
                                this.$set(this.orderlist[i], 'receivetype', '明日可领取')
                            }
                            document.getElementById(id).innerHTML = ''
                            let qrcode = new QRCode(id, {
                                width: 100,
                                height: 100,
                                text: location.origin + "/order/mention/code?id=" + item.id, // 二维码地址
                                colorDark: "#000",    //前景色
                                colorLight: "#fff",   //背景色
                            })
                        })
                    })
                }
            })
        },
    },
    watch: {

    },
}
</script>
<style lang="less" scoped>
.mentionindex {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
    .mention_top_left {
        position: absolute;
        font-size: 28px;
        color: #ffffff;
        left: 15px;
        top: 15px;
        z-index: 999;
    }
    .mention_top {
        width: 100%;
        height: 510px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url("./../../../assets/img/order/mentiontop.jpg") no-repeat;
        background-size: 100% 100%;
        position: relative;

        .mention_box_no {
            justify-content: center !important;
            padding-bottom: 100px;
            > img {
                width: 60%;
            }
            p {
                font-size: 14px;
                color: #333;
                font-weight: bold;
            }
        }
        .mention_box {
            width: 285px;
            height: 390px;
            background-color: #ffffff;
            border-radius: 10px;
            display: flex;
            flex-flow: column;
            justify-content: flex-start;
            align-items: center;
            overflow: hidden;
            > div:nth-of-type(1) {
                width: 100%;
                height: 300px;
                display: flex;
                flex-flow: column;
                justify-content: center;
                align-items: center;
                line-height: 1;
                img {
                    width: 50%;
                }
                > p:nth-of-type(1) {
                    font-size: 18px;
                    color: #fc4502;
                    font-weight: bold;
                    margin-top: 20px;
                }
                > p:nth-of-type(2) {
                    font-size: 14px;
                    background-color: #fc4502;
                    color: #f4fefb;
                    border-radius: 25px;
                    padding: 10px 20px;
                    margin: 10px 0;
                }
                > p:nth-of-type(3) {
                    font-size: 13px;
                    color: #757575;
                }
                .ewm {
                    width: 100px;
                    height: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
            > div:nth-of-type(2) {
                width: 100%;
                flex: 1;
                background-color: #fdf1db;
                display: flex;
                flex-flow: column;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                color: #232222;
                > p:nth-of-type(2) {
                    width: 80%;
                    line-height: 16px;
                    text-align: center;
                    font-size: 13px;
                    color: #878173;
                }
            }
        }
    }
    .mention_shop {
        width: 100%;
        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 10px 18px;
        font-size: 14px;
        // padding-bottom: 50px;
        > p:nth-of-type(1) {
            width: 100%;
            font-size: 14px;
            color: #4b4c51;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            > span {
                width: 4px;
                height: 14px;
                border-radius: 20px;
                background-color: #8d42da;
                margin-right: 5px;
            }
        }
        .mention_shop_box {
            width: 100%;
            overflow-y: hidden;
            overflow-x: auto;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 10px;

            .mention_shop_box_over {
                width: auto;
                display: flex;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-items: flex-start;

                .mention_shop_item {
                    width: 80px;
                    display: flex;
                    flex-flow: column;
                    justify-content: flex-start;
                    align-items: center;
                    margin-right: 10px;

                    img {
                        width: 100%;
                        border-radius: 5px;
                    }
                    .orderactive {
                        width: 90%;
                        height: 5px;
                        background-color: #fdc594;
                        border-radius: 10px;
                        margin-top: 5px;
                    }
                }
            }
        }
    }
}
</style>