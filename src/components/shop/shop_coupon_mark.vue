<template>
  <div class="container coupon_bg" id="mescroll">
    <van-nav-bar left-text left-arrow class="navbar" title="卷集市" @click-left="toBack">
    </van-nav-bar>
    <div class="mark">
      <div class="mark_top">
        <img src="./../../assets/img/shop/coupon_mark_top.png" alt="">
      </div>
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scol">
        <div class="mark_body">
          <div class="mark_title">
            <p>卷
              <van-icon name="stop" class="mark_title_icon" />
              集
              <van-icon name="stop" class="mark_title_icon" />
              市
            </p>
            <!--                        <van-icon name="info-o" class="mark_title_right"></van-icon>-->
          </div>
          <div class="mark_content">
            <div class="mark_item" v-for="(item,i) in coupon_list" :key="i">
              <div class="mark_item_box">
                <div class="mark_item_box_left">
                  <img :src="$fnc.getImgUrl(item.p_piclink || require('./../../assets/img/home/red.png'))" alt="">
                </div>
                <div class="mark_item_box_middle">
                  <p @click="$router.push({path:'/shop/shopdetails',query:{id:item.cdn_pid}})">
                    {{item.p_title || item.title}}</p>
                  <p>代驾红包</p>
                  <p>{{item.money |tofix_two}}<span>满{{item.cdn_xfm}}可用</span>
                  </p>
                </div>
                <div class="mark_item_box_right">
                  <div class="mark_item_box_right_top">
                    <p>消耗积分</p>
                    <p>-<img src="./../../assets/img/shop/mark_dou.png" alt="">{{item.jf_change}}-</p>
                  </div>
                  <div class="mark_item_box_right_bottom">
                    <span @click="exchange_coupon(item)">立即兑换</span>
                  </div>
                </div>
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
import getShop from "../../assets/js/api/require/shop";
export default {
  name: "shop_coupon_mark",
  components: {
    MescrollVue
  },
  data () {
    return {
      coupon_list: [],
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
          warpId: "shop_con",
          src: require("../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "mescroll", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        },
      },
    }
  },
  created () {
    // this.get_coupon_list();
  },
  methods: {
    mescrollInit (mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback (page, mescroll) {
      this.$api.getShop.get_mark_list({ page: page.num }).then(res => {
        if (res.code == 200) {
          let arr = res.result;
          // 如果是第一页需手动置空列表
          if (page.num === 1) this.coupon_list = [];
          // 把请求到的数据添加到列表
          this.coupon_list = this.coupon_list.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        } else {
          mescroll.endErr();
        }
      })
    },
    exchange_coupon (item) {          //兑换优惠卷
      item.money = Math.floor(parseFloat(item.money) * 100) / 100;
      this.$dialog.confirm({
        message: `是否消耗${item.jf_change}积分兑换${item.money}元优惠卷`
      }).then(() => {
        this.$api.getShop.exchange_mark({ id: item.id }).then(res => {
          if (res.code == 200) {
            this.$toast.fail("兑换成功");
            setTimeout(() => {
              this.$router.push({ path: '/shop/shopcoupon' })
            }, 500)

          } else {
            this.$toast.fail(res.result)
          }
        })
      }).catch(() => {
        // on cancel
      });

    },
    get_coupon_list () {
      this.$api.getShop.get_mark_list({}).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.coupon_list = res.result
        }
      })
    }
  },
  filters: {
    tofix_two (val) {
      return Math.floor(parseFloat(val) * 100) / 100
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
  },

}
</script>

<style scoped>
.mark_top {
  width: 100%;
  height: 140px;
}
.mark_top img {
  width: 100%;
}
.mark_body {
  width: 94.5%;
  margin: 0 auto;
}
.mark_title {
  width: 100%;
  height: 45px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.mark_title > p {
  font-size: 20px;
  line-height: 45px;
  font-weight: bold;
  color: #fe7316;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  letter-spacing: 3px;
}
.mark_title_icon {
  transform: rotate(45deg);
}
.mark_title_right {
  font-size: 18px;
  /*font-weight: bold;*/
  color: #fe7316;
}
.mark_content {
  width: 100%;
}
.mark_item {
  width: 100%;
  margin-top: 10px;
}
.mark_item p {
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  letter-spacing: 1px;
}
.mark_item_box {
  width: 100%;
  height: 110px;
  margin-top: 10px;
  background: url("./../../assets/img/shop/mark_bj.png") no-repeat left bottom /
    100% 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.mark_item_box_left {
  width: 30%;
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mark_item_box_left img {
  /* width: 100%; */
  height: 100%;
}
.mark_item_box_middle {
  width: 50%;
  height: 110px;
  padding: 5px 5px 0 5px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: flex-start;
}
.mark_item_box_middle p:nth-of-type(1) {
  width: 100%;
  font-size: 14px;
  color: #000000;
  font-weight: normal;
  letter-spacing: 0;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mark_item_box_middle p:nth-of-type(2) {
  font-size: 12px;
  color: #999;
}
.mark_item_box_middle p:nth-of-type(3) {
  color: #f72e2e;
  line-height: 40px;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 1.2;
}
.mark_item_box_middle p:nth-of-type(3) span {
  color: #f72e2e;
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0;
  padding-left: 5px;
}
.mark_item_box_right {
  width: 20%;
  height: 110px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
}
.mark_item_box_right_top p:nth-of-type(1) {
  font-size: 12px;
  line-height: 30px;
  font-weight: normal;
  color: #f72e2e;
  text-align: center;
}
.mark_item_box_right_top p:nth-of-type(2) {
  font-size: 14px;
  font-weight: bold;

  color: #f72e2e;
  text-align: center;
}
.mark_item_box_right_top p:nth-of-type(2) img {
  width: 15px;
  margin: 0 2px;
}
.mark_item_box_right_bottom span {
  background-color: #fa0946;
  padding: 5px 10px;
  color: #ffffff;
  border-radius: 15px;
  font-size: 10px;
}
</style>