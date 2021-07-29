<template>

    <div class="container life">
        <van-nav-bar title="充值中心"
            left-text
            left-arrow
            class="navbar"
            @click-left="$router.go(-1)">
            <p slot="right">
                <router-link :to="{path: '/pay/life/record'}">充值记录</router-link>
            </p>
        </van-nav-bar>
        <div class="life_box">
            <div class="life_top">
                <p>{{types_info}}</p>
                <div class="life_top_info">
                    <input  type="text"
                        v-model="input_tel"
                        @blur.prevent="change_tel()"
                        maxlength="15"
                        :placeholder="types ==3 ?'请输入油卡号':'请输入手机号'">
                    <!-- <p>qingshuru</p> -->
                    <van-icon name="manager-o"
                        size="26px"
                        color="#fff"></van-icon>
                </div>
            </div>
            <div class="life_charge">
                <p v-if="types == 2 && input_tel =='' ">
                    <van-icon name="gold-coin"
                        color="#0f71c3"
                        size="16px"
                        style="line-height:16px;padding:0 5px 0 20px"></van-icon>
                    请输入手机号获取流量充值面额
                </p>
                <p v-else>
                    <van-icon name="gold-coin"
                        color="#0f71c3"
                        size="16px"
                        style="line-height:16px;padding:0 5px 0 20px"></van-icon>
                    请选择{{types_info}}面额
                </p>
                <!-- 话费充值 -->
                <div class="life_charge_box"
                    v-if="this.$route.query.action == 1">
                    <div class="life_charge_box_item_out"
                        v-for="(item,i) in pay_list1"
                        :key="i">
                        <div class="life_charge_box_item"
                            @click="active_btn(item)">
                            <p>{{item.inprice}}</p>
                            <p>{{item.money}}<span>元</span></p>
                        </div>
                    </div>
                </div>
                <!-- 流量充值 -->
                <div class="life_charge_box"
                    v-else-if="this.$route.query.action == 2">
                    <div class="life_charge_box_item_out"
                        v-for="(item,i) in pay_list2"
                        :key="i">
                        <div class="life_charge_box_item"
                            @click="active_btn(item)">
                            <p>{{item.p}}</p>
                            <p>{{item.money}}<span>元</span></p>
                        </div>
                    </div>
                </div>
                <!-- 油卡充值 -->
                <div class="life_charge_box"
                    v-else-if="this.$route.query.action == 3">
                    <div class="life_charge_box_item_out"
                        v-for="(item,i) in pay_list3"
                        :key="i">
                        <div class="life_charge_box_item"
                            @click="active_btn(item)">
                            <p>{{item.inprice}}</p>
                            <p>{{item.money}}<span>元</span></p>
                        </div>
                    </div>
                </div>
                <div class="life_charge_box"
                    v-else>
                    <div class="life_charge_box_item_out"
                        v-for="(item,i) in pay_list1"
                        :key="i">
                        <div class="life_charge_box_item"
                            @click="active_btn(item)">
                            <p>{{item.inprice}}</p>
                            <p>{{item.money}}<span>元</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <p v-if="help">
                <van-icon name="info"
                    color="#118eea"></van-icon>
                {{help}}
            </p>
            <div class="life_pay">
                <p>请选择便民服务</p>
                <div class="life_pay_box">
                    <div class="life_pay_box_item"
                        @click="sub_btn(1)">
                        <div class="life_pay_box_item_img">
                            <img src="./../../../assets/img/pay/life_pay_1.png"
                                alt="">
                        </div>
                        <p>话费</p>
                    </div>
                    <div class="life_pay_box_item"
                        @click="sub_btn(2)">
                        <div class="life_pay_box_item_img">
                            <img src="./../../../assets/img/pay/life_pay_2.png"
                                alt="">
                        </div>
                        <p>流量</p>
                    </div>
                    <div class="life_pay_box_item"
                        @click="sub_btn(3)">
                        <div class="life_pay_box_item_img">
                            <img src="./../../../assets/img/pay/life_pay_3.png"
                                alt="">
                        </div>
                        <p>油卡</p>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>
<script>

import { setTimeout } from 'timers';
export default {
    name: "life_recharge",
    data () {
        return {
            help:'',
            sel_much: 0,
            types_info: "",
            types: this.$route.query.action || "1",
            money: 0,
            game_money: 0,
            card_id: 0,
            life_form: {
                types: "",
                money: null,
            },
            life_form1: {
                tel: "",
                money: "",
            },
            life_form2: {
                tel: "",
                game_money: "",
            },
            life_form3: {
                tel: "",
                card_id: "",
                money: "",
                game_money: "",
            },
            pay_list1: [],
            pay_list2: [],
            pay_list3: [],
            input_tel: "",
        };
    },
    components: {

    },
    created () {

        if (this.types == 1) {
            this.types_info = "话费充值"
            this.life_form1.types = "话费"
            this.get_paylist();
        } else if (this.types == 2) {
            this.types_info = "流量充值"
            this.life_form2.types = "流量"
            // this.dia_show = true;

        } else if (this.types == 3) {
            this.types_info = "油卡充值"
            this.life_form3.types = "油卡"
            this.get_paylist();
        }



    },

    methods: {
        change_tel () {
            if (this.types == 2) {
                if ((/^1[3456789]\d{9}$/.test(this.input_tel))) {
                    this.get_paylist();
                } else {
                    this.$toast.fail("请输入正确手机号")
                }
            }
            window.scroll(0, 0);

        },

        get_aicq () {
            this.$api.getPay.aicq_coin({}).then(res => {
                if (res.code == 200) {
                    this.aicq = res.result;
                    this.money1 = 30 / this.aicq;
                    this.money2 = 50 / this.aicq;
                }
            })
        },
        sub_btn (val) {
            if (this.type != val) {
                this.$router.push({ path: "/pay/life", query: { action: val } })
            } else {
                return
            }

        },
        active_btn (item) {
            if (this.input_tel == "") {
                this.$toast.fail(`请输入${this.types == 3 ? "油卡" : "手机"}号`)
                return
            }
            let param = {};
            if (this.types == 1) {
                param.types = this.life_form1.types;
                param.tel = this.input_tel;
                param.money = item.money;
                param.game_money = item.inprice;
            } else if (this.types == 2) {
                param.types = this.life_form2.types;
                param.tel = this.input_tel;
                param.money = item.money;
                param.game_money = item.v;
                param.card_id = item.id;
            } else if (this.types == 3) {
                param.types = this.life_form3.types;
                param.tel = this.input_tel;
                param.money = item.money;
                param.game_money = item.inprice;
                param.card_id = item.card_id;
            } else {
                this.$toast.fail("请选择缴费类型")
            }

            this.$dialog
                .confirm({
                    title: this.types_info,
                    message: "确定缴费" + param.money + "吗？"
                })
                .then(() => {
                    this.$api.getPay.get_lifeorder(param).then(res => {     //缴费
                        if (res.code == 200) {
                            this.$toast.fail("提交订单成功", 1000)
                            setTimeout(() => {
                                this.$router.push({ path: '/pay/life/defray', query: { id: res.result } })
                            }, 1000);
                        }
                    })
                }).catch(() => {
                })
        },
        get_paylist () {
            let param = {};
            if (this.types == 1) {
                param.types = this.life_form1.types
            } else if (this.types == 2) {
                param.types = this.life_form2.types;
                param.tel = this.life_form2.tel

            } else if (this.types == 3) {
                param.types = this.life_form3.types;
            } else {
                this.$toast.fail("请选择缴费类型")
            }
            this.$api.getPay.get_liferecharge(param).then(res => {
                if (res.code == 200) {
                    this.help=res.result.help;
                    switch (true) {
                        case this.types == 1:
                            this.pay_list1 = res.result.ar;
                            break;
                        case this.types == 2:
                            this.pay_list2 = res.result.ar;
                            break;
                        case this.types == 3:
                            this.pay_list3 = res.result.ar;
                            break;
                        default:
                            break;
                    }
                } else {
                    if (this.types == 2) {
                        this.$toast.fail(res.result)
                        setTimeout(() => {
                            this.dia_show = true;
                            this.life_form2.tel = "";

                        }, 1000);
                    } else {
                        this.$toast.fail(res.result)
                    }

                }
            })
        }
    },
    watch: {
        input_tel (old, after) {
            switch (true) {
                case this.types == 1:
                    this.life_form1.tel = old;
                    break;
                case this.types == 2:
                    this.life_form2.tel = old;
                    break;
                case this.types == 3:
                    this.life_form3.tel = old;
                    break;
                default:
                    break;
            }

        }
    }
}
</script>
<style  scoped>
.life {
    height: 100%;
    background-color: #f8f8f8;
}
.life_box {
    width: 100%;
}
.life_top {
    width: 100%;
    height: 150px;
    background-color: #0d82df;
    padding: 0 24px;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: flex-start;
}
.life_top > p {
    font-size: 14px;
    font-weight: bold;
    color: #86bbe5;
    padding-top: 25px;
}
.life_top_info {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #66b0fd;
}
.life_top_info > input {
    font-size: 24px;
    color: #ffffff;
    height: 40px;
}
.life_top_info > input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #ffffff;
}
.life_top_info > input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #ffffff;
}
.life_top_info > input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #ffffff;
}
.life_top_info > input::-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #ffffff;
}
.life_top_info > p {
    font-size: 24px;
    color: #ffffff;
}
.life_charge {
    width: 88%;
    border-radius: 10px;
    margin: -35px auto 0 auto;
    background-color: #ffffff;
}
.life_charge > p {
    width: 100%;
    font-size: 14px;
    color: #111111;
    display: flex;
    align-items: center;
    line-height: 40px;
}
.life_charge_box {
    width: 100%;
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
}
.life_charge_box_item_out {
    width: 33.3%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.life_charge_box_item_active {
    width: 92%;
    border: 1px solid #ffffff;
    background-color: #0f8fea;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 12px 0;
}
.life_charge_box_item_active > p:nth-of-type(1) {
    font-size: 24px;
    color: #ffffff;
    font-weight: bold;
    line-height: 28px;
}
.life_charge_box_item_active > p:nth-of-type(1) span {
    font-size: 14px;
    color: #ffffff;
}
.life_charge_box_item_active > p:nth-of-type(2) {
    font-size: 12px;
    color: #ffffff;
    line-height: 12px;
}

.life_charge_box_item {
    width: 92%;
    border: 1px solid #118eea;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 12px 0;
}
.life_charge_box_item > p:nth-of-type(1) {
    font-size: 24px;
    color: #0f8fea;
    font-weight: bold;
    line-height: 28px;
}
.life_charge_box_item > p:nth-of-type(1) span {
    font-size: 14px;
    color: #0f8fea;
}
.life_charge_box_item > p:nth-of-type(2) {
    font-size: 12px;
    color: #118eea;
    line-height: 12px;
}
.life_box > p {
    width: 88%;
    margin: 0 auto;
    font-size: 12px;
    color: #118eea;
    text-align: justify;
    padding: 10px 0;
}
.life_pay {
    width: 88%;
    margin: 0 auto;
    font-size: 14px;
    color: #000000;
    line-height: 40px;
    padding-bottom: 20px;
}
.life_pay_box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    background-color: #ffffff;
    border-radius: 5px;
}
.life_pay_box_item {
    width: 25%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 10px;
}
.life_pay_box_item_img {
    width: 40%;
}
.life_pay_box_item_img img {
    width: 100%;
}
.life_pay_box_item p {
    font-size: 12px;
    color: #000000;
    line-height: 24px;
    text-align: center;
}
.input_tel {
    width: 80%;
    margin: 0 auto;
}
</style>