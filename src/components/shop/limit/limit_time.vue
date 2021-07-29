<template>
  <div class="container limit_bg">
    <div class="limit_top">
      <div class="limit_top_title">
        <van-icon name="arrow-left" @click="toBack"></van-icon>
        <p>限时特惠</p>
        <div class="limit_top_title_right">
          <!-- <van-icon name="apps-o"></van-icon>
          <van-icon name="ellipsis"></van-icon> -->
        </div>
      </div>
      <div class="limit_top_menu">
        <van-tabs
          v-model="sel_cate.id"
          title-active-color="#ffffff"
          title-inactive-color="#f89faa"
          line-width="0"
          :border="false"
          :swipeable="true"
          :line-height="0"
          style="background-color: transparent; width: 100%"
        >
          <van-tab v-for="(item, i) in cate_list" :name="item.id" :key="i">
            <div
              slot="title"
              class="limit_top_menu_title"
              @click="tab_click(item)"
            >
              <p>{{ $fnc.getTimeHour(item.begin_time) }}</p>
              <p v-if="item.types == '已开始'">抢购中</p>
              <p v-if="item.types == '未开始'">未开始</p>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      id="limit_time"
    >
      <div class="limit_body" v-if="types">
        <div class="limit_body_time">
          <p v-if="types == '已开始'">抢购中，先下单先得哦</p>
          <p v-if="types == '未开始'">未开始，敬请期待</p>
          <div class="limit_body_time_right">
            <p v-if="types == '已开始'">距结束</p>
            <p v-if="types == '未开始'">距开始</p>
            <van-count-down
              :time="
                types == '已开始'
                  ? sel_cate.distance_end_time * 1000
                  : sel_cate.distance_begin_time * 1000
              "
              v-if="types"
            >
              <template #default="timeData">
                <div class="limit_body_time_right_p">
                  <p>
                    <span>{{
                      timeData.days * 24 + timeData.hours > 10
                        ? timeData.days * 24 + timeData.hours
                        : "0" + Number(timeData.days * 24 + timeData.hours)
                    }}</span>
                    :
                    <span>{{
                      timeData.minutes > 10
                        ? timeData.minutes
                        : "0" + timeData.minutes
                    }}</span>
                    :
                    <span>{{
                      timeData.seconds > 10
                        ? timeData.seconds
                        : "0" + timeData.seconds
                    }}</span>
                  </p>
                </div>
              </template>
            </van-count-down>
          </div>
        </div>
        <div class="limit_body_shop" v-if="this.dataList.length >= 1">
          <div
            class="limit_body_shop_box"
            v-for="(item, i) in dataList"
            :key="i"
          >
            <shopitem :shop="item"></shopitem>
          </div>
        </div>
      </div>
    </mescroll-vue>
    <div
      class="make_an_appointment"
      v-if="sel_cate.types == '未开始'"
      @click="makeAppointment"
    >
      <van-button type="warning">{{
        sel_cate.is_notice == "0" ? "预约" : "取消预约"
      }}</van-button>
    </div>
  </div>
</template>
<script>
import shopitem from "@/components/shop/limit/limit_shop";
import MescrollVue from "mescroll.js/mescroll.vue";
import { CountDown } from "vant";
export default {
  name: "limit_time",
  data() {
    return {
      types: "",
      set_time: {},
      time: {
        day: "",
        hour: "",
        minute: "",
        second: "",
        type: "",
      },
      begin_time: "",
      end_time: "",
      sel_cate: {},
      cate_list: [],
      dataList: [],
      active: "",
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false,
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        loadFull: {},
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
          warpId: "limit_time",
          src: require("../../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000, //列表滚动500px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "limit_time", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~", //提示
        },
      },
    };
  },
  components: {
    shopitem,
    MescrollVue,
    [CountDown.name]: CountDown,
  },
  created() {
    this.get_limitcate();
  },
  methods: {
    tab_click(item) {
      this.types = item.types;
      this.sel_cate = item;
      this.dataList = []; // 在这里手动置空列表,可显示加载中的请求进度
      this.mescroll.resetUpScroll(); // 刷新列表数据
      clearTimeout(this.set_time);
      this.time_count();
    },
    get_limitcate() {
      this.$api.getShop.get_limittime().then((res) => {
        if (res.code == 200) {
          this.cate_list = res.result;
          this.sel_cate = res.result[0] || {};
          if (res.result.length > 0) {
            this.types = res.result[0].types;
          }
          if (this.sel_cate.id) {
            this.mescroll.resetUpScroll(); // 刷新列表数据
            clearTimeout(this.set_time);
            this.time_count();
          } else {
            this.mescroll.endSuccess(0);
          }
        }
      });
    },
    addNumber(num) {
      var num = num > 9 ? num : "0" + num;
      return num;
    },
    time_count() {
      let time = "";
      if (this.sel_cate.types == "已开始") {
        time = this.sel_cate.end_time + "000";
      } else {
        time = this.sel_cate.begin_time + "000";
      }
      let now_time = Date.now();
      let dif_time = "";
      if (now_time > time) {
        dif_time = Math.round((now_time - time) / 1000);
      } else {
        dif_time = Math.round((time - now_time) / 1000);
      }
      this.time.day = parseInt(dif_time / 3600 / 24);
      this.time.hour = parseInt((dif_time / 3600) % 24); //获取还剩多少小时
      this.time.minute = parseInt((dif_time / 60) % 60); //获取还剩多少分钟
      this.time.second = dif_time % 60; //获取还剩多少秒
      this.set_time = setTimeout(this.time_count, 1000);
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      if (this.sel_cate.id) {
        this.$api.getShop
          .get_limitshop({
            page: page.num,
            id: this.sel_cate.id,
          })
          .then((res) => {
            if (res.code == 200) {
              // console.log(this.dataList);
              let arr = res.result;
              // 如果是第一页需手动置空列表
              if (page.num == 1) this.dataList = [];
              // 把请求到的数据添加到列表
              this.dataList = this.dataList.concat(arr);
              if (this.dataList.length > 0)
                this.dataList.forEach((item) => {
                  item.types = this.types;
                });

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
    makeAppointment() {
      //预约
      let params = {
        id: this.sel_cate.id,
      };
      this.$api.getShop.makeAnAppointment(params).then((res) => {
        if (res.code == 200) {
          if (this.sel_cate.is_notice == "1") {
            this.$toast.success("取消预约");
            this.$set(this.sel_cate, "is_notice", 0);
          } else {
            this.$toast.success("预约成功");
            this.$set(this.sel_cate, "is_notice", 1);
          }
        }
      });
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
  beforeDestroy() {
    clearTimeout(this.set_time);
  },
  watch: {},
};
</script>
<style scoped lang="less">
.limit_bg {
  background-color: #f3f3f3;
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
}

.limit_top {
  width: 100%;
  /* height: 95px; */
  background: -webkit-linear-gradient(left, #fe4678, #e22319);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #fe4678, #e22319);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #fe4678, #e22319);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #fe4678, #e22319);
  /* 标准的语法 */
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
}

.limit_top_title {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.limit_top_title > .van-icon {
  width: 20%;
  font-size: 24px;
  color: #ffffff;
}

.limit_top_title p {
  width: 60%;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}

.limit_top_title_right {
  width: 20%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
}

.limit_top_title_right .van-icon {
  font-size: 24px;
  color: #ffffff;
  padding-left: 5px;
}

.limit_top_menu {
  width: 100%;
  background-color: transparent;
}

.limit_top_menu_title {
  padding: 5px;
}

.limit_top_menu_title p:nth-of-type(1) {
  font-size: 20px;
  /* color: #ffffff; */
  font-weight: bold;
  line-height: 32px;
}

.limit_top_menu_title p:nth-of-type(2) {
  font-size: 12px;
  /* color: #ffffff; */
  /* font-weight: bold; */
  line-height: 16px;
}

.limit_body {
  width: 100%;
  background-color: #ffffff;
  margin-top: 10px;
}

.limit_body_time {
  width: 95%;
  margin: 0 auto;
  height: 30px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
}

.limit_body_time > p {
  font-size: 12px;
  color: #000000;
}

.limit_body_time .limit_body_time_right {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
}

.limit_body_time_right > p:nth-of-type(1) {
  font-size: 12px;
  color: #4d4d4d;
  padding-right: 5px;
}

.limit_body_time_right_p {
  font-size: 14px;
  color: #4d4d4d;
}

.limit_body_time_right_p p {
  font-size: 12px;
  color: #040406;
  font-weight: bold;
}

.limit_body_time_right_p p span {
  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
  background-color: #040406;
  border-radius: 5px;
  padding: 2px 5px;
  margin: 0 1px;
}

.limit_body_shop {
  width: 95%;
  margin: 0 auto;

  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
}

.limit_body_shop_box {
  width: 100%;
  border-bottom: 1px solid #eeeeee;
}

.make_an_appointment {
  .van-button--warning {
    width: 100%;
    font-size: 18px;
  }
}
</style>
