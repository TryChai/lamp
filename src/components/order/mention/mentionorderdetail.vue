<template>
  <div class="mention_orderdetail">
    <div class="mention_top">
      <span>{{receivetype}}</span>
      <div>
        <!-- <span>取消订单</span> -->
        <span @click="$router.push('/')">再去逛逛</span>
      </div>
    </div>
    <p>最早取货时间{{$fnc.getMonthAndDay(receive)}}</p>
    <div class="mention_body">
      <p>{{info.lifting.title}}</p>
      <p>{{info.lifting.province+info.lifting.city+info.lifting.area+info.lifting.add}}</p>
      <div>
        <span @click="$fnc.tel(info.lifting.tel)">
          <van-icon name="phone-o" color="#4b4b4b" />联系门店</span>
        <span @click="toDh(info.lifting.latitude,info.lifting.longitude)">
          <van-icon name="location" color="#a354ff" />使用导航
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "mentionorderdetail",
  data () {
    return {
    };
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
  },
  components: {
  },
  computed: {

    //当前显示的取货状态
    receivetype () {
      var now = this.$fnc.getMonthAndDay(Date.parse(new Date()));
      var receive = this.$fnc.getMonthAndDay(Number(this.info.pay_time) + 86400);
      if (now != receive) {
        return '今日可取'
      } else {
        return '明日可领取'
      }
    },
    receive () {
      var newtime = Number(this.info.pay_time) + 86400;
      console.log(newtime)
      return newtime
    },
  },

  methods: {
    toDh (latitude, longitude) {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == "ykapp") {
        this.isApp = true; //第二个app
      }
      var that = this;
      if (that.isApp) {
        try {
          that.$fnc.appNav(latitude, longitude);
        } catch (error) {
          that.$toast.fail("App地图跳转失败");
        }
      } else if (that.$fnc.isWx()) {
        var obj = {};
        obj.latitude = parseFloat(latitude);
        obj.longitude = parseFloat(longitude);
        obj.name = that.info.lifting.title;
        obj.address =
          that.info.lifting.province +
          that.info.lifting.city +
          that.info.lifting.area +
          that.info.lifting.town +
          that.info.lifting.add;
        obj.scale = 14;
        obj.infoUrl = window.location.href;
        this.wxApi.ToLocation(obj);
      } else {
        this.$toast("请在微信或者app打开");
      }
    },
  },
}
</script>
<style lang="less" scoped>
.mention_orderdetail {
  width: 100%;
  background-color: #a14efe;
  font-size: 12px;
  padding: 15px 16px;
  .mention_top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > span {
      font-size: 16px;
      color: #fdd500;
      font-weight: bold;
    }
    > div {
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      > span {
        width: 73px;
        height: 27px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        color: #3e3c3d;
        border-radius: 25px;
        margin-left: 10px;
      }
      > span:nth-of-type(1) {
        background-color: #ffffff;
      }
      > span:nth-of-type(1) {
        background-color: #fbd206;
      }
    }
  }
  > p {
    line-height: 30px;
    font-size: 12px;
    color: #facfff;
  }
  .mention_body {
    width: 100%;
    background-color: #ffffff;
    border-radius: 5px;
    padding: 10px;
    > p:nth-of-type(1) {
      font-size: 15px;
      color: #333840;
      font-weight: bold;
    }
    > p:nth-of-type(2) {
      font-size: 13px;
      color: #808080;
    }
    > div {
      font-size: 14px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      line-height: 1;
      > span {
        font-size: 13px;
        padding: 6px 8px;
        color: #4d4e53;
        border: 1px solid #4d4e53;
        border-radius: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        .van-icon {
        }
      }
    }
  }
}
</style>