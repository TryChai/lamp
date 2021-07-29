import tim from "tim";

const live = {
  state: {
    Prelist: [],
    msglist: [],
    maxmsg: 6,
  },
  getters: {},
  mutations: {
    addLivePresent(state, present) {
      if (state.Prelist == 4) {
        state.Prelist.splice(0, 1);
      }

      state.Prelist = state.Prelist.concat(present);
      setTimeout(() => {
        state.Prelist.splice(0, 1);
      }, 3000);
    },
    addLiveMsg(state, msg) {
      state.msglist = state.msglist.concat(msg);
      // if (state.msglist.length > state.maxmsg) {
      //   state.msglist.splice(0, state.msglist.length - state.maxmsg);
      // }
    },
    clearMsg(state) {
      state.msglist = [];
      state.Prelist = [];
    },
  },
  actions: {},
};

export default live;
