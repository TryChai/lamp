<template>
    <div class="order_list_con">
        <van-nav-bar title="预售订单"
            left-text=""
            left-arrow
            class="navbar"
            :border="false"
            @click-left="toBack">
        </van-nav-bar>

        <div>
            <van-tabs v-model="sel_order"
                @click="nav_btn">
                <van-tab title="全部订单"></van-tab>
                <van-tab title="已付定金"></van-tab>
                <van-tab title="已完成"></van-tab>
            </van-tabs>
            <div style="margin-bottom:15px"></div>
            <div>
                <orderItem v-for="(item,i) in list"
                    :key="i"
                    :item='item'
                    @openThis='getopenThis' />
                <div class="orderNoticeBar_foot tc">已经是最后一个订单了</div>
            </div>
        </div>
    </div>
</template>


<script>
import orderItem from '@/components/currency/order/orderList/orderItem.vue'
import { Tab, Tabs } from 'vant';
export default {
    data () {
        return {
            sel_order: '',
            value: '',
            list: []
        }
    },
    components: {
        orderItem,
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
    },
    created () {
        this.getOrderList();
    },
    methods: {
        getopenThis () {

        },
        nav_btn (item, title) {
            switch (true) {
                case title == '全部订单':
                    this.getOrderList()
                    break;
                case title == '已付定金':
                    this.getOrderList('已付定金')
                    break;
                case title == '已完成':
                    this.getOrderList('已支付')
                    break;
                default:
                    break;
            }
        },
        onSearch (e) {
            this.getOrderList(e);
        },

        getOrderList (title) {
            var params = {};
            params.status = title || '';
            this.$api.getOrder.get_presale_order(params).then(res => {
                if (res.code == 200) {
                    this.list = res.result
                }
            })
        }
    }
}
</script>


<style lang="less" scoped>
.orderNoticeBar_foot {
    height: 80px;
    line-height: 80px;
    color: #cccccc;
    font-size: 14px;
}
.srarc_order {
    .van-search__content {
        height: 36px;
    }
    .van-cell {
        align-items: center;
        padding: 0;
    }
    .van-search__content {
        background: #fff;
    }
}
.orderNoticeBar {
    line-height: 1;
    background: #e8eaf6;
    padding: 10px 16px;
    font-size: 14px;
    > div {
        i {
            vertical-align: bottom;
        }
        .orderNoticeBar_s1 {
            color: #05a9fe;
            margin-left: 9px;
        }
    }
}
.order_list_con {
    background: #f3f3f3;
    overflow: auto;
}
</style>
