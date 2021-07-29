<template>
  <div style="height:100%;" id="page-vip">
    <div>
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" id="page" class="fx_3">
        <div class="container phone_bg">
          <div class="home_box">
            <div class="phone">
              <div class="phone_top_img"
                  :style="{'background': headList.banner.length == 0?'#f4f4f4':'url('+$fnc.getImgUrl(headList.banner[0].piclink)+') no-repeat center top/100%  ' + `${bannerList.is_show == 1 && bannerList.length != 0 ?  '75%' :'100%'}`}">
                <div class="phone_top_search">
                  <div class="phone_top_search_left" @click="$fnc.goLink(header_iconlist[0].links)">
                    <van-icon :name="header_iconlist[0].piclink || '' " size="20"
                        :info="header_iconlist[0].links == '/shop/shopcard' && car_num != 0 ? car_num:''"
                        :class="[headList.banner.length == 0 ? 'phone_top_search_i1':'phone_top_search_i2']" />
                    <span
                        :class="[headList.banner.length == 0 ? 'phone_top_search_span1': 'phone_top_search_span2']">{{header_iconlist[0].title}}</span>
                  </div>
                  <div class="phone_top_search_middle" @click="$router.push('/shop/shopsearch')">
                    <van-icon name="search" class="phone_top_search_middle_icon" size="20"></van-icon>
                    <van-field input-align="left" style="background-color: transparent;padding:0" v-model="search_input" readonly
                        placeholder="输入您想搜索的关键词" />
                  </div>
                  <div class="phone_top_search_right" @click="$fnc.goLink(header_iconlist[1].links)">
                    <van-icon :name="header_iconlist[1].piclink || ''" size="21"
                        :info="header_iconlist[1].links == '/shop/shopcard' && car_num != 0 ? car_num:''"
                        :class="[headList.banner.length == 0 ? 'phone_top_search_i1':'phone_top_search_i2']">
                    </van-icon>
                    <span
                        :class="[headList.banner.length == 0 ? 'phone_top_search_span1': 'phone_top_search_span2']">{{header_iconlist[1].title}}</span>
                  </div>
                </div>
                <div class="phone_top_word" v-if="searchList.length != 0 && is_show_cate == 1">
                  <van-tabs style="width: 100%;background-color: transparent;" :border="false" :swipeable="true" :ine-height="0">
                    <van-tab v-for="item in searchList" :key="item.id">
                      <div slot="title">
                        <span class="search_span" @click="$router.push({path:'/shop/shopsearch',query:{cate_id:item.id}})">{{item.title}}</span>
                      </div>
                    </van-tab>
                  </van-tabs>
                </div>
                <div style="width:94%;margin:0 auto" v-if="is_show_tuanzhang == 1 && $store.state.config.plugin.xxmk.is_open == 1">
                  <nowaddress></nowaddress>
                </div>
                <div class="carousel" v-if="bannerList.is_show == 1 && bannerList.length != 0"
                    :style="{'margin-top':searchList.length != 0 && is_show_cate == 1 ?'0' :'3px'}">
                  <van-swipe class="swiImgs" style="width: 100%;height: 100%;" :autoplay="3000" :show-indicators='false'>
                    <van-swipe-item v-for="(item,index) in bannerList.banner" :key="index" data-index="index" class="item">
                      <a @click.prevent="href_inspect(item.links)" style="display:block;width: 100%;height: 100%;">
                        <img v-lazy="item.piclink" :src="item.piclink" />
                      </a>
                    </van-swipe-item>
                  </van-swipe>
                </div>
              </div>

              <vip-menu v-if="menuList.is_show == 1 && menuList.length != 0" :menuList="menuList" />

              <all-module-item :partList="partList" />
              <vipNews :news_form="news_form" />

              <div class="phone_shop" style="margin-bottom :0" v-if="shopList.is_show == 1">
                <div class="phone_shop_body">
                  <div class="phone_title_shop" v-if="shopList.title || shopList.title_en">
                    <div class="phone_title_left">
                      <p>
                        {{shopList.title}}
                        <span>{{this.shopList.title_en}}</span>
                      </p>
                    </div>
                    <div class="phone_title_right">
                      <p class="phone_subtitle" @click="$router.push('/shop/shopsearch')"></p>
                    </div>
                  </div>
                  <div class="phone_shop_content" v-if="shopList.style=='0'">
                    <indexshoplist :top_shoplist="productList" />
                  </div>
                  <div class="phone_shop_content" v-else>
                    <!-- <indexshoplist :top_shoplist="productList" /> -->
                    <oneShop :info="item" v-for="(item,i) in productList" :key="i" />
                  </div>
                </div>
              </div>
              <div id="page-loading"></div>
              <div class="phone_shop_copyright" @click="href_inspect(copyright_link)" v-if="copyright != ''">{{copyright}}</div>
            </div>
          </div>
          <coupon :show="coupon_show" :da="coupon_list" @close_coupon="reveive_close" style="margin: 0 auto;background-color: transparent"></coupon>
          <transition name="go-top">
            <img v-if="btnFlag" class="go-top" src="./../../assets/img/top.png" @click="backTop" />
          </transition>
        </div>
      </mescroll-vue>
      <!-- <turn @send_isturn="receive_appturn" :con="'指定抽奖'" :show="app_turnshow" :turn_num="null"></turn> -->
    </div>
  </div>
</template>

<script>

import MescrollVue from "mescroll.js/mescroll.vue";
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
import coupon from "@/components/page/new-coupon/new-coupon.vue";
import { Skeleton, Image, Loading, Field } from "vant";

import Cookies from "js-cookie";
import { setTimeout } from "timers";

import oneShop from "@/components/currency/page/one-shop.vue";
import { mapState } from "vuex";
// import turn from '@/components/page/turn';
import vipMenu from "./vip/vip-menu";
import allModuleItem from "@/components/currency/page/all-module-item/all-module-item";
import vipNews from "./vip/vip-news";
import nowaddress from "@/components/page/vip/nowaddress"
import turn from "@/components/page/turn";
export default {
  name: "vip",
  data () {
    return {
      news_form: {
        newslist: [],
        homeis_show_new_title: "",
        pageis_show_new: "", // 是否显示新闻开关
        pageis_show_new_cate: "" // 显示的分类
      },
      is_show_cate: false, //分类是否显示
      is_show_tuanzhang: false, //自提是否显示
      header_iconlist: [
        {
          cate: "",
          desc: "",
          id: "",
          links: "",
          piclink: "",
          show: "",
          title: ""
        },
        {
          cate: "",
          desc: "",
          id: "",
          links: "",
          piclink: "",
          show: "",
          title: ""
        }
      ], //头部左右icon
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
          size: 50 //每页数据条数,默认10
        },
        loadFull: {
          auto: false,
          delay: 1500
        },
        offset: 1000,
        noMoreSize: 2, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">^_^1秒更多商品就赶来...</p>',
        htmlNodata: `<p class="upwarp-nodata">--------商品推荐完成--------</p>`,
        toTop: {
          //回到顶部按钮
          warpId: "page-vip",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        }
        // empty: {
        //     //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
        //     warpId: "page", //父布局的id (1.3.5版本支持传入dom元素)
        //     icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
        //     tip: "暂无相关数据~" //提示
        // }
      },
      copyright: "",
      copyright_link: "",
      btnFlag: false,
      loading: false,
      coupon_list: [
        {
          money: "11",
          desc: "11",
          xfm: "11",
          end_time: "22"
        },
      ],
      coupon_show: false,
      sel_tab: 0, // 选择导航
      images: ["https://img.yzcdn.cn/1.jpg", "https://img.yzcdn.cn/2.jpg"],
      topList: {
        title: "",
        logo: ""
      },
      //商品详情
      productList: [],
      shopList: {
        is_show: "1",
        iden: "home",
        title: null,
        title_en: null,
        types: "product",
        pro: [{}]
      },
      // 模块
      partList: [
        {
          banner: []
        }
      ],
      //菜单选项
      menuList: {
        banner: []
      },
      //轮播图
      bannerList: {
        banner: []
      },
      //头部背景
      headList: {
        banner: []
      },
      footerList: [{}],
      searchList: [],
      search_input: "输入您想搜索的关键词", //搜索框内容
      imgIndex: 1,
    };
  },
  computed: {
    ...mapState({
      car_num: state => state.car_num,
      app_turnshow: state => state.app_turnshow
    })
  },
  components: {
    indexshoplist,
    coupon,
    [Skeleton.name]: Skeleton,
    [Image.name]: Image,
    [Loading.name]: Loading,
    [Field.name]: Field,
    MescrollVue,
    oneShop,
    vipMenu,
    allModuleItem,
    vipNews,
    nowaddress,
    turn
  },
  beforeCreate () {
    if (sessionStorage.getItem("is_announ") == null) {
      sessionStorage.setItem("is_announ", JSON.stringify(true)); //弹出框
    }
  },

  created () {


    this.iden = this.$route.query.iden || "home";
    // if (this.iden == "home") {
    //     try {
    //         this.setDefaultPage();
    //     } catch (error) {
    //         new error("错误 vip.vue 440");
    //     }
    // }
    this.get_info(this.iden);
    this.footerList = this.$store.state.config.footer;

    var user = Cookies.get("user") ? true : false;
    //判断是否有新手红包可以领取

    if (
      (this.$store.state.user && this.$store.state.user.noob_coupon == undefined ||
        this.$store.state.user.noob_coupon == {} ||
        this.$store.state.user.noob_coupon == "") &&
      user
    ) {
      this.$api.getUser.getUserInfo({}).then(res => {
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
        this.get_new_coupon();
      }, 500);
    }
  },
  methods: {

    getNew (id) {
      this.$api.getnews
        .get_news_list({
          cate_id: id
        })
        .then(res => {
          if (res.code == 200) {
            this.news_form.newslist = res.result.data || [];
          }
        });
    },
    receive_appturn (val) {
      this.is_turn = val;
    },
    setDefaultPage () {
      var data = localStorage.getItem("pageData");
      if (data) {
        data = JSON.parse(data);

        this.bannerList = data.info.slide;

        this.topList.title = data.head;
        this.topList.logo = data.logo;
        this.headList = data.info.background;

        this.menuList = data.info.navigation;

        this.shopList = data.info.product;

        this.partList = data.module;
        this.searchList = data.product_cate;
        this.copyright = data.copyright;
        this.copyright_link = data.copyright_link || '';
        this.header_iconlist = [];
        this.header_iconlist.push(data.header[0]);
        this.header_iconlist.push(data.header[1]);
        this.is_show_cate = data.is_show_cate;
        this.is_show_tuanzhang = data.is_show_tuanzhang;

        if (data.homeis_show_new) {
          this.news_form.pageis_show_new = data.homeis_show_new;
          this.news_form.homeis_show_new_title = data.homeis_show_new_title;
          this.news_form.pageis_show_new_cate = data.homeis_show_new_cate;
          this.getNew(data.homeis_show_new_cate);
        }

      }
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback (page, mescroll) {
      this.$api.getShop
        .getIndexProductList({ page: page.num, page_size: 50, iden: this.$route.query.iden })
        .then(res => {
          if (res.code == 200) {
            let arr = res.result.info.product.pro;
            // 如果是第一页需手动置空列表
            if (page.num == 1) this.productList = [];
            // 把请求到的数据添加到列表
            this.productList = this.productList.concat(arr);
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              setTimeout(() => {
                mescroll.endSuccess(arr.length);
              }, 1500);
            });
          } else {
            mescroll.endErr();
          }
        });
    },
    backTop () {
      const that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    toCoupon () {
      if (this.$store.state.config.plugin.sqhb.is_open == 1) {
        this.$router.push("/page/sign");
      }
    },
    get_new_coupon () {
      this.$api.getPage.get_new_coupon({}).then(res => {
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
    href_inspect (val) {
      if (val == "/plugin/turntable") {
        this.$store.commit("set_turnshow", true);
        return;
      }
      this.$fnc.goLink(val);
    },
    get_info (iden) {
      this.$api.getPage.getindex({ iden: iden }).then(res => {
        if (iden == "home" && res.code == 200) {
          localStorage.setItem("pageData", JSON.stringify(res.result));
        }
        if (res.code == 200) {
          this.bannerList = res.result.info.slide;
          this.topList.title = res.result.head;
          this.topList.logo = res.result.logo;
          this.headList = res.result.info.background;
          this.menuList = res.result.info.navigation;
          this.shopList = res.result.info.product;
          this.partList = res.result.module;
          this.searchList = res.result.product_cate;
          this.copyright = res.result.copyright;
          this.copyright_link = res.result.copyright_link || '';
          this.header_iconlist = [];
          this.header_iconlist.push(res.result.header[0]);
          this.header_iconlist.push(res.result.header[1]);
          this.is_show_cate = res.result.is_show_cate;
          this.is_show_tuanzhang = res.result.is_show_tuanzhang;

          if (res.result.homeis_show_new) {
            this.news_form.pageis_show_new = res.result.homeis_show_new;
            this.news_form.homeis_show_new_title =
              res.result.homeis_show_new_title;
            this.news_form.pageis_show_new_cate =
              res.result.homeis_show_new_cate;
            this.getNew(res.result.homeis_show_new_cate);
          }
        }
      });
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
  filters: {
    toFix (val) {
      return parseFloat(val).toFixed(2);
    }
  },
  mounted () { },
  destroyed () { },
  watch: {
    $route () {
      this.iden = this.$route.query.iden;
    }
  }
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
  width: 26px;
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
  > div {
    height: 100%;
    display: flex;
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
</style>