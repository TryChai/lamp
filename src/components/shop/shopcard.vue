<template>
  <div class="card_con" id="card_con">
    <van-nav-bar
      title="购物车"
      left-arrow
      class="navbar"
      :fixed="true"
      @click-left="onClickLeft"
      @click-right="togg = !togg"
    >
      <span slot="right" style="color: #707070">
        {{ togg ? "管理" : "完成" }}
      </span>
    </van-nav-bar>
    <div class="card_list" v-if="list.length > 0">
      <card
        :item="item"
        :index="i"
        v-for="(item, i) in list"
        :key="i"
        @shop_click="rec_shop_click"
        @setTotal="getTotal"
        :checkedAll="show"
        @delShop="delShop"
      />
    </div>
    <div v-else class="not_cat">
      <mescroll-vue
        ref="mescroll"
        :down="mescrollDown"
        :up="mescrollUp"
        @init="mescrollInit"
        class="scol"
      >
        <div class="not_cat_head tc bgwrite">
          <img src="../../assets/img/shop/no-product.jpg" alt />
          <p>购物车空空如也</p>
        </div>
        <div class="fx product-card-title">
          <img src="../../assets/img/order/06.png" alt />
          <span>猜你喜欢</span>
          <img src="../../assets/img/order/05.png" alt />
        </div>

        <div class="shop_scroll">
          <indexshoplist :top_shoplist="listProduct" />
        </div>
      </mescroll-vue>
    </div>

    <van-submit-bar
      v-if="list.length > 0"
      :style="{ bottom: list.length > 0 ? '48px' : '0' }"
      :class="[
        list.length > 0 ? 'subCard_shop' : 'subCard_noshop',
        !togg ? 'hide_pri' : '',
      ]"
      class="subCard"
      :price="sum"
      :disabled="index <= 0"
      :button-text="togg ? '提交订单' : '删除'"
      :button-color="$store.state.config.shop.button_bj_color || ''"
      @submit="onSubmit"
    >
      <van-checkbox
        :value="checked"
        @click="togAll(checked)"
        checked-color="#FF1C33"
      >
        全选
      </van-checkbox>
    </van-submit-bar>

    <van-popup
      v-model="sku_show"
      position="bottom"
      :overlay="true"
      style="border-radius: 5px 5px 0 0"
    >
      <shopDetailsSku
        :shopInfo="shopInfo"
        :is_car="true"
        @closePop="getClosePop"
        @add_car_success="get_car_success"
        :toAut="0"
      />
    </van-popup>
  </div>
</template>


<script>
import card from "./shopcard/card";
import { SubmitBar, Checkbox } from "vant";
import { setTimeout } from "timers";
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
import shopDetailsSku from "./shopdetails/shopdetailssku";
export default {
  name: "shopcard",
  components: {
    card,
    [SubmitBar.name]: SubmitBar,
    [Checkbox.name]: Checkbox,
    indexshoplist,
    MescrollVue,
    shopDetailsSku,
  },
  data() {
    return {
      del_shop: "",
      shopInfo: {},
      sku_show: false,
      list: [],
      checked: false,
      sum: 0,
      itemList: {},
      id_str: "",
      togg: true,
      index: 0,
      shopIndex: -1,
      checkAllList: {},
      show: false,
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        mustToTop: true,
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)

      mescrollUp: {
        offset: 1000,
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10, //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "card_con",
          src: require("../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000, //列表滚动1000px才显示回到顶部按钮
        },
      },
      listProduct: [],
    };
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
  created() {
    this.getCardList();
    this.$store.dispatch("getCardNum");
  },

  methods: {
    getClosePop() {
      this.id_str = "";
      this.del_shop = "";
      this.sku_show = false;
    },
    rec_shop_click(item) {
      this.del_shop = item.id;
      this.$api.getShop.getShopDetails({ id: item.pid }).then((res) => {
        if (res.code == 200) {
          this.shopInfo = res.result;
          this.sku_show = true;
        }
      });
    },
    get_car_success(sku) {
      var params = {};
      params.id_str = this.del_shop;
      params.number = 1;
      this.$api.getShop.delCard(params).then((res) => {
        if (res.code == 200) {
          this.$api.getShop.addCart(sku).then((res) => {
            if (res.code == 200) {
              this.$toast.success("加入成功");
              this.sum = 0;
              this.id_str = "";
              this.index = 0;
              this.getCardList();
              this.sku_show = false;
            }
          });
        }
      });
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      this.$api.getOrder
        .getOrderProduct({ page: page.num, page_size: 20 })
        .then((res) => {
          if (res.code == 200) {
            let arr = res.result.product;

            // 如果是第一页需手动置空列表
            if (page.num === 1) this.listProduct = [];
            // 把请求到的数据添加到列表

            this.listProduct = this.listProduct.concat(arr);
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              mescroll.endSuccess(arr.length);
            });
          } else {
            mescroll.endErr();
          }
        });
    },
    delShop() {
      this.getCardList();
    },
    togAll() {
      this.show = !this.checked;
      this.checked = !this.checked;
    },
    getTotal(obj, i) {
      this.itemList[i] = obj;
      var sum = 0;
      var arr = Object.values(this.itemList).reduce((a, b) => [...a, ...b], []);
      var str = "";
      var idex = 0;
      for (var k in arr) {
        sum += Number(arr[k].pro.price * arr[k].number * 100);
        str += "@" + arr[k].id;
        idex++;
      }
      this.id_str = str.slice(1);
      this.sum = sum;
      this.index = idex;

      var l = 0;
      var list = this.list;
      for (var j = 0; j < list.length; j++) {
        l += list[j].data.length;
      }
      if (l <= idex) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    },
    onClickLeft() {
      this.toBack();
    },
    onClickRight() {
      //   Toast("按钮");
    },
    onSubmit() {
      if (localStorage.getItem("pay_order_id")) {
        localStorage.removeItem("pay_order_id");
      }
      var params = {};
      var that = this;
      params.id_str = that.id_str;
      if (that.index <= 0) {
        that.$toast.fail("未选择商品");
        return;
      }
      if (that.togg) {
        this.$store.commit("setOrder", that.id_str);
        this.$router.push("/order/addorder");
      } else {
        that.$dialog
          .confirm({
            title: "删除商品",
            message: "确定删除这" + that.index + "件商品吗？",
          })
          .then(() => {
            that.$api.getShop.delCard(params).then((res) => {
              if (res.code == 200) {
                that.sum = 0;
                that.id_str = "";
                that.itemList = {};
                that.index = 0;
                this.list = [];
                that.$toast.success("删除成功");
                setTimeout(() => {
                  that.getCardList();
                  this.$store.dispatch("getCardNum");
                }, 300);
              }
            });
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    getCardList() {
      this.$api.getShop.getCardList({}).then((res) => {
        if (res.code == 200) {
          this.list = res.result;

          if (this.list.length == 0) {
            this.mescroll.resetUpScroll();
          }
        }
      });
    },
  },
};
</script>


<style lang="less" scoped>
.product-card-title {
  justify-content: center;
  margin: 10px 0;
  > span {
    font-size: 16px;
    height: 28px;
    line-height: 28px;
    font-weight: bold;
  }
}
.scol {
  width: 100%;
}

.not_cat {
  width: 100%;
  height: 100%;
  font-size: 14px;
}
.hid_pri .van-submit-bar__text {
  visibility: hidden;
}
.not_cat_head {
  > img {
    height: 140px;
    margin: 40px 0 20px;
  }
  > p {
    color: #999;
    font-size: 16px;
  }
  padding: 10px 0 20px;
}
.card_con {
  background: #f3f3f3;
  overflow: hidden;
  .card_list {
    padding: 60px 10px 100px;
    overflow: auto;
    height: 100%;
  }
  .subCard {
    padding-left: 10px;
    font-family: "gilroy";
  }
}
.subCard_shop {
  bottom: 50px;
  z-index: 1;
}
.subCard_noshop {
  bottom: 0;
  z-index: 1;
}
</style>
    