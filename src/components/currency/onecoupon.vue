<template>
    <div class="onecoupon">
        <div class="fx onecoupon_head" :class="{lvbuzu:item.limit_lv>rating}" v-if="defaultCoupon">
            <div class="onecoupon_head_1  tc">
                <span :style="item.money.toString().length>4?{fontSize:'16px'}:{}">￥</span>
                <span :style="item.money.toString().length>4?{fontSize:'24px'}:{}">{{$fnc.toFixedZ(item.money,0)}}</span>
            </div>
            <div class="onecoupon_head_2 fx_3" >
                <p>{{item.title}}</p>
                <p>到期：{{$fnc.timeRange(item.lifetime)}}</p>
            </div>
            <div class="onecoupon_head_3 fx_2 tc" v-if="item.limit_lv<=rating">
                <van-button type="danger" class="cou_btn1" v-if="item.is_receive==0" @click="getCoupon(item.id)">立即领取</van-button>
                <van-button type="default"  v-else @click="closePop">已领取</van-button>
            </div>
            <div class="onecoupon_head_3 fx_2 tc" v-else>
                <van-button type="default" >等级不足</van-button>
            </div>
        </div>
        <div class="fx onecoupon_head" :class="{lvbuzu:item.is_cat==0}" v-else>
            <div class="onecoupon_head_1  tc">
                <span :style="item.money.toString().length>4?{fontSize:'16px'}:{}">￥</span>
                <span :style="item.money.toString().length>4?{fontSize:'24px'}:{}">{{$fnc.toFixedZ(item.money,0)}}</span>
            </div>
            <div class="onecoupon_head_2 fx_3" >
                <p>{{item.desc}}</p>
                <p>到期：{{$fnc.getTimeFormat(item.end_time)}}</p>
            </div>
            <div class="onecoupon_head_3 fx_2 tc" >
                <van-button type="danger" class="cou_btn1" v-if="item.is_cat==1" @click="setHb(item)">立即使用</van-button>
                <van-button type="default"  v-else >不可使用</van-button>
            </div>
        </div>

        <div class="onecoupon_miaosu" >{{item.limit_lv_cn}}</div>
         <!-- <div class="onecoupon_miaosu" v-else>{{item.source}}</div> -->
    </div>
</template>

<script>
export default {
    props:{
        item:{
            type:Object,
            default:{}
        },
        defaultCoupon:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            rating:this.$store.state.user.rating
        }
    },
    methods:{
        getCoupon(id){
            this.$api.getShop.getCoupon({id}).then(res=>{
                if(res.code==200){
                    this.$toast.success("领取成功");
                    this.item.is_receive=1;
                }
            })
        },
        closePop(){
            this.$emit('closePop',0)
        },
        setHb(item){
            this.$emit('setHb',item)
        }
    }
}
</script>



<style lang="less" scoped>
.lvbuzu{
    background: #ddd !important;
}
.onecoupon{
    line-height: 1;
    font-size: 14px;
    color: #fff;
    box-shadow:1px 1px 5px #eeeeee;
    
    .onecoupon_head{
        border-radius: 5px 5px 0 0 ;
        height: 100px;
        padding: 6px 0;
        background: linear-gradient(to right  , #feb913, #ff9201);
        justify-content: flex-start;
        .onecoupon_head_1{
            height: 100%;
            width: 112px;
            line-height: 90px;
            border-right: 1px dashed #ffdf9e;
            font-size: 44px;
            >span:first-child{
                font-size: 25px;
                
            }
            >span:last-child{
                padding-right: 12px;
            }
        }
        .onecoupon_head_2{
            padding:0 6px;
            >p:first-child{
                font-size: 14px;
                padding-bottom: 10px;
            }
            >p:last-child{
                font-size: 12px;
                
            }
        }
        .onecoupon_head_3{
            height: 22px;
            >button{
                border-radius: 5px;
                height: 100%;
                width: 72px;
                text-align: center;
                padding: 0;
                line-height: 1;
                font-size: 12px;
                color: #ff9302;
            }
            .cou_btn1{
                color: #fff;
                
            }
        }
    }
    .onecoupon_miaosu{
         border-radius:0 0 5px 5px;
        padding: 10px 16px;
        background: #fafafa;
        color: #a3a3a5;
        font-size: 12px;
        border-top: 1px dashed #eeeeee;
    }
}
</style>
