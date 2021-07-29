<template>
  <div class="bgwrite order_item">
    <router-link to="" class>
      <div class="fx order_item_head">
        <div>
          <h4>{{item.is_pay==0?"未支付":item.sid_cn}}</h4>
          <span class="order_item_head_s1">订单编号：{{item.oid}}</span>
        </div>
        <!-- <span class="order_item_head_s2">{{item.status}}</span> -->
      </div>
    </router-link>
    <div class="order_item_shop">
      <div v-for="(it,index) in item.product" :key="index">
        <div class="fx foot_order_item_list">
          <div class="fx">
            <router-link
              :to="it.pid == 0 ?'':'/shop/shopdetails?tid='+appusers.uid+'&id='+it.pid"
              class="a1"
              :key="index"
            >
              <img :src="it.piclink" v-lazy="it.piclink" alt />
            </router-link>
            <div class="fx_3">
              <router-link
                :to="it.pid == 0 ?'':'/shop/shopdetails?tid='+appusers.uid+'&id='+it.pid"
                :key="index"
                class="fx orderlist_a"
              >
                <div>
                  <p
                    class="order_p van-ellipsis"
                  >{{it.title.length>=23?it.title.slice(0,23)+'...':it.title}}</p>
                  <p v-if="it.sku_cn">{{it.sku_cn}}</p>
                </div>

                <div class="fx">
                  <p>￥{{$fnc.toFixedZ(it.price)}}</p>
                  <!-- <p>优惠后￥129.00</p> -->
                  <p>×{{it.number}}</p>
                </div>
              </router-link>

              <div class="card_num" v-if="it.card != '' && it.card != undefined && it.card != null">
                <p>卡密：{{it.card}}</p>
                <span
                  style="cursor: pointer"
                  onclick
                  class="copy"
                  :data-clipboard-text="it.card"
                  data-clipboard-action="copy"
                  @click="copy_key(it.card)"
                >复制</span>
              </div>

              <div
                class="card_num"
                v-if="(it.types ==10 || it.types ==11) && item.status=='已完成'&& item.write_code "
              >
                <p>核销码：{{item.write_code}}</p>
                <!-- <span
                  style="cursor: pointer" onclick=''
                  class="copy"
                  :data-clipboard-text="item.write_code"
                  data-clipboard-action="copy"
                  @click="copy_key(item.write_code)"
                >复制</span>-->
              </div>
              <p class="shop-info-p3">
              剩余核销次数：
              <span>{{item.write_number-item.write_complete_number}}</span>次
            </p>
            </div>
          </div>
          <!-- <div class="fx tr"></div> -->
        </div>
      </div>

      <div class="tr foot_order_item" >
        共
        <span>{{item.product.length}}</span> 件商品
        <span>订单金额 ￥{{$fnc.toFixedZ(item.money)}}</span>
      </div>
      <div class="fx order-write-button">
          <van-button
            type="primary"
            size="large"
            color="linear-gradient(to right, #fc5431, #fc3025, #ef0f25)"
            @click="addWriteNumber(item.id)"
          >立即核销</van-button>
        </div>

    </div>

  </div>
</template>


<script>
import { setTimeout } from "timers";

import Clipboard from "clipboard";
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    isSupplier: {
      type: Boolean,
      default: false
    }
  },
  components: {
    
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
      addWriteNumber(id) {
      var that = this;
      that.$dialog
        .confirm({
          title: "核销订单",
          message: "是否确定核销订单？"
        })
        .then(() => {
          // on confirm
          that.$api.getShop.addWriteNumber({ id }).then(res => {
            if (res.code == 200) {
              that.$toast.success("核销成功");
              setTimeout(() => {
                that.$emit('openThis');
              }, 1500);
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
  }
};
</script>


<style lang="less" scoped>
.order-write-button {
        margin-top: 16px;
        justify-content: center;
        button {
          width: 104px;
          border-radius: 5px;
          height: 30px;
          line-height: 30px;
          font-size: 17px;
        }
      }
.shop-info-p3 {
    span {
        color: #ff1111;
    }
}
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
            display: block;
          width: 76px;
          height: 76px;
          flex: 1;
        }
        img {
          width: 76px;
          height: 76px;
          max-width: 100%;
        }
        > div {
          margin-left: 10px;
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

  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  > p {
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
</style>
