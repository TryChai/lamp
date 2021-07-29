<template>
  <div class="container">
    <div class="uploadvideo" v-if="video_url==''">
      <div class="uploadvideo_left" style="width:100%">
        <div class="up_inp_refund " v-if="uploadDisabled">
          <input type="file" name="fileToUpload" class="fileToUpload" @change="onchange" ref="fileToUpload" style="display:none" accept="video/*" />
          <van-icon name="video" size="37px" color="#c2c2c2" @click="addvideo" />
          <p>添加视频</p>
        </div>
        <!-- <van-uploader :after-read="afterVedio" class="up_img_add" accept="video/*" v-if="uploadDisabled">
          <div class="up_inp_refund">
            <van-icon name="video" size="37px" color="#c2c2c2" />
            <p>添加视频</p>
          </div>
        </van-uploader> -->
        <van-circle style="margin:20px 0" size="120px" class="video-circle" v-else v-model="authProgress" :rate="0" :speed="0"
            :text="authProgress.toFixed(0) + '%'" />
        <div class="upload-type fx" style="justify-content: center">
          <van-button style="margin-left: 10px;" size="small" type="danger" @click="pauseUpload" :disabled="pauseDisabled">暂停</van-button>
          <van-button slot="trigger" size="small" type="danger" :disabled="resumeDisabled" @click="resumeUpload">恢复上传</van-button>
        </div>
      </div>
    </div>
    <div v-else>
      <van-uploader :after-read="afterVedio" accept="video/mp4" style="margin:10px 0">
        <van-button icon="video" type="primary" size="small">重新上传</van-button>
      </van-uploader>
      <div class="uploadvideo_right">
        <div class="uploadvideo_right_video">
          <video style="width:100%;    max-height: 250px;" controls="controls" id="my_video">
            <source :src="video_url" type="video/mp4">
          </video>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import kitx from "kitx";
import axios from "axios";
import { Circle } from 'vant';
const x2js = require('x2js')
export default {
  data () {
    return {
      $x2js: null,
      x2jsone: Object,
      video_url: "",
      video_pic: "",
      vid: "",
      fileTitle: "",
      timeout: "",
      partSize: "",
      parallel: "",
      retryCount: "",
      retryDuration: "",
      region: "cn-shanghai",
      userId: "1916570388667663",
      file: null,
      authProgress: 10,
      uploadDisabled: true,
      resumeDisabled: true,
      pauseDisabled: true,
      uploader: null,
      statusText: ""
    };
  },
  components: {
    [Circle.name]: Circle
  },
  props: {
    pro_src: {
      type: String,
      default: ""
    }
  },
  created () {
    this.$x2js = new x2js()
    console.log(this.$x2js.xml2js)
  },
  methods: {
    addvideo () {
      this.$refs.fileToUpload.dispatchEvent(new MouseEvent('click'))
    },
    close_video () {      //视频暂停1
      this.video_url = "";
      this.vid = "";
      this.statusText = "";
      this.fileTitle = "";
      document.getElementById("my_video").pause();
    },
    emitEvent (url, video_pic, video_id) {
      console.log(1111)
      this.$emit("send_url", { url, video_pic, video_id });
      this.vid = "";
      this.statusText = "";
      this.fileTitle = "";
    },
    get_plublic (parm) {
      //获取上传凭证
      var params = parm;
      params.Version = "2017-03-21";
      params.AccessKeyId = "LTAI377NJcUbneCs";
      params.SignatureMethod = "HMAC-SHA1";
      params.SignatureVersion = "1.0";
      params.Timestamp = this.timestamp();
      params.SignatureNonce = kitx.makeNonce();
      var methods = "GET";
      var normalized = this.normalize(params);
      var canonicalized = this.canonicalize(normalized);
      var stringToSign = `${methods}&${this.encode("/")}&${this.encode(
        canonicalized
      )}`;
      const key = "lFhNLkYJZEPGODPrfwDuyrZRMDXV2c&";
      var signature = kitx.sha1(stringToSign, key, "base64");
      normalized.push(["Signature", this.encode(signature)]);
      console.log(window.location.protocol)
      var send_url = window.location.protocol +
        "//vod.cn-shanghai.aliyuncs.com/?" + this.canonicalize(normalized);
      return send_url;
    },

    emitEventVod () {
      this.authProgress = 0;
      this.fileTitle = "";
      this.statusText = "";
      this.pauseDisabled = true;
      this.resumeDisabled = true;
      this.uploadDisabled = true;
    },
    onchange () {
      var file = this.$refs.fileToUpload.files[0];
      this.video_url = '';
      this.file = file;
      this.fileTitle = file.name;
      var userData = '{"Vod":{}}';
      if (this.uploader) {
        this.uploader.stopUpload();
        this.authProgress = 0;
        this.statusText = "";
      }
      this.uploader = this.createUploader();
      this.uploader.addFile(this.file, null, null, null, userData);
      this.uploadDisabled = false;
      this.pauseDisabled = true;
      this.resumeDisabled = true;

      this.authUpload();
    },
    afterVedio (e) {
      this.video_url = '';
      this.file = e.file;
      this.fileTitle = this.file.name;
      var userData = '{"Vod":{}}';
      if (this.uploader) {
        this.uploader.stopUpload();
        this.authProgress = 0;
        this.statusText = "";
      }
      this.uploader = this.createUploader();
      this.uploader.addFile(this.file, null, null, null, userData);
      this.uploadDisabled = false;
      this.pauseDisabled = true;
      this.resumeDisabled = true;

      this.authUpload();
    },
    authUpload () {
      // 然后调用 startUpload 方法, 开始上传
      if (this.uploader !== null) {
        this.uploader.startUpload();
        this.pauseDisabled = false;
      }
    },
    // 暂停上传
    pauseUpload () {
      if (this.uploader !== null) {
        this.uploader.stopUpload();
        this.resumeDisabled = false;
        this.pauseDisabled = true;
      }
    },
    // 恢复上传
    resumeUpload () {
      if (this.uploader !== null) {
        this.uploader.startUpload();
        this.resumeDisabled = true;
        this.pauseDisabled = false;
      }
    },
    createUploader (type) {
      let self = this;
      let uploader = new AliyunUpload.Vod({
        timeout: self.timeout || 60000,
        partSize: self.partSize || 1048576,
        parallel: self.parallel || 5,
        retryCount: self.retryCount || 3,
        retryDuration: self.retryDuration || 2,
        region: self.region,
        userId: self.userId,
        // 添加文件成功
        addFileSuccess: function (uploadInfo) {
          self.uploadDisabled = false;
          self.resumeDisabled = false;
          self.$toast.success({ text: "添加文件成功" });
          self.$emit('addfilesuccess')
        },
        // 开始上传
        onUploadstarted: function (uploadInfo) {
          // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          if (!uploadInfo.videoId) {
            //不存在
            let title = uploadInfo.file.name.substr(
              0,
              uploadInfo.file.name.lastIndexOf(".")
            );
            let params = {};
            params.Action = "CreateUploadVideo";
            params.Title = title;
            params.FileName = uploadInfo.file.name;
            let send_url = self.get_plublic(params);
            axios.get(send_url, params).then(res => {
              console.log(res)
              var data = self.$x2js.xml2js(res.data).CreateUploadVideoResponse;

              let uploadAuth = data.UploadAuth; //	上传凭证。
              let uploadAddress = data.UploadAddress; //上传地址。
              let videoId = data.VideoId; //	视频ID
              self.vid = data.VideoId;

              uploader.setUploadAuthAndAddress(
                uploadInfo,
                uploadAuth,
                uploadAddress,
                videoId
              );
            });
            self.statusText = "文件开始上传...";
          } else {
            // 如果videoId有值，根据videoId刷新上传凭证
            let params = {};
            params.Action = "RefreshUploadVideo";
            params.VideoId = uploadInfo.videoId;
            let send_url = self.get_plublic(params);
            axios.get(send_url, params).then(res => {
              var data = self.$x2js.xml2js(res.data).RefreshUploadVideoResponse;
              let uploadAuth = data.UploadAuth; //	上传凭证。
              let uploadAddress = data.UploadAddress; //上传地址。
              let videoId = data.VideoId; //	视频ID
              self.vid = data.VideoId;
              uploader.setUploadAuthAndAddress(
                uploadInfo,
                uploadAuth,
                uploadAddress,
                videoId
              );
            });
          }
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
          // console.log(
          //   "onUploadSucceed: " +
          //     uploadInfo.file.name +
          //     ", endpoint:" +
          //     uploadInfo.endpoint +
          //     ", bucket:" +
          //     uploadInfo.bucket +
          //     ", object:" +
          //     uploadInfo.object
          // );
          self.video_url = `http://media.vi5.cn/${uploadInfo.object}`;
          self.video_pic = `http://media.vi5.cn/snapshot/${uploadInfo.videoId}00001.jpg`
          self.video_id = uploadInfo.videoId;
          self.emitEvent(self.video_url, self.video_pic, self.video_id);
          self.statusText = "文件上传成功!";

        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          // console.log(
          //   "onUploadFailed: file:" +
          //     uploadInfo.file.name +
          //     ",code:" +
          //     code +
          //     ", message:" +
          //     message
          // );
          self.statusText = "文件上传失败!";
        },
        // 取消文件上传
        onUploadCanceled: function (uploadInfo, code, message) {
          // console.log(
          //   "Canceled file: " +
          //     uploadInfo.file.name +
          //     ", code: " +
          //     code +
          //     ", message:" +
          //     message
          // );
          self.statusText = "文件已暂停上传";
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function (uploadInfo, totalSize, progress) {
          // console.log(
          //   "onUploadProgress:file:" +
          //     uploadInfo +
          //     ", fileSize:" +
          //     totalSize +
          //     ", percent:" +
          //     Math.ceil(progress * 100) +
          //     "%"
          // );
          let progressPercent = Math.ceil(progress * 100);
          self.authProgress = progressPercent;
          self.statusText = "文件上传中...";
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
          let params = {};
          params.Action = "RefreshUploadVideo";
          params.VideoId = uploadInfo.videoId;
          let send_url = self.get_plublic(params);
          axios.get(send_url, params).then(res => {
            var data = self.$x2js.xml2js(res.data).RefreshUploadVideoResponse;
            let uploadAuth = data.UploadAuth; //	上传凭证。
            self.vid = data.VideoId;
            uploader.resumeUploadWithAuth(uploadAuth);
          });
          self.statusText = "文件超时...";
        },
        // 全部文件上传结束
        onUploadEnd: function (uploadInfo) {
          self.$toast.success({ text: "文件上传完毕" });
          self.statusText = "文件上传完毕";

        }
      });
      return uploader;
    },

    timestamp () {
      var date = new Date();
      var YYYY = date.getUTCFullYear();
      var MM = kitx.pad2(date.getUTCMonth() + 1);
      var DD = kitx.pad2(date.getUTCDate());
      var HH = kitx.pad2(date.getUTCHours());
      var mm = kitx.pad2(date.getUTCMinutes());
      var ss = kitx.pad2(date.getUTCSeconds());
      // 删除掉毫秒部分
      return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
    },
    canonicalize (normalized) {
      var fields = [];
      for (var i = 0; i < normalized.length; i++) {
        var [key, value] = normalized[i];
        fields.push(key + "=" + value);
      }
      return fields.join("&");
    },
    encode (str) {
      var result = encodeURIComponent(str);

      return result
        .replace(/\!/g, "%21")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
    },
    replaceRepeatList (target, key, repeat) {
      for (var i = 0; i < repeat.length; i++) {
        var item = repeat[i];

        if (item && typeof item === "object") {
          const keys = Object.keys(item);
          for (var j = 0; j < keys.length; j++) {
            target[`${key}.${i + 1}.${keys[j]}`] = item[keys[j]];
          }
        } else {
          target[`${key}.${i + 1}`] = item;
        }
      }
    },
    flatParams (params) {
      var target = {};
      var keys = Object.keys(params);
      for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = params[key];
        if (Array.isArray(value)) {
          this.replaceRepeatList(target, key, value);
        } else {
          target[key] = value;
        }
      }
      return target;
    },
    normalize (params) {
      var list = [];
      var flated = this.flatParams(params);
      var keys = Object.keys(flated).sort();
      for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = flated[key];
        list.push([this.encode(key), this.encode(value)]); //push []
      }
      return list;
    }
  },
  watch: {
    pro_src (old) {
      this.video_url = old;
      // document.getElementById("my_video").play();
    }
  }
};
</script>
<style lang='less' scoped>
.filebox {
  /* display: flex;
  justify-content: flex-start;
  align-items: center; */
}
.upload > div:nth-of-type(1) {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.container {
  text-align: center;
  line-height: 1;
}
.upload-type {
  width: 100%;
  display: flex;
  margin: 10px 0;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  button {
    margin: 0 10px;
  }
}
.filebox {
}
.filebox .filebtn {
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.filebox .flletit {
  width: 100%;
  height: 100%;
}

.container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #ffffff;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.uploadvideo {
  width: 100%;
  height: 90%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
.filebox {
  width: 100px;
  height: 32px;
  color: #fff;
  background-color: #17b3a3;
  border-color: #17b3a3;
  position: relative;
  border-radius: 3px;
  text-align: center;
  line-height: 32px;
}
.flletit {
  font-size: 14px;
}
.filetitle {
  font-size: 14px;
  color: #000000;
  float: left;
  padding-left: 20px;
}

.uploadvideo_item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0;
}
.uploadvideo_item span {
  font-size: 14px;
  width: 100px;
  height: 32px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  position: relative;
  border-radius: 3px;
  text-align: center;
  line-height: 32px;
}
.status {
  width: 100px;
  height: 32px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

.up_inp_refund {
  p {
    color: #c2c2c2;
    font-size: 13px;
    margin-top: 3px;
  }
}
.up_img_add {
  width: 80.1px;
  height: 80.1px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
}
</style>
