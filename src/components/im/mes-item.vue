<template>
  <div>
    <p v-if="date" class="jstx_conta_sj1">{{date}}</p>
    <div class="message-wrapper" :class="messagePosition">
      <!-- <message-header v-if="showMessageHeader" :message="message" /> -->

      <revokebtn :message="message" v-if=" isMine === true && message.isRevoked === false "></revokebtn>
      <div class="content" :class="messageType">

        <message-status-icon :message="message" />
        <span v-if="message.isRevoked == true">撤回了该条消息</span>
        <text-element v-else-if="message.type === TIM.TYPES.MSG_TEXT" :isMine="isMine" :payload="message.payload" :message="message" />
        <SoundPlay
            v-else-if="message.type === TIM.TYPES.MSG_FILE && message.payload.fileName && (message.payload.fileName.indexOf('mp3') >= 0 || message.payload.fileName.indexOf('aac') >= 0)"
            :flow="message.flow" :payload="message.payload"></SoundPlay>
        <image-element v-else-if="message.type === TIM.TYPES.MSG_IMAGE" :payload="message.payload" />
        <file-element v-else-if="message.type === TIM.TYPES.MSG_FILE " :payload="message.payload" />
        <sound-element v-else-if="message.type === TIM.TYPES.MSG_SOUND" :payload="message.payload" />
        <group-tip-element v-else-if="message.type===TIM.TYPES.MSG_GRP_TIP" :payload="message.payload" />
        <group-system-notice-element v-else-if="message.type === TIM.TYPES.MSG_GRP_SYS_NOTICE" :payload="message.payload" :message="message" />
        <custom-element v-else-if="message.type === TIM.TYPES.MSG_CUSTOM" :payload="message.payload" />
        <face-element v-else-if="message.type === TIM.TYPES.MSG_FACE" :payload="message.payload" />
        <span v-else>暂未支持的消息类型：{{message.type}}</span>
      </div>
      <div v-if="messageType!='position-center'" class="chat_userava">
        <img :src="( avatar ||  (message.sex==2? require('../../assets/img/member/sex2.png'):require('../../assets/img/member/sex1.png') ))"
            class="jstx_tx" />
        <p :class="isMine == true ? 'myname':'youname'" class="chatname" v-if="message.conversationType == 'GROUP'">{{teamnamelist[message.from]}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MessageStatusIcon from "./message-status-icon.vue";
// import MessageHeader from './message-header'
import FileElement from "./message-elements/file-element.vue";
import FaceElement from "./message-elements/face-element.vue";
import ImageElement from "./message-elements/image-element.vue";
import TextElement from "./message-elements/text-element.vue";
import SoundElement from "./message-elements/sound-element.vue";
import GroupTipElement from "./message-elements/group-tip-element.vue";
import GroupSystemNoticeElement from "./message-elements/group-system-notice-element.vue";
import CustomElement from "./message-elements/custom-element.vue";
import SoundPlay from "./message-elements/soundPlay";
import revokebtn from "./message-elements/revokebtn.vue";
import { isToday, getDate, getTime } from "../../utils/date";
import wxTime from "../../utils/wxDate"
export default {
  name: "MessageItem",
  props: {
    teamnamelist: {
      type: Object,
      default: () => ({})
    },
    message: {
      type: Object,
      required: true
    }
  },
  components: {
    // MessageHeader,
    MessageStatusIcon,
    FileElement,
    FaceElement,
    ImageElement,
    TextElement,
    SoundElement,
    GroupTipElement,
    GroupSystemNoticeElement,
    CustomElement,
    SoundPlay,
    revokebtn,
  },
  data () {
    return {
      renderDom: []
    };
  },
  computed: {
    ...mapState({
      currentConversation: state => state.conversation.currentConversation,
      currentUserProfile: state => state.imUser.currentUserProfile,
      currentMemberList: state => state.group.currentMemberList
    }),
    date () {
      const date = (this.message.lastShowTimeStamp * 1000);
      if (date) {
        return wxTime(date, true);
      } else {
        return '';
      }

    },

    isMine () {
      return this.message.flow === "out";
    },
    avatar () {
      const isC2C = this.currentConversation.type === this.TIM.TYPES.CONV_C2C;
      if (this.isMine) {
        if (this.currentUserProfile) {
          return this.currentUserProfile.avatar;
        } else {

          return this.$store.state.user.avatar || false;
        }
        // return this.currentUserProfile.avatar || ''
      }
      if (isC2C) {
        if (this.currentConversation.conversationID.indexOf('admin') >= 0) {
          return require('../../assets/img/im/laoshi.png');
        } else {
          return this.currentConversation.userProfile.avatar || false;
        }


      }
      // 2. 群组消息，用消息体中的 nick 渲染。nameCard暂时支持不完善
      return this.message.avatar || "";
    },
    messagePosition () {
      if (!this.message.elements) {
        return
      }
      if (
        ["TIMGroupTipElem", "TIMGroupSystemNoticeElem"].includes(
          this.message.elements[0].type
        )
      ) {
        return "position-center";
      }
      if (this.isMine) {
        return "position-right";
      } else {
        return "position-left";
      }
    },
    messageType () {
      if (
        ["TIMGroupTipElem", "TIMGroupSystemNoticeElem"].includes(
          this.message.elements[0].type
        )
      ) {
        return "position-center";
      }
      if (this.isMine) {
        return "message-line message-right";
      } else {
        return "message-left message-line";
      }
    },
    showMessageHeader () {
      if (
        ["TIMGroupTipElem", "TIMGroupSystemNoticeElem"].includes(
          this.message.elements[0].type
        )
      ) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped lang='less'>
.jstx_conta_sj1 {
  color: #b3b3b3;
  font-size: 0.32rem;
  height: 0.32rem;
  line-height: 0.32rem;
  margin: 0.5rem 0;
  text-align: center;
  width: 100%;
}
.message-left {
  background-color: #fff;
  max-width: 6.93333rem;
  min-height: 1.06667rem;
  margin-left: 0.26667rem;

  padding: 0.15rem 0.3rem;
  border-radius: 0.26667rem;
  color: #333;
  font-size: 0.42667rem;
  > span:first-child {
    display: none;
  }
}
.message-right {
  background-color: #aef4f2;
  max-width: 6.93333rem;
  padding: 0.15rem 0.3rem;
  min-height: 1.06667rem;
  color: #333;
  margin-right: 0.26667rem;
  border-radius: 0.26667rem;
  font-size: 0.42667rem;
  text-align: justify;
  line-height: 24px;
  font-size: 16px;
}
.jstx_tx {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.chat_userava {
  width: 50px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  .chatname {
    width: 100%;
    font-size: 10px;
    line-height: 1;
    padding-top: 2.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.message-wrapper {
  display: flex;
  /* flex-direction: column; */
  margin: 6px 0;
  padding: 0 15px;
  position: relative;
}
.position-left {
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: center;
}
.position-right {
  align-items: center;
  justify-content: flex-end;
  align-items: center;
}
.position-center {
  align-items: center;
  width: 100%;
}
.content {
  display: flex;
  align-items: center;
}
</style>
