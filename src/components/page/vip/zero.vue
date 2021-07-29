<template>
  <!-- 零元购 -->
  <div class="zero">
    <moduleTitle :info="info"></moduleTitle>
    <div class="zero_list" v-for="(item,k) in info.banner" @click="$router.push({path:'/shop/shopdetails',query:{id:item.id}})">
      <p>
        <img :src="$fnc.getImgUrl(item.piclink)" alt="">
      </p>
      <div class="zero_info">
        <p style="line-height: 24px;">{{item.title.length > 25 ? item.title.slice(0,25) + "..." : item.title}}</p>
        <div class="zero_price">
          <div class="price">
            <p>市场价：￥{{item.price}}</p>
            <p>￥<span>0.00</span></p>
          </div>
          <p class="zero_btn">马上抢</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moduleTitle from '@/components/page/vip/moduleTitle'
  export default{
    data(){
      return{
        title: "金都一号红心火龙果5斤新鲜水果应当季整箱批发大红肉蜜宝10元包邮"
      }
    },
    props: {
      info: {
        type: Object,
        default: () => {
          return {
            banner: [],
          };
        }
      },
      background: {
        type: String,
        default: "transparent"
      }
    },
    components:{
      moduleTitle
    },
    created() {}
  }
</script>

<style lang="less" scoped>
  .zero{
    background: #f6f6f6;
    height: 100%;
    overflow: auto;
    .zero_list{
      display: flex;
      background: #fff;
      margin: 10px 10px 0;
      padding: 10px;
      border-radius: 10px;
      
      >p{
        line-height: 1;
        
        img{
          width: 99px;
          height: 99px;
          border-radius: 10px;
        }
      }
      
      .zero_info{
        margin-left: 12.5px;
        font-size: 14px;
        width: 100%;
        
        .zero_price{
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-top: 10px;
          
          .price{
            font-size: 12px;
            color: #b8b8b8;
            line-height: 20px;
            
            p:nth-of-type(1){
              text-decoration: line-through;
            }
            
            p:nth-of-type(2){
              color: #ff0000;
              
              span{
                font-size: 18px;
                font-weight: bold;
              }
            }
          }
          
          .zero_btn{
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            background-image: linear-gradient(to right, #ff795f, #ff4363);
            padding: 0 15px;
            border-radius: 20px;
            margin-bottom: 3px;
          }
        }
      }
    }
  }
</style>
