<template>
  <div style="height:100%;" id="proupbuy-index">
    <div>
      <mescroll-vue
        ref="mescroll"
        :down="mescrollDown"
        :up="mescrollUp"
        @init="mescrollInit"
        id="proupbuy"
        class="fx_3"
      >
        <div class="container phone_bg">
          <div class="home_box">
            <div class="phone">
              <div
                class="phone_top_img"
                :style="{'background': headList.banner.length == 0?'#f4f4f4':'url('+$fnc.getImgUrl(headList.banner[0].piclink)+') no-repeat center top/100%  ' + `${bannerList.is_show == 1 && bannerList.length != 0 ?  '75%' :'100%'}`}"
              >
                <div class="proupbuy_top_search">
                  <div class="proupbuy_top_search_one" @click="$router.push('/shop/shopsearch')">
                    <van-search
                      placeholder="请输入您要搜索的关键词"
                      background="transparent"
                      shape="round"
                      left-icon
                      readonly
                    >
                      <template #right-icon>
                        <div class="proupbuy_top_search_one_icon">
                          <van-icon name="search"></van-icon>
                        </div>
                      </template>
                    </van-search>
                  </div>
                  <div
                    class="proupbuy_top_search_two"
                    @click="$router.push({path:header_iconlist[0].links})"
                  >
                    <van-icon
                      :name="header_iconlist[0].piclink || '' "
                      :info="header_iconlist[0].links == '/shop/shopcard' && car_num != 0 ? car_num:''"
                      :class="[headList.banner.length == 0 ? 'proupbuy_top_search_two_i1':'proupbuy_top_search_two_i2']"
                    />
                  </div>
                  <div
                    class="proupbuy_top_search_two"
                    @click="$router.push({path:header_iconlist[1].links})"
                  >
                    <van-icon
                      :name="header_iconlist[1].piclink || ''"
                      :info="header_iconlist[1].links == '/shop/shopcard' && car_num != 0 ? car_num:''"
                      :class="[headList.banner.length == 0 ? 'proupbuy_top_search_two_i1':'proupbuy_top_search_two_i2']"
                    ></van-icon>
                  </div>
                </div>

                <div
                  class="carousel"
                  v-if="bannerList.is_show == 1 && bannerList.length != 0"
                  :style="{'margin-top':cateList.length != 0 ?'0' :'3px'}"
                >
                  <van-swipe
                    class="swiImgs"
                    style="width: 100%;height: 100%;"
                    :autoplay="3000"
                    :show-indicators="false"
                  >
                    <van-swipe-item
                      v-for="(item,index) in bannerList.banner"
                      :key="index"
                      data-index="index"
                      class="item"
                    >
                      <a
                        @click.prevent="href_inspect(item.links)"
                        style="display:block;width: 100%;height: 100%;"
                      >
                        <img v-lazy="item.piclink" :src="item.piclink" />
                      </a>
                    </van-swipe-item>
                  </van-swipe>
                </div>
              </div>

              <vip-menu
                v-if="menuList.is_show == 1 && menuList.banner.length != 0"
                :menuList="menuList"
              />

              <all-module-item :partList="partList" />

              <div class="groupbuy_cate">
                <div class="groupbuy_cate_top">
                  <div
                    :class="active=='groupbuy'?'groupbuy_active':''"
                    v-if="shopList.is_show == 1"
                    @click="selCate('groupbuy')"
                  >
                    <p>{{shopList.title}}</p>
                    <p>{{shopList.title_en}}</p>
                    <p></p>
                  </div>
                  <div
                    v-for="(cate,i) in cateList"
                    :key="i"
                    @click="selCate(cate)"
                    :class="active==cate.id?'groupbuy_active':''"
                  >
                    <p>{{cate.title}}</p>
                    <p>{{cate.sub_title}}</p>
                    <p></p>
                  </div>
                </div>
              </div>
              <div v-if="show">
                <oneShop :info="item" v-for="(item,i) in shopList.pro" :key="i" />
              </div>
              <div v-else>
                <oneShop :info="item" v-for="(item,i) in productList" :key="i" />
              </div>
              <div
                class="phone_shop_copyright"
                @click="href_inspect(copyright_link)"
                v-if="copyright != ''"
              >{{copyright}}</div>
            </div>
          </div>
        </div>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import { Field, Search, Tab, Tabs } from "vant";
import MescrollVue from "mescroll.js/mescroll.vue";
import { mapState } from "vuex";
import vipMenu from "./vip/vip-menu";
import allModuleItem from "@/components/currency/page/all-module-item/all-module-item";
import oneShop from "@/components/currency/page/one-shop-gb.vue";
export default {
  name: "vip",
  components: {
    [Field.name]: Field,
    [Search.name]: Search,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    MescrollVue,
    vipMenu,
    allModuleItem,
    oneShop
  },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false
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
        htmlLoading:
          '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">^_^1秒更多商品就赶来...</p>',
        htmlNodata: `<p class="upwarp-nodata">--------商品推荐完成--------</p>`,
        toTop: {
          //回到顶部按钮
          warpId: "proupbuy-index",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        }
      },
      shopList: {
        is_show: "1",
        iden: "group_buy",
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
      cateList: [],
      search_input: "输入您想搜索的关键词",
      header_iconlist: [
        //头部左右icon
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
      ],
      cateID: 0,
      show: true,
      productList: [],
      active: "groupbuy",
      copyright: "",
      copyright_link: ""
    };
  },
  computed: {
    ...mapState({
      car_num: state => state.car_num
    })
  },
  beforeCreate() {},
  created() {
    this.get_info();
  },
  methods: {
    selCate(val) {
      if (val == "groupbuy") {
        this.show = true;
        this.active = "groupbuy";
      } else {
        this.active = val.id;
        this.cateID = val.id;
        this.show = false;
        this.mescroll.resetUpScroll();
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(page, mescroll) {
      var params = {};
      params.page = page.num;
      params.id = this.cateID;
      if (this.cateID <= 0) {
        mescroll.endErr();
        return;
      }
      this.$api.getShop.get_groupbuyProduct(params).then(res => {
        if (res.code == 200) {
          let arr = res.result;
          if (page.num == 1) this.productList = [];
          this.productList = this.productList.concat(arr);
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
    get_info() {
      this.$api.getPage.getindex({ iden: "group_buy" }).then(res => {
        if (res.code == 200) {
          this.menuList = res.result.info.navigation;
          this.bannerList = res.result.info.slide;
          this.headList = res.result.info.background;
          this.shopList = res.result.info.product;
          this.partList = res.result.module;
          this.cateList = res.result.product_cate;
          this.header_iconlist = [];
          this.header_iconlist.push(res.result.header[0]);
          this.header_iconlist.push(res.result.header[1]);
          this.copyright = res.result.copyright;
          this.copyright_link = res.result.copyright_link || "";
          if (this.shopList.is_show == 0) {
            this.show = false;
            if (res.result.product_cate && res.result.product_cate[0]) {
              this.cateID = res.result.product_cate[0].id;
              this.active = res.result.product_cate[0].id;
              this.mescroll.resetUpScroll();
            }
          }
        }
      });
    },
    href_inspect (val) {
      if (val == "/plugin/turntable") {
        this.$store.commit("set_turnshow", true);
        return;
      }
      this.$fnc.goLink(val);
    },
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
  filters: {},
  mounted() {},
  destroyed() {},
  watch: {}
};
</script>

<style scoped lang='less'>
@import "./../../assets/css/page.css";
.phone_bg {
  height: 100%;
}
#proupbuy-index {
  > div {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  #proupbuy {
    background: #f4f4f4;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .proupbuy_top_search {
    width: 100%;
    height: 50px;
    padding: 10px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    z-index: 6;
    font-size: 14px;
    .proupbuy_top_search_one {
      width: 78%;
      height: 100%;
      .van-search {
        padding: 0;
        width: 100%;
        height: 100%;
        .van-search__content {
          height: 100%;
          padding: 6px 0 6px 15px;
        }
      }
      .proupbuy_top_search_one_icon {
        border-left: 1px solid #bbbbbb;
        .van-icon {
          padding-left: 8px;
          font-size: 20px;
        }
      }
    }
    .proupbuy_top_search_two {
      width: 10%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .proupbuy_top_search_two_i1 {
        color: #000000;
        z-index: 10;
        font-size: 26px;
      }
      .proupbuy_top_search_two_i2 {
        color: #ffffff;
        z-index: 10;
        font-size: 26px;
      }
    }
  }

  .groupbuy_cate {
    width: 100%;
    height: 100%;
    background: transparent;
    padding: 0 10px 0 3px;
    margin: 12px 0;
    .groupbuy_cate_top {
      width: 100%;
      display: -webkit-box;
      overflow-y: hidden;
      > div {
        position: relative;
        width: 25%;
        line-height: 1.5;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        text-align: center;
        > p {
          width: 100%;
        }
        > p:nth-of-type(1) {
          color: #3a4658;
          font-size: 16px;
          font-weight: bold;
        }
        > p:nth-of-type(2) {
          color: #999999;
          font-size: 12px;
          padding-bottom: 10px;
        }
        > p:nth-of-type(3) {
          position: absolute;
          bottom: 0;
          width: 50%;
          height: 0;
          border: 1px solid transparent;
        }
      }
      .groupbuy_active {
        > p:nth-of-type(1) {
          color: #f21551;
        }
        > p:nth-of-type(2) {
          color: #f21551;
        }
        > p:nth-of-type(3) {
          border: 1px solid #f21551;
        }
      }
    }
  }
}
</style>