<template>
  <div class="order_details">
    <van-nav-bar title="供奉详情" left-text left-arrow class="navbar" :border="false" @click-left="toBack" />
    <div v-if="info.is_lifting==1">
      <mentionorderdetail :info="info"></mentionorderdetail>
    </div>
    <!-- <order-details-head :status="info.status" v-else :info="info" :is_return="info.is_return" /> -->
    <div v-show="info.is_virtual != 1 && info.types !=14 && info.types !=13">
      <order-details-address :info="info" @sendRider='getOrder' />
    </div>

    <div class="order-groups" v-if="info.types==4">
      <div class="fx" @click="$router.push('/assemble/assembledetails?id='+info.groups.head_oid)">
        <div>{{info.groups.status==0?'拼团进行中':info.groups.status==1?'拼团已完成':'拼团已结束'}}</div>
        <div>
          <img :src="item.avatar" alt="" v-for="(item) in info.groups.lists" :key="item.id">
          <span v-for="i in (info.groups.group_people-info.groups.now_people)" :key="i">?</span>
          <van-icon name="arrow" color="#e9e9e9" />
        </div>
      </div>
    </div>
    <orderDetailsRiderItem :info="info" :sum_mail="info.sum_mail" v-if="$route.query.rider==1" />
    <orderDetailsItem :info="info" v-else :sum_mail="info.sum_mail" />
    <!-- 
        <div class="order_fapiao fx">
          <p>发票信息</p>
          <p>{{info.is_virtual==0?'不开发票':"已开发票"}}</p>
    </div>-->
    <div class="order_time" v-if="info.types == 27">
      <div class="fx">
        <p>油号</p>
        <p>{{info.oil_no}}</p>
      </div>
      <div class="fx">
        <p>枪号</p>
        <p>{{info.oil_gun}}号枪</p>
      </div>
      <div class="fx">
        <p>油号</p>
        <p>{{ $fnc.toFixedZ(info.oil_litre) }}升</p>
      </div>
    </div>

    <div class="order_time" v-if="(info.types == 14 || info.types == 13) && info.reserve_time && info.reserve_time!=''">
      <div class="fx">
        <p>预约日期</p>
        <p>{{$fnc.getTimeFormat(info.reserve_time)}}</p>
      </div>
      <div class="fx" v-if="info.types == 14" @click="open_reserveewm">
        <p>预约二维码</p>
        <p>
          <van-icon name="qr-invalid" size="24px" />
        </p>
      </div>
      <div class="fx" v-if="info.types == 13">
        <p>用户信息</p>
        <p>{{info.mail_name}}&nbsp;&nbsp;&nbsp;&nbsp;{{info.mail_tel}}</p>
      </div>
    </div>
    <div class="table_store" v-if="info.types == 14 && info.store">
      <p class="oda_p1">门店信息</p>
      <p class="oda_p1">{{info.store.title}}</p>
      <div class="fx">
        <p>{{info.store.name}}</p>
        <p>{{info.store.tel}}</p>
      </div>
      <div class="oda_d1">
        <p>
          {{$fnc.deleteNumber(info.store.province+info.store.city+info.store.area+info.store.town)}}{{info.store.address}}
        </p>
      </div>
    </div>

    <div class="order_time" v-if="info.types == 9 && info.tour_day && info.tour_day!=''">
      <div class="fx">
        <p>出行日期</p>
        <p>{{info.tour_day |tour_daychange}}</p>
      </div>
    </div>
    <div class="table_info" v-if="info.types == 9">
      <p>出行人信息</p>
      <table border="1px solid #eee">
        <tr>
          <th>姓名</th>
          <th style="width:70%">手机号</th>
        </tr>
        <tr v-for="(table,t) in info.people" :key="t">
          <td>{{table.name}}</td>
          <td>{{table.tel}}</td>
        </tr>

      </table>
    </div>
    <div class="order_time">
      <div class="fx">
        <p>订单编号</p>
        <p>{{info.oid}}</p>
      </div>
      <div class="fx" v-if="info.status != '未支付' && info.remarks != ''">
        <p style="width:70px">订单备注</p>
        <p>{{info.remarks}}</p>
      </div>
      <div class="fx">
        <p>支付时间</p>
        <p>{{$fnc.getTimeFormat(info.pay_time)}}</p>
      </div>
      <div class="fx" v-if="info.pay && info.pay != ''">
        <p>支付方式</p>
        <p>{{info.pay}}</p>
      </div>
      <div class="fx" v-if="info.types == 6">
        <p>定金价格</p>
        <p>{{$fnc.toFixedZ(info.down_pay)}}</p>
      </div>
      <div class="fx" v-if="info.types == 6">
        <p>货品尾款</p>
        <p>{{$fnc.toFixedZ(Number(info.second_pay) ) > 0 ?$fnc.toFixedZ(Number(info.second_pay)): 0}}
        </p>
      </div>
      <div class="fx" v-if="info.types == 6">
        <p>支付尾款日期</p>
        <p>{{$fnc.getTimeFormat(info.delivery_date)}}</p>
      </div>
    </div>
    <orderDetailsReserveEwm ref="orderDetailsReserveEwm" :orderid="$route.query.id"></orderDetailsReserveEwm>
  </div>
</template>

<script>
import orderDetailsHead from "@/components/currency/order/orderDetails/orderDetailsHead.vue";
import orderDetailsAddress from "@/components/currency/order/orderDetails/orderDetailsAddress.vue";
import orderDetailsItem from "@/components/currency/order/orderDetails/orderDetailsItem.vue";
import orderDetailsRiderItem from "@/components/currency/order/orderDetails/orderDetailsRiderItem.vue";
import mentionorderdetail from "@/components/order/mention/mentionorderdetail.vue";

import orderDetailsReserveEwm from "@/components/currency/order/orderDetails/orderDetailsReserveEwm.vue";

export default {
  components: {
    orderDetailsHead,
    orderDetailsAddress,
    orderDetailsItem,
    mentionorderdetail,
    orderDetailsReserveEwm
  },
  data () {
    return {
      info: {}
    };
  },
  created () {
    this.getOrder();
    this.open_reserveewm();
  },
  watch: {
    $route (to, from) {
      if (from.name == 'orderrefund') {
        this.getOrder();
      }
    }
  },
  filters: {
    tour_daychange (old) {
      var str = old.toString() || '';
      var year = str.slice(0, 4);
      var month = str.slice(4, 6);
      var day = str.slice(6, 8);
      return `${year}-${month}-${day}`
    }
  },
  methods: {
    open_reserveewm () {
      if (this.$refs.orderDetailsReserveEwm) {
        this.$refs.orderDetailsReserveEwm.qrcode()
      }
    },
    getOrder () {
      var params = {};
      params.id = this.$route.query.id || "";
      if (this.$route.query.sup) {
        this.$api.getSupplier.getSupplierOrderDetails(params).then(res => {
          if (res.code == 200) {
            this.info = res.result;
          }
        });
      } else {
        this.$api.getOrder.getOrderDetails(params).then(res => {
          if (res.code == 200) {
            this.info = res.result;
          }
        });
      }
    }
  }
};
</script>


<style lang="less" scoped>
.order-groups {
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: 15px;
  background: #fff;
  color: #48484a;

  > div {
    padding: 6px 12px;
  }

  img {
    width: 30px;
    border-radius: 50%;
    vertical-align: bottom;
    margin-right: 6px;
  }

  span {
    display: inline-block;
    width: 30px;
    line-height: 30px;
    text-align: center;
    height: 30px;
    border-radius: 50%;
    border: 1px dashed #ddd;
    color: #e1e1e1;
    font-weight: bold;
    margin-right: 6px;
  }
}

.order_time {
  padding: 20px 0;
  background: #fff;
  line-height: 1;
  margin: 20px 0;
  width: 100%;
  
  
  .fx {
    font-size: 14px;
    padding: 6px 16px;
    align-content: center;
    > p:first-child {
      color: #999999;
      font-weight: bold;
      width: 70px;
    }

    > p:last-child {
      color: #333333;
      font-weight: bold;
      word-break: break-all;
      text-align: right;
      line-height: 15px;
    }
  }
}

.order_fapiao {
  height: 60px;
  background: #fff;
  margin: 15px 0;
  padding: 0 16px;

  > p:first-child {
    font-size: 17px;
    font-weight: bold;
  }

  > p:last-child {
    font-size: 15px;
    color: #999999;
    font-weight: bold;
  }
}

.order_details {
  background: #f3f3f3;
  overflow: auto;
}

.table_info {
  width: 100%;
  padding: 10px 0;
  background: #fff;
  margin: 20px 0;
}

.table_info p {
  font-size: 16px;
  color: #333333;
  text-align: center;
  font-weight: bold;
  line-height: 32px;
}

.table_info table {
  width: 92%;
  margin: 0 auto;
  border: 1px solid #eeeeee;
}

.table_info table th {
  font-size: 14px;
  color: #999999;
  font-weight: bold;
}

.table_info table td {
  width: 50%;
  height: 30px;
  font-size: 12px;
  color: #333333;

  text-align: center;
}

.table_info table td:nth-of-type(1) {
  width: 40%;
}

.table_store {
  padding: 0 16px;
  line-height: 1;
  font-size: 14px;
  background: #fff;
  color: #333333;
  margin-bottom: 15px;

  p.oda_p1 {
    font-weight: bold;
    padding-top: 20px;
    font-size: 15px;
  }

  > .fx {
    font-size: 16px;
    padding-top: 20px;
    padding-bottom: 12px;
  }

  > div.oda_d1 {
    padding-bottom: 20px;
  }
  .reservebox {
  }
}
</style>
