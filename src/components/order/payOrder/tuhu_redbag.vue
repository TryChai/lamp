<template>
  <div style="width:100%;height: 100%;overflow: auto;">
    <div class="self">
      <div class="head">
        <div class="head_top">
          <p @click="toBack">
            <van-icon name="arrow-left" />
          </p>
          <p class="title">
            <span>
              <img :src="$fnc.getImgUrl(consumption.logo)" />
            </span>
            <span>{{consumption.head}}</span>
          </p>
        </div>
        <div>
          <p class="amount">今日已发放优惠券{{Number(consumption.sum_money)}}元</p>
          <div class="preferential">
            <p class="best">
              <!-- <img src="../../../assets/img/tuhu_redbag/best.png" v-if="consumption.red_data.max == '1'" /> -->
            </p>
            <p class="bag_money">
              <span>￥</span>
              <span>{{$fnc.toFixedZ(consumption.red_data.money) || 0}}</span>
            </p>
            <p class="limit">满{{consumption.red_data.cdn_xfm || 0}}可用</p>
            <p class="date">将于{{consumption.red_data.lifetime || 0}}天后到期</p>
          </div>
          <p class="use" @click="getCoupons" v-if="consumption.is_coupon == '0' && consumption.red_data">立即领取优惠券</p>
          <p class="use" v-else-if="consumption.is_coupon == '0' && consumption.red_data == ''">优惠券已领完</p>
          <p class="use"v-else>已领取</p>
          <p class="account" v-if="consumption.is_coupon == '1'">
            <span v-if="consumption.tel">优惠券已放至账户</span>
            <span>{{consumption.tel}}</span>
          </p>
          <p class="account" v-else>
            <span v-if="receive.tel">优惠券已放至账户</span>
            <span>{{receive.tel}}</span>
          </p>
        </div>
      </div>
    
      <!-- <div class="main"> -->
      <ul class="main">
        <p class="look">
          <span>&nbsp;看看好友的手气 &nbsp;</span>
        </p>
        <li class="friends" v-for="(item,i) in consumption.data">
          <div class="friend_mation">
            <div class="avatar">
              <img :src="$fnc.getImgUrl(item.avatar) || require('../../../assets/img/tuhu_redbag/asong.png')" />
            </div>
            <div class="get_time">
              <p>{{item.nickname.length > 5 ? item.nickname.slice(0,5) : item.nickname}}</p>
              <p>
                <span>{{$fnc.getTimeFormat(item.created_time)}}</span>
              </p>
            </div>
          </div>
          <div class="friend_best">
            <span style="margin-right: 10px;" v-if="item.max == '1'">
              <img src="../../../assets/img/tuhu_redbag/friend_best.png" />
            </span>
            <span class="price">{{$fnc.toFixedZ(item.money)}}</span>
            <span class="price1">元</span>
          </div>
        </li>
      </ul>
      <!-- </div> -->
    
      <div class="foot">
        <p>活动细则</p>
        <div class="rule" v-html="consumption.coupon_txt"></div>
      </div>
    
      <!-- <md-landscape v-model="binding_show" class="index-man-pop">
        <rewardinfo @closebtn="binding_show = false"></rewardinfo>
      </md-landscape> -->
      <bindingPhone :receive="receive" :show="binding_show" @closeBin="closeBin"></bindingPhone>
    </div>
  </div>
</template>

<script>
  import bindingPhone from "@/components/page/binding_phone"
  export default {
    data() {
      return {
        oid: this.$route.query.oid,
        consumption: {},
        receive: {
          tel: "",
          wxewm: "",
          red_data: {
            title: "",
            money: "",
            cdn_xfm: "",
            cdn_pid: "",
            cdn_sid: "",
            lifetime: "",
            is_receive: "0"
          }
        }, //领取红包
        binding_show: false
      }
    },
    methods: {
      closeBin(val) {
        this.binding_show = val;
      },
      getCoupons(){
        if (this.oid) {
          //领取红包
          this.$api.getOrder.receiveCoupon({
            oid: this.oid
          }).then(res => {
            if (res.code == 200) {
              this.receive = res.result;
              // this.$set(this.consumption, "is_coupon", "1");
              this.getCouponList();
              if (this.receive.tel == '' || (this.receive.tel && this.receive.wxewm)) {
                this.binding_show = true;
              }
              this.$toast.success("领取成功！");
            } else if (res.code == 404 && res.result == "此红包不可领取") {
              // setTimeout(() => {
              //   this.$router.push("/")
              // },2000)
              this.$dialog.confirm({
                title: "提示",
                message: "此红包不可领取,点击确定返回首页"
              }).then(() => {
                this.$router.push("/")
              });
            }
          });
        }
      },
      getCouponList(){
        //查看领取情况
        this.$api.getOrder.getCoupon({
          oid: this.oid
        }).then(res => {
          if (res.code == 200) {
            this.consumption = res.result;
          } else if (res.code == 404 && res.result == "订单不存在") {
            console.log("订单不存在:",res.result)
            this.$dialog.confirm({
              title: "提示",
              message: "订单不存在,点击确定返回首页"
            }).then(() => {
              this.$router.push("/")
            });
          }
        })
      }
    },
    components: {
      bindingPhone
    },
    created() {
      this.getCouponList();
    }
  };
</script>

<style lang="less" scoped>
  .self {
    width: 100%;
    height: auto !important;
    font-size: 14px;
    overflow: auto;
    background-size: 100% !important;
    // background-attachment: local !important;
    background: url("../../../assets/img/tuhu_redbag/background.jpg") no-repeat top center;

    .head {
      text-align: center;
      margin-top: 11px;

      .head_top {
        display: flex;
        color: #fff;
        align-items: center;
        margin-left: 15px;

        >p:nth-of-type(1) {
          height: 35px;

          .van-icon {
            font-size: 30px;
          }
        }

        .title {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 35px;
          margin-left: 30px;

          img {
            width: 30px;
            height: 30px;
            border-radius: 5px;
          }

          span:nth-child(2) {
            color: white;
            font-size: 19px;
            padding-left: 10px;
            font-weight: bold;
            // padding-top: 5px;
          }
        }
      }

      .amount {
        color: #ffef8d;
        margin-top: 30px;
        font-size: 16px;
      }

      .preferential {
        margin-top: 20px;

        .best {
          margin-top: 30px;
          height: 23px;
        }

        .bag_money {
          color: #d72835;
          margin-top: -10px;

          span:nth-child(1) {
            font-size: 25px;
            font-weight: bold;
          }

          span:nth-child(2) {
            font-size: 50px;
            font-weight: bold;
          }
        }

        .limit {
          color: #885450;
          font-size: 16px;
          margin-top: -7px;
        }

        .date {
          color: #d1908e;
          margin-top: -5px;
        }
      }

      .use {
        margin-top: 40px;
        color: #e12e24;
        font-size: 17px;
        font-weight: bold;
      }

      .account {
        font-size: 14px;
        margin-top: 10px;
        height: 30px;

        span:nth-child(1) {
          color: white;
        }

        span:nth-child(2) {
          padding-left: 5px;
          color: #ffea01;
        }
      }
    }

    .main {
      width: 95%;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.2);
      padding-bottom: 10px;
      // border: 1px solid white;
      border-radius: 10px;
      margin-top: 50px;

      .look {
        color: #ffefa9;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        line-height: 47px;

        span:nth-child(1) {
          width: 165px;
          // line-height: 34px;
          font-size: 18px;
          font-weight: bold;
          border-bottom: 2px solid #ffefa9;
          padding-bottom: 11px;
        }
      }

      .friends {
        width: 92%;
        margin: 15px auto 0 auto;
        padding: 17px 10px 15px 10px;
        display: flex;
        flex-direction: row;
        color: #ffefa9;
        justify-content: space-between;
        background: #fe734a;
        border-radius: 10px;

        .friend_mation {
          display: flex;
          align-items: center;
          flex: 1;

          .avatar {
            img {
              width: 35px;
              height: 35px;
              border-radius: 50%;
            }
          }

          .get_time {
            line-height: 18px;
            margin-left: 5px;

            p:nth-child(1) {
              width: 92%;
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            span:nth-child(1) {
              font-size: 12px;
            }

            span:nth-child(2) {
              font-size: 12px;
              margin-left: 10px;
            }
          }
        }

        .money {
          span:nth-child(1) {
            font-size: 25px;
          }

          span:nth-child(2) {
            font-size: 14px;
          }
        }

        .friend_best {
          display: flex;
          align-items: center;

          .price {
            font-size: 23px;
          }

          .price1 {
            font-size: 14px;
          }
        }
      }
    }

    .foot {
      width: 95%;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
      color: #ffefa9;
      white-space: wrap;
      font-size: 14px;

      p {
        text-align: center;
        font-size: 18px;
        line-height: 50px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      .rule {
        margin: 10px;

      }
    }
  }

  // .self:before {
  //   // content: ' ';
  //   position: fixed;
  //   z-index: -1;
  //   top: 0;
  //   right: 0;
  //   bottom: 0;
  //   left: 0;
  //   background: url("../../../assets/img/tuhu_redbag/background.jpg") center 0 no-repeat;
  //   background-size: cover;
  // }
</style>
