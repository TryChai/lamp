<template>
    <div class="shop_shop" v-if="shopInfo.sid>0 ||  shopInfo.recommend.length>0 || shopInfo.hot.length>0">
        <div class="shop_shop_head fx" v-if="shopInfo.sid>0">
            <div class="fx">
                <img :src="shopInfo.shop.shop_logo" v-lazy="shopInfo.shop.shop_logo" alt="">
                <div>
                    <p>{{shopInfo.shop.shop_title}}的店铺</p>
                    <p>卖家地区：{{shopInfo.shop.shop_address}}</p>
                </div>
            </div>
            <div class="fx shop_shop_info">
                <van-button round plain hairline type="danger" size='small' :to="'/supplier/supplierdetails?id='+shopInfo.sid">进店逛逛</van-button>
            </div>
            
        </div>
        <div class="shop_shop_tabs" v-if=" shopInfo.recommend.length>0 || shopInfo.hot.length>0">
            <!-- <van-tabs @click="onClick"> -->
            <van-tabs :border='false'  :class="[shopInfo.recommend &&shopInfo.recommend.length>0  && shopInfo.hot&&shopInfo.hot.length>0 ?'aa':'ac_xs']">
                <van-tab title="相似推荐" v-if="shopInfo.recommend && shopInfo.recommend.length>0" >
                    <shopdetailsshopswiper :recommend='shopInfo.recommend' />
                </van-tab>
                <van-tab title="热销排行榜" v-if="shopInfo.hot && shopInfo.hot.length>0">
                    <shopdetailsshopswiper :recommend='shopInfo.hot' />
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
import { Rate } from 'vant';
import shopdetailsshopswiper from './shopdetailsshopswiper'
export default {
    components:{
        [Rate.name]:Rate,
        shopdetailsshopswiper
    },
    props:{
        shopInfo:{
            type:Object,
            default:{
                recommend:[],
                hot:[]
            }
        }
    },
    data(){
        return{
            value:5
        }
    },
}
</script>


<style lang="less" scoped>
.shop_shop{
    padding: 0 16px;
    line-height: 1;
    .shop_shop_head{
        height: 85px;
        >div:first-child{
            img{
                width: 48px;
                height: 48px;
                margin-right: 10px;
                display: block;
                border-radius: 3px;
            }
            div{
                font-size: 8px;
                color: #333333;
                >p:first-child{
                    font-size: 14px;
                    font-weight: bold;
                    padding-bottom: 3px;
                }
                >p:last-child{
                    padding: 2px 4.5px 2px 0;
                    border-radius: 27px;
                    font-size: 13px;
                    color: #9e9a9a;
                    line-height: 1.2;
                    div{
                        display: inline-block;
                        padding: 0;
                    }
                }
            }
        }
        >div.shop_shop_info{
            >button{
                font-size: 12px;
                width: 70px;
                padding: 0;
                height: auto;
                border-width: 1px ;
            }
            >button:first-child{
                // margin-right: 10px;
            }
            
            
        }
    }
    .shop_shop_head_info{
        font-size: 12px;
        color: #808080;
        padding:0 0 4px 0;
    }
    .shop_shop_tabs{
        padding-top: 11px;
        >div>div{
            height: 30px;
            color: #ddd;
        }

    }

}
</style>
