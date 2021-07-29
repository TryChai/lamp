<template>
  <div class="couponItem">
    <div class="fx couponItem_top">
      <img v-if="item.shop_logo" :src="$fnc.getImgUrl(item.shop_logo)" alt />
      <span>{{item.shop_title}}</span>
      <van-button
        type="warning"
        size="mini"
        round
        plain
        color="#949494"
        @click="goToStore(item.sid)"
      >去逛逛</van-button>
    </div>
    <div v-for="(r,i) in item.red" :key="i">
      <div class="fx couponItem_detail" v-if="r.pid>0">
        <img :src="$fnc.getImgUrl(r.p_piclink)" alt />
        <div class="fx ci_div_info">
          <p class="ci_div_info_p1">
            <span class="price_regular">
              <small>￥</small>
              <b>{{$fnc.get_int_dec(r.money,'int')}}</b>
              <i>{{$fnc.get_int_dec(r.money,'dec')}}</i>
            </span>
            <span>满{{r.xfm}}减{{r.money}}</span>
          </p>
          <p class="ci_div_info_p2 van-ellipsis">{{r.p_title}}</p>
          <p
            class="ci_div_info_p3"
          >{{r.info == '已使用'?'使用时间：'+$fnc.getTimeFormat(r.use_time):'过期时间：'+$fnc.getTimeFormat(r.end_time)}}</p>
        </div>
        <div class="fx ci_div_btn">
          <van-button type="warning" size="mini" round disabled>{{r.info}}</van-button>
          <div class="ci_div_liubai liubai1"></div>
          <div class="ci_div_liubai liubai2"></div>
        </div>
      </div>
      <div class="fx couponItem_detail1" v-else>
        <div class="ci_div_img">
          <img src="@/assets/img/smallcon/red.png" alt />
        </div>
        <div class="fx ci_div_info1">
          <p class="ci_div_info1_p1">
            <span class="price_regular">
              <small>￥</small>
              <b>{{$fnc.get_int_dec(r.money,'int')}}</b>
              <i>{{$fnc.get_int_dec(r.money,'dec')}}</i>
            </span>
            <span>满{{r.xfm}}减{{r.money}}</span>
          </p>
          <p class="ci_div_info1_p2 van-ellipsis">{{r.title}}</p>
          <p
            class="ci_div_info_p3"
          >{{r.info == '已使用'?'使用时间：'+$fnc.getTimeFormat(r.use_time):'过期时间：'+$fnc.getTimeFormat(r.end_time)}}</p>
        </div>
        <div class="fx ci_div_btn1">
          <van-button type="warning" size="mini" round disabled>{{r.info}}</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "couponItem2",
  components: {},
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    goToStore(id) {
      if (id > 0) {
        this.$router.push({
          path: "/supplier/supplierdetails",
          query: { id: id },
        });
      } else {
        this.$router.push({ path: "/" });
      }
    },
    goToUsed(id) {
      if (id > 0) {
        this.$router.push({ path: "/shop/shopdetails", query: { id: id } });
      } else {
        this.$router.push({ path: "/" });
      }
    },
  },
  filters: {},
};
</script>

<style lang="less" scoped>
.couponItem {
  width: 100%;
  background-color: #fff;
  margin-bottom: 16px;
  padding: 10px;
  border-radius: 15px;
  > div {
    width: 100%;
  }
  .price_regular {
    margin-right: 5px;
    > small {
      font-size: 12px;
      font-weight: bold;
    }
    > b {
      font-size: 22px;
    }
    i {
      font-size: 12px;
      font-weight: normal;
      font-style: normal;
    }
  }
  .couponItem_top {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    justify-content: flex-start;
    padding-bottom: 8px;
    > img {
      border-radius: 6px;
      width: 30px;
      height: 30px;
      margin-right: 8px;
    }
    > span:nth-of-type(1) {
      width: 240px;
      font-weight: bold;
      font-size: 20px;
      margin-right: auto;
      white-space: nowrap;
      text-overflow: ellipsis;
      -webkit-text-overflow: ellipsis;
      overflow: hidden;
    }
    .van-button {
      width: 50px;
      font-size: 12px;
      line-height: 1;
    }
  }
  .couponItem_detail {
    height: 80px;
    background: #fff6f1;
    margin: 10px 0;
    padding: 10px 8px;
    border-radius: 10px;
    > img {
      border-radius: 10px;
      width: 60px;
      height: 60px;
    }
    .ci_div_info {
      width: 190px;
      flex-wrap: wrap;
      padding: 0 3px 0 6px;
      align-items: flex-start;
      justify-content: flex-start;
      > p {
        width: 100%;
        font-size: 12px;
        line-height: 1.2;
        color: #6c6666;
      }
      .ci_div_info_p1 {
        color: #ff5a00;
        font-family: "gilroy" !important;
        > span:nth-of-type(2) {
          letter-spacing: 0.5px;
        }
      }
      .ci_div_info_p2 {
        padding-bottom: 6px;
      }
      .ci_div_info_p3 {
        font-size: 9px;
      }
    }
    .ci_div_btn {
      position: relative;
      height: 100%;
      padding-left: 10px;
      border-left: 1px dashed rgb(253, 94, 8);
      .ci_div_liubai {
        position: absolute;
        width: 15px;
        height: 15px;
        background-color: #fff;
        border-radius: 50%;
      }
      .ci_div_liubai.liubai1 {
        top: -18px;
        left: -8px;
      }
      .ci_div_liubai.liubai2 {
        bottom: -18px;
        left: -8px;
      }
      .van-button {
        font-size: 13px;
        padding-top: 2px;
      }
    }
  }
  .couponItem_detail1 {
    height: 80px;
    margin: 10px 0;
    border-radius: 10px;
    background: linear-gradient(to right, #ff735c, #fd3f31);
    .ci_div_img {
      padding: 10px 0 10px 8px;
      > img {
        border-radius: 10px;
        width: 60px;
        height: 60px;
      }
    }
    .ci_div_info1 {
      width: 190px;
      flex-wrap: wrap;
      padding: 0 3px 0 6px;
      align-items: flex-start;
      justify-content: flex-start;
      > p {
        width: 100%;
        font-size: 12px;
        line-height: 1.2;
        color: #fff0c3;
      }
      .ci_div_info1_p1 {
        font-family: "gilroy" !important;
        .price_regular {
          margin-right: 5px;
          > small {
            color: #fff0c3;
            font-size: 10px;
            font-weight: bold;
          }
          > b {
            color: #fff0c3;
            font-size: 22px;
          }
          i {
            color: #fff0c3;
            font-size: 12px;
            font-weight: normal;
            font-style: normal;
          }
        }
        > span:nth-of-type(2) {
          letter-spacing: 0.5px;
        }
      }
      .ci_div_info1_p2 {
        padding-bottom: 6px;
      }
      .ci_div_info1_p3 {
        font-size: 9px;
      }
    }
    .ci_div_btn1 {
      flex-wrap: wrap;
      justify-content: center;
      width: 74px;
      height: 100%;
      padding: 10px 8px 10px 10px;
      border-left: 2px solid #ff6153;
      text-align: center;
      border-radius: 35px 0 0 35px;
      > p {
        width: 100%;
        color: #fff0c3;
        font-family: "gilroy" !important;
        line-height: 1;
        .price_regular {
          margin-right: 5px;
          > small {
            color: #fff0c3;
            font-size: 10px;
            font-weight: bold;
          }
          > b {
            color: #fff0c3;
            font-size: 14px;
          }
          i {
            color: #fff0c3;
            margin-left: 2px;
            font-size: 10px;
            font-weight: normal;
            font-style: normal;
          }
        }
      }
      .van-button {
        font-size: 13px;
        color: #d22018;
        padding-top: 2px;
        background: linear-gradient(to right, #ffedd9, #fbb06c);
      }
    }
  }
}
</style>