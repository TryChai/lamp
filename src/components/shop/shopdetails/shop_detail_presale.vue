<template>
    <div>
        <div class="shop_detail_limit">
            <div class="shop_detail_limit_left">
                <p>￥<span>{{shopInfo.price}}</span></p>
                <div class="shop_detail_limit_left_price">
                    <div class="shop_detail_limit_left_price_box">
                        <div class="limit_price_box_left">
                            <van-icon name="clock-o"
                                size="14px"
                                color="#dd1c1a"></van-icon>
                        </div>
                        <div class="limit_price_box_right">
                            <span>预售价格</span>
                        </div>
                    </div>
                    <p v-if="shopInfo.market_price && shopInfo.market_price != '' ">
                        {{$fnc.toFixedZ(shopInfo.market_price)}}</p>
                </div>
            </div>
            <div class="shop_detail_limit_right">
                <p>已售{{$fnc.toFixedZ(shopInfo.sale_per)}}%</p>
                <p>
                    <limit_percent :num="shopInfo.sale_per"></limit_percent>
                </p>
            </div>
        </div>
        <h3 class="shop_detail_limit_title">{{shopInfo.title}}</h3>
        <span
      v-if="shopInfo.product_info_reward"
      class="title_tip"
    >分享赚取{{$fnc.toFixedZ(shopInfo.product_info_reward,2)}}{{shopInfo.product_info_reward_cn || '元'}}</span>
        <div class="tj"
            v-if="shopInfo.sub_title">
            <h3>推荐理由</h3>
            <div>
                <p>
                    <!-- <span>1</span> -->
                    <span>{{shopInfo.sub_title}}</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import limit_percent from '@/components/shop/limit/limit_percent'
export default {
    name: "shop_detail_limit",
    data () {
        return {
            settime: {},
            hour: "",
            min: "",
            sec: "",
            time: "2672516"
        };
    },
    props: {
        shopInfo: {
            type: Object,
            default: ()=>{}
        }
    },
    created () {

    },
    methods: {


    },
    components: {
        limit_percent
    },
    beforeDestroy () {
        clearTimeout(this.settime)
    }

}
</script>
<style lang="less" scoped>
.shop_detail_limit {
    width: 100%;
    height: 60px;
    padding-left: 16px;
    background: -webkit-linear-gradient(
        left,
        #f32c91,
        #f23257
    ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(
        right,
        #f32c91,
        #f23257
    ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(
        right,
        #f32c91,
        #f23257
    ); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #f32c91, #f23257); /* 标准的语法 */
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
}
.shop_detail_limit_left {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
}
.shop_detail_limit_left > p {
    font-size: 14px;
    color: #ffffff;
    font-weight: bold;
    line-height: 22px;
}
.shop_detail_limit_left > p span {
    font-size: 30px;
    color: #ffffff;
    font-weight: bold;
}
.shop_detail_limit_left_price {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
}
.shop_detail_limit_left_price_box {
    width: 80px;
    height: 18px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid #ffffff;
    padding: 2 10px;
    border-radius: 10px;
    overflow: hidden;
}
.limit_price_box_left {
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
}
.limit_price_box_right {
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.limit_price_box_right span {
    font-size: 10px;
    color: #ffffff;
    line-height: 12px;
}
.shop_detail_limit_left_price > p {
    font-size: 12px;
    color: #ffffff;
    text-decoration: line-through;
    line-height: 22px;
    padding-left: 5px;
}
.shop_detail_limit_right {
    width: 125px;
    height: 60px;
    background-color: #ffeae9;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
}
.shop_detail_limit_right p:nth-of-type(1) {
    font-size: 14px;
    color: #e10133;
    line-height: 26px;
    font-weight: bold;
}
.shop_detail_limit_right p:nth-of-type(2) {
    width: 80%;
    font-size: 12px;
    color: #e10133;
    line-height: 26px;
}
.shop_detail_limit_right p:nth-of-type(2) span {
    font-size: 12px;
    color: #e10133;
    line-height: 26px;
    background-color: #e42550;
    padding: 2px 4px;
    border-radius: 5px;
    color: #ffffff;
    margin: 0 2px;
}
.shop_detail_limit_title {
    font-size: 16px;
    line-height: 1.4;
    padding: 4px 16px;
}
.tj {
    padding: 0 16px;
    margin-bottom: 10px;
    > h3 {
        font-size: 14px;
        font-weight: normal;
        color: #666;
    }
    > div {
        background: #f4f4f4;
        border-radius: 5px;
        color: #333;
        font-size: 12px;
        padding: 10px;
        margin-top: 10px;
        position: relative;
        p:not(:last-child) {
            padding-bottom: 8px;
        }
    }
    > div:before {
        content: "";
        position: absolute;
        top: -10px;
        left: 20px;
        border-bottom: 10px solid #f4f4f4;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
    }
}
.title_tip {
  font-size: 12px;
  padding: 5px 10px;
  color: rgb(255, 0, 54);
  background-color: #fff5f7;
  width: auto;
  margin-left: 16px;
  display: table;
  margin-bottom: 10px;
}
</style>