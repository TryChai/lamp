<template>
  <div class='shop-details-quality'>
    <p class="shop-details-quality-title">官方品控师</p>
    <div class="shop-details-quality-box fx" @click="$router.push('/shop/quality?id='+quality.pid)">
      <div  class="shop-details-quality-box-user">
        <div>
            <img v-lazy='quality.uid_cn.avatar' alt="">
        </div>
        <p class="shop-details-quality-box-user-p1">{{quality.uid_cn.nickname}}</p>
        <p  class="shop-details-quality-box-user-p2">{{quality.uid_cn.number}}次品控</p>
      </div>
      <div class="shop-details-quality-box-con">
        <div class="shop-details-quality-box-con-label fx">
          <p>{{quality.score}}.0</p>
          <span v-for="(item,i) in getLabel(quality.label)" :key="i">{{item}}</span>
        </div>
        <div class="shop-details-quality-box-con-image">
          <van-image :src="item.piclink" lazy-load width="75" height="75" v-for="(item,i) in quality.image" :key="i">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Image,Loading  } from 'vant';
export default {
  name: 'shop-details-quality',
  props:{
    quality:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return {}
  },
  components: {
    [Image.name]:Image,
    [Loading.name]:Loading,
  },
  created(){},
  mounted(){},
  methods: {
    getLabel(str){
      if(str){
        return str.split("@");
      }
    }
  }
}
</script>
<style lang='less' scoped>
.shop-details-quality{
  line-height: 1;
  font-size: 14px;
  padding: 0 16px 16px 16px;
  .shop-details-quality-title{
    font-size: 15px;
    color: #333333;
    margin: 15px 0;
  }
  .shop-details-quality-box{
    justify-content: flex-start;
    align-items: flex-start;
    .shop-details-quality-box-user{
      min-width: 50px;
      >div{
        width: 32px;
        height: 32px;
        border-radius: 50%;
        position: relative;
        img{
          width: 32px;
          height: 32px;
          max-width: 100%;
          border-radius: 50%;
        }
      }
      .shop-details-quality-box-user-p1{
        color: #323232;
        margin-top: 8px;
      }
      .shop-details-quality-box-user-p2{
        color: #9a9a9a;
        font-size: 12px;
        margin-top: 4px;
      }
    }
    .shop-details-quality-box-con{
      background: #f4f4f4;
      min-height: 121px;
      margin-left: 26px;
      border-radius: 5px;
      position: relative;
      flex: 2;
      padding: 0 0 0 10px;
      .shop-details-quality-box-con-label{
        justify-content: flex-start;
        margin: 10px 0;
        p{
          font-size: 15px;
          color: #fa3e3d;
          font-weight: bold;
          margin-right: 10px;
        }
        span{
          color: #f97173;
          border: 1px solid #f97173;
          border-radius: 3px;
          padding: 2px 3px;
          margin-right: 4px;
        }
      }
      .shop-details-quality-box-con-image{
        >div{
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
    .shop-details-quality-box-con:before{
      content: '';
      position: absolute;
      top:12px;
      left:-0.39rem;
      width:0;
      height:0;
      border-top:0.4rem solid transparent;
      border-bottom:0.4rem solid transparent;
      border-right:0.4rem solid #f4f4f4;
    }
  }
}
</style>
