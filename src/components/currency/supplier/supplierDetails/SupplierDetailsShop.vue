<template>
  <div>
    <van-cell-group class="ad_shop mar-top-8">
      <van-cell title="商家名称" class="cell" :value="item.shop_title"></van-cell>

      <van-cell title="商家品类" class="cell" :value="cateTitle"></van-cell>

      <van-cell
        title="商家地址"
        class="cell"
        :value="$fnc.deleteNumber(item.shop_province+item.shop_city+item.shop_area+item.shop_town)+item.shop_address"
      ></van-cell>
      <van-cell title="商家电话" class="cell" :value="item.shop_tel || '无'"></van-cell>
    </van-cell-group>

    <van-button type="warning" class="mar-top-8 ts-buton" size="large" :to="'/supplier/suppliercomplaint?id='+item.id">商家投诉</van-button>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      cateTitle: "",
      list: []
    };
  },
  created() {
    this.getCate();
  },
  methods: {
    getCate() {
      this.$api.getShop.getShopCate({}).then(res => {
        if (res.code == 200) {
          this.list = res.result.cate;
          if (this.item.shop_cate) {
            var val = this.item.shop_cate.split("@") || [];
            var chenk = this.$fnc.getCheck(val, this.list);
            this.cateTitle = "";
            for (var i in chenk) {
              this.cateTitle += " / " + chenk[i].title;
            }
            this.cateTitle = this.cateTitle.slice(2);
          }
        }
      });
    }
  },
  mounted() {}
};
</script>


<style lang="less" scoped>
.mar-top-8 {
  margin-top: 8px;
 
}
.ts-buton{
   height: 40px;
   line-height: normal;
   display: flex;
   align-items: center;
   justify-content: center;
}
</style>
