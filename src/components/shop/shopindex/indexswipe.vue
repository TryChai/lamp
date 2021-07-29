<template>

    <van-swipe :autoplay="3000" class="shop_swipe"  @change="onChange">
      <van-swipe-item v-for="(item, index) in top_banner" :key="index" >
        <router-link :to="item.links">
          <img   :src="$fnc.getImgUrl(item.piclink)" class="shop_swi_img" />
        </router-link>
      </van-swipe-item>

      <div class="banner_jiaodian" slot="indicator">
          <span v-for="(item,index) in top_banner" :class="[current==index? 'ac_shop_wei':'']" :key="index"></span>
      </div>
    </van-swipe>
</template>

<script>
import { Swipe, SwipeItem,Image } from "vant";
export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Image.name]: Image,
  },
  props:{
    top_banner:{
      type:Array,
      default:()=>{return []} 
    }
  },
  data() {
    return {
      current:0
    };
  },
  methods:{
    onChange(index){
      this.current = index;
    }
  }
};
</script>

<style lang="less" scoped>
.ac_shop_wei{
  height: 6px !important;
  background: #ee6868 !important;
}
div.banner_jiaodian{
        position: absolute;
        bottom: 0px;
        right: 20px;
        z-index: 9;
        >span{
            display: inline-block;
            background: #fff;
            width: 6px;
            height: 2px;
            margin-left: 2px;

        }
    }
.shop_swipe{
    height: 158px;
    .shop_swi_img{
      width: 100%;
      height: 100%;
    }
}
</style>
