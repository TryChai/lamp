<template>
  <div class="shop_details_con">
    <!-- <div class="title_text">下发可领劵，领劵后在省30元，到手价239元</div> -->
    <div class="fx assemplate-title" v-if="shopInfo.types==4">
      <div class="fx">
        <span class="price_regular">
          <small>￥</small>
          <b>{{$fnc.get_int_dec(group.group_price,'int')}}</b>
          <i>{{$fnc.get_int_dec(group.group_price,'dec')}}</i>
        </span>
        <div>
          <p>￥{{shopInfo.price}}</p>
          <span>商品原价</span>
        </div>
      </div>
      <div>
        <p>已成功拼团{{shopInfo.real_sale}}件</p>
        <div>
          <div>剩余{{shopInfo.stock}}件</div>
          <img src="../../../assets/img/assemble/t2.png" alt />
        </div>
      </div>
    </div>
    <div class="fx assemplate-title" v-else-if="shopInfo.types==19">
      <div class="fx">
        <span class="price_regular">
          <small style="color:#FFF353;">￥</small>
          <b style="color:#FFF353;">{{$fnc.get_int_dec(shopInfo.group_buy.price,'int')}}</b>
          <i style="color:#FFF353;">{{$fnc.get_int_dec(shopInfo.group_buy.price,'dec')}}</i>
        </span>
        <div>
          <p>￥{{shopInfo.price}}</p>
          <span>商品原价</span>
        </div>
      </div>
      <div>
        <p>已成功拼团{{shopInfo.real_sale}}件</p>
        <div>
          <div>剩余{{shopInfo.stock}}件</div>
          <img src="../../../assets/img/assemble/t2.png" alt />
        </div>
      </div>
    </div>
    <div class="fx title_title" v-else>
      <div class="title_title_1">
        <span class="shop-market_price-con">
          <div v-if="shopInfo.sku_id !='0' && Number(shopInfo.min_price) != Number(shopInfo.max_price)" class="title_max_min">
            <span style="color: #ff5a00">销售价</span>
            <span>
              <div class="price_regular">
                <small>￥</small>
                <b>{{$fnc.get_int_dec(shopInfo.min_price,'int')}}</b>
                <i>{{$fnc.get_int_dec(shopInfo.min_price,'dec')}}</i>
                ~
                <small>￥</small>
                <b>{{$fnc.get_int_dec(shopInfo.max_price,'int')}}</b>
                <i>{{$fnc.get_int_dec(shopInfo.max_price,'dec')}}</i>
              </div>
              <!-- {{$fnc.toFixedZ(shopInfo.min_price )}}~{{$fnc.toFixedZ(shopInfo.max_price)}} -->
            </span>
          </div>
          <div v-else-if="shopInfo.types==24" class="price_regular">
            <small>￥</small>
            <b>{{$fnc.get_int_dec('0','int')}}</b>
            <i>{{$fnc.get_int_dec('00','dec')}}</i>
          </div>
          <div v-else class="price_regular">
            <small>￥</small>
            <b>{{$fnc.get_int_dec(shopInfo.price,'int')}}</b>
            <i>{{$fnc.get_int_dec(shopInfo.price,'dec')}}</i>
          </div>
        </span>

        <span class="shop-market_price-con1" v-if="shopInfo.market_price !=''">
          <small>市场价￥</small>
          {{shopInfo.market_price}}
        </span>
      </div>
      <div class="title_title_2">
        <p>
          <van-icon :name="shopInfo.collect?'star':'star-o'" color="#333" @click="changesc" size="20px" />
        </p>
        <p>{{shopInfo.collect?'已收藏':'收藏'}}</p>
      </div>
    </div>
    <!-- <div class="fx shop_vip" v-if="$store.state.user.rating<=1">
            <div class="fx ">
                <img src="../../../assets/img/shop/vip.png" alt="">
                <p class="van-ellipsis">加入会员，购物立享优惠</p>
            </div>
            <div class=" shop_vip_right">
                立即开通 
                <van-icon name="arrow" />
            </div>
    </div>-->
    <!-- <div class="fx shop_vip" v-else>
            <div class="fx ">
                <img src="../../../assets/img/shop/vip.png" alt="">
                <p class="van-ellipsis">您的推广邀请码：{{$store.state.user.share}}，推广享优惠</p>
            </div>
            <div class=" shop_vip_right">
                立即复制 
                <van-icon name="arrow" />
            </div>
    </div>-->
    <h3 class>{{shopInfo.title}}</h3>
    <span v-if="shopInfo.product_info_reward" class="title_tip">分享赚取{{$fnc.toFixedZ(shopInfo.product_info_reward,2)}}{{shopInfo.product_info_reward_cn || '元'}}</span>
    <div class="tj" v-if="shopInfo.sub_title">
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
  import {
    Rate
  } from "vant";
  export default {
    components: {
      [Rate.name]: Rate
    },
    props: {
      shopInfo: {
        type: Object,
        default: () => {}
      },
      group: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        value: 0
      };
    },
    methods: {
      changesc() {
        if (this.shopInfo.collect == true) {
          this.shopInfo.collect = false;
        } else {
          this.shopInfo.collect = true;
        }
        var params = {};
        params.id = this.$route.query.id || "";
        this.$api.getShop.getGz(params).then(res => {
          if (res.code == 200) {
            this.$toast.success(res.result);
          }
        });
      }
    }
  };
</script>



<style lang="less" scoped>
  .assemplate-title {
    margin-bottom: 15px;
  }

  .shop_details_con {
    padding-bottom: 16px;

    >h3 {
      font-size: 16px;
      line-height: 1.4;
      padding: 0px 16px 4px 16px;
    }

    .tj {
      padding: 0 16px;

      h3 {
        font-size: 14px;
        font-weight: normal;
        color: #666;
      }

      >div {
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

      >div:before {
        content: "";
        position: absolute;
        top: -10px;
        left: 20px;
        border-bottom: 10px solid #f4f4f4;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
      }
    }
  }

  .shop_vip {
    height: 38px;
    line-height: 36px;
    background: #faedc3;
    padding: 0 12px;
    margin: 0 12px;
    border-radius: 5px;

    >div {
      height: 100%;

      justify-content: flex-start;

      img {
        display: block;
        max-height: 100%;
      }

      p {
        display: inline-block;
        font-size: 12px;
        padding-left: 10px;
        color: #6d5925;
      }
    }

    .shop_vip_right {
      font-size: 12px;
      color: #764a16;
      text-align: right;

      i {
        vertical-align: text-top;
      }
    }
  }

  .title_text {
    height: 30px;
    line-height: 30px;
    background: #fff0dd;
    color: #f48707;
    padding-left: 16px;
    font-weight: bold;
    font-size: 12px;
  }

  .title_title {
    padding: 0 16px;
    height: 54px;

    .title_max_min {
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: flex-start;

      >span:nth-of-type(1) {
        font-size: 12px;
        font-weight: normal;
        // background-color: #fff5f7;
      }

      >span:nth-of-type(2) {
        font-size: 22px;
        // font-weight: bold;
        padding-top: 5px;

        small {
          font-size: 12px;
        }
      }
    }

    .title_title_1 {
      color: #ff0036;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      line-height: 1;

      // font-family: "PingFangSC-Regular";
      >small {
        font-size: 10px;
      }

      >span:nth-of-type(1) {
        font-size: 22px;
        font-weight: bold;
      }

      >span:nth-of-type(2) {
        padding-left: 10px;
        font-size: 18px;
        font-weight: bold;
        text-decoration: line-through;
      }

      .price_regular>small {
        font-size: 14px;
        font-weight: bold;
      }

      .price_regular>b {
        font-size: 22px;
      }

      .price_regular>i {
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
      }
    }

    .title_title_2 {
      // background: #f4f4f4;
      min-width: 40px;
      height: 36px;
      font-size: 12px;
      text-align: center;
      line-height: 1;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      >p:first-child {
        color: #e3545a;
        font-weight: bold;
        font-size: 12px;
        // padding: 4px 0;
        font-family: "PingFangSC-Regular";
        line-height: 1.4;
      }

      >p:last-child {
        color: #000;
        font-size: 10px;
      }
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
  }

  .assemplate-title {
    background: #f22127;
    padding: 0px 10px 8px;
    color: #fff;
    font-size: 14px;
    line-height: 1.2;
    align-items: flex-end;

    >div:first-child {
      align-items: flex-end;

      >span {
        font-size: 34px;
        font-weight: bold;
        margin-right: 15px;
        line-height: 1;

        small {
          font-size: 20px;
        }
      }

      >div {
        >p {
          font-size: 10px;
          text-decoration: line-through;
          color: #ff8488;
        }

        >span {
          font-size: 12px;
          line-height: 1.4;
        }
      }
    }

    >div:last-child {
      margin-right: 20px;
      margin-top: 20px;
      width: 102px;

      >p {
        color: #f9c70a;
        font-size: 10px;
      }

      >div {
        text-align: center;
        position: relative;
        margin-top: 6px;
        font-size: 10px;
        color: #f22127;
        font-weight: bold;

        >div {
          background: url("../../../assets/img/assemble/t1.png") no-repeat;
          background-size: 100% 100%;
          padding: 2px 0;
        }

        >img {
          position: absolute;
          bottom: 0;
          right: -20px;
          width: 20px;
        }
      }
    }
  }

  .shop-market_price {
    font-size: 14px;
    font-weight: normal;
  }

  .shop-market_price-con {
    font-size: 20px;
  }

  .shop-market_price-con1 {
    font-family: "gilroy";
    font-size: 14px !important;
    padding-left: 10px !important;
    color: #999999 !important;
    font-weight: normal !important;
  }

  .price_regular>small {
    font-size: 36px;
    font-weight: bold;
    // color: #ffffff;
  }

  .price_regular>b {
    font-size: 36px;
    // color: #ffffff;
  }

  .price_regular>i {
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    // color: #ffffff;
  }
</style>
