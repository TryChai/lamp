<template>
  <div class="yuyue" id="yuyue">
    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      id="yuyue-mescroll"
    >
      <van-nav-bar
        left-text
        left-arrow
        class="navbar"
        :title="$route.query.types==14?'服务预约':'商品预约'"
        @click-left="toBack"
      ></van-nav-bar>
      <div class="yuyue_body">
        <div class="yuyue_top" v-show="banner">
          <img :src="$fnc.getImgUrl(banner)" alt />
        </div>

        <div class="yuyue_box">
          <div class="yuyue_box_item" v-for="(item,i) in yuyue_list" :key="i">
            <oneShop :info="item" />
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>
<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import oneShop from "@/components/currency/page/one-shop.vue";
export default {
  name: "yuyue_page",
  data() {
    return {
      banner: "",
      yuyue_list: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false
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
        noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "yuyue",
          src: require("../../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "yuyue-mescroll", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      }
    };
  },
  components: {
    MescrollVue,
    oneShop
  },
  created() {
    this.get_yuyue_banner();
  },
  methods: {
    onClickDisabled(name, title) {
      this.active = name;
      this.mescroll.resetUpScroll();
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      this.$api.getShop
        .yuyue_shop_lists({
          page: page.num,
          page_size: page.size,
          types: this.$route.query.types || 13
        })
        .then(res => {
          if (res.code == 200) {
            let arr = res.result.data;

            // 如果是第一页需手动置空列表
            if (page.num === 1) this.yuyue_list = [];
            // 把请求到的数据添加到列表
            this.yuyue_list = this.yuyue_list.concat(arr);
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
    get_yuyue_banner() {
      if (this.$route.query.types == 14) {
        this.$api.getConfig.get_iden({ iden: "yyfw_piclink" }).then(res => {
          if (res.code == 200) {
            this.banner = res.result;
          }
        });
      } else {
        this.$api.getConfig.get_iden({ iden: "yysp_piclink" }).then(res => {
          if (res.code == 200) {
            this.banner = res.result;
          }
        });
      }
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
.yuyue {
  width: 100%;
  background-color: #f3f3f3;
}
.yuyue_body {
  width: 100%;
}
.yuyue_top {
  width: 100%;
  padding: 10px 15px;
  background-color: #ffffff;
}
.yuyue_top img {
  width: 100%;
}
.yuyue_box {
  width: 100%;
  background-color: #f3f3f3;
  padding-bottom: 15px;
}
.yuyue_box_item {
  width: 100%;
}
</style>