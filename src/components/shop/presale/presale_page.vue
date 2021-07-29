<template>
  <div class="presale" id="presale">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" id="presale-mescroll">
      <van-nav-bar left-text left-arrow class="navbar" title="预售活动" @click-left="toBack">
        <van-icon name="orders-o" color="#333333" size="22px" slot="right" @click="$router.push('/order/orderlist?status=已付定金')" />
      </van-nav-bar>
      <div class="presale_body">
        <div class="presale_top" v-show="banner">
          <img :src="$fnc.getImgUrl(banner)" alt />
        </div>
        <div class="presale_box">
          <div class="presale_box_item" v-for="(item,k) in presale_list" :key="k">
            <presale_item :info="item"></presale_item>
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>
<script>
import presale_item from "@/components/shop/presale/presale_shop_item";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  name: "presale_page",
  data () {
    return {
      banner: "",
      presale_list: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false,
        mustToTop: true
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)

      mescrollUp: {
        offset: 300,
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
          warpId: "presale",
          src: require("../../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "presale-mescroll", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      }
    };
  },
  components: {
    presale_item,
    MescrollVue
  },
  created () {
    this.get_presale_banner();
  },
  methods: {
    get_presale_banner () {
      this.$api.getConfig.get_iden({ iden: "appointment_pic" }).then(res => {
        if (res.code == 200) {
          this.banner = res.result;
        }
      });
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback (page, mescroll) {
      this.$api.getShop
        .get_presale_list({
          page: page.num,
          page_size: page.size
        })
        .then(res => {
          if (res.code == 200) {
            let arr = res.result;
            // 如果是第一页需手动置空列表
            if (page.num === 1) this.presale_list = [];
            // 把请求到的数据添加到列表
            this.presale_list = this.presale_list.concat(arr);
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
  }
};
</script>
<style scoped>
.presale {
  width: 100%;
  background-color: #f3f3f3;
  height: 100%;
  overflow: auto;
}
.presale_body {
  width: 100%;
}
.presale_top {
  width: 100%;
  padding: 10px;
  background-color: #ffffff;
}
.presale_top img {
  width: 100%;
}
.presale_box {
  width: 100%;
  background-color: #f3f3f3;
  padding-bottom: 15px;
  /* padding-top: 15px; */
}
.presale_box_item {
  width: 100%;
  margin-top: 15px;
  /* background-color: #ffffff; */
}
.presale_box_item:not(:first-child) {
  margin-bottom: 10px;
}
#presale-mescroll {
  position: fixed;
  top: 0;
}
</style>