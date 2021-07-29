<template>
    <div>
        <div class="foot_div"></div>
       <van-tabbar v-model="active">
        <van-tabbar-item  to="/shop/index" icon="wap-home">首页</van-tabbar-item>
        <van-tabbar-item  to="/shop/shopcate" icon="qr">分类</van-tabbar-item>
         <van-tabbar-item  to="/shop/shopcard" icon="qr">购物车</van-tabbar-item>
         <van-tabbar-item  to="/member/member" icon="qr">我的</van-tabbar-item>
        <!-- <van-tabbar-item replace to="/im/imindex" icon="friends-o">发现</van-tabbar-item>
        <van-tabbar-item replace to="/star/starjyzx" icon="gold-coin-o">星球市场</van-tabbar-item>
        
        <van-tabbar-item replace to="/member/member" icon="birthday-cake-o">我的基地</van-tabbar-item> -->
      </van-tabbar>
    </div>
</template>


<script>
import { Tabbar, TabbarItem } from 'vant';
export default {
  name:"navfooter",
  components:{
    [Tabbar.name]:Tabbar,
    [TabbarItem.name]:TabbarItem,
  },
  props:{
    index:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      active: this.index
    }
  }
}
</script>


<style scoped>
.foot_div{
  height: 50px;
}
</style>
