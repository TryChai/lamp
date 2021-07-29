<template>
  <div class="pay_details_con" id="payDetails">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scol">
      <div class="pay_details_head">
        <i></i>
        <p>
          <van-icon name="checked" size="24px" color="#fff" />
          <span>{{info.is_pay==1?'支付成功':'支付中...'}}</span>
        </p>
        <p>实付￥ {{$fnc.toFixedZ(info.money)}}</p>

        <div class="tc">
          <van-button round size="small" replace @click="backbtn" type="default">返回</van-button>
          <van-button round size="small" replace to='/pay/record?type=1' type="default">查看记录</van-button>
        </div>
      </div>
      <div class="pay_details_oder fx">
        <img src="../../assets/img/order/03.png" alt>
        <div>
          <p>您的订单编号为：{{info.oid}}</p>
          <p>支付时间：{{$fnc.getTimeFormat(info.pay_time)}}</p>
        </div>
      </div>
      <p v-if="info.send_score">{{info.send_score}}</p>
      <div class="pay_details_con">
        <!-- <couponItem/> -->
        <!-- <img src="../../../assets/img/order/04.png" alt> -->
        <div class="pay_details_con_title">
          <p>
            <van-icon name="bell" />
            <span>安全提醒</span>
          </p>
          <div class="pay_details_con_title_d1">
            平台不会通过任何非官方电话，QQ，微信，与您联系，也不会要求您点击链接进行退款或取消订单</div>
          <div class="fx">
            <img src="../../assets/img/order/06.png" alt>
            <span>继续剁手</span>
            <img src="../../assets/img/order/05.png" alt>
          </div>
        </div>
      </div>

      <div class="order_prod">
        <indexshoplist :top_shoplist='list' class="shop-search-con" />
      </div>

    </mescroll-vue>
  </div>
</template>

<script>
import couponItem from "@/components/currency/couponItem";
import MescrollVue from "mescroll.js/mescroll.vue";
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
import { setTimeout } from 'timers';
export default {
  name: "payDetails",
  components: {
    couponItem,
    MescrollVue,
    indexshoplist
  },
  data () {
    return {
      info: {},
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        mustToTop: true
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)

      mescrollUp: {
        offset: 1000,

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
          warpId: "payDetails",
          src: require("../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      },
      list: []
    };
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
  created () {

    this.getOrderInfo();
    var thta = this;

  },
  methods: {
    backbtn () {
      var backurl = localStorage.getItem('recharegeBackUrl')
      if (backurl != null && backurl != '' && backurl != undefined) {
        localStorage.removeItem('recharegeBackUrl')
        this.$router.push(backurl)
      } else {
        this.$router.push('/pay/recharge')
      }
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback (page, mescroll) {
      this.$api.getOrder.getOrderProduct({ page: page.num, page_size: 20 }).then(res => {
        if (res.code == 200) {
          let arr = res.result.product;

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
    getOrderInfo () {
      var params = {};
      params.id = this.$route.query.id || "";
      this.$api.getPay.isRechargePay(params).then(res => {
        if (res.code == 200) {
          this.info = res.result;
          if (res.result.is_pay == 0) {
            setTimeout(() => {
              this.getOrderInfo();
            }, 3000)
          }
        }
      });
    }
  }
};
</script>


<style lang="less" scoped>
.scol {
  position: fixed;
  top: 0;
  width: 100%;
}
.order_prod {
  overflow: auto;
  width: 100%;
}
.pay_details_con {
  background: #f3f3f3;
  line-height: 1;
  overflow: auto;
  font-size: 14px;
  height: 100%;
  > img {
    max-width: 100%;
  }
  .pay_details_head {
    height: 186px;
    background: url("../../assets/img/order/01.jpg") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    > p:nth-child(2) {
      text-align: center;
      margin-top: 35px;
      i {
        vertical-align: bottom;
      }
      span {
        font-size: 23px;
        font-weight: bold;
        color: #fff;
      }
    }
    > p:nth-child(3) {
      color: #fff;
      text-align: center;
      margin-top: 14px;
    }
    > p:nth-child(4) {
      color: #fff;
      text-align: center;
      margin-top: 14px;
    }
    > div {
      margin-top: 10px;
      > button {
        margin: 0 10px;
        width: 125px;
        color: #ffffff;
        background: none;
        border: 1px solid #fff;
      }
    }
  }
  .pay_details_oder {
    background: #fff;
    padding: 10px 8px;
    margin: -28px 12px 0;
    border-radius: 10px;
    justify-content: flex-start;
    > img {
      width: 36px;
      height: 36px;
      margin-right: 11px;
    }
    > div {
      color: #999999;
      > p {
        font-size: 13px;
      }
      > p + p {
        margin-top: 6px;
      }
    }
  }
  .pay_details_con {
    margin: 12px 12px;
  }
  > .pay_details_con_title {
    margin: 19px 0 0;
    > p {
      color: #252525;
      margin-bottom: 13px;
      i {
        vertical-align: bottom;
        margin-right: 5px;
      }
    }
    > div.pay_details_con_title_d1 {
      font-size: 14px;
      line-height: 1.4;
      color: #999999;
      margin-bottom: 13px;
    }
    > div.fx {
      justify-content: center;
      > img {
        max-width: 100%;
      }
      > span {
        font-size: 18px;
        font-weight: bold;
        color: #2d2d2d;
      }
    }
  }
}
</style>
