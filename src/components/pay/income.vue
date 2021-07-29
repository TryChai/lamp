<template>
    <div class="container income_bg"
        id="income_bg">
        <van-nav-bar title="资金记录"
            left-text
            left-arrow
            class="navbar"
            @click-left="toBack"></van-nav-bar>
        <mescroll-vue ref="mescroll"
            :down="mescrollDown"
            :up="mescrollUp"
            @init="mescrollInit"
            class="scol news_srcoll"
            id="income">
            <div class="income">
                <div class="income_top">
                    <div class="income_box">
                        <div class="income_box_top">
                            <div class="income_box_left">
                                <span>{{index_data.sum_amount}}</span>
                                <p>累计佣金收益</p>
                            </div>
                            <div class="income_box_right">
                                <span>{{index_data.sum_integral}}</span>
                                <p>累计{{integral_name}}收益</p>
                            </div>
                        </div>
                        <div class="income_box_bottom">
                            <div class="income_box_bottom_item"
                                v-if="index_data.is_recharge == 1 || index_data.is_recharge == '1'">
                                <button>
                                    <router-link to="recharge">立即充值</router-link>
                                </button>
                            </div>
                            <div class="income_box_bottom_item"
                                v-if="index_data.is_withdraw == 1 || index_data.is_withdraw == '1'">
                                <button>
                                    <router-link to="withdraw">立即提现</router-link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="income_record"
                    id="income_record">
                    <van-tabs v-model="sel_record"
                        title-active-color="#000"
                        title-inactive-color="#808080"
                        :ellipsis='false'
                        line-height="2px"
                        color="#e7b56a">
                        <van-tab v-for="(Item,index) in iden"
                            :key="index"
                            :name="Item.iden">
                            <div class="tab-title"
                                slot="title"
                                @click="click_tab(Item.iden)">{{ Item.title }}</div>
                            <div class="record_item tab-content">
                                <div v-for="(item,y) in income_data"
                                    :key="y"
                                    style="padding:15px 0 ;border-top: 1px solid #f7f7f7">
                                    <div class="record_item_bottom">
                                        <p>
                                            <van-icon name="orders-o"
                                                color="#99c8d5"
                                                size="16px" />订单：
                                            <span>{{item.oid}}</span>
                                        </p>
                                        <!-- <button   :data-clipboard-text="item.oid" data-clipboard-action="copy"  @click="copy_link(item.oid)">点击复制</button> -->
                                        <van-icon name="newspaper-o"
                                            color="#ddd"
                                            size="24px"
                                            class="income_box_copy_btn"
                                            :data-clipboard-text="item.oid"
                                            data-clipboard-action="copy"
                                            @click="copy_link(item.oid)" />
                                    </div>
                                    <div class="record_item_bottom">
                                        <p>
                                            <van-icon name="bill-o"
                                                color="#99c8d5"
                                                size="16px" />类型：
                                            <span>{{item.style}}</span>
                                        </p>
                                        <p>
                                            <span v-if="item.types == 1"
                                                class="addMoney">+{{$fnc.toFixedZ(item.money,3)}}</span>
                                            <span v-if="item.types == 2"
                                                class="delMoney">-{{$fnc.toFixedZ(item.money,3)}}</span>
                                        </p>
                                    </div>

                                    <div class="record_item_bottom">
                                        <p>
                                            <van-icon name="location-o"
                                                color="#99c8d5"
                                                size="16px" />来源：
                                            <span>{{item.ly_nickname?(item.ly_nickname+'').slice(0,8) : ($store.state.user.nickname+'').slice(0,8)+'(自己)'}}</span>
                                        </p>
                                        <p>
                                            剩余：
                                            <span
                                                class="pay-black">{{' '+$fnc.toFixedZ(item.balance,3)}}</span>
                                        </p>
                                    </div>

                                    <div class="record_item_bottom">
                                        <p></p>
                                        <p>{{' '+$fnc.getTimeFormat(item.created_time)}}</p>
                                    </div>
                                </div>
                            </div>
                        </van-tab>
                    </van-tabs>
                </div>
            </div>
        </mescroll-vue>
    </div>
</template>

<script>
import Clipboard from "clipboard";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
    name: "income",
    data () {
        return {
            is_open: {

            },
            integral_name: "",
            sel_record: "", //收入记录
            iden: [],
            index_data: {},
            income_data: {},
            type: "",
            mescroll: null, // mescroll实例对象
            mescrollDown: {
                mustToTop: true
            }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
            mescrollUp: {
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
                    warpId: "income_bg",
                    src: require("../../assets/img/top.png"), //图片路径,默认null,支持网络图
                    offset: 1000 //列表滚动1000px才显示回到顶部按钮
                },
                empty: {
                    //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                    warpId: "income_record", //父布局的id (1.3.5版本支持传入dom元素)
                    icon: require("@/assets/img/empty.png"),//图标,默认null,支持网络图
                    tip: "暂无相关数据~" //提示
                }
            }
        };
    },
    components: {
        MescrollVue
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
    created () {
        // if (this.$store.state.user.flag == undefined || this.$store.state.user.flag == null) {
        //     this.$api.getUser.getUserInfo({}).then(res => {
        //         if (res.code == 200) {
        //             this.$store.commit("setUser", res.result)
        //             var flag = JSON.parse(res.result.flag);
        //             this.is_open = flag.m_tx
        //         }
        //     });
        // } else {
        //     var flag = JSON.parse(this.$store.state.user.flag)
        //     this.is_open = flag.m_tx
        // }
        this.getindex();

    },
    methods: {

        click_tab (type) {
            this.type = type;
            this.content = []; // 在这里手动置空列表,可显示加载中的请求进度
            this.mescroll.resetUpScroll(); // 刷新列表数据
        },
        mescrollInit (mescroll) {
            this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        },
        upCallback (page, mescroll) {
            this.type = this.type || this.$route.query.iden;
            this.$api.getPay
                .get_running_water({ page: page.num, iden: this.type })
                .then(res => {
                    if (res.code == 200) {
                        let arr = res.result;
                        // 如果是第一页需手动置空列表
                        if (page.num === 1) this.income_data = [];
                        // 下拉刷新
                        // 把请求到的数据添加到列表
                        this.income_data = this.income_data.concat(arr);
                        // 数据渲染成功后,隐藏下拉刷新的状态
                        this.$nextTick(() => {
                            mescroll.endSuccess(arr.length);
                        });
                    } else {
                        mescroll.endErr();
                    }
                });
        },
        getindex () {
            this.$api.getPay.getincome_index({}).then(res => {

                if (res.code == 200) {
                    this.iden = res.result.iden;
                    var idens = this.$route.query.iden || "";
                    for (var i in this.iden) {
                        if (this.iden[i].iden == idens) {
                            this.sel_record = this.iden[i].iden;
                        }

                        if (this.iden[i].iden == 'integral') {
                            this.integral_name = this.iden[i].title
                        }

                    }
                    this.index_data = res.result;

                }
            });
        },
        copy_link (value) {

            var clipboard = new Clipboard(".income_box_copy_btn");
            clipboard.on("success", () => {
                this.$toast.success("复制成功");
                // 释放内存
                clipboard.destroy();
            });
            clipboard.on("error", () => {
                // 不支持复制
                _this.$fnc.ykAPPCopy(value);
            });
        }
    },
    filters: {
        toFix (val) {
            return parseFloat(val).toFixed(2);
        }
    }
};
</script>

<style scoped>
@import "./../../assets/css/pay.css";
.income_bg {
    height: 100%;
    overflow: auto;
}
.news_srcoll {
    position: fixed;
    top: 46px;
}
</style>