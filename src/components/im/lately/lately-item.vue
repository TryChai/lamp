<template>
  <div class="tdgl_con_list">
    <van-swipe-cell>
      <a @click.prevent="toMsg('mes',conversation.conversationID)" class="fx">
        <div class="f_l avter fx_1">
          <div class="im-status">
            <div class="status-bg" v-if="!conversation.To_Account"></div>
            <img v-if="'@TIM#SYSTEM'!=conversation.conversationID"
                :src="(avatar ||  (conversation.sex==2? require('../../../assets/img/member/sex2.png') : require('../../../assets/img/member/sex1.png')))"
                class="tdgl_con_list_img1" />
            <img v-else src="../../../assets/img/im/noty.png" class="tdgl_con_list_img1 " alt="">

            <span :class="{isStatus:!conversation.To_Account}"></span>
          </div>
          <span class="unread" v-if="showUnreadCount">{{conversation.unreadCount}}</span>
        </div>
        <div class="f_r tdgl_con_list_div1 fx_4">
          <div class="tdgl_con_list_div3">

            <span class="f_l"
                v-if="conversation.type ==  TIM.TYPES.CONV_C2C">{{conversation.userProfile.remark || conversation.userProfile.nick || conversation.userProfile.userID}}</span>
            <span class="f_l"
                v-else-if="conversation.type ==  TIM.TYPES.CONV_GROUP">{{conversation.groupProfile.name || conversation.groupProfile.groupID}}</span>
            <span class="f_l" v-else-if="conversation.type === TIM.TYPES.CONV_SYSTEM">IM通知</span>
            <span class="f_r tdgl_con_list_span1">{{this.$h(date)}}</span>
          </div>
          <div class="tdgl_con_list_div4"></div>
          <div class="tdgl_con_list_div2 hid_text" v-if="conversation.lastMessage">

            <span style="color:red;" v-if="hasMessageAtMe">[有人提到我]</span>

            {{messageForShow}}
            <!-- {{conversation.lastMessage.messageForShow}} -->
          </div>
        </div>
      </a>
      <template #right>
        <van-button square type="danger" text="删除" @click="deleteConversation" style="height:100%" />
      </template>
    </van-swipe-cell>

  </div>
</template>

<script>
import { SwipeCell } from 'vant';
import { mapGetters, mapState } from "vuex";
import { isToday, getDate, getTime } from "../../../utils/date";
import wxTime from "../../../utils/wxDate"

export default {
  name: "",
  props: ["conversation"],
  data () {
    return {
      popoverVisible: false,
      hasMessageAtMe: false
    };
  },
  computed: {
    messageForShow () {
      if (this.conversation.lastMessage &&
        this.conversation.lastMessage.payload &&
        this.conversation.lastMessage.payload.fileName &&
        (this.conversation.lastMessage.payload.fileName.indexOf('mp3') >= 0 || this.conversation.lastMessage.payload.fileName.indexOf('aac') >= 0)) {
        return '[语音消息]'
      } else {
        return this.conversation.lastMessage.messageForShow
      }
    },
    showUnreadCount () {
      // 是否显示未读计数。当前会话和未读计数为0的会话，不显示。
      return (
        this.currentConversation.conversationID !==
        this.conversation.conversationID && this.conversation.unreadCount > 0
      );
    },
    date: function () {
      if (
        !this.conversation.lastMessage ||
        !this.conversation.lastMessage.lastTime
      ) {
        return "";
      }
      const date = (this.conversation.lastMessage.lastTime * 1000);
      // if (isToday(date)) {
      //   return getTime(date);
      // }
      return wxTime(date, false);
    },
    avatar: function () {
      if (this.conversation.conversationID.indexOf('_admin_') >= 0) {
        return require('../../../assets/img/im/laoshi.png')
      }
      switch (this.conversation.type) {
        case "GROUP":
          return this.conversation.groupProfile.avatar;
        case "C2C":
          return this.conversation.userProfile.avatar;
        default:
          return false;
      }
    },
    showGrayBadge () {
      if (this.conversation.type !== this.TIM.TYPES.CONV_GROUP) {
        return false;
      }
      return (
        this.conversation.groupProfile.selfInfo.messageRemindType ===
        "AcceptNotNotify"
      );
    },
    ...mapState({
      currentConversation: state => state.conversation.currentConversation
    }),
    ...mapGetters(["toAccount"])
  },
  components: {
    [SwipeCell.name]: SwipeCell
  },
  created () { },
  mounted () {
    this.$bus.$on("new-messsage-at-me", event => {
      if (
        event.data.conversationID === this.conversation.conversationID &&
        this.conversation.conversationID !==
        this.currentConversation.conversationID
      ) {
        this.hasMessageAtMe = true;
      }
    });
  },
  methods: {

    toMsg (to, id) {
      // if(id.indexOf('GROUP')>=0){
      //   id=id.replace('GROUP','');
      // }
      console.log(id)
      var im = this.$store.state.config.plugin.imhyjsnt.is_open || ""; //聊天功能
      var kf = this.$store.state.config.plugin.btkfxt.is_open || '';//平台客服
      if (id == "" || id == "null" || id == null) {
        this.$toast.fail(this.$h("对方不在线"));
        return false;
      }
      if (to == "mes" && (im == 1 || kf == 1)) {
        if (id.indexOf('@TIM#') >= 0) {
          var str = id.split('#').join();
          this.$router.push("/im/mes?id=" + str);
        } else {
          this.$router.push("/im/mes?id=" + id);
        }
        // this.$store.dispatch(
        //   "checkoutConversation",
        //   id
        // );
        // this.userList=[];

      } else {
        this.$toast.fail(this.$h("敬请期待"));
      }
    },
    deleteConversation () {
      this.tim
        .deleteConversation(this.conversation.conversationID)
        .then(() => {
          this.$toast.success(`${this.$h('会话删除成功')}!`);
          this.popoverVisible = false;
          this.$store.commit("resetCurrentConversation");
        })
        .catch(error => {
          this.$toast.fail(
            `${this.$h('会话')}${this.conversation.conversationID}${this.$h('删除失败')}!, error=${error.message}`
          );
          this.popoverVisible = false;
        });
    },
    showContextMenu () {
      this.popoverVisible = true;
    },
    setMessageRead () {
      if (this.conversation.unreadCount === 0) {
        return;
      }
      if (this.conversation.type === "C2C") {
        this.tim.setMessageRead({
          conversationID: this.conversation.conversationID,
          lastMessageTime: this.conversation.lastMessage.lastTime
        });
      } else if (this.conversation.type === "GROUP") {
        this.tim.setMessageRead({
          conversationID: this.conversation.conversationID,
          lastMessageSeq: this.conversation.lastMessage.lastSequence
        });
      }
    }
  },
  watch: {
    currentConversation (next) {
      if (next.conversationID === this.conversation.conversationID) {
        this.hasMessageAtMe = false;
      }
    }
  }
};
</script>
<style lang='less' scoped>
.tdgl_con_list {
  width: 100%;
  border-bottom: solid 1px #f9f9f9;
  padding: 16px 0;
}
.tdgl_con_list .unread {
  position: absolute;
  background: #fa5251;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  height: 18px;
  width: 18px;
  right: 10px;
  // top: -4px;
  line-height: 18px;
  font-size: 12px;
}
.tdgl_con_list_img1 {
  width: 50px;
  height: 50px;
  border-radius: 10px;
}
.tdgl_con_list_div1 {
  width: 250px;
  height: 56px;
  justify-content: center;
  display: flex;
  flex-direction: column;
  /* padding-left: 20px; */
}
.tdgl_con_list_div2 {
  color: #9f9f9f;
  height: 16px;
  line-height: 16px;
  font-size: 13px;
}
.tdgl_con_list_div3 {
  color: #313131;
  line-height: 13px;
  font-size: 15px;
  padding-bottom: 4px;
}
.tdgl_con_list_span1 {
  font-size: 12px;
  color: #b1b1b1;
}

.tdgl_con_list_div4 {
  line-height: 16px;
  font-size: 12px;
  color: #fff;
  margin-top: 4px;
}
.tdgl_con_list_div4_span {
  display: inline-block;
  height: 14px;
  padding: 0 5px;
  border-radius: 5px;
  text-align: center;
  margin-right: 5px;
}
.tdgl_con_list_span2 {
  background-color: #fd77b9;
}
.tdgl_con_list_span3 {
  background-color: #6ec4e9;
}
.tdgl_con_list_span4 {
  background-color: #ffb500;
}
.tdgl_con_list_span5 {
  background-color: #9867ff;
}
.tdgl_con_list_img2 {
  height: 6px;
  width: 6px;
  margin-right: 4px;
  vertical-align: middle;
  margin-top: -5px;
}
</style>
