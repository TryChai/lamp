<template>
  <div v-if="group.number>0">
    <van-cell :title="group.number+'人正在拼单，可直接参与'" title-class='user-assble-title' value="查看更多" @click="toAssemb(true)" is-link class="user-head" />
    <van-swipe  vertical class="group-swiper" :autoplay="3000" :touchable='false' :show-indicators='false'>
        <van-swipe-item v-for="(it,i ) in group.data1" :key="i">
            <van-cell  title-class='user-assble-user'  :center='true' size='large' v-for="(item,i ) in it" :key="i">
                <template slot="title">
                    <van-image
                        round
                        width="37px"
                        height="37px"
                        :src="item.avatar"
                    />
                    <span class="van-ellipsis">{{item.nickname}}</span>
                </template>
                <template slot="right-icon">
                    <div class="fx_2 tr fx user-assble-rightButt">
                        <div>
                            <p>还差<span class="red-user">{{item.difference}}人</span>拼成</p>
                            剩余<van-count-down :time="parseInt(item.end_time_second)*1000" style="display:inline" />
                        </div>
                        <div>
                            <van-button type="danger" @click="toAssemb(item)">去拼单</van-button>
                        </div>
                    </div>
                </template>
            </van-cell>
        </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { Image,CountDown  } from 'vant';
export default {
    components:{
        [Image.name]:Image,
        [CountDown.name]:CountDown
    },
    props:{
        group:{
            type:Object,
            default:()=>{}
        }
    },
    data(){
        return{
            time: 30 * 60 * 60 * 1000,
            data:[
                [
                    {
                    "id": "1",
                    "uid": "138",
                    "pid": "755",
                    "head_oid": "0",
                    "oid": "0",
                    "status": "0", 
                    "group_people": "0",
                    "group_time": "0",
                    "group_discount": "0.00000000",
                    "group_face": "0",
                    "created_time": "0",
                    "update_time": "0",
                    "end_time": "1565861428",
                    "nickname": "ggv84c",
                    "avatar": "",
                    "end_time_second": 9349,
                    "difference":1
                    },
                    {
                        "id": "1",
                        "uid": "138",
                        "pid": "755",
                        "head_oid": "0",
                        "oid": "0",
                        "status": "0", 
                        "group_people": "0",
                        "group_time": "0",
                        "group_discount": "0.00000000",
                        "group_face": "0",
                        "created_time": "0",
                        "update_time": "0",
                        "end_time": "1565861428",
                        "nickname": "ggv84c",
                        "avatar": "",
                        "end_time_second": 9349,
                        "difference":1
                    },
                ],
                [
                    {
                    "id": "1",
                    "uid": "138",
                    "pid": "755",
                    "head_oid": "0",
                    "oid": "0",
                    "status": "0", 
                    "group_people": "0",
                    "group_time": "0",
                    "group_discount": "0.00000000",
                    "group_face": "0",
                    "created_time": "0",
                    "update_time": "0",
                    "end_time": "1565861428",
                    "nickname": "ggv84c",
                    "avatar": "",
                    "end_time_second": 9349,
                    "difference":1
                    },
                    {
                        "id": "1",
                        "uid": "138",
                        "pid": "755",
                        "head_oid": "0",
                        "oid": "0",
                        "status": "0", 
                        "group_people": "0",
                        "group_time": "0",
                        "group_discount": "0.00000000",
                        "group_face": "0",
                        "created_time": "0",
                        "update_time": "0",
                        "end_time": "1565861428",
                        "nickname": "ggv84c",
                        "avatar": "",
                        "end_time_second": 9349,
                        "difference":1
                    },
                ],
            ]
        }
    },
    methods:{
        toAssemb(row){
            if(row){
                this.$emit('toAssemb',row)
            }else{
                  this.$emit('toAssemb',true)
            }

        }
    }
}
</script>

<style lang='less' scoped>
.group-swiper{
    height: 120px;
}
.user-head::after{
    left: 0;
}
.user-assble-title{
    flex: 3;
    font-size: 16px;
    color: #0e0e0e;
    font-weight: 400;
}
.user-assble-user{
    display: flex;
    align-items: center;
    span{
        margin-left: 10px;
        font-size: 15px;
        color: #070707;
        width: 120px;
    }
}
.user-assble-rightButt{
    justify-content: flex-end;
    line-height: 1.2;
    color: #5d5e60;
    >div{
        button{
            height: 34px;
            line-height: 34px;
        }
    }
    >div:last-child{
        margin-left: 7px;
    }
    .red-user{
        color: #da0f04;
    }
}
</style>