<template>
  <div class="reservetime">
    <van-nav-bar title="选择到店时间" left-text left-arrow class="navbar" @click-left="close" />
    <van-tabs v-model="active" background="#F1F1F1">
      <van-tab v-for="(day,d) in preDayList" :key="day" :title="day">
        <div class="restime_con" v-for="(time,index) in time_list" :key="index">
          <p>
            {{time.label}}
            <span
              v-if="disableList[d] && disableList[d][index] && Object.keys(disableList[d][index]).length == time.data.length "
            >(该时段已满)</span>
          </p>
          <div v-if="JSON.stringify(time.data)!='[]'">
            <ul>
              <li v-for="(time,i) in time.data" :key="i">
                <div
                  v-if="disableList[d] && disableList[d][index] && disableList[d][index][time] || disableTime > time"
                  class="disable"
                >{{time}}</div>
                <div
                  v-else
                  @click="setTime(d,time)"
                  :class="{active:shopPreInfo.time==time && shopPreInfo.day == d}"
                >{{time}}</div>
              </li>
            </ul>
          </div>
          <div v-else>
            <p>该时段暂无可预约时间</p>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <div class="restime_btn">
      <van-cell
        title-class="van_cell_tit"
        label-class="van_cell_lab"
        center
        :title="storeInfo.title"
        label="若无合适时间，可以切换门店看看哦~"
        icon="location-o"
        is-link
        :border="false"
        @click="goStore"
      ></van-cell>
      <van-button class="btn_team" type="default" @click="addTime">确定</van-button>
    </div>
  </div>
</template>

<script>
import { parse } from "path";
export default {
  components: {},
  data() {
    return {
      active: 0,
      today: parseInt(new Date(new Date().toDateString()).getTime() / 1000),
      preDayList: {},
      allTimeList: {
        morning: {
          label: "上午时段",
          data: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"]
        },
        afternoon: {
          label: "下午时段",
          data: [
            "12:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30"
          ]
        },
        night: {
          label: "晚上时段",
          data: [
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
            "21:00",
            "21:30",
            "22:00"
          ]
        }
      },
      shopPreInfo: {
        day: 0,
        time: ""
      },
      time_list: {},
      disableList: {},
      disableTime: this.$fnc.getTimeFormat(
        parseInt(new Date().getTime() / 1000),
        1
      )
    };
  },
  props: {
    storeInfo: {
      type: Object,
      default: () => ({})
    },
    shopInfo: {
      type: Object,
      default: () => ({})
    }
  },
  created() {
    for (var i = 0; i < 7; i++) {
      if (i == 0) {
        this.preDayList[i] = "今天";
      } else if (i == 1) {
        this.preDayList[i] = "明天";
      } else {
        this.preDayList[i] = this.$fnc.getTimeFormat(
          this.today + 86400 * i,
          "md"
        );
      }
    }
  },
  mounted() {
    this.getTimeList();
  },
  methods: {
    goStore() {
      this.$emit("closeTime",true);
    },
    close() {
      this.$emit("closeTime");
    },
    setTime(day, time) {
      this.shopPreInfo.day = day;
      this.shopPreInfo.time = time;
    },
    getTimeList() {
      this.shopPreInfo = {
        day: 0,
        time: ""
      };
      this.time_list = this.allTimeList;
      if (this.storeInfo.reserve_time != null && this.storeInfo.reserve_time !="") {
        var reserve_time = JSON.parse(this.storeInfo.reserve_time);
        for (let i in this.time_list) {
          this.time_list[i]["data"] = reserve_time[i];
        }
      }

      var params = {};
      params.id = this.storeInfo.id;
      params.pid = this.shopInfo.id;
      this.$api.getShop.reserve_store_times(params).then(res => {
        if (res.code == 200) {
          this.disableList = res.result;
        }
      });
    },
    addTime() {
      var time = this.dateToTime(this.shopPreInfo);
      if (time == false) {
        this.$toast.fail("请选择到店时间");
      } else {
        this.$emit("setTime", time);
        this.$emit("closeTime");
      }
    },
    dateToTime(val) {
      var preTime = 0;
      if (val.time == "") {
        return false;
      }
      if (val.day == 0) {
        preTime = this.today;
      } else {
        preTime = this.today + 86400 * val.day;
      }
      var arr = val.time.split(":");
      preTime = preTime + arr[0] * 3600 + arr[1] * 60;
      return preTime;
    }
  },
  watch: {
    storeInfo() {
      this.getTimeList();
    }
  }
};
</script>
<style lang="less" scoped>
.van_cell_tit {
  font-size: 18px;
  font-weight: bold;
}
.van_cell_lab {
  font-size: 12px;
  font-weight: normal;
}
.restime_btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 1;
  background: #fff;
  flex-wrap: wrap;
  padding: 10px 0;
  .btn_team {
    width: 340px;
    height: 46px;
    line-height: 46px;
    display: block;
    margin: 0 auto;
    background: linear-gradient(to right top, #f2140c, #f34a0c);
    color: #fff;
    border-radius: 27px;
    margin-top: 10px;
  }
}
.reservetime {
  height: 100%;
  overflow: auto;
  padding-bottom: 51px;
  position: relative;
  padding-bottom: 150px;
  .restime_con {
    padding: 20px 15px 10px;
    > p {
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 10px;
      > span {
        font-size: 13px;
        color: #818181;
        font-weight: normal;
      }
    }
    > div {
      background: #f1f1f1;
      border-radius: 5px;
      // padding: 10px;
      > ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        > li {
          width: 25%;
          font-size: 14px;
          // color: #818181;
          text-align: center;
          > div {
            width: 100%;
            padding: 10px;
          }
          > div.active {
            color: #f2140c;
          }
          > div.disable {
            color: #d3d3d4;
          }
        }
      }
      > p {
        font-size: 14px;
        text-align: center;
        padding: 10px;
      }
    }
  }
}
</style>
