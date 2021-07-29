<template>
    <div class="auction_order_item">
        <div class="fx order_item_head"
            @click="went_orderdetail(item)">
            <div>
                <h4>{{ item.is_pay == 0 ? "未支付" : item.sid_cn }}</h4>
                <span class="order_item_head_s1">订单编号：{{ item.oid }}</span>
            </div>
            <span class="order_item_head_s2"
                v-if="item.status == '0'">参拍中</span>
            <span class="order_item_head_s2"
                v-else-if="item.status == '1'">已流拍</span>
            <span class="order_item_head_s2"
                v-else-if="item.status == '2'">未获拍</span>

        </div>
        <div class="order_item_body"
            @click="$router.push('/shop/shopdetails?id=' + item.pid)">
            <div class="order_item_body_img">
                <img :src="$fnc.getImgUrl(item.piclink)"
                    alt="">
            </div>
            <div class="order_item_body_content">
                <p>{{item.title}}</p>
                <p>起拍价：{{$fnc.toFixedZ(item.starting_price)}}</p>
                <p>出价：{{$fnc.toFixedZ(item.rear_price)}}</p>
            </div>
        </div>
        <div class="order_item_bottom">

        </div>
    </div>
</template>
<script>
export default {
    name: "auction_order_item",
    data () {
        return {
        };
    },
    props: {
        item: {
            type: Object,
            default: () => { }
        },

    },
    components: {
    },
    methods: {

    },
}
</script>
<style lang="less" scoped>
.auction_order_item {
    padding: 0 16px;
    line-height: 1;
    font-size: 14px;
    margin-bottom: 14px;
    background-color: #fff;
    .order_item_head {
        overflow: hidden;
        border-bottom: 1px solid #f5f3f3;
        h4 {
            padding: 12px 0 6px;
            font-size: 15px;
        }
        span {
            color: #999999;
        }
        .order_item_head_s1 {
            font-size: 12px;
            display: block;
            padding-bottom: 10px;
        }
        .order_item_head_s2 {
            font-size: 16px;
            // font-weight: bold;
        }
    }
    .order_item_body {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        padding: 10px 0;
        border-bottom: 0.02667rem dashed #e8e9eb;
        .order_item_body_img {
            width: 80px;
            height: 80px;
            margin-right: 15px;
            img {
                width: 100%;
            }
        }
        .order_item_body_content {
            flex: 1;
            height: 80px;
            display: flex;
            flex-flow: column;
            justify-content: flex-start;
            align-items: flex-start;

            > p:nth-of-type(1) {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                //隐藏行数
                -webkit-line-clamp: 2;
                overflow: hidden;
                margin-bottom: 15px;
                height: 32px;
            }
            > p:nth-of-type(2),
            > p:nth-of-type(3) {
                line-height: 20px;
            }
        }
    }
    .order_item_bottom {
        width: 100%;
        height: 10px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>