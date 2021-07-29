<template>
  <div class="liverecord">
    <div class="record_top">
      <!-- <div class="record_white">
      </div> -->
    </div>
    <div class="record_content">
      <div class="content_top">
        <van-icon name="cross" @click="equit" />
        <div class="content_top_item" @click="camerabtn">

          <!-- 点击翻转{{camera}} -->
          <img src="./../../../assets/img/member/record_1.png" alt="">
          <span>翻转</span>
        </div>
        <div class="content_top_item" @click="counttimebtn" v-show="is_show_settime == true">
          <!-- 倒计时拍摄{{counttime}} -->
          <img src="./../../../assets/img/member/record_2.png" alt="">
          <span>倒计时</span>
        </div>
      </div>

      <!--       
      {{videoId}}
      </br>
      {{videoObj}} -->
      <!-- <h1 id=mytime>{{str}}{{s}}</h1> -->

      <!-- <h1>{{isrecord}}</h1> -->
      <!-- <button id="stop" name="button" @click="stop">stop</button>
      <button id="start" name="button" @click="start">start</button>
      <button id="reset" name="button" @click="reset">reset</button> -->

      <div class="content_beauty" v-show="is_show_settime == true">
        <span>磨皮</span>
        <van-slider v-model="beautyskin" bar-height="4px" active-color="#fff" @change="beautyskin_change">
          <template #button>
            <div class="custom-button">
              {{ beautyskin }}
            </div>
          </template>
        </van-slider>
      </div>
      <div class="content_beauty" v-show="is_show_settime == true">
        <span>美白</span>
        <van-slider v-model="beautywhite" bar-height="4px" active-color="#fff" @change="beautywhite_change">
          <template #button>
            <div class="custom-button">
              {{ beautywhite }}
            </div>
          </template>
        </van-slider>
      </div>
      <div class="content_action">
        <div class="content_action_btn" @click="action_do">
          <!-- 开始 -->
          <span class="action_start" v-if="isrecord == false"></span>
          <span class="action_stop" v-else></span>
        </div>

        <div class="content_actionright">
          <van-icon name="success" @click="over" v-show="is_show_settime == false && s >= 5" />
          <!-- <span style="font-size:14px" @click="over">完成上传录制</span> -->
        </div>
      </div>
    </div>
    <div class="record_bottom" v-show="is_show_settime == true">
      <div :class="[now_time == 15 ? 'active_time':'']" @click="setTime(15)">拍15秒 <span class="dot" v-show="now_time == 15"></span></div>
      <div :class="[now_time == 30 ? 'active_time':'']" @click="setTime(30)">拍30秒 <span class="dot" v-show="now_time == 30"></span></div>
      <div :class="[now_time == 45 ? 'active_time':'']" @click="setTime(45)">拍45秒 <span class="dot" v-show="now_time == 45"></span></div>
    </div>
  </div>
</template>

<script>
import { Slider } from 'vant';
import $video from '@/assets/js/fnc/video.js'
export default {
  name: 'pagerecord',
  data () {
    return {
      videoId: "",
      videoObj: {},
      is_show_settime: true,
      h: 0,//定义时，分，秒，毫秒并初始化为0；
      m: 0,
      ms: 0,
      s: 0,
      time: 0,
      str: '',
      mytime: '',

      isrecord: false,
      counttime: false,
      camera: 0,  //摄像头正反  0 正面 1 反面
      now_time: 15,
      beautywhite: 70, //美颜
      beautyskin: 40,  //磨皮
    }
  },
  components: {
    [Slider.name]: Slider
  },
  mounted () {
    window.vue = this;
    window.configVideoInfo = this.configVideoInfo;
  },
  methods: {
    configVideoInfo (videoID, videoObj) {
      this.videoId = videoID;
      this.videoObj = videoObj;

    },
    over () {
      this.is_show_settime = true;
      this.reset();
      this.isrecord = false;
      this.counttime = false;
      this.now_time = 15;
      $video.saveVideoRecord();
    },
    timer () {   //定义计时函数
      this.ms = this.ms + 50;         //毫秒
      if (this.ms >= 1000) {
        this.ms = 0;
        this.s = this.s + 1;         //秒
      }
      // if (this.s >= 60) {
      //   this.s = 0;
      //   this.m = this.m + 1;        //分钟
      // }
      // if (this.m >= 60) {
      //   this.m = 0;
      //   this.h = this.h + 1;        //小时
      // }
      this.str = this.toDub(this.h) + ":" + this.toDub(this.m) + ":" + this.toDub(this.s) + ""/*+this.toDubms(this.ms)+"毫秒"*/;
      // // document.getElementById('mytime').innerHTML=h+"时"+m+"分"+s+"秒"+ms+"毫秒";
    },

    reset () {  //重置
      clearInterval(this.time);
      this.h = 0;
      this.m = 0;
      this.ms = 0;
      this.s = 0;
      this.str = "00:00:00";
    },
    action_do () {
      if (this.isrecord == true) {
        this.stop()
      } else {
        this.start();
      }
    },
    start () {  //开始
      this.isrecord = true;
      if (this.time) {
        clearInterval(this.time);
      }
      this.time = setInterval(this.timer, 50);

      $video.startVideoRecord();
      this.is_show_settime = false;
    },

    stop () {  //暂停
      this.isrecord = false;
      clearInterval(this.time);
      $video.stopVideoRecord();
    },

    toDub (n) {  //补0操作
      if (n < 10) {
        return "0" + n;
      }
      else {
        return "" + n;
      }
    },

    toDubms (n) {  //给毫秒补0操作
      if (n < 10) {
        return "00" + n;
      }
      else {
        return "0" + n;
      }

    },
    equit () {
      $video.closeVideoRecord();
    },
    counttimebtn () {
      this.counttime = !this.counttime;


      $video.delayVideoRecord()
      setTimeout(() => {
        this.isrecord = true;
        this.is_show_settime = false;
      }, 3000);
    },
    camerabtn () {
      this.camera = this.camera == 0 ? 1 : 0;
      $video.setRecordCamerDirct(this.camera)
    },
    setTime (val) {
      //设置短视频时长
      this.now_time = val;
      $video.setRecordTime(this.now_time)
    },
    beautywhite_change (value) {
      $video.setRecordWhite(value)
    },
    beautyskin_change (value) {
      $video.setRecordBeautySkin(value)
    },
  },
}
</script>

<style lang="less" scope>
.liverecord {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  // background-color: #313131;
  .record_top {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-content: center;
    padding-top: 10px;
    padding: 40px 13px;

    .record_white {
      width: 100%;
      height: 6px;
      background-color: #796e76;
    }
  }
  .record_content {
    width: 100%;
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    align-items: center;
    padding: 0 13px;
    .content_top {
      width: 100%;
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: flex-end;
      margin-bottom: auto;
      position: relative;
      .van-icon {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 30px;
        color: #ffffff;
      }
      .content_top_item {
        width: 45px;
        font-size: 14px;
        color: #fff;
        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-items: center;
        font-size: 10px;
        margin-bottom: 15px;
        > img {
          width: 30px;
        }
      }
    }
    > .content_beauty {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;
      color: #ffffff;
      > span {
        margin-right: 10px;
      }
      > div {
        flex: 1;
      }
      .custom-button {
        width: 26px;
        color: #fff;
        font-size: 10px;
        line-height: 18px;
        text-align: center;
        background-color: #696969;
        border-radius: 100px;
      }
    }
    > .content_action {
      width: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      position: relative;
      margin: 15px 0;
      > .content_action_btn {
        color: #fe2b54;
        width: 92.5px;
        height: 92.5px;
        border-radius: 50%;
        border: 7px solid #c12d4a;
        display: flex;
        justify-content: center;
        align-items: center;
        > .action_start {
          width: 60px;
          height: 60px;
          background-color: #c12d4a;
          border-radius: 50%;
        }
        > .action_stop {
          width: 33px;
          height: 33px;
          background-color: #c12d4a;
          border-radius: 5px;
        }
      }
      .content_actionright {
        height: 100%;
        position: absolute;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        .van-icon {
          font-size: 24px;
          color: #ffffff;
          background-color: #fe2b54;
          border-radius: 50%;
          padding: 5px;
        }
      }
    }
  }
  .record_bottom {
    width: 100%;
    height: 60px;
    background-color: rgba(0, 0, 0, 1);
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    > div {
      width: auto;
      font-size: 18px;
      color: #696969;
      position: relative;
      font-weight: bold;
      .dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        position: absolute;
        background-color: #ffffff;
        bottom: 0px;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
    .active_time {
      font-size: 20px;
      color: #ffffff;
      font-weight: bold;
    }
  }
}
</style>