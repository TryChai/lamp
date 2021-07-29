<template>
  <div>
    <div class="details_liubai"></div>
    <div class="auctionbox">
      <p>
        <i class="fa fa-gavel"></i>淘抢拍
      </p>
      <div class="auctionbox_img">
        <div>
          <van-icon name="success" />假一赔三
        </div>
        <div>
          <van-icon name="success" />七天无理由
        </div>
        <div>
          <van-icon name="success" />资金托管
        </div>
        <div>
          <van-icon name="success" />拍前预展
        </div>

      </div>
    </div>
    <div class="details_liubai"></div>
    <div class="auctiontable">
      <p><span>起拍价</span> ￥{{$fnc.toFixedZ(auctionInfo.starting_price)}}</p>
      <p><span>保证金</span> ￥{{$fnc.toFixedZ(auctionInfo.auction_margin)}}
      </p>
      <p style="width:100%"><span>加价幅度</span> ￥{{$fnc.toFixedZ(auctionInfo.auction_amplitude)}} ~
        {{$fnc.toFixedZ(auctionInfo.auction_amplitude_max)}}</p>
      <p><span>拍卖佣金</span> {{$fnc.toFixedZ(auctionInfo.auction_yj)}}</p>
      <p style="width:100%"><span>我的保证金</span>
        ￥{{$fnc.toFixedZ(auctionInfo.margin)}}
        <span style="color:red;flex:1;padding-left:10px" @click="$router.push('/pay/margin/recharge?iden=margin_order')">
          {{Number(auctionInfo.auction_margin)> Number(auctionInfo.margin) ? '当前保证金不足，请前往充值':''}}
        </span>
      </p>
      <p style="width:100%"><span>开拍时间</span>
        {{$fnc.getTimeFormat(auctionInfo.auction_open_time)}}</p>
      <p style="width:100%"><span>结束时间</span> 开拍后{{auctionInfo.auction_end_time}}分钟</p>
    </div>
    <div class="details_liubai"></div>
    <div class="auctionuser">
      <div class="auctionuser_title">
        <p><span>{{auctionInfo.auction_number || 0}}</span>人已参与举手</p>
        <p @click="$router.push('/shop/auctionpeople?id='+ auctionInfo.id)">查看更多
          <van-icon name="arrow" />
        </p>
      </div>
      <div class="auctionuser_box">
        <div class="useritem" v-for="(item,i) in auctionInfo.auction" :key="i">
          <img :src="$fnc.getImgUrl(item.avatar)" alt="">
          <p>{{item.nickname || item.username}} </p>
          <div>
            <p>举手价格<span>{{$fnc.toFixedZ(item.rear_price)}}元</span></p>
            <p>举手时间{{$fnc.getTimeFormat(item.created_time)}}</p>
          </div>
          <span @click="show=true">去抢拍</span>
        </div>

      </div>
    </div>
    <van-popup v-model="show" get-container="body" :close-on-click-overlay="false" position="bottom">
      <div class="bidbox">
        <div class="bid_top">
          <span>我的出价</span>
          <van-icon name="cross" @click="show = false" />
        </div>
        <div class="bid_content">
          <div class="bid_content_input">
            <span :class="bidMoney > min ? '':'bid_gray'" @click="bidbtn(0)">-</span>
            <van-field v-model="bidMoney" input-align="center" type="number" @blur="bindmoneyinput($event)" />
            <span :class="bidMoney < max ? '':'bid_gray'" @click="bidbtn(1)">+</span>
          </div>
          <div class="bid_content_bottom">
            <p>当前价 <span>￥{{$fnc.toFixedZ(auctionInfo.auction_price)}}</span></p>
            <p>{{auctionInfo.auction_types == 0?'加':'减'}}价幅度
              <span>
                ￥{{$fnc.toFixedZ(auctionInfo.auction_amplitude)}} ~
                {{$fnc.toFixedZ(auctionInfo.auction_amplitude_max)}}
              </span>
            </p>
          </div>
        </div>
        <div class="bid_bottom" @click="confirmbid">
          确认出价
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Field, Popup } from 'vant';
export default {
  name: "auctionShopDetail",
  data () {
    return {
      bidMoney: 0,
      show: false,
    };
  },
  props: {
    auctionInfo: {
      type: Object,
      default: {}
    },
    shopInfo: {
      type: Object,
      default: {}
    }
  },
  components: {
    [Popup.name]: Popup,
    [Field.name]: Field,
  },
  computed: {
    min () {
      if (this.auctionInfo.auction_types == 0) {
        return Number(this.auctionInfo.auction_price) + Number(this.auctionInfo.auction_amplitude)
      } else {
        return Number(this.auctionInfo.auction_price) - Number(this.auctionInfo.auction_amplitude_max)
      }
    },
    max () {
      if (this.auctionInfo.auction_types == 0) {
        return Number(this.auctionInfo.auction_price) + Number(this.auctionInfo.auction_amplitude_max)
      } else {
        return Number(this.auctionInfo.auction_price) - Number(this.auctionInfo.auction_amplitude)
      }
    },
  },
  methods: {
    bindmoneyinput () {
      var val = this.bidMoney
      //@type 0 -   1 +
      if (this.auctionInfo.auction_types == 0) {
        if (!(val >= this.min && val <= this.max)) {
          this.$toast.fail(`幅度${this.$fnc.toFixedZ(this.auctionInfo.auction_amplitude)}~${this.$fnc.toFixedZ(this.auctionInfo.auction_amplitude_max)}`)
          this.bidMoney = this.max;
        }
        //提价拍
      } else {
        if (!(val >= this.min && val <= this.max)) {
          this.$toast.fail(`幅度${this.$fnc.toFixedZ(this.auctionInfo.auction_amplitude)}~${this.$fnc.toFixedZ(this.auctionInfo.auction_amplitude_max)}`)
          this.bidMoney = this.min;
        }
      }
    },
    confirmbid () {
      var params = {};
      params.id = this.auctionInfo.id;
      params.auction_price = this.auctionInfo.auction_price;
      params.rear_price = this.bidMoney;
      this.$api.getShop.bid_auciton(params).then(res => {
        // if (res.code == 200) {
        // this.$toast.success(res.result, 1000)
        if (res.result == '请先缴纳保证金') {
          setTimeout(() => {
            this.$router.push(`/pay/margin/recharge?money=${this.auctionInfo.auction_margin}&id=${this.auctionInfo.id}&iden=margin_order`)
          }, 1500);
        } else if (res.result == '竞拍成功') {
          setTimeout(() => {
            this.$router.push(`/order/orderlist?status=待支付`)
          }, 1500);
        } else {
          this.show = false;
          setTimeout(() => {
            this.$emit('refreshAuction')
          }, 1500);
        }
        // }
      })
    },
    bidbtn (type) {

      if (type == 0) {
        if (!(this.bidMoney > this.min)) {
          return
        }
        this.bidMoney = Number(this.bidMoney) - 1
      } else {
        if (!(this.bidMoney < this.max)) {
          return
        }
        this.bidMoney = Number(this.bidMoney) + 1
      }
    }
  },
  watch: {
    show (to, from) {
      var price = 0;
      if (this.auctionInfo.auction_types == 0) {
        price = Number(this.auctionInfo.auction_price) + Number(this.auctionInfo.auction_amplitude)
      } else {
        console.log(this.auctionInfo.auction_price, this.auctionInfo.auction_amplitude)
        price = Number(this.auctionInfo.auction_price) - Number(this.auctionInfo.auction_amplitude)
      }
      this.bidMoney = Number(price)
    }
  },
}
</script>
<style lang="less" scoped>
.details_liubai {
  background: #f3f3f3;
  height: 0.26667rem;
}
.auctionbox {
  width: 100%;
  padding: 5px 15px;
  background-color: #fef7da;
  > p:nth-of-type(1) {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    > i {
      background-color: #e07523;
      color: #fff;
      border-radius: 50%;
      padding: 4px;
      font-size: 14px;
      margin-right: 5px;
    }
    font-size: 14px;
    color: #000000;
    font-weight: 400;
    margin-bottom: 5px;
  }
  .auctionbox_img {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;

    > div {
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;
      color: #da6009;
      > i {
        font-size: 12px;
        padding: 2px;
        border: 1px solid #da6009;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
  }
}
.auctiontable {
  width: 100%;
  padding: 5px 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  font-size: 13px;
  > p {
    width: 50%;
    height: 35px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #7e7e7e;
    > span {
      width: 70px;
      color: #131313;
    }
  }
}
.auctionuser {
  width: 100%;
  padding: 0px 15px 5px 15px;
  .auctionuser_title {
    width: 100%;
    height: 40px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    > p:nth-of-type(1) {
      font-size: 14px;

      color: #0b0b0b;
      > span {
        color: #f90000;
        font-weight: bold;
      }
    }
    > p:nth-of-type(2) {
      font-size: 14px;
      color: #a3a3a3;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .auctionuser_box {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;

    .useritem {
      width: 100%;
      height: 60px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      border-top: 1px solid #eeeeee;
      > img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin-right: 5px;
      }
      > p {
        width: 90px;
        font-size: 14px;
        color: #000000;
        overflow: hidden;
        //隐藏部分显示为省略号
        text-overflow: ellipsis;
        //禁止文本自动换行
        white-space: nowrap;
      }
      > div {
        flex: 1;
        height: 100%;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: flex-start;
        font-size: 11px;
        margin-right: 10px;
        > p {
          span {
            color: #d82018;
          }
        }
        > p:nth-of-type(2) {
          color: #595959;
        }
      }
      > span {
        font-size: 14px;
        color: #ffffff;
        background-color: #f12b08;
        border-radius: 5px;
        padding: 5px 10px;
      }
    }
  }
}
.bidbox {
  width: 100%;
  height: auto;
  .bid_top {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #212121;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
    .van-icon {
      font-size: 20px;
      color: #bdbdbd;
      position: absolute;
      right: 20px;
      line-height: 40px;
    }
  }
  .bid_content {
    width: 100%;
    height: 120px;
    display: flex;
    flex-flow: column;
    justify-content: space-evenly;
    align-items: center;
    .bid_gray {
      background-color: #d9d9d9 !important;
    }
    .bid_content_input {
      display: flex;
      justify-content: center;
      align-items: center;
      > span:nth-of-type(1),
      span:nth-of-type(2) {
        font-size: 20px;
        // font-weight: bold;
        color: #fff;
        width: 45px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #c81a22;
        border-radius: 10px;
      }
      // > span:nth-of-type(2) {
      // width: 100px;
      // height: 30px;
      // border: 1px solid #c2c2c2;
      // color: #c81a22;
      // text-align: center;
      // line-height: 30px;
      // font-size: 14px;
      // margin: 0 10px;
      // }
      .van-cell {
        width: 100px;
        height: 30px;
        border: 1px solid #c2c2c2;
        color: #c81a22;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        margin: 0 10px;
      }
    }
    .bid_content_bottom {
      width: 85%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      > p {
        color: #000000;
        > span {
          color: #838383;
        }
      }
    }
  }
  .bid_bottom {
    width: 100%;
    height: 45px;
    font-size: 16px;
    color: #fff;
    background-color: #c81a22;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>