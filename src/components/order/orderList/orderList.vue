<template>
  <div class="order_list_con" id="orderList">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" id="orderList-s" class="scol">
      <van-nav-bar title="善缘" left-text left-arrow class="navbar dznav" :border="false" @click-right="onClickRight"
          @click-left="$router.push('/member/member')">
        <!-- <div slot="right">
          <span v-if="!$route.query.mid ">{{is_friend==0?'好友订单':'普通订单'}}</span>
        </div> -->
      </van-nav-bar>
      <div>
        <form action="/">
          <van-search background="#f3f3f3" class="srarc_order" v-model="value" placeholder="请输入搜索关键词" @search="onSearch" />
        </form>

        <orderItem v-for="(item,i) in list" :key="i" :item="item" @openThis="getopenThis" />
        <div class="orderNoticeBar_foot tc">已经是最后一个订单了</div>
      </div>
    </mescroll-vue>
  </div>
</template>


<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import orderItem from "@/components/currency/order/orderList/orderItem.vue";
export default {
  data () {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
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
          warpId: "orderList",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "orderList-s", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      },
      active: "",
      value: "",
      list: [],
      is_friend: 0
    };
  },
  components: {
    orderItem,
    MescrollVue
  },
  created () {
    // this.getOrderList();
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
      params.page = page.num;
      // params.oid = oid || '';
      params.is_friend = this.is_friend;
      if (this.$route.query.mid && this.$route.query.mid != "") {
        params.is_mid = 1;
      }
      params.page_size = 20
      params.status = this.$route.query.status || "";
      params.types = this.$route.query.types || "";
      this.$api.getOrder.getOrderList(params).then(res => {
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
    },
    onClickRight () {
      if (this.is_friend == 0) {
        this.is_friend = 1;
      } else {
        this.is_friend = 0;
      }
      this.getOrderList(this.value);
    },
    onSearch (e) {
      this.getOrderList(e);
    },
    getopenThis (str) {
      if (str == "已完成") {
        this.$router.replace("/order/orderlist?status=已完成");
      } else {
        this.getOrderList();
      }
    },
    getOrderList (oid) {
      var params = {};
      params.oid = oid || "";
      params.is_friend = this.is_friend;
      params.status = this.$route.query.status || "";
      if (this.$route.query.mid && this.$route.query.mid != "") {
        params.is_mid = 1;
      }
      this.$api.getOrder.getOrderList(params).then(res => {
        if (res.code == 200) {
          this.list = res.result;
        }
      });
    }
  }
};
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
  .navbar {
    i,
    span,
    div {
      color: #323233;
    }
  }
}
</style>
