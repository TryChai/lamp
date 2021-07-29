<template>
  <div class='not-address-title'>
    <img src="../../../../assets/img/shop/not-address.png" alt="">
    <div>
        <p>请先设置收货地址</p>
        <p>您还没有设置收货地址，不能提交订单。请点击设置收货地址</p>
        <van-button block round @click="toSendType(true)"  color="linear-gradient(to right, #f81e6c, #f00d3b)">去设置</van-button>
        <p @click="toSendType(false)">暂不设置</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'not-address-title',
  data(){
    return {}
  },
  components: {},
  created(){},
  mounted(){},
  methods: {
      toSendType(bool){
          this.$emit('toSendType',bool)
      }
  }
}
</script>
<style lang='less' scoped>
.not-address-title{
    width: 280px;
    font-size: 14px;
    line-height: 1.1;
    // background: #fff;
    img{
        display: block;
        width: 100%;
    }
    >div{
        height: 227px;
        background: #fff;
        margin-top: -25px;
        padding: 26px 23px 0;
        text-align: center;
        border-radius: 0 0 13px 13px;
        >p:first-child{
            font-size: 18px;
            color: #1f1f1f;
            line-height: 1.8;
            font-weight: 400;
            margin-bottom: 2px;
        }
        >p:nth-child(2){
            color: #737373;
            line-height: 1.8;
            margin-bottom: 32px;
        }
        >p:nth-child(4){
            color: #1f1f1f;
            font-size: 13px;
            line-height: 1.1;
            margin-top: 12px;
            font-weight: 400;
        }
    }
}
</style>
