<template>
  <div class="cate-img-shop fx">
    <div>
      <van-image :src="item.piclink" @click="toDetails(true)">
        <template v-slot:loading>
          <van-loading type="spinner" size="20" />
        </template>
      </van-image>
      <img class="stork_0" @click="toDetails(true)" src="../../../assets/img/shop/stork.png" v-if="item.stock<=0" alt />
      <div class="shop-video-icon" v-if="item.video" @click="toDetails(true)">
        <div>
          <img src="../../../assets/img/play.png" alt />
        </div>
      </div>
    </div>

    <div class="cate-img-shop-item">
      <p @click="toDetails(false)">{{item.title}}</p>
      <p class="cate-img-shop-item-sub" @click="toDetails(false)">{{item.sub_title}}</p>
      <p class="cate-img-shop-item-sub" @click="toDetails(false)">已售{{item.sale}}</p>
      <p class="shop_title2" v-html="item.label" @click="toDetails(false)" v-if="item.label"></p>
      <div class="fx cate-img-shop-item-price">
        <p @click="toDetails(false)">
          <span>
            <small>¥</small>
            {{item.price}}
          </span>
          <!-- <small v-if="item.market_price">¥{{item.market_price}}</small> -->
        </p>
        <div class="fx" v-if="item.sku_id==0">
          <b class="del-card" @click="delCard(item)" v-if="shopNumber>0">－</b>
          <span class="del-card-number" v-if="shopNumber>0">{{shopNumber}}</span>
          <b class="del-card" @click="toSendShop(item)">＋</b>
          <!-- <van-icon name="add" class="del-card" color="#17b456"   /> -->
        </div>

        <div class="fx sku_ids" v-else>
          <span @click="toSendShop(item)">
            选规格
            <small v-if="shopNumber>0">{{shopNumber}}</small>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Image, Loading } from "vant";
import { mapGetters, mapState } from "vuex";
export default {
  props: {
    item: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    ...mapState({
      isVideoShop: state => state.config.shop.is_video_shop,
      isShowSales: state => state.config.shop.is_show_sales,
      cardLists: state => state.card,
      cardTime: state => state.card.cardTime
    }),
    ...mapGetters(["shopCardList"]),
    cardList () {
      var sid = this.$route.query.id || 0;

      var id = this.cardLists.cardID;
      if (id != sid || this.cardLists.cardlist[id + "cardItem"] == undefined) {
        return [];
      } else {
        return this.cardLists.cardlist[id + "cardItem"];
      }
    },
    shopNumber () {
      if (this.cardTime) {
        var id = this.item.id;
        var num = 0;
        var list = this.cardList[0] ? this.cardList[0].data : [];
        for (var i in list) {
          if (list[i].pro.id == id) {
            num += Number(list[i].number);
          }
        }
        return num;
      } else {
        return 0;
      }
    }
  },
  components: {
    [Image.name]: Image,
    [Loading.name]: Loading
  },
  methods: {
    delCard (row) {
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
          .catch(() => { });
      }
    },
    toSendShop (row) {
      row.shopNumber = this.shopNumber;
      row.delNumber = false;
      var id = this.$route.query.id || 0;
      if (id == "0" && row.sku_id == 0) {
        row.check = true;
        this.$store.commit("pushCard", row);
        // this.$emit("sendShop", row);
      } else {
        var that = this;
        var params = {};
        params.id = row.id || "";
        that.$api.getShop.getShopDetails(params).then(res => {
          if (res.code == 200) {
            this.$emit("sendShop", res.result);
          }
        });
      }
    },
    toDetails (bool) {
      bool = bool || false;
      if (this.item.video && this.isVideoShop == 1 && bool) {
        this.$router.push(
          "/shop/shopdetails?id=" + this.item.id + "&showVideo=1"
        );
      } else {
        this.$router.push(
          "/shop/shopdetails?id=" + this.item.id + "&showVideo=0"
        );
      }
    }
  }
};
</script>

<style scoped lang='less'>
.sku_ids {
  > span {
    background-color: #2795fc;
    color: #fff;
    border-radius: 27px;
    padding: 3px 6px;
    position: relative;
    font-size: 12px;
    small {
      position: absolute;
      top: -8px;
      right: -4px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background-color: red;
    }
  }
}
.del-card {
  color: #fff;
  font-size: 18px;
  background-color: #2795fc;
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
}
.del-card-number {
  padding: 0 4px;
}
.stork_0 {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 auto;
  z-index: 5;
  width: 50%;
  opacity: 1;
  transform: translate(-50%, -50%);
}
.cate-img-shop-item-price {
  > p:first-child {
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
}
.cate-img-shop {
  padding-top: 0.26667rem;
  padding-bottom: 0.21333rem;
  border-bottom: 1px solid #f8f8f8;
  align-items: flex-start;
  > div:first-child {
    width: 95px;
    height: 95px;
    //   height: 109px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    img {
      display: block;
      width: 95px;
    }
  }
  .cate-img-shop-item {
    min-height: 95px;
    padding-left: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > p:first-child {
      color: #1c1c1c;
      font-weight: 600;
      font-size: 15px;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .cate-img-shop-item-sub {
      color: #b1b1b1;
      font-size: 12px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
}
.shop_title2 {
  font-size: 10px;
  padding: 0px;
  span {
    line-height: 5px;
    padding: 0px 3px;
    border-radius: 7px;
    font-size: 10px;
  }
  span:first-child {
    border: 1px solid #e80000;
    color: #e80000;
  }
  span:nth-child(2) {
    border: 1px solid #f9c440;
    color: #f9c440;
  }
  span:nth-child(3) {
    border: 1px solid #50b9e2;
    color: #50b9e2;
  }
  span:not(:first-child) {
    margin-left: 3px;
  }
}
.shop-video-icon {
  position: absolute;
  left: 0px;
  bottom: 0px;
  height: auto;
  display: flex;
  padding: 10px;
  z-index: 4;
  > div {
    display: flex;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  }
  img {
    width: 30px !important;
    height: 30px;
  }
}
</style>