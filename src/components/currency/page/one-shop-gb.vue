<template>
  <div class="fx one_shop_item">
    <div class="one_shop_item_left">
      <img :src="$fnc.getImgUrl(info.piclink)" @click="toDetails(true)" alt />
      <div class="shop-video-icon" v-if="info.video" @click="toDetails(true)">
        <div>
          <img src="@/assets/img/play.png" alt />
        </div>
      </div>
    </div>

    <div class="fx one_shop_item_right" @click="toDetails(false)">
      <div class="right_one">
        <p class="right_title van-multi-ellipsis--l2">{{ info.title }}</p>
        <p
          class="right_span"
          v-if="info.group_buy_number && info.group_buy_number > 0"
        >
          <span>
            差{{
              info.group_buy_join - info.group_buy_number >= 0
                ? info.group_buy_number
                : info.group_buy_number - info.group_buy_join
            }}个名额开团
          </span>
        </p>
      </div>
      <div class="fx right_price">
        <p class="fx">
          <span class="show_sales">
            已售{{ Number(info.real_sale) + Number(info.invent_sale) || 0 }}件
          </span>
          <span class="price_regular">
            <small>￥</small>
            <b>{{ $fnc.get_int_dec(info.group_buy_price, "int") }}</b>
            <i>{{ $fnc.get_int_dec(info.group_buy_price, "dec") }}</i>
            <span class="market_price" v-if="info.market_price > 0">
              ￥{{ $fnc.toFixedZ(info.market_price) }}
            </span>
          </span>
        </p>
        <p>立即参与</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "one-shop",
  data() {
    return {};
  },
  props: {
    info: {
      type: Object,
    },
  },
  components: {},
  computed: {
    ...mapState({
      isVideoShop: (state) => state.config.shop.is_video_shop,
      isShowSales: (state) => state.config.shop.is_show_sales,
    }),
  },
  methods: {
    toDetails(bool) {
      bool = bool || false;
      if (this.info.video && this.isVideoShop == 1 && bool) {
        this.$router.push(
          "/shop/shopdetails?tid=" +
            this.appusers.uid +
            "&id=" +
            this.info.id +
            "&showVideo=1"
        );
      } else {
        this.$router.push(
          "/shop/shopdetails?tid=" +
            this.appusers.uid +
            "&id=" +
            this.info.id +
            "&showVideo=0"
        );
      }
    },
  },
};
</script>
<style scoped lang='less'>
.one_shop_item {
  width: 95%;
  min-height: 140px;
  padding: 10px;
  margin: 0 auto 10px auto;
  background-color: #ffffff;
  border-radius: 5px;
  line-height: 1.2;
  font-size: 14px;

  .one_shop_item_left {
    width: 120px;
    height: 100%;
    position: relative;
    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
  }

  .one_shop_item_right {
    width: 62%;
    min-height: 120px;
    flex-flow: column;
    align-items: flex-start;

    .right_one {
      width: 100%;
      margin-bottom: 10px;

      .right_title {
        font-size: 14px;
        line-height: 18px;
      }

      .right_span {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        margin-top: 5px;

        /deep/span {
          font-size: 11px;
          color: #ff2043;
          border: 1px solid #ff2043;
          border-radius: 3px;
          padding: 4px 10px 2px;
          margin-right: 10px;
        }
      }
    }

    .right_price {
      width: 100%;
      align-items: flex-end;

      > p:nth-of-type(1) {
        flex-flow: column;
        align-items: flex-start;
        padding-bottom: 5px;
      }
      > p:nth-of-type(2) {
        font-weight: bold;
        color: #ffffff;
        height: 26px;
        width: 90px;
        line-height: 30px;
        text-align: center;
        border-radius: 20px;
        background: linear-gradient(to right, #fe3c49, #ff7544);
      }
      .show_sales {
        background: #ffebed;
        color: #d84b56;
        font-size: 10px;
        padding: 3px 5px 2px;
        border-radius: 10px;
        margin-bottom: 5px;
      }

      .price_regular {
        color: #f83f4f !important;
        > small {
          font-size: 10px;
          font-weight: bold;
        }
        > b {
          font-size: 16px;
        }
        > i {
          font-size: 10px;
          font-weight: normal;
          font-style: normal;
          padding-right: 5px;
        }
      }

      .market_price {
        font-size: 11px;
        color: #999999;
        text-decoration: line-through;
      }
    }
  }
}
</style>
