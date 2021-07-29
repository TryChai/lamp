<template>
  <div class="im_message">
    <latelyActivity
      :conversation="activi"
      v-if="JSON.stringify(activi) != '{}'"
    />
    <latelyActivity
      :isActivi="false"
      :conversation="xt"
      v-if="JSON.stringify(xt) != '{}'"
    />
    <lately-item
      v-for="(item, index) in useconversationList"
      :key="index"
      :conversation="item"
    />

    <div
      v-if="
        JSON.stringify(activi) == '{}' &&
        JSON.stringify(xt) == '{}' &&
        useconversationList.length == 0
      "
    >
      <van-empty description="这里空空的~" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Empty } from "vant";
import latelyItem from "@/components/im/lately/lately-item";
import latelyActivity from "@/components/im/lately/lately-activity";
export default {
  data() {
    return {
      activi: {},
      xt: {},
    };
  },
  components: {
    [Empty.name]: Empty,
    latelyItem,
    latelyActivity,
  },
  computed: {
    ...mapState({
      conversationList: (state) => state.conversation.conversationList,
      currentConversation: (state) => state.conversation.currentConversation,
    }),
    useconversationList() {
      var arr = this.conversationList || [];
      return arr;
    },
  },
  mounted() {
    this.$store.commit("updateCurrentConversation", "");
    this.getXtMsg();
    this.getActivitMsg();
  },
  methods: {
    getXtMsg() {
      this.$api.getIm.getXtMsg({}).then((res) => {
        if (res.code == 200 && res.result) {
          this.xt = res.result;
        }
      });
    },
    getActivitMsg() {
      this.$api.getIm.getActivitMsg({}).then((res) => {
        if (res.code == 200 && res.result) {
          this.activi = res.result;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.im_message {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 0 10px;
}
</style>