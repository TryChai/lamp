<template>
    <div class="manger_content"
        id="shop_con">
        <div class="manger_content-cons">
            <van-nav-bar left-text
                left-arrow
                class="navbar"
                title="竞拍者"
                @click-left="toBack"></van-nav-bar>

        </div>

        <mescroll-vue ref="mescroll"
            :down="mescrollDown"
            :up="mescrollUp"
            @init="mescrollInit"
            id="shop_con-s"
            class="scol">
            <div class="personitem"
                v-for="(item,i) in list"
                :key="i">
                <div class="personitem_img">
                    <img :src="$fnc.getImgUrl(item.avatar)"
                        alt="">
                </div>
                <div class="personitem_middle">
                    <p>{{item.nickname || item.username}} </p>
                    <p>{{item.rating_cn}}</p>
                </div>

                <div class="personitem_right">
                    <p>举手价格 <span>{{$fnc.toFixedZ(item.rear_price)}}元</span></p>
                    <p>举手时间 {{$fnc.getTimeFormat(item.created_time)}}</p>
                </div>
            </div>

        </mescroll-vue>
    </div>
</template>


<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import shopitem from "@/components/member/store/store_shop_item";

export default {
    components: {
        shopitem,
        MescrollVue,
    },
    data () {
        return {
            search_word: "",
            mescroll: null, // mescroll实例对象
            mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
            mescrollUp: {
                // 上拉加载的配置.
                callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                //以下是一些常用的配置,当然不写也可以的.
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 10 //每页数据条数,默认10
                },
                htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
                noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
                toTop: {
                    //回到顶部按钮
                    warpId: "shop_con",
                    src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
                    offset: 1000 //列表滚动1000px才显示回到顶部按钮
                },
                empty: {
                    //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                    warpId: "shop_con-s", //父布局的id (1.3.5版本支持传入dom元素)
                    icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
                    tip: "暂无相关数据~" //提示
                }
            },
            list: []
        };
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
        rec_del () {
            if (this.mescroll) {
                this.mescroll.resetUpScroll();
            }
        },
        getSearch () {
            if (this.mescroll) {
                this.mescroll.resetUpScroll();
            }
        },
        mescrollInit (mescroll) {
            this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        },
        upCallback (page, mescroll) {
            var params = {};
            params.page = page.num;
            params.id = this.$route.query.id
            this.$api.getShop.get_auction_bidpeople(params).then(res => {
                if (res.code == 200) {
                    let arr = res.result;
                    // 如果是第一页需手动置空列表
                    if (page.num === 1) this.list = [];
                    // 把请求到的数据添加到列表
                    this.list = this.list.concat(arr);
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
                        mescroll.endSuccess(arr.length);
                    });
                } else {
                    mescroll.endErr();
                }
            });
        }
    },
    watch: {
        $route () {
            if (this.mescroll) {
                this.mescroll.resetUpScroll();
            }
        }
    }
};
</script>

<style lang="less" scoped>
.scol {
    padding-bottom: 55px;
    flex: 3;
    margin-top: 50px;
}
.manger_content-cons {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 998;
}
.shop-search-con {
    padding: 10px 0px;
}
.manger_content {
    min-height: 100%;
    height: 100%;
    background: #f4f4f4;
    display: flex;
    flex-direction: column;

    > .search_jieguo {
        height: 32px;
        line-height: 32px;
        background: #fff;
        padding-left: 17px;
        justify-content: flex-start;
        font-size: 14px;
        line-height: 1.4;
        margin: 10px 0;
        span:first-child {
            width: 4px;
            height: 14px;
            background: #fa042f;
            border-radius: 2px;
            color: #fa042f;
        }
        span:last-child {
            font-size: 13px;
            margin-left: 9px;
            line-height: 1;
            color: #727272;
        }
    }
    .personitem:nth-of-type(1) {
        margin-top: 5px;
    }
    .personitem {
        width: 100%;
        height: auto;
        margin: 10px auto 0 auto;
        padding: 5px 13px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        background-color: #ffffff;
        .personitem_img {
            width: 50px;
            height: 50px;
            border-right: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        .personitem_middle {
            height: 100%;
            flex: 1;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            align-items: flex-start;
            > p:nth-of-type(1) {
                font-size: 14px;
                color: #333;
            }
            > p:nth-of-type(2) {
                font-size: 14px;
                color: #333;
                background-color: #409eff;
                color: #ffffff;
                border-radius: 5px;
                line-height: 18px;
                padding: 0 5px;
            }
        }
        .personitem_right {
            width:140px;
            //   flex: 1;
            height: 100%;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: flex-start;
            font-size: 11px;
            margin-right: 10px;
            > p {
                span {
                    color: #d82018;
                }
            }
            > p:nth-of-type(2) {
                color: #595959;
            }
        }
    }
}
</style>
