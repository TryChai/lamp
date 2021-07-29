<template>
  <div class="supplier-shop-details-navbar">
    <div @click="$router.push('/supplier/new-shops')">
      <van-icon name="shop-o" />
      <p>网站首页</p>
    </div>
    <div @click="$router.push('/im/mes?id=' + info.im)">
      <van-icon name="manager-o" />
      <p>客服</p>
    </div>
    <div @click="$router.push('/shop/shopcard')">
      <van-icon name="shopping-cart-o" />
      <p>购物车</p>
    </div>
    <!-- <div>
          <van-icon name="records" />
          <p>商家投诉</p>
    </div>-->
    <div
      class="fx lastBtn"
      v-show="is_supplier_pay == 1"
      @click="$router.push('/zhanye/receipt/transaction?id=' + $route.query.id)"
    >
      <p>到店付</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "supplier-shop-details-navbar",
  props: ["is_supplier_pay", "info"],
  data() {
    return {};
  },
  components: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang='less' scoped>
.supplier-shop-details-navbar {
  box-sizing: inherit;
  border-top: 1px solid #f1e8e8;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  background: #ffffff;
  > div {
    flex: 1;
    text-align: center;
    color: #333333;
    align-self: center;
    margin: 6px 0;
    i {
      font-size: 19px;
      color: #8f8f8f;
    }
    p {
      font-size: 12px;
      color: #999999;
    }
  }
  > div:first-child,
  > div:nth-child(2) {
    border-right: 1px solid #ebebeb;
  }
  .lastBtn {
    margin: 0;
    height: 52px;
    width: 142px;
    flex: 2;
    justify-content: center;
    background: linear-gradient(to right, #fea347, #ec7b1e);
    p {
      color: #ffffff;
    }
  }
}
</style>
