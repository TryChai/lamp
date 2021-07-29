<template>
  <!-- <transition name="fade"> -->
  <van-popup v-model="dialogTableVisible" :duration="0.5" :lock-scroll="true" style="    width: 80%;" transition='fade'
      :close-on-click-overlay="true">
    <div class="coupon_box" @close="closeDio">
      <div class="coupon_bj">
        <img src="./../../assets/img/home/coupon_notice.png" alt="">
      </div>
      <div class="coupon_content">
        <div class="coupon_title">
          <div class="coupon_title">
            <p>{{coupon_type}}</p>
            <p>{{price}}元大放送</p>
          </div>
          <div class="coupon_body">
            <div class="coupon_item" v-for="(item,i) in da" :key="i" @click="$router.push({path:'/shop/shopcoupon'})">
              <div class="coupon_item_bj">
                <img src="./../../assets/img/home/coupon_bj.png" alt="">
              </div>
              <div class="coupon_item_content">
                <div class="coupon_item_content_left">
                  <p><span>￥</span>{{parseFloat(item.money)}}
                  </p>
                </div>
                <div class="coupon_item_content_right">
                  <p>{{item.coupon_title}}<span>满{{item.xfm}}可用</span>
                  </p>
                  <p>期限:<span>{{$fnc.getMonthAndDay(new Date().getTime())}} 至 {{$fnc.getMonthAndDay(item.end_time)}}</span>
                  </p>
                  <!-- <p>{{item.desc || ""}}</p> -->
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
      <div class="coupon_go" @click="$router.push({path:'/shop/shopcoupon'})">

      </div>
      <div class="coupon_close" @click="closeDio">

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
      default: [],
    },
    coupon_type: {
      type: String,
      default: "优惠券",
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
      dialogTableVisible: false,
    }
  },
  methods: {
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
      this.coupon_list.forEach((item) => {
        console.log(item)
        price = parseFloat(item.money) + price;
      });
      this.price = price;
    },

  }
}
</script>

<style scoped>
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
}
.coupon_bj img {
  width: 100%;
}
.coupon_content {
  width: 90%;
  position: absolute;
  top: 45px;
  left: 0;
  right: 0;
  margin: auto;
}

.coupon_title > p:nth-of-type(1) {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  line-height: 36px;
  color: #333333;
}
.coupon_title > p:nth-of-type(2) {
  font-size: 19px;
  font-weight: bold;

  text-align: center;

  line-height: 28px;
  color: #fc1f1f;
  letter-spacing: 2px;
}
.coupon_body {
  height: 220px;
  margin-top: 50px;
  overflow: auto;
}
.coupon_item {
  width: 90%;
  height: 75px;
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
}
.coupon_item_bj {
  width: 100%;
}
.coupon_item_bj img {
  width: 100%;
}
.coupon_item_content {
  width: 95%;
  position: absolute;
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.coupon_item_content_left {
  width: 35%;
}
.coupon_item_content_left p {
  font-size: 28px;
  color: #333333;
  text-align: center;
  font-weight: bold;
}
.coupon_item_content_left p span {
  font-size: 14px;
  color: #333333;
  font-weight: normal;
}
.coupon_item_content_right {
  /* width: 65%; */
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
}
.coupon_item_content_right p {
  width: 100%;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.coupon_item_content_right p:nth-of-type(1) {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
}
.coupon_item_content_right p:nth-of-type(1) span {
  font-size: 12px;
  color: #fc1f1f;
  padding-left: 5px;
}
.coupon_item_content_right p:nth-of-type(2) {
  font-size: 12px;
  font-weight: bold;
  color: #333333;
}
.coupon_item_content_right p:nth-of-type(2) span {
  font-size: 12px;
  font-weight: normal;
  padding-left: 5px;
}
.coupon_item_content_right p:nth-of-type(3) {
  font-size: 12px;
  color: #333333;
  font-weight: bold;
}
.coupon_close {
  width: 35px;
  height: 35px;
  z-index: 10;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
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