<template>
  <div>
    <div class="shop_detail_integral">
      <div class="shop_detail_integral_top">
        <p>{{$store.state.config.shop.integral_cn ||'积分'}}：<span>{{$fnc.toFixedZ(shopInfo.score_rob)}}</span></p>
        <div class="title_title_2">
          <p>
            <van-icon :name="shopInfo.collect?'star':'star-o'" color="#333" @click="changesc" size="20px" />
          </p>
          <p>{{shopInfo.collect?'已收藏':'收藏'}}</p>
        </div>
      </div>
    </div>
    <h3 class="shop_detail_limit_title">{{shopInfo.title}}</h3>
    <span v-if="shopInfo.product_info_reward" class="title_tip">分享赚取{{$fnc.toFixedZ(shopInfo.product_info_reward,2)}}{{shopInfo.product_info_reward_cn || '元'}}</span>
    <p class="get_points" v-if="shopInfo.integral_txt"><a @click="$router.push('/page/sign')">{{shopInfo.integral_txt}}</a></p>
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
  export default {
    name: "shop_detail_limit",
    data() {
      return {};
    },
    props: {
      shopInfo: {
        type: Object,
        default: {}
      }
    },
    components: {},
    methods: {
      changesc() {
        console.log("!")
        if (this.shopInfo.collect == true) {
          this.shopInfo.collect = false;
        } else {
          this.shopInfo.collect = true;
        }
        var params = {};
        params.id = this.$route.query.id || '';
        this.$api.getShop.getGz(params).then(res => {
          if (res.code == 200) {
            this.$toast.success(res.result);
          }
        })
      }
    },
  }
</script>
<style lang="less" scoped>
  .shop_detail_integral {
    width: 100%;
    padding: 0 16px;
  }

  .shop_detail_integral_top {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .shop_detail_integral_top p {
    font-size: 14px;

    color: #999999;
  }

  .shop_detail_integral_top p span {
    font-size: 28px;
    line-height: 28px;
    color: #dd1a22;
    font-weight: bold;
  }

  .shop_detail_integral_top_right {
    background-color: #f4f4f4;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding: 5px 15px;
  }

  .shop_detail_integral_top_right p:nth-of-type(1) {
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
    color: #dd1a22;
  }

  .shop_detail_integral_top_right p:nth-of-type(2) {
    font-size: 12px;
    line-height: 12px;
    color: #4d4d4d;
  }

  .shop_detail_limit_title {
    font-size: 16px;
    line-height: 1.4;
    padding: 4px 16px;
  }
  
  .get_points{
    font-size: 14px;
    margin: 4px 16px;
    line-height: 20px;
    background: #d6d6d6;
    border-radius: 5px;
    padding: 3px 5px;
    // a{
    //   color: #fff;
    // }
  }

  .tj {
    padding: 0 16px;
    margin-bottom: 10px;

    >h3 {
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

  .title_title_2 {
    // background: #f4f4f4;
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
