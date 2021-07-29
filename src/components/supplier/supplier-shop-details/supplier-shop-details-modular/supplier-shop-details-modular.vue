<template>
  <div class="supplier-shop-details-Modular">
    <all-module-item :partList="partList" background="transparent" />
  </div>
</template>

<script>
import { Image, Loading } from "vant";
import allModuleItem from "@/components/currency/page/all-module-item/all-module-item";
export default {
  name: "supplier-shop-details-Modular",
  props: {
    partList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  components: {
    [Image.name]: Image,
    [Loading.name]: Loading,
    allModuleItem
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='less' scoped>
</style>
