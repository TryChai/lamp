<template>
  <div
    class="shop_list_con"
    :style="{ background: background,marginBottom:dz_bottom+'px' }"
    id="shoplistcon"
  >
    <div v-show="dz_bottom=='10'?n<5:true" v-for="(item, n) in top_shoplist" :key="n" class="grid-item">
      <shopitem :item="item" />
    </div>
  </div>
</template>

<script>
import shopitem from "@/components/currency/shop/dz_shopitem.vue";
import { List } from "vant";
export default {
  components: {
    shopitem,
    [List.name]: List,
  },
  props: {
    top_shoplist: {
      type: Array,
      default: [],
    },
    background: {
      type: String,
      default: "#f2f2f2",
    },
    dz_bottom:{//底部距离
      type:[String,Number],
    }
  },
  created() {
  },
  data() {
    return {
      loading: false,
      finished: false,
    };
  },
  computed: {

  },
  methods: {},
};
</script>


<style lang="less" scoped>
.shop_list_con {
  overflow: auto;
  z-index: 1;
  width: 100%;
  height: 100%;
  .grid-item {
    margin-bottom: 10px;
  }
}
</style>


