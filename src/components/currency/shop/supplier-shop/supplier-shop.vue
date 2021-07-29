<template>
  <div class="supplier-shop">
    <router-link :to="'/shop/shopdetails?tid='+appusers.uid+'&id='+item.id">
      <van-image
        lazy-load
        :src="item.piclink"
        class="supplier-shop-img"
        radius="5"
      >
        <template v-slot:loading>
          <van-loading type="spinner" size="20" />
        </template>
      </van-image>
      <p class="supplier-shop-title van-ellipsis">{{item.title}}</p>
      <div class="supplier-shop-price fx">
          <div>
            <p><small>￥</small>{{$fnc.toFixedZ(item.price,1)}}<small>起</small></p>
            <p><span>￥</span><small>{{$fnc.toFixedZ(item.market_price,1)}}</small></p>
          </div>
          <div>
              抢
          </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { Image, Loading } from "vant";
export default {
  name: "supplier-shop",
  props:{
    item:{
      type:Object,
      default:()=>{}
    }
  },
  data() {
    return {};
  },
  components: {
    [Image.name]: Image,
    [Loading.name]: Loading
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='less' scoped>
.supplier-shop {
  font-size: 14px;
  line-height: 1.1;
  margin-right: 12px;
  >a{
    display: block;
  }
  
  .supplier-shop-title{
    font-size: 13px;
    padding: 10px 0;
        max-width: 108px;
    overflow:hidden;
    color: #282828;
    font-weight: bold;
  }
  .supplier-shop-price{
    >div:first-child{
      >p:first-child{
        color: #363636;
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 7px;
        small{
          font-size: 10px;
          font-weight: normal;
        }
      }
      >p:last-child{
        color: #8e8e8e;
        font-size: 11px;
        
        >small{
          font-size: 11px;
          text-decoration: line-through;
        }
      }
    }
    >div:last-child{
      color: #fff;
      background:linear-gradient(to bottom, #fe791f, #f25e3a) ;
      padding: 5px 8px;
      border-radius: 20px;
    }
  }
}
.supplier-shop-img{
  width: 108px;
  height: 108px;
}
</style>
