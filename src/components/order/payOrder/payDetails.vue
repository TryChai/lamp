<template>
  <div class="pay_details_con" id="payDetails">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scol">
      <div class="pay_details_head">
        <i></i>
        <p>
          <van-icon name="checked" size="24px" color="#fff" />
          <span>{{info.is_pay==1?'支付成功':'支付中...'}}</span>
        </p>
        <p>实付S$ {{$fnc.toFixedZ(info.money)}}</p>
        <p v-if="info.send_score">{{info.send_score}}</p>
        <div class="tc">
          <van-button round size="small" replace to='/index' type="default">返回首页</van-button>
          <van-button round size="small" replace :to="'/order/orderdetails?id='+$route.query.id" type="default">查看订单</van-button>
        </div>
      </div>
      <div class="pay_details_oder fx">
        <!-- <img src="../../../assets/img/order/03.png" alt> -->
        <div style="margin-left:30px">
          <p>您的订单编号为：</p>
          <p v-for="(item,i) in oid_arr" :key="i">{{item}}</p>
          <p>支付时间：{{$fnc.getTimeFormat(info.pay_time)}}</p>
        </div>
      </div>
      <div class="pay_details_con">
        <!-- <couponItem/> -->
        <!-- <img src="../../../assets/img/order/04.png" alt> -->
        <!-- <div class="pay_details_con_title">
          <p>
            <van-icon name="bell" />
            <span>安全提醒</span>
          </p>
          <div class="pay_details_con_title_d1">
            平台不会通过任何非官方电话，QQ，微信，与您联系，也不会要求您点击链接进行退款或取消订单</div>
          <div class="fx">
            <img src="../../../assets/img/order/06.png" alt>
            <span>继续剁手</span>
            <img src="../../../assets/img/order/05.png" alt>
          </div>
        </div> -->
      </div>

      <!-- <div class="order_prod">
        <indexshoplist :top_shoplist='list' class="shop-search-con" />
      </div> -->

      <coupon :show="coupon_show" coupon_type="下单优惠券" :da="coupon_list" @close_coupon="reveive_close"
          style="width: 72%;margin: 0 auto;background-color: transparent">
      </coupon>

      <turn @send_isturn="receive_isturn" :con="'支付后'" :show="turn_show"></turn>

      <van-popup v-model="consumption_show" get-container="body" style="width: 90%;background: none;">
        <div class="consumption">
          <img class="consumption-top" width="100%" src="@/assets/img/home/red1.gif" />
          <img class="consumption-top1" width="100%" src="@/assets/img/xfhb.png" />
          <p>恭喜获取{{consumption.red_quantity}}张分享券</p>
          <div class="hbq">
            <div class="hbq_1" v-if="consumption.red_data">
              <p>￥<span>{{$fnc.toFixedZ(consumption.red_data.money)}}</span></p>
              <div>
                <p>{{consumption.red_data.title}}</p>
                <p v-if="consumption.red_data.cdn_xfm > 0">消费满{{$fnc.toFixedZ(consumption.red_data.cdn_xfm,0)}}可使用</p>
                <p v-if="consumption.red_data.lifetime">红包将于{{(consumption.red_data.lifetime)}}天后过期</p>
              </div>
            </div>
          </div>
          <p class="hbq_btn" @click="shareShow" v-if="isWx == 0">
            <van-button type="primary">立即分享</van-button>
          </p>
          <p class="hbq_btn" @click="shareApp" v-else>
            <van-button type="primary">立即分享</van-button>
          </p>
        </div>
      </van-popup>

      <van-popup v-model="share_show" style="background: none;width: 100%;height: 100%;" @click="share_show = false">
        <div class="share_show">
          <img src="../../../assets/img/assemble/share-wx.png" alt="">
        </div>
      </van-popup>
    </mescroll-vue>
  </div>
</template>

<script>
import couponItem from "@/components/currency/couponItem";
import MescrollVue from "mescroll.js/mescroll.vue";
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
import {
  setTimeout
} from 'timers';
import wx from "weixin-js-sdk";
import coupon from "@/components/page/new-coupon/new-coupon.vue";
import turn from '@/components/page/turn';
export default {
  components: {
    couponItem,
    MescrollVue,
    indexshoplist,
    coupon,
    turn
  },
  data () {
    return {
      oid_arr: [],
      turn_show: false,
      is_turn: Boolean,
      coupon_list: [{
        money: "",
        desc: "",
        xfm: "",
        end_time: ""
      }],
      coupon_show: false,
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
          src: require("../../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      },
      list: [],
      consumption_show: false, //显示消费红包
      consumption: {}, //消费红包
      share_show: false,
      isWx: "0"
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
    // if(thta.info.is_pay==1){
    //   setTimeout(()=>{
    //     thta.getOrderInfo();
    //   },3000)
    // }

  },
  methods: {
    shareShow () {
      this.consumption_show = false;
      this.share_show = true;
    },
    shareApp () {
      try {
        var obj = this.$store.state.appShareObj || {};
        this.$fnc.appShare(
          obj.title,
          obj.title,
          obj.link,
          obj.link,
          obj.desc,
          obj.imgUrl
        );
      } catch (error) {
        this.$toast.fail("分享失败！");
      }
    },
    receive_isturn (val) {
      this.is_turn = val;
      if (!val && JSON.stringify(this.consumption) != '{}') {
        if (JSON.stringify(this.consumption.red_data) != '{}' && this.consumption.red_data != undefined) {
          this.consumption_show = true;
          this.share(); //分享
        }
      }
    },
    reveive_close () {
      this.coupon_show = false;
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback (page, mescroll) {
      this.$api.getOrder.getOrderProduct({
        page: page.num,
        page_size: 20
      }).then(res => {
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
      this.$api.getOrder.IsSuccessOrder(params).then(res => {
        if (res.code == 200) {
          //已支付
          this.info = res.result;
          var oid = res.result.oid;
          this.oid_arr = []
          if (oid.indexOf(',') >= 0) {
            this.oid_arr = oid.split(',')
          } else {
            this.oid_arr.push(res.result.oid)
          }
          this.coupon_list = res.result.coupon || [];
          if (res.result.is_pay == 1) {
            // if (this.is_turn) {
            //   this.turn_show = true;
            // } else {
            //   JSON.stringify(this.coupon_list) != '[]' ? this.coupon_show = true : ""
            // }
            var params = {}
            params.con = '支付后';
            params.oid = this.$route.query.id;
            this.$api.getPage.is_turntable(params).then(res => {
              if (res.code == 200 && res.result != false) {
                this.turn_show = true;
              } else {
                JSON.stringify(this.coupon_list) != '[]' ? this.coupon_show = true : ""
              }
            })
          }
          //消费红包
          if (res.result.is_packet_xf == '1') {
            this.$api.getOrder.getCoupon({
              oid: oid
            }).then(res => {
              if (res.code == 200) {
                this.consumption = res.result;
                if (!this.is_turn) {
                  if (JSON.stringify(this.consumption.red_data) != '{}' && this.consumption.red_data && this.consumption.red_data != undefined) {
                    this.consumption_show = true;
                    this.share(); //分享
                  }
                }
              }
            })
          }
        }
      });
    },
    share () {
      //分享红包
      var obj = {};
      obj.title = "随机大包花落谁家！";
      obj.desc = "大红包随机出没，手快有，手慢无~";
      obj.imgUrl =
        "https://inexweb.oss-cn-shenzhen.aliyuncs.com/yingke/resource/image/default/202009/dde971d86839c7f46c1ff2214d5cb61b.png";
      obj.link =
        location.origin +
        "/order/tuhu_redbag?oid=" +
        this.info.oid;
      try {
        this.$fnc.isXcx().then(ress => {
          if (ress == "true" || ress == true) {
            // this.isxcx = true;
            var obj2 = {};
            obj2.title = obj.title;
            obj2.desc = obj.desc;
            obj2.piclink = obj.imgUrl;
            obj2.url = obj.link;
            wx.miniProgram.postMessage({
              data: obj2
            });
          }
        }).catch(err => {
          if (err == "web") {
            new Error("1005 web");
          }
        });
      } catch (err) {
        if (err == "web") {
          new Error("1005 web");
        }
      }

      //公众号分享
      this.$store.commit("setAppShareObj", obj);
      this.$wxshare(obj);
    }
  },
  mounted () {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.isWx = "0"; //第一个微信端
    } else if (ua.match(/ykapp/i) == "ykapp") {
      this.isWx = "1"; //第二个app
    }
    console.log("APP或小程序：", this.isWx);
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

  > img {
    max-width: 100%;
  }

  .pay_details_head {
    height: 186px;
    background: url("../../../assets/img/order/01.jpg") no-repeat;
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

.consumption {
  width: 100%;
  position: relative;

  .consumption-top{
    position: absolute;
    top: -22px;
  }
  .consumption-top1{
    position: absolute;
    top: 0px;
  }

  > p:nth-of-type(1) {
    font-size: 30px;
    font-weight: bold;
    color: #fff;
    height: 210px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
  }

  .hbq {
    display: flex;
    align-items: flex-end;
    margin-left: 50px;
    height: 100px;
    position: relative;

    .hbq_1 {
      display: flex;
      align-items: center;

      > p {
        font-size: 12px;

        span {
          font-size: 35px;
          text-align: center;
          color: #000;
        }
      }

      > div {
        margin-left: 10px;
        line-height: 22px;
        font-size: 14px;
      }
    }
  }

  .hbq_btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;

    .van-button--primary {
      background: #fbec51;
      color: #fa254a;
      font-size: 20px;
      width: 171px;
      border-radius: 25px;
      text-align: center;
      border: 0.02667rem solid #fbec51;
      font-weight: bold;
    }
  }
}

.share_show {
  img {
    width: 100%;
  }
}
</style>
