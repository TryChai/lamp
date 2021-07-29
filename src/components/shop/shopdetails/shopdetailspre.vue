<template>
  <div class="pre_con">
    <div class="fx shops_info van-hairline--bottom">
      <div>
        <img @click="show_pic(shopItem.piclink)" v-lazy="shopItem.piclink" alt />
      </div>
      <div class="pre_d2">
        <p class="sp1">
          <small>￥</small>
          {{shopItem.price || shopInfo.price}}
        </p>
        <p class="sp2" v-if="shopItem.hid || shopInfo.hid">商品编号：{{shopItem.hid || shopInfo.hid}}</p>
        <p class="sp2">库存：{{shopItem.stock || shopInfo.stock}}件</p>
      </div>
      <van-icon name="close" coolr="#969799" @click="closePop" size="20px" class="close_pre" />
    </div>
    <div class="shops_d2 van-hairline--bottom">
      <van-cell-group class="shops_pre_input fx_2" :border="false">
        <van-field :border="false" label="用户名" left-icon="user-o">
          <input
            slot="input"
            class="shops_field_input"
            v-model="shopPreInfo.name"
            type="text"
            placeholder="请输入用户名"
          />
        </van-field>
        <van-field :border="false" label="电话" left-icon="phone-o">
          <input
            slot="input"
            class="shops_field_input"
            v-model="shopPreInfo.tel"
            type="text"
            placeholder="请输入电话"
          />
        </van-field>
      </van-cell-group>
    </div>
    <div class="shops_d2  van-hairline--bottom">
      <div>
        <p class="shops_d2_p">预约时间</p>
        <van-tabs
          title-active-color="#f44"
          :border="false"
          line-height="0px"
          v-model="shopPreInfo.day"
        >
          <van-tab
            title-style="padding: 0;text-align: left;margin-right: 5px;"
            v-for="(day,i) in preDayList"
            :key="i"
            :title="day"
          ></van-tab>
        </van-tabs>
        <div class="pre_time">
          <div
            class="pre_time_item"
            :class="shopPreInfo.time=='上午'?'active':''"
            @click="getPreTime('上午')"
          >
            <p class="pre_time_p1">上午</p>
            <p class="pre_time_p2">8:00-12:00</p>
          </div>
          <div
            class="pre_time_item"
            :class="shopPreInfo.time=='下午'?'active':''"
            @click="getPreTime('下午')"
          >
            <p class="pre_time_p1">下午</p>
            <p class="pre_time_p2">12:00-18:00</p>
          </div>
          <div
            class="pre_time_item"
            :class="shopPreInfo.time=='晚上'?'active':''"
            @click="getPreTime('晚上')"
          >
            <p class="pre_time_p1">晚上</p>
            <p class="pre_time_p2">18:00-21:00</p>
          </div>
        </div>
      </div>
    </div>
    <van-button class="btn_team" type="default" @click="addCart">确定</van-button>
  </div>
</template>

<script>
import { ImagePreview, Field, Grid, GridItem } from "vant";
import { setTimeout } from "timers";
export default {
  components: {
    [ImagePreview.name]: ImagePreview,
    [Field.name]: Field,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  props: {
    shopInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      today: parseInt(new Date(new Date().toDateString()).getTime() / 1000),
      shopItem: { piclink: "", iden: "" },
      preDayList: {},
      shopPreInfo: {
        day: 0,
        time: "上午"
      }
    };
  },
  created() {
    for (var i = 0; i < 7; i++) {
      this.preDayList[i] = this.$fnc.getTimeFormat(
        this.today + 86400 * i,
        "md"
      );
    }
  },
  mounted() {
    if (JSON.stringify(this.shopInfo != "{}")) {
      this.$nextTick(() => {
        this.shopItem.piclink = this.shopInfo.piclink;
      });
    }
  },
  methods: {
    show_pic(pic) {
      var arr = [];
      arr[0] = pic;
      ImagePreview(arr);
    },
    get_price() {
      if (this.shopItem.price) {
        return this.$fnc.toFixedZ(
          this.shopItem.price * this.shopInfo.discount_rob * 0.1,
          2
        );
      } else {
        return this.shopInfo.activity.limited_price;
      }
    },
    closePop() {
      this.$emit("closePopPre");
    },
    getPreTime(val) {
      this.shopPreInfo.time = val;
    },
    addCart() {
      var params = {};
      params.pid = this.shopInfo.id;
      params.mail_name = this.shopPreInfo.name;
      params.mail_tel = this.shopPreInfo.tel;
      params.reserve_time = this.dateToTime(
        this.shopPreInfo.day,
        this.shopPreInfo.time
      );
      this.$api.getOrder.order_pre_save(params).then(res => {
        if (res.code == 200) {
          this.$toast.success("预约成功");
          // this.$emit("closePopPre");
          setTimeout(() => {
            this.$router.push("/order/orderdetails?id=" + res.result);
          }, 1000);
        }
      });
    },
    dateToTime(day, time) {
      var preTime = this.today + 86400 * day;
      if (time == "晚上") {
        preTime = preTime + 18 * 60 * 60;
      } else if (time == "下午") {
        preTime = preTime + 12 * 60 * 60;
      } else {
        preTime = preTime + 8 * 60 * 60;
      }
      return preTime;
    }
  }
};
</script>


<style lang="less" scoped>
.btn_team {
  width: 340px;
  height: 46px;
  line-height: 46px;
  display: block;
  margin: 0 auto;
  background: linear-gradient(to right top, #f2140c, #f34a0c);
  color: #fff;
  border-radius: 27px;
  margin-top: 30px;
  margin-bottom: 10px;
}

.shops_pre_input {
  .van-cell {
    padding: 0 8px;
    height: 42px;
    line-height: 42px;
    border: 0.5px solid #ebedf0;
    margin-bottom: 10px;
    .shops_field_input {
      width: 100%;
      text-align: right;
      height: 42px;
      line-height: 42px;
    }
    input::-webkit-input-placeholder {
      color: #cecece;
    }
    input:-moz-placeholder {
      color: #cecece;
    }
    input::-moz-placeholder {
      color: #cecece;
    }
    input::-ms-input-placeholder {
      color: #cecece;
    }
  }
  .van-cell:last-child {
    margin-bottom: 0;
  }
}

.pre_con {
  padding: 0px 16px 10px;
  line-height: 1;
  position: relative;
  .shops_info {
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    width: 100%;
    padding: 10px 16px 10px 0;
    left: 0;
    top: 0px;
    > div:first-child {
      width: 120px;
      height: 120px;
      position: relative;
      background: #f8f8f8;
      img {
        border-radius: 10px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
      }
    }
    > div.pre_d2 {
      margin-left: 10px;
      padding-top: 20px;
      .sp1 {
        > small {
          font-size: 12px;
        }
        color: #f53f26;
        font-family: "PingFangSC-Regular";
        font-weight: bold;
        font-size: 17px;
      }
      .sp2 {
        color: #818181;
        padding-top: 10px;
        font-size: 12px;
      }
    }
    .close_pre {
      position: absolute;
      right: 0;
      top: 20px;
    }
  }
  .shops_d2 {
    padding-bottom: 10px;
    > div {
      padding-top: 12px;
      > p.shops_d2_p {
        font-size: 15px;
        color: #323233;
        padding-bottom: 10px;
        font-weight: bold;
      }
      .pre_time {
        padding-top: 10px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .pre_time_item {
          width: 30%;
          border: 1px solid #dddcdc;
          text-align: center;
          .pre_time_p1 {
            font-size: 15px;
            padding: 20px 0 5px;
          }
          .pre_time_p2 {
            font-size: 13px;
            padding: 5px 0 20px 0;
          }
        }
        .pre_time_item.active {
          border: 1px solid #f53f26;
          color: #f53f26;
        }
      }
    }
  }
}
</style>
