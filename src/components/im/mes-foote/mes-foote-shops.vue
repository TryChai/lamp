<template>
  <div class="container collect_bj">
    <van-nav-bar :title="$h('分享商品')" :left-text="$h('取消')" @click-left="chanbank" :border="true" />
    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      class="scol fx_3"
      id="collect"
    >
      <div class="collect">
        <div class="collect_item" v-for="(item,i) in product_list" :key="i">
          <div class="collect_item_img">
            <img :src="$fnc.getImgUrl(item.piclink)" alt />
          </div>
          <div class="collect_item_right">
            <p>{{item.title}}</p>
            <div class="collect_item_right_price">
              <p>
                {{$h('售价')}}：
                <span>￥</span>
                <span>{{item.price}}</span>
              </p>
              <button @click="toNes(item)">{{$h('发送')}}</button>
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
          tip:this.$h('暂无相关数据~') //提示
        }
      }
    };
  },
  created() {},

  methods: {
    toNes(item) {
      this.$emit("sendInfo", item, "shops");
    },
    chanbank() {
      this.$emit("closePlay", false);
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      this.$api.getShop
        .get_product_collect({ page: page.num, page_size: page.size })
        .then(res => {
          if (res.code == 200) {
            let arr = res.result;
            // 如果是第一页需手动置空列表
            if (page.num === 1) this.product_list = [];
            // 把请求到的数据添加到列表
            this.product_list = this.product_list.concat(arr);
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

.collect {
  width: 100%;
}
.collect_item {
  width: 95%;
  height: 140px;
  border-radius: 10px;
  margin: 15px auto 0 auto;
  background-color: #ffffff;
  padding: 5px 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}
.collect_item_img {
  width: 30%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.collect_item_img img {
  width: 90%;
}
.collect_item_right {
  width: 65%;
  height: 100px;
  padding: 0px 3px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;
}
.collect_item_right > p {
  width: 100%;
  height: 50px;
  line-height: 25px;
  /*padding-bottom: 10px;*/
  font-size: 14px;
  color: #000;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.collect_item_right_price {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.collect_item_right_price p {
  font-size: 14px;
  word-break: break-all;
}
.collect_item_right_price p span:nth-of-type(1) {
  font-size: 12px;
  font-weight: bold;
  color: #ff2043;
}
.collect_item_right_price p span:nth-of-type(2) {
  font-size: 18px;
  color: #ff2043;
}
.collect_item_right_price button {
  align-self: flex-end;
  font-size: 12px;
  color: #ffffff;
  border-radius: 15px;
  border: none;
  padding: 0 13px;
  height: 25px;
  line-height: 23px;
  background: -webkit-linear-gradient(
    left,
    #ff3763,
    #ff7c5e
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #ff3763,
    #ff7c5e
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #ff3763,
    #ff7c5e
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(
    to right,
    #ff3763,
    #ff7c5e
  ); /* 标准的语法（必须放在最后） */
}
</style>