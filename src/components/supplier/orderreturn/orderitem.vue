<template>
  <div class="bgwrite order_item">
    <div class="order_item_header">
      <p>订单编号：{{item.oid}}</p>
      <span class="order_item_head_s2" v-if="item.status==1">申请退货</span>
      <span class="order_item_head_s2" v-else-if="item.status==2">允许退货</span>
      <span class="order_item_head_s2" v-else-if="item.status==3">已退货待退款</span>
      <span class="order_item_head_s2" v-else-if="item.status==4">退货成功</span>
    </div>
    <div class="order_item_shop">
      <div class="order_item_shop_left">
        <img :src="item.piclink" v-lazy="item.piclink" alt />
      </div>
      <div class="order_item_shop_right">
        <p class="">{{item.title}}{{item.title}}{{item.title}}</p>
        <p v-if="item.sku_cn">{{ item.sku_cn }}</p>
        <div class="fx">
          <p>￥{{ $fnc.toFixedZ(item.price) }}</p>
          <p>×{{ item.number }}</p>
        </div>
      </div>
    </div>
    <div class="order_item_bottom">
      <van-button plain size="small" @click="checkbtn">审核退货</van-button>
    </div>

    <van-popup v-model="showreturn" class="dia_pop">
      <van-nav-bar title="申请退款" left-text left-arrow class="navbar" :border="false" @click-left="showreturn = false" />

      <van-card :num="item.number" lazy-load :price="$fnc.toFixedZ(item.price)" :desc="item.sku_cn" :title="item.title" :thumb="item.piclink"
          v-lazy="item.piclink" class="card_order_refund" />

      <!-- <div class="box_liy">
        <van-cell title="退款原因" is-link :value="radio" @click="show=true" />
      </div> -->
      <div class="box_liy">
        <p class="box_liy_p">退款状态：{{item.status}}
          <span v-if="item.status==1">申请退货</span>
          <span v-else-if="item.status==2">允许退货</span>
          <span v-else-if="item.status==3">已退货待退款</span>
          <span v-else-if="item.status==4">退货成功</span>
        </p>
        <p class="box_liy_p">退款金额：<span>￥{{$fnc.toFixedZ(item.money)}}</span></p>
        <p class="box_liy_p">退款原因：<span>{{item.return_reason}}</span> </p>
        <p class="box_liy_p">退款说明：<span>{{item.return_instructions}}</span></p>
        <p class="box_liy_p" v-if="item.status!=1 && item.return_name">收件人姓名：<span>{{item.return_name}}</span></p>
        <p class="box_liy_p" v-if="item.status!=1 && item.return_tel">收件人电话：<span>{{item.return_tel}}</span></p>
        <p class="box_liy_p" v-if="item.status!=1 &&item.return_address">收件人地址：<span>{{item.return_address}}</span></p>
        <p class="box_liy_p" v-if="item.return_mail">物流公司：<span>{{item.return_mail}}</span></p>
        <p class="box_liy_p" v-if="item.return_oid">物流单号：<span>{{item.return_oid}}</span></p>
        <p class="box_liy_p" v-if="item.status == 2">等待用户寄回中 </p>

      </div>

      <div>
        <van-cell-group v-if=" item.status !=2 && item.status !=4 && item.status !=3">
          <van-field v-model="item.return_name" label="收件人姓名" placeholder="请输入收件人姓名" />
          <van-field v-model="item.return_tel" label="收件人电话" placeholder="请输入收件人电话" />
          <van-field :value="cateTitle" label="收件人地址" placeholder="请选择省市区" @click="seladdressshow = true" />
          <selAddress :level="4" :show="seladdressshow" @confirm="confirmaddress"></selAddress>
          <van-field v-model="form.address" label="详细地址" placeholder="请输入收件人地址" />
        </van-cell-group>

        <van-radio-group v-model="form.status" v-if="item.status != 2">
          <van-cell-group>
            <van-cell title="驳回退货" clickable @click="form.status = '0'" v-if="item.status!=4 &&item.status !=3">
              <template #right-icon>
                <van-radio name="0" />
              </template>
            </van-cell>
            <van-cell title="允许退货" clickable @click="form.status = '4'" v-if="item.status== 3">
              <template #right-icon>
                <van-radio name="4" />
              </template>
            </van-cell>
            <van-cell title="允许退货" clickable @click="form.status = '2'" v-else-if="item.status != 4">
              <template #right-icon>
                <van-radio name="2" />
              </template>
            </van-cell>

          </van-cell-group>
        </van-radio-group>
      </div>

      <div class="returnsubmit" @click="submit" v-if=" item.status != 4 && item.status != 2">
        <span>提交</span>
      </div>

    </van-popup>

  </div>
</template>

<script>
import { setTimeout } from "timers";
import { Card, Field, RadioGroup, Radio, } from 'vant';

import selAddress from "@/components/currency/selAddress/selAddress"

export default {
  props: {
    item: {
      type: Object,
      default: () => { }
    },

  },

  components: {
    [Card.name]: Card,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    selAddress
  },

  data () {
    return {
      status: '',
      cateTitle: '',
      seladdressshow: false,
      form: {
        status: ''
      },
      showreturn: false,
      sub_form: {},
      address_show: false,
      show: false
    };
  },
  created () {
  },
  methods: {
    submit () {
      var params = {};
      params = JSON.parse(JSON.stringify(this.item));
      params["goods_id"] = this.item.id;
      params["status"] = this.form.status;
      params["return_address"] = `${this.form.province || ''}${this.form.city || ''}${this.form.area || ''}${this.form.town || ''}}${this.form.address || ''}`;
      this.$api.getShop.check_orderreturn(params).then(res => {
        if (res.code == 200) {
          this.$toast.success('操作成功');
          this.showreturn = false;
          this.$emit('openThis')
        }
      })
    },
    confirmaddress (data) {
      this.form.province = data[0] || '';
      this.form.city = data[1] || '';
      this.form.area = data[2] || '';
      this.form.town = data[3] || '';
      this.cateTitle = `${data[0] || ''}${data[1] || ''}${data[2] || ''}${data[3] || ''} `
      this.seladdressshow = false;
    },
    checkbtn () {
      // this.showreturn = true;
      // this.$router.push('/supplier/returndetail?id=' + this.item.id)
      this.$store.commit("setIsSupplier", true);
      this.$router.push("/order/orderrefund?id=" + this.item.id + "&types=" + this.item.types);
    },
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
.box_liy {
  margin: 10px 0;
  background: #fff;
  .van-cell {
    padding: 0.26667rem 0.4rem 1rem;
    .van-cell__title {
      font-weight: bold;
      flex: auto;
      color: #222;
    }
    .van-cell__value {
      flex: auto;
    }
  }
  .box_liy_p {
    padding: 0.26667rem 0.4rem 0rem;
    font-weight: bold;
    line-height: 0.64rem;
    > span {
      color: #ff2f57;
      padding-left: 12px;
    }
  }
  .box_liy_p2 {
    font-weight: bold;
    line-height: 1rem;
    padding: 16px 0.4rem 10px;
    .input_liy {
      display: inline-block;
      margin-left: 12px;
      width: 70%;
      padding: 0;
    }
  }
}
.box_img {
  background: #fff;
  padding: 0.26667rem 0.4rem 25px;
  > p {
    font-weight: bold;
    line-height: 0.64rem;
    margin-bottom: 10px;
  }
  .box_img_img {
    display: inline-block;
    vertical-align: bottom;
    margin: 0 5px 0 0;
    position: relative;
    > span {
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ff2f57;
    }
  }
}
.order_item {
  width: 100%;
  .order_item_header {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    > p {
      font-size: 12px;
      color: #999999;
    }
    > span {
      font-size: 16px;
      color: #999999;
    }
  }
  .order_item_shop {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 0;
    .order_item_shop_left {
      width: 2.02667rem;
      height: 2.02667rem;

      margin-right: 10px;
      > img {
        width: 100%;
        overflow: hidden;
      }
    }
    .order_item_shop_right {
      flex: 1;
      height: 1.8rem;
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: center;
      > p {
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 1.2;
      }
      > div {
        margin-top: auto;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > p:nth-of-type(2) {
          font-size: 0.32rem;
          color: #999999;
          padding: 0.05333rem 0;
        }
      }
    }
  }
  .order_item_bottom {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px dashed #eee;
    padding: 10px 0;
    button {
      border-radius: 0.13333rem;
      color: #c50d0d;
      border: 0.02667rem solid #c50d0d;
    }
  }
}

.dia_pop {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.returnsubmit {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  > span {
    width: 100%;
    height: 50px;
    background-color: #ff2f57;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #ffffff;
  }
}
</style>
