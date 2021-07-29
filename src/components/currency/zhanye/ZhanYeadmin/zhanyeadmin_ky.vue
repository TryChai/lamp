<template>
    <div>

        <div class="admin_part">
            <div class="admin_ky_box" v-if="sn=='product'" >
                <div class="fx  admin_ky_box_item_an" v-for="(item,i) in list" :key="i" :class="[i>0?'van-hairline--top':'']">
                    <router-link :to="'/zhanye/zhanyelist?id='+item.id" class="fx box-analyis">
                        <div class="">
                                <img :src="item.piclink" v-lazy='item.piclink' alt="">
                        </div>
                        <div class="">
                            <p class="van-ellipsis">{{item.title || ' --- '}}</p>
                            <div > 
                                <div>
                                    <span>浏览时长：<van-count-down style="display:inline;color:#acacac;margin-right:15px" :time="parseInt(item.view_time*1000) " format='mm"ss'  :auto-start="false" /></span>
                                    <span>浏览次数：{{ item.hit_all}}</span>
                                </div>
                                <van-icon name="arrow"
                                    color="#9f9f9f"
                                    size="18px">
                                </van-icon>
                                
                            </div>
                            <p class="van-ellipsis"></p>
                        </div>
                    </router-link>
                </div>
            </div>
            <div class="admin_ky_box" v-else>
                <div class="fx  admin_ky_box_item_an" v-for="(item,i) in list" :key="i" :class="[i>0?'van-hairline--top':'']">
                    <router-link :to="'/zhanye/zhanyeinfo?id='+item.uid+'&time='+item.view_time+'&hit='+item.hit" class="fx box-analyis">
                        <div class="">
                                <img :src="item.avatar" v-lazy='item.avatar' alt="">
                        </div>
                        <div class="">
                            <div>
                                <p class="van-ellipsis fx_1">{{item.nickname || ' --- '}}</p>
                                <p>最近浏览时间：{{$fnc.mstime(item.last_time)}}</p>
                            </div>
                            
                            <div > 
                                <div>
                                    <span>浏览时长：<van-count-down style="display:inline;color:#acacac;margin-right:15px" :time="parseInt(item.view_time*1000) " format='mm"ss'  :auto-start="false" /></span>
                                    <span>浏览次数：{{ item.hit}}</span>
                                </div>
                                <van-icon name="arrow"
                                    color="#dedede"
                                    size="18px">
                                </van-icon>
                                
                            </div>
                            <p class="van-ellipsis">浏览资源：{{item.pro_title || '- - - '}}</p>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { CountDown } from 'vant';
export default {
   name: "zhanyeadmin_ky",
   data () {
      return {
      };
   },
   props:{
       list:{
           type:Array,
           default:()=>{return[]}
       },
       sn:{
           type:String,
           default:"last_time"
       }
   },
   components:{
       [CountDown.name]:CountDown
   },
   methods:{

   },
}
</script>
<style lang="less" scoped>
@import "../../../../assets/css/zhanye.css";
.z-zhan-box-title{
   margin-bottom: 10px;
}
.admin_ky_box_item_an{
    padding: 24px 0;
}
.box-analyis{
    line-height: 1;
    font-size: 14px;
        width: 100%;

    >div:first-child{
        flex: none;
        width: 60px;
        height: 60px;
        margin-right: 10px;
        border-radius: 5px;
        overflow: hidden;
        
        img{
            max-width: 100%;
        }
    }
    >div:last-child{
        flex: 3;
        min-height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 12px;
        color: #acacac;


        >p:first-child{
            color: #333;
            font-weight: 500;
            font-size: 14px;
            width: 250px;
            line-height: 1.2;   
        }
        >div{
            display: flex;
            justify-content: space-between;
            >div{
                flex: 2;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-right: 20px;
            }

        }
        >p:last-child{
            width: 250px;
            line-height: 1.2;
        }
    }
}
</style>