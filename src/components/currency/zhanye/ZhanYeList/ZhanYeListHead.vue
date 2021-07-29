<template>
    <div >
        
        <div class="z-y-l-head">
            <div class="fx">
                <div>
                    <img src="../../../../assets/img/ava.jpg" v-lazy='pro_ar.piclink' alt="">
                </div>
                <div>
                    <p class="van-ellipsis">{{pro_ar.title}}</p>
                    <p>
                        <van-icon name="clock-o" />
                        发布时间：{{$fnc.getTimeFormat(pro_ar.created_time)}}
                    </p>
                    <p>
                        <van-icon name="eye-o" />
                        阅读人次：{{pro_ar.hit}}次
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        pro_ar:{
            type:Object,
            default:()=>{}
        }
    },
    data(){
        return{

        }
    }
}
</script>


<style lang="less" scoped>
.z-y-l-head{
    height: 170px;
    background: url('../../../../assets/img/zhanye/z-y-l1.png') no-repeat;
    background-size: 100% 100%;
    padding: 22px 11px 0;
    >div{
        justify-content: flex-start;
        align-items: flex-start;
        >div:first-child{
            width: 66px;
            height: 66px;
            border-radius: 5px;
            overflow: hidden;
            >img{
                width: 100%;
                height: 100%;
            }
        }
        >div:last-child{
            margin-left: 14px;
            color: #fff;
                width: 75%;
            >p:first-child{
                margin: 2px 0 11px;
                width: 100%;
                line-height: 1.4;
            }
            >p:first-child~p{
                font-size: 12px;
                margin-bottom: 8px;
                
                i{
                    font-size: 12px;
                    vertical-align: middle;
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>
