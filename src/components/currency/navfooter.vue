<template>
  <van-tabbar v-model="active" @change="navchange" :fixed="true" :z-index="10" class="bottom-tab" :safe-area-inset-bottom="true"
      :active-color="$store.state.config.shop && $store.state.config.shop.bottom_color?$store.state.config.shop.bottom_color:''">
    <van-tabbar-item :icon="footer.piclink" :to="footer.links"
        :info="footer.links.indexOf('/im')>=0?(allUnreadCount || ''): footer.links == '/shop/shopcard' && car_num > 0 ? car_num:''"
        v-for="(footer) in footerList" :name="footer.links" :key="footer.id">{{$h(footer.title)}}</van-tabbar-item>
  </van-tabbar>
</template>


<script>
// allUnreadCount
import { Tabbar, TabbarItem } from "vant";
import Cookies from "js-cookie";
import { mapState } from "vuex";
export default {
  name: "navfooter",
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  props: {},
  data () {
    return {
      active: 0,
      footerList: []
    };
  },
  created () {
    this.getNavber();
    for (var i in this.footerList) {
      if (this.footerList[i].links.split("?")[0] == this.$route.path) {
        this.active = this.footerList[i].links;
        break;
      }
    }
  },
  computed: {
    ...mapState({
      conversationList: state => state.conversation.conversationList,
      car_num: state => state.car_num

    }),
    allUnreadCount () {
      var index = 0;
      for (var i in this.conversationList) {
        index += this.conversationList[i].unreadCount;
      }

      return index; //得到总IM未读消息
    },
    getFooter () {
      return this.$store.state.config;
    }
  },
  methods: {
    navchange (index) {
      if (index == '/page/producting') {
        this.$toast.fail('正在开发中...')
      }
      if (navigator.userAgent.indexOf("miniProgram") != -1 && navigator.userAgent.indexOf("Android") != -1 &&
        index == "/supplier/new-shops") {
        window.location.href = `${window.location.origin}/supplier/new-shops`;
      }
    },
    getNavber () {
      var user = Cookies.get("user") ? false : true;
      var arr = this.$store.state.config.footer || [];
      if (JSON.stringify(this.$store.state.config) == "{}") {
        this.$api.getUser.getConfig({}).then(res => {
          if (res.code == 200) {
            this.$store.commit("setConfig", res.result);
            var imISoPen = res.result.plugin.imhyjsnt.is_open;
            var a1 = res.result.footer;
            for (var i in a1) {
              if (a1[i].links.indexOf("im") >= 0 && imISoPen == 0) {
                continue;
              }
              this.footerList.push(a1[i]);
              if (a1[i].links == "/shop/shopcard") {
                if (user == true) {
                  this.getCardNumber();
                }
              }
            }
          }
        });
      } else {
        this.footerList = [];
        for (var i in arr) {
          this.footerList.push(arr[i]);
          if (arr[i].links == "/shop/shopcard") {
            if (user == true) {
              this.getCardNumber();
            }
          }
        }
      }
    },
    getCardNumber () {
      this.$store.dispatch("getCardNum");
    }
  },
  watch: {
    $route (to) {
      for (var i in this.footerList) {
        if (
          this.footerList[i].links.indexOf(to.fullPath.split("&VNK=")[0]) >=
            0 ||
          this.footerList[i].links.indexOf(to.fullPath.split("?VNK=")[0]) >= 0
        ) {
          this.active = this.footerList[i].links;
          break;
        }
        // if (this.footerList[i].links.indexOf(to.path) >= 0) {
        //   this.active = this.footerList[i].links;
        //   break;
        // }
      }
    },
    getFooter (val) {
      if (val) {
        this.getNavber();
      }
    }
  }
};
</script>


<style scoped>
.foot_div {
  height: 50px;
}
.foot-nav {
  position: fixed;
  bottom: 0;
  z-index: 10;
}
.foot-nav {
  position: relative;
  bottom: 0;
  z-index: 10;
}
</style>
