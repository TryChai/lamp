<template>
  <div class="supplier-shop-products">
    <div class="fx pro_title">
      <div class="title">
        <van-icon name="bulb-o" size="18px" color="#FCEE21" />
        【法务通告】
      </div>
      <div
        class="more"
        @click="$router.push('/dz/supplier_shop_more?id=' + sid)"
      >
        查看更多<van-icon name="arrow" />
      </div>
    </div>
    <indexshoplist
      :dz_bottom="10"
      @reset="reset"
      :top_shoplist="list"
      class="shop-search-con"
    />
  </div>
</template>

<script>
import indexshoplist from "@/components/shop/shopindex/indexshoplist_dz.vue";
export default {
  name: "supplier-shop-products",
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    sid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  components: {
    indexshoplist,
  },
  created() {},
  mounted() {},
  methods: {
    reset() {
      this.$emit("reset");
    },
  },
};
</script>
<style lang='less' scoped>
.supplier-shop-products {
  margin-top: 10px;
  > img {
    display: block;
    max-width: 100%;
    margin: 6px 0;
  }
  .pro_title {
    background: #fff;
    padding: 10px 10px;
  }
}
.title,
.more {
  font-weight: 700;
  color: #333333;
  font-size: 15px;
  font-family: PingFang SC, PingFang SC-Bold;
  display: flex;
  align-items: center;
}
</style>
