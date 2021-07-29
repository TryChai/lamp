<template>
  <div style="height: 100%" id="page-vip">
    <div id="page" ref="pageIndex">
      <div class="fx_3">
        <pageTop :headerdata="header_data" :carouseldata="carousel_data" :page="page"></pageTop>
        <div class="modulepart">
          <vip-menu v-if="menu_data.show == 1 && menu_data.banner.length != 0" :menuList="menu_data" />
        </div>
        <div class="modulebox">
          <div class="modulepart" v-for="(item, i) in module_data" :key="i" v-show="item.show == 1">
            <div v-if="item.types == 'banner'">
              <moduleBanner :info="item"></moduleBanner>
            </div>
            <div v-else-if="item.types == 'text'">
              <moduleText :info="item"></moduleText>
            </div>
            <div v-else-if="item.types == 'spike'">
              <moduleSpikeAll :info="item" v-if="item.style == 1"></moduleSpikeAll>
              <moduleSpike :info="item" v-else></moduleSpike>
            </div>
            <div v-else-if="item.types == 'product' && item.links == 'presale'">
              <!-- 预售商品 -->
              <modulePresale :info="item"></modulePresale>
            </div>
            <div v-else-if="item.types == 'product' && item.links == 'group'">
              <!-- 拼图购物 -->
              <moduleGroup :info="item"></moduleGroup>
            </div>
            <div v-else-if="item.types == 'product' && item.links == 'knowledge'">
              <moduleKnowledge :info="item"></moduleKnowledge>
            </div>
            <div v-else-if="item.types == 'product' && item.links == 'auction'">
              <moduleAuction :info="item"></moduleAuction>
            </div>
            <div v-else-if="item.types == 'product' && item.links == 'lyg'">
              <!-- 零元购 -->
              <zero :info="item"></zero>
            </div>
            <div v-else-if="item.types == 'product' && item.links == 'together'">
              <!-- 拼购 -->
              <moduleTogether :info="item"></moduleTogether>
            </div>
            
            <div v-else-if="item.types == 'product' && item.links == 'audio'">
              <!-- 音频模块 -->
              <bookAduio :info="item"></bookAduio>
            </div>
            
            <div v-else-if="item.types == 'product' && item.links == 'fiction'">
              <!-- 小说模块 -->
              <bookNovel :info="item"></bookNovel>
            </div>
            
            <!-- 人物 -->
            <div v-else-if="item.types == 'product' && item.links == 'character'">
              <moduleCharacter :info="item"></moduleCharacter>
            </div>
            
            <div v-else-if="item.types == 'product'">
              <!-- 普通商品 旅游商品 -->
              <moduleProduct :info="item"></moduleProduct>
            </div>
            <div v-else-if="item.types == 'supplier'">
              <moduleSupplier :info="item"></moduleSupplier>
            </div>
            <div v-else-if="item.types == 'cityinfo'">
              <!-- 同城信息 -->
              <moduleCityinfo :info="item"></moduleCityinfo>
            </div>
            <div v-else-if="item.types == 'task'">
              <!-- 任务电商 -->
              <moduleTask :info="item"></moduleTask>
            </div>
            <div v-else-if="item.types == 'news'">
              <moduleNews :info="item"></moduleNews>
            </div>
            <div v-else-if="item.types == 'hotel'">
              <moduleHotel :info="item"></moduleHotel>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新手优惠券 -->
    <coupon :show="coupon_show" :da="coupon_list" @close_coupon="reveive_close" style="margin: 0 auto; background-color: transparent"></coupon>

    <!-- 推荐 归来红包 -->
    <returnRecomm :show="recomm_show" :da="recomm_list" @close_coupon="reveive_close" style="margin: 0 auto; background-color: transparent">
    </returnRecomm>

    <transition name="go-top">
      <img v-if="btnFlag" class="go-top" src="./../../assets/img/top.png" @click="backTop" />
    </transition>
  </div>
</template>

<script>
import { Skeleton, Image, Loading, Field } from "vant";
import Cookies from "js-cookie";

import coupon from "@/components/page/new-coupon/new-coupon.vue";
import returnRecomm from "@/components/page/new-coupon/return_recomm.vue";
import pageTop from "@/components/page/vip/vip-top";
import vipMenu from "@/components/page/vip/vip-menu";
import moduleBanner from "@/components/page/vip/moduleBanner";
import moduleText from "@/components/page/vip/moduleText";
import moduleSpike from "@/components/page/vip/moduleSpike";
import modulePresale from "@/components/page/vip/modulePresale";
import moduleGroup from "@/components/page/vip/moduleGroup";
import moduleSupplier from "@/components/page/vip/moduleSupplier";
import moduleKnowledge from "@/components/page/vip/moduleKnowledge";
import moduleNews from "@/components/page/vip/moduleNews";
import moduleProduct from "@/components/page/vip/moduleProduct";
import moduleAuction from "@/components/page/vip/moduleAuction";
import moduleTogether from "@/components/page/vip/moduleTogether";
import moduleCityinfo from "@/components/page/vip/moduleCityinfo";
import moduleTask from "@/components/page/vip/moduleTask";
import moduleHotel from "@/components/page/vip/moduleHotel";
import bookAduio from "@/components/page/vip/book_aduio.vue";
import bookNovel from "@/components/page/vip/book_novel";
import zero from "@/components/page/vip/zero";
import wx from "weixin-js-sdk";
import moduleSpikeAll from "@/components/page/vip/moduleSpikeAll";
import moduleCharacter from "@/components/page/vip/moduleCharacter";

export default {
  name: "vip",
  data () {
    return {
      scrollTop: 0,
      mescroShopIndex: null,
      is_down: false,
      btnFlag: false,
      coupon_list: [
        {
          money: "",
          desc: "",
          xfm: "",
          end_time: "",
        },
      ],
      coupon_show: false,
      module_data: [],
      menu_data: {
        banner: [],
      },
      carousel_data: {},
      header_data: {},
      page: {},
      recomm_show: false, //归来推荐红包
      recomm_list: [], //红包数据
    };
  },
  computed: {},
  components: {
    coupon,
    [Skeleton.name]: Skeleton,
    [Image.name]: Image,
    [Loading.name]: Loading,
    [Field.name]: Field,
    pageTop,
    vipMenu,
    moduleBanner,
    moduleText,
    moduleSpike,
    modulePresale,
    moduleGroup,
    moduleSupplier,
    moduleKnowledge,
    moduleNews,
    moduleProduct,
    moduleAuction,
    moduleTogether,
    moduleCityinfo,
    moduleTask,
    moduleHotel,
    returnRecomm,
    zero,
    moduleSpikeAll,
    bookAduio,
    bookNovel,
    moduleCharacter
  },
  beforeCreate () {
    if (sessionStorage.getItem("is_announ") == null) {
      sessionStorage.setItem("is_announ", JSON.stringify(true)); //弹出框
    }
  },
  mounted () {
    this.$refs.pageIndex.addEventListener("scroll", this.scrollToTop);
  },
  destroyed () {
    this.$refs.pageIndex.removeEventListener("scroll", this.scrollToTop);
  },

  created () {
    var user = Cookies.get("user") ? true : false;
    //判断是否有新手红包可以领取
    if (
      ((this.$store.state.user &&
        this.$store.state.user.noob_coupon == undefined) ||
        this.$store.state.user.noob_coupon == {} ||
        this.$store.state.user.noob_coupon == "") &&
      user
    ) {
      this.$api.getUser.getUserInfo({}).then((res) => {
        if (res.code == 200) {
          this.$store.commit("setUser", res.result);
          this.flag = JSON.parse(res.result.flag);
          if (user && res.result.noob_coupon == 0) {
            setTimeout(() => {
              this.get_new_coupon();
            }, 500);
          }
        }
      });
    } else if (user && this.$store.state.user.noob_coupon == 0) {
      setTimeout(() => {
        // this.coupon_show = true;
        this.get_new_coupon();
      }, 500);
    }
    this.getIndexData();

    this.getIsGltj(); //推荐归来红包
  },
  methods: {
    scrollToTop () {
      var that = this;
      that.scrollTop = this.$refs.pageIndex.scrollTop;
      if (that.scrollTop > 200) {
        that.btnFlag = true;
      } else {
        that.btnFlag = false;
      }
    },

    getIndexData () {
      this.$api.getPage
        .get_pageindex({ iden: this.$route.query.iden })
        .then((res) => {
          if (res.code == 200) {
            this.page = res.result;
            var length = res.result.module.length;
            document.title = res.result.title;
            res.result.module.forEach((item, i) => {
              switch (true) {
                case item.types == "headericon":
                  this.header_data = item;
                  break;
                case item.types == "slides":
                  this.carousel_data = item;
                  break;
                case item.types == "menu":
                  this.menu_data = item;
                  break;
                case item.types == "spike":
                  // 秒杀有商品并且不处于已结束状态 distance_types 1未开始 2进行中 3结束中
                  //  && item.banner[0].distance_end_time >= 0
                  if (
                    item.style != 1 &&
                    item.banner &&
                    item.banner.length > 0 &&
                    item.banner[0].activity &&
                    (item.banner[0].activity.distance_types == 1 ||
                      item.banner[0].activity.distance_types == 2)
                  ) {
                    this.module_data.push(item);
                  } else if (
                    item.style == 1 &&
                    item.banner &&
                    item.banner.length > 0
                  ) {
                    this.module_data.push(item);
                  }
                  break;
                default:
                  this.module_data.push(item);
                  break;
              }
            });

            var footprint = {
              title: res.result.title,
              piclink: res.result.piclink,
              types: "主题页面",
              pid: res.result.id,
            };
            this.$fnc.record_footprint(footprint);

            // var obj = {};
            // obj.title = res.result.title;
            // if (this.$store.state.config.shop.jianjie && this.$store.state.config.shop.jianjie != '') {
            //   obj.desc = this.$store.state.config.shop.jianjie;
            // } else {
            //   obj.desc = document.title + "欢迎你";
            // }
            // obj.piclink = res.result.piclink;
            // obj.link = window.location.href;
            // wx.miniProgram.postMessage({
            //   data: obj
            // });
          }
        });
    },
    receive_appturn (val) {
      this.is_turn = val;
    },
    backTop () {
      const that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5);
        this.$refs.pageIndex.scrollTop = document.body.scrollTop =
          that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },

    get_new_coupon () {
      //判断用户注册时间是否在今天created_time
      if (this.$fnc.getTimeFormat(this.$store.state.user.created_time, 'ymd') != this.$fnc.getTimeFormat(new Date().getTime(), 'ymd')) {
        return;
      }
      this.$api.getPage.get_new_coupon({}).then((res) => {
        if (res.code == 200) {
          if (res.result != false) {
            this.coupon_show = true;
            this.coupon_list = res.result;
          }
        }
      });
    },
    reveive_close () {
      this.$store.commit("set_turnshow", false);
    },
    getIsGltj () {
      //归来推荐红包
      let packet_type = this.$route.query.packet_type;
      if (packet_type) {
        this.$api.getPage.getRedEnvelopes({ type: packet_type }).then((res) => {
          // console.log("归来红包：",res)
          if (res.code == 200) {
            this.recomm_list = res.result;
            this.recomm_show = true;
          }
        });
      }
    },
  },
  watch: {
    // $route (old, after) {
    //   if (old.path == '/page/index') {
    //     this.iden = this.$route.query.iden;
    //     this.getIndexData();
    //   }
    // }
  },
  activated () {
    this.$refs.pageIndex.scrollTop = this.scrollTop
  },
};
</script>

<style scoped lang='less'>
@import "./../../assets/css/page.css";

.page-conn {
  display: flex;
  flex-direction: column;
}
.van-tag {
  padding-top: 0;
  padding-bottom: 0;
}
.phone_bg {
  height: 100%;
  /* padding-bottom: 40px; */
  // margin-bottom: 50px;
}
.foot_div {
  height: auto;
}
.go-top {
  animation-duration: 0.5s;
  z-index: 9990;
  position: fixed;
  right: 10px;
  bottom: 60px;
  width: 36px;
  border-radius: 50%;
  /* opacity: 0; */
}
.go-top-enter,
.go-top-leave-to {
  opacity: 0;
}
.go-top-enter-to,
.go-top-leave {
  opacity: 1;
}
.go-top-enter-active,
.go-top-leave-active {
  transition: 2s;
}
#page-vip {
  overflow: auto;
  padding-bottom: 50px;
  > div {
    height: 100%;
    // display: flex;
    flex-direction: column;
  }
  #page {
    background: #f4f4f4;
    // position: fixed;
    // top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
.modulepart {
  width: 100%;
  margin-bottom: 8px;
  // margin-top: 5px;
}
</style>