<template>
  <!-- <transition name="fade"> -->
  <van-popup v-model="dialogTableVisible" :duration="0.5" :lock-scroll="true" get-container="body" style="    width: 82.5%;" transition="fade"
      :close-on-click-overlay="true">
    <div class="coupon_box" @close="closeDio">
      <div class="coupon_bj">
        <img src="./../../../assets/img/home/coupon/head.png" style="    position: relative;
    z-index: 3;" alt />
        <img class="coupon_bj-head" src="./../../../assets/img/home/coupon/new-coupon-bf.png" alt />
      </div>
      <div class="coupon_content">
        <div class="coupon_title">
          <div class="tc">
            <img class="coupon_title-hg" src="./../../../assets/img/home/coupon/hg.png" alt />
          </div>
          <div class="coupon_title">
            <p>送你{{coupon_type}}</p>
            <p>{{price || 0 }}元大放送</p>
          </div>
          <div class="coupon_body">
            <div class="coupon_item" v-for="(item,i) in da" :key="i" @click="toDetails">
              <div class="coupon_item_bj">
                <img src="./../../../assets/img/home/coupon/line.png" alt />
              </div>
              <div class="coupon_item_content">
                <div class="coupon_item_content_left">
                  <p>{{parseFloat(item.money)}}</p>
                </div>
                <div class="coupon_item_content_right">
                  <p>元优惠券</p>
                  <p>满{{item.xfm}}元可使用</p>
                  <p>
                    <span>{{$fnc.getMonthAndDay(new Date().getTime(),true)}} 至 {{$fnc.getMonthAndDay(item.end_time,true)}}</span>
                  </p>
                </div>
                <div class="new_coupon_item_content_right">
                  立即
                  <br />使用
                  <br />
                  <van-icon name="arrow-down" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="coupon_go" @click="$router.push({path:'/shop/shopcoupon'})"></div> -->
      <div class="coupon_close" @click="closeDio">
        <div>立即领取</div>
      </div>
    </div>
  </van-popup>
  <!-- </transition> -->
</template>

<script>
export default {
  name: "coupon",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    da: {
      type: Array,
      default: []
    },
    coupon_type: {
      type: String,
      default: "优惠券"
    }
  },
  data () {
    return {
      title: "优惠券",
      price: "",
      coupon_list: [
        {
          money: "",
          desc: "",
          xfm: "",
          end_time: ""
        }
      ],
      dialogTableVisible: false
    };
  },
  methods: {
    toDetails () {
      this.$emit("close_coupon");
      this.dialogTableVisible = false;
      this.$router.push({ path: "/shop/shopcoupon" });
    },
    closeDio () {
      this.$emit("close_coupon");
      this.dialogTableVisible = false;
    }
  },
  watch: {
    show (val1, val2) {
      if (val1 == val2) {
        return;
      }
      this.dialogTableVisible = val1;
    },
    da (val1, val2) {
      this.coupon_list = val1;

      var price = 0;
      // for (var key in this.coupon_list) {
      //     price = parseFloat(this.coupon_list[key].money) + price;
      // }
      this.coupon_list.forEach(item => {
        console.log(item);
        price = parseFloat(item.money) + price;
      });
      this.price = price;
    }
  }
};
</script>

<style scoped>
.coupon_bj-head {
  margin-top: -56px;
  position: relative;
  z-index: 2;
}
.coupon_title-hg {
  width: 50px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s linear;
  /*transform: translate3D(0,0,0);*/
}
.fade-enter,
.fade-leave-to {
  transform: translate3D(-50%, -100%, 0);
  /*transform: translateX(10px);*/
}

.coupon_box {
  width: 100%;
  margin: 0 auto;
  position: relative;
}
.coupon_bj {
  width: 100%;
  position: relative;
  z-index: 1;
}
.coupon_bj img {
  width: 100%;
}
.coupon_content {
  width: 100%;
  position: absolute;
  top: 35px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 4;
  padding: 0 18px 0 24px;
}

.coupon_title > p:nth-of-type(1) {
  text-align: center;
  font-size: 25px;
  font-weight: 300;
  letter-spacing: 2px;
  line-height: 36px;
  color: #ffcf8f;
}
.coupon_title > p:nth-of-type(2) {
  font-size: 28px;
  font-weight: 300;

  text-align: center;

  line-height: 28px;
  color: #ffcf8f;
  letter-spacing: 2px;
}
.coupon_body {
  height: 305px;
  margin-top: 17px;
  overflow: auto;
  padding-bottom: 38px;
}
.coupon_item {
  /* width: 298px; */
  height: 75px;
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
  /* padding: 0 10px; */
}
.coupon_item_bj {
  width: 100%;
}
.coupon_item_bj img {
  width: 100%;
}
.coupon_item_content {
  width: 100%;
  position: absolute;
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
.coupon_item_content_left {
  width: 73.5px;
  padding-left: 4px;
}
.coupon_item_content_left p {
  font-size: 38px;
  color: #f9163c;
  text-align: center;
  font-weight: bold;
  height: 54px;
  border-right: 1px dashed #ff7a89;
  line-height: 54px;
}
.coupon_item_content_left p span {
  font-size: 14px;
  color: #333333;
  font-weight: normal;
}
.coupon_item_content_right {
  width: 149.5px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: left;
  padding-left: 15px;
}
.coupon_item_content_right p {
  width: 100%;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.coupon_item_content_right p:nth-of-type(1),
.coupon_item_content_right p:nth-of-type(2) {
  font-size: 15px;
  line-height: 1.3;
  font-weight: bold;
  color: #fc1f1f;
  width: 110px;
  border-bottom: 1px solid #fda2b1;
}
.coupon_item_content_right p:nth-of-type(2) {
  /* border-top: 1px solid #fda2b1; */
}

.coupon_item_content_right p:nth-of-type(3) {
  font-size: 12px;
  color: #a7a7a7;
  font-weight: bold;
}
.new_coupon_item_content_right {
  width: 75px;
  padding-left: 10px;
  font-size: 15px;
  line-height: 1.4;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #d01034;
  font-weight: bold;
  padding-top: 10px;
}
.coupon_close {
  width: 100%;
  height: 90px;
  z-index: 10;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: url("../../../assets/img/home/coupon/a90f7616e537516ef74b1dda1230448.png")
    no-repeat;
  background-size: 100% 100%;
  padding-top: 15px;
  display: flex;
  align-items: center;
}
.coupon_close > div {
  width: 262px;
  margin: auto;
  background: linear-gradient(to bottom, #fbf2c8, #fddf99);
  border-radius: 14px;
  font-size: 17px;
  height: 35px;
  text-align: center;
  color: #a86421;
  display: flex;
  justify-content: center;
  align-items: center;
}
.coupon_go {
  width: 100px;
  height: 30px;
  z-index: 10;
  position: absolute;
  bottom: 70px;
  left: 0;
  right: 0;
  margin: auto;
}
</style>