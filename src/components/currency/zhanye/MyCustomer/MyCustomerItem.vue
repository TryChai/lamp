
<template>
  <div class="my-cust-item">
    
    <div class="fx">
      <router-link :to="'/zhanye/zhanyeinfo?id='+item.uid+'&time='+item.view_time_all+'&hit='+item.hit_all" class="fx">
      <div>
        <img :src="item.avatar" v-lazy='item.avatar' alt />
        <span>{{item.nickname && item.nickname.slice(0,10)}}</span>
      </div>
      <div>
          <!-- <small>{{item.custom_type | isType}}</small> -->
          <van-icon name="arrow" color='#d1d1d1' size='13px' />
      </div>
      </router-link>
    </div>
    
    <div>
        <p>
            最近浏览时间：<span>{{$fnc.getTimeFormat(item.view_last_time)}}</span>
        </p>
        <p>
            总浏览次数：<span class="item-s1">{{item.hit_all}}次</span>
            总时长：<span>
              <van-count-down style="display:inline" :auto-start="false" :time="Number(item.view_time_all*1000)" />
            </span>
        </p>
    </div>
    <div v-show="item.content.length>0">
        <h3 class="fx">跟进记录</h3>
        <div  :class="{showListHeight:item.show}">
            <p class="fx" v-for="(it,index) in item.content" :key="index">
                <span class="time-floow"  style="line-height:1.4">{{($fnc.mstime(it.follow_time))}}</span>
                <span class="fx_3 " style="line-height:1.4">{{it.content}}</span>
            </p>
        </div>
        <p class="tr" v-show="item.content.length>1">
          <span @click="showList">{{item.show?'收起':"展开"}}</span>
          <van-icon name="arrow-down" />
        </p>
    </div>
    <div class="fx">
      <div class="fx_2 tc" @click.prevent='$fnc.tel(item.tel)' v-if="item.tel">
        <a >
          <van-icon name="aim" />
          <span>打电话</span>
        </a>
      </div>
      <div class="fx_2 tc"  v-else>
        <a >
          <van-icon name="aim" />
          <span>暂无电话</span>
        </a>
      </div>
      <div class="fx_2 tc">
        <router-link :to="'/zhanye/addfollowup?id='+item.id+'&name='+item.nickname+'&title='+item.custom_type">
        <van-icon name="todo-list-o" />
        <span>写跟进</span>
        </router-link>
      </div>
    </div>


    
  </div>
</template>

<script>
import { CountDown } from 'vant';
export default {
  components:{
    [CountDown.name]:CountDown
  },
  props:{
    item:{
      type:Object,
      default:()=>{}
    },
    index:{
      type:Number,
      default:-1
    }
  },
  methods:{
    showList(){
      this.$nextTick(()=>{
          this.$emit('upshow',{index:this.index,bool:!this.item.show})
      })
    
      
    }
  },
  filters:{
    isType(index){
      if(index==1){
        return 'A类客户'
      }else if(index==2){
        return 'B类客户';
      }else if(index==3){
        return 'C类客户';
      }else {
        return '其他';
      }
    }
  }
}
</script>


<style lang="less" scoped>
.time-floow{
  flex: none;
  min-width: 80px;
}
.showListHeight{
  max-height: 200px !important;
}
.my-cust-item {
  background: #fff;
  padding: 0 14px;
  > div:first-child {
    height: 45px;
    color: #595959;
    border-bottom: 1px solid #fdf9f9;
    a{
      width: 100%;
    }
     div {
      height: 100%;
      display: flex;
      align-items: center;
    }
    img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      box-shadow: 0 0px 10px #f0f0f0;
      margin-right: 9px;
    }
    span {
      font-size: 16px;
    }
    small{
        font-size: 13px;
        color: #ff0000;
        margin-right: 10PX;
    }
  }
  >div:nth-child(2){
      padding: 15px 0;
      color: #c4c4c4;
      font-size: 13px;
      font-weight: 400;
      >p:first-child{
          margin-bottom: 10px;
      }
      span{
          color: #595959;
      }
      .item-s1{
          margin: 0 60px 0 10px;
      }
  }
  >div:nth-child(3){
      background: #f8f8f8;
      padding: 8px 10px 0 5px;
      overflow: hidden;
      h3{
          font-size: 13px;
          color: #595959;
          border-left: 2px solid #89878a;
          padding-top: 3px;
          padding-left: 5px;
          vertical-align: middle;
          
      }
      >div{
          max-height: 50px;
          overflow: hidden;
          padding: 0 10px;
          p{    
            min-height: 50px;
            padding-top: 6px;
            color: #acacac;
              >span{
                  height: 100%;
              }
              align-items: flex-start;
          }
      }
      >p{
        padding: 0 10px 5px;
        font-size: 12px;
        color: #d2d2d2;
      }

  }
  >div:last-child{
    height: 40px;
    
    >div{
      height: 100%;
      display: flex;
    align-items: center;
    justify-content: center;
      // padding-top: 7px;
      
    }
    a{
      font-size: 13px;
      color: #d2d2d2;
    }
    >div:first-child{
      border-right: 1px solid #f8f8f8;
    }
    i{
      vertical-align: text-bottom;
      margin-right: 7px;
       font-size: 16px;
    }
  }
  

}
</style>

