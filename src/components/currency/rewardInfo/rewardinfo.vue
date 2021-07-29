<template>
  <van-popup v-model="show" class="rewardinfo">
    <div class="rewardinfo_pop" v-if="lottery.tel == ''">
      <div class="pop_top">
        <div class="pop_top_contet">
          <p style="line-height: 20px;width: 100%;text-align: right;margin-right: 15px;">
            <van-icon name="cross" color="#fff" size="34px" @click="$emit('closebtn')" />
          </p>
          <p v-if="lottery.win_say">{{lottery.win_say}}</p>
          <p>请<span>绑定手机号码</span> </p>
          <p>方便我们与你联系并<span>领取奖品</span></p>
        </div>
        <img src="./../../../assets/img/home/bindteltop.png" alt="">
      </div>
      <div class="pop_bottom">
        <div class="pop_bottom_field">
          <van-field v-model="form.tel" label="" type="tel" placeholder="请输入手机号" :border="false">
            <template #button>
              <div @click="showGj=true" v-if="$store.state.config.plugin.gjdx.is_open=='1'">
                <img src="./../../../assets/img/gj.png" mode class="input_icon" style="width:25px" />
                <span class="">{{gj}}</span>
              </div>
            </template>
          </van-field>
        </div>
        <div class="pop_bottom_field" v-show="isBdsjhdx">
          <van-field v-model="form.code" label="" placeholder="验证码" :border="false">
            <template #button>
              <span @click="sendcode">{{text}}</span>
            </template>
          </van-field>
        </div>
        <span @click="bindtel">立即绑定</span>
      </div>
      <div class="pop_ewm" :style="{'height':ewmshow == true ?'200px':'20px'}">
        <div class="pop_ewm_content">
          <img :src="$fnc.getImgUrl(ewmurl)" alt="">
          <p>-扫描关注公众号-</p>
          <p>接收奖品信息</p>
        </div>
        <img src="./../../../assets/img/home/bindtelewm.png" alt="">
      </div>
    </div>
    <div class="rewardinfo_pop" v-else-if="lottery.tel && lottery.wxewm">
      <div class="pop_top">
        <div class="pop_top_contet">
          <p style="line-height: 20px;width: 100%;text-align: right;margin-right: 15px;margin-top: -30px;">
            <van-icon name="cross" color="#fff" size="34px" @click="$emit('closebtn')" />
          </p>
          <p v-if="lottery.win_say">{{lottery.win_say}}</p>
          <p>-扫描关注公众号-</p>
          <p>接收奖品信息</p>
        </div>
        <img src="./../../../assets/img/home/bindteltop.png" alt="">
      </div>
      <div class="pop_ewm1">
        <div class="pop_ewm_content1">
          <img :src="$fnc.getImgUrl(ewmurl)" alt="">
        </div>
      </div>
    </div>
    
    <van-popup v-model="reward_show" :close-on-click-overlay="true" ref="reward_pop" get-container="#app"
        style="width:100%;height:100%;background-color: rgba(0,0,0,0.4);justify-content:center;    align-items: center;z-index=999999">
      <div class="reward_body">
        <div class="reward_bj">
          <img v-if="lottery.lv == 0" src="../../../assets/img/home/turn_reward1.png" alt="" />
          <img v-else src="../../../assets/img/home/turn_reward2.png" alt="" />
        </div>
        <div class="reward_content" v-if="lottery.lv == 0">
          <p>{{ lottery.win_say }}</p>
          <p>下次再接再厉~</p>
        </div>
        <div class="reward_content" v-else>
          <p>{{ lottery.win_say }}</p>
          <p>{{ lottery.win_rewarded }}{{ lottery.win_type }}已存放至您的账户~</p>
        </div>
        <!-- <div class="reward_close_btn" @click="reward_close"></div> -->
        <span class="reward_btn" @click="pop_close">
          关闭页面
        </span>
      </div>
    </van-popup>

    <van-popup v-model="showGj" position="right">
      <index-list @clickData="clickData" />
    </van-popup>
  </van-popup>

</template>
<script>
import { mapState } from "vuex";
import { Popup, Field } from 'vant';

import IndexList from "@/components/currency/IndexList.vue";
export default {
  name: "rewardinfo",
  data () {
    return {
      showGj: false,
      ewmurl: '',
      num: 60,
      text: "发送验证码",
      gj: '中国(+86)',
      quhao: "",
      ewmshow: false,
      show: true,
      form: {
        tel: "",
        code: "",
        unicode: ""
      },
      reward_show: false
    };
  },
  props:{
    lottery: {
      type: Object,
      default: {}
    }
  },
  components: {
    [Popup.name]: Popup,
    [Field.name]: Field,

    IndexList
  },
  computed: {
    ...mapState({
      plugin: state => state.config.sms,
    }),
    isBdsjhdx () {
      if (this.sms && this.sms.bdsjhdx == undefined) {
        return false;
      } if (this.sms && this.sms.bdsjhdx == '0') {
        return false;
      } else {
        return true;
      }
    }
  },
  created () {
    // this.getewm()
    // setTimeout(() => {
    //   this.ewmshow = true;
    // }, 500);

  },
  methods: {
    pop_close () {
      this.reward_show = false
      this.$store.commit("set_turnshow", false);
      this.$emit('send_closepop', false)
      this.$emit('send_isturn', false)
    },
    clickData (item) {
      this.gj = item.label + "(+" + item.code + ")";
      this.quhao = item.code;
      this.showGj = false;
    },
    bindtel () {
      var params = {};
      params.tel = this.form.tel;
      params.code = this.form.code;
      params.unicode = this.form.unicode;
      this.$api.getUser.bindPhone(params).then(res => {
        if (res.code == 200) {
          this.$toast.success("绑定成功");
          setTimeout(() => {
            //获取微信二维码
            this.getewm();
          }, 1000)
          // setTimeout(() => {
          //   this.$emit('closebtn');
          // }, 1500);
        }
      });
    },
    sendcode () {
      var value = this.form.tel;
      if (value == "") {
        this.$toast.fail("手机号码不能为空");
        return false;
      }
      var _this = this;
      this.$api.getUser.bindPhoneCode({
        tel: this.form.tel,
        quhao: this.gj.replace(/[^0-9]/gi, "") || 86
      }).then(res => {
        if (res.status === 1) {
          this.$toast.success("发送成功");
          this.form.unicode = res.result;
          var temar = setInterval(function () {
            if (_this.num <= 0) {
              clearInterval(temar);
              _this.text = "发送验证码";
              _this.num = 60;
            } else {
              _this.num--;
              _this.text = "（" + _this.num + "）秒";
            }
          }, 1000);
        }
      });
    },
    getewm () {
      this.$api.getConfig.get_iden({ iden: 'wxewm' }).then(res => {
        if (res.code == 200) {
          if(res.result){
            this.ewmurl = res.result;
            this.ewmshow = true;
          }else{
            this.reward_show = true;
          }
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.rewardinfo {
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 50px;
}

.rewardinfo_pop {
  width: 85%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  background: #fff;
  .pop_top {
    width: 100%;
    position: relative;
    img {
      width: 100%;
      height: 150px;
    }
    .pop_top_contet {
      width: 100%;
      height: 100%;
      position: absolute;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      > p span {
        font-size: 20px;
        color: #fff844;
      }
    }
  }
  .pop_bottom {
    width: 100%;
    height: 250px;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    padding: 25px 20px;
    position: relative;
    background-color: #ffffff;
    > .pop_bottom_field {
      width: 100%;
      border: 1px solid #eeeeee;
      margin-bottom: 20px;
    }
    > span {
      width: 80%;
      height: 45px;
      font-size: 16px;
      font-weight: bold;
      background-color: #fa513c;
      color: #ffffff;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 25px;
    }
  }
  .draw-enter-active,
  .draw-leave-active {
    transition: all 1s ease;
  }
  .draw-enter, .draw-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0;
  }

  .pop_ewm {
    width: 220px;
    position: absolute;
    position: relative;
    margin: 0 auto;
    background-size: 100% 100%;
    overflow: hidden;
    margin-top: -22px;
    // height: 15px;
    // height: 200px;
    transition: height 2s;
    -moz-transition: height 2s; /* Firefox 4 */
    -webkit-transition: height 2s; /* Safari 和 Chrome */
    -o-transition: height 2s; /* Opera */
   
    > img {
      width: 100%;
      height: 200px;
    }
    .pop_ewm_content {
      width: 100%;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      padding: 20px 0;
      position: absolute;
      > img {
        width: 50%;
        // margin-bottom: 10px;
      }
      > p {
        font-size: 15px;
        font-weight: bold;
        color: #fa513c;
      }
    }
  }
  
  .pop_ewm1{
    .pop_ewm_content1{
      img{
        width: 200px;
        height: 200px;
      }
    }
  }
}
</style>