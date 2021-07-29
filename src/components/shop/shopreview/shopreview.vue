<template>
  <div class="pay_con">
    <van-nav-bar title="提交评价" left-text left-arrow class="navbar" :border="false" @click-left="toBack" />
    <div class="pay_con_d">

      <van-card class="review_card" :desc="$fnc.getTimeFormat(info.created_time)" :title="info.title" :thumb="info.piclink" />
      <div class="review_rate">
        <p>选择评价星级</p>
        <van-rate v-model="form.star" :readonly="info.is_review==1" size="38px" />
      </div>

      <div class="review_msg">
        <van-cell-group :border="false">
          <van-field @blur="windowScorll" :border="false" :disabled="info.is_review==1" v-model="form.content" type="textarea" placeholder="请输入您的评价"
              autosize class="textarcy" />

          <div class="fx conm1">
            <div v-for="(item,i) in pic" :key="i" class="box_img_img">
              <img width="84" height="84" :src="item" v-lazy="item">
              <span @click="closeImg(i)" v-if="info.is_review !=1 ">
                <van-icon name="cross" size="18" color="#fff" />
              </span>
            </div>
            <van-uploader multiple :max-count="3" :after-read="afterRead" v-if="info.is_review==0">
              <div class="up_inp_refund">
                <van-icon name="close" class="fa fa-camera" />
                <p>添加照片</p>
              </div>
            </van-uploader>
          </div>
        </van-cell-group>

      </div>
      <!-- <p class="review_p">评价文字/图片共得10积分</p> -->
      <div class="review_btn">
        <van-button class="" @click="sunForm" :disabled="info.is_review==1" size="large">{{info.is_review==1?'已评价':'提交评价'}}</van-button>
      </div>
      <coupon :show="coupon_show" coupon_type="评价优惠券" :da="coupon_list" @close_coupon="reveive_close"
          style="margin: 0 auto; background-color: transparent">
      </coupon>

      <!-- <turn @send_isturn="receive_isturn" :con="'评价后'" :show="turn_show"></turn> -->
      <turn @send_isturn="receive_isturn" :con="'评价后'" :show="turn_show" @send_closepop="rec_closeturn" @send_res="returnRes" v-if="is_turn"></turn>

      <rewardinfo v-if="rewardinfoshow" class="index-man-pop" :lottery="lottery" style="z-index: 9999;" @closebtn="closebtn"></rewardinfo>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { Card, Rate, Field } from "vant";
import { setTimeout } from 'timers';
// import coupon from "@/components/page/coupon.vue"
import coupon from "@/components/page/new-coupon/new-coupon.vue";
import turn from '@/components/page/turn';
import rewardinfo from "@/components/currency/rewardInfo/rewardinfo";
import exif from "@/assets/js/exif.js";
export default {
  components: {
    [Card.name]: Card,
    [Rate.name]: Rate,
    [Field.name]: Field,
    coupon,
    turn,
    rewardinfo
  },
  data () {
    return {
      turn_show: false,
      is_turn: Boolean,
      coupon_list: [
        {
          money: "",
          desc: "",
          xfm: "",
          end_time: ""
        }
      ],
      coupon_show: false,
      info: {},
      value: 5,
      message: "",
      pic: [],
      form: {
        content: "",
        star: 5,
      },
      lottery: {},
      rewardinfoshow: false//绑定手机号
    };
  },
  created () {
    this.getInfo();
  },
  methods: {
    closebtn () {
      this.rewardinfoshow = false;
      this.turn_show = false;
    },
    rec_closeturn () {
      //大转盘
      if (this.$fnc.isWx() && this.$store.state.config.plugin.wxgzhbb.is_open && this.$store.state.user.tel == '') {
        //如果微信端，有开公众号插件
        this.rewardinfoshow = true;
      } else if (bool) {
        this.rewardinfoshow = true;
      }
    },
    returnRes (res) {
      //砍价后结果
      // console.log("333333333333333:",res)
      this.lottery = res;
    },
    receive_isturn (val) {
      this.is_turn = val;
    },
    reveive_close () {
      this.coupon_show = false;
      // this.toBack();
    },
    closeImg (i) {
      this.pic.splice(i, 1);
    },
    sunForm () {
      var that = this;
      that.$dialog.confirm({
        title: "提示",
        message: "是否提交？"
      }).then(() => {
        var params = {};
        params = that.form;
        params.id = that.$route.query.id || "";
        params.pic = that.pic.join("@") || '';
        that.$api.getShop.addReview(params).then(res => {
          if (res.code == 200) {
            that.$toast.success("评价成功");
            setTimeout(() => {
              if (this.is_turn) {
                this.turn_show = true;
              } else if (this.is_turn == false && 
                (typeof res.result) == 'object' &&
                res.result &&
                res.result.length > 0) {
                this.coupon_list = res.result;
                this.coupon_show = true;
              } else {
                this.$router.push("/order/orderlist")
              }
            }, 1500);

          }
        })
      })


    },
    getInfo () {
      var params = {};
      params.id = this.$route.query.id || "";
      this.$api.getShop.getInfo(params).then(res => {
        if (res.code == 200) {
          this.info = res.result;
          if (res.result.is_review == 1) {
            this.form.content = res.result.review.content;
            this.form = res.result.review;
            // this.pic=res.result.review.piclink;
            res.result.review.is_pic == 1 ? this.pic = res.result.review.piclink : this.pic = [];
          }
        }
      });
    },
    afterRead (file) {
      var that = this;
      exif.imageListConvert([file.file], function (res) {
        that.pic.push(res);
      });
    },
  }
};
</script>



<style lang="less" scoped>
.review_p {
  font-size: 14px;
  padding: 4px 0 20px 0;
  margin-left: 12px;
  color: #8b8b8b;
}
.review_btn {
  position: fixed;
  width: 100%;
  padding: 0 12px 12px;
  height: 50px;
  bottom: 10px;
  > button {
    color: #fff;
    background: linear-gradient(45deg, #ff9700, #ed1c24);
  }
}
.conm1 {
  justify-content: flex-start;
  flex-wrap: wrap;
}
.pay_con {
  // padding: 12px;
  background: #f5f5f5;
  overflow: hidden;
  .navbar {
    position: fixed;
    top: 0;
    width: 100%;
  }
  > div.pay_con_d {
    // margin: 12px 0;
    background: #fff;
    height: 100%;
    padding-top: 45px;
  }
}
.up_inp_refund {
  width: 84px;
  height: 84px;
  border: 1px dashed #8b8b8b;
  color: #929292;
  text-align: center;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  > i {
    display: block;
    text-align: center;
  }
  > p {
    line-height: 1.4;
  }
}
.review_msg {
  min-height: 180px;
  background: #fafafa;
  padding: 12px;
  margin: 0 12px;
  .van-cell-group {
    background: #fafafa;
  }
  .textarcy {
    margin-bottom: 30px;
    background: #fafafa;
    // padding: 0.2667rem 0rem;
    padding: 0;
  }
  .textarcy .van-field__label {
    width: auto;
    padding: 0 10px;
  }
}
.review_rate {
  margin: 20px 0 10px 0;
  text-align: center;
  > p {
    font-size: 18px;
    color: #ccc;
  }
}
.box_img {
  background: #fff;
  padding: 0.26667rem 0.4rem 25px;
  > p {
    font-weight: bold;
    line-height: 0.64rem;
    margin-bottom: 10px;
  }
}
.box_img_img {
  display: inline-block;
  vertical-align: bottom;
  margin: 0 5px 5px 0;
  position: relative;
  > span {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ff2f57;
  }
}
.review_card {
  padding: 12px !important;
}
</style>
