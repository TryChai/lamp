<template>
  <div class="turn_box">
    <van-popup v-model="pop_show" :lock-scroll="true" transition="fade" :close-on-click-overlay="true" get-container="#app"
        style="width:100%;height:100%;background-color:transparent;display:flex;justify-content:center;    align-items: center;">
      <div class="container" style="background:transparent">
        <div class="turn_close">
          <van-icon name="clear" size="40px" color="#f8b62b" @click="pop_close"></van-icon>
        </div>
        <div class="turn_top">
          <img src="./../../assets/img/home/turntable_top.png" alt="" />
        </div>
        <div class="turn">
          <div class="turn_bj">
            <img class="" :class="{ point: is_point }" ref="pointer" src="./../../assets/img/home/turntable_bj.png" alt="" />
            <div class="turn_pointer">
              <img src="./../../assets/img/home/turn_pointer.png" alt="" />
              <p @click="get_lev" v-if="start_show">开始</p>
            </div>
          </div>
        </div>
        <div class="turn_bottom">
          <img src="./../../assets/img/home/turntable_bottom.png" alt="" />

          <span v-show="num != null && num != undefined && num !=''">剩余抽奖次数：{{num}}</span>
          <div class="turn_bottom_info">
            <p class="turn_bottom_title">`活动细则`</p>
            <div class="turn_bottom_detail" v-html="play_readme">

            </div>

            <!-- <p class="turn_bottom_detail">
                                1.参与活动抽到奖品，活动页面会弹出中奖提醒，您需如实并及时填写领奖信息；</p>
                            <p class="turn_bottom_detail">
                                2.虚拟类奖品将实时进行发放，实物类的奖品将在中奖
                            </p>
                            <p class="turn_bottom_detail">
                                3.请保证您提供的领奖信息清晰准确，如果因领奖信息有误、不完整或不清晰而导致奖品未能及时收到而导致奖品不能正常发放的情况，视为放弃奖品；
                            </p> -->
          </div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="reward_show" :close-on-click-overlay="true" ref="reward_pop" get-container="#app"
        style="width:100%;height:100%;background-color: rgba(0,0,0,0.4);justify-content:center;    align-items: center;z-index=999999">
      <div class="reward_body">
        <div class="reward_bj">
          <img v-if="lv == 0" src="./../../assets/img/home/turn_reward1.png" alt="" />
          <img v-else src="./../../assets/img/home/turn_reward2.png" alt="" />
        </div>
        <div class="reward_content" v-if="lv == 0">
          <p>{{ win_say }}</p>
          <p>下次再接再厉~</p>
        </div>
        <div class="reward_content" v-else>
          <p>{{ win_say }}</p>
          <p>{{ win_rewarded }}{{ win_type }}已存放至您的账户~</p>
        </div>
        <div class="reward_close_btn" @click="reward_close"></div>
        <span class="reward_btn" @click="pop_close">
          关闭页面
        </span>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Popup } from 'vant'
export default {
  name: 'turn',
  data () {
    return {
      num: this.turnnum || null,  //会员中心抽奖次数
      turn_ing: false,
      lv: '',
      win_rewarded: '',
      win_type: '',
      win_say: '', //中奖说明
      play_id: '', //活动ID
      play_readme: '', //活动说明
      now_type: '', //活动场景
      is_point: true, //动画CSS类开关
      start_show: true,
      reward: {
        '1': ['55-80', '235-260'],
        '2': ['10-35', '190-215'],
        '3': ['145-170', '325-350'],
        '0': ['100-125', '280-305']
      },
      reward_show: false,
      pop_show: false
    }
  },
  props: {
    turnnum: {
      type: [Number, String],
    },
    show: {
      type: Boolean,
      default: false
    },
    con: {
      type: String,
      default: ''
    }
  },
  components: {
    [Popup.name]: Popup
  },
  created () {
    this.now_type = this.con || ''
    this.get_is_allow(this.now_type)
  },
  methods: {
    reward_close () {
      this.reward_show = false
      if (this.con != '指定抽奖') {
        this.pop_show = false
        this.$store.commit("set_turnshow", false);
      }
      this.$emit('send_isturn', false);//关闭大转盘页面
      this.is_point = true
      this.turn_ing = false
      this.lv = ''
      this.win_rewarded = ''
      this.win_type = ''
      this.win_say = ''
      this.start_show = true
      this.reward = {
        '1': ['55-80', '235-260'],
        '2': ['10-35', '190-215'],
        '3': ['145-170', '325-350'],
        '0': ['100-125', '280-305']
      }
    },
    pop_close () {
      this.reward_show = false
      this.$store.commit("set_turnshow", false);
      if (this.con != '指定抽奖') {
        this.pop_show = false
      }
      this.turn_ing = false
      this.lv = ''
      this.win_rewarded = ''
      this.win_type = ''
      this.win_say = ''
      this.is_point = true
      this.start_show = true
      this.reward = {
        '1': ['55-80', '235-260'],
        '2': ['10-35', '190-215'],
        '3': ['145-170', '325-350'],
        '0': ['100-125', '280-305']
      }
      this.$emit('send_closepop', false)
      this.$emit('send_isturn', false)

      if (this.now_type == '评价后') {
        this.$router.push({ path: '/order/orderlist', query: '待评价' })
      }
    },
    get_is_allow (type) {
      //是否允许玩
      var params = {}
      params.con = type
      this.now_type == '支付后' ? (params.oid = this.$route.query.id) : ''
      this.$api.getPage.is_turntable(params).then(res => {
        if (res.code == 200 && res.result != false) {
          this.play_id = res.result.hd_id
          this.play_readme = res.result.hd_readme
          // this.play_readme = res.result.hd_readme
          this.play_readme = this.play_readme.replace(/\n/g, "<br/>");
          if (this.now_type != '指定抽奖') {
            this.$emit('send_isturn', true)
          }
        } else if (res.result == false && this.now_type != '指定抽奖') {
          this.$emit('send_isturn', false)
          this.pop_show = false
          this.$store.commit("set_turnshow", false);
        }
      })
    },
    get_lev () {
      if (this.turn_ing) {
        return
      }
      this.turn_ing = true
      let reward = ''
      var params = {}
      params.id = this.play_id
      this.now_type == '支付后' ? (params.oid = this.$route.query.id) : ''
      this.$api.getPage.start_turntable(params).then(res => {
        if (res.code == 200 && res.result != null) {
          reward = res.result;
          this.lv = res.result.lv;
          this.win_say = res.result.win_say;
          this.win_type = res.result.balance_type;
          this.win_rewarded = res.result.money;
          let temp = this.reward[this.lv];
          // let max = (temp.length == 1 ? 0 : temp.length - 1);
          let index = this.random(0, 1);
          let part = temp[index].split('-');
          let param = this.random(parseInt(part[0]), parseInt(part[1]));
          let angle = (1080 + param) * -1;
          this.$refs.pointer.style.transform = `rotate(${angle}deg)`;
          if (this.num != null && this.num != undefined && this.num != '') {
            this.num = Number(this.num) - 1;
          }
          // console.log(this.$refs.reward_pop.$el)
          
          if(reward.tel == ""){
            this.$emit('send_closepop', true)
            this.$emit("send_res",reward)
          }else{
            setTimeout(() => {
              console.log('!!')
              this.is_point = false
              this.$refs.pointer.style.transform = ''
              this.turn_ing = false
              this.reward_show = true
            }, 4000)
          }

        } else {
          this.is_point = false
          this.turn_ing = false
        }
      })
    },
    turn (param) { },
    random (min, max) {
      return parseInt(Math.random() * (max - min + 1) + min, 10)
    }
  },
  watch: {
    show (old, after) {
      if (old == after) {
        return
      }
      this.pop_show = old
      this.start_show = true
      this.reward_show = false
    },
    con (old, after) {
      if (old == after) {
        return
      }
      this.now_type = old
    }
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
.turn {
  width: 100%;
}
.turn_close {
  position: absolute;
  right: 20px;
  top: 30px;
}
.turn_top {
  width: 70%;
  margin: 0 auto;
}
.turn_top img {
  width: 100%;
}
.turn_bottom {
  width: 85%;
  margin: 0 auto;

  position: relative;
}
.turn_bottom > span {
  position: absolute;
  right: 50px;
  bottom: 22px;
  font-size: 10px;
  color: #c0a9a9;
}
.turn_bottom_info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.turn_bottom_info .turn_bottom_title {
  font-size: 14px;
  padding-top: 2px;
  padding-bottom: 5px;
  text-align: center;
  letter-spacing: 2px;
  font-weight: bold;
  color: #a13d01;
}
.turn_bottom_info .turn_bottom_detail {
  width: 85%;
  margin: 0 auto;
  font-size: 12px;
  line-height: 20px;
  color: #491c01;
  text-align: justify;

  font-weight: normal;
}
.turn_bottom img {
  width: 100%;
}
.turn_bj {
  width: 70%;
  margin: 0 auto;
  position: relative;
}
.turn_bj img {
  width: 100%;
}
.turn_pointer {
  width: 60px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-bottom: 10px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.turn_pointer p {
  position: absolute;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 4px;
  padding-top: 15px;
  padding-left: 5px;
}
.turn_pointer img {
  width: 100%;
}
.reward_body {
  width: 100%;
  height: 50%;
  position: relative;
  margin-top: 150px;
}
.reward_content {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-flow: column;
  align-items: center;
}
.reward_content p:nth-of-type(1) {
  font-size: 14px;
  line-height: 20px;
  width: 45%;
  font-weight: bold;
  text-align: center;
  color: red;
}
.reward_content p:nth-of-type(2) {
  font-size: 12px;

  line-height: 30px;
  font-weight: bold;
  text-align: center;
  color: #1c0000;
}

.reward_bj {
  width: 85%;
  margin: 0 auto 30px auto;
}
.reward_bj img {
  width: 100%;
}
.reward_close_btn {
  width: 32px;
  height: 32px;
  position: absolute;
  top: 0;
  right: 28px;
}
.reward_btn {
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  margin: auto;
  width: 100px;
  height: 30px;
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  background-color: #f8b62b;
  line-height: 30px;
  border-radius: 10px;
}
/*无限旋转动画*/
@keyframes start {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes middle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1080deg);
  }
}
.point {
  transition: transform 4s;
  /* animation: turn 4s cubic-bezier(0, 1.3, 1, 0.98) 0.2s forwards; */
  /* animation: turn 4s cubic-bezier(0, 1.3, 1, 0.98) 0.2s forwards; */
}
</style>
