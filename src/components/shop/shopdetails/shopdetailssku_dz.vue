<template>
  <div class="sku_con">
    <div class="dz_sku">
      <div class="sku_tip">
        参与流程：<span>选择类型</span>-填写信息-参与成功
        <span @click.stop="closePop" style="position: absolute;top: 0%;right: 4%;z-index: 4;"><img style="width: 21px;transform: rotateZ(90deg);" src="./../../../assets/img/buddhistlamp/close_1.png" alt=""></span>
      </div>
      <div class="sku_list">
        <div
          class="sku_wrappar"
          @click="selected(item,item.id)"
          :class="{
            dz_border: dz_border==item.id
          }
            "
          v-for="(item, it) in dzSkuList"
          :key="it"
        >
          <div class="sku_box">
            <div class="sku_left">
              <img
                v-if="item.id != 0 && item.iden!=''"
                @click="show_pic(item.piclink)"
                v-lazy="item.piclink"
                alt
              />
              
              <img
                v-else
                @click="show_pic(shopItem.piclink)"
                v-lazy="shopItem.piclink"
                alt
              />
              <div>{{ item.sku_title }}</div>
            </div>
            <div class="sku_d2">
              <p class="sp1" v-if="item.id != 0">
                <small>S$</small>
                {{ shopInfo.types == 24 ? "0.00" : $fnc.toFixedZ(item.price) }}
              </p>
              <p class="sp1" v-else>随喜</p>
              <p class="sp2" v-if="shopItem.hid || shopInfo.hid">
                商品编号：{{ shopItem.hid || shopInfo.hid }}
              </p>
              <!-- <p class="sp2" v-if="item.id != 0">
                库存：{{ item.stock || item.stock }}件
              </p> -->
            </div>
          </div>
          <div class="sku_stepper" v-if="item.id != 0 && dz_border==item.id">
            <van-stepper
              v-model="number"
              :max="shopItem.stock || shopInfo.stock"
              :min="0"
              :disabled="shopInfo.types == 24"
            />
          </div>
        </div>
      </div>
    </div>
    <van-button class="btn_team" type="default" @click="addCart"
      >下一步</van-button
    >
  </div>
</template>

<script>
import { Stepper, ImagePreview, Field } from "vant";
import { setTimeout } from "timers";
import { mapState } from "vuex";
import Cookies from "js-cookie";
export default {
  components: {
    [Stepper.name]: Stepper,
    [ImagePreview.name]: ImagePreview,
    [Field.name]: Field,
  },
  props: {
    is_pintuan: {
      type: Boolean,
      default: false,
    },
    shopInfo: {
      type: Object,
      default: () => ({}),
    },
    toAut: {
      type: Number,
      default: 0,
    },
    group_types: {
      type: String,
      default: "",
    },
    group: {
      type: Object,
      default: () => ({}),
    },
    group_id: {
      type: String,
      default: "",
    },
    is_car: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dz_border:"1",
      value: 1,
      showList: [],
      parentList: [],
      shopItem: { piclink: "", iden: "" },
      showBtn: true,
      number: 1,
      skuItemImg: "",
      skuTitle: [],
      checkSkuTitle: "",
      show_sy: false,
      dzSkuList: [], //定制数组
      is_choose: false,
      iden:""
    };
  },
  computed: {
    totalprice() {
      var price = 0;
      if (
        this.shopInfo.types &&
        this.shopInfo.types != 0 &&
        this.shopInfo.types != 1
      ) {
        return 0;
      }
      if (this.price) {
        price = this.price * this.number || 0;
        return parseFloat(price).toFixed(2);
      } else {
        price = this.price * this.number || 0;
        return parseFloat(price).toFixed(2);
      }
    },
    ...mapState({
      cardList: (state) => state.card,
      user: (state) => state.user,
      configs: (state) => state.config,
    }),
    groupPrice() {
      var ptPrice = (this.shopInfo.price * this.shopInfo.group_discount) / 10;
      if (ptPrice < this.cost_price) {
        return this.cost_pric;
      } else {
        return ptPrice;
      }
    },
    price() {
      //5:71@1:3@35:28@23:25
      var skuList = this.shopInfo.sku_json;
      var iden = this.parentList.join("@");
      var rating = this.user.rating;
      var price = this.shopInfo.price;
      for (var i in skuList) {
        if (skuList[i].iden == iden) {
          if (
            typeof skuList[i].rating_json == "object" &&
            (skuList[i].rating_json.length == 0 ||
              JSON.stringify(skuList[i].rating_json == "{}"))
          ) {
            price = skuList[i].price;
          }
          if (typeof skuList[i].rating_json == "object") {
            for (var j in skuList[i].rating_json) {
              if (skuList[i].rating_json[j].id == rating) {
                if (skuList[i].rating_json[j].price > 0) {
                  price = skuList[i].rating_json[j].price;
                } else {
                  price = skuList[i].price;
                }

                break;
              }
            }
          }
        }
      }

      if (this.shopInfo.types == 4 && !this.group_types) {
        //拼团 且不为单人团
        price = (this.shopInfo.group_discount * price) / 10;
      }
      if (this.shopInfo.types == 19) {
        price = this.shopInfo.group_buy.price;
      }
      return price;
    },
    getConfig() {
      return this.$store.state.config;
    },
  },
  mounted() {
    if (JSON.stringify(this.shopInfo != "{}")) {
      var arr = this.shopInfo.attr;
      var sku_json = this.shopInfo.sku_json;
      for (var i in arr) {
        if (arr[i].info.length > 0) {
          this.parentList[i] =
            arr[i].info[0].parent_id + ":" + arr[i].info[0].sku_id;
          this.skuTitle[i] = arr[i].title + ":" + arr[i].info[0].sku_title;
          this.shopItem.piclink =
            arr[i].info[0].piclink || this.shopInfo.piclink;
          //定制新增
          for (var n in sku_json) {
            var tempArr = [];
            tempArr[i] = arr[i].info[n].parent_id + ":" + arr[i].info[n].sku_id;
            if (tempArr[i] == sku_json[n].iden || sku_json[n].iden == "") {
              sku_json[n].piclink = arr[i].info[n].piclink;
              sku_json[n].sku_title = arr[i].info[n].sku_title;
            }
          }
        } else {
          this.parentList[i] = "";
          this.skuTitle[i] = "";
        }
      }
      this.dzSkuList = sku_json;
      console.log(this.dzSkuList);
      this.$nextTick(() => {
        this.checkSkuTitle = this.skuTitle.join(" ");
        this.parentList.splice();
        try {
          this.getCardLineNu(this.skuTitle);
        } catch (error) {}
        this.shopItem.piclink = this.shopInfo.piclink;
      });
    }
  },
  methods: {
    selected(val) {
      this.dz_border = val.id;
      if(val.id==0){
        this.show_sy=true;
      }else{
        this.show_sy=false;
        this.iden = val.iden;
      }
      
    },
    getCardLineNu(skuTitle) {
      var card = this.cardList;
      console.log(this.cardList);
      var cards = card.cardlist;
      var sid = this.$route.query.id || 0;
      if (
        card.cardID != sid &&
        cards[sid + "cardItem"] == undefined &&
        cards[sid + "cardItem"][0] == undefined &&
        cards[sid + "cardItem"][0].data.length == 0
      ) {
        return;
      } else {
        var str = skuTitle.join(" ").trim();
        var arr = cards[sid + "cardItem"][0].data;
        for (var i in arr) {
          if (arr[i].sku_cn.trim() == str) {
            this.number = arr[i].number;
            this.checkSkuTitle = str;
            break;
          } else {
            this.checkSkuTitle = str;
            this.number = 1;
          }
        }
      }
    },
    show_pic(pic) {
      var arr = [];
      arr[0] = pic;
      ImagePreview(arr);
    },
    get_price() {
      if (this.shopItem.price) {
        return this.$fnc.toFixedZ(
          this.shopItem.price * this.shopInfo.discount_rob * 0.1,
          2
        );
      } else {
        return this.shopInfo.activity.limited_price;
      }
    },
    showGg(sku, index, skuParent) {
      var l = 0,
        arr = [],
        a = [],
        that = this,
        skuList = [],
        str = "",
        skuIdList = [];
      if (
        that.parentList[index] &&
        that.parentList[index] == sku.parent_id + ":" + sku.sku_id
      ) {
        that.parentList[index] = "";
        that.skuTitle[index] = "";
        skuIdList[index] = "";
      } else {
        that.parentList[index] = sku.parent_id + ":" + sku.sku_id;
        that.skuTitle[index] = skuParent.title + ":" + sku.sku_title;
        skuIdList[index] = sku.sku_id;
      }
      that.parentList.splice();
      that.skuTitle.splice();
      try {
        this.getCardLineNu(that.skuTitle);
      } catch (error) {
        console.warn("错误");
      }

      l = that.shopInfo.attr.length || 0;
      arr = that.parentList;
      a = arr.filter((item) => {
        return item;
      });

      if (a.length == l) {
        skuList = that.shopInfo.sku_json;
        str = a.join("@");
        for (var i = 0; i <= skuList.length; i++) {
          if (skuList[i] != undefined && str == skuList[i].iden) {
            if (!skuList[i].piclink) {
              this.skuItemImg = this.shopItem.piclink;
            }
            this.shopItem = skuList[i];
            if (skuList[i].rating_json && skuList[i].rating_json.length > 0) {
              for (var j in skuList[i].rating_json) {
                if (
                  this.$store.state.user.rating ==
                    skuList[i].rating_json[j].id &&
                  skuList[i].rating_json[j].price > 0
                ) {
                  this.shopItem.price = skuList[i].rating_json[j].price;
                }
              }
            }
            break;
          }
        }
        // eslint-disable-next-line no-redeclare
        var a = [];
        var attr = this.shopInfo.attr;
        // eslint-disable-next-line no-redeclare
        for (var i in attr) {
          if (attr[i].info) {
            // eslint-disable-next-line no-redeclare
            for (var j in attr[i].info) {
              a.push(attr[i].info[j]);
            }
          }
        }
        var iden = [];

        if (this.shopItem.iden && this.shopItem.iden.indexOf("@") >= 0) {
          iden = this.shopItem.iden.split("@");
        } else if (this.shopItem.iden) {
          iden = this.shopItem.iden.split();
        }
        for (var k in a) {
          // eslint-disable-next-line no-redeclare
          for (var j in iden) {
            if (a[k].parent_id + ":" + a[k].sku_id == iden[j] && a[k].piclink) {
              this.skuItemImg = a[k].piclink;
              break;
            }
          }
        }
      } else {
        // var pic = this.shopItem.piclink
        this.showBtn = true;
        var img = sku.piclink;
        if (img) {
          this.skuItemImg = img;
        }
      }
      if (this.skuItemImg) {
        this.$set(this.shopItem, "piclink", this.skuItemImg);
      } else {
        this.skuItemImg = "";
      }

      var eIndex = 0;
      for (var e in this.parentList) {
        if (this.parentList[e] == "") {
          eIndex++;
        }
      }
      if (eIndex >= this.parentList.length) {
        this.skuItemImg = "";
        this.$set(this.shopItem, "piclink", this.shopInfo.piclink);
      }
      //定制新增
      if (sku.sku_title == "随喜" && sku.sku_id == 0 && sku.parent_id == 0) {
        this.show_sy = true;
      } else {
        this.show_sy = false;
      }
      this.number = 1;
    },
    closePop() {
      this.$emit("closePop");
    },
    addCart() {
      var user = Cookies.get("user") ? true : false; // 得到登陆状态 false是已登录;
      if (user) {
      } else {
        this.$router.replace({
          path:
            "/login?redirect=" +
            this.$route.path +
            "?id=" +
            this.$route.query.id,
        });
        return false;
      }
      if (this.show_sy) {
        this.$emit("show_sy", true);
      } else {
        if (this.$route.name == "shop-cate-img") {
          if (this.number > 0) {
            this.shopInfo.delNumber = false;
          } else {
            this.shopInfo.delNumber = true;
          }
          this.shopInfo.card_ku_cn = this.checkSkuTitle;
          this.shopInfo.check = true;
          this.shopInfo.shopNumber = this.number;
          this.shopInfo.sku_idens = this.parentList.join("@");
          this.$store.commit("pushCard", this.shopInfo);
          this.$emit("closePop");
          return;
        }
        var params = {};
        params.pid = this.shopInfo.id;
        params.sku_iden = this.iden;
        var num = this.number;
        params.number = num;
        if (this.group_types != undefined && this.group_types) {
          params.group_types = this.group_types;
        }
        if (this.group_id != undefined && this.group_id) {
          params.group_id = this.group_id;
        }
        if (this.is_car) {
          this.$emit("add_car_success", params);
          return;
        }
        if (this.$route.query.mid) {
          params.mid = this.$route.query.mid;
        }
        this.$api.getShop.addCart(params).then((res) => {
          if (res.code == 200) {
            this.getCardNumber();
            this.$toast.success("加入成功");
            if (res.result.types > 0) {
              this.$store.commit("setOrder", res.result.id);
              // this.$router.push("/order/addorder");
              this.$router.push("/dz/dz_information");
            } else {
              if (this.toAut == 0) {
                var list = this.$store.state.cardList;
                var arr = {
                  data: [],
                };
                var obj = {};
                obj.pro = this.shopInfo;
                obj.number = this.number;
                arr.data.push(obj);
                list.push(arr);
                // setTimeout(()=>{
                this.$emit("closePop");
                // this.$router.push("/shop/shopcard");
                // },2000)
              } else {
                // setTimeout(()=>{
                this.$store.commit("setOrder", res.result.id);
                // this.$router.push("/order/addorder");
                this.$router.push("/dz/dz_information");
                // },2000)
              }
            }
          } else if (res.code == 404 && res.result == "请先绑定手机号") {
            this.$emit("closePop");
            setTimeout(() => {
              // this.$store.commit("setShowBingPhone", true);
              this.$router.push("/bind?redirect=/shop/shopdetails");
            }, 1500);
          }
        });
      }
    },
    getCardNumber() {
      this.$api.getShop.getCardNumber({}).then((res) => {
        if (res.code == 200) {
          this.shopInfo.cart_number = res.result;
          this.$store.commit("set_carnum", res.result);
        }
      });
    },
  },
};
</script>


<style lang="less" scoped>
.btn_team {
  position: absolute;
  bottom: 0%;
  width: 107%;
  left: -14px;
  // height: 46px;
  // line-height: 46px;
  display: block;
  font-size: 15px;
  margin: 0 auto;
  background: #6d8eb9;
  color: #fff;
  border-radius: 0;
  padding:24px 0 28px;
  // margin-top: 30px;
  // margin-bottom: 10px;
}
/deep/.van-stepper__input{
  width: 48px;
}
.sku_con {
  // padding: 0px 16px 10px;
  line-height: 1;
  position: relative;
  min-height:480px ;
  .shops_info {
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    width: 100%;
    padding: 10px 16px 10px 0;
    left: 0;
    top: 0px;
    > div:first-child {
      width: 120px;
      height: 120px;
      position: relative;
      background: #f8f8f8;
      img {
        border-radius: 10px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
      }
    }
    > div.sku_d2 {
      margin-left: 10px;
      padding-top: 20px;

      .sp1 {
        > small {
          font-size: 12px;
        }
        color: #f53f26;
        font-family: "PingFangSC-Regular";
        font-weight: bold;
        font-size: 17px;
      }
      .sp2 {
        color: #818181;
        padding-top: 10px;
        font-size: 12px;
      }
    }
    .close_sku {
      position: absolute;
      right: 0;
      top: 20px;
    }
  }
  .shops_d2 {
    padding-bottom: 10px;
    > div {
      padding-top: 12px;
      > p.shops_d2_p {
        font-size: 14px;
        color: #323233;
        padding-bottom: 10px;
      }
      > div.buy > span:not(:first-child) {
        margin-left: 10px;
      }
      > div.buy > span {
        display: inline-block;
        color: #f44;
        font-size: 12px;
      }
      > div.guige {
        > span {
          display: inline-block;
          box-sizing: border-box;
          min-width: 52px;
          height: 28px;
          margin: 0 10px 10px 0;
          padding: 5px 9px;
          color: #323233;
          font-size: 12px;
          line-height: 16px;
          text-align: center;
          border: 1px solid #969799;
          border-radius: 3px;
        }
        span.ac_tive {
          color: #fff;
          background: #f44;
          border-color: #f44;
        }
      }
    }
  }
}
.buy_tip {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  font-weight: 400;
  padding-top: 10px;
  color: #f34a0c;
  > span {
    font-weight: bold;
    padding-left: 10px;
  }
}
//定制新增
.dz_sku {
  padding:5px 5px 10px;
  .sku_tip {
    font-size: 14px;
    color: #a0a0a0;
    span {
      color: #169bd5;
    }
  }
  .sku_list {
    display: flex;
    flex-direction: column;
    margin: 15px 0px;
    .sku_wrappar {
      display: flex;
      padding:5px;
      flex-direction: column;
      margin-bottom: 15px;
      border-radius: 8px;
      // position: relative;
      .sku_box {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 5px 5px;
        .sku_left {
          display: flex;

          // align-items: center;
          img {
            height: 60px;
            width: 60px;
          }
          > div {
            font-size: 14px;
            font-weight: bold;
            margin-left: 10px;
          }
        }
        .sku_d2 {
          margin-left: 10px;
          // padding-top: 20px;
          .sp1 {
            > small {
              font-size: 12px;
            }
            color: #667a92;
            font-family: "PingFangSC-Regular";
            // font-weight: bold;
            font-size: 17px;
          }
          .sp2 {
            color: #818181;
            padding-top: 10px;
            font-size: 12px;
          }
        }
      }
      .sku_stepper {
        display: flex;
        justify-content: flex-start;
        padding: 0px 5px 5px 5px;
        margin-left: 19px;
        margin-top: 5px;
        // position: absolute;
        // bottom: -10px;
      }
    }
    .sku_wrappar::after{
      content: '';
      border-bottom: 1px solid #ddd;
      transform: scaleY(0.5);
      // margin-top: 10px;
      position: relative;
      z-index: 55;
      bottom: -10px;
    }
    .sku_wrappar:last-child{
      margin-bottom: 0px;
    }
    .dz_border {
      border: 1px solid #8e9aaa;
      border-radius: 3px;
      box-shadow: 2px -2px 5px 1px #eee;
    }
  }
}
</style>
