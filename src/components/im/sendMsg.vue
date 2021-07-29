<template>
  <div class="jstx_bottom" :style="{position:(isAndroid?'fixed':'absolute')}" :class="{maMes:showFou}" id="mes-foot-box">
    <div class="jstx_bottom_sr fx" id="mes" ref="mes">
      <div style="display: flex;justify-content: center;align-items: center;" v-if="$fnc.isapp() || $fnc.isYkAPP()">

        <img src="./../../assets/img/im/li10.png" v-if="is_voice == false" @click="openvoice()" class="voice_btn" alt="">
        <van-icon name="edit" size="32px" v-else style="    margin-right: 10px;" @click="is_voice =false" color="#999999" />
      </div>

      <div class="chat_test" v-if="is_voice == true">
        <saybtn></saybtn>
      </div>
      <div class="chat_test" v-else>
        <van-cell-group :border="false" style="flex: 1;">
          <van-field v-model="messageContent" type="textarea" ref="input_txt" @blur="getFocus" @focus="getBlur" @input="handleTextInput"
              :placeholder="$h('请输入信息...')" rows="1" autosize />
        </van-cell-group>

        <div class="send-right">
          <img class="jstx_bottom_sr_img" src="../../assets/img/im/bq.png" @click="showEmotionDialog()" />
          <button class="jstx_bottom_sr_bt" @mousedown="cancel_blur($event)" @click="sendTextMessage($event)">{{$h('发送')}}</button>
        </div>
      </div>

    </div>
    <div v-show="emotionFlag" class="emjoy_test">
      <van-tabs v-model="active" :swipeable="true">
        <van-tab>
          <div slot="title">
            <img class="jstx_bottom_sr_img" src="../../assets/img/im/bq.png" />
          </div>
          <van-image style="margin:5px" @click="chooseEmoji(item)" v-for="(item,index) in emojiName" v-show="emoji.img!=''" :key="index"
              :src="emojiUrl + emojiMap[item]" width="30" height="30" />
        </van-tab>
        <van-tab class="tl">
          <div slot="title">
            <van-icon name="iconfont icon-dice" class="iconfont icon-dice" size="24px" />
          </div>
          <van-icon name="iconfont icon-dice" class="iconfont icon-dice" size="60px" style="margin:20px 0 0 20px" @click="sendDice" />
        </van-tab>
        <van-tab>
          <div slot="title">
            <img src="../../assets/img/im/menu4.png" class="jstx_bottom_nav_img" />
          </div>
          <van-image style="margin:5px" @click="sendTextEmojiImg(item)" v-for="(item,index) in emojiName1" :key="index" v-show="emoji.img!=''"
              :src="emojiMap1[item]" width="60" height="60" />
        </van-tab>
      </van-tabs>
    </div>
    <div style="    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;">
      <!-- <van-uploader :after-read="onRead" class="tc jstx_bottom_nav f_l" accept="image/*"> -->
      <div class="jstx_bottom_nav f_l tc" @click="handleSendImageClick">
        <img src="../../assets/img/im/menu4.png" class="jstx_bottom_nav_img" />
      </div>

      <!-- </van-uploader> -->

      <div class="tc jstx_bottom_nav f_l" @click="show=true" v-if="!isTeam">
        <img src="../../assets/img/im/menu1.png" class="jstx_bottom_nav_img" />
      </div>
      <!-- <div class="tc jstx_bottom_nav f_l"
                @click="recommended"
                v-if="!isTeam">
                <img src="../../assets/img/im/menu6.png"
                    class="jstx_bottom_nav_img" />
      </div>-->
      <!-- <div class="tc jstx_bottom_nav f_l" @click="showShareShops=true">
        <img src="../../assets/img/im/menu3.png" class="jstx_bottom_nav_img" />
      </div>
      <div class="tc jstx_bottom_nav f_l" @click="showShareNews=true">
        <img src="../../assets/img/im/menu5.png" class="jstx_bottom_nav_img" />
      </div> -->
      <div class="cb"></div>
    </div>
    <div></div>
    <input type="file" @blur="windowScorll" id="imagePicker" ref="imagePicker" accept="image/*" @change="sendImage" style="display:none" />

    <!-- 表情 -->
    <!-- <van-popup v-model="emotionFlag"
            class="emotion"
            position="bottom"
            style="height:40%">

    </van-popup>-->

    <!-- 红包 -->
    <van-popup v-model="show" class="hongbao" position="bottom">
      <playhb :list="user" @closePlay="getchanbank" @hbsucc="gethbsucc" v-if="show" />
    </van-popup>
    <van-popup v-model="showHb" class="hbdetails" position="right">
      <hbdetails @closeHb="getcloseHb" :list="user" :info="hbinfo" />
    </van-popup>

    <van-popup v-model="showAtGroupMember" style="height:100;overflow-y:scroll;" :overlay="true" get-container="body" position="bottom">
      <van-radio-group v-model="atUserID" @change="handleSelectAtUser">
        <van-cell-group v-for="member in memberList" :key="member.userID">
          <van-cell :title="member.nick" clickable @click="atUserID == member.userID">
            <van-radio slot="right-icon" :name="member.userID" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
    <van-popup v-model="showShareNews" class="hongbao" position="bottom">
      <mes-foote-new @closePlay="getchanbank" @sendInfo="getSendInfo" v-if="showShareNews" />
    </van-popup>

    <van-popup v-model="showShareShops" class="hongbao" position="bottom">
      <mes-foote-shops @closePlay="getchanbank" @sendInfo="getSendInfo" v-if="showShareShops" />
    </van-popup>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { Field, Image } from "vant";
import playhb from "./imhb/playhb";
import hbdetails from "./imhb/hbdetails";
import { emojiMap, emojiName, emojiUrl } from "../../utils/emojiMap";
import { emojiMap1, emojiName1 } from "../../utils/emoji2";
import mesFooteNew from "./mes-foote/mes-foote-new";
import mesFooteShops from "./mes-foote/mes-foote-shops";
import saybtn from "./say/saybtn"
export default {
  name: "",
  data () {
    return {
      is_voice: false,    //输入框
      env_tpye: null,
      innerHeight: 0,
      showShareNews: false,
      showShareShops: false,
      active: 0,
      messageContent: "",
      emotionFlag: false,
      emoji: [],
      emojiName1: emojiName1,
      emojiMap1: emojiMap1,
      money: "",
      isTeam: false,
      isSendCustomMessage: false,
      sendCustomDialogVisible: false,
      form: {
        data: "",
        description: "",
        extension: ""
      },
      file: "",
      emojiMap: emojiMap,
      emojiName: emojiName,
      emojiUrl: emojiUrl,
      showAtGroupMember: false,
      atUserID: "",
      showFou: false,
      //红包
      showHb: false,
      show: false,
      hbinfo: {},
      user: {},
      isAndroid: false
    };
  },
  components: {
    [Field.name]: Field,
    [Image.name]: Image,
    playhb,
    hbdetails,
    mesFooteNew,
    mesFooteShops,
    saybtn,
  },
  computed: {
    ...mapGetters(["toAccount", "currentConversationType"]),
    ...mapState({
      memberList: state => state.group.currentMemberList
    })
  },
  created () {
    var id = this.$route.query.id || "";
    if (id.indexOf("admin") >= 0) {
      this.isTeam = true;
    } else if (id.indexOf("team") == -1) {
      this.isTeam = false;
    } else {
      this.isTeam = true;
    }
    this.innerHeight = window.innerHeight;
  },
  mounted () {
    // var u = navigator.userAgent;
    // const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //android终端
    // this.isAndroid = !isAndroid;

    var u = navigator.userAgent;
    const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //android终端

    if (isAndroid == true) {
      //安卓
      if (this.$fnc.isYkAPP()) {
        this.env_tpye = 2; //安卓app
      } else {
        this.env_tpye = 1; //安卓H5
      }
    } else {
      if (this.$fnc.isYkAPP()) {
        this.env_tpye = 4; //IOSapp
      } else {
        this.env_tpye = 3; //IOSH5
      }
    }
    if (isAndroid) {
      const el = document.documentElement || document.body;
      const originHeight = el.clientHeight;
      window.addEventListener(
        "resize",
        () => {
          const resizeHeight = el.clientHeight;
          if (resizeHeight < originHeight) {
            // alert('键盘弹起')
            this.$bus.$emit("scroll-bottom");
          } else {
            // alert('键盘收起')
          }
        },
        false
      );
    }
  },
  methods: {
    openvoice () {
      this.is_voice = true
      if (this.$fnc.isapp() || this.$fnc.isYkAPP()) {
        this.$fnc.appstartRecord()
        setTimeout(() => {
          this.$fnc.appcancelRecord()
        }, 500);
      }
    },
    getSendInfo (item, str) {
      this.showShareNews = false;
      this.showShareShops = false;
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: str,
          description: JSON.stringify(item),
          extension: ""
        }
      });

      this.$store.commit("setUnStatusShop", message);
      this.$store.commit("pushCurrentMessageList", message);
      this.tim.sendMessage(message);
      this.$bus.$emit("scroll-bottom");
      this.getTime({ content: '', im: this.toAccount });
    },
    click_msg () {
      if (this.emotionFlag == true) {
        this.emotionFlag = false;
      }
    },
    gethbsucc (obj) {
      this.sendOneHb(obj.content, obj.oid);
    },
    onSendMsg () {
      this.getTime({ content: this.messageContent, im: this.toAccount });
      var id = this.$route.query.id || "";
      if (id.indexOf("_admin_") >= 0) {
        var params = {};
        params.im = id;
        params.keyword = this.messageContent;
        this.$api.getIm.sendMsg(params);
      }
    },
    handleTextInput (value) {
      if (
        value.slice(-1) === "@" &&
        this.currentConversationType === this.TIM.TYPES.CONV_GROUP &&
        this.memberList.length > 0
      ) {
        // this.atUserID = this.memberList[0].userID;
        this.showAtGroupMember = true;
      } else {
        this.showAtGroupMember = false;
      }
    },

    handleSelectAtUser () {
      this.messageContent += this.atUserID + " ";
      this.showAtGroupMember = false;
    },
    handleUp () {
      const index = this.memberList.findIndex(
        member => member.userID === this.atUserID
      );
      if (index - 1 < 0) {
        return;
      }
      this.atUserID = this.memberList[index - 1].userID;
    },
    handleDown () {
      const index = this.memberList.findIndex(
        member => member.userID === this.atUserID
      );
      if (index + 1 >= this.memberList.length) {
        return;
      }
      this.atUserID = this.memberList[index + 1].userID;
    },
    handleEnter () {
      if (this.showAtGroupMember) {
        this.handleSelectAtUser();
      } else {
        this.sendTextMessage();
      }
    },
    sendTextEmojiImg (msg) {
      const message = this.tim.createTextMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: { text: msg }
      });
      this.onSendMsg();
      this.$store.commit("pushCurrentMessageList", message);
      this.$bus.$emit("scroll-bottom");
      this.tim.sendMessage(message);
      this.emotionFlag = false;
      this.getTime({ content: '', im: this.toAccount });
    },
    cancel_blur () {
      if (this.emotionFlag == false) {
        event.preventDefault();
      }
    },
    sendTextMessage () {
      if (
        this.messageContent === "" ||
        this.messageContent.trim().length === 0
      ) {
        this.messageContent = "";
        this.$toast("不能发送空消息哦！");
        return;
      }
      if (this.emotionFlag == true) {
        this.emotionFlag = false;
      }
      const message = this.tim.createTextMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: { text: this.messageContent }
      });
      this.onSendMsg();
      this.$store.commit("pushCurrentMessageList", message);
      this.$bus.$emit("scroll-bottom");
      this.tim.sendMessage(message);
      this.messageContent = "";
      this.atUserID = "";
      this.showAtGroupMember = false;
      this.$refs.input_txt.blur();
      // this.getTime({ content: this.messageContent, im: this.toAccount });
    },
    sendCustomMessage () {
      if (
        this.form.data.length === 0 &&
        this.form.description.length === 0 &&
        this.form.extension.length === 0
      ) {
        this.$toast("不能发送空消息");
        return;
      }
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: this.form.data,
          description: this.form.description,
          extension: this.form.extension
        }
      });
      this.$store.commit("pushCurrentMessageList", message);
      this.tim.sendMessage(message);
      Object.assign(this.form, {
        data: "",
        description: "",
        extension: ""
      });
      this.sendCustomDialogVisible = false;
      this.atUserID = "";
      this.getTime({ content: '', im: this.toAccount });
    },
    random (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    sendDice () {
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: "dice",
          description: String(this.random(1, 6)),
          extension: ""
        }
      });
      this.$store.commit("pushCurrentMessageList", message);
      this.emotionFlag = false;

      this.tim.sendMessage(message);
      this.getTime({ content: '', im: this.toAccount });
    },
    sendOneHb (content, oid) {
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: "oneHb",
          description: content,
          extension: oid
        }
      });
      this.$store.commit("pushCurrentMessageList", message);
      this.emotionFlag = false;

      this.tim.sendMessage(message);
      this.getTime({ content: '', im: this.toAccount });
    },
    chooseEmoji (item) {
      // this.emotionFlag = false;
      this.messageContent += item;
    },
    handleSendImageClick () {
      this.$refs.imagePicker.click();
    },
    handleSendFileClick () {
      this.$refs.filePicker.click();
    },
    sendImage () {
      const message = this.tim.createImageMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: document.getElementById("imagePicker") // 或者用event.target
        },
        onProgress: percent => {
          this.$set(message, "progress", percent); // 手动给message 实例加个响应式属性: progress
        }
      });

      this.$store.commit("pushCurrentMessageList", message);
      this.tim
        .sendMessage(message)
        .catch(imError => this.$message.error(imError.message));
      this.$refs.imagePicker.value = null;
      this.getTime({ content: '', im: this.toAccount });
    },
    sendFile () {
      const message = this.tim.createFileMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          file: document.getElementById("filePicker") // 或者用event.target
        },
        onProgress: percent => {
          this.$set(message, "progress", percent); // 手动给message 实例加个响应式属性: progress
        }
      });
      this.$store.commit("pushCurrentMessageList", message);
      this.tim
        .sendMessage(message)
        .catch(imError => this.$message.error(imError.message));
      this.$refs.filePicker.value = null;
      this.getTime({ content: '', im: this.toAccount });
    },
    sendTeamYq (params) {
      const message = this.tim.createCustomMessage({
        to: this.toAccount,
        conversationType: this.currentConversationType,
        payload: {
          data: "teamYq",
          description: JSON.stringify(params),
          extension: ""
        }
      });
      this.$store.commit("pushCurrentMessageList", message);
      this.emotionFlag = false;

      this.tim.sendMessage(message);
      this.getTime({ content: '', im: this.toAccount });
    },
    getcloseHb (bool) {
      this.showHb = bool;
    },
    getchanbank (bool) {
      this.show = bool;
      this.showShareNews = false;
      this.showShareShops = false;
    },
    getTime (params) {
      // var time = parseInt(this.$store.state.imreward) || "";
      // if (time == "" || new Date().getTime() > time) {
      params = params || {};
      this.$api.getIm.sendMsgSms(params).then(res => {
        // var t;
        if (res.code == 200) {
          // t = new Date().getTime()+3600000;
        }
        // this.setImReward(t);
        // this.$store.commit("setImReward", t);
      });
      // }
    },
    alertMsg () {
      // this.$toast("暂未开放");
    },

    getBlur () {
      this.$bus.$emit("scroll-bottom");

      if (this.emotionFlag == true) {
        this.emotionFlag = false;
      }

      const body = document.getElementsByTagName("body")[0]; // 兼容获取body
      const clientHeight = body.clientHeight; //可见高
      const fixHeight = clientHeight / 2; // 定位高，弹出键盘时input距浏览器上部的距离，自己定义合适的

      const top = document.querySelector(".jstx_top"); // 表单内容部分
      const msg_box = document.querySelector("#msg_box"); // 表单内容部分

      var el = document.getElementById("mes-foot-box");
      setTimeout(function () {
        el.scrollIntoView(true);
        // msg_box.scrollIntoView(false);
        // msg_box.scrollTop = msg_box.scrollHeight;
        //下面方法解释中 true 是在可视区域的顶部，但是在我实际使用中发现他是在可视区域的底部
      }, 300);
      if (this.env_tpye == 4 || this.env_tpye == 3) {
        this.$nextTick(() => {
          var top_val =
            Number(clientHeight) - Number(fixHeight) - top.offsetHeight;
          top.style.top = top_val + "px";
          msg_box.style.top = top_val + "50" + "px";
          this.$bus.$emit("scroll-bottom");
        });
      }
      // }

      // this.showFou = true;
      // setTimeout(
      //   () => (document.body.scrollTop = document.body.scrollHeight),
      //   500
      // );
    },
    getElementOffsetTop (el) {
      let top = el.offsetTop;
      let cur = el.offsetParent;
      while (cur != null) {
        top += cur.offsetTop;
        cur = cur.offsetParent;
      }
      return top;
    },
    getFocus () {
      setTimeout(() => {
        this.showFou = false;
        // this.emotionFlag = false
        window.scroll(0, 0);
      }, 200);
      if (this.env_tpye == 4 || this.env_tpye == 3) {
        const top = document.querySelector(".jstx_top"); // 表单内容部分
        const msg_box = document.querySelector("#msg_box"); // 表单内容部分
        top.style.top = "0px";
        msg_box.style.top = "50px";
      }
    },
    onRead (file) {
      this.cpimgOk(file.content);
    },
    cpimgOk (file) {
      let that = this;
      var img = new Image();
      img.src = file;
      // base64地址图片加载完毕后执行
      img.onload = function () {
        // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        // 图片原始尺寸
        var originWidth = img.width;
        var originHeight = img.height;
        // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
        var maxWidth = 750,
          maxHeight = 750;
        // 目标尺寸
        var targetWidth = originWidth,
          targetHeight = originHeight;
        // 图片尺寸超过最大尺寸的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更改宽度，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        //对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
        //压缩后的base64文件
        var newUrl = canvas.toDataURL("image/jpeg", 0.92);
        let file = that.convertBase64UrlToBlob(newUrl);
        var fd = new FormData();
        fd.append("file", file, "file_" + Date.parse(new Date()) + ".jpg");
        // fd.append("folder", 'product');
        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        axios.post("/api/common/upload/index/", fd, config).then(res => {
          if (res.data.code == 200) {
            im.uploadPic(res.data.result);
          } else {
            that.$toast.fail("图片上传失败");
          }
        });
      };
    },
    convertBase64UrlToBlob (urlData) {
      let bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
    },
    showEmotionDialog () {
      this.emotionFlag = !this.emotionFlag;
      if (this.emotionFlag == true) {
        const regDom = document.querySelector("#im-content"); // 获取页面根元素
        regDom.style.top = 0;
      }
    },
    recommended () {
      var params = {};
      var im = this.$route.query.id || "";
      if (im.indexOf("C2C") >= 0) {
        im = im.replace("C2C", "");
      }
      params.im = im;
      this.$api.getIm.addRecom(params).then(res => {
        if (res.code == 200) {
          this.sendTeamYq(res.result);
        }
      });
    },
    redsend (oid) {
      this.$api.getIm.getHongBao({ oid }).then(res => {
        if (res.code == 200) {
          this.hbinfo = res.result;
          this.showHb = true;
        }
      });
    },
    redenvelope () {
      //发送红包成功运行
      // im.redenvelope("恭喜发财",1);
    }
  },
  watch: {
    emotionFlag (old) {
      if (old == true) {
        setTimeout(() => {
          var mes_height = this.$refs.mes.offsetHeight;
          var msg_box = document.querySelector(".message-list"); // 表单内容部分
          msg_box.style.marginBottom = mes_height + "px";
          this.$bus.$emit("scroll-bottom");
        }, 100);
      } else {
        setTimeout(() => {
          var msg_box = document.querySelector(".message-list"); // 表单内容部分
          msg_box.style.marginBottom = 0 + "px";
          this.$bus.$emit("scroll-bottom");
        }, 100);
      }
    }
  }
};
</script>
<style lang='less' scoped>
.hbdetails {
  width: 100%;
  background: none !important;
}
.hongbao {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 0 !important;
}
.maMes {
  bottom: 20px !important;
}
#mes {
  align-items: center;
}
.send-right {
  width: auto;
  // min-width: px;

  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  // z-index: 999999;
}
.jstx_bottom {
  position: fixed;
  min-height: 2.29333rem;
  bottom: 0;
  width: 100%;
  padding: 0 0.21333rem;
  background: #f4f5f6;
  z-index: 1;
}
.jstx_bottom_sr {
  width: 100%;
  //   height: 48px;
  // background-color: #fff;
  border-radius: 10px;
  // margin: 4px 4px;
  align-items: flex-end;
}

.jstx_bottom_sr_bt {
  border: none;
  width: 56px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  background-color: #0ad095;
  border-radius: 10px;
  font-size: 13px;
  margin: 0px 5px 0 5px;
  //   padding-bottom: 10px;
}

.jstx_bottom_sr_img {
  height: 23px;
  width: 23px;
  margin-right: 5px;
  //   margin: 0px -20px 0 0;
  //   position: relative;
  //   top: -4px;
}
.jstx_bottom_sr_inp {
  background: fff;
  border: none;
  height: 26px;
  line-height: 26px;
  margin: 0px 0 0 20px;
  width: 200px;
  font-size: 16px;
}
.jstx_bottom_nav {
  width: 50%;
  height: 38px;
  line-height: 38px;
  // padding-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.jstx_bottom_nav_img {
  width: 24px;
}
.jstx_bottom_nav > div {
  color: #999999;
  // height: 12px;
  // line-height: 12px;
}
.emoji {
  /* height: 136px; */
  display: flex;
  flex-wrap: wrap;
  /* overflow: scroll; */
}
.emoji image {
  width: 68px;
  height: 68px;
}
.im_reward {
  position: fixed;
  top: -45px;
  left: 0;
  right: 0;
  z-index: 2;
  text-align: center;
  opacity: 0;
  margin-left: auto;
  margin-right: 0;
}
.ani {
  animation: reward 3s linear 2s 1;
}
.cardp {
  width: 80px;
  height: 80px;
  display: block;

  margin: 0 auto 5px auto;
}
.jb {
  animation: jbb 2s linear 0s infinite;
}
@keyframes jbb {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}
@keyframes reward {
  0% {
    top: 10px;
    opacity: 1;
  }
  50% {
    top: 250px;
  }
  60% {
    opacity: 1;
    top: 250px;
  }
  100% {
    opacity: 0;
    top: 250px;
  }
}
.bg_im {
  padding: 4px 8px;
  color: #fff;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 27px;
  text-align: center;
  line-height: 1.4;
  display: inline-block;
  margin: 0 auto;
}
.jstx_bottom {
  /* position: relative !important; */
}
.emjoy_test {
  width: 100%;
  height: 300px;
  // background-color: red;
  overflow: auto;
}
.chat_test {
  width: 100%;
  // min-height: 100px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 5px;
  > span {
    font-size: 14px;
    color: #333333;
    min-height: 40px;
    line-height: 40px;
  }
  // padding: 5px 0;
}
.voice_btn {
  width: 20px;
  margin-right: 10px;
}
</style>
