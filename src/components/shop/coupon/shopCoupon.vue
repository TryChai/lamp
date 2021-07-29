<template>
  <div class="shopCoupon">
    <div class="money">
      <small>¥</small>
      <b>{{$fnc.toFixedZ(coupon.money,0)}}</b>
    </div>
    <div class="packDesc">
      <p class="moneyCount">满{{coupon.xfm}}元使用</p>
      <p class="couponTime">有效期：{{formatTime(coupon.begin_time)}} - {{formatTime(coupon.end_time)}}</p>
    </div>
    <div class="moneyTypeColor">
      <img src="@/assets/img/shop/coupon_type1.png" width="100%" height="100%" alt="">
    </div>
  </div>
</template>

<script>
export default {
  props:{
    coupon:Object
  },
  mounted(){
    console.log('kkkk',this.coupon)
  },
  methods:{
    formatTime(str){
      if(!str){
        return '----'
      }
      let time = new Date(Number(str)*1000)
      let year = time.getFullYear()
      let month = time.getMonth()+1
      let date = time.getDate()
      return `${year}.${month}.${date}`
    }
  }
}
</script>

<style lang="less" scoped>
.shopCoupon{
  width: 95%;
  height: 85px;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  // background-color: skyblue;
  background: url('../../../assets/img/shop/coupon_bg.png');
  background-size: cover;
  margin: 0 auto;
  color: #fff;
  padding: 10px 0;
  position: relative;
  margin-bottom: 10px;
  .money{
    width: 75px;
    text-align: center;
    line-height: 52px;
    // padding-left: 10px;
    small{
      font-size: 16px;
      font-weight: bold;
    }
    b{
      font-size: 40px;
    }
    // height: ;
  }
  .packDesc{
    margin-right: auto;
    border-left: 1px solid #FFCFC9;
    padding-left: 10px;
    .moneyCount{
      font-size: 18px;
      font-weight: 100;
    }
    .couponTime{
      font-size: 11px;
      font-weight: 100;

    }
  }
  .moneyTypeColor{
    width: 65px;
    max-width: 70px;
    min-width: 70px;
    height: 65px;
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>