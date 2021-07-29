<template>
  <div class="manger_content" id="shop_con">
    <div class="manger_content-cons">
      <van-nav-bar
        left-text
        left-arrow
        class="navbar"
        title="足迹"
        right-text="筛选"
        @click-left="toBack"
        @click-right="show_types = true"
      ></van-nav-bar>
      <van-popup v-model="show_types" get-container="body" round position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @cancel="show_types = false"
          @confirm="changeTypes"
        />
      </van-popup>
    </div>
    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      id="shop_con-s"
      class="scol"
    >
      <div class="goods_show_info" @click="gotodetail(item)" v-for="(item,i) in list" :key="i">
        <div class="goods_img">
          <img :src="$fnc.getImgUrl(item.piclink)" alt width="150" />
        </div>
        <div class="goods_content">
          <p>{{item.title}}</p>
          <p>
            足迹类型：
            <span>{{item.types}}</span>
          </p>
          <p>
            浏览时间：
            <span>{{$fnc.getTimeFormat(item.created_time)}}</span>
          </p>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>


<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import { Picker } from "vant";
export default {
  components: {
    MescrollVue,
    [Picker.name]: Picker,
  },
  data() {
    return {
      types: "",
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10, //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "shop_con",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000, //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "shop_con-s", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~", //提示
        },
      },
      list: [],
      columns: [],
      show_types: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next((vm) => {
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
  created() {
    this.get_footprint_type();
  },
  methods: {
    changeTypes(val) {
      this.types = val;
      if (this.mescroll) {
        this.mescroll.resetUpScroll();
      }
    },
    get_footprint_type() {
      this.$api.getPage.get_footprint_type({}).then((res) => {
        if (res.code == 200) {
          this.columns = res.result;
        }
      });
    },
    gotodetail(item) {
      var types = item.types;
      switch (true) {
        case types == "商家店铺":
          this.$router.push("/supplier/suppliershopdetails?id=" + item.pid);
          break;
        case types == "浏览新闻":
          this.$router.push("/news/news_detail?news_id=" + item.pid);
          break;
        case types == "浏览商品":
          this.$router.push("/shop/shopdetails?id=" + item.pid);
          break;
        default:
          break;
      }
    },

    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      this.show_types = false;
      var params = {};
      params.page = page.num;
      params.types = this.types;
      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      }
      this.$api.getPage.get_footprint(params).then((res) => {
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
  },
  watch: {},
};
</script>

<style lang="less" scoped>
.scol {
  padding-bottom: 55px;
  padding-top: 10px;
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
}
.goods_show_info {
  width: 92%;
  margin: 0 auto;
  background-color: rgb(255, 255, 255);
  -moz-box-shadow: 2px 2px 10px #b8b8b8;
  -webkit-box-shadow: 2px 2px 10px #b8b8b8;
  box-shadow: 2px 2px 10px #b8b8b8;
  margin-bottom: 15px;
  padding: 12.5px;
  border-radius: 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;

  .show_price {
    color: rgb(255, 0, 53);
    font-weight: 800;
    font-size: 18px;
  }
}
.goods_img {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  // display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  img {
    width: 100%;
    border-radius: 10px;
  }
}
.goods_content {
  flex: 1;
  height: 80px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: flex-start;
  > p {
    font-size: 14px;
    line-height: 18px;
    color: #000000;
    > span {
      font-size: 14px;
      color: #333;
    }
  }
  > p:nth-of-type(1) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    //隐藏行数
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  > p:nth-of-type(2) {
    margin-top: auto;
  }
  .show_info {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    > span {
      font-size: 20px;
      font-weight: bold;
      color: #ff0035;
    }
    .show_views {
      text-align: right;
      padding-bottom: 3px;
      color: rgb(138, 138, 138);

      span {
        color: rgb(254, 85, 85);
      }
    }
  }
}
</style>
