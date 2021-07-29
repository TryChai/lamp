<template>
  <div class="bgwrite order_item">
    <div class="fx order_item_head" @click="went_orderdetail(item)">
      <div>
        <h4>{{ item.is_pay == 0 ? "未支付" : item.sid_cn }}</h4>
        <span class="order_item_head_s1">订单编号：{{ item.oid }}</span>
      </div>
      <span class="order_item_head_s2" v-if="item.status == '已发货' && item.types == 9">待出行</span>
      <span class="order_item_head_s2" v-else-if="(item.status == '已支付') && (item.types == 14 || item.types == 13)">已预约</span>
      <span class="order_item_head_s2" v-else-if="item.status == '已发货' && item.types == 13">已预约</span>
      <span class="order_item_head_s2" v-else-if="item.status == '已发货' && item.types == 14">已服务</span>
      <span class="order_item_head_s2" v-else-if="item.types == 19 && item.group_buy && item.group_buy.user_status==0">拼购中</span>
      <span class="order_item_head_s2" v-else-if="item.types == 19 && item.group_buy && item.group_buy.user_status==1">已拼中</span>
      <span class="order_item_head_s2" v-else-if="item.status == '已发货' && item.types == 21">待入住</span>
      <span class="order_item_head_s2" v-else-if=" item.status == '已完成' && (item.types == 11 || item.types == 10) && item.write_complete_number == 0">待核销</span>
      <span class="order_item_head_s2" v-else>{{ item.status }}</span>
    </div>

    <div class="order_item_shop">
      <div v-for="(it, index) in item.product" :key="index">
        <div class="fx foot_order_item_list">
          <div class="fx">
            <!-- <router-link
                :to="it.pid == 0 ? '':it.types == 21 ?`/hotel/details?tid=${appusers.uid}&id=${item.hotel_id}`:`/shop/shopdetails?tid=${appusers.uid}&id=${it.pid}` + `${$route.query.mid ?'&mid='+$route.query.mid :''}`"
                class="a1" :key="index"> -->
            <div class="a1" >
              <img :src="it.piclink" v-lazy="it.piclink" alt />
            </div>
            <!-- </router-link> -->

            <div class="fx_3">
              <router-link :to="it.pid == 0 ? '':`/hotel/details?tid=${appusers.uid}&id=${item.hotel_id}`" :key="index" class="fx orderlist_hotel"
                  v-if="it.types == 21">
                <div>
                  <p class="van-multi-ellipsis--l2">{{it.title}}</p>
                  <p>{{ it.sku_cn || ""}}&nbsp;<span>{{it.number}}间{{(item.hotel_end_time-item.hotel_start_time)/3600/24 || 1}}晚</span></p>
                  <p>入住时间：{{$fnc.getTimeFormat(item.hotel_start_time)}}</p>
                  <p>离店时间：{{$fnc.getTimeFormat(item.hotel_end_time)}}</p>
                </div>
              </router-link>

              <!-- <router-link
                  :to="it.pid == 0 ? '':`/shop/shopdetails?tid=${appusers.uid}&id=${it.pid}` + `${$route.query.mid ?'&mid='+$route.query.mid :''}`"
                  :key="index" class="fx orderlist_a" v-else> -->
              <div class="fx orderlist_a" v-else>
                <div>
                  <p class="order_p van-ellipsis">{{it.title.length >= 23? it.title.slice(0, 23) + "...": it.title}}</p>
                  <p v-if="it.sku_cn">{{ it.sku_cn }}</p>
                </div>

                <div class="fx">
                  <p>S${{ $fnc.toFixedZ(it.price) }}</p>
                  <!-- <p>优惠后$129.00</p> -->
                  <p>×{{ it.number }}</p>
                </div>
              <!-- </router-link> -->
              </div>

              <div class="gift_card fx orderlist_a" v-if="item.status == '已完成' && item.types == 25">
                <div class="gift_info">
                  <p>面值：${{$fnc.toFixedZ(item.recharge_card_money)}}</p>
                </div>

                <div class="gift_info">
                  <p>卡号：{{item.recharge_card_code}}</p>
                  <p class="copy_gift copy" style="cursor: pointer" onclick :data-clipboard-text="item.recharge_card_code"
                      data-clipboard-action="copy" @click="copy_key(item.recharge_card_code)">复制</p>
                </div>
                <div class="gift_info">
                  <p>密码：{{item.recharge_card_password}}</p>
                  <p class="copy_gift copy" style="cursor: pointer" onclick :data-clipboard-text="item.recharge_card_password"
                      data-clipboard-action="copy" @click="copy_key(item.recharge_card_password)">复制</p>
                </div>
              </div>

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
                <p class="ppp2 tl" style="margin-right:5px" v-if="(it.status == 1 || it.status == 2 || it.status == 3) && !isSupplier && !isStore">
                  <van-button type="danger" size="mini" @click="closeOrder(it.id)">取消退货</van-button>
                </p>
                <!-- <div>
                  <van-button plain :to="'/shop/shopreview?id='+it.id" size="mini"
                      v-show="item.status=='已完成' && !isSupplier && !isStore && (it.status == 0 || it.status == '0' || it.status ==4 || it.status == '4') && item.types != 25 && item.types != 26"
                      class="review_order_list">{{it.is_review == 0 ?"待评价":"已评价"}}</van-button>
                </div> -->
                <p v-if="$route.query.mid"></p>
                <p class="ppp2" v-else-if="it.order_return && !isSupplier && !isStore && (item.types == 10 || item.types == 11) && item.write_complete_number == 0">
                  <van-button plain size="mini" @click="toOrderRetuen(false, it.id, it.types)">
                    {{ it.order_return }}
                  </van-button>
                </p>
                <!-- 申请售后 -->
                <!-- <p class="ppp2" v-else-if="it.order_return && !isSupplier && !isStore && item.types!=13 && item.types != 25 && item.types != 11 && item.types != 10">
                  <van-button type="danger" size="mini" @click="toOrderRetuen(false, it.id,it.types)">{{ it.order_return }}</van-button>
                </p> -->
                <p v-else-if="it.order_return && isSupplier  && it.order_return !='申请退货'" class="ppp2">
                  <van-button class="review_order_list" type="danger" size="mini">{{ it.order_return }}</van-button>
                </p>
              </div>
            </div>
          </div>
          <div class="fx tr"></div>
        </div>
      </div>

      <div class="tr foot_order_item" v-if="item.types == 6 && $route.path == '/order/presale'">
        共
        <span>{{ item.product.length }}</span>
        件商品 &nbsp;&nbsp;定金金额
        <span v-if="item.status == '已付定金'">${{ $fnc.toFixedZ(Number(item.second_pay)) }}</span>
        <span v-if="item.status != '已付定金'">${{ $fnc.toFixedZ(Number(item.down_pay)) }}</span>
        <br />
        <br />
        <div v-if="item.status != '未支付'">
          尾款金额：
          <span v-if="item.status == '已付定金'">
            ${{
            Number(item.down_pay) > 0
            ? $fnc.toFixedZ(Number(item.down_pay))
            : 0
            }}
          </span>
          <span v-if="item.status != '已付定金'">
            ${{
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
        <span v-if="item.product.length">{{ item.product.length }}</span> 个善缘
        <span>金额 S${{ $fnc.toFixedZ(item.money) }}</span>
      </div>

      <div class="foot_order_btn tr" v-if="isStore">
        <van-button plain size="small" v-if="item.status == '已发货'  && item.types == 14">待客户确认</van-button>
        <van-button plain size="small" @click="subDeliverSever1(item)" v-if="item.status == '已支付'  && item.types == 14">开始服务</van-button>
      </div>
      <div v-else-if="$route.query.mid">
        <!-- 微店 -->
      </div>
      <div class="foot_order_btn tr" v-else-if="!isSupplier">
        <van-button plain size="small" @click="presale_btn(item)" v-if="item.status == '已付定金'" :disabled="is_presale_pay(item.delivery_date)">支付尾款
        </van-button>
        <van-button plain size="small" style="margin-right:10px" @click="cancel_pay(item.id)" v-if="item.status == '未支付' && item.types != 18">取消支付
        </van-button>
        <van-button plain size="small" @click="auctionpay(item.id)" v-if="item.status == '未支付' && item.types == 18 && item.is_virtual==0">竞拍支付
        </van-button>
        <van-button plain size="small" :to="'/order/payorder?id=' + item.id" v-else-if="item.status == '未支付'">去支付</van-button>
        <van-button plain size="small" :to="'/order/orderdetails?id=' + item.id" v-else-if="item.is_return == 1">退货中</van-button>

        <van-button plain size="small" v-else-if="item.types == '4' && item.status == '已支付'">
          {{
          item.groups.status == 0
          ? "进行中"
          : item.groups.status == 1
          ? "待发货"
          : "拼团失败"
          }}
        </van-button>

        <van-button plain size="small" :to="'/order/orderdetails?id=' + item.id" v-else-if="item.status == '已支付' && item.types == 19">
          {{item.group_buy && item.group_buy.status==1?'待发货':'拼购进行中'}}
        </van-button>

        <van-button plain size="small" :to="'/order/orderdetails?id=' + item.id" v-else-if="item.status == '已支付' && item.types!=14 && item.types!=13">
          待发货</van-button>

        <van-button plain size="small" :to="'/order/orderdetails?id=' + item.id"
            v-else-if="item.status == '已支付' && (item.types == 14 || item.types == 13)">已预约</van-button>

        <van-button plain size="small" :to="'/order/orderdetails?id=' + item.id" v-else-if="item.status == '配货中'">配货中</van-button>

        <van-button plain size="small" v-else-if="item.status == '已发货' && item.types != 14 && item.types != 13 && item.types != 21"
            @click="subConfim(item.id)">{{item.types==9?'完成出行':'确认收货'}}</van-button>
        <van-button plain size="small" v-else-if="item.status == '已发货' && item.types == 13" @click="subConfim(item.id)">{{'完成预约'}}</van-button>

        <van-button plain size="small" v-else-if="item.status == '已发货' && item.types == 14" @click="subConfim(item.id)">{{'完成服务'}}</van-button>

        <van-button plain size="small" v-else-if="item.status == '已发货' && item.types == 21" @click="subConfim(item.id)">确认入住</van-button>

        <van-button plain size="small" v-else-if="item.status == '用户自提'" @click="subConfim(item.id)">确认完成</van-button>

        <!-- <van-button plain size="small"
            :to="item.types==21?'/hotel/details?id='+item.hotel_id:'/shop/shopdetails?tid='+appusers.uid+'&id='+item.product[0].pid"
            v-else-if="item.status == '已完成' && item.types != 25 && item.types != 26">再次购买</van-button> -->

        <van-button plain size="small" v-if="item.status == '已付定金' && item.types == 6" @click="cancelPreSale(item.oid)">取消预售</van-button>

        <van-button plain size="small" v-if="item.status == '已支付' && item.types == 14" @click="open_reserveewm(item.id)">预约二维码</van-button>

        <van-button plain size="small" v-if="item.status == '已支付' && item.types == 25">{{item.recharge_card_status == "0" ? "未使用" : "已使用"}}
        </van-button>

        <van-button type="danger" style="margin-left:6px;border:0.02667rem solid #ee0a24;color:#fff" size="small"
            :to="'/assemble/assembledetails?id=' + item.id" v-if="item.types == '4'">邀请好友拼单</van-button>

        <van-button plain size="small" style="margin-left:10px" @click="$router.push('/order/maildetails?id=' + item.id)"
            v-if="(item.status == '已发货' || item.status == '已完成') && item.mail_oid != null && item.mail_oid != '' && item.types != 9 && item.types != 14 && item.types != 13">
          查看物流</van-button>
      </div>
      <div class="foot_order_btn tr" v-else>
        <van-button plain size="small" v-if="item.status == '拼团进行中'">拼团进行中</van-button>
        <van-button plain size="small" @click="subDeliverGoods(item.status)"
            v-if="(item.status == '已支付' || item.status == '已发货') && item.types != 14 && item.types != 13">
          {{ item.status == "已支付" ? "确认发货" : "待收货" }}</van-button>
        <van-button plain size="small" v-if="item.status == '已发货'  && (item.types == 14 || item.types ==13)">待确认</van-button>
        <van-button plain size="small" @click="subDeliverSever(item)" v-if="item.status == '已支付'  && item.types == 14">确认预约</van-button>
      </div>
    </div>

    <van-popup v-model="show" position="right" class="sub-goods" get-container="#app">
      <deliver-goods v-if="isSupplier" @opThis="opThis" :item="item" />
    </van-popup>

    <van-popup v-model="showauction" class="dia_pop">
      <div class="order_dia">
        <div class="order_dia_title">选择地址</div>
        <div class="order_dia_sel" v-if="sub_form && JSON.stringify(sub_form) != '{}'">
          <div v-if="sub_form.name != '' && sub_form.tel != ''">
            <p>姓名:{{sub_form.name}}</p>
            <p>电话:{{sub_form.tel}}</p>
          </div>
          <div v-if="cateTitle && cateTitle!=''">
            <p>地区:{{cateTitle}}</p>
          </div>
          <div v-if="sub_form.address && sub_form.address!=''">
            <p>地址:{{sub_form.address}}</p>
          </div>

          <p class="order_dia_exchange" @click="exchange_address">
            <van-icon name="exchange" />更改地址
          </p>
        </div>
        <div class="order_dia_sel" v-else>
          <p class="order_dia_exchange" @click="exchange_address">
            <van-icon name="exchange" />更改地址
          </p>
        </div>
        <div class="order_dia_btn">
          <span @click="confirmpay">确认支付</span>
        </div>
      </div>

    </van-popup>

    <van-popup v-model="address_show" style="width:90%" class="add_show_edit" position="right">
      <information @getAddressItem='getAddressItem' :isShop="true" @back="getback" :isOrder="true" />
    </van-popup>
    <orderDetailsReserveEwm ref="orderDetailsReserveEwm" :orderid="item.id"></orderDetailsReserveEwm>
  </div>
</template>

<script>
import {
  setTimeout
} from "timers";
import Dialog from "vant";
import DeliverGoods from "@/components/currency/order/deliverGoods/DeliverGoods.vue";
import Clipboard from "clipboard";


import information from "@/components/setting/information.vue";
import addAddres from '@/components/setting/addAddres';
import orderDetailsReserveEwm from "@/components/currency/order/orderDetails/orderDetailsReserveEwm.vue";

export default {
  props: {
    item: {
      type: Object,
      default: () => { }
    },
    isSupplier: {
      type: Boolean,
      default: false
    },
    isStore: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DeliverGoods,
    addAddres,
    information,
    orderDetailsReserveEwm
  },
  computed: {
    cateTitle () {
      return `${this.sub_form.province}${this.sub_form.city}${this.sub_form.area}${this.sub_form.town}`
    },
  },
  data () {
    return {
      sub_form: {},
      showauction: false,
      address_show: false,
      show: false
    };
  },
  methods: {
    open_reserveewm () {
      if (this.$refs.orderDetailsReserveEwm) {
        this.$refs.orderDetailsReserveEwm.qrcode()
      }
    },
    cancelPreSale (oid) {
      //取消预售
      this.$api.getShop.cancelPreSale({
        oid: oid
      }).then(res => {
        if (res.code == 200) {
          this.$toast.success("取消成功");
          setTimeout(() => {
            this.$emit("openThis");
          },1000)
        } else {
          this.$toast.fail(res.result)
        }
      })
    },
    confirmpay () {
      var params = {};
      params.id = this.item.id;
      params.address_id = this.sub_form.id
      this.$api.getShop.pay_auction_order(params).then(res => {
        if (res.code == 200 && res.result == true) {
          this.$router.push('/order/payorder?id=' + this.item.id)
        }
      })
    },
    exchange_address () {
      this.address_show = true;
    },

    getback () {
      this.address_show = false;
    },
    getAddressItem (address) {
      this.sub_form = address;
      this.address_show = false;

    },
    auctionpay () {
      this.showauction = true;
      this.$api.getShop.get_default_address({}).then(res => {
        if (res.code == 200) {
          this.sub_form = res.result || {};

        }
      })
    },
    went_orderdetail (item) {
      if (!this.$route.query.mid) {
        if (item.types == 21) { //酒店
          this.$router.push(
            `/hotel/orderdetails?id=${item.id}${this.isSupplier ? "&sup=supplier" : ""
            }`
          );
        } else {
          this.$router.push(
            `/order/orderdetails?id=${item.id}${this.isSupplier ? "&sup=supplier" : ""
            }`
          );
        }
      }
    },
    cancel_pay (id) {
      this.$dialog
        .confirm({
          message: "确定取消该笔订单吗"
        })
        .then(() => {
          this.$api.getOrder.cancel_pay({
            id: id
          }).then(res => {
            if (res.code == 200) {
              this.$toast.success("取消成功");
              this.$emit("openThis");
            } else {
              this.$toast.error(res.result);
            }
          });
        })
        .catch(() => { });
    },
    toOrderRetuen (bool, id, types) {
      this.$store.commit("setIsSupplier", bool);
      this.$router.push("/order/orderrefund?id=" + id + "&types=" + types);
    },
    presale_btn (item) {
      // /order/payorder?id='+item.id
      this.$api.getOrder.pay_presale_order({
        oid: item.oid
      }).then(res => {
        if (res.code == 200) {
          if (res.result || res.result == null) {
            this.$router.push({
              path: "/order/payorder",
              query: {
                id: item.id
              }
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
          that.$api.getOrder.closeOrderCancel({
            id
          }).then(res => {
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
      var message = "";
      if (this.item.types == 9) {
        message = "完成出行";
      } else if (this.item.types == 14 || this.item.types == 13) {
        message = "完成预约";
      } else if (this.item.types == 21) {
        message = "完成入住";
      } else {
        message = "收货";
      }
      that.$dialog
        .confirm({
          title: "提示",
          message: `是否确认${message}`
        })
        .then(() => {
          that.$api.getOrder.closeOrder({
            id
          }).then(res => {
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
    },
    subDeliverSever (item) {
      var that = this;
      if (item.status == "已支付" && item.types == "14") {
        that.$dialog
          .confirm({
            title: "提示",
            message: `是否确认预约服务`
          })
          .then(() => {
            var params = {};
            params.id = item.id;
            that.$api.getSupplier.sendServe(params).then(res => {
              if (res.code == 200) {
                that.$toast.success("确认成功");
                setTimeout(() => {
                  this.$emit("openThis");
                }, 1500);
              }
            });
          })
          .catch(() => { });
      }
    },
    subDeliverSever1 (item) {
      var that = this;
      if (item.status == "已支付" && item.types == "14") {
        that.$dialog
          .confirm({
            title: "提示",
            message: `是否确认开始服务`
          })
          .then(() => {
            var params = {};
            params.id = item.id;
            that.$api.getStore.store_order_serve(params).then(res => {
              if (res.code == 200) {
                that.$toast.success("确认成功");
                setTimeout(() => {
                  this.$emit("openThis");
                }, 1500);
              }
            });
          })
          .catch(() => { });
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

      button {
        border-radius: 5px;
        color: #c50d0d;
        border: 1px solid #c50d0d;
        margin-left: 10px;
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

.orderlist_hotel {
  flex-direction: column;
  width: 100%;
  align-items: flex-start;

  > div {
    width: 100%;
    line-height: 1.2;

    > p {
      &:nth-of-type(1) {
        color: #333333;
        line-height: 1.4;
        width: 250px;
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 5px;
      }
    }
  }
}

//礼品卡样式
.gift_card {
  margin-top: 5px;
  .gift_info {
    display: flex;
    justify-content: space-between;

    .gift_use {
      background: #04be02;
      padding: 4px 5px 3px;
      border-radius: 5px;
      color: #fff;
      font-size: 12px;
    }

    .copy_gift {
      border: 1px solid #d6d6d6;
      padding: 0 3px !important;
      border-radius: 5px;
      font-size: 12px;
      margin-top: 5px;
      color: #999999 !important;
    }
  }
}
</style>
