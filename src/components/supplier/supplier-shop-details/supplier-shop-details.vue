<template>
  <div class="templeIntroduction">
    <div class="header_img_com">
      
      <van-swipe
        :show-indicators="false"
        :autoplay="4000"
        :initial-swipe="swipestart"
        class="shop_swipe"
        @change="onChange"
      >
        <van-swipe-item
          style="height: 100%"
          v-if="info.shop_video && info.shop_video != ''"
          class="shop_swipe-item"
        >
          <div
            class="show_item_pic_two_img show_item_video"
            v-if="info.shop_video && info.shop_video != ''"
            @click="open_str('video')"
          >
            <!-- 显示视频封面 -->
            <!-- 播放暂停按钮 -->
            <img
              class="icon_play"
              src="./../../../assets/img/play.png"
              style="width: 48px; height: 48px; min-height: 48px; z-index: 1000"
            />
            <img :src="$fnc.getImgUrl(info.shop_video_cover)" alt />
          </div>
        </van-swipe-item>
        <van-swipe-item
          v-for="(item, index) in info.img_json"
          :key="index"
          style="position: relative"
          class="shop_swipe-item"
          @click="open_str(index)"
        >
          <img v-lazy="item.piclink" class="shop_swi_img" />
        </van-swipe-item>
        <div class="custom-indicator" slot="indicator">
          {{ current + 1 }}/{{
            info.shop_video ? (info.img_json ? info.img_json.length + 1 : info.img_json.length):1
          }}
        </div>
      </van-swipe>
    </div>

    <div class="temple_name_info">
      <div class="temple_name_title">
        <img src="./../../../assets/img/project/temple1.png" alt="" />
        <p>{{ info.shop_title }}</p>
        <!-- <p>
          {{ info.distance >= 1000 ? info.distance / 1000 : info.distance || 0
          }}{{ info.distance >= 1000 ? "km" : "m" }}
        </p> -->
        <p>已有{{ info.shop_visits }}人到访过</p>
      </div>
      <div class="temple_intro">
        {{ info.shop_recommend }}
      </div>
      <div class="button" @click="$router.push('/dz/dz_search')">
        <img src="./../../../assets/img/project/temple2.png" alt="" />
        <p>查看更多寺庙</p>
      </div>
    </div>

    <!-- <div class="temple_address">
      <div class="temple_address_part1">
        <img src="./../../../assets/img/project/address.png" alt="" />
        <p>
          {{
            $fnc.deleteNumber(
              info.shop_province +
                info.shop_city +
                info.shop_area +
                info.shop_town
            ) + info.shop_address
          }}
        </p>
        <img src="./../../../assets/img/project/right.png" alt="" />
      </div>
      <van-divider />
      <div class="temple_address_part1">
        <img src="./../../../assets/img/project/zs.png" alt="" />
        <p>供奉赠送功德值（1新元等于1功德值）</p>
      </div>
      <van-divider />
      <div class="temple_address_part2">
        <img src="./../../../assets/img/project/foot.png" alt="" />
        <p>已有{{ info.shop_visits }}人到访过</p>
      </div>
    </div> -->
    <div
      v-if="info.abbot_name != '' && info.abbot_avatar != ''"
      class="evaluate"
      @click="$router.push('/dz/dz_abbot_detail?id=' + $route.query.id)"
    >
      <div class="title">
        <div class="left"><img :src="$fnc.getImgUrl(info.abbot_avatar)" alt="" /></div>
        <div class="right">
          <p>{{ info.abbot_name }}</p>
          <p class="paragraph">
            {{ info.abbot_recommend }}
          </p>
        </div>
      </div>
      
    </div>
    <supplier-shop-products
      @reset="reset"
      :list="productList"
      :sid="$route.query.id"
    />
    <supplier-shop-money
      :list="donationList"
      style="background: #fff; padding: 0px 10px"
    />
    <div class="temple_detail">
      <div class="detail_title">
        <img src="./../../../assets/img/project/left_img.png" alt="" />
        <p>寺庙详情</p>
        <img src="./../../../assets/img/project/right_img.png" alt="" />
      </div>
      <div class="detail_con" v-html="info.shop_detail"></div>
    </div>

    <div class="footer_button2" @click="is_show_pop">
      <img src="./../../../assets/img/project/button2.png" alt="" />
    </div>

    <van-popup
      v-model="show"
      get-container="body"
      position="bottom"
      :overlay="true"
      class="footer_pop"
    >
      <clickpop
        @r_value="r_value"
        @random="random"
        :radio_value1="radio_value"
        @showgdz="show_gdz = true;"
        @close_self="show=false;"
        :item="info"
      ></clickpop>
    </van-popup>
    <van-popup
      v-model="show_gdz"
      :style="{ height: '100%', width: '100%' }"
      get-container="body"
      position="right"
    >
    <!-- is_show_address -->
      <information
        @close_information="show_gdz = false"
        @getAddressItem="getAddressItem"
        :isShop="true"
        @back="getback"
        :isOrder="true"
        v-if="show_gdz"
        :radio_value="radio_value"
        :randomNumber="randomNumber"
        @change_radio="change_radio"
        :is_show="true"
      />
      <addAddres
        @getAddressItem="getAddressItem"
        @back="getback"
        :item="{}"
        :isOrder="true"
        v-else
      />
    </van-popup>
    <van-popup
      v-model="is_show_menu"
      get-container="body"
      position="left"
      :overlay="true"
      style="
        border-radius: 5px 5px 0 0;
        height: 100%;
        width: 80%;
        overflow: visible;
      "
    >
      <dzmenu @close_menu="is_show_menu = false"></dzmenu>
    </van-popup>
    <van-popup
        v-model="showDetail"
        position="top"
        class="detail_pop"
        :close-on-popstate="true"
        :style="{ width: '100%', height: '100%', 'background-color': 'black' }"
      >
      
        <showDetail
          @currency="currency"
          :swipestart="swipestart"
          @close_pop="rec_close"
          :detail="info"
        ></showDetail>
      </van-popup>
    <onlinebtn @is_show="is_show_menu = true"></onlinebtn>
    <getaddress :showaddress="false"></getaddress>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import videoDefault from "@/components/currency/videoDefault.vue";
import clickpop from "@/components/dz/currency/click_pop";
import Cookies from "js-cookie";
import {
  Swipe,
  SwipeItem,
  Image,
  ImagePreview,
  RadioGroup,
  Radio,
} from "vant";
import getaddress from "@/components/currency/getaddress";
import { mapState } from "vuex";
import wx from "weixin-js-sdk";
import supplierShopProducts from "./supplier-shop-products/supplier-shop-products_dz";
import SupplierShopMoney from "./supplier-shop-money/supplier-shop-money.vue";
import information from "@/components/dz/dz_information";
import addAddres from "@/components/setting/addAddres";
import onlinebtn from "@/components/currency/onlinebtn";
import dzmenu from "@/components/dz/dz_menu.vue";
import showDetail from "@/components/shop/buyers/show_detail_dz_supplier";
export default {
  name: "supplier-shop-details",
  data() {
    return {
      showDownMenu: false,
      show_gdz: false,
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false,
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        // use:false,

        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
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
          warpId: "supplier-shop-details",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000, //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "supplier", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无更多商品~", //提示
        },
      },
      activeName: 0,
      info: {
        cate: [],
      },
      show: false,
      isWx: 0,
      share_show: false,
      partList: [
        {
          banner: [
            {
              piclink: "",
              title: "",
            },
          ],
          title: "",
          title_en: "",
        },
      ],
      navigation: {
        banner: [
          {
            id: null,
            title: null,
            piclink: null,
          },
        ],
      },
      bannerList: {
        banner: [
          {
            id: null,
            title: null,
            piclink: null,
          },
        ],
      },
      productList: [],
      //新增
      isVideoShow: true,
      playOrPause: true,
      video: null,
      iconPlayShow: true,
      randomNumber: 0,
      current: 0,
      radio_value: "1",
      donationList: [],
      is_show_menu: false,
      is_show_address:false,
      showDetail: false,
      swipestart: "",
    };
  },
  components: {
    MescrollVue,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Image.name]: Image,
    videoDefault,
    getaddress,
    RadioGroup,
    Radio,
    supplierShopProducts,
    SupplierShopMoney,
    information,
    addAddres,
    clickpop,
    onlinebtn,
    dzmenu,
    showDetail
  },
  created() {
    this.getSupplierDetails();
    this.get_donation_record();
    this.upCallback();
    var user = Cookies.get("user") ? true : false; // 得到登陆状态 false是已登录;
    if(user){
      this.auctionpay();
    }
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.isWx = "0"; //第一个微信端
    } else if (ua.match(/ykapp/i) == "ykapp") {
      this.isWx = "1"; //第二个app
    } else {
      this.isWx = "2"; //剩下的网页
    }
  },
  mounted() {},
  computed: {
    ...mapState({
      nowposition: (state) => state.nowposition,
    }),
  },
  
  methods: {
    open_str(str) {
      if(this.info.shop_video==''){
        this.swipestart = str;
      }else{
        if (str == "video") {
          this.swipestart = 0;
        } else {
          this.swipestart = str+1;
        }
      }
      
      this.showDetail=true;
    },
    currency(val) {
      this.swipestart = val;
    },
    rec_open(info) {
      this.showDetail = true;
      this.detail = info;
    },
    rec_close() {
      console.log(888)
      this.showDetail = false;
      this.detail = {
        img_json: [],
        shop_video: "",
        shop_video_cover: "",
      };
    },
    auctionpay() {
      this.$api.getShop.get_default_address({}).then((res) => {
        if (res.code == 200) {
          if (res.result != "" && res.result !=null ) {
            this.params = res.result || {};
            this.params.shop_wish = res.result.wish_content;
            this.aid = res.result.id;
            this.cateTitle =
              this.params.province +
              this.params.city +
              this.params.area +
              this.params.town;
          }else{
            this.is_show_address=true;
          }
        }
      });
    },
    // 显示
    is_show_pop(){
      // var user = Cookies.get("user") ? true : false; // 得到登陆状态 false是已登录;
      //   if(user){
          this.show=true;
        // }else{
        //   this.$router.replace({ path: "/login" });
        // }
      
    },
    rec_open(info) {
      this.showDetail = true;
      this.detail = info;
    },
    rec_close() {
      this.showDetail = false;
      this.detail = {
        piclink: [],
        video: "",
        video_piclink: ""
      };
    },
    change_radio(val){
      this.radio_value=val;
    },
    r_value(val) {
      this.radio_value = val; //是否匿名
    },
    random(val) {
      this.randomNumber = val; //随机值
    },
    getback() {
      this.show_gdz = false; //关闭功德主页面
    },
    getAddressItem(item) {},
    get_donation_record() {
      this.$api.getDz
        .get_donation_record({ id: this.$route.query.id })
        .then((res) => {
          if (res.code == 200) {
            this.donationList = res.result.data;
          }
        });
    },
    reset() {
      this.upCallback();
    },
    pay_gdz(val) {
      let param = {};
      param.aid = val;
      param.money = this.randomNumber;
      param.is_anonymous = this.radio_value;
      // param.tshare = this.tshare;
      param.id = this.$route.query.id;
      // param.is_integral = this.is_integral;
      // if (this.redEnvelopes) {
      //   param.red_id = this.redEnvelopes.id;
      // }
      this.$dialog
        .confirm({
          title: "是否供奉",
          message: "确定供奉S$" + this.randomNumber + "吗？",
        })
        .then(() => {
          this.show = false;
          this.$api.getZhanYe.submit_zhanye_pay(param).then((res) => {
            //缴费
            if (res.code == 200) {
              this.$toast.success("提交善缘成功", 1000);
              setTimeout(() => {
                this.$router.push({
                  path: "/order/payorder",
                  query: {
                    id: res.result,
                  },
                });
              }, 1000);
            }
          });
        })
        .catch(() => {});
    },
    imagePreview(src, index) {
      var arr = [];
      for (var i in src) {
        arr.push(this.$fnc.getImgUrl(src[i].piclink));
      }
      ImagePreview({ images: arr, startPosition: Number(index) });
    },
    playvideo(event) {
      let video = document.querySelector("video");
      this.isVideoShow = false;
      this.iconPlayShow = false;
      video.play();
      window.onresize = function () {};
    },
    pauseVideo() {
      //暂停\播放
      let video = this.$refs.videoshow;
      if (this.playOrPause && video) {
        video.pause();
        this.iconPlayShow = true;
        this.playOrPause = !this.playOrPause;
      } else {
        video.play();
        this.iconPlayShow = false;
        this.playOrPause = !this.playOrPause;
      }
    },
    onPlayerEnded(player) {
      //视频结束
      this.isVideoShow = true;
      this.current += this.current;
    },
    onChange(index) {
      this.current = index;
    },
    toDh() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == "ykapp") {
        this.isApp = true; //第二个app
      }
      var that = this;
      if (that.isApp) {
        try {
          this.$fnc.appNav(that.info.shop_latitude, that.info.shop_longitude);
        } catch (error) {
          that.$toast.fail("App地图跳转失败");
        }
      } else if (that.$fnc.isWx()) {
        var obj = {};
        obj.latitude = parseFloat(that.info.shop_latitude);
        obj.longitude = parseFloat(that.info.shop_longitude);
        obj.name = that.info.shop_title;
        obj.address =
          that.info.shop_province +
          that.info.shop_city +
          that.info.shop_area +
          that.info.shop_town +
          that.info.shop_address;
        obj.scale = 14;
        obj.infoUrl =
          location.origin + "/supplier/supplierdetails?id=" + that.info.id;
        var isxcx =
          navigator.userAgent.indexOf("miniProgram") !== -1 ? true : false;
        if (isxcx == true || isxcx == "true") {
          wx.miniProgram.navigateTo({
            url: `/pages/map/map?latitude=${obj.latitude}&longitude=${obj.longitude}&name=${obj.name}&address=${obj.address}`,
          });
        } else {
          this.wxApi.ToLocation(obj);
        }
      }
    },
    showEwm() {
      var ewm = this.info.shop_wechat;
      if (ewm) {
        this.show = true;
      } else {
        this.$toast("暂无微信二维码");
      }
      this.showDownMenu = false;
    },
    toPhone(tel) {
      if (tel) {
        this.$fnc.tel(tel);
      } else {
        this.$toast("暂无电话");
      }
      this.showDownMenu = false;
    },
    toIndex() {
      this.$router.push("/");
      this.showDownMenu = false;
    },
    share_btn() {
      this.showDownMenu = false;
      if (this.$fnc.isYkAPP()) {
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
    toIm(id) {
      this.showDownMenu = false;
      var im = this.$store.state.config.plugin.imhyjsnt.is_open || ""; //聊天功能
      var kf = this.$store.state.config.plugin.btkfxt.is_open || ""; //平台客服
      if (im == 1 || kf == 1) {
        if (id.indexOf("@TIM#") >= 0) {
          var str = id.split("#").join();
          this.$router.push("/im/mes?id=" + str);
        } else {
          this.$router.push("/im/mes?id=" + id);
        }
      } else {
        this.$toast.fail("敬请期待");
      }
    },
    toTaggleCollect(id) {
      this.$api.getShop.collect_shop({ id }).then((res) => {
        if (res.code == 200) {
          this.$toast(res.result);
          if (this.info.is_collect) {
            this.info.collect_number = this.info.collect_number - 1;
            this.info.is_collect = false;
          } else {
            this.info.collect_number = this.info.collect_number + 1;
            this.info.is_collect = true;
          }
        }
      });
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      var params = {};
      params.sid = this.$route.query.id || "";
      params.cate_id = this.activeName || "";
      params.page = 1;
      this.$api.getShop.getShopSearch(params).then((res) => {
        if (res.code == 200) {
          let arr = res.result.data;
          // 如果是第一页需手动置空列表
          // if (page.num == 1) this.productList = [];
          // 把请求到的数据添加到列表
          this.productList = this.productList.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          // this.$nextTick(() => {
          //   setTimeout(() => {
          //     mescroll.endSuccess(arr.length);
          //   }, 1500);
          // });
        } else {
          mescroll.endErr();
        }
      });
    },
    getSupplierDetails() {
      var params = {};
      params.id = this.$route.query.id;
      params.latitude = this.nowposition.latitude || 0;
      params.longitude = this.nowposition.longitude || 0;
      this.$api.getSupplier.getSupplierDetails(params).then((res) => {
        if (res.code == 200) {
          this.info = res.result;
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
  watch: {
    activeName() {
      this.mescroll.resetUpScroll();
    },
    randomNumber(val) {
      if (val == undefined) {
        this.randomNumber = 0;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  color: #fff;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}
.templeIntroduction {
  height: 100%;
  width: 100%;
  overflow: auto;
  background-color: #f4f4f4;
  .header_img_com {
    width: 375px;
    height: 249px;
    > img {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }

  .temple_name_info {
    padding: 13px 10px 10px 4px;
    background-color: #fff;
    .temple_name_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > img {
        width: 19px;
        height: 19px;
      }
      > p:first-of-type {
        font-size: 15px;
        line-height: 15px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        color: #333333;
        margin-left: 5px;
        margin-right: auto;
      }
      > p:last-of-type {
        font-size: 13px;
        line-height: 13px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #666666;
      }
    }
    .temple_intro {
      margin-top: 6px;
      font-size: 12px;
      line-height: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #787878;
      line-height: 20px;
    }
    .button {
      margin-top: 2px;
      position: relative;
      text-align: center;
      // border: 1px solid red;
      display: flex;
      justify-content: center;
      align-items: center;
      > img {
        width: 109px;
        height: 27px;
        object-fit: fill;
      }
      > p {
        position: absolute;
        top: 0;
        font-size: 12px;
        line-height: 27px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        text-align: center;
        color: #000000;
      }
    }
  }

  .temple_address {
    margin-top: 10px;
    background-color: #fff;
    padding: 10px;
    .temple_address_part1 {
      display: flex;
      align-items: center;
      > img {
        width: 13px;
        height: 13px;
      }
      > img:last-of-type {
        width: 12px;
        height: 12px;
      }
      > p {
        margin: 0 5px;
        font-size: 13px;
        line-height: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #333333;
      }
    }
    /deep/.van-divider {
      margin: 8px 0;
    }
    .temple_address_part2 {
      display: flex;
      align-items: center;
      margin-left: 2px;
      > img {
        width: 9px;
        height: 13px;
      }
      > p {
        margin-left: 5px;
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
      }
    }
  }

  .evaluate {
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
    .title {
      display: flex;
      align-items: center;
      .left {
        width: 40px;
        height: 40px;
        opacity: 1;
        background: rgba(0, 0, 0, 0);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        overflow: hidden;
        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .right{
        // width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
         > p {
          margin-left: 10px;
          font-size: 15px;
          font-family: PingFang SC, PingFang SC-Bold;
          font-weight: 700;
          color: #333333;
          line-height: 16px;
        }
        .paragraph {
          margin-top: 5px;
          font-size: 12px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #787878;
          line-height: 20px;
          width: 305px;
           overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          
        }
      }
     
    }
    
  }

  .temple_detail {
    margin-top: 10px;
    padding: 0 10px;
    padding-top: 17px;
    background-color: white;
    padding-bottom: 20px;
    .detail_title {
      margin-bottom: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      > p {
        margin: 0 21px;
        font-size: 17px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #ffa136;
        line-height: 20px;
      }
      > img {
        width: 39px;
        height: 17px;
        opacity: 1;
      }
    }
    /deep/.detail_con {
      width: 100%;
      overflow: auto;
      padding: 5px 5px 5px 0px;
      height: 100%;

      P {
        margin-top: 10px;
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #787878;
        line-height: 20px;
        img {
          margin-top: 10px;
          width: 355px;
          height: 237px;
          object-fit: fill;
        }
      }
    }
  }

  .footer_button2 {
    margin-top: 10px;
    padding-bottom: 50px;
    padding: 0 10px;
    position: fixed;
    bottom: 55px;
    z-index: 10;
    > img {
      width: 100%;
      height: 100%;
    }
  }
}
//新增
.shop_swipe {
  .shop_swipe-item {
    height: 250px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: black;
  }
  .shop_swi_img {
    width: 100%;
    height: 100%;
  }
}
.icon_play {
  position: absolute;
  top: 40%;
  right: 0;
  left: 0;
  bottom: auto;
  margin: auto;
  z-index: 999;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  opacity: 1;
}
.play,
.platStart {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
}
.play {
  height: auto;
  top: 50%;
  max-height: 100%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0px);
}
.video_box {
  z-index: 999;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
}
.play1 {
  opacity: 0.9;
  max-height: 10rem;
}
.price_regular > small {
  font-size: 12px;
  font-weight: bold;
}
.price_regular > b {
  font-size: 14px;
}
.price_regular > i {
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
}
// /deep/.van-field__control {
//   color: #fff;
// }
.assess_form_radio {
  font-size: 14px;
  padding: 10px 16px 10px 16px;
  flex: 2;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.assess_form_radio_item {
  min-width: 45%;
}
.protocl {
  font-size: 14px;
}
/deep/.van-cell::after {
  border: none;
}
/deep/.nick .van-field__control {
  font-size: 17px;
}
/deep/.van-field__control:disabled {
  // -webkit-text-fill-color: #fff;
}
/deep/.van-icon-edit {
  color: #fff;
}
.footer_pop {
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  height: auto;
  max-height: 650px;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  background-image: url(./../../../assets/img/project/popimg.png);
  background-size: 100%;
  background-repeat: no-repeat;
  // border-radius: 5px 5px 0 0;
}
 .show_item_video {
    position: relative;
    .icon_play {
      position: absolute;
      width: 50px;
      height: 50px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }
  }
.show_item_pic_two_img {
      display: flex;
      height: 100%;
      overflow: hidden;
      img {
        width: 100%;
        width: 100%;
        min-height: 100%;
        object-fit: cover;
      }
    }
</style>
