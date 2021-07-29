<template>
    <div class="container life_record">
        <mescroll-vue ref="mescroll"
            :down="mescrollDown"
            :up="mescrollUp"
            @init="mescrollInit"
            class="life"
            id="life">
            <van-nav-bar title="充值缴费账单"
                left-text
                left-arrow
                class="navbar"
                @click-left="$router.go(-1)">
            </van-nav-bar>
            <div class="record_body">
                <div class="record_top">
                    <!-- <span><span>支出:￥888.00</span><span>收入:￥999.00</span></p> -->
                </div>
                <div class="record_box">
                    <div class="record_box_item"
                        v-for="(item,i) in dataList"
                        :key="i">
                        <div class="record_box_item_left">
                            <div class="record_box_item_left_icon">
                                <img :src="$fnc.getImgUrl(item.avatar)"
                                    alt="">
                            </div>
                        </div>
                        <div class="record_box_item_middle">
                            <p>类型:{{item.types}}充值</p>
                            <p> 订单号：{{item.oid}}
                            </p>

                            <p>{{$fnc.getTimeFormat(item.created_time)}}</p>
                        </div>
                        <div class="record_box_item_right">
                            <p>-{{$fnc.toFixedZ(item.money,2)}}</p>
                            <p v-if="item.is_pay == 0">未支付</p>
                            <p v-if="item.is_pay == 1">已支付</p>

                        </div>

                    </div>

                </div>
            </div>
        </mescroll-vue>
    </div>

</template>
<script>
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
    name: "life_record",
    data () {
        return {
            dataList: [],
            mescroll: null, // mescroll实例对象
            mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
            mescrollUp: {
                loadFull: {},
                // 上拉加载的配置.
                callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                //以下是一些常用的配置,当然不写也可以的.
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 10 //每页数据条数,默认10
                },
                htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
                noMoreSize: 0, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
                toTop: {
                    //回到顶部按钮
                    warpId: "life",
                    src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
                    offset: 1000 //列表滚动500px才显示回到顶部按钮
                },
                empty: {
                    //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                    warpId: "life", //父布局的id (1.3.5版本支持传入dom元素)
                    icon: require("@/assets/img/empty.png"),//图标,默认null,支持网络图
                    tip: "暂无相关数据~" //提示
                },
            },
        };
    },
    components: {
        MescrollVue
    },
    created () {

    },
    beforeRouteEnter (to, from, next) {
        // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
        next(vm => {
            // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
            vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
        });
    },
    beforeRouteLeave (to, from, next) {
        // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
        this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
        next();
    },
    methods: {
        mescrollInit (mescroll) {
            this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        },
        upCallback (page, mescroll) {
            this.$api.getPay
                .get_liferecord({ page: page.num, })
                .then(res => {

                    if (res.code == 200) {
                        let arr = res.result;
                        // 如果是第一页需手动置空列表
                        if (page.num == 1) this.dataList = [];
                        // 把请求到的数据添加到列表
                        this.dataList = this.dataList.concat(arr);

                        // 数据渲染成功后,隐藏下拉刷新的状态
                        this.$nextTick(() => {
                            mescroll.endSuccess(arr.length);
                        });
                    } else {
                        mescroll.endErr();
                    }
                });
        },

    },
}
</script>
<style scoped>
.life_record {
    height: 100%;
    background-color: #f5f5f5;
}
.record_body {
    width: 100%；;
}
.record_top {
    width: 100%;
}
.record_top > p {
    width: 100%;
    text-align: right;
    line-height: 20px;
}
.record_top > p > span {
    font-size: 14px;
    color: #999999;
    line-height: 14px;
    padding-left: 10px;
    padding-right: 5px;
}
.record_box {
    width: 100%;
    background-color: #fefefe;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    margin: 10px 0;
}
.record_box_item {
    width: 92%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid #eeeeee;
}
.record_box_item_left {
    width: 10%;
    margin-top: 10px;
}
.record_box_item_left_icon {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #499e94;
    display: flex;
    justify-content: center;
    align-items: center;
}
.record_box_item_left_icon img {
    width: 100%;
}
.record_box_item_middle {
    width: 65%;
    padding-left: 20px;
}
.record_box_item_middle > p:nth-of-type(1) {
    font-size: 12px;
    color: #000000;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.record_box_item_middle > p:nth-of-type(2) {
    font-size: 12px;
    color: #000000;
    line-height: 20px;
}
.record_box_item_middle > p:nth-of-type(3) {
    font-size: 12px;
    color: #999999;
    line-height: 18px;
}
.record_box_item_middle > p:nth-of-type(3) span {
    font-size: 10px;
    color: #999999;
    line-height: 18px;
    padding-left: 10px;
}
.record_box_item_right {
    width: 25%;

    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: center;
}
.record_box_item_right > p:nth-of-type(1) {
    font-size: 18px;
    color: #000000;
    font-weight: bold;
    line-height: 26px;
}
.record_box_item_right > p:nth-of-type(2) {
    font-size: 12px;
    color: #a5a5a5;
    /* padding-top: 13px; */
}
.record_box_item > p {
    font-size: 12px;
    color: #999999;
    width: 100%;
    padding-left: 15.5%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>