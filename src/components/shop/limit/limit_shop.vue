<template>
  <div class="fx limit_body_shop_item" @click="went_shop">
    <img :src="$fnc.getImgUrl(shop.piclink)" />
    <div class="fx limit_shop_right">
      <p class="right_title van-multi-ellipsis--l2">
        {{ shop.title }}
      </p>
      <div class="fx right_price">
        <p class="fx">
          <span class="price_regular">
            <small>￥</small>
            <b>{{ $fnc.get_int_dec(shop.limited_price, "int") }}</b>
            <i>{{ $fnc.get_int_dec(shop.limited_price, "dec") }}</i>
            <span class="market_price" v-if="shop.market_price > 0">
              ￥{{ $fnc.toFixedZ(shop.market_price) }}
            </span>
            <span class="market_price" v-else>
              ￥{{ $fnc.toFixedZ(shop.price) }}
            </span>
          </span>
        </p>
        <p class="fx">
          <span v-if="shop.types == '已开始'">去抢购</span>
          <span v-if="shop.types == '未开始'">敬请期待</span>
          <span class="fx">
            <precent :num="Number(shop.sold)"></precent>
            <small>{{ $fnc.toFixedZ(shop.sold, 1) }}%</small>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import precent from "@/components/shop/limit/limit_percent";
export default {
  name: "limit_shop",
  data() {
    return {
      percent: 50,
    };
  },
  components: {
    precent,
  },
  created() {},
  props: {
    shop: {
      type: Object,
    },
  },
  methods: {
    went_shop(item) {
      this.$router.push({
        path: "/shop/shopdetails",
        query: { id: this.shop.id },
      });
    },
  },
};
</script>
<style lang='less' scoped>
.limit_body_shop_item {
  width: 100%;
  min-height: 130px;
  padding: 12px 0;
  font-size: 14px;

  > img {
    width: 106px;
    height: 106px;
    object-fit: cover;
    margin-right: 10px;
  }

  .limit_shop_right {
    flex: 1;
    width: 240px;
    min-height: 106px;
    flex-flow: column;
    .right_title {
      font-size: 14px;
      line-height: 18px;
    }

    .right_price {
      width: 100%;
      align-items: flex-end;
      line-height: 1.2;

      > p:nth-of-type(1) {
        flex-flow: column;
        align-items: flex-start;
        padding-bottom: 5px;
      }
      > p:nth-of-type(2) {
        flex-flow: column;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        border-radius: 6px;
        min-width: 90px;
        padding: 8px 5px;
        background: linear-gradient(to right, #fe3c49, #ff7544);
        margin-left: 5px;
        > span:nth-of-type(1) {
          font-size: 14px;
          padding-bottom: 4px;
        }
        small {
          font-size: 9px;
          font-weight: normal;
          padding-left: 2px;
        }
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
          font-size: 14px;
          font-weight: bold;
        }
        > b {
          font-size: 20px;
        }
        > i {
          font-size: 14px;
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