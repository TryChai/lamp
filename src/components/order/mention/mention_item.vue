<template>
  <div class="bgwrite order_item">
    <div class="fx order_item_head" @click="went_orderdetail(item)">
      <div>
        <h4>{{ item.is_pay == 0 ? "未支付" : item.sid_cn }}</h4>
        <span class="order_item_head_s1">订单编号：{{ item.oid }}</span>
      </div>
      <span class="order_item_head_s2" v-if="item.status == '已发货' && item.types == 9">待出行</span>
      <span class="order_item_head_s2" v-else>{{ item.status }}</span>
    </div>

    <div class="order_item_shop">
      <div v-for="(it, index) in item.product" :key="index">
        <div class="fx foot_order_item_list">
          <div class="fx">
            <router-link to="" class="a1" :key="index">
              <img :src="it.piclink" v-lazy="it.piclink" alt />
            </router-link>

            <div class="fx_3">
              <router-link to="" :key="index" class="fx orderlist_a">
                <div>
                  <p class="order_p van-ellipsis">
                    {{it.title.length >= 23? it.title.slice(0, 23) + "...": it.title}}
                  </p>
                  <p v-if="it.sku_cn">{{ it.sku_cn }}</p>
                </div>

                <div class="fx">
                  <p>￥{{ $fnc.toFixedZ(it.price) }}</p>
                  <!-- <p>优惠后￥129.00</p> -->
                  <p>×{{ it.number }}</p>
                </div>
              </router-link>

              <div class="card_num" v-if="it.card != '' && it.card != undefined && it.card != null">
                <div>
                  <p>卡密：{{ it.card }}</p>
                  <span style="cursor: pointer" onclick class="copy" :data-clipboard-text="it.card" data-clipboard-action="copy"
                      @click="copy_key(it.card)">复制</span>
                </div>
              </div>

              <div class="card_num" v-if="(it.types == 10 || it.types == 11) &&item.status == '已完成' &&item.write_code">
                <div>
                  <p>核销码：{{ item.write_code }}</p>
                  <span style="cursor: pointer" onclick class="copy" :data-clipboard-text="item.write_code" data-clipboard-action="copy"
                      @click="copy_key(item.write_code)">复制</span>
                  <br />
                </div>
                <div>
                  <p>核销次数：{{ item.write_complete_number }}</p>
                </div>
                <div>
                  <p>总核销次数：{{ item.write_number }}</p>
                </div>
              </div>

              <div class="fx" style="justify-content: flex-start;margin-top:5px;">

                <div>
                  <van-button plain to="" size="mini"
                      v-show="item.status=='已完成' && !isSupplier && (it.status == 0 || it.status == '0' || it.status ==4 || it.status == '4')"
                      class="review_order_list">{{it.is_review == 0 ?"待评价":"已评价"}}
                  </van-button>
                </div>

              </div>
            </div>
          </div>
          <div class="fx tr"></div>
        </div>
      </div>

      <div class="tr foot_order_item" v-if="item.types == 6 && $route.path == '/order/presale'">
        共
        <span>{{ item.product.length }}</span>
        件商品 &nbsp&nbsp定金金额
        <span v-if="item.status == '已付定金'">￥{{ $fnc.toFixedZ(Number(item.second_pay)) }}</span>
        <span v-if="item.status != '已付定金'">￥{{ $fnc.toFixedZ(Number(item.down_pay)) }}</span>
        <br />
        <br />
        <div v-if="item.status != '未支付'">
          尾款金额：
          <span v-if="item.status == '已付定金'">
            ￥{{
                        Number(item.down_pay) > 0
                        ? $fnc.toFixedZ(Number(item.down_pay))
                        : 0
                        }}
          </span>
          <span v-if="item.status != '已付定金'">
            ￥{{
                        Number(item.second_pay) > 0
                        ? $fnc.toFixedZ(Number(item.second_pay))
                        : 0
                        }}
          </span>
          <br />
          <br />
        </div>支付尾款日期：
        <span>{{ $fnc.getTimeFormat(item.delivery_date) }}</span>
      </div>

      <div class="tr foot_order_item" v-else>
        共
        <span>{{ item.product.length }}</span> 件商品
        <span>订单金额 ￥{{ $fnc.toFixedZ(item.money) }}</span>
      </div>

      <div class="foot_order_btn tr" v-if="item.status == '用户自提'">
        <van-button plain size="small" @click="confirm_mention(item)">确认自提</van-button>

      </div>
    </div>

    <van-popup v-model="show" position="right" class="sub-goods" get-container="#app">
      <deliver-goods v-if="isSupplier" @opThis="opThis" :item="item" />
    </van-popup>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import Dialog from 'vant'
import DeliverGoods from "@/components/currency/order/deliverGoods/DeliverGoods.vue";
import Clipboard from "clipboard";
export default {
  props: {
    item: {
      type: Object,
      default: () => { }
    },
    isSupplier: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DeliverGoods
  },
  data () {
    return {
      show: false
    };
  },
  methods: {
    confirm_mention (info) {
      this.$dialog.confirm({
        message: "确定确认自提吗？"
      }).then(() => {
        this.$api.getOrder.confirm_mention({ id: info.id }).then(res => {
          if (res.code == 200) {
            this.$toast.success('确认成功')
            this.$emit("openThis");
          } else {
            this.$toast.error(res.result)
          }
        })
      }).catch(() => { })
    },

    went_orderdetail (item) {
      if (!this.$route.query.mid) {
        this.$router.push(`/order/orderdetails?id=${item.id}${this.isSupplier ? '&sup=supplier' : ''}&type=team`)
      }
    },
    cancel_pay (id) {
      this.$dialog.confirm({
        message: "确定取消该笔订单吗"
      }).then(() => {
        this.$api.getOrder.cancel_pay({ id: id }).then(res => {
          if (res.code == 200) {
            this.$toast.success('取消成功')
            this.$emit("openThis");
          } else {
            this.$toast.error(res.result)
          }
        })
      }).catch(() => { })
    },
    toOrderRetuen (bool, id, types) {
      this.$store.commit("setIsSupplier", bool);
      this.$router.push("/order/orderrefund?id=" + id + "&types=" + types);
    },
    presale_btn (item) {
      // /order/payorder?id='+item.id
      this.$api.getOrder
        .pay_presale_order({ oid: item.oid })
        .then(res => {
          if (res.code == 200) {
            if (res.result || res.result == null) {
              this.$router.push({
                path: "/order/payorder",
                query: { id: item.id }
              });
            }
          }
        });
    },
    is_presale_pay (date) {
      let now = new Date();
      var now_str = String(Date.parse(now)).substring(0, 10);

      var buy_str = date;

      return Number(now_str) > Number(buy_str) ? false : true;
    },
    copy_key (link) {
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
    opThis (bool) {
      if (bool) {
        this.$emit("openThis");
      }
      this.show = false;
    },
    closeOrder (id) {
      var that = this;
      that.$dialog
        .confirm({
          title: "提示",
          message: "是否确认取消退货？"
        })
        .then(() => {
          that.$api.getOrder.closeOrderCancel({ id }).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => {
                this.$emit("openThis");
              }, 1500);
            }
          });
        })
        .catch(() => { });
    },
    subConfim (id) {
      //确认收货
      var that = this;
      that.$dialog
        .confirm({
          title: "提示",
          message: `是否确认${this.item.types == 9 ? '完成出行' : '收货'}`
        })
        .then(() => {
          that.$api.getOrder.closeOrder({ id }).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => {
                this.$emit("openThis", "已完成");
              }, 1500);
            }
          });
        })
        .catch(() => { });
    },
    subDeliverGoods (status) {
      if (status == "已支付") {
        this.show = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.sub-goods {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
.ppp2 {
  button {
    padding: 0 4px;
    border-radius: 5px;
    line-height: 22px;
  }
}
.review_order_list {
  height: 24px;
  line-height: 24px;
}
.review_order_list:nth-of-type(1) {
  margin-right: 8px;
}
.orderlist_a {
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  > div {
    width: 100%;
    line-height: 1.2;
  }
}
.order_item {
  padding: 0 16px;
  line-height: 1;
  font-size: 14px;
  margin-bottom: 14px;
  .order_item_head {
    overflow: hidden;
    border-bottom: 1px solid #f5f3f3;
    h4 {
      padding: 12px 0 6px;
      font-size: 15px;
    }
    span {
      color: #999999;
    }
    .order_item_head_s1 {
      font-size: 12px;
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
      padding: 14px 0;
      align-items: flex-start;

      > div:first-child {
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        a.a1 {
          width: 76px;
        }
        img {
          width: 76px;
          height: 76px;
          max-width: 100%;
        }
        > div {
          padding-left: 10px;
          p.order_p {
            color: #333333;
            line-height: 1.4;
            width: 250px;
          }
          p:first-child ~ p {
            font-size: 12px;
            color: #999999;
            padding: 2px 0;
          }
        }
      }
      > .fx_1 {
        position: relative;
        flex-direction: column;
        p {
          width: 100%;
          // font-weight: bold;
          color: #999999;
        }
        > p:first-child {
          line-height: 1.4;
          font-size: 14px;
          color: #333333;
        }
        > p:nth-child(2) {
          font-size: 12px;
          line-height: 1.8;
        }
        > p:last-child {
          padding-top: 23px;
        }
      }
    }
    .foot_order_item {
      color: #999999;
      padding: 14px 0;
      border-bottom: 1px dashed #e8e9eb;
      > span {
        color: #333333;
        // font-weight: bold;
      }
      > span:last-child {
        padding-left: 10px;
      }
    }
    .foot_order_btn {
      padding: 15px 0;
      > button {
        border-radius: 5px;
        color: #c50d0d;
        border: 1px solid #c50d0d;
        // font-weight: bold;
      }
    }
  }
}
.card_num {
  // width: 240px;
  > div {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    > p {
      font-size: 12px;
      width: 200px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    > span {
      color: #f5f3f3;
      background-color: #c50d0d;
      border-radius: 5px;
      padding: 2px 10px;
      font-size: 10px;
    }
  }
}
</style>
