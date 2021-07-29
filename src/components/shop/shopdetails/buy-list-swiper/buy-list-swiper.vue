<template>
  <div class="buy-list-swiper">
    <van-swipe
      vertical
      style="height: 35px"
      :autoplay="3000"
      :touchable="false"
      :show-indicators="false"
    >
      <van-swipe-item
        v-for="(item, i) in info.order_ar"
        :key="i"
        class="buy-list-swiper-item"
      >
        <div class="fx-box">
          <div class="fx">
            <div>
              <van-image
                :src="item.avatar"
                lazy-load
                width="35"
                height="35"
                round
              >
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </div>
            <div>
              &nbsp;&nbsp;{{ item.nickname }}下了一笔订单&nbsp;在{{
                timeago(item.created_time)
              }}
            </div>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import wxTime from "../../../../utils/wxDate";
import { Image, Loading } from "vant";
export default {
  name: "buy-list-swiper",
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    time() {},
  },
  components: {
    [Image.name]: Image,
    [Loading.name]: Loading,
  },
  created() {},
  mounted() {},
  methods: {
    showtime(time) {
      if (time.length == 10) {
        time = Number(time) * 1000;
      }
      return wxTime(time, true);
    },
    timeago(dateTimeStamp) {
      var minute = 1000 * 60;
      var hour = minute * 60;
      var day = hour * 24;
      var week = day * 7;
      var halfamonth = day * 15;
      var month = day * 30;
      var now = new Date().getTime();
      var diffValue = now - dateTimeStamp * 1000;
      if (diffValue < 0) {
        return "";
      }
      var result = "";
      var minC = diffValue / minute;
      var hourC = diffValue / hour;
      var dayC = diffValue / day;
      var weekC = diffValue / week;
      var monthC = diffValue / month;
      if (monthC >= 1 && monthC <= 3) {
        result = " " + parseInt(monthC) + "月前";
      } else if (weekC >= 1 && weekC <= 3) {
        result = " " + parseInt(weekC) + "周前";
      } else if (dayC >= 1 && dayC <= 6) {
        result = " " + parseInt(dayC) + "天前";
      } else if (hourC >= 1 && hourC <= 23) {
        result = " " + parseInt(hourC) + "小时前";
      } else if (minC >= 1 && minC <= 59) {
        result = " " + parseInt(minC) + "分钟前";
      } else if (diffValue >= 0 && diffValue <= minute) {
        result = "刚刚";
      } else {
        var datetime = new Date();
        datetime.setTime(dateTimeStamp * 1000);
        var Nyear = datetime.getFullYear();
        var Nmonth =
          datetime.getMonth() + 1 < 10
            ? "0" + (datetime.getMonth() + 1)
            : datetime.getMonth() + 1;
        var Ndate =
          datetime.getDate() < 10
            ? "0" + datetime.getDate()
            : datetime.getDate();
        result = Nyear + "-" + Nmonth + "-" + Ndate;
      }
      return result;
    },
  },
};
</script>
<style lang='less' scoped>
.buy-list-swiper {
  line-height: 1;
  font-size: 14px;
  height: 35px;
  position: fixed;
  top: 70px;
  left: 2%;
  z-index: 9;

  display: inline-block;

  > div {
    position: relative;
    height: 35px;
    color: #fff;
  }

  .fx-box {
    display: inline-block;
    padding-right: 10px;
    background: #666666;
    opacity: 0.8;
    border-radius: 27px;
    padding-right: 10px;
    height: 35px;
    overflow: hidden;
  }

  .fx {
    justify-content: flex-start;
  }

  .buy-list-swiper-item {
    width: 100% !important;
  }
}
</style>
