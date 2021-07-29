<template>
  <div class="manger_content" id="shop_con">
    <div class="manger_content-head">
      <van-nav-bar left-text left-arrow class="navbar" title="全部商品" @click-left="toBack"></van-nav-bar>
      <van-search
        placeholder="请输入搜索关键词"
        :clearable="false"
        @search="getSearch"
        v-model="search_word"
      />
    </div>
    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      class="scol"
    >
      <shopitem :info="item" :is_manger="true" v-for="(item,i) in list" :key="i" />
    </mescroll-vue>
  </div>
</template>


<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import shopitem from "@/components/member/store/store_shop_item";
import { Search } from "vant";
export default {
  components: {
    shopitem,
    MescrollVue,
    [Search.name]: Search
  },
  data() {
    return {
      search_word: "",
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        offset:1000,
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
          icon: "@/assets/img/empty.png", //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      },
      list: []
    };
  },
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  methods: {
    getSearch(obj) {
      if (this.mescroll) {
        this.mescroll.resetUpScroll();
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      var params = {};
      if (this.search_word != "") {
        params.title = this.search_word || "";
      }
      params.page = page.num;
      params.page_size=20
      this.$api.getShop.get_store_manger_shop(params).then(res => {
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
  }
};
</script>

<style lang="less" scoped>
.manger_content-head{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 998;
}
.scol {
  flex: 3;
  margin-top: 100px;
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
}
</style>
