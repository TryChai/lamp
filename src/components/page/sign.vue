<template>
  <div class="page_sign" style="background-color: #f4f4f4;height: 100%;">
    <van-nav-bar title="日行一善" @click-left="toBack" left-arrow />
    <!-- <div class="page_sign_bg">
      <div class="fx page_sign_nav">
        <span>
          <van-icon name="arrow-left" @click="toBack" />
        </span>
        <span>日行一善</span>
        <span></span>
      </div>

      <div class="fx page_sign_top">
        <img
          :src="
            $fnc.getImgUrl(
              $store.state.user.avatar ||
                require('@/assets/img/member/sex1.png')
            )
          "
        />
        <p class="fx">
          <span>连续签到可享受更多奖励</span>
          <span>明日签到可获得多重奖励</span>
        </p>
        <p class="fx">
          <span class="price_regular">
            <b>{{ $fnc.toFixedZ(balance) }}</b>
            <small>积分</small>
          </span>
          <span @click="$router.push({ path: '/shop/shopcoupon?active=2' })"
            >立即兑换</span
          >
        </p>
      </div>
    </div> -->
    <div class="sign_top">
      <div class="top_bj">
        <img src="./../../assets/img/home/sign_topbj2.jpg" alt />
      </div>
      <div class="top_content">
        <!-- <span class="fx" @click="$router.push({ path: '/shop/shopcoupon?active=2' })">兑换<van-icon name="arrow" /></span> -->
        <p>我的功德值</p>
        <p>{{ $fnc.toFixedZ(balance) }}</p>
        <div class="top_btn fx">签到领功德值</div>
        <p class="fx">
          <van-icon name="clock-o" />
          距离下次签到:{{ hour }}:{{ min }}:{{ sec }}
        </p>
      </div>
      <div class="dailyKindness">
        <div class="sign_in_card">
          <p class="sign_in_card_title">日行一善</p>
          <p class="sign_in_card_tip">签到领功德值</p>
          <div class="sign_in_detail">
            <div
              class="will_sidn_in"
              :class="{
                is_sign_in: item.is_sign == 1,
                no_sign_in: no_sign_in != 1,
              }"
              v-for="(item, i) in sign_list"
              :key="i"
            >
              <div class="num">
                <p v-if="item.is_sign == 1"></p>
                <p v-else>+{{ item.jf }}</p>
              </div>
              <p>{{ item.stage | time_change }}</p>
            </div>
          </div>
          <div class="fx qiandao_btn">
            <p @click="sign_btn" v-if="is_sign == false">
              今日签到可获得多重奖励
            </p>
            <p @click="sign_btn" v-if="is_sign == true">已签到</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import integralItem from "./integral_shop_item.vue";
import { List } from "vant";
export default {
  data() {
    return {
      send_type: {
        value: "",
        label: "",
      },
      task_list: [],
      send_balance: 0,
      balance: 0, //积分
      sign_list: [],
      is_sign: false, //今天是否签到
      sign_success: false,
      is_sign_remind: 0,
      is_sign_warn: 0,
      hour: "",
      min: "",
      sec: "",
      dataList: [],
      loading: false,
      finished: false,
      page: 1,
      page_size: 10,
      is_sign_in: 0,
      no_sign_in: 1,
      weeklist: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    };
  },
  components: {
    integralItem,
    [List.name]: List,
  },
  created() {
    this.get_time();
    this.flag_is_day_sign(); //判断当天是否有签到
    this.flag_is_sign_wark(); //判断用户是否由签到提醒
    this.get_sign_list(); //取得签到记录
    this.get_task_list(); //获取任务列表
  },
  methods: {
    onLoad() {
      this.loading = true;
      var params = {};
      params.page = this.page;
      params.page_size = this.page_size;
      this.$api.getPage.integralGoods(params).then((res) => {
        if (res.code == 200) {
          if (this.page === 1) this.dataList = [];
          let arr = res.result;
          this.dataList = this.dataList.concat(arr);
          if (res.result && res.result.length == this.page_size) {
            this.page++;
          } else {
            this.finished = true;
          }
          setTimeout(() => {
            this.loading = false;
          }, 3000);
        }
      });
    },
    get_task_list() {
      this.$api.getPage.get_task({}).then((res) => {
        if (res.code == 200) {
          for (var i in res.result) {
            if (res.result[i].iden == "wcgrzl") {
              res.result[i].link = "/setting/myinfo";
              this.task_list.push(res.result[i]);
            }
            if (res.result[i].iden == "wcsmrz") {
              res.result[i].link = "/setting/realname";
              if (this.$store.state.config.plugin.gasmrz.is_open == 1) {
                this.task_list.push(res.result[i]);
              }
            }
            if (res.result[i].iden == "fxyghy") {
              res.result[i].link = "/member/ewm";
              this.task_list.push(res.result[i]);
            }
            if (res.result[i].iden == "fxypwz") {
              res.result[i].link = "/news";
              this.task_list.push(res.result[i]);
            }
            if (res.result[i].iden == "scyjsp") {
              res.result[i].link = "/shop/shopsearch?cate_id=0";
              this.task_list.push(res.result[i]);
            }
            if (res.result[i].iden == "yhydycnt") {
              res.result[i].link = "/im/imindex";
              if (this.$store.state.config.plugin.imhyjsnt.is_open == 1) {
                this.task_list.push(res.result[i]);
              }
            }
            if (res.result[i].iden == "pjycsp") {
              res.result[i].link = "/order/orderlist?status=待评价";
              this.task_list.push(res.result[i]);
            }

            if (res.result[i].iden == "wcycgwty") {
              res.result[i].link = "/shop/shopsearch?cate_id=0";
              this.task_list.push(res.result[i]);
            }
            if (res.result[i].iden == "cyycnts") {
              res.result[i].link = "/im/imindex?active=clan";
              if (this.$store.state.config.plugin.ltskt.is_open == 1) {
                this.task_list.push(res.result[i]);
              }
            }
            if (res.result[i].iden == "sqyctqyj") {
              res.result[i].link = "/pay/withdraw";
              this.task_list.push(res.result[i]);
            }
          }
        }
      });
    },
    get_sign_list() {
      this.$api.getPage.get_sign_week({}).then((res) => {
        if (res.code == 200) {
          this.sign_list = res.result.res;
          this.send_type = res.result.type;
          let val = this.send_type.value;
          this.$api.getUser.getUserInfo({}).then((res) => {
            if (res.code == 200) {
              this.balance = res.result[val];
            }
          });
        } else if (res.code == 400) {
          setTimeout(() => {
            this.$toast.fail("功能暂时未开放", 1000);
          }, 200);
          setTimeout(() => {
            this.$router.push({
              path: "/page/vip",
              query: {
                iden: "home",
              },
            });
          }, 1500);
        }
      });
    },
    sign_warn_change() {
      //签到提醒值改变
      var params = {};
      this.is_sign_warn == 1 ? (params["remark"] = 1) : (params["remark"] = 0);
      this.$api.getPage.sign_warn_remark(params).then((res) => {});
    },
    flag_is_sign_wark() {
      //判断是否有签到提醒
      this.$api.getPage.sign_warn({}).then((res) => {
        if (res.code == 200) {
          this.is_sign_warn = res.result.is_remark;
          this.is_sign_remind = res.result.is_sign_remind;
        }
      });
    },
    flag_is_day_sign() {
      //判断是否签到
      this.$api.getPage.is_day_sign({}).then((res) => {
        if (res.code == 200) {
          this.is_sign = res.result;
        }
      });
    },
    off_sign_popup() {
      this.sign_success = false;
    },
    sign_btn() {
      //签到按钮
      this.$api.getPage.is_day_sign({}).then((res) => {
        if (res.code == 200) {
          if (res.result == true) {
            //已签到
            this.$toast.fail("已签到", 1000);
          } else {
            //未签到
            this.$api.getPage.phone_sign({}).then((res) => {
              if (res.code == 200) {
                this.send_balance = res.result;
                this.is_sign = true;
                this.sign_success = true;
                this.get_sign_list();
              }
            });
          }
        }
      });
    },
    addNumber(num) {
      var num = num > 9 ? num : "0" + num;
      return num;
    },
    get_time() {
      var that = this;
      var endYear = new Date().getFullYear();
      var endMonth = new Date().getMonth() + 1;
      var endDay = new Date().getDate();
      var endTime = new Date(endYear, endMonth, endDay);
      var leftDiv = function () {
        var leftTime = endTime - new Date().getTime();
        var leftHours = that.addNumber(
          Math.floor((leftTime / 1000 / 60 / 60) % 24)
        );
        var leftMinutes = that.addNumber(
          Math.floor((leftTime / 1000 / 60) % 60)
        );
        var leftSeconds = that.addNumber(Math.floor((leftTime / 1000) % 60));
        that.hour = leftHours;
        that.min = leftMinutes;
        that.sec = leftSeconds;
        if (leftTime > 0) {
          setTimeout(function () {
            leftDiv();
          }, 500);
        } else {
          clearTimeout(leftDiv());
        }
      };
      leftDiv();
    },
  },
  filters: {
    time_change(time) {
      time = time.slice(4);
      return time.slice(0, 2) + "." + time.slice(2);
    },
  },
};
</script>
<style lang="less" scoped>
.dailyKindness {
  height: 100%;
  padding-top: 10px;
  top: 270px;
  width: 100%;
  position: absolute;
  .sign_in_card {
    margin: 10px;
    margin-top: 0;
    background-color: #fff;
    border-radius: 10px;
    padding: 13px 10px 26px 10px;
    .sign_in_card_title {
      font-size: 17px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      color: #ff2d23;
      line-height: 18px;
      text-align: center;
    }
    .sign_in_card_tip {
      margin-top: 18px;
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      color: #333333;
      line-height: 16px;
    }
    .sign_in_detail {
      margin-top: 17px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .will_sidn_in {
        width: 41px;
        height: 55px;
        opacity: 1;
        background: #f5f5f5;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .num {
          margin-top: 7px;
          width: 25px;
          height: 25px;
          opacity: 1;
          background: #e6e6e6;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          > p {
            font-size: 10px;
            font-family: Arial-BoldMT;
            text-align: center;
            color: #333333;
            line-height: 12px;
          }
        }
        > p {
          margin-top: auto;
          margin-bottom: 6px;
          font-size: 11px;
          font-family: SourceHanSansCN-Regular;
          text-align: center;
          color: #888888;
          line-height: 11px;
        }
      }
      .is_sign_in {
        background: linear-gradient(310deg, #ff2d23 4%, #ff6102 96%);
        box-shadow: 0 3px 1px 1px #ffada9;
        .num {
          background-color: #fced4f;
          position: relative;
          box-shadow: 1px 1px 0 1px #f5a914;
          > p {
            color: #ff8900;
          }
        }

        .num::before {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          opacity: 1;
          border: 1px solid #ffba31;
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        > p {
          color: #ffffff;
        }
      }
      .no_sign_in {
        background: linear-gradient(310deg, #ff2d23 4%, #ff6102 96%);
        box-shadow: 0 3px 1px 1px #ffada9;
        .num {
          background-color: #fff3c6;
          position: relative;
          box-shadow: 1px 1px 0 1px #f3ca7a;
          > p {
            color: #ff8900;
          }
        }
        .num::before {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          opacity: 1;
          border: 1px solid #ffba31;
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        > p {
          color: #ffffff;
        }
      }
    }
  }
}

.qiandao_btn {
  padding: 10px 0;
  justify-content: center;

  > p {
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    width: 200px;
    line-height: 35px;
    border-radius: 20px;
    background-color: #ffaa01;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.16);
  }
}
.sign_top {
  width: 100%;
  position: relative;
}
.top_bj {
  width: 100%;
}
.top_bj img {
  width: 100%;
}
.top_content {
  width: 92.5%;
  height: 190px;
  position: absolute;
  z-index: 1;
  top: 85px;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.top_content span {
  font-size: 12px;
  color: #ffffff;
  background-color: #ff2d23;
  border-radius: 10px;
  border: none;
  padding: 3px 10px;
  float: right;
  align-self: flex-end;
  margin-right: 10px;
}
.top_content p:nth-of-type(1) {
  /*我的积分*/
  font-size: 20px;
  letter-spacing: 2px;
  line-height: 26px;
  font-weight: 400;
  color: #ff2d23;
}
.top_content h1 {
  /*积分数额*/
}
.top_content p:nth-of-type(2) {
  font-size: 50px;
  font-weight: bold;
  color: #ff2d23;
  line-height: 58px;
}
.top_content > .top_btn {
  /*签到按钮*/
  width: 210px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./../../assets/img/home/sign_btn.png") no-repeat top left /
    100% 100%;
  font-size: 16px;
  color: #ff2d23;
  font-weight: 400;
}
.top_content p:nth-of-type(3) {
  /*距离下次签到时间*/
  font-size: 14px;
  letter-spacing: 1px;
  color: #ffffff;
  padding: 0px 10px;
  background-color: #ff2d23;
  border-radius: 20px;
  margin: 10px 0;
}
/deep/.van-nav-bar .van-icon {
  color: #323232;
}
</style>
