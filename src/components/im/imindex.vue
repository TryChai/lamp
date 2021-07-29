<template>
  <div class="myfans">
    <div class="fx search">
      <van-icon name="arrow-left" size="24px" @click="toBack" />
      <van-search
        placeholder="搜索更多好友"
        shape="round"
        background="transparent"
        v-if="$store.state.config.plugin.imhyjsnt.is_open == 1"
        readonly
        @click="$router.push('/im/search')"
      >
      </van-search>
      <div
        class="button"
        @click="$router.push('/im/kf')"
        v-if="$store.state.config.plugin.btkfxt.is_open == 1"
      >
        联系客服
        <span class="unread" v-if="kfUnreadCount > 0"></span>
      </div>
    </div>

    <div class="header">
      <div class="statistics">
        <div>
          <div>{{ userInfo.ynumber || 0 }}</div>
          <div class="word">我的直推</div>
        </div>
        <div>
          <div>{{ userInfo.znumber || 0 }}</div>
          <div class="word">我的团队</div>
        </div>
      </div>
      <div class="statistics">
        <div>
          <div>{{ zttj.today || 0 }}</div>
          <div>今日新增</div>
        </div>
        <div>
          <div>{{ zttj.yesterday || 0 }}</div>
          <div>昨日新增</div>
        </div>
        <div>
          <div>{{ userInfo.zvip || 0 }}</div>
          <div>已升级</div>
        </div>
        <div>
          <div>{{ userInfo.znumber - userInfo.zvip || 0 }}</div>
          <div>未升级</div>
        </div>
      </div>
    </div>

    <van-tabs v-model="active" line-width="20px" line-height="4px">
      <van-tab title="最新消息" name="news"></van-tab>
      <van-tab
        title="我的好友"
        name="wdhy"
        :badge="zttj.buddy_num > 0 ? zttj.buddy_num : ''"
        v-if="$store.state.config.plugin.imhyjsnt.is_open == 1"
      ></van-tab>
      <van-tab title="我的团队" name="wdtd"></van-tab>
      <van-tab
        title="我的战队"
        name="clan"
        v-if="$store.state.config.plugin.ltskt.is_open == 1"
      ></van-tab>
    </van-tabs>

    <div class="container">
      <immessage v-if="active == 'news'" />
      <imslately
        v-if="
          active == 'wdhy' && $store.state.config.plugin.imhyjsnt.is_open == 1
        "
        :buddy_num="zttj.buddy_num"
        @reset="get_zttj"
      />
      <imindex v-if="active == 'wdtd'" />
      <imteam
        v-if="active == 'clan' && $store.state.config.plugin.ltskt.is_open == 1"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import imindex from "@/components/im/im_index_con/imindex";
import imteam from "@/components/im//im_index_con/team";
import imslately from "@/components/im//im_index_con/lately";
import immessage from "@/components/im//im_index_con/message";
export default {
  data() {
    return {
      active: "news",
      zttj: {},
    };
  },
  components: {
    imindex,
    immessage,
    imslately,
    imteam,
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user,
      conversationList: (state) => state.conversation.conversationList,
    }),
    allUnreadCount() {
      var index = 0;
      for (var i in this.conversationList) {
        index += this.conversationList[i].unreadCount;
      }
      return index; //得到总IM未读消息
    },
    kfUnreadCount() {
      var index = 0;
      for (var i in this.conversationList) {
        if (this.conversationList[i].conversationID.indexOf("admin") != -1) {
          index += this.conversationList[i].unreadCount;
        }
      }
      return index; //得到客服IM未读消息
    },
  },
  created() {
    this.$store.dispatch("getUser");
    this.active = this.$route.query.active || "news";
    this.get_zttj();
  },
  watch: {
    $route(to) {
      if (to.name == "imindex") {
        this.active = this.$route.query.active || "news";
        this.get_zttj();
      }
    },
  },
  methods: {
    get_zttj() {
      this.$api.getIm.plugin_im_zttj({}).then((res) => {
        if (res.code === 200) {
          this.zttj = res.result;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.myfans {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
  padding-bottom: 50px;

  .search {
    background-color: #ffd800;
    padding: 12px 10px;
    .van-icon {
      margin-right: 10px;
    }
    .van-search {
      padding: 0;
      flex: 1;
      height: 32px;
    }
    .button {
      height: 23px;
      padding: 0 5px;
      border: 0;
      border-radius: 5px;
      color: white;
      background-color: #3f3f46;
      font-size: 12px;
      line-height: 23px;
      position: relative;
      margin-left: 10px;

      .unread {
        width: 6px;
        height: 6px;
        border-radius: 100%;
        background: #ee0a24;
        position: absolute;
        right: -2px;
        top: -2px;
        display: inline-block;
      }
    }
  }
}
.header {
  width: 100%;
  background-color: #ffd800;
  padding-top: 14px;
  > div:nth-of-type(1) {
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      > div:first-of-type {
        font-size: 28px;
        line-height: 28px;
      }
      > div:last-of-type {
        margin-top: 10px;
        font-size: 17px;
        line-height: 17px;
      }
    }
  }
  .statistics {
    margin-top: 20px;
    padding: 0 10px 16px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      > div:first-of-type {
        font-size: 13px;
        line-height: 13px;
      }
      > div:last-of-type {
        margin-top: 10px;
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
}
/deep/.van-tabs {
  .van-tab__text {
    font-size: 14px;
    color: #3f3f49;
  }
  .van-tabs__line {
    bottom: 22px;
    background-color: #ffe000;
  }
}

.container {
  width: 96%;
  height: 100%;
  margin: 10px auto 5px;
  overflow: auto;
}
</style>