import tim from "../../tim";
import { Toast } from "vant";
import audiovideoCall from "./../../assets/js/fnc/audiovideoCall";
const imUser = {
  state: {
    currentUserProfile: {},
    isLogin: false,
    isSDKReady: false, // TIM SDK 是否 ready
  },
  mutations: {
    updateUserInfo(state, options) {
      var gender =
        options.sex == 1
          ? "Gender_Type_Male"
          : options.sex == 2
          ? "Gender_Type_Female"
          : "Gender_Type_Unknown";
      var avatar = options.avatar;
      var nick = options.nickname;
      try {
        tim
          .updateMyProfile({ gender, avatar, nick })
          .then(() => {})
          .catch((imError) => {
            // Toast(imError.message);
          });
      } catch (error) {
        new Error(error);
      }
    },
    updateCurrentUserProfile(state, userProfile) {
      var customarr = userProfile.profileCustomField || [];
      if (customarr && customarr.length > 0) {
        customarr.forEach((item, i) => {
          userProfile[item.key] = item.value;
        });
      }

      state.currentUserProfile = userProfile;
    },
    toggleIsLogin(state, isLogin) {
      state.isLogin = typeof isLogin === "undefined" ? !state.isLogin : isLogin;
    },
    toggleIsSDKReady(state, isSDKReady) {
      state.isSDKReady =
        typeof isSDKReady === "undefined" ? !state.isSDKReady : isSDKReady;
    },
    reset(state) {
      Object.assign(state, {
        currentUserProfile: {},
        isLogin: false,
        isSDKReady: false, // TIM SDK 是否 ready
      });
    },
  },
  actions: {
    login(context, info) {
      audiovideoCall.audiovideoLogin();
      tim
        .login({
          userID: info.userID,
          userSig: info.userSig,
        })
        .then(() => {
          context.commit("toggleIsLogin", true);
          context.commit("startComputeCurrent");
        })
        .catch((imError) => {
          if (imError.code === 2000) {
            Toast(imError.message + ", 请检查是否正确填写了 SDKAPPID");
          } else {
            // Toast(imError.message)
          }
        });
    },
    logout(context) {
      // 若有当前会话，在退出登录时已读上报
      if (context.rootState.conversation.currentConversation.conversationID) {
        tim.setMessageRead({
          conversationID:
            context.rootState.conversation.currentConversation.conversationID,
        });
      }
      if (tim) {
        try {
          tim.logout().then(() => {
            context.commit("toggleIsLogin");
            context.commit("stopComputeCurrent");
            context.commit("reset");
          });
        } catch (error) {}
      }
    },
  },
};

export default imUser;
