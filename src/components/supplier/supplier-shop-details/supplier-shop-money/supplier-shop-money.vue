<template>
  <div class="supplier-shop-products">
    <div class="fx pro_title">
      <div class="title">
        <van-icon name="cash-on-deliver" style="margin-right:10px;" size="18px"  />
        功德海
      </div>
      <div
        class="more"
      >
        实时
        <!-- <van-icon name="replay" /> -->
      </div>
    </div>
    <van-divider />
    <div v-if="list!=''">
      <public-item v-for="(item,index) in list" :key="index" :item="item"/>
      <div v-if="list.length>=10"  class="seemore" @click="$router.push('/dz/dz_money_more?id='+$route.query.id)">查看更多<van-icon name="arrow-down" /></div>
    </div>
    <div v-else>
      <van-empty description="还没有供奉信息~" />
      
    </div>
    
  </div>
</template>

<script>
import PublicItem from '@/components/dz/currency/publicItem.vue';
import { Empty,Divider } from "vant";
export default {
  name: "supplier-shop-money",
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
    PublicItem,
    [Empty.name]:Empty,
    [Divider.name]:Divider,
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
/deep/.van-divider{
  padding: 0;
  margin: 0;
}
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
.seemore{
  font-size: 14px;
  color: #7BA8ED;
  padding: 5px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
