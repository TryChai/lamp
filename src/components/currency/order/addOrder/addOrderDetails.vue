<template>
  <div class="add_order_details">
    <div class="fx add_order_details_top">
      <van-icon name="shop-o" v-if="card.info.sid > 0" size="16" />
      <small v-else>自营</small>
      <span>{{ card.info.shop_title }}</span>
    </div>
    <div class="add_order_details_pro">
      <div class="fx" v-for="(item, i) in card.data" :key="i">
        <img :src="item.pro.piclink" alt v-lazy="item.pro.piclink" />
        <span>
          <p class="van-ellipsis">{{ item.pro.title }}</p>
          <p v-if="item.sku_cn">
            <span>
              {{ item.sku_cn }}
            </span>
          </p>
          <p v-else></p>
          <p class="fx">
            <span class="price_regular" v-if="item.pro.types == 2">
              <small>
                {{ $store.state.config.shop.integral_cn || "积分" }}：
              </small>
              <b>{{ $fnc.get_int_dec(item.pro.score_rob, "int") }}</b>
              <i>{{ $fnc.get_int_dec(item.pro.score_rob, "dec") }}</i>
            </span>
            <span class="price_regular" v-else-if="item.pro.types == 24">
              <small>S$</small>
              <b>0</b>
              <i>.00</i>
            </span>
            <span class="price_regular" v-else>
              <small>S$</small>
              <b>{{ $fnc.get_int_dec(item.pro.original_price, "int") }}</b>
              <i>{{ $fnc.get_int_dec(item.pro.original_price, "dec") }}</i>
            </span>
            <span>×{{ item.number }}</span>
          </p>
        </span>
      </div>
    </div>
    <div class="add_order_details_remark">
      <van-field
        v-model="remark"
        rows="1"
        autosize
        :border="false"
        label-width="70px"
        label="供奉留言："
        clearable
        type="textarea"
        placeholder="给寺庙留言，最多100个字"
      />
    </div>
  </div>
</template>

<script>
import { Field } from "vant";
export default {
  data() {
    return {
      remark: "",
    };
  },
  props: {
    card: {
      type: Object,
      default: () => {},
    },
    is_lifting: [String, Number],
  },
  computed: {
    isMail() {
      if (
        this.card.info.is_rider == undefined ||
        this.card.info.is_rider == 0
      ) {
        return "运费";
      } else {
        return "配送费";
      }
    },
    mailPrice() {
      if (
        this.card.info.mail == undefined ||
        this.is_lifting == "1" ||
        this.card.info.mail == "0"
      ) {
        return "免邮";
      } else {
        return this.card.info.mail + "元";
      }
    },
    isShow() {
      if (this.card.info.is_rider == undefined) {
        return false;
      } else {
        return true;
      }
    },
  },
  components: {
    [Field.name]: Field,
  },
  methods: {
    goToStore(id) {
      if (id > 0) {
        this.$router.push({
          path: "/supplier/supplierdetails",
          query: { id: id },
        });
      } else {
        this.$router.push({ path: "/" });
      }
    },
  },
};
</script>



<style lang="less" scoped>
.add_order_details {
  width: 100%;
  margin: 10px auto;
  background: #ffffff;

  .add_order_details_top {
    width: 100%;
    padding: 0 16px;
    height: 40px;
    justify-content: flex-start;
    background: #fafafa;
    > span {
      margin: 3.5px 6px 0 8px;
      font-size: 14px;
      font-weight: 700;
      color: #333333;
    }
    > small {
      text-align: center;
      font-size: 12px;
      color: #ffffff;
      width: 42px;
      height: 15px;
      line-height: 15px;
      background: linear-gradient(105deg, #fc2e38 27%, #fd4c74 84%);
      border-radius: 8px;
    }
  }

  .add_order_details_pro {
    width: 100%;
    padding: 0 16px;
    > div {
      width: 100%;
      align-items: flex-start;
      padding: 14px 0;
      border-bottom: 1px solid #e2e2e2;
      > img {
        width: 75px;
        height: 75px;
        border-radius: 5px;
      }
      > span {
        width: 258px;
        margin-left: 10px;

        .price_regular > small {
          font-size: 14px;
          font-weight: bold;
        }
        .price_regular > b {
          font-size: 18px;
        }
        .price_regular > i {
          font-size: 14px;
          font-weight: bold;
          font-style: normal;
        }

        > p {
          width: 100%;
          line-height: 1;
        }
        > p:nth-of-type(1) {
          line-height: 1.4;
          font-size: 13px;
          color: #333333;
        }

        > p:nth-of-type(2) {
          margin: 6px 0 10px;
          min-height: 23px;
          > span {
            display: inline-block;
            padding: 0 10px;
            height: 23px;
            line-height: 23px;
            background: #f7f5f5;
            border-radius: 3px;
            font-size: 12px;
            color: #999999;
          }
        }
        > p:nth-of-type(3) {
          align-items: flex-end;

          > span:nth-of-type(2) {
            font-size: 13px;
            color: #333333;
          }
        }
      }
    }
  }

  .add_order_details_remark {
    width: 100%;
    padding: 0 16px;

    .van-field {
      padding: 10px 0;
    }
  }
}
</style>

