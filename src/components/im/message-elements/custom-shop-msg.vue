<template>
  <div class='team-yq' @click="$router.push('/shop/shopdetails?id='+shopInfo.aid)">
 
      <div class="fx">
          <div>
              <van-image  width="77" radius="4px" height="77"  :src="shopInfo.piclink"  />
          </div>
          
          <div class="fx im-cust-com">
               <div class="team-yq-text">
                <p class="in-shop-title">{{shopInfo.title}}</p>
                <p class="in-shop-price"><small>￥</small>{{shopInfo.price}}</p>
            </div>
                <div class="tr">
                   <van-button type="primary" color="linear-gradient(to right, #f19800, #ff5407)" round  size="mini">查看商品</van-button>
                </div>
          </div>
      </div>
  </div>
</template>

<script>
import { Image } from 'vant';
export default {
  name: 'team-yq',
  props:{
      shopInfo:{
          type:Object,
          default:()=>{}
      }
  },
  data(){
    return {}
  },
  components: {
      [Image.name]:Image
  },
  created(){},
  mounted(){},
  methods: {}
}
</script>
<style lang='less' scoped>
.team-yq{
    font-size: 14px;
    line-height: 1.2;
    min-width: 230px;
    >div{
        align-items: flex-start;
        text-align: left;
        color: #757272;
        justify-content: flex-start;
        .team-yq-text{
            margin-left: 10px;
            
            .in-shop-title{
                word-break:break-all;
                display:-webkit-box;
                -webkit-line-clamp:2;
                -webkit-box-orient:vertical;
                overflow:hidden;
            }
            .in-shop-price{
                color: #dd6f47;
            }
        }
    }
}
.im-cust-com {
  flex-direction: column;
  justify-content: space-between;
  min-height: 80px;
  flex: 3;
  align-items: flex-start;
  .tr {
    width: 100%;
  }
  button{
        padding: 0px 8px;
    }
}
</style>
