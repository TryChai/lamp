<template>
  <div class="shop_item_con">
    <div class="dddd1">
      <img :src="item.piclink" v-lazy="item.piclink" @click="toDetails(true)" alt>
      <img class="stork_0" src="../../../assets/img/shop/stork.png" v-if="item.stock<=0" alt="">
      <div class="shop-video-icon" v-if="item.video" @click="toDetails(true)">
        <div>
          <img src="../../../assets/img/play.png" alt="">
        </div>
      </div>
    </div>

    <div class="shop_info" @click="toDetails(false)">
      <p class="shop_title">
        <!-- <span class="shop_s1">预售商品</span> -->
        <span>{{item.title&&item.title.length>=20?item.title.slice(0,20)+'...':item.title}}</span>
      </p>
      <p class="shop_title2" v-html="item.label" v-if="item.label">
        <!--                <van-tag type="danger">标签</van-tag>-->
      </p>
      <p v-if="item.is_made==1" class="quality-label">
        <span>品控师鉴定</span>
      </p>
      <p class="fx shop_title3">
        <span class="price_regular">
          <small>￥</small>
          <b>{{$fnc.get_int_dec(item.price,'int')}}</b>
          <i>{{$fnc.get_int_dec(item.price,'dec')}}</i>
        </span>
        <span v-show="isShowSales==1">{{item.sale || 0}}人付款</span>
      </p>
    </div>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex';
  export default {
    props: {
      item: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      ...mapState({
        isVideoShop: state => state.config.shop.is_video_shop,
        isShowSales: state => state.config.shop.is_show_sales,

      }),
    },
    methods: {
      toDetails(bool) {
        bool = bool || false
        if (this.item.video && this.isVideoShop == 1 && bool) {
          this.$router.push('/shop/shopdetails?id=' + this.item.id + '&showVideo=1');
        } else {
          this.$router.push('/shop/shopdetails?id=' + this.item.id + '&showVideo=0');
        }

      }
    }
  }
</script>


<style lang="less" scoped>
  .shop-video-icon {
    position: absolute;
    left: 0px;
    bottom: 0px;
    height: auto;
    display: flex;
    padding: 10px;
    z-index: 4;

    >div {
      display: flex;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
    }

    img {
      width: 30px !important;
      height: 30px;
    }
  }

  .quality-label {
    font-size: 12px;
    padding-top: 5px;

    >span {
      border-radius: 3px;
      border: 1px solid #ef8012;
      color: #ef8012;
      padding: 2px 3px;
    }
  }

  .hidhide_p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  }

  .shop_item_con {
    border-radius: 5px;
    background: #fbfbfb;
    overflow: hidden;
    // width: 170px;
    position: relative;
    z-index: 2;

    .dddd1 {
      position: relative;
    }

    img {
      width: 100%;
      z-index: 3;
    }

    .stork_0 {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 auto;
      z-index: 5;
      width: 50%;
      opacity: 1;
      transform: translate(-50%, -50%);
    }

    .shop_info {
      background: #fff;
      padding: 6px;

      .shop_title {
        .shop_s1 {
          padding: 3px 4px;
          border-radius: 5px;
          margin-right: 5px;
          background: #fe0035;
          color: #fff;
          font-size: 10px;
        }

        font-size: 13px;
        color: #666666;
        line-height: 1.4;
      }

      .shop_title2 {
        font-size: 12px;
        padding: 5px 0 0px;

        span {
          line-height: 5px;
          padding: 0px 3px;
          border-radius: 7px;
          font-size: 10px;
        }

        span:first-child {
          border: 1px solid #e80000;
          color: #e80000;
        }

        span:nth-child(2) {
          border: 1px solid #f9c440;
          color: #f9c440;
        }

        span:nth-child(3) {
          border: 1px solid #50b9e2;
          color: #50b9e2;
        }

        span:not(:first-child) {
          margin-left: 3px;
        }
      }

      .shop_title3 {
        padding: 5px 0 0px;
        line-height: 1.2;

        // > span {
        //     flex: 1;
        // }
        span:first-child {
          font-size: 15px;
          font-weight: bold;
          color: #ff0036;
          font-family: "PingFangSC-Regular";
          flex: 1.3;

          >small {
            font-size: 12px;
            font-weight: normal;
          }
        }

        span:nth-of-type(2) {
          display: block;
          height: 18px;
          line-height: 18px;
          font-family: "PingFangSC-Regular";
          color: #8f8f8f;
          font-size: 12px;
          text-align: right;
        }
      }
    }
  }

  .price_regular>small {
    font-size: 10px;
    font-weight: bold;
  }

  .price_regular>b {
    font-size: 16px;
  }

  .price_regular>i {
    font-size: 10px;
    font-weight: normal;
    font-style: normal;
  }
</style>
