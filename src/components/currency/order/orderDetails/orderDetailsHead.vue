<template>
    <div class="order_details_head fx">
        <div class="order_details_head_con">
            <van-steps :active="active">
                <van-step>{{s1}}</van-step>
                <van-step>{{s2}}</van-step>
                <van-step>{{s3}}</van-step>
            </van-steps>
        </div>
    </div>
</template>

<script>
import { Step, Steps } from "vant";
export default {
    components: {
        [Step.name]: Step,
        [Steps.name]: Steps
    },
    props: {
        info: {
            type: Object,

        },
        status: {
            type: String,
            default: ""
        },
        is_return: [String, Number]
    },
    data () {
        return {
            active: 1,
            s1: "",
            s2: "",
            s3: ""
        };
    },
    watch: {
        status (str) {
            this.getStatus(str)
        }
    },
    created () {
        var str = this.status;
        this.getStatus(str)
    },
    methods: {
        getStatus (str) {
            if (str) {
                 if(str=='待领单'){
                    this.s1 = '未接单';
                    this.s2 = "配送中";
                    this.s3 = "已完成";
                    this.active = 0;
                }else if(str=='配送中'){
                    this.s1 = '未接单';
                    this.s2 = "配送中";
                    this.s3 = "已完成";
                    this.active = 1;
                }else if(str=='已完成' && this.info.rider_code){
                    this.s1 = '未接单';
                    this.s2 = "配送中";
                    this.s3 = "已完成";
                    this.active = 2;
                }else if (this.is_return == 1) {
                    this.s1 = "已下单";
                    this.s2 = "退货中";
                    this.s3 = "未完成";
                    this.active = 1;
                } else if (str == "已支付" && this.info.types == 14) {
                    this.s1 = "已预约";
                    this.s2 = "未服务";
                    this.s3 = "未完成";
                    this.active = 0;
                } else if (
                    str == "未支付" ||
                    str == "已支付" ||
                    str == "配货中" ||
                    str == "已关闭"
                ) {
                    this.s1 = str;
                    this.s2 = "未发货";
                    this.s3 = "未完成";
                    this.active = 0;
                } else if (str == "用户自提") {
                    this.s1 = "已下单";
                    this.s2 = str;
                    this.s3 = "已完成";
                    this.active = 1;
                } else if (str == "已发货" && this.info.types == 9) {
                    this.s1 = "已下单";
                    this.s2 = "待出行";
                    this.s3 = "未完成";
                    this.active = 1;
                } else if (str == "已发货" && this.info.types == 14) {
                    this.s1 = "已预约";
                    this.s2 = "已服务";
                    this.s3 = "未完成";
                    this.active = 1;
                } else if (str == "已发货" && this.info.types == 13) {
                    this.s1 = "已下单";
                    this.s2 = "已预约";
                    this.s3 = "未完成";
                    this.active = 1;
                } else if (str == "已发货") {
                    this.s1 = "已下单";
                    this.s2 = str;
                    this.s3 = "未完成";
                    this.active = 1;
                } else if (str == "已完成" && (this.info.types == 10 || this.info.types == 11)) {
                    this.s1 = "已下单";
                    this.s2 = '待核销';
                    this.s3 = '已完成';
                    this.active = this.info.write_complete_number == 0 ? 1:2;
                } else if ((str == "已完成" || str == "已退单") && this.info.types == 9) {
                    this.s1 = "已下单";
                    this.s2 = str == '已完成' ? '已出行' : '待出行';
                    this.s3 = str == '已完成' ? '已完成' : '已退单';
                    this.active = 2;
                } else if ((str == "已完成" || str == "已退单") && this.info.types == 14) {
                    this.s1 = "已预约";
                    this.s2 = str == '已完成' ? '已服务' : '待服务';
                    this.s3 = str == '已完成' ? '已完成' : '已退单';
                    this.active = 2;
                } else if (str == "已完成" && this.info.types == 13) {
                    this.s1 = "已下单";
                    this.s2 = '已预约';
                    this.s3 = '已完成';
                    this.active = 2;
                } else if (str == "已完成" || str == "已退单") {
                    this.s1 = "已下单";
                    this.s2 = "已发货";
                    this.s3 = str;
                    this.active = 2;
                } else if (str == "已付定金") {
                    this.s1 = str;
                    this.s2 = "未支付";
                    this.s3 = "已支付";
                    this.active = 0;
                }
            }
        }
    }
};
</script>


<style lang="less" scoped>
.order_details_head {
    line-height: 1;
    font-size: 14px;
    background: #f3f3f3;
    height: 110px;
    .order_details_head_con {
        width: 100%;
    }
}
</style>
