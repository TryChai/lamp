<template>
  <div class="module_part_body" :style="{backgroundColor:background}">
    <moduleTitle :info="info">

    </moduleTitle>
    <div class="active_box">

      <div class="active_box_item" v-for="(item,k) in info.banner" :key="k" style="width:95%;">
        <assembleShopItem :item="item"></assembleShopItem>

      </div>
    </div>
  </div>
</template>

<script>
import moduleTitle from '@/components/page/vip/moduleTitle'


import assembleShopItem from "@/components/currency/shop/assembleShop";
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
    moduleTitle,
    assembleShopItem

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
.righttitlte {
  //   width: 50% !important;
  font-size: 16px;
  color: #313131;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.assemble-item {
  padding: 13px 10px 17px;
  > div:not(:first-child) {
    margin-top: 10px;
  }
}
</style>
