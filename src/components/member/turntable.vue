<template>
  <!-- 大转盘 -->
  <div class="turntable">
    <div class="container" :style="rule_info.hd_readme ? 'height: auto !important;' : 'height: 100% !important;'">
      <p class="arrow-left" @click="toBack">
        <van-icon name="arrow-left" />
      </p>
      <div class="turn_top">
        <img src="./../../assets/img/turn/title_brg.png" alt="" />
      </div>
      <div v-if="rule_info.content != '活动未开始'" class="turn_money">
        当前{{rule_info.dzpcjfs}}：{{rule_info.money}}
      </div>
      <div class="turn">
        <div class="turn_bj">
          <img class="" :class="{ point: is_point }" ref="pointer" src="./../../assets/img/home/turntable_bj.png" alt="" />
          <div class="turn_pointer">
            <img src="./../../assets/img/home/turn_pointer.png" alt="" />
            <p @click="get_lev" v-if="start_show">开始</p>
          </div>
        </div>
        <div class="turn_surplus">
          <p>{{rule_info.content}}</p>
          <img src="./../../assets/img/turn/pan.png" mode=""></img>
        </div>
      </div>
      <div class="turn_bottom">
        <div class="turn_bottom_info">
          <p class="turn_bottom_title">·活动细则·</p>
          <div class="turn_bottom_detail" v-html="rule_info.hd_readme"></div>
        </div>
      </div>
    </div>
    
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
    
    <rewardinfo v-if="rewardinfoshow" class="index-man-pop" :lottery="lottery" style="z-index: 9999;" @closebtn="closebtn"></rewardinfo>
  </div>
</template>

<script>
  import rewardinfo from "@/components/currency/rewardInfo/rewardinfo";
  export default{
    data(){
      return {
        num: this.$route.query.turnnum,  //会员中心抽奖次数
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
        dzpcjfs_jf: "",//积分
        dzpcjfs: "",
        rewardinfoshow: false,
        lottery: {},
        reward_show: false,
        rule_info: {}
      }
    },
    methods:{
      reward_close () {
        this.reward_show = false
        if (this.con != '指定抽奖') {
          this.pop_show = false
          this.$store.commit("set_turnshow", false);
        }
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
      get_is_allow () {
        //是否允许玩
        var params = {}
        params.con = this.$route.query.con;
        // this.now_type == '支付后' ? (params.oid = this.$route.query.id) : ''
        this.$api.getPage.is_turntable(params).then(res => {
          if (res.code == 200 && res.result != false) {
            this.play_id = res.result.hd_id
            this.play_readme = res.result.hd_readme
            // this.play_readme = res.result.hd_readme
            this.play_readme = this.play_readme.replace(/\n/g, "<br/>");
            this.dzpcjfs = res.result.dzpcjfs;
            this.dzpcjfs_jf = res.result.dzpcjfs_jf;
          } 
          // else if (res.result == false) {
          //   // this.$emit('send_isturn', false)
          //   // this.$store.commit("set_turnshow", false);
          //   this.is_point = false;
          //   this.$toast.fail("不能参与抽奖，请稍后再试");
          //   setTimeout(() => {
          //     this.$router.push({ path: '/member/member'});
          //   },2000)
          // }
        })
      },
      get_lev () {
        if (this.turn_ing) {
          return
        }
        this.turn_ing = true;
        let reward = '';
        var params = {};
        params.id = this.play_id;
        this.now_type == '支付后' ? (params.oid = this.$route.query.id) : '';
        this.$api.getPage.start_turntable(params).then(res => {
          if (res.code == 200 && res.result != null) {
            reward = res.result;
            this.lv = res.result.lv;
            this.win_say = res.result.win_say;
            this.win_type = res.result.balance_type;
            this.win_rewarded = res.result.money;
            let temp = this.reward[this.lv];
            let max = (temp.length == 1 ? 0 : temp.length - 1);
            let index = this.random(0, 1);
            let part = temp[index].split('-');
            let param = this.random(parseInt(part[0]), parseInt(part[1]));
            let angle = (1080 + param) * -1;
            console.log("动画旋转：",angle);
            this.$refs.pointer.style.transform = `rotate(${angle}deg)`;
            this.getRuleInfo();//重新请求
            if (this.num != null && this.num != undefined && this.num != '') {
              this.num = Number(this.num) - 1;
            }
            // console.log(this.$refs.reward_pop.$el)
            
            if(reward.tel == ""){
              this.lottery = reward;
            }else{
              setTimeout(() => {
                this.is_point = false;
                this.$refs.pointer.style.transform = '';
                this.turn_ing = false;
                this.reward_show = true;
              }, 4000)
            }
          } else {
            this.is_point = false;
            this.turn_ing = false;
          }
        })
      },
      random (min, max) {
        return parseInt(Math.random() * (max - min + 1) + min, 10)
      },
      closebtn() {
        this.rewardinfoshow = false;
      },
      getRuleInfo(){
        var params = {}
        params.con = this.$route.query.con;
        this.$api.getPage.getRuleInfo(params).then(res => {
          if(res.code == 200){
            this.rule_info = res.result;
            this.rule_info.hd_readme = this.rule_info.hd_readme.replace(/\n/g, "<br/>");
          }
        })
      }
    },
    created() {
      this.getRuleInfo();
      // this.get_is_allow();
    },
    components:{
      rewardinfo
    }
  }
</script>

<style lang="less" scoped>
  .turntable {
    // overflow: auto;
    // background: url(../../assets/img/turn/turn_brg.png) no-repeat;
    // background-size: 100% 100%;
    // position: relative;
    width:100%;
    height: 100%;
    overflow: auto;
    
    .container{
      width: 100%;
      height: auto !important;
      font-size: 14px;
      overflow: auto;
      background-size: 100% !important;
      background: url("../../assets/img/turn/turn_brg.png") no-repeat top center;
      padding: 15px 0 25px;
      // position: absolute;
      // left: 0;
      // right: 0;
      // top: 0;
      // bottom: 0;
      
      .arrow-left{
        margin: 0 15px;
        line-height: 1;
        .van-icon{
          font-size: 30px;
          color: #fff;
        }
      }
      
      .turn_top {
        width: 70%;
        margin: 0 auto;
      
        img {
          width: 100%;
        }
      }
      
      .turn_money{
        text-align: center;
        color: #fff;
      }
      
      .turn {
        width: 100%;
        margin-top: 10px;
      
        .turn_bj {
          width: 70%;
          margin: 0 auto;
          position: relative;
      
          img {
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
      
            p {
              position: absolute;
              color: #ffffff;
              font-size: 18px;
              font-weight: bold;
              letter-spacing: 4px;
              padding-top: 15px;
              padding-left: 5px;
            }
      
            img {
              width: 100%;
            }
          }
        }
        
        .turn_surplus{
          margin: 20px 10px;
          position: relative;
          img{
            width: 100%;
          }
          p{
            color: #fff;
            border: 1px solid #fec501;
            background-image: linear-gradient(#ea732e, #e42a35);
            border-radius: 20px;
            font-size: 18px;
            text-align: center;
            width: 180px;
            position: absolute;
            left: 50%;
            top: -8px;
            transform: translate(-50%);
          }
        }
      }
      
      .turn_bottom {
        width: 85%;
        margin: 0 auto;
        position: relative;
        margin-top: 30px;
      
        .turn_bottom_info {
          position: relative;
      
          .turn_bottom_title {
            font-size: 16px;
            text-align: center;
            letter-spacing: 2px;
            font-weight: bold;
            color: #a13d01;
            background-image: linear-gradient(to right, #fade87 , #ffc55c);
            border-radius: 10px;
            // margin: 0 90px;
            width: 130px;
            line-height: 35px;
            position: absolute;
            left: 50%;
            top: -20px;
            transform: translate(-50%);
          }
      
          .turn_bottom_detail {
            width: 100%;
            margin: 0 auto;
            font-size: 12px;
            line-height: 20px;
            color: #491c01;
            text-align: justify;
            background: #fff;
            padding: 20px 15px 10px;
            font-weight: normal;
            border: 5px solid #fa451d;
            border-radius: 20px;
          }
        }
      }
    }
  }
  
  .reward_body {
    width: 100%;
    height: 50%;
    position: relative;
    margin-top: 150px;
    
    .reward_bj {
      width: 85%;
      margin: 0 auto 30px auto;
    }
    .reward_bj img {
      width: 100%;
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
