<template>
  <div>
    <div class="bgwrite order_item">
      <div class="fx order_item_head">
        <div>
          <h4>{{info.sid_cn }}</h4>
        </div>
      </div>

      <div class="order_item_shop">
        <div class="fx foot_order_item_list" v-for="(item) in info.product" :key="item.id" @click="goto_shopdetail(item.pid)">
          <div class="fx">
            <img :src="item.piclink" v-lazy="item.piclink" alt @click="goto_shopdetail(item.pid)" />
          </div>
          <div class="fx_3">
            <div class="fx_4 fx">
              <p class="van-ellipsis">{{item.title}}</p>
              <p>￥{{$fnc.toFixedZ(item.price)}}</p>
            </div>
            <div class="fx_4 fx">
              <p class="van-ellipsis">{{item.sku_cn}}</p>
              <p>×{{item.number}}</p>
            </div>
          </div>
        </div>
        <div class="tr foot_order_item"></div>
        <van-cell-group class="order_details_item_group">
          <div class="order_box" :class="{active_order_box:show}">
            <van-cell
              :value="`￥ ${info.types == 6 ? $fnc.toFixedZ(info.sum_price) : $fnc.toFixedZ(info.money)} `"
              class="order_c2"
              @click="show=!show"
            >
              <template slot="title">
                <span type="danger">订单金额</span>
                <van-icon name="arrow" class="order_money" />
              </template>
            </van-cell>
            <van-cell
              class="order_c1"
              title="积分抵用"
              :value="'-￥'+$fnc.toFixedZ(info.integral_dk_money)"
            />
            <van-cell class="order_c1" title="优惠券折扣" :value="'-￥'+$fnc.toFixedZ(info.red_money)" />
          </div>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>


<script>
import { Collapse, CollapseItem } from "vant";
import Clipboard from "clipboard";
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    sum_mail: [String, Number]
  },
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem
  },
  data() {
    return {
      activeNames: ["2"],
      show: false,
      isSupplier: false
    };
  },
  created() {
    if (this.$route.query.sup) {
      this.isSupplier = true;
    } else {
      this.isSupplier = false;
    }
  },
  methods: {
    copy_key(link) {
      let clipboard = new this.clipboard(".copy");
      clipboard.on("success", () => {
        this.$toast.success("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        // 不支持复制
        this.$fnc.ykAPPCopy(link);
      });
    },
    goto_shopdetail(pid) {
      if (pid != 0) {
        this.$router.push({
          path: "/shop/shopdetails",
          query: { tid: this.appusers.uid, id: pid }
        });
      }
    },
    toOrderRetuen(bool, id, types) {
      this.$store.commit("setIsSupplier", bool);
      this.$router.push("/order/orderrefund?id=" + id + "&types=" + types);
    }
  }
};
</script>


<style lang="less" scoped>
.order_box {
  max-height: 44px;
  overflow: hidden;
  transition: all 0.3s linear;
  .order_money {
    transition: all 0.3s linear;
    transform: rotateZ(0);
  }
}
.active_order_box {
  max-height: 200px;
  .order_money {
    transform: rotateZ(90deg);
  }
}
.order_item {
  padding: 0 16px;
  line-height: 1;
  font-size: 14px;
  margin-bottom: 14px;
  .order_item_head {
    overflow: hidden;
    h4 {
      padding: 10px 0 0;
      font-size: 14px;
      line-height: 1.2;
    }
    span {
      color: #999999;
    }
    .order_item_head_s1 {
      font-size: 11px;
      display: block;
      padding-bottom: 10px;
    }
    .order_item_head_s2 {
      font-size: 16px;
      // font-weight: bold;
    }
  }
  .order_item_shop {
    .foot_order_item_list {
      align-items: center;
      padding: 22px 0 22px 0;
      position: relative;
      justify-content: flex-start;
      > div:first-child {
        justify-content: flex-start;
        align-items: center;
        margin-right: 11px;
        img {
          width: 76px;
          height: 76px;
          max-width: 100%;
        }
      }
      > .fx_3 {
        > div:first-child {
          line-height: 1.4;
          font-size: 15px;
          color: #333333;
          font-weight: 400;
          margin-bottom: 4px;
        }
        > div:last-child {
          line-height: 1.4;
          font-size: 12px;
          color: #999999;
        }
      }
    }
    .foot_order_item {
      color: #999999;
      margin-top: 20px;
      border-bottom: 1px dashed #e8e9eb;
    }
    .foot_order_btn {
      padding: 15px 0;
      > button {
        border-radius: 5px;
        color: #d91276;
        border: 1px solid #d91276;
        // font-weight: bold;
      }
    }
  }
}
.order_details_item_group {
  .van-cell__title {
    font-size: 14px;
    // font-weight: bold;
  }
  .order_money {
    vertical-align: middle;
    margin-left: 10px;
  }
  .order_c1 {
    .van-cell__value {
      font-family: "PingFangSC-Regular";
      font-size: 14px;
      color: #333333;
    }
  }
  .order_c1:not(:last-child)::after,
  .order_c2:not(:last-child)::after {
    left: 0;
  }
  .order_c2 {
    .van-cell__value {
      font-size: 14px;
      color: #333333;
      // font-weight: bold;
    }
  }
  .order_c1,
  .order_c2 {
    padding: 0.26667rem 0rem;
  }
}
.write-bb {
  display: flex;
  justify-content: flex-start !important;
  > p {
    width: auto !important;
    margin-right: 5px;
  }
}
.van-ellipsis {
  width: 200px;
}
</style>
