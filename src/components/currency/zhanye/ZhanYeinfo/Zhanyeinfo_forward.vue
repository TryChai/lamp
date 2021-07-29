<template>
    <div>
        <div class="zhanye_info_part">
            <div class="zhanye_info_title">
                <p><img src="./../../../../assets/img/zhanye/zhanye_vip_icon.png" alt="">转发者</p>
            </div>
            <div class="zhanye_forward">
                <div class="zhanye_forward_item" v-for="(item,i) in userList" :key="i">
                    <div class="zhanye_forward_item_left ">
                        <img :src="item.avatar" v-lazy='item.avatar' alt="">
                    </div>
                    <div class="zhanye_forward_item_right">
                        <p>{{item.nickname}}</p>
                        <p>最近登录时间：{{$fnc.getTimeFormat(item.last_time)}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Zhanyeinfo_forward",
        props:{
            userList:{
                type:Array,
                default:()=>{return[]}
            }
        }
    }
</script>

<style scoped>
    @import "./../../../../assets/css/zhanye.css";
</style>