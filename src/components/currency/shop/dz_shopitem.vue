<template>
  <div class="shop_item_con">
    <div class="dddd1">
      <div class="active_type">{{item.status=='0'?'未开始':item.status=='1'?'进行中':'已结束'}}</div>
      <img
        :src="item.piclink"
        v-lazy="item.piclink"
        @click="tofwdetail"
        alt
      />
      <div class="title_pro">{{item.title&&item.title.length>=20?item.title.slice(0,20)+'...':item.title}}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      isVideoShop: (state) => state.config.shop.is_video_shop,
      isShowSales: (state) => state.config.shop.is_show_sales,
    }),
  },
  methods: {
    tofwdetail(){
      if(this.item.status=='1'){
        this.$router.push('/dz/dz_details?id='+this.item.id);
      }else if(this.item.status=='0'){
        this.$toast('活动还未开始');
      }else{
        this.$toast('活动已结束');
      }
    },
    toDetails(bool) {
      bool = bool || false;
      if (this.item.video && this.isVideoShop == 1 && bool) {
        this.$router.push(
          "/shop/shopdetails?id=" + this.item.id + "&showVideo=1"
        );
      } else {
        this.$router.push(
          "/shop/shopdetails?id=" + this.item.id + "&showVideo=0"
        );
      }
    },
  },
};
</script>


<style lang="less" scoped>
.shop_item_con {
  border-radius: 5px;
  background: #fbfbfb;
  overflow: hidden;
  width: 100%;
  position: relative;
  // z-index: 2;
  .dddd1 {
    position: relative;
    width: 100%;
    padding: 10px 10px;
    .active_type{
      position: absolute;
      right: 10px;
      font-size: 12px;
      top: 0px;
      border: 1px solid #f35353;
      border-radius: 25px;
      padding: 0px 15px;
      // min-width: 100px;
      background: #feebeb;
          color: #f35353;

    }
    .title_pro{
      font-size: 14px;
      display: flex;
      justify-content: center;

    }
    
  }

  img {
    width: 100%;
    z-index: 3;
  }
}
</style>
