<template>
    <div>
        <div class="zhanye_info_part ">
            <div class="zhanye_info_title" style="">
                <p><img src="./../../../../assets/img/zhanye/zhanye_vip_icon.png" alt="">浏览过产品</p>
            </div>
            <div class="zhanye_product">
                <div class="zhanye_product_item" v-for="(item,i) in list" :key="i">
                    <div class="zhanye_product_left">
                        <img :src="item.piclink" v-lazy='item.piclink' alt="">
                    </div>
                    <div class="zhanye_product_right">
                        <p>{{item.title}}</p>
                        <p>
                            <span>浏览次数：{{item.hit_num}}</span>
                            <span>
                                <van-count-down style="display:inline;color:#acacac;margin-right:15px" :time="parseInt(item.view_time*1000) " format='mm"ss'  :auto-start="false" />
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { CountDown } from 'vant';
    export default {
        name: "ZhanYeinfo_product",
        components:{
            [CountDown.name]:CountDown
        },
        props:{
            list:{
                type:Array,
                default:()=>{return[]}
            }
        }
    }
</script>

<style scoped>
    @import "./../../../../assets/css/zhanye.css";
</style>