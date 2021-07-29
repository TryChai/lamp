<template>
  <div class="presale_item" @click="$router.push({path:'/shop/shopdetails',query:{id:info.id}})">
    <div class="presale_item_top">
      <div class="presale_item_top_left">
        <img :src="$fnc.getImgUrl(info.piclink)" alt="">
      </div>
      <div class="presale_item_top_right">

        <p>{{info.title}}</p>
        <div class="presale_item_top_right_middle">
          <p class="price_regular">
            <small>￥</small>
            <b>{{$fnc.get_int_dec(info.price,'int')}}</b>
            <i>{{$fnc.get_int_dec(info.price,'dec')}}</i>
            <span v-if="info.market_price && info.market_price != '' ">
              {{$fnc.toFixedZ(info.market_price)}}
            </span>
          </p>
          <p>已售{{$fnc.toFixedZ(info.sale_per)}}%</p>
        </div>
        <div class="presale_item_top_right_bottom">
          <p>当前预售价格</p>
          <p>
            <limit_percent :num="info.sale_per"></limit_percent>
          </p>
        </div>
      </div>
    </div>
    <div class="presale_item_bottom">
      <div class="presale_item_bottom_left">
        <p>商品货期：{{$fnc.getMonthAndDay(info.delivery_date)}}</p>
        <p>商品定金：{{info.down_pay }}元</p>
      </div>
      <span @click="$router.push({path:'/shop/shopdetails',query:{id:info.id}})">参与预售</span>
    </div>
  </div>
</template>
<script>
import limit_percent from '@/components/shop/limit/limit_percent'
export default {
  name: "presale_shop_item",
  data () {
    return {
    };
  },
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  components: {
    limit_percent
  },
  methods: {

  },
}
</script>
<style   scoped>
.presale_item {
  width: 95%;
  /* height: 140px; */
  /* padding: 10px 10px 5px 10px; */
  margin: 0 auto;
  background-color: #ffffff;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;
  border-radius: 10px;
  overflow: hidden;
}
.presale_item_top {
  width: 100%;
  height: 120px;
  padding: 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.presale_item_top_left {
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.presale_item_top_left img {
  width: 100%;
}
.presale_item_top_right {
  width: 70%;
  font-size: 12px;
  padding-left: 15px;
}
.presale_item_top_right > p:nth-of-type(1) {
  width: 100%;
  font-size: 14px;
  color: #1a1a1a;
  line-height: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.presale_item_top_right_middle {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
  line-height: 30px;
  padding-top: 15px;
}
.presale_item_top_right_middle > p:nth-of-type(1) {
  font-size: 24px;
  font-weight: bold;
  color: #ff3963;
}
.presale_item_top_right_middle > p:nth-of-type(1) span {
  font-size: 12px;
  color: #999999;
  margin-left: 5px;
  text-decoration: line-through;
}
.presale_item_top_right_middle > p:nth-of-type(2) {
  font-size: 12px;
  /* font-weight: bold; */
  color: #999999;
}
.presale_item_top_right_bottom {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.presale_item_top_right_bottom > p:nth-of-type(1) {
  width: 40%;
  font-size: 12px;
  color: #ff3963;
}
.presale_item_top_right_bottom > p:nth-of-type(2) {
  width: 40%;
  font-size: 14px;
  color: #ff3963;
  display: flex;
  justify-content: center;
  align-items: center;
}
.presale_item_bottom {
  width: 100%;
  height: 60px;
  background-color: #fafafa;
  padding: 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.presale_item_bottom_left {
  width: 60%;
  font-size: 13px;
}
.presale_item_bottom_left p:nth-of-type(1) {
  color: #999999;
}
.presale_item_bottom_left p:nth-of-type(2) {
  color: #999999;
}
.presale_item_bottom > span {
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  background-color: #ff3a63;
  background: -webkit-linear-gradient(
    to left,
    #ff3a63,
    #ff7d5e
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    to left,
    #ff3a63,
    #ff7d5e
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    to left,
    #ff3a63,
    #ff7d5e
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to left, #ff3a63, #ff7d5e); /* 标准的语法 */
  border-radius: 10px;
  padding: 2px 20px;
  border-radius: 20px;
}
.price_regular > small {
  font-size: 10px;
  font-weight: bold;
}
.price_regular > b {
  font-size: 16px;
}
.price_regular > i {
  font-size: 10px;
  font-weight: normal;
  font-style: normal;
}
.price_regular span {
  font-weight: normal;
}
</style>