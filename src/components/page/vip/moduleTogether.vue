<template>
  <div class="module_part_body" :style="{ backgroundColor: background }">
    <moduleTitle :info="info"> </moduleTitle>
    <div class="active_box">
      <div class="groupbuy_cate">
        <div class="groupbuy_cate_top">
          <div
            v-for="(cate, i) in info.banner"
            :key="i"
            @click="selCate(cate)"
            :class="active == cate.id ? 'groupbuy_active' : ''"
          >
            <p>{{ cate.title }}</p>
            <p>{{ cate.sub_title }}</p>
            <p></p>
          </div>
        </div>
      </div>
      <oneShop :info="item" v-for="(item, i) in productList" :key="i" />
    </div>
  </div>
</template>

<script>
import moduleTitle from "@/components/page/vip/moduleTitle";

import assembleShopItem from "@/components/currency/shop/assembleShop";
import oneShop from "@/components/currency/page/one-shop-gb.vue";
export default {
  name: "",
  props: {
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
  data() {
    return {
      active: "",
      productList: [],
      cateList: [],
      bannerHeight: "",
    };
  },
  components: {
    moduleTitle,
    assembleShopItem,
    oneShop,
  },
  created() {
    if (this.info.banner && this.info.banner.length > 0) {
      this.active = this.info.banner[0].id;
    }
  },
  mounted() {},
  methods: {
    selCate(val) {
      this.active = val.id;
    },

    getshop() {
      var params = {};
      params.page = 1;
      params.id = this.active || "";
      this.$api.getShop.get_groupbuyProduct(params).then((res) => {
        if (res.code == 200) {
          this.productList = res.result;
        }
      });
    },
    href_inspect(val) {
      if (val == "/plugin/turntable") {
        this.$store.commit("set_turnshow", true);
        return;
      }
      this.$fnc.goLink(val);
    },
  },
  watch: {
    active(to, from) {
      this.getshop();
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

.assemble-item {
  padding: 13px 10px 17px;
  > div:not(:first-child) {
    margin-top: 10px;
  }
}
.groupbuy_cate {
  width: 100%;
  height: 100%;
  background: transparent;
  padding: 0 10px 0 3px;
  margin: 12px 0;
  .groupbuy_cate_top {
    width: 100%;
    display: -webkit-box;
    overflow-y: hidden;
    > div {
      position: relative;
      width: 25%;
      line-height: 1.5;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      text-align: center;
      > p {
        width: 100%;
      }
      > p:nth-of-type(1) {
        color: #3a4658;
        font-size: 16px;
        font-weight: bold;
      }
      > p:nth-of-type(2) {
        color: #999999;
        font-size: 12px;
        padding-bottom: 10px;
      }
      > p:nth-of-type(3) {
        position: absolute;
        bottom: 0;
        width: 50%;
        height: 0;
        border: 1px solid transparent;
      }
    }
    .groupbuy_active {
      > p:nth-of-type(1) {
        color: #f21551;
      }
      > p:nth-of-type(2) {
        color: #f21551;
      }
      > p:nth-of-type(3) {
        border: 1px solid #f21551;
      }
    }
  }
}
</style>
