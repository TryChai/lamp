<template>
  <div class="im_index" style="position: relative; z-index: 2;">
    <div class="im_index_top" v-if="this.$store.state.config.plugin.imhyjsnt.is_open == 1">
      <van-search v-model="title" background="#F4F5F6" :placeholder="$h('搜索更多好友')" @search="onSearch" />
      <div class="fx im_index_top_nav">
        <div class="fx tc" @click.prevent="toIm('team')">
          <img src="../../assets/img/im/im_01.png" alt />
          <div :style="{color:$route.query.active == 'team' ? '#fb799e':'','font-weight':$route.query.active == 'team' ? 'bold':''}"> {{$h('我的团队')}}</div>
        </div>
        <div class="fx tc" @click.prevent="toIm('news')">
          <img src="../../assets/img/im/im_04.png" alt />
          <div :style="{color:$route.query.active == 'news' ? '#ac7ffe':'','font-weight':$route.query.active == 'news' ? 'bold':''}">{{$h('我的好友')}}</div>
          <span v-if="allUnreadCount>0" class="allUnreadCount">{{allUnreadCount}}</span>
        </div>
        <div class="fx tc" @click.prevent="toIm('check')">
          <img src="../../assets/img/im/im_03.png" alt />
          <div :style="{color:$route.query.active == 'check' ? '#fcac33':'','font-weight':$route.query.active == 'check' ? 'bold':''}">{{$h('待审核')}}</div>
        </div>
        <div class="fx tc" @click.prevent="toIm('clan')">
          <img src="../../assets/img/im/im_02.png" alt />
          <div :style="{color:$route.query.active == 'clan' ? '#80a9fe':'','font-weight':$route.query.active == 'clan' ? 'bold':''}">{{$h('我的战队')}}</div>
        </div>
      </div>
      <div style="height: 0.25rem; background:#f2f7fb;"></div>
    </div>
    <div v-else>
      <van-nav-bar :title="$h('我的团队')" left-arrow class="navbar" @click-left="toBack" />
    </div>
    <div class="im_index_con">
      <imindex v-if="active == 'team'"></imindex>
      <imteam v-if="active == 'clan'"></imteam>
      <imsearch v-if="active == 'search'" :title="title" :searchNum="searchNum" @setActive="setActive"></imsearch>
      <imslately v-if="active == 'news'"></imslately>
      <imcheck v-if="active == 'check'"></imcheck>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import imindex from "./im_index_con/imindex";
import imteam from "./im_index_con/team";
import imsearch from "./im_index_con/search";
import imslately from "./im_index_con/lately";
import imcheck from "./im_index_con/check";
export default {
  data () {
    return {
      searchNum: 0,
      active: "team",
      title: ""
    };
  },
  components: {
    imindex,
    imteam,
    imsearch,
    imslately,
    imcheck
  },
  created () {
    this.active = this.$route.query.active || "team";
  },
  methods: {
    setActive (val) {
      this.active = val;
      this.$router.push({ query: { active: val } });
    },
    onSearch () {
      this.active = "search";
      this.searchNum++;
    },
    toIm (str) {
      var team = this.$store.state.config.plugin.ltskt.is_open || ""; //IM战队 客服
      if (str == "team") {
        this.$router.push({ query: { active: "team" } });
      } else if (str == "news") {
        this.$router.push({ query: { active: "news" } });
      } else if (str == "clan" && team == 1) {
        this.$router.push({ query: { active: "clan" } });
      } else if (str == "clan" && team != 1) {
        this.$toast("敬请期待");
      } else if (str == "check") {
        this.$router.push({ query: { active: "check" } });
      }
    }
  },
  computed: {
    ...mapState({
      conversationList: state => state.conversation.conversationList
    }),
    allUnreadCount () {
      var index = 0;
      for (var i in this.conversationList) {
        index += this.conversationList[i].unreadCount;
      }
      return index; //得到总IM未读消息
    }
  }
};
</script>

<style lang="less" scoped>
.im_index {
  width: 100%;
  height: 100%;
  background: #f4f5f6;
  overflow: hidden;
  padding-bottom: 50px;
  .im_index_top {
    position: relative;
    z-index: 2;
    .van-search__content {
      background: #ffffff;
    }
    .im_index_top_nav {
      width: 100%;
      border-bottom: 1px solid #e0e0e0;
      background-color: #ffffff;
      > div {
        width: 25%;
        padding: 10px 0 6px;
        position: relative;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        > img {
          width: 45px;
          height: 45px;
          display: inline-block;
        }
        > div {
          color: #a09c9c;
          font-size: 12px;
          line-height: 2;
          position: relative;
          top: 0px;
        }
      }
    }
  }
  .im_index_con {
    width: 100%;
    height: 100%;
  }
  .allUnreadCount {
    position: absolute;
    top: 15px;
    right: 30px;
    box-sizing: border-box;
    min-width: 0.42667rem;
    padding: 0 0.08rem;
    color: #fff;
    font-weight: 500;
    font-size: 0.32rem;
    font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
    line-height: 0.37333rem;
    text-align: center;
    background-color: #ee0a24;
    border: 0.02667rem solid #fff;
    border-radius: 0.42667rem;
    -webkit-transform: translate(50%, -50%);
    transform: translate(50%, -50%);
    -webkit-transform-origin: 100%;
    transform-origin: 100%;
  }
}
</style>

