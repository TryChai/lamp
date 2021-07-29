<template>
  <div class="buyers" id="buyers">
    <van-nav-bar left-arrow class="navbar" :fixed="true" @click-left="toBack">
      <template #title>
        <div class="fx buyers_nav_title">
          <span :class="is_self==0?'active':''" @click="changeNav(0)">随手拍</span>
          <span :class="is_self==1?'active':''" @click="changeNav(1)">我的</span>
        </div>
      </template>
      <template #right>
        <div class="fx buyers_nav_right" @click="$router.push('/shop/buyers_add')">
          <i class="fa fa-camera"></i>
          <span>拍一个</span>
        </div>
      </template>
    </van-nav-bar>

    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      class="scol"
      id="buyers-con"
    >
      <showItem
        v-for="(item,i) in list"
        :key="i"
        :info="item"
        @open_detail="rec_open"
        @getSearch="getSearch"
      ></showItem>
    </mescroll-vue>
    <van-popup
      v-model="show"
      position="top"
      class="detail_pop"
      :close-on-popstate="true"
      :style="{ width:'100%',height: '100%','background-color': 'black'}"
    >
      <showDetail @close_pop="rec_close" @touch_change="rec_touch" :detail="detail"></showDetail>
    </van-popup>
  </div>
</template>


<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import showItem from "@/components/shop/buyers/show_item";
import showDetail from "@/components/shop/buyers/show_detail";
export default {
  components: {
    MescrollVue,
    showItem,
    showDetail
  },
  data() {
    return {
      detail: {
        piclink: [],
        video: "",
        video_piclink: ""
      },
      show: false,
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "buyers",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "buyers-con", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      },
      list: [],
      is_self: 0,
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
    changeNav(val) {
      this.is_self = val;
      this.list = [];
      if (this.mescroll) {
        this.mescroll.resetUpScroll();
      }
    },
    rec_touch(val) {
      if (this.detail.id && this.detail.id != 0) {
        let i = this.list.findIndex(item => {
          return item.id == this.detail.id;
        });
        if (i >= 0) {
          var new_i = val == 1 ? Number(i) + 1 : Number(i) - 1; //新的索引
          if (new_i >= 0 && new_i < this.list.length) {
            this.detail = this.list[new_i];
          }
        }
      }
    },
    rec_open(info) {
      this.show = true;
      this.detail = info;
    },
    rec_close() {
      this.show = false;
      this.detail = {
        piclink: [],
        video: "",
        video_piclink: ""
      };
    },
    getSearch() {
      if (this.mescroll) {
        this.mescroll.resetUpScroll();
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      var params = {};
      params.is_self = this.is_self;
      params.page = page.num;
      this.$api.getShop.get_all_remark(params).then(res => {
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
.scol {
  flex: 4;
  padding-top: 46px;
}
.buyers {
  background-color: #f2f2f2;
  font-size: 14px;
  .buyers_nav_title {
    width: 98px;
    .active {
      font-size: 17px;
      font-weight: bold;
    }
  }
  .buyers_nav_right {
    width: 70px;
    height: 22px;
    background: #ffdd00;
    border-radius: 5px 0px 5px 0px;
    line-height: 1;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    > i {
      font-size: 12px;
      margin-right: 3px;
    }
  }
}
</style>
