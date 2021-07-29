<template>
  <div class="container con_bg" id="activemsg">
    <van-nav-bar title="活动消息" left-text left-arrow class="navbar" @click-left="toBack"></van-nav-bar>

    <div class="notice_box">
      <mescroll-vue
        ref="mescroll"
        :down="mescrollDown"
        :up="mescrollUp"
        @init="mescrollInit"
        class="scol"
        style="margin-top: 50px;"
      >
        <div class="notice_item" v-for="item in notice_data" :key="item.id">
          <div class="notice_time">
            <span>{{$fnc.getTimeFormat(item.created_time)}}</span>
          </div>
          <div class="notice_content">
            <p  v-html="item.msg"></p>
            <div class="notice_bottom">
              <div class="notice_img" v-if="item.piclink">
                <router-link :to="item.links"><img v-lazy='item.piclink' alt /></router-link>
              </div>
            </div>
          </div>
        </div>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  name: "activemsg",
  components: {
    MescrollVue
  },
  data() {
    return {
      notice_data: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        mustToTop: true
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
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
        noMoreSize: 0, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "activemsg",
          src: require("../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动500px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "activemsg", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      }
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
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      this.$api.getPage.getActivimsg({ page: page.num }).then(res => {
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
    }
  },
  created() {
    // this.$api.getPage.get_myletter({}).then(res=>{
    //     console.log(res.result)
    // })
  }
};
</script>

<style scoped>
.notice_box {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-content: center;
  margin-bottom: 60px;
  position: fixed;
  top: 0;
  height: 100%;
  overflow: auto;
}
.notice_item {
  width: 92%;
  margin: 0 auto 5px auto;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-content: center;
}
.notice_time {
  width: 100%;
  display: flex;
  justify-content: center;
}
.notice_time span {
  font-size: 12px;
  color: #ffffff;
  padding: 0px 10px;
  margin: 10px 0;
  border-radius: 10px;
  background-color: #dedede;
}
.notice_content {
  background-color: #ffffff;
  padding: 5px 15px 8px 15px;
  border-radius: 10px;
}
.notice_content > p {
  font-size: 16px;
  color: #1c1c1c;
  line-height: 40px;
  font-weight: normal;
}
.notice_bottom {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: center;
}
.notice_img {
  /* width: 25%; */
}
.notice_img img {
  max-width: 100%;
}
.notice_right {
  width: 70%;
}
.notice_right2 {
  width: 100%;
}
.notice_right p,
.notice_right2 p {
  font-size: 14px;
  color: #828282;

  text-justify: inter-character;
}
.notice_right a,
.notice_right2 a {
  font-size: 14px;
  color: #828282;

  text-justify: inter-character;
}
.notice_footer {
  width: 100%;
  height: 60px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: #ffffff;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
}
.notice_footer_btn {
  width: 50%;
  display: flex;
  justify-content: center;
  align-content: center;
}
.notice_footer_btn span {
  font-size: 16px;
  color: #7a7a7a;
  text-align: center;
  line-height: 60px;
}
</style>