<template>
    <div class="shop_buy">
        <div class="shop_buy_head fx">
            <img src="../../../assets/img/shop/buy.png" alt="">
        </div>
        <div class="shop_buy_con">
            <div class="fx shop_index_d1">
                <div>限时抢购：<span>17:17:17</span></div>
                <div>查看更多 <van-icon name="arrow" /> </div>
            </div>
            <ul class="shop_index_d2 fx">
                <li v-for="(item,i) in top_day" :key="i">
                    <router-link :to="item.links || ''">
                        <img  :src="$fnc.getImgUrl(item.piclink)"   />
                         <p class="p1">惊喜价 
                            <span>￥{{item.price}}</span> </p>
                         <p class="p2">日常价 
                             <span>￥{{item.price}}</span>
                         </p>
                    </router-link>
                </li>
            </ul>
            <div class="d1"></div>
        </div>
    </div>
</template>

<script>
import { Image } from "vant";
export default {
    components:{
        [Image.name] :Image
    },
    props:{
        top_day:{
            type:Array,
            default:()=>{return []} 
        }
    }
}
</script>


<style lang="less" scoped>
.shop_index_d2 ::-webkit-scrollbar {

display: none

}
.shop_buy{
    .shop_buy_head{
        height: 72px;
        justify-content: center;
        img{
            width: 100%;
        }
    }
    .shop_buy_con{
        background: #f1f1f1;
        padding: 0 11px 0;

        position: relative;
        .shop_index_d1{
            color: #979695;
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            >div{
                >span{
                     color: #000000;
                }
                i{
                    vertical-align: middle;
                }
            }
        }
        .shop_index_d2{
            flex-wrap: wrap;
            display: -webkit-box;
            overflow-x: scroll;
            justify-content: flex-start;
            -webkit-overflow-scrolling:touch;
            position: relative;
            z-index: 1;
            padding-bottom: 26px;
            >li{
               width: 110px;
               a{
                   display: block;
               }
               img{
                   width: 100px;
                   height: 100px;
               }
               p{
                   line-height: 1;
               }
               .p1{
                   font-size: 12px;
                   padding: 6px 0;
                   span{
                       font-weight: bold;
                   }
               }
               .p2{
                   font-size: 11px;
                   color: #a2a2a2;
                   span{
                       text-decoration: line-through;
                   }
               }
            }
        }
        .d1{
            position: absolute;
            bottom: 0;
            height: 8px;
            width: 95%;
            background: #f1f1f1;
            z-index: 4;
        }
    }
}
</style>
