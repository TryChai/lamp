<template>
  <div class="tc" style="height:100%" id="im-content">

    <div class="jstx_top">
      <van-icon name="arrow-left" color="#333" @click="toBack" />
      <div class="jstx_top_title">
        <span v-if="name=='@TIM#SYSTEM'">系统通知</span>
        <span v-else-if="!isTeam">{{name}}</span>
        <span v-else>{{name}}</span>
      </div>
      <van-icon name="ellipsis" @click="gotosetting " v-show="this.$route.query.id  && this.$route.query.id.indexOf('admin') < 0" />
    </div>
    <div class id="msg_box" @scroll="onScroll" v-if="showCurrentConversation">
      <div class="message-list" ref="message-list" @click="message_click" @scroll="this.onScroll">
        <van-loading size="24px" v-if="HasMsgList" color="#333" style="width: 50%; left: 25%;color:#333;width:50%">加载中...</van-loading>
        <mes-item v-for="(message,i) in currentMessageList" :key="i" :message="message" :teamnamelist="teamnamelist" />
      </div>
    </div>
    <send-msg v-show="name!=='@TIM#SYSTEM'" ref="send-msg" />
    <!-- 奖励金币 -->
    <div class="im_reward" :class="{ani:money}" v-if="money">
      <img src="../../assets/img/plugin/cq/jin_bi.png" :class="{jb:money}" class="cardp jb" mode />
      <div class="bg_im">{{money}}</div>
    </div>

    <van-popup v-model="userinfoshow" position="right" :style="{width:'100%', height: '100%' }">
      <info :name="name" :info="info" @close="userinfoshow = false"></info>
    </van-popup>
  </div>
</template>
<script>
import { PullRefresh, Loading, Popup } from "vant";
import { setTimeout } from "timers";
import { ImagePreview, Dialog } from "vant";
import { mapGetters, mapState } from "vuex";
import mesItem from "./mes-item";
import { Field } from "vant";
import sendMsg from "./sendMsg";
import info from "@/components/im/information/info"
export default {
  name: "mes",
  components: {
    [PullRefresh.name]: PullRefresh,
    [Loading.name]: Loading,
    [Field.name]: Field,
    [Dialog.name]: Dialog,
    [Popup.name]: Popup,
    mesItem,
    sendMsg,
    info

  },
  data () {
    return {
      teamnamelist: {},
      teamlist: [],
      info: {
        reamrk: "",
      },  //后端返回来的用户资料
      userinfoshow: false,
      selToID: "",
      textvalue: [],
      emoji: [],
      msgedit: "",
      scrollTop: 0,
      emotionFlag: false,
      infoname_text: "",
      money: "",
      isLoading: this.HasMsgList || false,
      show: false,
      user: {},
      showHb: false,
      hbinfo: {},
      isTeam: true,
      im: "",
      im_sig: "",
      atUserID: "",
      showAtGroupMember: false,
    };
  },
  computed: {
    ...mapState({

      currentConversation: state => state.conversation.currentConversation,
      currentMessageList: state => state.conversation.currentMessageList,
      HasMsgList: state => state.conversation.HasMsgList,
      isLogin: state => state.imUser.isLogin,
      isSDKReady: state => state.imUser.isSDKReady,
      imUser: state => state.user.im,
    }),
    ...mapGetters(["toAccount", "currentConversationType"]),

    // 是否显示当前会话组件
    showCurrentConversation () {
      return !!this.currentConversation.conversationID;
    },
    name () {
      if (this.currentConversation.type === "C2C") {
        return this.info.remark || this.currentConversation.userProfile.nick || this.toAccount;
      } else if (this.currentConversation.type === "GROUP") {
        return this.$route.query.remark || this.currentConversation.groupProfile.name || this.toAccount;
      }
      return this.toAccount;
    },
    showMessageSendBox () {
      return this.currentConversation.type !== this.TIM.TYPES.CONV_SYSTEM;
    },
    isimUser () {
      if (this.imUser) {
        return false;
      } else {
        return true;
      }
    }
  },
  destroyed: function () { },
  created () {


    this.init();
    if (this.isimUser) { //已登录为获得IM账户
      this.$toast('IM账户为空');
      setTimeout(() => {
        this.$router.push('/member/member');
      }, 1500)
    }
    if (this.$route.query.id && this.$route.query.id.indexOf('C2C') >= 0 && this.$route.query.id.indexOf('admin') < 0) {
      //如果为个人聊天，请求聊天对象的信息
      this.getinfo();
    }

    if (this.$route.query.id && this.$route.query.id.indexOf('GROUP') >= 0) {
      this.getteamlist();
    }
  },
  mounted () {
    this.$bus.$on("image-loaded", this.onImageLoaded);
    this.$bus.$on("scroll-bottom", this.scrollMessageListToButtom);
  },
  updated () {
    // this.keepMessageListOnButtom();
    this.scrollMessageListToButtom();
  },
  methods: {
    getteamlist () {
      var tid = this.$route.query.id || ""
      if (tid.indexOf('GROUP') >= 0) {
        tid = tid.replace('GROUP', '')
      }
      var params = {};
      params.im = tid;
      this.$api.getIm.editTeam(params).then(res => {
        if (res.code == 200) {
          this.teamlist = res.result.team
          var obj = {};
          res.result.team.forEach((item, i) => {
            obj[item.im] = item.remark || item.nickname || item.username;
          });
          this.teamnamelist = obj;

        }
      })
    },
    getinfo () {
      var id = this.$route.query.id;
      id = id.replace('C2C', '')
      this.$api.getIm.get_frinedinfo({ id: id }).then(res => {
        if (res.code == 200) {
          this.info = res.result;
        } else {
          this.$toast.fail(res.result)
        }
      })
    },
    gotosetting () {
      if (!this.isTeam) {
        this.userinfoshow = true;
      } else {
        this.$router.push('/im/uplateteam?tid=' + this.$route.query.id)
      }
    },
    message_click () {
      const regDom = document.querySelector("#im-content"); // 获取页面根元素
      regDom.style.top = 0;
      if (this.$refs['send-msg'].emotionFlag == true) {
        this.$refs['send-msg'].emotionFlag = false
      }
    },
    init () {
      var id = this.$route.query.id || "";
      if (id.indexOf("@TIM") >= 0) {
        this.isTeam = false;
        id = id.split(",").join("#");
        this.$store.dispatch("checkoutConversation", id);
        return;
      }

      var strId = id;
      if (strId.indexOf("@TIM") >= 0) {
      } else {
        if (id.indexOf("team") == -1) {
          this.isTeam = false;

          if (id.indexOf("C2C") == -1) {
            strId = "C2C" + id;
          } else {
            strId = id;
          }
        } else if (id.indexOf("admin") >= 0) {
          this.isTeam = false;
          if (id.indexOf("admin") == -1) {
            strId = "admin" + id;
          } else {
            strId = id;
          }
        } else {
          if (id.indexOf("GROUP") == -1) {
            strId = "GROUP" + id;
          } else {
            strId = id;
          }
          this.isTeam = true;
        }

        if (id.indexOf("_admin_") >= 0) {
          if (id.indexOf('C2C') >= 0) {
            var str11 = id.split('C2C')[1]
          } else {
            var str11 = id;
          }
          this.tim.getConversationProfile(strId).then(res => {
            var obj = res.data.conversation;
            if (obj.lastMessage.lastTime && obj.lastMessage.lastTime != 0 && obj.lastMessage.lastTime != '0') {
              var last_time = obj.lastMessage.lastTime + "000";
              var date = new Date().getTime();
              var differ = Number(date) - Number(last_time);
              var pass_time = 1000 * 60 * 30;     //1800000 
              if (differ > pass_time) {
                this.$api.getIm.getwelcome({ im: str11 });
              }
            } else {
              this.$api.getIm.getwelcome({ im: str11 });
            }
          })
        }
        this.$store.dispatch("checkoutConversation", strId);
        if (
          this.$store.state.unStatusShop != "" &&
          JSON.stringify(this.$store.state.unStatusShop) != "{}"
        ) {
          var info = JSON.parse(this.$store.state.unStatusShop);
          Dialog.confirm({
            title: '是否咨询商品详情',
            message: info.title
          }).then(() => {
            // on confirm
            if (info.imm == undefined || info.imm == '' || info.imm == null) {
              info.imm = this.$route.query.id.replace('C2C', '');
            }

            const message = this.tim.createCustomMessage({
              to: info.imm,
              conversationType: "C2C",
              payload: {
                data: "shops",
                description: JSON.stringify(info),
                extension: ''
              }
            });

            setTimeout(() => {
              var params = {};
              params.im = id;
              params.keyword = '商品';
              this.$api.getIm.sendMsg(params);

              this.$store.commit("pushCurrentMessageList", message);
              this.tim.sendMessage(message);
              this.$store.commit("setUnStatusShop", "");
              this.$bus.$emit("scroll-bottom");
              this.$api.getIm.sendMsgSms({ content: info.title, im: info.imm })
            }, 2000)

          }).catch(() => {
            // on cancel
            this.$store.commit("setUnStatusShop", "");
          });


        }
      }
    },
    onScroll ({ target: { scrollTop } }) {
      if (scrollTop <= 20 && this.currentMessageList.length <= 15) {
        this.$store.commit("updateHasMsgList", true);

        this.$store.dispatch(
          "getMessageList",
          this.currentConversation.conversationID
        );
      }
      let messageListNode = this.$refs["message-list"];
      if (!messageListNode) {
        return;
      }
      if (
        this.preScrollHeight - messageListNode.clientHeight - scrollTop <
        20
      ) {
        this.isShowScrollButtomTips = false;
      }
    },
    // 如果滚到底部就保持在底部，否则提示是否要滚到底部
    keepMessageListOnButtom () {
      let messageListNode = this.$refs["message-list"];
      if (!messageListNode) {
        return;
      }
      // 距离底部20px内强制滚到底部,否则提示有新消息
      if (
        this.preScrollHeight -
        messageListNode.clientHeight -
        messageListNode.scrollTop <
        20
      ) {
        this.$nextTick(() => {
          messageListNode.scrollTop = messageListNode.scrollHeight;
        });
        this.isShowScrollButtomTips = false;
      } else {
        this.isShowScrollButtomTips = true;
      }
      this.preScrollHeight = messageListNode.scrollHeight;
    },
    // 直接滚到底部
    scrollMessageListToButtom () {
      this.$nextTick(() => {
        let messageListNode = this.$refs["message-list"];
        if (!messageListNode) {
          return;
        }
        messageListNode.scrollTop = messageListNode.scrollHeight;
        this.preScrollHeight = messageListNode.scrollHeight;
        this.isShowScrollButtomTips = false;
      });
    },
    showMore () {
      this.showConversationProfile = !this.showConversationProfile;
    },
    onImageLoaded () {
      this.keepMessageListOnButtom();
    },
    getBlur () {
    },
    getFocus () {
      window.scroll(0, 0);
    },

    alertMsg () {
      this.$toast("暂未开放");
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

    imagePreview (src) {
      ImagePreview([this.$fnc.getImgUrl(src)]);
    },

    showEmotionDialog () {
      // im.showEmotionDialog();
    },
    uploadPic () {
      // im.uploadPic();
    },
  },
  watch: {
    $route (to) {
      this.init();
      if (to.name == "mes") {
        this.$bus.$on("scroll-bottom", this.scrollMessageListToButtom);
      }
    },


  }
};
</script>

<style lang="less" scoped>
.message-list {
  overflow-y: auto;
  position: relative;
  width: 100%;
}
#msg_box,
.jstx_bottom {
  // position: absolute;
}
#msg_box {
  display: flex;
  position: absolute;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;

  left: 0;
  top: 1.17333rem;
  bottom: 2.29333rem;
}

.emotion {
  border-radius: 0;
}
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

.van-pull-refresh {
  /* height: 81%; */
  padding-bottom: 2.5rem;
}
.msg_img {
  width: 150px;
  height: 150px;
}
.jstx_top {
  width: 100%;
  height: 44px;
  width: 100%;
  padding: 0 13px;
  z-index: 1;
  background: #f4f5f6;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .van-icon:nth-of-type(1) {
    font-size: 22px;
    position: absolute;
    left: 13px;
  }
  .van-icon:nth-of-type(2) {
    font-size: 28px;
    color: #cac6c6;
    position: absolute;
    right: 13px;
  }
  > .jstx_top_title {
    font-size: 16px;
    color: #cac6c6;
  }
}
.jstx_top_fixed {
  position: fixed !important;
}
.jstx_top_img {
  height: 16px;
  margin-top: 14px;
  width: 9px;
}
.jstx_top_img2 {
  width: 14px;
  height: 17px;
  margin-bottom: 7px;
}
.jstx_top_div1 {
  font-size: 16px;
  height: 15px;
  line-height: 15px;
  color: #cac6c6;
}
.jstx_top_div2 {
  color: #b2b2b2;
  font-size: 10px;
  line-height: 20;
  height: 10px;
  margin-top: 5px;
}
.jstx_top_div2_div {
  width: 6px;
  height: 6px;
  background-color: #b2b2b2;
  border-radius: 50%;
  margin-right: 5px;
  float: left;
}
.jstx_top_div2_div777 {
  font-size: 10px;
  height: 10px;
  line-height: 10px;
}
.jstx_top_div3 {
  width: 60px;
  text-align: left;
}

.jstx_conta {
  // padding-top: 44px;
  // padding-bottom: 78px;
  padding: 0px 30px 0px 30px;
  // height: 78%;
  // overflow: scroll;
  background: #f4f5f6;
  text-align: left;
}
.jstx_conta_l {
  width: 310px;
  margin-bottom: 10px;
  float: left;
}

.jstx_txs {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  float: left;
}
.jstx_tx {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  float: left;
}
.jstx_contant a {
  color: #0000ff;
}
.jstx_conta_l .jstx_contant {
  background-color: #fff;
  max-width: 260px;
  padding: 10px 15px;
  min-height: 40px;
  float: left;
  margin-left: 10px;
  border-radius: 10px;
  color: #333333;
  line-height: 25px;
  font-size: 16px;
}
.jstx_conta_l .jstx_red {
  float: left;
  background: url("../../assets/img/im/red.png");
  background-size: 100% 100%;
  text-align: center;
  color: #fdaf6c;
  width: 140px;
  height: 167px;
  margin-left: 10px;
  top: 0;
  border-radius: 10px;
  line-height: 25px;
  font-size: 14px;
  padding-top: 130px;
}
.jstx_conta_r {
  width: 310px;
  margin-bottom: 10px;
  position: relative;
  float: right;
}
.jstx_conta_r .jstx_tx {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
}
.jstx_conta_r .jstx_contant {
  float: right;
  background-color: #aef4f2;
  max-width: 260px;
  padding: 10px 15px;
  min-height: 40px;
  margin-right: 50px;
  top: 0;
  border-radius: 10px;
  color: #333333;
  line-height: 25px;
  font-size: 16px;
}
.jstx_conta_r .jstx_red {
  background: url("../../assets/img/im/red.png");
  background-size: 100%;
  text-align: center;
  color: #fdaf6c;
  float: right;
  width: 150px;
  height: 167px;
  margin-right: 50px;
  top: 0;
  border-radius: 10px;
  line-height: 25px;
  font-size: 16px;
  padding-top: 130px;
}
#im-content {
  width: 100%;
  position: relative;
}
</style>
