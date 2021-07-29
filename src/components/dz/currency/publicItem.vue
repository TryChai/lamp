<template>
  <div class="rankingitem">
    <div>
      <img :src="$fnc.getImgUrl(item.avatar)" alt="" />
    </div>
    <div>
      <p class="price">{{ item.is_anonymous=='1'?'匿名':item.nickname || '小施主'  }}</p>
      <div>
        <p v-if="type!='2'">{{ $fnc.getTimeFormat(item.created_time) }}</p>
        <div>
          <p class="price1"><span>S$</span>{{ $fnc.toFixedZ(item.money) }}</p>
        </div>
      </div>
       <p  v-if="item.is_public=='1'">{{item.shop_wish}}</p>
    </div>
   
  </div>
</template>
<script>
export default {
  name: "publicItem",
  data() {
    return {};
  },
  props:{
    item:{
        type:Object,
        default:{}
    },
    type:{
      type:[String,Number],
      // default:"",
    }
  },
  components: {},
  mounted() {
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.rankingitem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 0;
  > div:first-of-type {
    width: 42px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    > img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  > div:nth-of-type(2) {
    margin-left: 10px;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    .price{
      font-size: 15px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      color: #333333;
      line-height: 16px;
    }
    .price1{
       font-size: 18px;
        font-family: PingFang SC, PingFang SC-Heavy;
        font-weight: 500;
        text-align: left;
        color: #333333;
        line-height: 18px;
        margin-top: 5px;
        span{
          font-size: 14px;
        }
    }
    > div:first-of-type {
      font-size: 15px;
      font-family: PingFang SC, PingFang SC-Bold;
      line-height: 16px;
      display: flex;
      justify-content: space-between;
      > p:first-of-type {
        margin-top: 8px;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        word-break: break-all;
      }
    }
    
    > p:last-of-type {
      margin-top: 8px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #333;
      line-height: 18px;
      width: 220px;
    }
  }
  > div:last-of-type {
    font-size: 18px;
    font-family: PingFang SC, PingFang SC-Heavy;
    font-weight: 500;
    text-align: left;
    color: #333333;
    line-height: 18px;
    width: 100%;
    flex: 1;
  }
}
.rankingitem + .rankingitem {
  border-top: 1px solid #ebedf0;
}

</style>