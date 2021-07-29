import tim from "tim";
import TIM from "tim-js-sdk";
import { Toast } from "vant";
import api from "./../../assets/js/api/require/index";

const conversationModules = {
  state: {
    nowRedBagStatus: [], //当前会话消息全部红包的状态
    remarkobj: {}, //存放备注的
    buddyList: [],
    currentConversation: {},
    currentMessageList: [],
    nextReqMessageID: "",
    isCompleted: false, // 当前会话消息列表是否已经拉完了所有消息
    conversationList: [],
    HasMsgList: false,
  },
  getters: {
    getSingleRedBag: (state) => (oid) => {
      if (state.nowRedBagStatus && state.nowRedBagStatus.length == 0) {
        return {};
      }
      return state.nowRedBagStatus.find((item) => item.oid === oid);
    },

    toAccount: (state) => {
      if (
        !state.currentConversation ||
        !state.currentConversation.conversationID
      ) {
        return "";
      }
      switch (state.currentConversation.type) {
        case "C2C":
          return state.currentConversation.conversationID.replace("C2C", "");
        case "GROUP":
          return state.currentConversation.conversationID.replace("GROUP", "");
        default:
          return state.currentConversation.conversationID;
      }
    },
    currentConversationType: (state) => {
      if (!state.currentConversation || !state.currentConversation.type) {
        return "";
      }
      return state.currentConversation.type;
    },
    totalUnreadCount: (state) => {
      return state.conversationList.reduce((count, conversation) => {
        // 当前会话不计算总未读
        if (
          conversation.conversationID ===
          state.currentConversation.conversationID
        ) {
          return count;
        }
        if (
          conversation.type === "GROUP" &&
          conversation.groupProfile.selfInfo.messageRemindType ===
            "AcceptNotNotify"
        ) {
          return count;
        }
        return count + conversation.unreadCount;
      }, 0);
    },
    // 用于当前会话的图片预览
    imgUrlList: (state) => {
      return state.currentMessageList
        .filter((message) => message.type === TIM.TYPES.MSG_IMAGE)
        .map((message) => message.payload.imageInfoArray[0].url);
    },
  },
  mutations: {
    setVariable(state, obj) {
      state[obj.key] = obj.value;
    },
    setremarkobj(state, obj) {
      state.remarkobj = obj;
    },
    setBuddyLists(state, list) {
      state.buddyList = list;
    },

    /**
     * 更新当前会话
     * 调用时机: 切换会话时
     * @param {Object} state
     * @param {Conversation} conversation
     */
    updateCurrentConversation(state, conversation) {
      state.currentConversation = conversation;
      state.currentMessageList = [];
      state.nextReqMessageID = "";
      state.isCompleted = false;
    },
    /**
     * 更新会话列表
     * 调用时机：触发会话列表更新事件时。CONVERSATION_LIST_UPDATED
     * @param {Object} state
     * @param {Conversation[]} conversationList
     */
    updateConversationList(state, conversationList) {
      // state.currentConversation = {};
      state.conversationList = conversationList;
    },
    /**
     * 重置当前会话
     * 调用时机：需要重置当前会话时，例如：当前会话是一个群组，正好被踢出群时（被踢群事件触发），重置当前会话
     * @param {Object} state
     */
    resetCurrentConversation(state) {
      state.currentConversation = {};
    },
    /**
     * 将消息插入当前会话列表
     * 调用时机：收/发消息事件触发时
     * @param {Object} state
     * @param {Message[]|Message} data
     * @returns
     */
    pushCurrentMessageList(state, data) {
      // 还没当前会话，则跳过
      if (!state.currentConversation.conversationID) {
        return;
      }

      if (Array.isArray(data)) {
        // 筛选出当前会话的消息
        const result = data.filter(
          (item) =>
            item.conversationID === state.currentConversation.conversationID
        );

        if (
          state.currentMessageList.length > 0 &&
          result.time &&
          result.time -
            state.currentMessageList[state.currentMessageList.length - 1]
              .time >=
            50
        ) {
          result.lastShowTimeStamp = result.time;
        } else if (state.currentMessageList.length == 0) {
          result.lastShowTimeStamp = (new Date().getTime() + "").slice(0, 10);
        }

        state.currentMessageList = [...state.currentMessageList, ...result];

        // state.currentMessageList = mergeMessageList(state.currentMessageList, result);
      } else if (
        data.conversationID === state.currentConversation.conversationID
      ) {
        if (
          state.currentMessageList.length > 0 &&
          data.time -
            state.currentMessageList[state.currentMessageList.length - 1]
              .time >=
            50
        ) {
          data.lastShowTimeStamp = data.time;
        } else if (state.currentMessageList.length == 0) {
          data.lastShowTimeStamp = (new Date().getTime() + "").slice(0, 10);
        }
        state.currentMessageList = [...state.currentMessageList, data];
        // state.currentMessageList = mergeMessageList(state.currentMessageList, [data]);
      }
    },
    updateHasMsgList(state, bool) {
      state.HasMsgList = bool;
    },
    reset(state) {
      Object.assign(state, {
        currentConversation: {},
        currentMessageList: [],
        nextReqMessageID: "",
        isCompleted: false, // 当前会话消息列表是否已经拉完了所有消息
        conversationList: [],
      });
    },
    reset1(state) {
      Object.assign(state, {
        currentConversation: {},
        currentMessageList: [],
        nextReqMessageID: "",
        isCompleted: false, // 当前会话消息列表是否已经拉完了所有消息
        conversationList: [],
      });
    },
  },
  actions: {
    /**
     * /获取当前聊天的红包全部
     */
    getNowRedBagStatus(context) {
      //获取当前聊天的红包全部
      api.getIm.getHongBaoAllStatus({}).then((res) => {
        if (res.code == 200) {
          var obj = {
            key: "nowRedBagStatus",
            value: res.result,
          };
          context.commit("setVariable", obj);
        }
      });
    },

    /**
     * 获取全部好友
     */
    getAllFriend(context) {
      var params = {};
      params.page = 1;
      params.page_size = 400;
      api.getIm.imBuddyLists(params).then((res) => {
        if (res.code == 200) {
          var obj = {};
          res.result.forEach((item, i) => {
            if (item.remark) {
              obj[item.im] = item.remark;
            }
          });
          context.commit("setBuddyLists", res.result);
          context.commit("setremarkobj", obj);
        }
      });
    },

    /**
     * 获取消息列表
     * 调用时机：打开某一会话时或下拉获取历史消息时
     * @param {Object} context
     * @param {String} conversationID
     */
    getMessageList(context, conversationID) {
      if (context.state.isCompleted) {
        Toast("已经没有更多的历史消息了哦");
        context.commit("updateHasMsgList", false);
        return;
      }
      const { nextReqMessageID, currentMessageList } = context.state;
      tim
        .getMessageList({ conversationID, nextReqMessageID, count: 15 })
        .then((imReponse) => {
          // 更新messageID，续拉时要用到
          context.state.nextReqMessageID = imReponse.data.nextReqMessageID;
          context.state.isCompleted = imReponse.data.isCompleted;
          // 更新当前消息列表，从头部插入
          var msglist = [...imReponse.data.messageList, ...currentMessageList];

          // context.state.currentMessageList = [...imReponse.data.messageList, ...currentMessageList];

          if (msglist.length > 0) {
            msglist.filter((item, index) => {
              if (index == 0) {
                item.lastShowTimeStamp = item.time;
              } else {
                if (msglist[index + 1]) {
                  if (msglist[index + 1].time - item.time >= 50) {
                    item.lastShowTimeStamp = item.time;
                  }
                }
              }
            });
          }

          context.state.currentMessageList = msglist;
          context.commit("updateHasMsgList", false);
        });
    },
    /**
     * 切换会话
     * 调用时机：切换会话时
     * @param {Object} context
     * @param {String} conversationID
     */
    checkoutConversation(context, conversationID) {
      if ("@TIM" == conversationID) {
        return;
      }

      context.commit("resetCurrentMemberList");
      // 1.切换会话前，将切换前的会话进行已读上报
      if (context.state.currentConversation.conversationID) {
        const prevConversationID =
          context.state.currentConversation.conversationID;
        tim.setMessageRead({ conversationID: prevConversationID });
      }
      // 2.待切换的会话也进行已读上报
      tim.setMessageRead({ conversationID });
      // 3. 获取会话信息

      try {
        return tim.getConversationProfile(conversationID).then(({ data }) => {
          // 3.1 更新当前会话
          context.commit("updateCurrentConversation", data.conversation);
          // 3.2 获取消息列表
          context.dispatch("getMessageList", conversationID);
          // 3.3 拉取第一页群成员列表
          if (data.conversation.type === TIM.TYPES.CONV_GROUP) {
            return context.dispatch(
              "getGroupMemberList",
              data.conversation.groupProfile.groupID
            );
          }
          return Promise.resolve();
        });
      } catch (error) {
        setTimeout(() => {
          return tim.getConversationProfile(conversationID).then(({ data }) => {
            // 3.1 更新当前会话
            context.commit("updateCurrentConversation", data.conversation);
            // 3.2 获取消息列表
            context.dispatch("getMessageList", conversationID);
            // 3.3 拉取第一页群成员列表
            if (data.conversation.type === TIM.TYPES.CONV_GROUP) {
              return context.dispatch(
                "getGroupMemberList",
                data.conversation.groupProfile.groupID
              );
            }
            return Promise.resolve();
          });
        }, 500);
      }
    },
  },
};

export default conversationModules;
