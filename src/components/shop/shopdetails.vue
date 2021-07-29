<template>
  <div style="height:100%">
    <div v-if="showVideoPop" class="video-pop-box">
      <video-pop-box :info="shopInfo" />
    </div>

    <div class="shop-details-2 animated" v-show="loading" :class="{fadeIn:loading}" style="animationDelay:.5s;position: relative;">
      <div class="step-jump details_head">
        <div class="fx s-1-head" v-show="showNav">
          <div class="fx">
            <img src="../../assets/img/shop/01.png" class="op_img" @click="toBack" alt />
          </div>

          <div class="fx">
            <img src="../../assets/img/shop/03.png" v-if="isWx==1" class="op_img" @click="shareApp" alt style="margin-right:10px" />
            <img src="../../assets/img/shop/05.png" class="op_img" @click="addEwm " alt />
          </div>
        </div>
        <div class="fx" v-show="!showNav" :style="opacityStyle">
          <div class="fx">
            <img src="../../assets/img/shop/02.png" @click="toBack" alt />
          </div>
          <div class="details_head_a fx">
            <a @click.prevent="jump(i)" :class="{active:i==activeStep}" v-for="(item,i) in lis" :key="i">{{item}}</a>
          </div>
          <div class="fx">
            <img src="../../assets/img/shop/04.png" @click="shareApp" v-if="isWx==1 " alt style="margin-right:10px" />

            <img src="../../assets/img/shop/06.png" class="op_img" @click="addEwm" alt />
          </div>
        </div>
      </div>
      <div class="details_shop_conn" @scroll="scroll" ref="content">
        <shop-details-swiper v-show="shopInfo.img_json.length>0" :list="shopInfo.img_json" :info="shopInfo" id="shophead" @setXq="setXq" />

        <auctionShopTop :shopInfo="shopInfo" :auctionInfo="auctionInfo" v-if="shopInfo.types == 18"></auctionShopTop>

        <shopdetaillimit :shopInfo="shopInfo" v-if="shopInfo.types == 7"></shopdetaillimit>

        <shopDetailPresale :shopInfo="shopInfo" v-if="shopInfo.types == 6"></shopDetailPresale>

        <shopdetailintegral :shopInfo="shopInfo" v-if="shopInfo.types == 2"></shopdetailintegral>

        <shop-details-title :shopInfo="shopInfo" :group="group"
            v-if="shopInfo.types != 7 && shopInfo.types != 2  && shopInfo.types != 9 && shopInfo.types != 6 && shopInfo.types != 18 " />

        <!-- 品控师 -->
        <div class="details_liubai s1" v-if="bool"></div>
        <shopDetailsQuality :quality="quality" v-if="bool" />

        <shopPresaleProgress :shopInfo="shopInfo" v-if="shopInfo.types == 6"></shopPresaleProgress>
        <div class="details_liubai s1" v-show="shopInfo.types != 7 && shopInfo.types != 2 "
            v-if="shopInfo.shopInfo && shopInfo.coupon.length>0 || shopInfo.discount_number>0 || shopInfo.send_score>0">
        </div>

        <shop-details-cell :shopInfo="shopInfo" v-if="shopInfo.types != 7 && shopInfo.types != 2 && shopInfo.types != 4" />

        <groupbuyShopDetail :shopInfo="shopInfo" @groupbuyAdd="groupbuyAdd" v-if="shopInfo.types == 19"></groupbuyShopDetail>

        <auctionShopDetail :shopInfo="shopInfo" :auctionInfo="auctionInfo" ref="auctionShopDetail" @refreshAuction="get_auction"
            v-if="shopInfo.types == 18"></auctionShopDetail>

        <div class="details_liubai step-jump" v-if="shopInfo.one_talk"></div>
        <shop-details-sevaluate class :oneTalk="shopInfo.one_talk" :talk_num="shopInfo.talk_num" v-if="shopInfo.one_talk" />
        <div class="details_liubai" v-if="shopInfo.types ==4 && group.num>0"></div>
        <shopUserAssemble class @toAssemb="getAssemb" :group="group" v-if="shopInfo.types ==4" />

        <div class="details_liubai" v-if="shopInfo.sid>0 ||  shopInfo.recommend.length>0 || shopInfo.hot.length>0">
        </div>

        <shopDetailsShop :shopInfo="shopInfo" />

        <div class="details_liubai"></div>

        <shopDetailsInfo :content="shopInfo.content" v-if="shopInfo.content && shopInfo.types != 9 " id="shopinfo" class="step-jump" />

        <div class="shop_tj" v-show="$store.state.config.shop.is_show_tjshop==1 && listProduct.length>0">
          <van-divider class="shop_tj_title">猜您喜欢</van-divider>
          <indexshoplist :top_shoplist="listProduct" :background="'#ffffff'" />
        </div>

        <div style="height:80px">
          <van-divider dashed>我是有底线的</van-divider>
        </div>
      </div>
      <van-goods-action :class="{webClass:$fnc.isYkAPP()}" style="border-top: 1px solid #eee;">
        <van-goods-action-icon icon="shop-o" text="店铺" v-if="shopInfo.sid>0" @click="toSupplierShop" />

        <van-goods-action-icon icon="home-o" @click="$router.push('/')" text="首页" v-else />

        <van-goods-action-icon icon="chat-o" text="客服" v-if="shopInfo.kf_im" @click="toIm" />

        <van-goods-action-icon icon="apps-o" text="首页" v-else-if="shopInfo.sid>0" @click="$router.push('/')" />

        <van-goods-action-icon icon="cart-o" :info="car_num||''" @click="$router.push('/shop/shopcard')" text="购物车" />

        <van-goods-action-button type="warning" @click="addCard(0)" text="加入购物车"
            v-if="shopInfo.is_special == 0 && (shopInfo.types==0 || shopInfo.types==1)" />
        <van-goods-action-button type="danger" @click="addCard(1)" text="立即购买"
            v-if="shopInfo.types==0||shopInfo.types==1||shopInfo.types==8||shopInfo.types==10||shopInfo.types==11" />
        <van-goods-action-button type="danger" @click="addCard(1)" text="零元购" v-if="shopInfo.types==24" />

        <van-goods-action-button type="danger" @click="addCard(1)" text="立即预约" v-if="shopInfo.types==13 || shopInfo.types==14" />

        <van-goods-action-button type="danger" color="#b7172f" text="支付定金" @click="addCard(1)" v-if="shopInfo.types==6">
          <div slot="default">
            <p style="font-size: 14px;line-height:22px">支付定金</p>
            <p style="font-size: 10px;line-height:14px">(保证金 ￥{{shopInfo.down_pay}} )
            </p>
          </div>
        </van-goods-action-button>

        <van-goods-action-button type="danger" @click="addCard(1)" :disabled="shopInfo.activity && shopInfo.activity.distance_types == 2 ?false:true"
            :text="shopInfo.activity && shopInfo.activity.distance_types == 2 ?'立即抢购':shopInfo.activity && shopInfo.activity.distance_types == 1?'活动未开始':'活动已结束'"
            v-if="shopInfo.types==7" />

        <van-goods-action-button type="danger" @click="addCard(1)" text="立即兑换" v-if="shopInfo.types==2" />

        <div class="fx_1 assemble-button assemble-button1" v-if="shopInfo.types==4" @click="addCard(1,'group_types')">
          ￥{{shopInfo.price}}
          <p>单独购买</p>
        </div>
        <div class="fx_1 assemble-button" @click="addCard(1)" v-if="shopInfo.types==4">
          ￥{{group.group_price}}
          <p>发起拼团</p>
        </div>
        <!-- 旅游 -->
        <van-goods-action-button type="danger" @click="buy_trip(shopInfo.id)" text="立即预定" v-if="shopInfo.types==9" />
        <!-- 竞拍 -->
        <van-goods-action-button type="danger" @click="addCard(1)" :disabled="auctionInfo.auction_title == '未开始' ? true:false"
            :text="auctionInfo.auction_title == '未开始' ? '未开始':'立即出价'" v-if="shopInfo.types==18" />

        <van-goods-action-button type="danger" @click="addCard(1)" text="一键参与" v-if="shopInfo.types==19" />
      </van-goods-action>
    </div>

    <buy-list-swiper :info="shopInfo" v-if="shopInfo.order_ar" />

    <md-landscape v-model="showWxEwm" class style="background-color: transparent;width: 70%">
      <div class="sign_popup">
        <div class="sign_go sign_go-title">请先关注我们的公众号</div>
        <div>
          <img :src="this.shopInfo.wxewm" alt />
        </div>
        <div class="sign_go">方便接收消费通知</div>
        <div class="sign_close" @click="showWxEwm = false"></div>
      </div>
    </md-landscape>
    <van-popup v-model="groupShowList" style :close-on-click-overlay="false" get-container="body" closeable close-icon="clear" class="pindan-con">
      <div class="pindan-list">
        <p>正在拼单</p>
        <div class="pindan-list-con">
          <div class="fx" v-for="(item,i) in group.data" :key="i">
            <div class="fx">
              <img :src="item.avatar" alt />
              <div>
                <div>
                  <span>{{(item.nickname+'').length>6?(item.nickname+'').slice(0,6)+'...':(item.nickname || '---')}}</span>
                  <span>&nbsp;&nbsp;还差{{item.difference}}人</span>
                </div>
                <p>
                  剩余
                  <van-count-down :time="parseInt(item.end_time_second)*1000" style="display:inline" class="ass-time-tem" />
                </p>
              </div>
            </div>
            <van-button type="danger" size="small" @click="getAssemb(item)">去拼单</van-button>
          </div>
          <p v-if="group.number>10">仅显示10个正在拼单的人</p>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="groupShow" style :close-on-click-overlay="false" get-container="body" closeable close-icon="clear" class="pindan-con">
      <div class="pindan">
        <p>参与{{row.nickname || '---'}}的拼单</p>
        <p>
          仅剩
          <span>{{row.difference}}</span>个名额，
          <van-count-down :time="parseInt(row.end_time_second)*1000" style="display:inline" class="ass-time-tem" />后结束
        </p>
        <div class="fx">
          <div class="assemble-tuanzhang">
            <img :src="row.avatar" alt />
            <span>团长</span>
          </div>
          <div class="no-user fx" v-for="i in row.difference" :key="i">
            <span>?</span>
          </div>
        </div>
        <van-button type="primary" color="#e02e24" size="small" @click="addCard(1,'group_other')" block>参与拼单</van-button>
      </div>
    </van-popup>

    <van-popup v-model="show" position="bottom" :overlay="true" get-container="body" style="border-radius: 5px 5px 0 0;">
      <!-- 商品SKU选择 -->
      <shopDetailsSku :shopInfo="shopInfo" :is_pintuan="is_pintuan" :group_types="group_types" :group_id="group_id" :group="group"
          @closePop="getClosePop" :toAut="index" />
    </van-popup>

    <van-popup v-model="preShow" position="bottom" :overlay="true" get-container="body" style="border-radius: 5px 5px 0 0;">
      <shopDetailsPre :shopInfo="shopInfo" @closePopPre="getClosePopPre" />
    </van-popup>

    <van-popup v-model="skuPreShow" position="bottom" :overlay="true" get-container="body" style="border-radius: 5px 5px 0 0;">
      <shopdetailsskupre :shopInfo="shopInfo" :is_pintuan="is_pintuan" :group_types="group_types" :group_id="group_id" :group="group"
          @closePop="getClosePopSkuPre" :toAut="index" />
    </van-popup>

    <van-popup v-model="showShare" class="animated show-share-pop" get-container="body" position :class="[showShare?'bounceInDown':'bounceOutUp']">
      <div>
        <div class="upload_shaer_img">
          <img :src="imgUrl" class="imgUrl" alt />
          <van-icon name="clear" size="28px" color="red" @click="showShare=false" />
        </div>
        <div class="upload_shaer_btn">
          <div class="tc" @click="uploadShare(isWx)">
            <img src="../../assets/img/member/uplodeimg.png" class="upload_img_ewm" alt />
            <span>{{isWx==0?'长按保存':"保存到系统相册"}}</span>
          </div>
        </div>
      </div>
    </van-popup>

    <div ref="imageDom" class="shop-share" style="display: flex;flex-flow: column;justify-content: flex-start;align-items: flex-start;">
      <div class="shop-share-con">
        <div class="shop-share-head">
          <img :src="imgurl1" crossorigin="anonymous" alt />
        </div>
        <p class="shop-share-title">{{shopInfo.title}}</p>
        <div class="shop_share_body">
          <p class="shop-share-tj">推荐理由：{{shopInfo.sub_title}}</p>
          <div>
            <p>
              <small>￥</small>
              {{price}}
            </p>
            <p v-if="shopInfo.types == 7">
              <small>原价:￥</small>
              <!-- {{ shopInfo.types == 7 ? shopInfo.price : shopInfo.market_price || '' }} -->
              {{ shopInfo.market_price}}
            </p>
          </div>
        </div>
      </div>
      <img style="padding-top:10px " src="../../assets/img/shop/dad.png" crossorigin="anonymous" alt />
      <div class="shop-share-footer fx">
        <div class="fx" v-show="isHaveUsername">
          <img :src="avatar || ($store.state.user.sex==2? require('../../assets/img/member/sex2.png'): require('../../assets/img/member/sex1.png'))"
              crossorigin="anonymous" alt />
          <div>
            <span
                style="color: #333;font-weight: bold;font-size: 14px;margin-bottom: 4px;width: 200px;">我是{{($store.state.user.nickname+'').length>=8?($store.state.user.nickname+'').slice(0,8) : $store.state.user.nickname || $store.state.user.username}}</span>
            <p style="color: #666;font-size: 13px;">我的推广码：{{$store.state.user.username}}
            </p>
          </div>
        </div>

        <img v-show="isxcx == true || isxcx == 'true'" :src="$fnc.getImgUrl(ewmurl)" style="width: 100px;height: 100px; " alt />

        <div id="qrcode" v-show="isxcx != true && isxcx != 'true'"></div>
      </div>
    </div>

    <div ref="showPriceShareDom" class="xcxshare_img"
        :style="{'background':'url('+shopInfo.share_background + ') no-repeat center center  / 100% 100%'}">
      <div class="share_box">
        <img :src="imgurl1" crossorigin="anonymous" alt />
        <div class="share_right">
          <div class="price_regular">
            <small>￥</small>
            <b>{{ $fnc.get_int_dec(price, "int") }}</b>
            <i>{{ $fnc.get_int_dec(price, "dec") }}</i>
          </div>
          <p v-if="shopInfo.market_price">￥{{shopInfo.market_price}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Landscape
} from "mand-mobile";
import {
  mapGetters,
  mapState
} from "vuex";
import shopDetailsSwiper from "./shopdetails/shopdetailsswiper";
import shopDetailsTitle from "./shopdetails/shopdetailstitle";
import shopDetailsCell from "./shopdetails/shopdetailscell";
import shopDetailsSevaluate from "./shopdetails/shopdetailsevaluate";
import shopDetailsShop from "./shopdetails/shopdetailsshop";
import shopDetailsInfo from "./shopdetails/shopdetailsinfo";
import shopDetailsSku from "./shopdetails/shopdetailssku";
// import ShopShare from "./shopdetails/ShopShare";
import shopdetaillimit from "./shopdetails/shop_detail_limit";
import shopdetailintegral from "./shopdetails/shop_detail_integral";
import shopUserAssemble from "./shopdetails/shopUserAssemble";
import buyListSwiper from "./shopdetails/buy-list-swiper/buy-list-swiper";
import auctionShopDetail from "./auction/detail/auctionShopDetail";
import auctionShopTop from "./auction/detail/auctionShopTop";
import groupbuyShopDetail from "./shopdetails/groupbuy/groupbuyShopDetail";



import {
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  CountDown,
  Divider
} from "vant";
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import Cookies from "js-cookie";
import {
  clearInterval
} from "timers";


import shopDetailPresale from "./shopdetails/shop_detail_presale";
import shopPresaleProgress from "@/components/shop/presale/presale_progress";
import shopDetailsQuality from "./shopdetails/shop-details-quality";
import videoPopBox from "./shopdetails/video-pop/video-pop-box";
import wx from "weixin-js-sdk";
import shopDetailsPre from "./shopdetails/shopdetailspre";
import shopdetailsskupre from "./shopdetails/shopdetailsskupre";
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
export default {
  name: "shopdetails",
  components: {
    shopDetailsSwiper,
    shopDetailsTitle,
    shopDetailsCell,
    shopDetailsSevaluate,
    shopDetailsShop,
    shopDetailsInfo,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton,
    [CountDown.name]: CountDown,
    shopDetailsSku,
    shopdetaillimit,
    shopdetailintegral,
    shopUserAssemble,
    shopDetailPresale,
    shopPresaleProgress,
    shopDetailsQuality,
    videoPopBox,
    buyListSwiper,
    [Landscape.name]: Landscape,
    [Divider.name]: Divider,
    shopDetailsPre,
    shopdetailsskupre,
    indexshoplist,
    auctionShopTop,
    auctionShopDetail,
    groupbuyShopDetail,
  },
  data () {
    return {
      shareImgShowUrl: '',
      auctionTimer: null,
      auctionInfo: {},
      avatar: "",
      ewmurl: "",
      isxcx: navigator.userAgent.indexOf("miniProgram") !== -1 ? true : false,
      is_pintuan: false,
      showWxEwm: false,
      bool: false,
      quality: {}, //品控师
      isShowQuality: false,
      loading: false,
      group: {},
      groupShowList: false,
      time: 30 * 60 * 60 * 1000,
      row: {},
      shopInfo: {
        img_json: [],
        one_talk: {},
        recommend: [],
        hot: [],
        group: {
          data: []
        }
      },
      lis: [],
      activeStep: -1,
      index: 0,
      show: false,
      showNav: true,
      opacityStyle: {
        opacity: 0,
        background: ""
        //控制
      },
      scrollTop: 0,
      pageTop: 0,
      showShare: false,
      url: location.origin,
      imgUrl: "",
      isWx: "0",
      timer: null,
      group_types: "",
      group_id: "",
      groupShow: false,
      showVideoPop: false,
      imgurl1: "",
      preShow: false,
      skuPreShow: false,
      listProduct: []
    };
  },
  beforeDestroy () {
    if (this.auctionTimer) {
      window.clearInterval(this.auctionTimer); //关闭
    }
    try {
      if (this.timer) {
        //如果定时器还在运行 或者直接关闭，不用判断
        window.clearInterval(this.timer); //关闭
      }

    } catch (error) {
      new Error("502 定时器");
    }


  },

  beforeCreate () { },
  created () {
    if (this.$route.query.showVideo == 1) {
      this.showVideoPop = true;
    } else {
      this.showVideoPop = false;
    }
    window.vue = this;
    this.getShopDetails(this.$route.query.id);
    try {
      if (this.timer) {
        window.clearInterval(this.timer);
      }
    } catch (error) {
      new Error("111");
    }

    this.$nextTick(() => {
      this.pageTop = this.scrollTop;
    });
    // if (this.$store.state..result.tel == '' && this.$store.state.config.shop.reg_permission == '1') {
    //     this.$store.commit("setShowBingPhone", true);
    // }
    if (this.$store.state.config.shop.is_show_tjshop == 1) {
      this.getOrderProduct();
    }



  },
  mounted () {
    this.$bus.$on("hidPop", () => {
      this.showVideoPop = false;
    });
    this.$bus.$on("showEwm", () => {
      this.addEwm();
    });
    this.$bus.$on("toPopNav", str => {
      this.showVideoPop = false;
      if (str == "首页") {
        this.$router.push("/");
      } else if (str == "客服") {
        this.toIm();
      } else if (str == "购物车") {
        this.$router.push("/shop/shopcard");
      } else if (str == "购买") {
        this.addCard(1);
      }
    });

    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.isWx = "0"; //第一个微信端

      this.starTimer();
    } else if (ua.match(/ykapp/i) == "ykapp") {
      this.starTimer();
      this.isWx = "1"; //第二个app
    } else if (this.$fnc.isWeb()) {
      this.starTimer();
      try {
        this.$router.push(this.shopInfo.kf_im);
      } catch (error) {
        new Error("333");
      }
    } else {
      var info2 = JSON.parse(JSON.stringify(this.shopInfo));
      var obj2 = {
        title: info2.title,
        piclink: info2.piclink,
        id: info2.id,
        price: info2.price
      };
      // info2.imm = im;
      try {
        this.$store.commit("setUnStatusShop", JSON.stringify(obj2));
        this.$router.push(this.shopInfo.kf_im);
      } catch (error) {
        new Error("222");
      }
    }
    var that = this;
    var val = this.userInfo
    if (val.avatar != null && val.avatar.indexOf("http") >= 0) {
      that.$fnc.getImageBase64(val.avatar, img => {
        // eslint-disable-next-line no-undef
        if (img) {
          that.$set(that, "avatar", img);
        } else {
          that.$set(that, "avatar", val.avatar);
        }
      });
    } else {
      that.$set(that, "avatar", val.avatar);
    }
  },
  computed: {
    ...mapGetters(["toAccount", "currentConversationType"]),
    ...mapState({
      username: state => state.user.username,
      car_num: state => state.car_num,
      userInfo: state => state.user
    }),
    isHaveUsername () {
      if (this.username) {
        return true;
      } else {
        return false;
      }
    },
    price () {
      //shopInfo.types == 7 ? shopInfo.activity.limited_price : shopInfo.price
      if (this.shopInfo.types == "7") {
        return this.shopInfo.activity.limited_price;
      } else if (this.shopInfo.types == "4") {
        return this.group.group_price;
      } else if (this.shopInfo.types == "6") {
        return this.shopInfo.down_pay;
      } else {
        return this.shopInfo.price;
      }
    }
  },
  methods: {
    product_share () {
      //分享背景图
      var info = this.shopInfo;
      var username = this.$store.state.user.username || ''
      var link = info.is_product_locking == 1 && username ? `${location.origin}/shop/shopdetails?id=${info.id}&tshare=${username}&tid=${this.$store.state.user.uid}` : window.location.href
      if (this.$route.query.mid) {
        link = link + "&mid=" + this.$route.query.mid;
      }
      var piclink = info.share_piclink || info.piclink
      piclink = piclink.indexOf("http") < 0 ? `${window.location.protocol}//${window.location.host}${piclink}` : piclink;
      try {
        if (info.piclink.indexOf("http") >= 0) {
          this.$fnc.getImageBase64(this.shopInfo.piclink, img => {
            // eslint-disable-next-line no-undef
            if (img) {
              this.$set(this, "imgurl1", img);
            } else {
              this.$set(this, "imgurl1", info.piclink);
            }
          });
        } else {
          this.$set(this, "imgurl1", this.shopInfo.piclink);
        }
      } catch (error) {
        new Error(error);
      }

      if (info.share_piclink) {
        this.shareImgShowUrl = info.share_piclink
        //显示价格图分享
        this.$store.commit("setAppShareObj", { title: info.title, desc: info.sub_title, imgUrl: piclink, link: link });
        this.$wxshare({ title: info.title, desc: info.sub_title, imgUrl: piclink, link: link });
      } else {
        if (this.shopInfo.share_background) {
          this.$fnc.getImageBase64(this.shopInfo.share_background, img => {
            if (img) {
              this.shopInfo.share_background = img;
            } else {
              this.shopInfo.share_background = this.shopInfo.share_background;
            }
            //显示价格的分享背景图有上传，分享图片以这种形式
            this.$nextTick(() => {
              if (document.readyState == "complete" && html2canvas && this.$refs.showPriceShareDom) {
                setTimeout(() => {
                  html2canvas(this.$refs.showPriceShareDom, {
                    useCORS: true,
                    logging: true
                  }).then(
                    canvas => {
                      // 转成图片，生成图片地址
                      var Base64Str = canvas.toDataURL("image/png");
                      if (Base64Str) {

                        this.$fnc.Base64Uploadimg(Base64Str, false).then(res => {
                          this.shareImgShowUrl = res
                          var params = {
                            id: this.shopInfo.id,
                            share_piclink: this.shareImgShowUrl
                          }
                          this.$api.getShop.edit_shareShowPriceImg(params)
                        })

                      }

                    }
                  );
                }, 500);
              }
            })
          });
        }
        //显示价格图分享

        this.$store.commit("setAppShareObj", { title: info.title, desc: info.sub_title, imgUrl: piclink, link: link });
        this.$wxshare({ title: info.title, desc: info.sub_title, imgUrl: piclink, link: link });
        wx.miniProgram.postMessage({
          data: {
            title: info.title,
            desc: info.sub_title,
            piclink: piclink,
            url: link,
          }
        });
        //走普通分享
      }

    },
    groupbuyAdd () {
      this.addCard(1);
    },
    get_auction () {
      this.$api.getShop.get_auctioninfo({
        id: this.$route.query.id
      }).then(res => {
        if (res.code == 200) {
          this.auctionInfo = res.result;
        } else if (res.code == 404) {
          window.clearInterval(this.auctionTimer)
        }
      })
    },

    buy_trip (id) {
      this.$api.getTour.buy_tripshop({
        pid: id,
        number: 1
      }).then(res => {
        if (res.code == 200) {
          this.$router.push({
            path: "/tourshop/buy",
            query: {
              id: res.result.id,
              pid: id
            }
          });
        }
      });
    },
    getAssemb (row) {
      if (row === true) {
        this.groupShowList = true;
      } else {
        this.groupShowList = false;
        this.groupShow = true;
        this.row = row;
        this.is_pintuan = true;
      }
    },
    getGroupUser (id) {
      this.$api.getShop.getGroupUser({
        id
      }).then(res => {
        if (res.code == 200) {
          var arr = this.$fnc.oneArrTwoArr(res.result.group.data, 2);
          res.result.group.data1 = arr;
          this.group = res.result.group;
        }
      });
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
    starTimer () {
      this.timer = setInterval(() => {
        this.endTp();
      }, 10000);
    },
    toIm () {
      this.getTp({
        pid: this.$route.query.id,
        sid: this.shopInfo.sid,
        is_im: 1
      });
      if (this.shopInfo.kf_im.indexOf("/im/mes") >= 0) {
        var im = this.shopInfo.kf_im.split("=")[1];
        // this.$store.dispatch("checkoutConversation", 'C2C'+im);
        var info = JSON.parse(JSON.stringify(this.shopInfo));
        var obj = {
          title: info.title,
          imm: im,
          piclink: info.piclink,
          id: info.id,
          price: info.price
        };
        info.imm = im;

        this.$store.commit("setUnStatusShop", JSON.stringify(obj));

        // this.$store.commit("pushCurrentMessageList", message);

        // this.tim.sendMessage(message);

        this.$router.push(this.shopInfo.kf_im);
      } else {
        var info2 = JSON.parse(JSON.stringify(this.shopInfo));
        var obj2 = {
          title: info2.title,
          piclink: info2.piclink,
          id: info2.id,
          price: info2.price
        };
        // info2.imm = im;
        this.$store.commit("setUnStatusShop", JSON.stringify(obj2));
        this.$router.push(this.shopInfo.kf_im);
      }
    },
    toSupplierShop () {
      this.getTp({
        pid: this.$route.query.id,
        sid: this.shopInfo.sid,
        is_store: 1
      });
      this.$router.push("/supplier/supplierdetails?id=" + this.shopInfo.sid);
    },
    endTp (pid) {
      var user = Cookies.get("user") ? false : true;
      if (
        user ||
        (JSON.stringify(this.$store.state.config != "{}") &&
          this.$store.state.config.plugin.zyfh.is_open == 0)
      )
        return;

      pid = pid || this.$route.query.id || "";
      var tid = this.$route.query.tshare || "";

      if (pid == "" || tid == "") {
        return;
      }
      var sid = this.shopInfo.sid || "";
      if (sid == this.shopInfo.tid) return;
      this.$api.getZhanYe.endShopTp({
        pid,
        sid
      });
    },
    // eslint-disable-next-line no-unused-vars
    getTp ({
      pid,
      sid,
      tid,
      is_ask,
      is_msg,
      is_im,
      is_store
    }) {
      var user = Cookies.get("user") ? false : true;
      var tidd = this.$route.query.is_share || 0;
      if (
        tidd == 0 ||
        tidd == this.$store.state.user.uid ||
        tidd == "undefined"
      ) {
        return;
      }
      if (
        user ||
        (JSON.stringify(this.$store.state.config != "{}") &&
          this.$store.state.config.plugin.zyfh.is_open == 0)
      )
        return;
      var params = {};
      params.pid = pid || this.$route.query.id || "";

      params.sid = sid || "0";
      params.tid = tidd;
      params.is_ask = is_ask || "0";
      params.is_msg = is_msg || "0";
      params.is_im = is_im || "0";
      params.is_store = is_store || "0";
      this.$api.getZhanYe.addShopTp(params).then(res => {
        if (!res.result) {
          window.clearInterval(this.timer);
        }
      });
    },

    addEwm () {
      var user = Cookies.get("user") ? false : true;
      if (!user) {
        this.showPop();
      } else {
        this.$toast.fail("请先登录！");
        this.$fnc.toLoginPage()
      }
    },

    addCard (i, str) {
      if (localStorage.getItem("pay_order_id")) {
        localStorage.removeItem("pay_order_id");
      }
      var user = Cookies.get("user") ? false : true;
      let id = this.$route.query.id;//商品id
      if (user) {
        this.$toast.fail("请先登录！");
        this.$fnc.toLoginPage()
        // setTimeout(() => {
        //   this.$router.push("/login?redirect=/shop/shopdetails?id=" + id);
        // }, 1000);
        // this.$store.dispatch("getUser");
        return false;
      }
      if (this.shopInfo.wxewm && this.$fnc.isWx()) {
        this.showWxEwm = true;
        return false;
      }

      var users = this.$store.state.user;

      if (str == undefined && this.shopInfo.types == 4) {
        this.is_pintuan = true;
      } else {
        this.is_pintuan = false;
      }

      if (str == "group_types") {
        this.group_types = "1";
      } else {
        this.group_types = "";
      }
      this.groupShow = false;

      if (str == "group_other") {
        this.group_id = this.row.id;
      } else {
        this.group_id = "";
      }

      if (users.tel == "" && this.$store.state.config.shop.reg_tel == "1") {
        // this.$store.commit("setShowBingPhone", true);
        this.$router.push('/bind?redirect=/shop/shopdetails?id=' + id);
        return
      } else if (
        users.tid == 0 &&
        this.$store.state.config.shop.reg_permission == "1"
      ) {
        this.$store.commit("setTsShare", true);
        return
      } else {
        this.$store.commit("setShowBingPhone", false);
        this.$store.commit("setTsShare", false);
      }

      if (i == 0) {
        // if (this.shopInfo.types > 0) {
        //   this.index = 1;
        // } else {
        this.index = 0;
        // }
      } else {
        this.index = 1;
      }

      if (this.shopInfo.types == 13) {
        this.preShow = true;
      } else if (this.shopInfo.types == 14) {
        this.skuPreShow = true;
      } else if (this.shopInfo.types == 18) {
        this.$refs.auctionShopDetail.show = true;
      } else {
        this.show = true;
      }
    },
    setXq () {
      this.jump(2);
    },
    jump (index) {
      let that = this;
      this.activeStep = index;
      // 用 class="step-jump" 添加锚点
      let jump = document.querySelectorAll(".step-jump");
      let total = jump[index].offsetTop + 45;

      //        this.$emit('viewScroll', total)
      let distance = this.pageTop;
      //         平滑滚动，时长500ms，每10ms一跳，共50跳
      let step = (total / 50) >> 0;
      if (total > distance) {
        smoothDown();
      } else {
        let newTotal = distance - total;
        step = (newTotal / 50) >> 0;
        smoothUp();
      }

      function smoothDown () {
        if (distance < total) {
          distance += step;
          that.onScroll1(distance);
          setTimeout(smoothDown, 10);
        } else {
          that.onScroll1(total);
        }
      }

      function smoothUp () {
        if (distance > total) {
          distance -= step;
          that.onScroll1(distance);

          setTimeout(smoothUp, 10);
        } else {
          that.onScroll1(total);
        }
      }
    },

    onScroll1 (top) {
      this.$refs.content.scrollTop = top - 45;
    },
    onScroll () {
      let _article = document.querySelectorAll(".step-jump");
      _article.forEach((item, index) => {
        if (this.scrollTop >= item.offsetTop) {
          this.activeStep = index;
        }
      });
    },
    scroll (e) {
      var top = e.srcElement.scrollTop;
      if (top > 60) {
        //当下拉60像素后，顶部渐变出现导航栏
        let opacity = top / 140;
        opacity = opacity > 1 ? 1 : opacity;
        this.opacityStyle.opacity = opacity;
        this.opacityStyle.background = "rgba(255,68,68," + opacity + ")";
        this.showNav = false;
      } else {
        this.showNav = true;
      }

      this.scrollTop = top;
      this.onScroll();
      this.pageTop = top;
    },
    getClosePop () {
      this.show = false;
    },
    getShopDetails (id) {
      var that = this;
      var params = {};
      params.id = id || "";
      that.$api.getShop.getShopDetails(params).then(res => {
        if (res.code == 200) {
          that.loading = true;

          document.title = res.result.title;
          this.shopInfo = res.result;
          if (res.result.types == 3) {
            that.$router.push({
              path: "/shop/cut/detail",
              query: {
                uid: that.appusers.uid,
                pid: res.result.id
              }
            });
          }
          if (res.result.types == 4) {
            that.getGroupUser(res.result.id);
          }
          if (res.result.is_made == 1) {
            that.getQualityDetails(res.result.id);
          }
          if (res.result.order_ar && res.result.order_ar.length == 1) {
            res.result.order_ar.push(res.result.order_ar[0]);
          }


          this.product_share(); //分享

          if (res.result.group == undefined) {
            res.result.group = {
              data: []
            };
          }
          this.qrcode();
          this.getTp({
            pid: this.shopInfo.id,
            sid: this.shopInfo.sid
          });
          var arr = ["商品"];
          if (res.result.one_talk) {
            arr.push("评论");
          }
          if (res.result.content) {
            arr.push("详情");
          }
          this.lis = arr;
          //价格区间
          if (res.result.sku_id != 0) {
            this.shopInfo.max_price = this.shopInfo.price;
            this.shopInfo.min_price = this.shopInfo.price;
            res.result.sku_json.forEach(sku => {
              if (Number(sku.price) > Number(this.shopInfo.max_price)) {
                this.shopInfo.max_price = sku.price;
              }
              if (Number(sku.price) < Number(this.shopInfo.min_price)) {
                this.shopInfo.min_price = sku.price;
              }
            });
          }
          //如果是竞拍商品
          if (this.shopInfo.types == 18) {
            if (this.auctionTimer) {
              window.clearInterval(this.auctionTimer); //关闭
            }
            this.get_auction();
            this.auctionTimer = setInterval(() => {
              this.get_auction();
            }, 5000)
          }

          var footprint = {
            title: this.shopInfo.title,
            piclink: this.shopInfo.piclink,
            types: '浏览商品',
            pid: this.shopInfo.id,
          }
          this.$fnc.record_footprint(footprint);
        }
      });
    },
    qrcode () {
      if (this.isxcx == true || this.isxcx == "true") {
        this.$api.getUser.xcx_shop_ewm({
          id: this.shopInfo.id
        }).then(res => {
          this.ewmurl = res.result.wy_ewm;
        });
      } else {
        var str =
          this.url +
          this.$route.path +
          "?id=" +
          this.$route.query.id +
          "&tid=" +
          (this.$store.state.user.uid || "0");

        if (this.shopInfo.is_product_locking == 1) {
          str = str + "&tshare=" + this.$store.state.user.username;
        }

        new QRCode("qrcode", {
          width: 100,
          height: 100,
          text: str,
          colorDark: "#000",
          colorLight: "#fff"
        });
      }
    },
    showPop () {
      if (
        document.readyState == "complete" &&
        html2canvas &&
        this.$refs.imageDom
      ) {
        const toast = this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: "spinner",
          message: "加载中..."
        });
        html2canvas(this.$refs.imageDom, {
          useCORS: true,
          logging: true
        }).then(
          canvas => {
            // 转成图片，生成图片地址
            this.imgUrl = canvas.toDataURL("image/png");
            if (this.imgUrl) {
              this.showShare = true;
              toast.clear();
            }
          }
        );
      }
    },
    uploadShare () {
      this.show = false;
      this.$fnc.ykAppUpImage(this.imgUrl);
    },
    getQualityDetails (id) {
      this.$api.getShop.getQualityDetails({
        id
      }).then(res => {
        if (res.code == 200) {
          this.bool = true;
          this.quality = res.result;
        }
      });
    },
    getClosePopPre () {
      this.preShow = false;
    },
    getClosePopSkuPre () {
      this.skuPreShow = false;
    },
    getOrderProduct () {
      this.$api.getShop.getNewProduct({}).then(res => {
        if (res.code == 200) {
          this.listProduct = res.result.product;
        }
      });
    }
  },
  watch: {
    $route () {
      if (this.auctionTimer) {
        window.clearInterval(this.auctionTimer); //关闭
      }
      if (this.$route.query.showVideo == 1) {
        this.showVideoPop = true;
      } else {
        this.showVideoPop = false;
      }
    },
    userInfo (val) {
      var that = this;
      if (val.avatar.indexOf("http") >= 0) {
        that.$fnc.getImageBase64(val.avatar, img => {
          // eslint-disable-next-line no-undef
          if (img) {
            that.$set(that, "avatar", img);
          } else {
            that.$set(that, "avatar", val.avatar);
          }
        });
      } else {
        that.$set(that, "avatar", val.avatar);
      }
    }
  }
};
</script>


<style lang="less" scoped>
.webClass {
  position: absolute !important;
}

.sign_popup {
  width: 70%;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;

  img {
    max-width: 80%;
    display: block;
    margin: 0 auto;
  }
}

.sign_go {
  line-height: 1.4;
  font-size: 13px;
  text-align: center;
  padding: 0px 0 12px;
  font-weight: 400;
}

.sign_go-title {
  padding: 12px 0px 12px;
  margin: 0 20px;
  font-size: 16px;
  border-bottom: 1px solid #f9f9f9;
}

.video-pop-box {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 100;
}

.s-1-head {
  height: 50px;
}

.pindan-con {
  width: 70%;
  font-size: 14px;
  overflow-y: initial;

  .pindan {
    padding: 0 19px 22px;

    > p:first-child {
      text-align: center;
      font-size: 16px;
      color: #000000;
      margin-top: 24px;
    }

    > p:nth-child(2) {
      text-align: center;
      font-size: 12px;
      margin-top: 10px;

      > span {
        color: #d90100;
      }
    }

    > div.fx {
      justify-content: center;
      flex-wrap: wrap;
      margin: 13px 0;

      > div {
        margin: 0 5px 10px;
      }

      .assemble-tuanzhang {
        border-radius: 50%;
        border: 2px solid #f5c447;
        position: relative;
        width: 50px;
        height: 50px;

        > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        > span {
          position: absolute;
          left: -10px;
          top: 0;
          font-size: 11px;
          color: #9f7200;
          background: #ffab33;
          border-radius: 27px;
          padding: 1px 3px;
          border: 1px solid #fff;
        }
      }

      .no-user {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px dashed #cbcbcb;
        justify-content: center;
        color: #cbcbcb;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  .pindan-list {
    line-height: 1.2;

    > p {
      font-size: 15px;
      text-align: center;
      color: #111113;
      padding: 15px 0;
      border-bottom: 1px solid #f8f8f8;
    }

    > .pindan-list-con {
      height: 300px;
      padding-left: 10px;
      overflow: auto;
      box-shadow: 0px -11px 0px #fefefe inset;

      > div {
        padding: 10px 10px 10px 0;
        border-bottom: 1px solid #f8f8f8;

        > div:first-child {
          > img {
            width: 32px;
            border-radius: 50%;
            margin-right: 8px;
          }

          > div {
            color: #515255;
            font-size: 12px;

            > div {
              font-size: 12px;

              > span:first-child {
                color: #070709;
              }

              > span:last-child {
                color: #515255;
              }
            }
          }
        }
      }

      > p:last-child {
        font-size: 12px;
        color: #ddd;
        text-align: center;
        padding: 10px 0;
      }
    }
  }
}

.assemble-button {
  font-size: 14px;
  text-align: center;
  background: #e02e24;
  color: #fff;
  line-height: 1.2;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 1.33333rem;
}

.assemble-button1 {
  background: #f4aaa7;
}

.show-share-pop {
  width: 100%;
  background-color: transparent;
  border-radius: 0;
  left: 0;
  top: 0;
}

.active {
  color: #fff !important;
  opacity: 1 !important;
  border-bottom: 2px solid #fff;
  font-weight: 500;
}

.details_head_a {
  height: 50px;
}

.details_head_a a {
  display: inline-block;
  font-size: 15px;
  color: #fff;
  opacity: 0.4;
  margin: 0 10px;
}

.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 1s;
}

.details_head {
  // margin-bottom: -45px;
  position: absolute;
  top: 0;
  width: 100%;

  > div {
    padding: 0 10px;
  }

  // position: relative;
  width: 100%;
  z-index: 10;
  height: 45px;
  background-size: 100%;

  img {
    width: 26px;
    height: 26px;
    vertical-align: baseline;
  }

  .op_img {
    opacity: 0.3;
  }
}

.details_liubai {
  background: #f3f3f3;
  height: 10px;
}

.details_shop_conn {
  overflow: auto;
  //   margin-top: -45px;
  position: relative;
  padding-bottom: 80px;
  z-index: 1;
  flex: 0 100% 0;
}

.details_shop_conn > div:not(:first-child) {
  z-index: 3;
}

.upload_shaer_img {
  position: relative;
  margin: 0 auto;
  width: 80%;
  margin: 5% auto 0;

  i {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

.imgUrl {
  display: block;
  max-width: 100%;
  margin: 0 auto;
}

.upload_shaer_btn {
  padding-top: 10px;
  color: #fff;
  font-size: 14px;
  position: relative;
  text-align: center;

  .upload_img_ewm {
    display: block;
    width: 34px;
    margin: 0 auto;
  }

  span {
    display: inline-block;
    margin-top: 20px;
  }
}

.shop-share {
  position: fixed;
  top: -200%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.shop-share-con {
  width: 100%;
  font-size: 14px;
  line-height: 1;
  overflow: hidden;
  padding: 0 8px;

  > .shop-share-head {
    margin: 8px 0px 15px;
    box-shadow: 0px 0px 24px #d7d7d7;

    > img {
      width: 100%;
      border-radius: 5px;
    }
  }

  > p.shop-share-title {
    line-height: 1.4;
    font-size: 16px;
    color: #2f2f2f;
  }

  > .shop_share_body {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 5px 0;

    > p.shop-share-tj {
      width: 55%;
      color: #c1c1c1;
      font-size: 12px;
      position: relative;
      line-height: 18px;
      text-align: justify;
    }

    > div {
      width: 45%;
      color: #ff2d2c;
      font-weight: bold;
      // min-width: 80px;
      font-size: 16px;
      text-align: right;
      line-height: 1;
      padding-right: 5px;

      > small {
        font-size: 14px;
      }

      > p {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        line-height: 24px;

        > span {
          font-size: 12px;
          color: #999999;
        }
      }

      > p:nth-of-type(2) {
        font-size: 12px;
        color: #999999;
        text-decoration: line-through;

        > small {
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }
}

.shop-share-footer {
  width: 100%;
  padding: 0 8px;
  height: 120px;
  font-size: 14px;
  line-height: 1;
  position: relative;

  > div:first-child {
    img {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      margin-right: 17px;
    }

    > div {
      span {
        font-size: 17px;
        color: #000000;
        font-weight: 500;
      }

      p {
        font-size: 15px;
        margin-top: 7px;
        color: #aaaaaa;
      }
    }
  }
}

.shop-details-2 {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.shop_tj {
  width: 100%;
  margin: 5px 0;

  .shop_tj_title {
    font-size: 16px;
    color: #fb6a19;
    border-color: #fb6a19;
    padding: 0 80px;
  }
}
.xcxshare_img {
  width: 500px;
  height: 400px;
  position: fixed;
  padding: 112.5px 10px 10px 10px;
  top: -2000%;
  // top: 300px;
  left: 0;
  background-size: 100% 100%;

  .share_box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    > img {
      width: 250px;
      height: 250px;
      margin-left: 6.25px;
    }
    .share_right {
      flex: 1;
      height: 100%;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      padding: 80px 0 80px 0;
      .price_regular {
        font-weight: bold;
        line-height: 1.5;
        small {
          font-size: 24px !important;
        }
        b {
          font-size: 36px !important;
        }
        i {
          font-size: 24px !important;
        }
      }

      > p {
        font-size: 20px;
        color: #999;
        text-decoration: line-through;
        line-height: 1.2;
      }
    }
  }
}
</style>
