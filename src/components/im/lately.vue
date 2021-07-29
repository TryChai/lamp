<template>
  <mescroll-vue
    ref="mescroll"
    :down="mescrollDown"
    :up="mescrollUp"
    @init="mescrollInit"
    id="im-page-vip"
    class="fx_3"
  >
    <van-nav-bar
      title="最新消息"
      left-arrow
      class="navbar"
      :border="false"
      @click-left="toBack"
    />
    <div class="bgwrite">
      <div class="tdgl_con">
        <latelyActivity
          :conversation="activi"
          v-if="JSON.stringify(activi) != '{}'"
        />
        <latelyActivity
          :isActivi="false"
          :conversation="xt"
          v-if="JSON.stringify(xt) != '{}'"
        />
        <lately-item
          v-for="(item, index) in conversationList"
          :key="index"
          :conversation="item"
        />
      </div>
    </div>
  </mescroll-vue>
</template>

<script>
import { mapState } from "vuex";
import latelyItem from "./lately/lately-item";
import latelyActivity from "./lately/lately-activity";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  data() {
    return {
      userList: this.$store.state.imUserList || [],
      loadModal: false,
      im: "",
      im_sig: "",
      showDialog: false,
      activi: {},
      xt: {},
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false,
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        use: false,

        callback: () => {}, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10, //每页数据条数,默认10
        },
        loadFull: {
          use: false,
          delay: 1500,
        },
        htmlNodata: "",
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "im-page-vip",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000, //列表滚动1000px才显示回到顶部按钮
        },
        // empty: {
        //     //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
        //     warpId: "page", //父布局的id (1.3.5版本支持传入dom元素)
        //     icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
        //     tip: "暂无相关数据~" //提示
        // }
      },
    };
  },
  destroyed() {},
  components: {
    latelyItem,
    latelyActivity,
    MescrollVue,
  },
  computed: {
    ...mapState({
      conversationList: (state) => state.conversation.conversationList,
      currentConversation: (state) => state.conversation.currentConversation,
    }),
    getUserList() {
      return this.$store.state.imUserList;
    },
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    getActivitMsg() {
      this.$api.getIm.getActivitMsg({}).then((res) => {
        if (res.code == 200 && res.result) {
          this.activi = res.result;
        }
      });
    },
    getXtMsg() {
      this.$api.getIm.getXtMsg({}).then((res) => {
        if (res.code == 200 && res.result) {
          this.xt = res.result;
        }
      });
    },
  },
  created() {
    this.$store.commit("updateCurrentConversation", "");
  },
  watch: {
    getUserList(val) {
      this.userList = val;
    },
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
};
</script>

<style scoped lang='less'>
.im-status {
  position: relative;
  .status-bg {
    position: absolute;
    width: 1.33333rem;
    height: 1.33333rem;
    border-radius: 0.26667rem;
    background: rgba(221, 221, 221, 0.7);
  }
  span {
    position: absolute;
    bottom: 0;
    right: 0px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #00f742;
  }
  .isStatus {
    background: #d5dcd7;
  }
}
.tdgl_con {
  margin-top: 6px;
  width: 100%;
  padding: 0 17px 0px;
  background-color: #fff;
  padding-bottom: 0;
  background: #fff;
  width: 100%;
  height: 70%;
  overflow-y: auto;
  top: 3.2rem;
}
.tdgl_con_top {
  border-bottom: solid 1px #ebebeb;
  height: 75px;
  padding: 18px 0;
}
.tdgl_con_top_div1 {
  color: #4c4c4c;
  font-size: 16px;
  height: 16px;
  line-height: 16px;
}
.tdgl_con_top_div2 {
  color: #999999;
  font-size: 12px;
  height: 12px;
  line-height: 12px;
  margin-top: 12px;
}
.tdgl_con_top_img1 {
  height: 28px;
  margin-top: 13px;
  width: 8px;
}
.tdgl_con_top_img2 {
  width: 34px;
  height: 34px;
  border: solid 4px #fff;
  border-radius: 50%;
}
.tdgl_con_top_div3 {
  border: solid 1px #c9cdd9;
  width: 32px;
  height: 37px;
  border-radius: 50%;
  position: relative;
  margin-right: -6px;
  background-color: #fff;
}
.tdgl_con_tx {
  margin-right: 13px;
}

.im-com {
  /* position: fixed; */
  width: 100%;
  // height: 140px;
}
.bgwrite {
  height: 100%;
}
</style>
