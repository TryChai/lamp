<template>
    <div class="goods">
        <van-nav-bar title="确认发货"
            left-text
            left-arrow
            class="navbar"
            :border="false"
            @click-left="toBackLeft" />
        <van-cell-group title="收货信息"
            class="c2">
            <van-cell title="收货人"
                :value="item.mail_name" />
            <van-cell title="联系电话"
                :value="item.mail_tel" />
            <van-cell title="收货地址"
                :value="$fnc.deleteNumber(item.mail_province+item.mail_city+item.mail_area+item.mail_town+item.mail_address)" />
        </van-cell-group>

        <van-cell-group title="订单信息"
            class="c2">
            <van-cell title="订单号"
                :value="item.oid" />
            <van-cell title="下单会员"
                :value="item.uid_nick+'('+item.uid_cn+')'" />
            <van-cell title="金额"
                :value="$fnc.toFixedZ(item.money)" />
            <van-cell title="备注"
                :value="item.remark" />
        </van-cell-group>

        <van-cell-group title="物流选择"
            class="c2">
            <van-radio-group v-model="item.mail_type"
                class="fx mail-xz">
                <van-radio name="0"
                    class="ra1">常规发货</van-radio>
                <van-radio name="1"
                    v-if="$store.state.config.plugin.kdlwnjk.is_open==1">快递鸟发货</van-radio>
            </van-radio-group>
        </van-cell-group>

        <van-cell-group title="物流信息"
            class="c2 good-cell"
            v-if="item.mail_type==0">
            <van-cell title="物流公司"
                @click="showPicker = true"
                :value="item.mail_courier" />
            <van-cell title="发货时间"
                :value="$fnc.getTimeFormat(item.mail_time)" />
            <van-cell class="cell"
                title="物流单号">
                <van-field @blur="windowScorll"
                    class="input_cells"
                    v-model="item.mail_oid"
                    placeholder="请输入物流单号"
                    input-align="right">
                </van-field>
            </van-cell>
        </van-cell-group>
        <van-cell-group title="物流信息"
            class="c2 good-cell"
            v-else>
            <van-cell title="快递鸟面单号"
                :value="item.kdn_order_code" />
            <van-cell title="发货时间"
                :value="$fnc.getTimeFormat(item.mail_time)" />
        </van-cell-group>
        <van-button type="primary"
            size="large"
            class="pay_order_btn "
            @click="subMail">提交</van-button>
        <van-popup v-model="showPicker"
            get-container="body"
            position="bottom">
            <van-picker show-toolbar
                value-key="title"
                :columns="company"
                @cancel="showPicker = false"
                @confirm="sel_picker" />
        </van-popup>
    </div>
</template>

<script>
import { Field, Picker } from "vant";
import { setTimeout } from 'timers';
export default {
    components: {
        [Field.name]: Field,
        [Picker.name]: Picker,
    },
    props: {
        item: {
            type: Object,
            default: () => { }
        }
    },
    data () {
        return {
            showPicker: false,
            company: [],
            mail: ""
        }
    },
    created () {
        this.get_mail_company();
    },
    methods: {
        sel_picker (item) {
            this.item.mail_courier = item.title;
            this.item.mail_courier_en = item.title_en;
            this.showPicker = false
        },
        get_mail_company () {

            this.$api.getSupplier.get_mail_company({}).then(res => {
                if (res.code == 200) {
                    this.company = res.result;
                    if (this.company != undefined && this.company.length > 0) {
                        this.item.mail_courier = this.company[0].title;
                        this.item.mail_courier_en = this.company[0].title_en;
                    }
                }
            })
        },
        toBackLeft () {
            this.$emit('opThis')
        },
        subMail () {
            var that = this;
            if (that.$store.state.config.plugin.kdlwnjk.is_open == 0 && that.item.mail_type == 1) {
                that.$toast.fail('请选择发货方式');
                return false;
            } else if (that.item.mail_oid == '' && that.item.mail_type == 0) {
                that.$toast.fail('请填写物流单号');
                return false;
            }
            this.$dialog.confirm({
                message: "是否确认发货？"
            }).then(() => {
                var params = {};
                params.id = that.item.id;
                params.mail_courier = that.item.mail_courier;
                params.mail_courier_en = that.item.mail_courier_en;
                params.mail_type = that.item.mail_type;
                params.mail_oid = that.item.mail_oid;

                that.$api.getSupplier.sendMail(params).then(res => {
                    if (res.code == 200) {
                        that.$toast.success('发货成功');
                        setTimeout(() => {
                            that.$emit('opThis', true)
                        }, 1500)
                    }
                })
            })

            // this.$emit('opThis',true)
        }
    }
}
</script>



<style lang="less" scoped>
.mail-xz {
    justify-content: center;
    padding: 10px 0;
    font-size: 16px;
    .ra1 {
        margin-right: 10px;
    }
}
.pay_order_btn {
    background: linear-gradient(to right top, #ff0204, #ff2f60);
    border: none !important;
    // position: absolute;
    width: 100%;
    bottom: 0;
    margin-top: 20px;
}
.goods {
    background: #f8f8f8;
    height: 100%;
    overflow: auto;
}
.cell {
    align-items: center;
    color: #323232;
    .van-cell__value {
        justify-content: flex-end;
    }
    .input_cells {
        padding: 0 0rem;
    }
    .custom_right {
        transform: rotateZ(90deg);
    }
    .ren {
        color: #4d4d4d;
        padding-left: 6px;
        i {
            vertical-align: middle;
        }
    }
    .red_cell {
        color: #ff4b32;
    }
    .piclink {
        display: inline-block;
        width: 80px;
        height: 80px;
        vertical-align: bottom;
        position: relative;
        .close {
            position: absolute;
            top: 0;
            right: 0;
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            background: red;
            color: #fff;
        }
        > img {
            width: 80px;
            height: 80px;
        }
    }
    .piclink + div {
        display: inline-block;
    }
}
</style>
