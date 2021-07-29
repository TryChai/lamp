<template>
  <div class="head_con_shop">
    <div class="head_shop fx">
      <van-icon name="bars"/>
      <span>{{ str }}</span>
      <van-icon name="comment-o"/>
    </div>
    <div class="shop_search" @click="$router.push('/shop/shopsearch')">
      <van-icon name="search"/>
      <span>请输入您要搜索的关键词</span>
    </div>
    <div class="head_tabls fx">
      <!-- <div>
        <router-link :to="item.links || ''" v-for="(item,index) in product_cate" :title="item.title" :key="index">
          <img src="../../../assets/img/shop/mao.png" v-if="index==0" alt>
          {{item.title}}
        </router-link>
      </div>-->

      <van-tabs :border="false" :swipeable="true" :ine-height="0">
        <van-tab v-for="(item,index) in product_cate" :key="index">
          <div slot="title">
            <a :href="index">
              <img src="../../../assets/img/shop/mao.png" v-if="index==0" alt>
              {{item.title}}
            </a>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {str:''};
  },
  props: {
    product_cate: {
      type: Array,
      default:()=>{return []} 
    }
  },
  created(){
    this.str=this.$store.state.config.shop.head? this.$store.state.config.shop.head : '';
  }
};
</script>



<style lang="less" scoped>
.head_con_shop {
  padding: 5px 0px 0 0;
  .shop_search {
    border-radius: 27px;
    background: #f4f4f4;
    text-align: center;
    color: #c5c5c5;
    font-size: 14px;
    height: 41px;
    line-height: 41px;
    > i {
      font-size: 20px;
      vertical-align: middle;
    }
  }
  .head_tabls {
    > div {
      width: 100%;
    }
    a {
      img {
        width: 18px;
        vertical-align: text-top;
      }
      font-size: 15px;
      color: #8d8d8d;
    }
    .van-tabs__line {
      display: none;
    }
  }
}
.head_shop {
  height: 45px;
  left: 45px;

  color: #dbdbdb;
  font-size: 23px;
  > span {
    color: #545151;
  }
}
.router-link-active {
  color: #ee6868 !important;
}
</style>

