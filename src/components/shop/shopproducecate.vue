<template>
  <div class="shop_catebox">
    <div class="shop-cate-con" ref="shopcate" :class="[type==2?'bgwrite':'grey_cate']">
      <div class="cate_search">
        <van-icon name="arrow-left" size="22px" @click="toBack" />
        <div class="fx_3 shops-head-search" @click="getFous">
          <div class="fx" style="width:94%">
            <van-icon name="search" />
            <p>请输入搜索关键词</p>
          </div>
        </div>
        <van-icon name="cart-o" size="22px" @click="$router.push('/shop/shopcard')" />
      </div>
      <component :cate="cate" class="c1" :is="curent+type"></component>
    </div>

  </div>
</template>


<script>
import cate1 from "./shopcate/cate1";
import cate2 from "./shopcate/cate2";
import cate3 from "./shopcate/cate3";
import cate4 from "./shopcate/cate4";
import cate5 from "./shopcate/cate5";
export default {
  components: {
    cate1,
    cate2,
    cate3,
    cate4,
    cate5
  },
  data() {
    return {
      value: "",
      cate: [],
      type: 1,
      curent: "cate"
    };
  },
  created() {
    this.getShopCate();
  },
  methods: {
    getFous() {
      this.$router.push("/shop/shopsearch");
    },
    onSearch() {},
    onCancel() {},
    getShopCate() {
      this.$api.getShopCate.getShopCate({}).then(res => {
        if (res.code == 200) {
          this.cate = [];
          var arr = res.result.cate;
          arr.forEach(item => {
            if (item.show == 1) {
              this.cate.push(item);
            }
          });
          this.type = res.result.types;
        }
      });
    }
  }
};
</script>


<style lang="less" scoped>
.textSpc{
    letter-spacing:4px;
}
.shop_catebox {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;

  // overflow: hidden;
}

.shop-cate-con {
  flex-direction: column;
  height: 100%;
  min-height: 100%;
  overflow: auto;
  position: relative;
  touch-action: none;  padding-bottom: 50px;
}
.cate_search {
  top: 0;
  left: 0;
  right: 0;
}
.shops-head-search {
  font-size: 14px;
  > div {
    height: 31px;
    justify-content: flex-start;
    color: #888888;
    background: #f2f2f2;
    margin: 11px 56px 11px 10px;
    border-radius: 27px;
    padding-left: 12px;
    i {
      margin-right: 4px;
      font-weight: bold;
    }
  }
}

.c1 {
  //   padding-top: 53px;
  flex: 3;
  overflow: auto;
  // min-height: 90%;
}
.shopcate-nav {
  //   position: fixed;
  //   bottom: 0;
  width: 100%;
  height: 50px;
}
.grey_cate {
  background: #f5f6f8;
  display: flex;
  flex-flow: column;
  min-height: 90%;
}
.cate_search {
  padding: 0px 15px;
  height: 53px;
  border-bottom: 1px solid #f1f4f7;
  background: #fff;
  //   position: fixed;
  top: 0;
  width: 100%;
  z-index: 99;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  form {
    width: 90%;
    height: 100%;
  }
  .van-search {
    height: 100%;
    padding: 0 0px;
  }
  .van-search__content {
    height: 36px;
  }
}
.van-search .van-cell {
  align-items: center;
}
</style>
