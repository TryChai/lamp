<template>
  <div class="content_height">
    <router-view />
    <!-- <router-link to="/">点击进入首页</router-link> -->
  </div>
</template>
<script>
import Cookies from "js-cookie";
import { mapState } from "vuex";
export default {
  name: "Index2",
  created () {
    var foot = Cookies.get("foot") ? true : false;
    if (!foot) {
      this.$store.dispatch("getconfig");
    }
  },
  computed: {
    ...mapState({
      footer: state => state.config.footer
    })
  },
  mounted () {
    //  var foot = Cookies.get("foot") ? JSON.parse(Cookies.get("foot")) : {link:'/'};
    //       window.location.href=foot.links;
  },
  watch: {
    footer: {
      handler (val) {
        this.$store.commit("setShowTabbar", true);
        if (this.$fnc.isWx()) {
          this.$router.replace(val[0].links);
        } else {
          window.location.href = window.location.origin + val[0].links + '&VNK=b0277841';
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
