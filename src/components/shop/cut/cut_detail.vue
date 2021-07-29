<template>
  <div class="cut">
    <van-nav-bar left-text left-arrow class="navbar" title="砍价活动" @click-left="toBack"></van-nav-bar>
    <div class="cut_detail">
      <div class="cut_shop">
        <div class="cut_shop_top_success" v-if="typeof last_user.avatar != 'undefined' && typeof last_user.nickname != 'undefined' ">
          <img :src="$fnc.getImgUrl(last_user.avatar)" alt />
          <span>{{last_user.nickname}}砍价成功！</span>
        </div>
        <!-- <p class="cut_shop_top_circle_ava">
          还需砍
          <span>&nbsp {{shop.bargain_number - shop.num}}次</span>
        </p> -->
        <div class="cut_shop_top">
          <p>{{shop.title}}</p>
          <div class="cut_shop_top_circle">
            <van-circle v-model="currentRate" size="250px" :rate="shop.percent" :speed="50" color="#feead4" text="1">
              <div slot="default">
                <div class="cut_shop_top_circle_img">
                  <img v-lazy="shop.piclink" alt />
                </div>
              </div>
            </van-circle>

          </div>
          <div class="cut_shop_top_circle_p">
            <div>
              <p>原价(元)</p>
              <p>{{$fnc.toFixedZ(shop.price,2)}}</p>
            </div>
            <div>
              <p>当前价(元)</p>
              <p>{{$fnc.toFixedZ(shop.price - shop.money_all,2)}}</p>
            </div>
          </div>
        </div>
        <div class="cut_shop_bottom">
          <div class="cut_shop_bottom_left">
            <img src="./../../../assets/img/home/red.png" alt />
          </div>
          <div class="cut_shop_bottom_right">
            <p>{{shop.bargain_nickname || shop.bargain_username}}</p>
            <p>
              当前已砍
              <span>&nbsp;￥{{shop.money_all}}&nbsp;</span>元。活动商品数量有限，快分享好友继续来砍价~
            </p>
          </div>
        </div>
      </div>
      <div class="cut_time">
        <p v-if="shop.time != 0 && ( Number(this.shop.bargain_number)  - Number(this.shop.num)) != 0">砍价倒计时</p>
        <p v-if="shop.time == 0 || (Number(this.shop.bargain_number) - Number(this.shop.num) == 0)">支付倒计时</p>
        <div class="cut_time_count">
          <van-count-down millisecond :time="time">
            <template v-slot="timeData">
              <span class="item">{{ timeData.hours < 10 ? '0'+timeData.hours : timeData.hours }}</span>:
              <span class="item">{{ timeData.minutes < 10 ? '0'+timeData.minutes : timeData.minutes}}</span>:
              <span class="item">{{ timeData.seconds < 10 ? '0'+timeData.seconds : timeData.seconds}}</span>:
              <span class="item">{{ timeData.milliseconds }}</span>
            </template>
          </van-count-down>
        </div>
        <span @click="start_cut" v-if="time != 0 && shop.bargain_number - shop.num != 0 && $store.state.user.username != shop.bargain_username">
          帮
          TA 砍价
        </span>
        <span v-else-if="time != 0 && shop.bargain_number - shop.num != 0 && $store.state.user.username == shop.bargain_username"
            @click="share_btn">分享好友，多砍几刀</span>
        <span v-else>砍价结束</span>

        <p>
          <!-- <van-checkbox v-model="attention"
                        icon-size="16px"
          checked-color="#ff8a42"></van-checkbox> <span>同时关注店铺</span>-->
        </p>
        <span v-show="username == shop.bargain_username" @click="buy_cutshop">
          前往支付
          <van-icon name="arrow"></van-icon>
        </span>
      </div>
      <div class="cut_friend" v-if="shop.bargain_ar != undefined && shop.bargain_ar.length > 0">
        <p>砍价好友</p>
        <div class="cut_friend_box">
          <vueSeamlessScroll :data="shop.bargain_ar" :class-option="defaultOption" class="seamless-warp">
            <div class="cut_friend_box_item" v-for="(item, index) in shop.bargain_ar" :key="index">
              <div class="cut_friend_box_item_left">
                <img :src="$fnc.getImgUrl(item.avatar)" alt />
              </div>
              <div class="cut_friend_box_item_middle">
                <p>{{item.nickname}}</p>
                <span>{{item.remark}}</span>
              </div>
              <p class="cut_friend_box_item_right">
                砍掉
                <span>￥{{$fnc.toFixedZ(item.money)}}</span>
              </p>
            </div>
          </vueSeamlessScroll>
        </div>
      </div>

      <shopdetailsInfo :content="shop.content" v-if="shop.content" class="shop-content" />

      <div class="cut_list">
        <cut_item v-for="(item,k) in cut_list" :key="k" :info="item"></cut_item>
      </div>
    </div>
    <van-popup v-model="pop_show" position="bottom" style="background-color: transparent;" :close-on-click-overlay="false">
      <div class="pop_box">
        <div class="pop_box_img">
          <img src="./../../../assets/img/shop/cut_pop1.png" alt v-if="is_ylr == true" />
          <img src="./../../../assets/img/shop/cut_pop.png" @click="share_btn" alt v-else />
        </div>
        <div class="pop_box_content">
          <p>恭喜你！ 已砍</p>
          <p>
            ￥
            <span>{{$fnc.toFixedZ(cut_price)}}</span>
          </p>
        </div>
        <div class="pop_box_close" @click="close_pop"></div>
      </div>
    </van-popup>
    <van-popup v-model="loading_show" style="    background-color: transparent;" :close-on-click-overlay="false">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </van-popup>
    <van-popup v-model="sku_show" position="bottom" :overlay="true" style="border-radius: 5px 5px 0 0;">
      <shopDetailsSku :shopInfo="shop" :group_types="group_types" :group_id="group_id" :group="group" @closePop="sku_show = false" :toAut="1" />
    </van-popup>
    <van-popup v-model="share_show" position="top" get-container="body" class="share-zd" style=" height: 100%;background-color: transparent;"
        @click="share_show=false">
      <img src="./../../../assets/img/shop/share-wx.png" alt style="width:100%" />
    </van-popup>

    <turn @send_isturn="receive_isturn" :con="'砍价后'" :show="turn_show" @send_closepop="rec_closeturn" @send_res="returnRes" v-if="is_turn"></turn>

    <!--绑定手机号关注公众号 -->
    <!-- <md-landscape v-model="rewardinfoshow" class="index-man-pop" style="z-index: 9999;">
      <rewardinfo @closebtn="rewardinfoshow = false"></rewardinfo>
    </md-landscape> -->
    <rewardinfo v-if="rewardinfoshow" class="index-man-pop" :lottery="lottery" style="z-index: 9999;" @closebtn="closebtn"></rewardinfo>
  </div>
</template>
<script>
import {
  Circle,
  CountDown,
  Checkbox,
  Popup,
  Loading
} from "vant";
import cut_item from "@/components/shop/cut/cut_shop_item";
import shopDetailsSku from "@/components/shop/shopdetails/shopdetailssku";
import vueSeamlessScroll from "vue-seamless-scroll";
import shopdetailsInfo from "../shopdetails/shopdetailsinfo";
import rewardinfo from "@/components/currency/rewardInfo/rewardinfo";
import wx from "weixin-js-sdk";

import turn from "@/components/page/turn";
import {
  Landscape
} from 'mand-mobile'
export default {
  name: "cut_detail",
  data () {
    return {
      rewardinfoshow: false,
      turn_show: false,
      is_turn: Boolean,

      bargain_ar: [],
      username: "",
      isApp: false,
      share_show: false,
      group_types: "",
      group_id: "",
      groupShow: false,
      group: {},
      sku_show: false,
      loading_show: true,
      last_user: {
        //最后一位砍价用户
      },
      cut_price: "",
      shop: {},
      cut_list: [], //砍价商品列表
      pop_show: false,
      attention: 1,
      time: 0, //倒计时
      currentRate: 0,
      gradientColor: {
        "0%": "#3fecff",
        "100%": "#6149f6"
      },
      lottery: {}
    };
  },
  components: {
    [Circle.name]: Circle,
    [CountDown.name]: CountDown,
    [Checkbox.name]: Checkbox,
    [Popup.name]: Popup,
    [Loading.name]: Loading,
    cut_item,
    vueSeamlessScroll,
    shopDetailsSku,
    shopdetailsInfo,
    turn,
    rewardinfo,
    [Landscape.name]: Landscape
  },
  created () {
    this.$api.getUser.getUserInfo({}).then(res => {
      if (res.code == 200) {
        this.username = res.result.username;
        this.$store.commit("setUser", res.result);
      }
    });
    this.get_cut_list();
    this.get_cut_detail();
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/ykapp/i) == "ykapp") {
      this.isApp = true; //第二个app
    }
  },
  computed: {
    is_ylr () {
      //当前网站是否是一路人
      if (window.location.href.indexOf('chnpink') >= 0) {
        return true
      } else {
        return false;
      }

    },
    // 公告滚动自定义
    defaultOption () {
      return {
        step: 0.8, // 数值越大速度滚动越快
        // limitMoveNum: this.shop.bargain_ar.length, // 开始无缝滚动的数据量 this.dataList.length
        limitMoveNum: 4, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 0, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      };
    }
  },
  methods: {
    closebtn () {
      this.rewardinfoshow = false;
      this.turn_show = false;
    },
    returnRes (res) {
      //砍价后结果
      console.log("333333333333333:", res)
      this.lottery = res;
    },
    rec_closeturn (bool) {
      if (this.$fnc.isWx() && this.$store.state.config.plugin.wxgzhbb.is_open && this.$store.state.user.tel == '') {
        //如果微信端，有开公众号插件
        this.rewardinfoshow = true;
      }

    },
    receive_isturn (val) {
      this.is_turn = val;
    },
    share_btn () {
      if (this.isApp) {
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
          this.$toast.fail("分享失败");
        }
      } else {
        this.share_show = true;
      }
    },
    buy_cutshop () {
      this.sku_show = true;
    },
    close_pop () {
      this.pop_show = false;
      this.turn_show = true
    },
    start_cut () {
      let params = {};
      params.id = this.$route.query.uid;
      params.pid = this.$route.query.pid;
      this.$api.getShop.start_cut(params).then(res => {
        if (res.code == 200) {
          this.cut_price = res.result;
          this.$api.getPage.is_turntable({ con: "砍价后" }).then(res => {
            if (res.code == 200) {
              if (res.result == false || res.result == "false") {
                this.pop_show = true;
              } else {
                this.turn_show = true;
              }
            }
          })
          this.get_cut_detail();

        }
      });
    },

    get_cut_detail () {
      //砍价商品详情
      let params = {};
      params.id = this.$route.query.uid;
      params.pid = this.$route.query.pid;
      this.$api.getShop.cutshop_detail(params).then(res => {
        if (res.code == 200) {
          this.shop = res.result;
          this.shop.percent = (this.shop.num / this.shop.bargain_number) * 100; //砍價進度
          if (
            this.shop.bargain_ar != undefined &&
            this.shop.bargain_ar.length > 0
          ) {
            let max_money = this.shop.bargain_ar[0].money;
            let min_money = this.shop.bargain_ar[0].money;
            let max = 0;
            let min = 0;
            this.shop.bargain_ar.forEach((item, k) => {
              this.shop.bargain_ar[k].remark = "砍价成功";
              var money = parseFloat(item.money);
              if (money >= max_money) {
                max_money = money;
                max = k;
              }
              if (money <= min_money) {
                min_money = money;
                min = k;
              }
              this.last_user = this.shop.bargain_ar[k];
            });
            if (max == min) {
              this.shop.bargain_ar[max].remark = "手气最佳";
            } else {
              this.shop.bargain_ar[max].remark = "手气最佳";
              this.shop.bargain_ar[min].remark = "砍的最少";
            }
          }
          if (Number(this.shop.percent) == 100) {
            this.time = this.shop.my_time2 * 1000 || 0;
          } else {
            this.time = this.shop.my_time * 1000 || 0;
          }
          //分享朋友圈/微信
          var obj = {};

          obj.title = res.result.title;
          obj.desc = "朋友一声吼，砍价有木有 ↓↓↓";

          if (res.result.piclink && res.result.piclink.indexOf("http") < 0) {
            obj.imgUrl =
              window.location.protocol +
              "//" +
              window.location.host +
              res.result.piclink;
          } else {
            obj.imgUrl = res.result.piclink;
          }
          obj.link = window.location.href;
          try {
            this.$fnc.isXcx().then(ress => {
              if (ress == "true" || ress == true) {
                var obj2 = {};
                obj2.title = obj.title;
                obj2.desc = obj.desc;
                obj2.piclink = obj.imgUrl;
                obj2.url = obj.link;
                wx.miniProgram.postMessage({
                  data: obj2
                });
              }
            });
          } catch (error) {
            new Error("小程序判断失败");
          }

          this.$store.commit("setAppShareObj", obj);
          this.$wxshare(obj);
          this.loading_show = false;

          if (
            this.shop.time == 0 ||
            this.shop.bargain_number - this.shop.num == 0
          ) {
            // this.time =
          }
        } else {
          this.loading_show = false;
        }
      });
    },
    get_cut_list () {
      this.$api.getShop.get_cut_list({}).then(res => {
        if (res.code == 200) {
          this.cut_list = res.result;
        }
      });
    }
  }
};
</script>
<style scoped>
.shop-content {
  margin-top: 100px;
  /* background-color: #fcdfa0; */
  background-color: #fff;
}

.cut {
  height: 100%;
  overflow: auto;
}

.cut_detail {
  height: 1600px;
}

.cut_shop {
  padding: 15px 0;
  margin: 0 auto;
  width: 90%;
  position: relative;
}

.cut_shop_top {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  background-color: #ffffff;
  border-bottom: 1px dashed #fed3a9;
}

.cut_shop_top > p:nth-of-type(1) {
  font-size: 14px;
  color: #333333;
  width: 85%;
  font-weight: bold;
  text-align: center;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  padding-bottom: 20px;
}

.cut_shop_top_circle {
  margin-top: 15px;
  margin: 0 auto;
  position: relative;
}

.cut_shop_top_circle_ava {
  position: absolute;
  background-color: #fff8f8;
  border-radius: 10px;
  color: #999999;
  font-size: 12px;
  top: 120px;
  left: -5px;
  padding: 1px 10px;
  z-index: 999;
}

.cut_shop_top_circle_ava span {
  font-size: 12px;
  color: #ea2b39;
}

.cut_shop_top_success {
  width: auto;
  /* width: 140px; */
  padding-right: 10px;
  height: 24px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  font-size: 10px;
  color: #ffffff;
  border-radius: 20px;
  background: -webkit-linear-gradient(to right, #fff68a, #febe84);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(to right, #fff68a, #febe84);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(to right, #fff68a, #febe84);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #fff68a, #febe84);
  /* 标准的语法 */
  position: absolute;
  top: 85px;
  left: -5px;
  z-index: 99;
}

.cut_shop_top_success img {
  width: 20px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 10px 0 10px;
}

.cut_shop_top_circle_img {
  width: 100%;
  height: 240px;
}

.cut_shop_top_circle_img img {
  width: 100%;
  /* height: 100%; */
  border-radius: 50%;
  overflow: hidden;
  padding: 20px;
}

.cut_shop_top_circle_p {
  width: 85%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  /* position: absolute; */
  bottom: 10px;
  margin-top: -20px;
}

.cut_shop_top_circle_p > div {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
}

.cut_shop_top_circle_p > div:nth-of-type(1) > p:nth-of-type(1) {
  font-size: 12px;
  line-height: 20px;
  color: #999999;
}

.cut_shop_top_circle_p > div:nth-of-type(1) > p:nth-of-type(2) {
  font-size: 16px;
  line-height: 20px;
  color: #999999;
}

.cut_shop_top_circle_p > div:nth-of-type(2) > p:nth-of-type(1) {
  font-size: 12px;
  line-height: 20px;
  color: #333333;
}

.cut_shop_top_circle_p > div:nth-of-type(2) > p:nth-of-type(2) {
  font-size: 16px;
  line-height: 20px;
  font-weight: bold;
  color: #ea2b39;
}

.cut_shop_bottom {
  width: 100%;
  padding: 5px 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  background-color: #ffffff;
  border-top: 1px dashed #fed3a9;
}

.cut_shop_bottom_left {
  width: 20%;
  padding: 10px;
}

.cut_shop_bottom_left img {
  width: 100%;
}

.cut_shop_bottom_right {
  width: 80%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 12px;
  color: #333333;
}

.cut_shop_bottom_right > p:nth-of-type(1) {
  font-size: 14px;
  font-weight: bold;
}

.cut_shop_bottom_right > p:nth-of-type(2) span {
  color: #d93138;
  font-weight: bold;
}

.cut_time {
  margin: 0 auto;
  width: 90%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
}

.cut_time > p:nth-of-type(1) {
  font-size: 16px;
  color: #844f03;
  font-weight: bold;
  text-align: center;
  line-height: 32px;
}

.cut_time_count {
  width: 100%;
  display: flex;
  justify-content: center;
}

.cut_time_count .item {
  display: inline-block;
  margin-right: 5px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  background-color: #000203;
  line-height: 30px;
  width: 23px;
  border-radius: 2px;
  font-weight: bold;
}

.cut_time > span:nth-of-type(1) {
  font-size: 14px;
  color: #fff;
  background-color: #ff215f;
  border-radius: 20px;
  padding: 5px 30px;
  margin-top: 10px;
}

.cut_time > p:nth-of-type(2) {
  font-size: 12px;
  color: #ff8a42;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}

.cut_time > p:nth-of-type(2) span {
  padding: 5px 0 5px 5px;
}

.cut_time > span:nth-of-type(2) {
  color: #fff;
  font-size: 12px;
  padding: 1px 10px;
  background-color: #ff8a42;
  border-radius: 15px;
  margin: 5px 0;
}

.cut_friend {
  margin: 110px auto 0 auto;
  width: 90%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
}

.cut_friend > p:nth-of-type(1) {
  font-size: 28px;
  color: #520412;
  font-weight: bold;
  letter-spacing: 2px;
}

.cut_friend_box {
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-radius: 10px;
  background-color: #fbdf74;
  padding-bottom: 10px;
  margin-top: 15px;
}

.seamless-warp {
  height: 220px;
  overflow: hidden;
}

.cut_friend_box_item {
  width: 90%;
  margin: 0 auto;
  height: 60px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px dashed #ab8805;
}

.cut_friend_box_item_left {
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cut_friend_box_item_left img {
  width: 70%;
  border-radius: 50%;
  overflow: hidden;
}

.cut_friend_box_item_middle {
  width: 50%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.cut_friend_box_item_middle > p {
  width: 100%;
  font-size: 12px;
  color: #520412;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cut_friend_box_item_middle > span {
  font-size: 10px;
  color: #ffffff;
  padding: 0px 10px;
  border-radius: 10px;
  background: -webkit-linear-gradient(to left, #fe3161, #ff6c59);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(to left, #fe3161, #ff6c59);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(to left, #fe3161, #ff6c59);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to left, #fe3161, #ff6c59);
  /* 标准的语法 */
}

.cut_friend_box_item_right {
  width: 30%;
  font-size: 12px;
  color: #520412;
  text-align: right;
}

.cut_friend_box_item_right span {
  font-size: 16px;
  font-weight: bold;
  color: #e32d3c;
  padding-left: 5px;
}

.cut_list {
  background-color: #fcdfa0;
  padding-top: 10px;
  padding-bottom: 10px;
  /* margin-top: 130px; */
}

.pop_box {
  width: 100%;
  position: relative;
}

.pop_box_img {
  width: 100%;
  height: 100%;
}

.pop_box_img img {
  height: 100%;
  width: 100%;
}

.pop_box_content {
  position: absolute;
  top: 100px;
  left: 50px;
}

.pop_box_content > p:nth-of-type(1) {
  font-size: 28px;
  font-weight: bolder;
  color: #672311;
}

.pop_box_content > p:nth-of-type(2) {
  font-size: 16px;
  font-weight: bolder;
  color: #fe430a;
}

.pop_box_content > p:nth-of-type(2) span {
  font-size: 48px;
  line-height: 56px;
  font-weight: bold;
  color: #fe430a;
}

.pop_box_close {
  width: 50px;
  height: 100px;
  position: absolute;
  top: -20px;
  right: 15px;
}
</style>
