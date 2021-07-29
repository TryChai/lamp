<template>
  <div class="auction_item" @click="$router.push({path:'/shop/shopdetails',query:{id:info.id}})">
    <div class="auction_item_left">
      <img :src="$fnc.getImgUrl(info.piclink)" alt="">
    </div>
    <div class="auction_item_right">
      <p>{{info.title}}</p>
      <div class="auction_item_right_middle">
        <div>
          <!-- <p>当前价：<span>￥ <small>{{info.auction_price || 'xx'}}</small></span></p> -->
          <p>当前价：
            <span class="price_regular">
              <small>￥</small>
              <b>{{$fnc.get_int_dec(info.auction_price || 0,'int')}}</b>
              <i>{{$fnc.get_int_dec(info.auction_price|| 0, 'dec')}}</i>
            </span>
          </p>
          <p>{{info.auction_number}}次出价
            <span>|</span>
            起拍价:{{$fnc.toFixedZ(info.starting_price,0)}}
          </p>
        </div>
        <span>去竞拍</span>
      </div>
      <div class="auction_item_right_bottom">
        <span>{{info.auction_title}}</span>
        <van-count-down :time="info.auction_countdown * 1000" format="剩HH时mm分ss秒" />
      </div>
    </div>

  </div>
</template>
<script>
import limit_percent from '@/components/shop/limit/limit_percent'
import { CountDown } from 'vant';
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
    limit_percent,
    [CountDown.name]: CountDown
  },
  methods: {

  },
}
</script>
<style  lang="less" scoped>
.auction_item {
  width: 92%;
  height: 120px;

  margin: 20px auto;
  background-color: #ffffff;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  // border-radius: 5px;
  // border-radius: 10px;
  // overflow: hidden;
}

.auction_item_left {
  width: 120px;
  margin-right: 10px;
  img {
    width: 100%;
  }
}
.auction_item_right {
  flex: 1;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: flex-start;
  > p:nth-of-type(1) {
    font-size: 14px;
    text-align: justify;
    line-height: 20px;
    margin-bottom: 5px;
    color: #1a1a1a;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    //隐藏行数
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  > .auction_item_right_middle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    > div {
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: flex-start;
      > p:nth-of-type(1) {
        color: #666666;
        font-size: 12px;
        line-height: 20px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        > span {
          font-size: 20px;
          color: #ff2043;
          font-weight: bold;
          display: flex;
          justify-content: center;

          > small {
            font-size: 12px;
            padding-top: 2px;
          }
          > i {
            font-size: 14px;
            padding-top: 2px;
            font-style: normal;
          }
        }
      }
      > p:nth-of-type(2) {
        color: #666666;
        font-size: 11px;
        line-height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;

        > span {
          margin: 0 5px;
        }
        .van-icon {
        }
      }
    }
    > span {
      font-size: 14px;
      line-height: 1;
      color: #ffffff;
      background-image: linear-gradient(to right, #ff3463, #ff7e5e);
      padding: 5px 15px 4px 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 15px;
    }
  }
  > .auction_item_right_bottom {
    width: 100%;
    height: 18px;
    background-color: #f2f2f2;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    > span:nth-of-type(1) {
      width: 75px;
      font-size: 12px;
      color: #fff;
      background-color: #ff3963;
      text-align: center;
      border-top-right-radius: 18px;
      border-bottom-right-radius: 18px;
    }
    > span:nth-of-type(2) {
      font-size: 12px;
      color: #333333;
      font-weight: bold;
    }
    .van-count-down {
      font-size: 12px;
      color: #333333;
      font-weight: bold;
    }
  }
}
</style>