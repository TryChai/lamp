<template>
  <div id="app">
    <div class="app-box">
      <div style="height: 100%" @touchstart="touchstart($event)" @touchend="touchend($event)">
        <transition :name="transitionName">
          <navigation>
            <router-view></router-view>
          </navigation>
        </transition>
      </div>
      <navfooter v-show="showTabar" />
    </div>
    <announcement></announcement>
    <bin-ding-phone v-if="$store.state.showBingPhone" />
    <bind-share v-if="$store.state.isTsShare" />
    <!-- 分享 -->
    <van-popup v-model="share_show" position="top" get-container="body" class="share-zd" style="height: 100%; background-color: transparent"
        @click="hideShare">
      <img src="./assets/img/shop/share-wx.png" alt style="width: 100%" />
    </van-popup>
    <van-dialog v-model="show_agree" title="用户协议和隐私政策" confirmButtonText="同意" @confirm="onConfirmAgree" :showCancelButton="true" show-cancel-button>
      <agreement />
    </van-dialog>
  </div>
</template>
<script>
import announcement from "@/components/currency/announcement.vue";
import binDingPhone from "@/components/currency/binDingPhone/binDingPhone.vue";
import BindShare from "@/components/currency/bindShare/BindShare.vue";
import Cookies from "js-cookie";

import { mapGetters, mapState } from "vuex";

import { Notify } from "vant";
import navfooter from "@/components/currency/navfooter";
import agreement from "@/components/currency/agreement/agreement.vue";
var configDeviceId = function (uuid) {
  window.vue1.$store.commit("setAppUuid", uuid);
};
window.configDeviceId = configDeviceId;
export default {
  name: "app",
  data () {
    return {
      startx: "",
      starty: "",
      is_xcx: false,
      transitionName: "fade",
      userList: [],
      share_show: false,
      show_agree: false,
    };
  },
  components: {
    announcement,
    binDingPhone,
    BindShare,
    navfooter,
    agreement,
  },
  created () {
    if (
      this.$fnc.isWx() == true &&
      this.is_xcx == false &&
      Cookies.get("appletUser") &&
      this.$store.state.user &&
      this.$store.state.user.wx_drop_out == true
    ) {
      this.$api.getUser.loginOut({}).then((res) => {
        if (res.code == 200) {
          try {
            this.$store.commit("loginOut");
            this.$store.dispatch("logout");
          } catch (error) {
            this.$router.replace({ path: "/login" });
          }
        }
      });
    }

    window.vue1 = this;
    this.$store.commit("setTerminal");
    sessionStorage.getItem("appstore") &&
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("appstore"))
        )
      );
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("appstore", JSON.stringify(this.$store.state));
    });
    document.title = this.$store.state.appTitle;

    this.$navigation.on("forward", () => {
      this.transitionName = "van-slide-left";
    });
    this.$navigation.on("back", () => {
      this.transitionName = "van-slide-right";
    });
    this.$navigation.on("replace", () => {
      this.transitionName = "van-slide-left";
    });
    this.$navigation.on("refresh", () => {
      this.transitionName = "";
    });
    this.$navigation.on("reset", () => { });

    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
      this.clearanimation(); //IOS下不显示动画
      sessionStorage.setItem("isiOS", true);
    } else {
      sessionStorage.setItem("isiOS", false);
    }

    //小程序环境下不显示页面切换动画
    if (
      sessionStorage.getItem("is_XcX") == null ||
      sessionStorage.getItem("is_XcX") == undefined
    ) {
      this.$fnc
        .isXcx()
        .then((res) => {
          if (res == "true" || res == true) {
            this.is_xcx = true;
            sessionStorage.setItem("is_XcX", true);
            this.clearanimation();
          } else {
            sessionStorage.setItem("is_XcX", false);
          }
        })
        .catch(() => {
          sessionStorage.setItem("is_XcX", false);
        });
    } else {
      if (sessionStorage.getItem("is_XcX") == false) {
        sessionStorage.setItem("is_XcX", false);
      } else {
        this.clearanimation();
      }
    }

    if (
      localStorage.getItem("nowlan") &&
      JSON.stringify(this.$store.state.nowlanguage) == "{}"
    ) {
      //如果存在选择语言，则设置为默认语言
      this.$store.commit(
        "set_nowlanguage",
        JSON.parse(localStorage.getItem("nowlan"))
      );
    }
  },

  computed: {
    ...mapState({
      currentUserProfile: (state) => state.imUser.currentUserProfile,
      currentConversation: (state) => state.conversation.currentConversation,
      isLogin: (state) => state.imUser.isLogin,
      isSDKReady: (state) => state.imUser.isSDKReady,
      isShowWxAppShare: (state) => state.isShowWxAppShare,
      showTabars: (state) => state.showTabar,
    }),
    groupList: function () {
      return this.$store.state.group.groupList;
    },
    ...mapGetters(["toAccount"]),
    getUser () {
      return this.$store.state.user;
    },
    toImLogin () {
      if (
        this.isSDKReady &&
        this.isLogin &&
        this.$route.path.indexOf("/im/mes") >= 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    showTabar () {
      return this.showTabars;
    },
  },
  watch: {
    $route (to) {
      // app审核用的弹窗
      // var agreementIndex = Cookies.get("agreementIndex")
      //   ? JSON.parse(Cookies.get("agreementIndex"))
      //   : "0";
      // if (agreementIndex == 0 && this.$fnc.isYkAPP()) {
      //   if (to.path == "/useragreement") {
      //     this.show_agree = false;
      //   } else if (to.path == "/page/index") {
      //     this.show_agree = true;
      //   }
      // }

      if (to.name != "addorder" && localStorage.getItem("pay_order_id")) {
        localStorage.removeItem("pay_order_id");
      }
      if (to.meta.tab) {
        this.$store.commit("setShowTabbar", true);
      } else {
        this.$store.commit("setShowTabbar", false);
      }
      if (
        to.path != "/im/mes" &&
        to.path != "/im/kf" &&
        to.path != "/im/wechat/chat"
      ) {
        this.$store.commit("setUnStatusShop", {});
      }
      if (
        to.name != "mes" &&
        to.path != "/im/wechat/info" &&
        to.path != "/im/wechat/chat" &&
        this.currentConversation &&
        this.currentConversation.conversationID
      ) {
        this.$store.commit("updateCurrentConversation", ""); //清空消息
      }
      if (to.name == "feiyan") {
        document.title = "福州人，快来查看你附近的疫情信息";
      } else if (this.$store.state.config.shop) {
        document.title = this.$store.state.config.shop.head;
      }
      var foot = Cookies.get("foot")
        ? JSON.parse(Cookies.get("foot"))
        : { links: "" };
      if (
        to.path != "/" &&
        to.path != "/index" &&
        foot.links.indexOf(to.path) == -1
      ) {
        // sessionStorage.setItem("is_announ", JSON.stringify(false));
      }
      if (
        to.name != "news_detail" &&
        to.name != "cut_detail" &&
        to.name != "shopdetails" &&
        to.name != "supplier-shop-details" &&
        to.name != "assembleDetails" &&
        to.name != "feiyan" &&
        to.name != "live_play" &&
        to.name != "studio" &&
        to.name != "live_replydetail" &&
        to.name != "paydetails" &&
        to.name != "trylisten" &&
        to.name != "driver_index" &&
        to.name != "ewm"
      ) {
        setTimeout(() => {
          this.getWxShare(); //不需要自定义分享的页面
          this.$store.commit("restAppShareObj");
        }, 500);
      }
      if (this.$store.state.appUuid == "") {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (this.$fnc.isYkAPP()) {
          if (!isiOS) {
            try {
              // eslint-disable-next-line no-undef
              this.$store.commit("setAppUuid", ykAPP.deviceId());
            } catch (error) {
              new Error(error);
            }
          }
        }
      }

      //添加CNZZ统计链接到script
      if (
        this.$store.state.config &&
        this.$store.state.config.shop &&
        this.$store.state.config.shop.cnzz_url
      ) {
        var script = document.getElementsByTagName("script");
        var bool = true;
        var el = null;
        for (var i in script) {
          if (script[i].src == this.$store.state.config.shop.cnzz_url) {
            bool = false;
            break;
          }
        }
        if (bool) {
          el = document.createElement("script");
          el.type = "text/javascript";
          el.src = this.$store.state.config.shop.cnzz_url;
          document.getElementsByTagName("head")[0].appendChild(el);
        }
      }
    },
    getUser (val) {
      if (!this.$store.state.isLogin && JSON.stringify(val) != "{}") {
        if (val.im) {
          this.$nextTick(() => {
            this.$store.dispatch("login", {
              userID: val.im,
              userSig: val.im_sig,
            });
          });
        }
      }
    },
    isShowWxAppShare (val) {
      if (val) {
        this.share_btn();
      }
    },
  },
  mounted () {
    this.initListener();
    // document.getElementById("app").style.display = "block";
    // document.getElementById('appLoading').style.display = 'none';
  },

  methods: {
    onConfirmAgree () {
      Cookies.set("agreementIndex", 1, { expires: 360 });
    },
    touchend (e) {
      // if (this.$fnc.isapp() || this.$fnc.isYkAPP()) {
      //   return
      // }
      // if (e.changedTouches[0].target.offsetParent.className.indexOf('swipe') >= 0 || e.changedTouches[0].target.offsetParent.className.indexOf('phone_menu1') >= 0) {
      //   return
      // }
      // var endx, endy;
      // endx = e.changedTouches[0].pageX;
      // endy = e.changedTouches[0].pageY;
      // var direction = this.getDirection(this.startx, this.starty, endx, endy);
      // switch (direction) {
      //   case 4:
      //     this.toBack();
      //     break;
      //   default:
      // }
    },
    touchstart (e) {
      this.startx = e.touches[0].pageX;
      this.starty = e.touches[0].pageY;
    },
    getAngle (angx, angy) {
      return (Math.atan2(angy, angx) * 180) / Math.PI;
    },
    getDirection (startx, starty, endx, endy) {
      var angx = endx - startx;
      var angy = endy - starty;
      var result = 0;
      //如果滑动距离太短
      if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
        return result;
      }
      var angle = this.getAngle(angx, angy);
      if (angle >= -135 && angle <= -45) {
        result = 1;
      } else if (angle > 45 && angle < 135) {
        result = 2;
      } else if (
        (angle >= 135 && angle <= 180) ||
        (angle >= -180 && angle < -135)
      ) {
        result = 3;
      } else if (angle >= -45 && angle <= 45) {
        result = 4;
      }
      return result;
    },
    clearanimation () {
      this.$navigation.on("forward", () => {
        this.transitionName = "";
      });
      this.$navigation.on("back", () => {
        this.transitionName = "";
      });
      this.$navigation.on("replace", () => {
        this.transitionName = "van-slide-left";
      });
      this.$navigation.on("refresh", () => {
        this.transitionName = "";
      });
      this.$navigation.on("", () => { });
    },
    getWxShare () {
      var obj = {};
      obj.title = document.title;
      if (
        this.$store.state.config.shop &&
        this.$store.state.config.shop.jianjie &&
        this.$store.state.config.shop.jianjie != ""
      ) {
        obj.desc = this.$store.state.config.shop.jianjie;
      } else {
        obj.desc = document.title + "欢迎你";
      }
      obj.link = location.href;
      try {
        obj.imgUrl =
          this.$store.state.config.shop.logo &&
            this.$store.state.config.shop.logo.indexOf("http") >= 0
            ? this.$store.state.config.shop.logo
            : location.origin +
            this.$fnc.getImgUrl(this.$store.state.config.shop.logo);
      } catch (error) {
        obj.imgUrl = location.href;
      }

      this.$wxshare(obj);
    },
    share_btn () {
      if (this.$fnc.isYkAPP()) {
        try {
          var obj = this.$store.state.appShareObj || {};
          // eslint-disable-next-line no-undef
          this.$fnc.appShare(
            obj.title,
            obj.title,
            obj.link,
            obj.link,
            obj.desc,
            obj.imgUrl
          );
        } catch (error) {
          this.$toast.fail("分享失败");
        }
      } else {
        this.share_show = true;
      }
    },
    hideShare () {
      this.share_show = false;
      this.$store.commit("setShowShare", false);
    },
    initListener () {
      // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      this.tim.on(this.TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this);
      // SDK NOT READT
      this.tim.on(this.TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate, this);
      // 被踢出
      this.tim.on(this.TIM.EVENT.KICKED_OUT, ({ data: { type } }) => {
        const message =
          type === this.TIM.TYPES.KICKED_OUT_MULT_ACCOUNT
            ? "您的账号已在其他页面登录"
            : "您的账号已在其他设备登录";
        this.$toast.fail(message);
        this.$store.commit("toggleIsLogin", false);
        this.$store.commit("reset");
      });
      // SDK内部出错
      this.tim.on(this.TIM.EVENT.ERROR, this.onError);
      // 收到新消息
      this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
      // 会话列表更新
      this.tim.on(this.TIM.EVENT.CONVERSATION_LIST_UPDATED, (event) => {
        this.$store.commit("updateConversationList", event.data);
      });
      // 群组列表更新
      this.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, (event) => {
        this.$store.commit("updateGroupList", event.data);
      });
      // 收到新的群系统通知
      this.tim.on(this.TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, (event) => {
        const isKickedout = event.data.type === 4;
        const isCurrentConversation =
          `GROUP${event.data.message.payload.groupProfile.groupID}` ===
          this.currentConversation.conversationID;
        // 在当前会话被踢，需reset当前会话
        if (isKickedout && isCurrentConversation) {
          this.$store.commit("resetCurrentConversation");
        }
        // Notify({
        //     // title: "新系统通知",
        //     message: translateGroupSystemNotice(event.data.message),
        //     duration: 3000,
        //     onClick: () => {
        //         const SystemConversationID = "@TIM#SYSTEM";
        //         this.$store.dispatch("checkoutConversation", SystemConversationID);
        //     }
        // });
      });
    },
    onReceiveMessage ({ data: messageList }) {
      this.handleAt(messageList);
      messageList.forEach((item) => {
        if (
          item.conversationType == "GROUP" &&
          item.ID.indexOf("GROUP@TGS") >= 0
        ) {
          this.tim.setMessageRead({
            conversationID: item.conversationID,
          });
          if (item.elements[0].content.data == "present") {
            this.$store.commit("addLivePresent", [item]);
          } else {
            this.$store.commit("addLiveMsg", [item]);
          }
        } else if (this.$route.path == "/im/mes") {
          messageList.forEach((item) => {
            if (this.$route.query.id == item.conversationID) {
              this.tim.setMessageRead({
                conversationID: item.conversationID,
              });
            }
          });
        } else if (this.$route.path == "/im/wechat/chat") {
          messageList.forEach((item) => {
            if (item.conversationID.indexOf(this.$route.query.id) >= 0) {
              this.tim.setMessageRead({
                conversationID: item.conversationID,
              });
            }
          });
        }
      });
      this.$store.commit("pushCurrentMessageList", messageList);
    },
    onError ({ data: error }) {
      new Error(error.message);
      // this.$toast.fail(error.message);
    },
    onReadyStateUpdate ({ name }) {
      const isSDKReady = name === this.TIM.EVENT.SDK_READY ? true : false;
      this.$store.commit("toggleIsSDKReady", isSDKReady);

      if (isSDKReady) {
        this.tim.getMyProfile().then(({ data }) => {
          this.$store.commit("updateCurrentUserProfile", data);
        });
      }
    },
    /**
     * 处理 @ 我的消息
     * @param {Message[]} messageList
     */
    handleAt (messageList) {
      // 筛选有 @ 符号的文本消息
      var that = this;
      const atTextMessageList = messageList.filter(
        (message) =>
          message.type === this.TIM.TYPES.MSG_TEXT &&
          message.payload.text.includes("@")
      );

      for (let i = 0; i < atTextMessageList.length; i++) {
        const message = atTextMessageList[i];
        const matched = message.payload.text.match(/@\w+/g);
        if (!matched) {
          continue;
        }
        // @ 我的
        if (matched.includes(`@${this.currentUserProfile.userID}`)) {
          // 当前页面不可见时，调用window.Notification接口，系统级别通知。
          if (document.hidden) {
            this.notifyMe(message);
          }

          var groupLists = that.groupList;
          for (var k in groupLists) {
            if (groupLists[k].groupID == message.conversationID.slice(5)) {
              Notify({
                // title: `有人在群${message.conversationID.slice(5)}提到了你`,
                // message: message.payload.text,
                message: `有人在群 ${groupLists[k].name} 提到了你`,
                duration: 3000,
              });
            } else {
              break;
            }
          }

          this.$bus.$emit("new-messsage-at-me", {
            data: { conversationID: message.conversationID },
          });
        }
      }
    },
    /**
     * 使用 window.Notification 进行全局的系统通知
     * @param {Message} message
     */
    notifyMe (message) {
      // 需检测浏览器支持和用户授权
      if (!("Notify" in window)) {
        return;
      } else if (window.Notification.permission === "granted") {
        this.handleNotify(message);
      } else if (window.Notification.permission !== "denied") {
        window.Notification.requestPermission().then((permission) => {
          // 如果用户同意，就可以向他们发送通知
          if (permission === "granted") {
            this.handleNotify(message);
          }
        });
      }
    },
    handleNotify (message) {
      const notification = new window.Notify("有人提到了你", {
        body: message.payload.text,
      });
      notification.onclick = () => {
        window.focus();
        this.$store.dispatch("checkoutConversation", message.conversationID);
        notification.close();
      };
    },
  },
};
</script>

<style>
/* @import "../src/assets/css/icon1.css"; */
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  font-weight: normal;
}

.app-box {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.85s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.left {
  transform: rotateX(100%);
}
</style>
