<template>
    <div class="write"
        id="write-cons">

        <van-nav-bar left-text
            left-arrow
            class="navbar"
            title="核销商品"
            @click-left="toBack"></van-nav-bar>
        <mescroll-vue ref="mescroll"
            :down="mescrollDown"
            :up="mescrollUp"
            @init="mescrollInit"
            id="write-con">
            <div class="write_body">
                <div class="write_top"
                    v-if="banner != undefined  && banner.length > 0">
                    <img :src="$fnc.getImgUrl(banner)"
                        alt />
                </div>
                <div class="write_box">
                    <div class="write_box_item"
                        v-for="(item,i) in write_list"
                        :key="i">
                        <write-off-item :info="item"></write-off-item>
                    </div>
                </div>
            </div>
        </mescroll-vue>
    </div>
</template>
<script>
import writeOffItem from "@/components/shop/write-off/write-off-item";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
    name: "write_page",
    data () {
        return {
            banner: "",
            write_list: {},
            mescroll: null, // mescroll实例对象
            mescrollDown: {

            }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
            mescrollUp: {
                // 上拉加载的配置.
                // use:false,

                callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                //以下是一些常用的配置,当然不写也可以的.
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 10 //每页数据条数,默认10
                },
                loadFull: {
                    use: false,
                    delay: 1500
                },
                htmlNodata: "",
                noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
                toTop: {
                    //回到顶部按钮
                    warpId: "write-con",
                    src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
                    offset: 1000 //列表滚动1000px才显示回到顶部按钮
                },
                empty: {
                    //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                    warpId: "write-con", //父布局的id (1.3.5版本支持传入dom元素)
                    icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
                    tip: "暂无相关数据~" //提示
                }
            }
        };
    },
    components: {
        writeOffItem,
        MescrollVue
    },
    created () { },
    methods: {
        mescrollInit (mescroll) {
            this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        },
        upCallback (page, mescroll) {
            this.$api.getShop.getWriteList({ page: page.num }).then(res => {
                if (res.code == 200) {
                    this.banner = res.result.banner;

                    let arr = res.result.lists;
                    // 如果是第一页需手动置空列表
                    if (page.num == 1) this.write_list = [];
                    // 把请求到的数据添加到列表
                    this.write_list = this.write_list.concat(arr);
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
                        setTimeout(() => {
                            mescroll.endSuccess(arr.length);
                        }, 1500);
                    });
                } else {
                    mescroll.endErr();
                }
            });
        }
    }
};
</script>
<style scoped>
#write-cons {
    display: flex;
    flex-direction: column;
    overflow: auto;
}
.write {
    width: 100%;
    background-color: #f3f3f3;
}
.write_body {
    width: 100%;
}
.write_top {
    width: 100%;
    padding: 10px 15px;
    background-color: #ffffff;
}
.write_top img {
    width: 100%;
}
.write_box {
    width: 100%;
    background-color: #f3f3f3;
    padding-bottom: 15px;
}
.write_box_item {
    width: 100%;
    /* background-color: #ffffff; */
}
</style>