<template>
  <div class="container collect_bj">
    <van-nav-bar :title="$h('分享新闻')" :left-text="$h('取消')" @click-left="chanbank" :border="true" />
    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      class="scol fx_3"
      id="collect"
    >
      <div class="new">
        <div class="news_list">
          <div class="news_list_item" v-for="item in news_list" :key="item.aid">
            <div class="news_list_item_left">
              <img :src="$fnc.getImgUrl(item.piclink)" alt />
            </div>
            <div class="news_list_item_right">
              <div class="news_list_item_title">
                <p>{{item.title}}</p>
              </div>
              <div class="news_list_item_other">
                <span>{{$fnc.getTimeFormat(item.created_time)}}</span>
                <span @click="toNes(item)">{{$h('发送')}}</span>
              </div>
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
  name: "shop_collect",
  components: {
    MescrollVue
  },
  data() {
    return {
      active: 0, // 0为商品 1为店铺
      rate: 5,
      news_list: [], //收藏新闻
      product_list: [], //收藏商品
      shop_list: [], //收藏店铺
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 5 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "collect",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "collect", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: this.$h("暂无相关数据~") //提示
        }
      }
    };
  },
  created() {},

  methods: {
    toNes(item){
         this.$emit("sendInfo", item,'share-news');
    },
    chanbank() {
      this.$emit("closePlay", false);
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      this.$api.getnews
        .get_collect_news({ page: page.num, page_size: page.size })
        .then(res => {
          if (res.code == 200) {
            let arr = res.result;
            // 如果是第一页需手动置空列表
            if (page.num === 1) this.news_list = [];
            // 把请求到的数据添加到列表
            this.news_list = this.news_list.concat(arr);
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
  }
};
</script>

<style scoped>
#collect {
  height: 100%;
}
.collect_bj {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
}

.collect {
  width: 100%;
}

.new {
  width: 100%;
}
.news_list {
  width: 100%;
  margin-top: 15px;
  background-color: white;
}

.news_list_item {
  width: 95%;
  height: 120px;
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}
.news_list_item_left {
  width: 35%;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
}
.news_list_item_left img {
  width: 100%;
  height: 100%;
}

.news_list_item_right {
  width: 65%;
  height: 80px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  padding-left: 10px;
}
.news_list_item_title p {
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
  color: #000000;
  text-align: justify;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.news_list_item_other {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.news_list_item_other span:nth-of-type(1) {
  font-size: 12px;
  color: #a8a8a8;
  display: flex;
  height: 20px;
  align-items: center;
}
.news_list_item_other span:nth-of-type(2) {
  font-size: 12px;
  color: #fff;
  background: #ff5805;
  border: 1px solid #ff5805;
  border-radius: 10px;
  padding: 2px 10px;
}
</style>