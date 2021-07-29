<template>
  <van-popup
    v-model="pop_show"
    position="bottom"
    class="sel_time"
    get-container="body"
    :close-on-click-overlay="false"
    round
  >
    <div class="sel_time_con">
      <van-icon name="cross" size="20" @click="colsePop" />
      <p class="sel_time_title">{{ title }}</p>
      <p class="sel_time_desc">{{ desc }}</p>
      <van-picker
        id="picker-sel-time"
        ref="selTime"
        :columns="columns"
        @change="selTime"
      />
      <van-button block @click="subBtn" :color="btnColor ? btnColor : ''">
        确定
      </van-button>
    </div>
  </van-popup>
</template>

<script>
import { Picker } from "vant";
export default {
  data() {
    return {
      pop_show: false,
      time: 0,
      weeks: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ],
      minList: [
        {
          text: "00分",
          values: 0,
        },
        {
          text: "10分",
          values: 10,
        },
        {
          text: "20分",
          values: 20,
        },
        {
          text: "30分",
          values: 30,
        },
        {
          text: "40分",
          values: 40,
        },
        {
          text: "50分",
          values: 50,
        },
      ],
    };
  },
  props: {
    //显示
    show: {
      type: Boolean,
      default: false,
    },
    //标题
    title: {
      type: String,
      default: "",
    },
    //副标题
    desc: {
      type: String,
      default: "",
    },
    //按钮颜色
    btnColor: {
      type: String,
      default: "",
    },
    //显示多少天内的日期
    day: {
      type: Number,
      default: 7,
    },
  },
  computed: {
    columns() {
      var dateArray = []; //父类
      var myDate = new Date(); //当前时间
      var myTime = parseInt(
        new Date(new Date().toLocaleDateString()).getTime() / 1000
      ); //当前零点时间戳
      var dateTemp; //日期
      var timeTemp; //时间戳
      for (let i = 0; i < this.day; i++) {
        var childArray = []; //子类
        if (i == 0) {
          //当天
          dateTemp =
            myDate.getMonth() + 1 + "月" + myDate.getDate() + "日 今天";
          let t = Number(myDate.getHours()) || 0; //当前小时
          let m = Number(myDate.getMinutes()) || 0; //当前分钟
          let minArr = [];
          for (let min of this.minList) {
            //选取大于当前分钟的分钟
            if (min.values > m) {
              minArr.push(min);
            }
          }
          if (minArr.length > 0) {
            //有子分钟则添加
            childArray.push({
              text: t >= 10 ? t + "点" : "0" + t + "点",
              values: t,
              children: minArr,
              className: "pickerWidth",
            });
          }
          for (t = t + 1; t < 24; t++) {
            childArray.push({
              text: t >= 10 ? t + "点" : "0" + t + "点",
              values: t,
              children: this.minList,
              className: "pickerWidth",
            });
          }
        } else {
          dateTemp =
            myDate.getMonth() +
            1 +
            "月" +
            myDate.getDate() +
            "日 " +
            this.weeks[myDate.getDay()];
          for (let t = 0; t < 24; t++) {
            childArray.push({
              text: t >= 10 ? t + "点" : "0" + t + "点",
              values: t,
              children: this.minList,
              className: "pickerWidth",
            });
          }
        }
        if (childArray.length > 0) {
          //有子类时间则添加
          dateArray.push({
            text: dateTemp,
            values: myTime,
            children: childArray,
            className: "pickerWidth",
          });
        }
        //获取下一个日期
        myDate.setDate(myDate.getDate() + 1);
        myTime = parseInt(
          new Date(myDate.toLocaleDateString()).getTime() / 1000
        );
      }
      return dateArray;
    },
  },
  watch: {
    show(val) {
      this.pop_show = val;
    },
  },
  components: {
    [Picker.name]: Picker,
  },
  created() {},
  mounted() {},
  methods: {
    colsePop() {
      this.$emit("colsePop");
    },
    subBtn() {
      if (this.time > 0) {
        this.$emit("setTime", this.time);
      } else {
        let data = this.$refs.selTime.getValues();
        if (data[0] && data[1] && data[2]) {
          this.time =
            data[0].values + 3600 * data[1].values + data[2].values * 60;
          this.$emit("setTime", this.time);
        } else {
          this.$toast.fail("出错啦,请重新选择");
        }
      }
    },
    selTime(picker, values, index) {
      let data = picker.getValues();
      if (data[0] && data[1] && data[2]) {
        this.time =
          data[0].values + 3600 * data[1].values + data[2].values * 60;
      } else {
        this.$toast.fail("出错啦,请重新选择");
      }
    },
  },
};
</script>

<style scoped lang='less'>
.sel_time {
  width: 100%;
  max-height: 60%;
  font-size: 14px;
  .sel_time_con {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 30px 26px 16px;
    .sel_time_title {
      width: 100%;
      font-size: 17px;
      font-weight: bold;
    }
    .sel_time_desc {
      width: 100%;
      font-size: 12px;
      color: #999999;
    }
    .van-picker {
      margin: 10px auto;
    }

    > .van-button {
      width: 100%;
      margin: 20px auto 10px;
      height: 45px;
      background: linear-gradient(180deg, #3bb2f4, #3298f3);
      border-radius: 5px;
      border: none;
      font-size: 15px;
      color: #ffffff;
    }

    > .van-icon {
      position: absolute;
      top: 16px;
      right: 16px;
      font-weight: bold;
    }
  }
}
</style>