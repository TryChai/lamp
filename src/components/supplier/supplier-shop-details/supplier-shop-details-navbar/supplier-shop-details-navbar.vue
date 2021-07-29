<template>
  <div class='supplier-shop-details-navbar'>
    <div class="shops-logo">
        
        <img v-lazy="info.shop_logo"  alt="">
    </div>
    <div>
        <img src="../../../../assets/img/supplier/01.jpg" alt="">
        <p>全部宝贝</p>
    </div>
    <div>
        <img src="../../../../assets/img/supplier/02.jpg" alt="">
        <p>主页</p>
    </div>
    <div v-if="isHaveCaute">
        <img src="../../../../assets/img/supplier/03.jpg" alt="">
        <p>宝贝分类</p>
    </div>
    <div>
        <img src="../../../../assets/img/supplier/04.jpg" alt="">
        <p>联系客服</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'supplier-shop-details-navbar',
  props:{
      info:{
          type:Object,
          default:()=>{}
      },
      isHaveCaute:null
  },
  data(){
    return {}
  },
  components: {},
  created(){},
  mounted(){},
  methods: {}
}
</script>
<style lang='less' scoped>
.supplier-shop-details-navbar{
    display: flex;
    justify-content: space-between;
    background: #fff;
    >div{
        flex: 1;
        text-align: center;
        color: #333333;
        align-self: center;
        img{
            width: 20px;
            margin: 6px 0;
        }
        p{
            font-size: 12px;
            margin-bottom: 6px;
        }
    }
    .shops-logo{
            img{
                width: 35px;
                height: 35px;
                border-radius: 50%;
            }
        }
}
</style>
