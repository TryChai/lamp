<template>
  <!-- 首页商品  大图显示 -->
  <div class="main">
    <div class="card2">
      <div class="priduct" v-for="(item,i) in top_shoplist">
        <img class="img1" :src="item.big_piclink ? $fnc.getImgUrl(item.big_piclink) : $fnc.getImgUrl(item.piclink)"
          @click="toDetails(true,item)" />
        <div class="con" @click="toDetails(false,item)">
          <p>{{item.title}}</p>
          <p v-if="$store.state.config.plugin.xxmk.is_open==1 && item.is_lifting == '1'">提货时间：{{timeIosFormat(new Date())}}</p>
          <div class="con1">
            <p class="noTop">
              <span>
                <i>￥</i>
                <b>{{$fnc.get_int_dec(item.price,'int')}}</b>
                <i>{{$fnc.get_int_dec(item.price,'dec')}}</i>
                <del v-if="item.market_price">￥{{item.market_price}}</del>
              </span>
            </p>
            <span>马上抢</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    mapState
  } from "vuex";
  export default {
    name: "one-shop",
    data() {
      return {};
    },
    props: {
      top_shoplist: {
        type: Array,
        default: []
      },
    },
    components: {},
    computed: {
      ...mapState({
        isVideoShop: state => state.config.shop.is_video_shop,
        isShowSales: state => state.config.shop.is_show_sales
      })
    },
    methods: {
      toDetails(bool, item) {
        bool = bool || false;
        if (item.video && this.isVideoShop == 1 && bool) {
          this.$router.push('/shop/shopdetails?id=' + item.id + '&showVideo=1');
        } else {
          this.$router.push('/shop/shopdetails?id=' + item.id + '&showVideo=0');
        }
      },
      timeIosFormat(time) {
        // 时间格式化 2019-09-08
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) && day ==
          31) {
          return year + '-' + (month + 1) + '-' + 1;
        } else if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 30) {
          return year + '-' + (month + 1) + '-' + 1;
        } else if (month == 2) {
          //判断是否是闰年
          if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
            if (month == 2 && day == 29) {
              return year + '-' + (month + 1) + '-' + 1;
            }
            return year + '-' + month + '-' + (day + 1);
          } else {
            if (month == 2 && day == 28) {
              return year + '-' + (month + 1) + '-' + 1;
            }
            return year + '-' + month + '-' + (day + 1);
          }

        } else {
          return year + '-' + month + '-' + (day + 1);
        }
      },
    },
    created() {
      // console.log("商品信息哈哈哈哈哈哈：", this.top_shoplist)
    }
  };
</script>
<style lang="less" scoped>
  .main {
    width: 100%;
    height: 100%;
    overflow: auto;

    .priduct {
      width: 95%;
      margin: 10px 10px 0px 10px;
      background: rgb(255, 255, 255);
      border: 1px solid rgb(255, 255, 255);
      border-radius: 10px;

      .img1 {
        width: 100%;
        margin: 0 auto;
      }

      .con {
        padding: 0 5px 0 5px;

        p:nth-child(1) {
          margin-top: 10px;
          font-size: 16px;
          color: rgb(58, 58, 58);
          line-height: 22px;
        }

        p:nth-child(2) {
          color: rgb(255, 202, 80);
          font-size: 15px;
        }

        .con1 {
          width: 100%;
          display: flex;
          justify-content: space-between;
          flex-direction: row;
          align-items: center;
          margin-bottom: 5px;

          .noTop {
            margin-top: 0 !important;

            span {
              color: red;

              >b {
                font-size: 16px;
              }

              i:nth-of-type(1) {
                font-style: normal;
              }

              i:nth-of-type(2) {
                font-style: normal;
                font-size: 14px;
                font-weight: bold;
              }

              del {
                color: rgb(203, 203, 203);
                font-size: 15px;
                padding-left: 10px;
              }
            }
          }

          >span {
            font-size: 12px;
            font-weight: bold;
            color: #ffffff;
            background-color: #ff3a63;
            background: -webkit-linear-gradient(to left,
              #ff3a63,
              #ff7d5e);
            /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(to left,
              #ff3a63,
              #ff7d5e);
            /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(to left,
              #ff3a63,
              #ff7d5e);
            /* Firefox 3.6 - 15 */
            background: linear-gradient(to left,
              #ff3a63,
              #ff7d5e);
            /* 标准的语法 */
            border-radius: 10px;
            padding: 2px 15px;
            border-radius: 20px;
          }
        }
      }
    }
  }
</style>
