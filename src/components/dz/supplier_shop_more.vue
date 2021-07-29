<template>
  <div class="templeIntroduction" id="templeIntroductionid">
    <van-nav-bar title="法务通告" left-arrow @click-left="toBack" />
     <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" id="supplier" class="fx_3">
        <indexshoplist :dz_bottom="40" :top_shoplist='productList' class="shop-search-con" />
     </mescroll-vue>
  </div>
</template>
<script>
import indexshoplist from "@/components/shop/shopindex/indexshoplist_dz.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
    name:'dz_index',
    data() {
        return {
            show: false,
            value: null,
            productList: [],
            mescroll: null, // mescroll实例对象
            mescrollDown: {
              use: false
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
                warpId: "templeIntroductionid",
                src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
                offset: 1000 //列表滚动1000px才显示回到顶部按钮
              },
              empty: {
                //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                warpId: "templeIntroductionid", //父布局的id (1.3.5版本支持传入dom元素)
                icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
                tip: "暂无更多商品~" //提示
              }
            },
        };
    },
    components: {
      indexshoplist,
      MescrollVue
    },
    mounted() {
    },
    methods: {
        showPopup() {
            this.show = true;
        },
        mescrollInit (mescroll) {
          this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        },
        upCallback(page, mescroll) {
        var params = {};
        params.sid = this.$route.query.id || "";
        params.cate_id = this.activeName || "";
        params.page = 1;
        this.$api.getShop.getShopSearch(params).then((res) => {
          if (res.code == 200) {
            let arr = res.result.data;
            // 如果是第一页需手动置空列表
            if (page.num == 1) this.productList = [];
            // 把请求到的数据添加到列表
            this.productList = this.productList.concat(arr);
            console.log(this.productList);
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
      },
    },
};
</script>
<style lang="less" scoped>
.templeIntroduction {
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}
/deep/.van-nav-bar .van-icon{
  color: #333;
}
</style>