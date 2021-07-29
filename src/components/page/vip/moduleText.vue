<template>
  <div class :style="{backgroundColor:background}">
    <div class="phone_shop_copyright" @click="href_inspect(info.links)" v-if="info.title != ''">{{info.title}}</div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          banner: [],
        };
      }
    },
    background: {
      type: String,
      default: "transparent"
    }
  },
  data () {
    return {

      bannerHeight: "",
    };
  },
  components: {


  },
  created () { },
  mounted () { },
  methods: {

    href_inspect (val) {
      if (val == "/plugin/turntable") {
        this.$store.commit("set_turnshow", true);
        return;
      }
      this.$fnc.goLink(val);

    }
  }
};
</script>
<style lang='less' scoped>
.phone_part {
  width: 100%;
  background-color: white;
  margin: 10px 0 0px;
  position: relative;
}
.phone_part_body {
  width: 94%;
  margin: 0 auto;
}
</style>
