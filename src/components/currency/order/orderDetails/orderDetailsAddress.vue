<template>
    <div class="order_details_address">
        <p class="oda_p1"
            v-if="info.is_lifting==0">收货地址</p>
        <div class="fx oda_p11"
            v-if="info.is_lifting==0">
            <p>{{info.mail_name}}</p>
            <p>{{info.mail_tel}}</p>
        </div>
        <div class="oda_d1"
            v-if="info.is_lifting==0"
            :class="{oda_d1_bor:info.mail}">
            <p class="oda_p2">
                {{(info.mail_province+info.mail_city+info.mail_area+info.mail_town+info.mail_address)}}
                <i name
                    class="fa fa-send"
                    @click="toDh"
                    v-if="info.mail_latitude>0 || info.mail_longitude>0"
                    style="color:#999999;font-size:18px" /></p>
        </div>
        <div class="rider-box"
            style="padding:0"
            v-if="info.status=='配送中'&& $route.query.rider==1">
            <p class="oda_p1"
                v-if="info.is_lifting==0">取货点</p>
            <div class="fx oda_p11"
                v-if="info.is_lifting==0">
                <p>{{info.shop.kdn_sender_name}}</p>
                <p>{{info.shop.kdn_sender_mobile}}</p>
            </div>
            <div class="oda_d1"
                v-if="info.is_lifting==0"
                :class="{oda_d1_bor:info.mail}">
                <p class="oda_p2">{{kdnAddress}}</p>
            </div>
        </div>
        <div class="oda_d2 rider-box"
            v-if="info.status=='已完成'|| (info.rider_code && $route.query.rider!=1)">
            <div class="fx">
                <p class="rider_code">{{info.status!='已完成'?'核销码':'核销状态'}}</p>
                <p class="rider_code">
                    <span v-if="info.status!='已完成'">{{info.rider_code}}</span>
                    <span v-else-if="info.write_complete_number == info.write_number"
                        style="color:#b6b6b6">已核销</span>
                    <span v-else
                        style="color:#b6b6b6">未核销</span>
                </p>
            </div>
            <div class="fx rider_uid"
                v-if="info.rider_uid>0">
                <img v-lazy='info.rider_uid_avatar'
                    alt="">
                <div>
                    <p><span>配送员：</span>{{info.rider_uid_nick.length>=10?info.rider_uid_nick.slice(0,10) :info.rider_uid_nick}}({{info.rider_uid_cn}})
                    </p>
                    <p @click="toTel"><span>电话：</span>{{info.rider_uid_tel || 'xxx'}}</p>
                    <p><span>完成时间：</span>{{info.status=='已完成'?$fnc.getTimeFormat(info.update_time) :'正在配送中'}}
                    </p>
                </div>
            </div>
        </div>
        <div class="oda_d2 rider-box"
            v-else-if='info.rider_code&& $route.query.rider==1'>
            <div class="tc rider-box-qs">
                <p>请向消费者索取核销码以便于核实订单</p>
                <div>
                    <van-field v-model="value"
                        input-align="center"
                        placeholder="请输入核销码" />
                </div>
                <van-button color="#e8380d"
                    type="danger"
                    @click="confirmReceive">确认</van-button>
            </div>
        </div>
        <p class="oda_p1 oda_p3"
            v-if="info.mail && info.is_lifting==0">物流信息</p>
        <div class="oda_d2"
            v-if="info.is_lifting==0&& info.mail">
            <van-icon name="arrow"
                class="oda_d2_i" />
            <div class="fx ode_sets"
                @click="$router.push('/order/maildetails?id='+info.id)"></div>
        </div>
        <div class="oda_d2"
            v-if="info.is_lifting==0 &&info.mail_oid && info.mail_oid !='' "
            @click="$router.push('/order/maildetails?id='+info.id)">
            <div class="fx ode_sets">
                <div style="height:38px"
                    v-if="info.mail_oid && info.mail_oid !='' ">
                    <p>物流公司：{{info.mail_courier}}</p>
                    <p>物流编号：{{info.mail_oid}}</p>
                </div>
            </div>
        </div>
        <!-- <div v-else-if="info.is_lifting==1">
      <p class="oda_p1">自提地址</p>
      <liftingTtem :item="info.lifting" class="ordr-details-lifting" :active="true" />
    </div> -->
    </div>
</template>

<script>
import { Divider, Field } from "vant";
import liftingTtem from "../addOrder/lifting-item/lifting-item";
export default {
    components: {
        liftingTtem,
        [Divider.name]: Divider,
        [Field.name]: Field
    },
    props: {
        info: {
            type: Object,
            default: () => { }
        }
    },
    data () {
        return {
            activeNames: ["1"],
            show: false,
            value: "",
            isApp: false
        };
    },
    computed: {
        kdnAddress () {
            if (this.info.shop) {
                if (this.info.shop.kdn_sender_province) {
                    return this.info.shop.kdn_sender_province + this.info.shop.kdn_sender_city + this.info.shop.kdn_sender_area + this.info.shop.kdn_sender_address
                } else {
                    return '未设置取货地点'
                }

            } else {
                return '未设置取货地点'
            }
        },
    },
    methods: {
        toTel () {
            if (this.info.rider_uid_tel) {
                this.$fnc.tel(this.info.rider_uid_tel)
            } else {
                this.$toast('暂无电话')
            }
        },
        confirmReceive () {
            var that = this;
            that.$dialog.confirm({
                title: '提示',
                message: "是否确认订单？"
            }).then(() => {
                that.$api.getRider.confirmReceive({ id: that.info.id, rider_code: that.value }).then(res => {
                    if (res.code == 200) {
                        this.$toast(res.result);
                        setTimeout(() => {
                            this.$emit('sendRider')
                        }, 1500)
                    }
                })
            }).catch(() => { })
        },
        toDh () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/ykapp/i) == "ykapp") {
                this.isApp = true; //第二个app
            }
            var that = this;
            if (that.isApp) {
                try {
                    that.$fnc.appNav(that.info.mail_latitude, that.info.mail_longitude);
                } catch (error) {
                    that.$toast.fail("App地图跳转失败");
                }
            } else if (that.$fnc.isWx()) {
                var obj = {};
                obj.latitude = parseFloat(that.info.mail_latitude);
                obj.longitude = parseFloat(that.info.mail_longitude);
                obj.name = that.info.sid_cn;
                obj.address =
                    that.info.mail_province +
                    that.info.mail_city +
                    that.info.mail_area +
                    that.info.mail_town +
                    that.info.mail_address;
                obj.scale = 14;
                obj.infoUrl =
                    location.origin + "/supplier/supplierdetails?id=" + that.info.sid;

                this.wxApi.ToLocation(obj);
            } else {
                this.$toast('请在微信或者app打开')
            }
        },
        togSets () {
            this.show = !this.show;
        }
    }
};
</script>


<style lang="less" scoped>
.rider-box {
    padding-top: 20px;
    border-top: 1px dashed #e3e4e6;
    .rider_code {
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        line-height: 1.2;
    }
    img {
        width: 54px;
        border-radius: 50%;
        height: 54px;
        margin-right: 10px;
    }
    .rider_uid {
        padding-top: 20px;
        border-top: 1px solid #f2f2f2;
        font-size: 15px;
        line-height: 1.6;
        margin-top: 17px;
        span {
            color: #b9b9b9;
            display: inline-block;
            // width: 85px;
            text-align: right;
        }
        p {
            color: #363636;
            font-weight: 400;
            text-align: left;
            min-width: 150px;
            > span {
                width: 75px;
            }
        }
    }
    .rider-box-qs {
        color: #b5b5b6;
        > div {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 13px 0;

            > div {
                width: 180px;
                border-radius: 5px;
                padding: 0;
                height: 38px;
                border: 1px solid #d3d4d4;
                margin-right: 20px;
            }
        }
        button {
            height: 27px;
            line-height: 27px;
            width: 98px;
            text-align: center;
            border-radius: 5px;
            margin-bottom: 10px;
        }
    }
}
.oda_d2 {
    padding-bottom: 12px;
    position: relative;
    z-index: 1;
    .oda_d2_i {
        position: absolute;
        right: -5px;
        top: 31px;
        z-index: 3;
        transition: all 0.3s linear;
    }
}
.ode_sets {
    justify-content: flex-start;
    > div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 58px;
    }
    > img {
        width: 15px;
        height: 57px;
        margin-right: 10px;
    }
    h3 {
        font-size: 14px;
        padding-top: 5px;
        color: #333333 !important;
    }
    .add_time {
        color: #999999;
    }
}
.order_details_address {
    padding: 0 16px;
    line-height: 1;
    font-size: 14px;
    background: #fff;
    color: #333333;
    // font-weight: bold;
    margin-bottom: 15px;
    border-bottom: 1px solid #eae5e5;
    p.oda_p1 {
        font-weight: bold;
        padding-top: 20px;
        font-size: 15px;
    }
    .oda_p11 {
        font-size: 16px;
        padding-top: 20px;
        padding-bottom: 12px;
    }
    .oda_p2 {
        padding-bottom: 10px;
    }
    div.oda_d1 {
        padding-bottom: 15px;
    }
    .oda_d1_bor {
        border-bottom: 1px solid #cccccc;
    }
    .oda_p3 {
        padding-bottom: 15px;
    }
}
i.ac_setps {
    transform: rotateZ(90deg);
}
</style>
