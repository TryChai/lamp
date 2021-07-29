<template>
  <div class="shop_list_con " :style="{'background': background}" id="shoplistcon">
    <waterfall :col='2' :gutterWidth="0" :gutterHeight="20" :data="top_shoplist" style="padding:5.5px;margin: 0 auto;display: flex;
    justify-content: space-between;
    align-items: flex-start;">
      <template>
        <div v-for="(item,n) in top_shoplist" :key="n" class="grid-item">
          <!-- <router-link :to="'/shop/shopdetails?tid='+appusers.uid+'&id='+item.id || ''"> -->
          <shopitem :item='item' />
          <!-- </router-link> -->
        </div>
      </template>
    </waterfall>
  </div>
</template>

<script>
import shopitem from '@/components/currency/shop/dz_shopitem.vue';


export default {
  components: {
    shopitem,

  },
  props: {
    top_shoplist: {
      type: Array,
      default: []
    },
    background: {
      type: String,
      default: "#f2f2f2"
    }
  },
  created () {

    // document.getElementById("shoplistcon").offsetWidth
  },
  data () {
    return {

    }
  },
  computed: {
    itemWidth () {
      return (348 * 0.5 * (document.documentElement.clientWidth / 375))
      // var width = document.getElementById("shoplistcon").offsetWidth * 0.45
      // return width
    },
    gutterWidth () {
      // return (171*1*(document.documentElement.clientWidth/375))	
    }
  },

}
</script>


<style lang="less" scoped>
.shop_list_con {
  // background: #f2f2f2;
  position: relative;
  z-index: 1;
  width: 100%;
  .grid-item {
    margin-bottom: 10px;
  }
}
</style>


