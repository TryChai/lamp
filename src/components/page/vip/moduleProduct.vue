<template>
  <div class="module_part_body" :style="{ backgroundColor: background }">
    <moduleTitle :info="info"></moduleTitle>
    <van-list v-model="loading" :finished="finished" finished-text="--END--" @load="onLoad">
      <div class="active_box" v-if="info.style == '0'">
        <indexshoplist :top_shoplist="info.banner" />
      </div>

      <div class="active_box" v-else-if="info.style == '1'">
        <oneShop :info="item" v-for="(item, i) in info.banner" :key="i" />
      </div>

      <div class="active_box" v-else>
        <card :top_shoplist="info.banner" />
      </div>
    </van-list>
  </div>
</template>

<script>
import moduleTitle from "@/components/page/vip/moduleTitle";
import presaleItem from "@/components/shop/presale/presale_shop_item";
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
import oneShop from "@/components/currency/page/one-shop.vue";
import card from "@/components/currency/page/card2.vue";
import { List } from "vant";
export default {
  props: {
    iden: {
      type: String,
      default: ''
    },
    info: {
      type: Object,
      default: () => {
        return {
          banner: [],
        };
      },
    },
    background: {
      type: String,
      default: "transparent",
    },
  },
  data () {
    return {
      loading: false,
      finished: false,
      page: 2,
      page_size: 20,
      proList: [],
    };
  },
  components: {
    moduleTitle,
    presaleItem,
    indexshoplist,
    oneShop,
    card,
    [List.name]: List,
  },
  created () { },
  mounted () { },
  methods: {
    onLoad (e) {
      var params = {};
      if (this.info.is_page == 1) {
        this.loading = true;
        params.page = this.page;
        params.page_size = 20;
        params.iden = this.iden || this.$route.query.iden;

        this.$api.getPage.get_pageproduct(params).then((res) => {
          if (res.code == 200) {
            if (this.page === 1) this.info.banner = [];
            let arr = res.result;
            this.info.banner = this.info.banner.concat(arr);
            if (res.result && res.result.length == this.page_size) {
              this.page++;
            } else {
              this.finished = true;
            }
            setTimeout(() => {
              this.loading = false;
            }, 3000);
          }
        });
      } else {
        this.finished = true;
      }
    },
    href_inspect (val) {
      if (val == "/plugin/turntable") {
        this.$store.commit("set_turnshow", true);
        return;
      }
      this.$fnc.goLink(val);
    },
  },
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
</style>
