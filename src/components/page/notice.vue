<template>
  <mescroll-vue
    ref="mescroll"
    :down="mescrollDown"
    :up="mescrollUp"
    @init="mescrollInit"
    class="notice_box"
    id="notice"
  >
    <van-nav-bar
      title="服务提醒"
      left-arrow
      class="navbar"
      @click-left="toBack"
    >
    </van-nav-bar>
    <div class="header">
      <div @click="changeTab(3)">
        <img src="@/assets/img/notice/shenghe.png" />
        <p :style="active == '审核通知' ? 'color:#409EFF;' : ''">审核通知</p>
      </div>
      <div @click="changeTab(4)">
        <img src="@/assets/img/notice/zijing.png" />
        <p :style="active == '资金变动' ? 'color:#FDA817;' : ''">资金变动</p>
      </div>
      <div @click="changeTab(1)">
        <img src="@/assets/img/notice/zhuce.png" />
        <p :style="active == '注册通知' ? 'color:#F27632;' : ''">注册通知</p>
      </div>
      <div @click="changeTab(2)">
        <img src="@/assets/img/notice/order.png" />
        <p :style="active == '订单消息' ? 'color:#6BDB94;' : ''">订单消息</p>
      </div>
    </div>

    <div class="container" id="infor_group">
      <div
        class="infor_group"
        v-for="(item, index) in notice_data"
        :key="index"
        @click="$fnc.toLinks(item.links)"
      >
        <div class="time">
          <span>{{ $fnc.getTimeFormat(item.created_time) }}</span>
        </div>
        <div class="infor_item">
          <div class="title">
            <img src="@/assets/img/notice/order.png" v-if="item.types == 2" />
            <img
              src="@/assets/img/notice/zhuce.png"
              v-else-if="item.types == 1"
            />
            <img
              src="@/assets/img/notice/zijing.png"
              v-else-if="item.types == 4"
            />
            <img src="@/assets/img/notice/shenghe.png" v-else />
            <p>{{ item.title }}</p>
          </div>
          <div class="infor">
            <p v-for="(it, t) in toArr(item.content)" :key="t">
              {{ it }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </mescroll-vue>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  name: "notice",
  components: {
    MescrollVue,
  },
  data() {
    return {
      active: 0,
      notice_data: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        mustToTop: true,
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        offset: 1000,
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10, //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 0, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "notice",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000, //列表滚动500px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "infor_group", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~", //提示
        },
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  methods: {
    toArr(str) {
      try {
        return str.split("，");
      } catch {
        return [];
      }
    },
    changeTab(val) {
      this.active = val;
      this.notice_data = [];
      if (this.mescroll) {
        this.mescroll.resetUpScroll();
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      var params = {};
      params.page = page.num;
      params.types = this.active;
      this.$api.getPage.get_myletter(params).then((res) => {
        if (res.code == 200) {
          let arr = res.result;
          // 如果是第一页需手动置空列表
          if (page.num === 1) this.notice_data = [];
          // 下拉刷新
          // 把请求到的数据添加到列表
          this.notice_data = this.notice_data.concat(arr);
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
  created() {},
};
</script>
<style lang="less" scoped>
.notice_box {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f4f4;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    background-color: #fff;
    padding-top: 20px;
    padding-bottom: 15px;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      > img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
      > p {
        margin-top: 6px;
        font-size: 15px;
        line-height: 15px;
        color: #818181;
      }
    }
  }
  .container {
    padding-bottom: 20px;
    flex: 1;
    height: 100%;
    overflow: auto;
    .infor_group {
      display: flex;
      flex-direction: column;
      .time {
        margin-top: 15px;
        align-self: center;
        background-color: #d6d6d6;
        height: 21px;
        padding: 0 8px;
        border-radius: 21px;
        display: flex;
        justify-content: center;
        align-items: center;
        > span {
          font-size: 11px;
          line-height: 11px;
          color: #fefefe;
        }
      }
      .infor_item {
        background-color: #fff;
        border-radius: 8px;
        padding: 14px 12px;
        margin: 0 10px;
        margin-top: 16px;
        .title {
          display: flex;
          display: flex;
          align-items: center;
          > img {
            width: 20px;
            height: 20px;
            margin-right: 5px;
          }
          > p {
            font-size: 17px;
            line-height: 17px;
            font-weight: 500;
          }
        }
        .infor {
          margin-top: 10px;
          > p {
            font-size: 15px;
            line-height: 24px;
            color: #bfbfbf;
          }
        }
      }
    }
  }
}
</style>