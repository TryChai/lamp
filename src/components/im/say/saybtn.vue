<template>
  <div class="saybtn" @touchstart="gotouchstart" @touchmove="gotouchmove" @touchend="gotouchend">

    <span>按住说话</span>

    <!-- <van-uploader :after-read="afterRead" /> -->
    <div class="saying" ref="saying" v-if="saying == true">
      <div v-if="iscancel == true">
        <img src="./../../../assets/img/im/voice/cancel.png" alt="">
      </div>
      <div v-else>
        <img src="./../../../assets/img/im/voice/ic_record@2x.png" alt="">
        <img src="./../../../assets/img/im/voice/sound.gif" alt="">

      </div>
      <p :class="[iscancel == true ? 'caceltip':'']">
        {{iscancel == true?'松开手指取消发送 ':'手指上滑取消发送'}}</p>

    </div>

  </div>
</template>
<script>

var finishRecord = function (file) {
  window.vue.voicestatus = false

  var blob = window.vue.dataURLtoBlob('data:audio/aac;base64,' + file);

  var fileaac = window.vue.blobToFile(blob, '1.aac');

  // window.vue.voiceFile = window.URL.createObjectURL(fileaac);

  window.vue.voiceFile = fileaac;

  window.vue.sendvoiceMsg();  //发送语音消息
};
window.finishRecord = finishRecord;

var recordError = function (res) {
  window.vue.voicestatus = false
  window.vue.$toast.fail(res)
};
window.recordError = recordError;

import wx from "weixin-js-sdk"
import { mapGetters, mapState } from "vuex";
// import { Uploader } from 'vant';
export default {
  name: "saybtn",
  data () {
    return {
      // fileblog: null,
      voiceFile: null,
      voicestatus: false,

      iscancel: false,
      saying: false,

      timer: null,//用于清除计时器

    };
  },
  created () {

  },
  computed: {
    ...mapGetters(["toAccount", "currentConversationType"]),

  },
  mounted () {
    window.vue = this
  },
  components: {
    // [Uploader.name]: Uploader
  },
  methods: {
    afterRead (res) {
      // localStorage.setItem('voice',res.content)

      var blob = this.dataURLtoBlob(res.content);
      var fileaac = this.blobToFile(blob, '1.aac');
      this.voiceFile = fileaac
      const files = new window.File(
        [this.voiceFile],
        this.voiceFile.name,
        { type: this.voiceFile.type }
      );
      let message = this.tim.createFileMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: files
        },
      });
      // 2. 发送消息
      let promise = this.tim.sendMessage(message);
      this.$store.commit("pushCurrentMessageList", message);
      promise.then(function (imResponse) {
        // 发送成功
        this.voiceFile = null;
        this.voicestatus = false;
        this.$toast.success('发送成功');
      }).catch(function (imError) {
        // 发送失败
        this.voiceFile = null;
        this.voicestatus = false;
        this.$toast.success('发送失败');
      });
    },
    sendvoiceMsg () {

      const files = new window.File(
        [this.voiceFile],
        this.voiceFile.name,
        { type: this.voiceFile.type }
      );
      //录音完成
      // 1. 创建消息实例，接口返回的实例可以上屏

      let message = this.tim.createFileMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: files
        },
      });
      // 2. 发送消息
      let promise = this.tim.sendMessage(message);
      this.$store.commit("pushCurrentMessageList", message);
      promise.then(function (imResponse) {
        // 发送成功
        this.voiceFile = null;
        this.voicestatus = false;
        this.$toast.success('发送成功');
        this.$api.getIm.sendMsgSms({ content: '语音消息', im: this.toAccount })
      }).catch(function (imError) {
        // 发送失败
        this.voiceFile = null;
        this.voicestatus = false;
        this.$toast.success('发送失败');
        // console.warn('sendMessage error:', imError);
      });
    },
    gotouchstart () {

      let that = this;

      clearTimeout(that.timer);//清除定时器
      that.timer = 0;
      that.timer = setTimeout(() => {
        // 开始录音
        this.voicestatus = true
        this.$fnc.appstartRecord()
        this.saying = true;


        // wx.startRecord({
        //     success: function (res) {
        //         //console.log();
        //     },
        //     fail: function (res) {
        //         //alert();
        //     }
        // });
        // setTimeout(function () {
        //     //结束录音  
        //     wx.stopRecord({
        //         success: function (res) {
        //             var localId = res.localId;
        //         }
        //     });
        // }, 10000)
      }, 600);//这里设置定时
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gotouchend (e) {
      clearTimeout(this.timer);
      if (this.saying == true) {
        if (this.timer != 0 && this.iscancel == false) {
          this.saying = false;
          this.iscancel = false;

          this.voicestatus = false
          this.$fnc.appstopRecord()

          //这里写要执行的内容（尤如onclick事件）
        } else {


          //录音取消
          this.saying = false;
          this.iscancel = false;
          this.voiceFile = null;
          this.voicestatus = false
          this.$fnc.appcancelRecord()
        }
      }

    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按 
    gotouchmove (e) {
      if (this.saying == true) {
        var moveX = e.changedTouches[0].pageX
        var moveY = e.changedTouches[0].pageY
        var say_position = this.$refs.saying.getBoundingClientRect() //弹窗位置
        // console.log(moveX, moveY, say_position)
        if (say_position.left <= moveX && moveX <= say_position.right && say_position.top <= moveY && moveY <= say_position.bottom) {
          this.iscancel = true;
        } else {
          this.iscancel = false;
        }
      }
    },

    dataURLtoBlob (dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        // bstr = window.atob(arr[1]),
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    //将blob转换为file
    blobToFile (theBlob, fileName) {
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    },
  },
}
</script>
<style lang="less" scoped>
.saybtn {
  width: 100%;
  font-size: 14px;
  color: #333333;
  min-height: 40px;
  line-height: 40px;
  position: relative;
}

.saying {
  width: 150px;
  height: 150px;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  border-radius: 10px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  // padding: 10px 0;
  color: #ffffff;
  line-height: 20px;
  div {
    width: 100%;
    height: 100px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: center;
    img {
      height: 100%;
    }
  }
  > p {
    padding-top: 10px;
  }
  .caceltip {
    background-color: red;
    padding: 5px 10px;
    height: 30px;
    border-radius: 5px;
  }
}
</style>