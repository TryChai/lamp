<template>
  <div class="supplier-shop-products">
    <img src="../../../../assets/img/supplier/prod-title.png" alt="" />

    <indexshoplist
      @reset="reset"
      :top_shoplist="list"
      class="shop-search-con"
    />
  </div>
</template>

<script>
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
export default {
  name: "supplier-shop-products",
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
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
  methods: {},
};
</script>
<style lang='less' scoped>
.supplier-shop-products {
  > img {
    display: block;
    max-width: 100%;
    margin: 6px 0;
  }
}
</style>
