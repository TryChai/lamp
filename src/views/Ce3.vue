<template>
  <div class="ce-shi">

    <van-nav-bar title="app方法测试" left-text left-arrow class="navbar" @click-left="toBack" />

    8月11日
    <div>
      <van-button type="info" size="large" @click="appletPostMsg">小程序跳转</van-button>
    </div>

    7月3日新加方法 短视频
    <div>
      {{videoId}}
      </br>
      {{videoObj}}
      <van-field v-model="recordurl" label="录制交互页面" clearable placeholder />
      <van-button type="info" size="large" @click="send_code">发送指令</van-button>
    </div>
    <br>
    <div>
      <van-field v-model="pushUrl" label="推流url" clearable placeholder />
      <van-field v-model="urlRtmp" label="拉流Rtmp" clearable placeholder />
      <van-field v-model="urlFlv" label="拉流Flv" clearable placeholder />
      <van-field v-model="urlm3u8" label="拉流m3u8" clearable placeholder />
    </div>
    <van-button type="info" size="large" @click="product_url">生成地址</van-button>

    <van-field v-model="home" label="直播间" clearable placeholder />
    <div>
      <van-button type="info" size="large" @click="openLive">android openLive</van-button>
    </div>
    <div>
      <van-button type="info" size="large" @click="iosopenLive">ios openLive</van-button>
    </div>
    <br>
    5月9日新加方法
    <van-field v-model="videourl" label="视频下载" clearable placeholder />
    <van-progress :percentage="progress" v-show="isdown == true" />
    <div>
      <van-button type="info" size="large" @click="downvideo">下载视频</van-button>
    </div>
    <br>
    5月20日新加方法 录音
    <div>
      <van-button type="info" size="large" :disabled="voicestatus == false ? false:true" @click="starvoice">{{voicestatus == false?'开始录音':'录音中'}}
      </van-button>

      <div style="display:flex;justify-content: space-between;padding-top:10px">
        <van-button type="info" size="large" style="width:45%" @click="stopvoice">停止录音</van-button>
        <van-button type="info" size="large" style="width:45%" @click="cancelvoice">取消录音</van-button>
      </div>
      base64:{{voiceFile}}
      <span @click="$fnc.ykAPPCopy(voiceFile)">复制</span>

      <audio :src="'data:audio/wav;base64,'+ voiceFile" controls="controls"></audio>
      <br>

      <br>
      file:{{fileblog}}

      <audio :src="fileblog" controls="controls"></audio>
      <br>
      <br>
      <br>

    </div>

  </div>
</template>

<script>



var startLivePush = function () {
  window.vue.$toast.fail('开始推流')
};
var stopLivePush = function () {
  window.vue.$toast.fail('停止推流')
};
window.startLivePush = startLivePush;
window.stopLivePush = stopLivePush;


//oc调用js
var videoResult = function (url, path, error) {
  window.vue.clearTime()
  if (path) {
    window.vue.$toast.success(`视频保存在路径${path}`)
  } else {
    window.vue.$toast.fail(error)
  }
};
window.downVideoResult = videoResult;


//视频回调进度
var downVideoProgress = function (url, progress) {
  window.vue.progress = progress * 100;
};
window.downVideoProgress = downVideoProgress;



//oc调用js
var finishRecord = function (file) {
  window.vue.voicestatus = false
  window.vue.voiceFile = file
  var blob = window.vue.dataURLtoBlob('data:audio/aac;base64,' + file);
  var fileaac = window.vue.blobToFile(blob, '1.aac');
  window.vue.fileblog = window.URL.createObjectURL(fileaac);
};
window.finishRecord = finishRecord;

var recordError = function (res) {
  window.vue.voicestatus = false
  window.vue.$toast.fail(res)
};
window.recordError = recordError;

const md5 = require("md5");
import { Field, Progress } from "vant";
import { mapState } from "vuex";
import $video from '@/assets/js/fnc/video.js'
import wx from "weixin-js-sdk";
export default {

  data () {
    return {
      recordurl: `${window.location.protocol}//${window.location.host}/page/record`,
      videoId: "",
      videoObj: {},
      fileblog: null,
      voiceFile: "",
      voicestatus: false,
      toast: null,
      isdown: false,          //是否处于下载状态
      progress: 0,

      videourl: "http://media.vi5.cn/video/3f144466-171b9ca1be4-0006-cf1c-513-41d0f.mp4",

      home: 'https://mobile.mm80.cn/live/studio',
      pushUrl: '',
      pullUrl: '',

      urlRtmp: '',
      urlFlv: '',
      urlm3u8: '',
    };
  },
  computed: {
    ...mapState({
      storeUuid: state => state.appUuid,
    }),

  },
  components: {
    [Field.name]: Field,
    [Progress.name]: Progress,
  },
  created () {
    // var audio = sessionStorage.getItem('audio')
    // audio = 'data:audio/mp3;base64,' + audio
    // var blob = this.dataURLtoBlob(audio);
    // var fileaac = this.blobToFile(blob, '1.mp3');
    // this.fileblog = window.URL.createObjectURL(fileaac);
    wx.ready(() => {
      var u = navigator.userAgent;
      var isxcx = u.indexOf("miniProgram") !== -1 ? true : false;
      if (isxcx == false) {
        return
      }
      var info = {
        miniprogramId: 'wx0c2d05e83c9806fa'//参数
      };
      wx.miniProgram.postMessage({ data: info });
    })
  },
  mounted () {
    window.vue = this;

    window.configVideoInfo = this.configVideoInfo;
  },
  destroyed () {
  },
  methods: {
    appletPostMsg () {
      // var url = `/pages/jump/jump?appid=wx0c2d05e83c9806fa&path0=page/index/index`;
      // wx.miniProgram.navigatback({
      //   url: url
      // })
      this.$router.push('/login?tshare=fb4yqr&url=http://192.168.50.137:83/zhanye/receipt/transaction?money=0&tshare=fb4yqr&id=16&VNK=c35e516a')
    },
    configVideoInfo (videoID, videoObj) {
      this.videoId = videoID;
      this.videoObj = videoObj;
    },
    send_code () {
      $video.openVideoRecord(this.recordurl)
    },
    dataURLtoBlob: function (dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = window.atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    //将blob转换为file
    blobToFile: function (theBlob, fileName) {
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    },
    dataURLtoFile (dataurl, filename) {//将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = window.atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      this.file = new File([u8arr], filename, { type: mime });
      // return new File([u8arr], filename, { type: mime });
    },
    playvideo () {

    },
    cancelvoice () {
      this.voicestatus = false
      this.$fnc.appcancelRecord()
    },
    stopvoice () {
      this.voicestatus = false
      this.$fnc.appstopRecord()
    },
    starvoice () {
      this.voicestatus = true
      this.$fnc.appstartRecord()
    },


    downpush () {
      this.$fnc.closeLive();
    },
    clearTime () {
      this.toast.clear();
      this.isdown = false;
      clearInterval(this.timer)
      this.progress = 0
    },

    downvideo () {
      //开始下载
      this.toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        message: `当前进度${this.progress * 100}%`
      });
      // setTimeout(() => {
      //     this.clearTime();
      // }, 1000);
      this.$fnc.appdownvideo(this.videourl);
      this.isdown = true;
    },

    product_url () {
      this.pushUrlbtn();
      this.pullurlbtn();
    },

    pullurlbtn () {
      const AppName = "yk";                     //应用名称
      const StreamName = "text";                     //应用名称
      const HOST = "vid.inexcn.cn";                     //域名
      const pull_key = "mB9QTchDyZ";
      let time = Date.parse(new Date()) / 1000 + 30 * 60;
      let strRtmp = "/" + AppName + "/" + StreamName + "-" + time + "-0-0-" + pull_key;
      let strFlv = "/" + AppName + "/" + StreamName + ".flv-" + time + "-0-0-" + pull_key;
      let strm3u8 = "/" + AppName + "/" + StreamName + ".m3u8-" + time + "-0-0-" + pull_key;

      this.urlRtmp = "rtmp://" + HOST + "/" + AppName + "/" + StreamName + "?auth_key=" + time + "-0-0-" + md5(strRtmp);
      this.urlFlv = "http://" + HOST + "/" + AppName + "/" + StreamName + ".flv?auth_key=" + time + "-0-0-" + md5(strFlv);
      this.urlm3u8 = "http://" + HOST + "/" + AppName + "/" + StreamName + ".m3u8?auth_key=" + time + "-0-0-" + md5(strm3u8);
    },
    pushUrlbtn () {
      const app_name = "yk";                     //应用名称
      const StreamName = "text";                     //应用名称
      const pull_url = "rtmp://vidt.inexcn.cn";
      const pull_key = "W5IrZWgCXx";
      let part_url = "/" + app_name + "/" + StreamName
      let time = Date.parse(new Date()) / 1000 + 30 * 60;
      let concatStr = part_url + "-" + time + "-0-0-" + pull_key;
      let md5str = md5(concatStr)
      let authKey = time + "-0-0-" + md5str;
      let final_url = pull_url + part_url + "?auth_key=" + authKey;
      this.pushUrl = final_url
    },

    iosopenLive () {
      var data = { "type": "live", "rtmpUrl": this.pushUrl, "liveUrl": this.home };
      this.postData(data);
    },
    openLive () {
      try {
        // eslint-disable-next-line no-undef
        ykAPP.openLive(this.pushUrl, this.home)
      } catch (error) {
        this.$toast('错误')
      }
    },
    postData (data) {
      window.webkit.messageHandlers.ykApp.postMessage({ data });
    }
  }
};
</script>
<style lang='less' scoped>
.ce-shi {
  font-size: 14px;
  line-height: 1.2;
  height: 100%;
  overflow: auto;
  > div {
    margin: 10px 0;
  }
}
</style>
