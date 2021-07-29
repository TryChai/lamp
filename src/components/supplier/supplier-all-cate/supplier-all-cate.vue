<template>
    <div class="shop_catebox">
    <van-nav-bar
      title="全部分类"
      left-text
      left-arrow
      class="navbar"
      :border="false"
      @click-left="toBack"
    />
        <div class="shop-cate-con"
            ref="shopcate"
            :class="[type==2?'bgwrite':'grey_cate']">
            <cate1  class="c1" :cate="cate" ></cate1>

        </div>



    </div>

</template>


<script>
import cate1 from "./supplier-all-cate-item";

export default {
    components: {
        cate1,
    },
    data () {
        return {
            value: "",
            cate: [],
            type: 1,
        };
    },
    created () {

        this.getShopCate();
    },
    methods: {
        getShopCate () {
            this.$api.getSupplier.getSupplierCate({id:this.$route.query.id || ''}).then(res => {
                if (res.code == 200) {
                    this.cate = res.result.cate;
                }
            });
        }
    }
};
</script>


<style lang="less" scoped>
.shop_catebox {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    // overflow: hidden;
    .navbar {
    background: linear-gradient(to right, #f18113, #de5f00);
    i,
    span,
    div {
      color: #fff;
    }
  }
}

.shop-cate-con {
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    overflow: auto;
    position: relative;
    touch-action: none;
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
