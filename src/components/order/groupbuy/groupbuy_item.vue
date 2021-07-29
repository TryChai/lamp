<template>
  <div class="bgwrite order_item">
    <div class="fx order_item_head" @click="went_orderdetail(item)">
      <div>
        <h4>{{ item.is_pay == 0 ? "未支付" : item.sid_cn }}</h4>
        <span class="order_item_head_s1">订单编号：{{ item.oid }}</span>
      </div>
      <span
        class="order_item_head_s2"
        v-if="item.types == 19 && item.group_buy && item.group_buy.status==2"
      >活动取消</span>
      <span
        class="order_item_head_s2"
        v-else-if="item.types == 19 && item.group_buy && item.group_buy.user_status==0"
      >拼购中</span>
      <span
        class="order_item_head_s2"
        v-else-if="item.types == 19 && item.group_buy && item.group_buy.user_status==1"
      >已拼中</span>
      <span
        class="order_item_head_s2"
        v-else-if="item.types == 19 && item.group_buy && item.group_buy.user_status==2"
      >未拼中</span>
      <span class="order_item_head_s2" v-else>{{ item.status }}</span>
    </div>

    <div class="order_item_shop">
      <div v-for="(it, index) in item.product" :key="index">
        <div class="fx foot_order_item_list">
          <div class="fx">
            <router-link
              :to="it.pid == 0 ? '':`/shop/shopdetails?tid=${appusers.uid}&id=${it.pid}` + `${$route.query.mid ?'&mid='+$route.query.mid :''}`"
              class="a1"
              :key="index"
            >
              <img :src="it.piclink" v-lazy="it.piclink" alt />
            </router-link>

            <div class="fx_3">
              <router-link
                :to="it.pid == 0 ? '':`/shop/shopdetails?tid=${appusers.uid}&id=${it.pid}` + `${$route.query.mid ?'&mid='+$route.query.mid :''}`"
                :key="index"
                class="fx orderlist_a"
              >
                <div>
                  <p
                    class="order_p van-ellipsis"
                  >{{it.title.length >= 23? it.title.slice(0, 23) + "...": it.title}}</p>
                  <p v-if="it.sku_cn">{{ it.sku_cn }}</p>
                </div>

                <div class="fx">
                  <p>￥{{ $fnc.toFixedZ(it.price) }}</p>
                  <p>×{{ it.number }}</p>
                </div>
              </router-link>
            </div>
          </div>
          <div class="fx tr"></div>
        </div>
      </div>

      <div class="tr foot_order_item">
        共
        <span v-if="item.product.length">{{ item.product.length }}</span> 件商品
        <span>订单金额 ￥{{ $fnc.toFixedZ(item.money) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  computed: {},
  data() {
    return {};
  },
  methods: {
    went_orderdetail(item) {
      this.$router.push(`/order/orderdetails?id=${item.id}`);
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
.add_show_edit {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.dia_pop {
  width: 80%;
  top: 35%;
  .order_dia {
    width: 100%;
    border-radius: 10px;
  }
  .order_dia_title {
    font-weight: 500;
    text-align: center;
    background-color: #616365;
    color: #fff;
    width: 100%;
    padding: 20px 0;
    font-size: 16px;
    overflow: hidden;
  }
  .order_dia_sel {
    width: 95%;
    padding: 0.26667rem 0.2rem;
    // height: 100px;
    margin: 10px auto;
    border: 2px solid #eeeeee;
    font-size: 14px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  .order_dia_sel > div {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .order_dia_exchange {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #05a9fe;
    padding: 5px 0;
  }
  .order_dia_exchange i {
    padding-right: 5px;
    font-size: 16px;
    font-weight: bold;
  }
  .order_dia_btn {
    width: 100%;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #eeeeee;
  }
  .order_dia_btn span {
    width: 50%;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .order_dia_btn span:nth-of-type(2) {
    color: #1989fa;
    border-left: 1px solid #eeeeee;
  }
}
</style>
