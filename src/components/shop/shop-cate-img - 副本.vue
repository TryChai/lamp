<template>
  <div class="shop-cate-box" id="shop-cate-box" :class="{sipplierHead:!$route.query.id}">
    <div style="flex: 1;overflow: hidden;">
      <div
         
        style="height: 100%;overflow: initial;display: flex;flex-flow: column;justify-content: flex-start;"
      >
        <supplierTop v-if="!$route.query.id" id="cateImgHead"></supplierTop>
        <div class="cate-header-wrapper" v-else id="cateImgHead" style="height:50px">
          <div>
            <van-icon name="arrow-left" @click="toBack" />
            <div class="fx_3 cate-header-wrapper-tabs">
              <van-tabs
                v-model="active"
                title-active-color="#000"
                title-inactive-color="#bababa"
                @change="changeTab"
                color="#fff"
                :border="false"
                :ellipsis="false"
              >
                <van-tab
                  :name="item.id"
                  :title="item.title.length<=2? toZ(item.title) :item.title"
                  v-for="(item,i) in cate"
                  :key="i"
                ></van-tab>
              </van-tabs>
            </div>
            <span class="cate-right-icon">
              <van-icon @click="$router.push('/shop/shopsearch')" name="search" />
            </span>
          </div>
        </div>
        <van-tree-select
          class="cate-header-select"
            ref="container"
          :class="{leftShow:items.length==0}"
          :items="toItem(items)"
          @click-nav="checkLeft"
          :main-active-index.sync="active1"
        >
          <template slot="content">
            <mescroll-vue
              ref="mescroll"
              :down="mescrollDown"
              :up="mescrollUp"
              @init="mescrollInit"
              id="shop-cate-box-s"
            >
              <div class="slide_box">
                <van-swipe :autoplay="3000">
                  <van-swipe-item v-for="(image, index) in slideList" :key="index">
                    <img v-lazy="image.piclink" style="width:100%;border-radius:10px" />
                  </van-swipe-item>
                </van-swipe>
              </div>
              <!-- <div class="cate-silde" v-show="piclink">
                <van-image :src="piclink">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </div>-->
              <van-sticky
                :container="container"
                class="cate-search-content"
                :class="{notLeft:items.length==0}"
                style="z-index:5"
              >
                <div class="cate-search">
                  <div class="fx menu_sear">
                    <div
                      class="menu_text"
                      @click="getPrice('综合')"
                      :class="{zh_srarch:form.order_sn==''}"
                    >综合</div>
                    <div
                      class="menu_text"
                      @click="getPrice('销量')"
                      :class="{xl_srarch:form.order_sn=='invent_sale_desc'}"
                    >销量</div>
                    <div
                      class="menu_text"
                      @click="getPrice"
                      :class="[form.order_sn=='price_asc' || form.order_sn=='price_desc'?'xl_srarch ':'']"
                    >
                      价格
                      <span>
                        <i
                          class="ascending"
                          :class="[form.order_sn=='price_asc'?'ac_order_up ':'']"
                        ></i>
                        <i
                          class="descending"
                          :class="[form.order_sn=='price_desc'?'ac_order_down ':'']"
                        ></i>
                      </span>
                    </div>
                  </div>
                </div>
              </van-sticky>
              <div class="cate-shop-box">
                <cate-img-shop v-for="(item,i) in list" @sendShop="getShop" :key="i" :item="item" />
              </div>
            </mescroll-vue>
          </template>
        </van-tree-select>
      </div>
    </div>
    <div class="cate-footer">
      <div class="cate-footer-card" @click="showCard=!showCard">
        <van-icon name="cart-o" color="#a5a5a5" />
        已选（{{shopNumber}}）
      </div>
      <div class="cate-footer-btn">
        <span>¥{{$fnc.toFixedZ(price)}}</span>
        <div @click="$router.push('/shop/shopcard')">去购物车</div>
      </div>
      <div class="shop-cate" id="cate-footer" :class="{showPop:showCard}">
        <van-popup
          v-model="showCard"
          position="bottom"
          get-container="#cate-footer"
          id="cate-footer-box"
        >
          <div class="card-img-pop">
            <!-- {{shopCardList}} -->
            <div class="fx card-img-pop-head">
              <p>{{cardList[0]&&cardList[0].info ?cardList[0].info.shop_title : 'xxx'}}</p>
              <p @click="delAll">
                <van-icon name="delete" />清空
              </p>
            </div>
            <div class="card-img-pop-box fx_3" v-if="cardList[0]">
              <div class="fx" v-for="(item,i) in cardList[0].data" :key="i">
                <div>
                  <img v-lazy="item.pro.piclink" alt />
                </div>
                <div class="fx_3">
                  <p class="van-multi-ellipsis--l2">{{item.pro.title}}</p>
                  <p>{{item.sku_cn}}</p>
                  <div class="fx">
                    <p class="cate-img-shop-item-price1">
                      <span>
                        <small>¥</small>
                        {{item.pro.price}}
                      </span>
                      <small v-if="item.pro.market_price">¥{{item.pro.market_price}}</small>
                    </p>
                    <div class="fx">
                      <b class="del-card" @click="toSendShop(item,false)" v-if="item.number>0">－</b>
                      <span class="del-card-number" v-if="item.number>0">{{item.number}}</span>
                      <b class="del-card" @click="toSendShop(item,true)">＋</b>
                      <!-- <van-icon name="add" class="del-card" color="#17b456"   /> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <oneShop :info="item" /> -->
          </div>
        </van-popup>
      </div>
    </div>
    <van-popup
      v-model="show"
      position="bottom"
      get-container="body"
      :overlay="true"
      class="p-p"
      style="border-radius: 5px 5px 0 0;"
    >
      <shopDetailsSku
        :shopInfo="shopRow"
        v-if="show"
        @closePop="getClosePop"
        ref="childs"
        :toAut="0"
      ></shopDetailsSku>
    </van-popup>
  </div>
</template>

<script>
import { TreeSelect, Image, Loading, Sticky } from "vant";
import MescrollVue from "mescroll.js/mescroll.vue";
import cateImgShop from "./shopcate/cate-img-shop";
import { mapGetters, mapState } from "vuex";
import shopDetailsSku from "../shop/shopdetails/shopdetailssku";
import supplierTop from "@/components/shop/shopcate/supplier_top";
export default {
  name: "shop-cate-img",
  components: {
    [TreeSelect.name]: TreeSelect,
    [Image.name]: Image,
    [Loading.name]: Loading,
    MescrollVue,
    cateImgShop,
    shopDetailsSku,
    [Sticky.name]: Sticky,
    supplierTop
  },
  data() {
    return {
      container: null,
      showCard: false,
      piclink: "",
      shopRow: {},
      show: false,
      active: this.$route.query.cate_id || "",
      cate: [],
      active1: 0,
      items: [],
      form: {
        order_sn: ""
      },
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
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
          warpId: "shop-cate-box",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "shop-cate-box-s", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      },
      list: [],
      cateId: "",
      slideList: []
    };
  },
  computed: {
    ...mapState({
      cardLists: state => state.card,
      cardTime: state => state.card.cardTime
    }),
    ...mapGetters(["nowCardNumber", "shopCardList"]),
    cardList() {
      var sid = this.$route.query.id || 0;
      if (this.cardTime) {
        if (this.cardLists.cardlist[sid + "cardItem"] === undefined) {
          return [];
        } else {
          return this.cardLists.cardlist[sid + "cardItem"];
        }
      } else {
        return [];
      }
    },
    shopNumber() {
      if (this.cardTime) {
        var num = 0;
        var list = this.cardList[0] ? this.cardList[0].data : [];
        for (var i in list) {
          num += Number(list[i].number);
        }
        return num;
      } else {
        return 0;
      }
    },
    price() {
      var list = this.cardList[0] ? this.cardList[0].data : [];
      var sum = 0;

      if (list.length > 0 && this.cardTime) {
        // console.log(i)
        for (var i in list) {
          sum += Number(list[i].number) * list[i].pro.price;
        }

        return sum;
      } else {
        return "0.00";
      }
    }
  },
  created() {
    this.getShopCate();
    this.$store.commit("resetCard");
    this.$store.dispatch("getCardModuleList", this.$route.query.id);
  },
  mounted() {
      console.log(this.$refs.container)
    
  },
  methods: {
    delAll() {
      var that = this;
      if (this.cardList[0] && this.cardList[0].data.length == 0) {
        this.$toast("购物车为空!");
        return;
      }
      that
        .$dialog({
          title: "提示",
          message: "是否确认清除？",
          showCancelButton: true
        })
        .then(() => {
          var id = this.$route.query.id || 0;
          that.$store.commit("delAllCard", id);
        })
        .catch(() => {});
    },
    delCard(row) {
      row.check = false;
      var that = this;
      if (that.shopNumber > 1) {
        this.$store.commit("pushCard", row);
      } else {
        that
          .$dialog({
            title: "提示",
            message: "是否确认删除？",
            showCancelButton: true
          })
          .then(() => {
            row.check = true;
            row.delNumber = true;
            that.$store.commit("pushCard", row);
          })
          .catch(() => {});
      }
    },
    toSendShop(row, bool) {
      var that = this;
      row.shopNumber = this.shopNumber;
      row.delNumber = false;
      row.check = bool;
      row.cardId = this.$route.query.id || 0;

      if (!bool && row.number == 1) {
        that
          .$dialog({
            title: "提示",
            message: "是否确认删除？",
            showCancelButton: true
          })
          .then(() => {
            that.$store.commit("delCard", row);
          })
          .catch(() => {});
      } else {
        this.$store.commit("checkCard", row);
      }
    },
    getPrice(str) {
      if (str == "综合") {
        this.form.order_sn = "";
      } else if (str == "销量") {
        this.form.order_sn = "invent_sale_desc";
      } else if (this.form.order_sn == "price_asc") {
        this.form.order_sn = "price_desc";
      } else {
        this.form.order_sn = "price_asc";
      }
      this.mescroll.resetUpScroll();
    },
    getShop(row) {
      // this.shopRow=row;
      this.$set(this, "shopRow", row);
      this.show = true;
    },
    getClosePop() {
      this.show = false;
    },
    changeTab(name) {
      this.active1 = 0;
      console.log(name);
      this.get_slide(name);
      var arr = [];
      for (var i in this.cate) {
        if (this.cate[i].id == name) {
          arr = this.cate[i];
          break;
        }
      }
      if (typeof arr.z == "object") {
        this.items = arr.z;
        if (arr.z.length > 0) {
          this.cateId = this.items[0].id;
          this.piclink = this.items[0].piclink;
          this.mescroll.resetUpScroll();
        } else {
          this.mescroll.endErr();
        }
      } else {
        this.cateId = arr.id;
        this.piclink = arr.piclink;
        this.mescroll.resetUpScroll();
        this.items = [];
      }
    },
    checkLeft(index) {
      if (this.items[index]) {
        this.cateId = this.items[index].id;
        console.log(1);
        this.piclink = this.items[index].piclink;
        this.mescroll.resetUpScroll();
      } else {
        this.$toast("类别错误");
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      var params = {};
      params = this.form;
      params.page = page.num;
      params.cate_id = this.cateId;
      if (this.cateId == "") {
        mescroll.endErr();
        return;
      }
      params.sid = this.$route.query.id;
      params.show_types = 1;
      this.$api.getShop.getShopSearch(params).then(res => {
        if (res.code == 200) {
          let arr = res.result.data;
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
    toItem(arr) {
      if (typeof arr == "object") {
        for (var i in arr) {
          arr[i].text = arr[i].title;
        }

        return arr;
      } else {
        return [];
      }
    },
    toZ(text) {
      var str = "";
      for (var i in text) {
        str += text[i] + " ";
      }
      return str;
    },
    getShopCate() {
      this.$api.getShopCate
        .getSupplierCate({ id: this.$route.query.id })
        .then(res => {
          if (res.code == 200) {

            this.cate = [];
            var arr = res.result.cate || [];

            arr.forEach((item, index) => {
              if (item.show == 1) {
                this.cate.push(item);
              }

              if (this.$route.query.cate_id == item.id) {
                this.cateId = item.id;
                this.active = item.id;
                this.get_slide(item.id);
                this.items = item.z || [];
                if (typeof item.z == "object" && item.z.length > 0) {
                  this.cateId = item.z[0].id;
                  this.piclink = item.z[0].piclink;
                  this.mescroll.resetUpScroll();
                } else {
                  this.cateId = item.id;
                  this.piclink = item.piclink;
                  this.mescroll.resetUpScroll();
                }
              } else if (
                typeof item.z == "object" &&
                index == "0" &&
                !this.$route.query.cate_id
              ) {
                this.items = item.z;
                if (typeof item.z == "object" && item.z.length > 0) {
                  this.cateId = item.z[0].id;
                  this.piclink = item.z[0].piclink;
                  this.mescroll.resetUpScroll();
                } else {
                  this.cateId = item.id;
                  this.piclink = item.piclink;
                  this.mescroll.resetUpScroll();
                }
              }
            });

            this.container = this.$refs.container;
          }
        });
    },
    get_slide(id) {
      if (!id) {
        return;
      }
      this.$api.getShop.get_slide_img({ id: id }).then(res => {
        if (res.code == 200) {
          this.slideList = res.result;
        }
      });
    }
  },
  watch: {
    $route(to, form) {
      if (form.name == "shopcard") {
        this.$store.commit("resetCard");
        this.$store.dispatch("getCardModuleList", this.$route.query.id);
      }
    }
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
  }
};
</script>

<style scoped lang='less'>
#shop-cate-box-s{
    position: relative;
}

.cate-img-shop-item-price1 {
  font-weight: bold;
  span {
    color: #ff543d;
    font-size: 18px;
    small {
      color: #ff543d;
      text-decoration: none;
    }
  }
  small {
    font-size: 12px;
    color: #9c9c9c;
    text-decoration: line-through;
  }
}
.del-card {
  color: #fff;
  font-size: 20px;
  background-color: #2795fc;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
}
.del-card-number {
  padding: 0 4px;
}
.p-p {
  // height: 80%;
  // overflow: auto;
}
.card-img-pop {
  height: 100%;
  display: flex;
  flex-direction: column;
  .card-img-pop-head {
    color: #090909;
    font-weight: 500;
    padding: 10px 14px;
    line-height: 1.6;
    border-bottom: 1px solid #f9f9f9;
    > p:first-child {
      width: 80%;
    }
    p:last-child {
      color: #8e8e8e;
      display: flex;
      align-items: center;
    }
  }
  .card-img-pop-box {
    overflow: auto;
    padding: 0 14px;
    > div {
      flex-wrap: wrap;
      > div:first-child {
        width: 64px;
        height: 64px;
        img {
          display: inline-block;
          width: 100%;
          // height: 100%;
        }
      }
      > div:last-child {
        min-height: 90px;
        padding: 13px 0 13px 10px;
        border-bottom: 1px solid #f9f9f9;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        p:forst-child {
          color: #272823;
          font-weight: 600;
        }
        p:nth-child(2) {
          font-size: 12px;
          color: #8c8c8c;
        }
      }
    }
  }
}
#cate-footer {
  position: absolute;
  background: #fff;
  width: 100%;
  bottom: 46px;
  height: 0;
  right: 0;
  left: 0;
  transition: all 0.3s ease-out, -webkit-transform 0.3s ease-out;
}
.showPop {
  height: 55% !important;
}
#cate-footer-box {
  // bottom: 46px;
  border-bottom: 1px solid #e1e1e1;
  position: absolute;
  border-radius: 0;
  height: 100%;
}
#cate-footer {
  z-index: 10;
}
.cate-footer {
  height: 47px;
  border-top: 1px solid #e1e1e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // position: relative;
  // z-index: 10;
  .cate-footer-card,
  .cate-footer-btn {
    position: relative;
    z-index: 11;
    background-color: #fff;
  }
  .cate-footer-card {
    padding-left: 14px;
    height: 100%;
    flex: 3;
    display: flex;
    align-items: center;
    i {
      font-size: 22px;
      font-weight: 0;
      vertical-align: middle;
    }
    color: #4c4c4c;
    font-weight: 500;
  }
  .cate-footer-btn {
    display: flex;
    align-items: center;
    height: 100%;
    span {
      color: #ff8e00;
      font-size: 17px;
    }
    div {
      width: 112px;
      height: 100%;
      line-height: 45px;
      text-align: center;
      background: #2795fc;
      color: #fff;
      margin-left: 10px;
    }
  }
}
.cate-shop-box {
  padding: 0 0.37333rem 0;
  font-size: 0.37333rem;
  line-height: 1.4;
}
.cate-silde {
  padding: 20px 14px 6px;
  > div {
    width: 100%;
    height: 78px;
  }
}
.textSpc {
  letter-spacing: 4px;
}
.shop-cate-box {
  height: 100%;
  line-height: 1.2;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
  overflow: hidden;
  // position: absolute;
  div.cate-header-wrapper {
    padding: 0 16px;
    // height: calc(50px + var(--safe-area-inset-top));
    z-index: 100;
    width: 100%;
    i {
      font-size: 22px;
    }
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      .cate-header-wrapper-tabs {
        overflow: auto;
        height: 100%;

        > div {
          position: relative;
        }
      }
    }
  }
  .cate-header-select {
    // border-top: 1px solid #f7f7f7;
    // margin: 50px 0 50px;
    padding-top: 10px;
    width: 100%;
    height: auto !important;
    flex: 3;
    overflow: auto;
    > div:first-child {
      min-width: 72px;
      flex: none;
      text-align: center;
      position: relative;
      background-color: #f6f6f6;
      a {
        color: #878787;
        font-size: 12px;
        font-weight: 500;
      }
      a.van-sidebar-item--select {
        color: #2795fc;
        border-color: transparent;
      }
    }
    > div.van-tree-select__content {
      width: 250px;
    }
  }
}
.menu_sear {
  line-height: 1;
  align-items: center;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  color: #8c8c8c;
  background: #fff;
  border-bottom: 1px solid #fcfcfc;
  > div {
    flex: 1;
    text-align: center;
  }
  .menu_text {
    font-size: 14px;
    position: relative;
    word-wrap: normal;
    text-overflow: ellipsis;
    vertical-align: middle;
    width: 100%;
    display: inline-block;
    span {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      height: 34px;
      width: 24px;
      vertical-align: middle;
      font-weight: normal;
      overflow: initial;
      position: relative;
      i {
        width: 0;
        height: 0;
        border: 5px solid transparent;
        position: absolute;
        left: 7px;
      }
      .descending {
        border-top-color: #c0c4cc;
        bottom: 7px;
      }
      .ascending {
        border-bottom-color: #c0c4cc;
        top: 5px;
      }
    }
  }
}
.zh_srarch,
.xl_srarch {
  color: #333;
  font-weight: bold;
}

.ac_order_up {
  border-bottom-color: #409eff !important;
}
.ac_order_down {
  border-top-color: #409eff !important;
}
.ac_order_up .menu_text,
.ac_order_down .menu_text {
  color: #333;
  font-weight: bold;
}
.cate-right-icon {
  padding-left: 5px;
}
</style>