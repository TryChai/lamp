<template>
    <div class="shop_catebox">
        <div class="shop-cate-con"
            ref="shopcate"
            :class="[type==2?'bgwrite':'grey_cate']">
            <div class="cate_search">
                <van-icon name="arrow-left"
                    size="22px"
                    @click="toBack" />
                <div class="fx_3 shops-head-search"
                    @click="getFous">
                    <div class="fx"
                        style="width:94%">
                        <van-icon name="search" />
                        <p>请输入搜索关键词</p>
                    </div>
                </div>
                <van-icon name="cart-o"
                    size="22px"
                    @click="$router.push('/shop/shopcard')" />
            </div>

            <div class="fx cate_conn">
                <van-sidebar :active-key="activeKey"
                    @change="onChange"
                    class="left_item">
                    <div class="hid_sco"></div>
                    <van-sidebar-item class="item_cate"
                        :title="item.title"
                        v-for="(item,i) in cate"
                        :key="i" />
                </van-sidebar>
                <mescroll-vue ref="mescroll"
                    style="flex:1"
                    :down="mescrollDown"
                    :up="mescrollUp"
                    @init="mescrollInit"
                    id="shop_con"
                    class="scol">
                    <div class="slide_shop">
                        <div class="slide_box">
                            <van-swipe :autoplay="3000">
                                <van-swipe-item v-for="(image, index) in slideList"
                                    :key="index">
                                    <img v-lazy="image.piclink"
                                        style="width:100%;border-radius:10px" />
                                </van-swipe-item>
                            </van-swipe>
                        </div>
                        <div class="slide_shop_box">
                            <div class="slide_shop_item"
                                v-for="(item,i) in shopList"
                                :key="i"
                                @click="$router.push('/shop/shopdetails?id=' + item.id)">
                                <div class="slide_shop_item_img">
                                    <img :src="$fnc.getImgUrl(item.piclink)"
                                        alt />
                                </div>
                                <p>{{item.title}}</p>
                                <p>
                                    ￥
                                    <span>{{$fnc.toFixedZ(item.price)}}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </mescroll-vue>
            </div>
        </div>
    </div>
</template>


<script>
import { Sidebar, SidebarItem, Image, Swipe, SwipeItem } from "vant";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
    components: {
        [Sidebar.name]: Sidebar,
        [SidebarItem.name]: SidebarItem,
        [Image.name]: Image,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        MescrollVue
    },
    data () {
        return {
            slideList: [],
            mescroll: null, // mescroll实例对象
            mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
            mescrollUp: {
                // 上拉加载的配置.
                auto: false,
                offset: 1000,
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
                    warpId: "shop_con", //父布局的id (1.3.5版本支持传入dom元素)
                    icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
                    tip: "暂无相关数据~" //提示
                }
            },
            shopList: [],
            activeKey: 0,
            value: "",
            cate: [],
            type: 1,
            curent: "cate"
        };
    },
    created () {
        this.get_slide(this.$route.query.cate_id);
        this.getShopCate(this.$route.query.cate_id);
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
            var params = {};
            params.cate_id = this.cate[this.activeKey].id;
            params.page = page.num;
            params.page_size = 20
            this.$api.getShop.getShopSearch(params).then(res => {
                if (res.code == 200) {
                    let arr = res.result.data;
                    // 如果是第一页需手动置空列表
                    if (page.num === 1) this.shopList = [];
                    // 把请求到的数据添加到列表
                    this.shopList = this.shopList.concat(arr);
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
                        mescroll.endSuccess(arr.length);
                    });
                } else {
                    mescroll.endErr();
                }
            });
        },
        onChange (key) {
            this.activeKey = key;
            this.mescroll.resetUpScroll();
        },
        getFous () {
            this.$router.push("/shop/shopsearch");
        },

        getShopCate (id) {
            this.$api.getShop.get_slide_shop({ id: id }).then(res => {
                if (res.code == 200) {
                    this.cate = [];
                    var arr = res.result;
                    arr.forEach((item) => {
                        if (item.show == 1) {
                            this.cate.push(item);
                        }
                    });
                    this.mescroll.resetUpScroll();
                }
            });
        },
        get_slide (id) {
            this.$api.getShop.get_slide_img({ id: id }).then(res => {
                if (res.code == 200) {
                    this.slideList = res.result;
                }
            });
        }
    }
};
</script>


<style lang="less" scoped>
.shop_catebox {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    // overflow: hidden;
}

.shop-cate-con {
    flex-direction: column;
    height: 100%;
    min-height: 90%;
    //   overflow: auto;
    position: relative;
    touch-action: none;
}
.cate_search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 998;
}
.shops-head-search {
    font-size: 14px;
    > div {
        height: 31px;
        justify-content: flex-start;
        color: #888888;
        background: #f2f2f2;
        margin: 11px 56px 11px 10px;
        border-radius: 27px;
        padding-left: 12px;
        i {
            margin-right: 4px;
            font-weight: bold;
        }
    }
}

.c1 {
    //   padding-top: 53px;
    flex: 3;
    //   overflow: auto;
    // min-height: 90%;
}
.shopcate-nav {
    //   position: fixed;
    //   bottom: 0;
    width: 100%;
    height: 50px;
}
.grey_cate {
    background: #f5f6f8;
    display: flex;
    flex-flow: column;
    min-height: 90%;
}
.cate_search {
    padding: 0px 15px;
    height: 53px;
    border-bottom: 1px solid #f1f4f7;
    background: #fff;
    //   position: fixed;
    top: 0;
    width: 100%;
    z-index: 99;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    form {
        width: 90%;
        height: 100%;
    }
    .van-search {
        height: 100%;
        padding: 0 0px;
    }
    .van-search__content {
        height: 36px;
    }
}
.van-search .van-cell {
    align-items: center;
}
.item_con {
    margin: 0px 13px 15px 13px;
}
.item_cate {
    padding: 16px 12px 15px 9px;
    background: #fff;
    font-size: 15px;
    color: #222222;
}
.van-sidebar-item--select {
    background: #f4f8fb !important;
    color: #f93134;
}
.cate_conn {
    align-items: flex-start;
    height: 564px;
    //   overflow: auto;
    font-size: 12px;
    padding: 50px 0;
    .left_item {
        height: 100%;
        background: #fff;
        overflow-y: auto;
        z-index: 1;
    }
}
.slide_shop {
    width: 100%;
    display: flex;
    flex-flow: column;
    height: 100%;
}
.slide_box {
    width: 100%;
    padding: 10px;
    overflow: hidden;
}
.slide_box img {
    border-radius: 10px;
}
.slide_shop_box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    min-height: 60%;
}
.slide_shop_item {
    width: 50%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 10px;
    font-family: "gilroy";
}
.slide_shop_item_img {
    width: 100%;
}
.slide_shop_item_img img {
    width: 100%;
}
.slide_shop_item p:nth-of-type(1) {
    width: 100%;
    text-align: left;
    font-size: 12px;
    height: 40px;
    color: #333333;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    //隐藏行数
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 20px;
    // padding: 4px 0;
}
.slide_shop_item p:nth-of-type(2) {
    width: 100%;
    text-align: left;
    font-size: 14px;
    color: #f93134;
    line-height: 26px;
    // font-weight: bold;
}
.slide_shop_item p:nth-of-type(2) span {
    font-size: 18px;
    font-weight: bold;
}
</style>
