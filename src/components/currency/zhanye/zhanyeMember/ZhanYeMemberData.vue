<template>
    <div>
        <!-- <router-link to="/zhanye/zhanyeadmin"> -->
            <div class="z-zhan-box-title">
                数据简报
            </div>
            <div class="z-zhan-box-data">
                <div class="fx">
                    <div class="fx_1">
                        <img src="../../../../assets/img/zhanye/z-d1.png" alt="">
                        <div class="z-zhan-box-data-text">
                            <p>2455<span>次</span></p>
                            <p>浏览次数</p>
                        </div>
                    </div>
                    <div class="fx_1">
                        <img src="../../../../assets/img/zhanye/z-d2.png" alt="">
                        <div class="z-zhan-box-data-text">
                            <p>2455<span>次</span></p>
                            <p>联系跟进次数</p>
                        </div>
                    </div>
                </div>
                <div class="fx">
                    <div class="fx_1">
                        <img src="../../../../assets/img/zhanye/z-d3.png" alt="">
                        <div class="z-zhan-box-data-text">
                            <p>{{info.conversion_rate}}</p>
                            <p>推广转化率</p>
                        </div>
                    </div>
                    <div class="fx_1">
                        <img src="../../../../assets/img/zhanye/z-d4.png" alt="">
                        <div class="z-zhan-box-data-text">
                            <p>2455<span>单</span></p>
                            <p>成交单数</p>
                        </div>
                    </div>
                </div>
            </div>
        <!-- </router-link> -->
    </div>
</template>

<script>
export default {
    props:{
        info:{
            type:Object,
            default:()=>{}
        }
    }
}
</script>

<style lang="less" scoped>
.z-zhan-box-data{
    padding: 0 19px 19px;
    >.fx{
        margin-top: 22px;
        img{
            width: 30px;
            height: 26px;
            vertical-align: top;
        }
        .z-zhan-box-data-text{
            display: inline-block;
            height: 38px;
            border-left: 1px solid #eeeeee;
            padding-bottom: 3px;
            color: #5c5c5c;
            padding-left: 10px;
            >p:first-child{
                font-size: 15px;
                color: #000000;
                font-weight: bold;
                margin: 4px 0 6px;
                >span{
                    color: #5c5c5c;
                    font-size: 12px;
                    font-weight: 500;
                }
            }
            >p:last-child{
                font-size: 12px;
            }
        }
    }
    
}
</style>

