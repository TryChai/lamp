<template>
    <div class="coupon_item fx">
        <div>
            <p >￥ 10</p>
            <p>满99元使用</p>
            <span class="coupon_item_s1"></span>
            <span class="coupon_item_s2"></span>
        </div>
        <div class="fx_3">
            <div class="fx">
                <div class="p_co">
                    <p>严选</p>
                    <p>201906.1至2018.254</p>
                </div>
                <div>
                    <van-button plain round type="danger">立即使用</van-button>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="less" scoped>
.coupon_item{
    border: 1px solid #f5dfdf;
    height: 78px;
    border-radius: 5px;
    background: #ffebec;
    justify-content: flex-start;
    // overflow: hidden;
    >div:first-child{
        text-align: center;
        width: 91px;
        border-right: 1px dashed #f3cfcf;
        height: 100%;
        position: relative;
        z-index: 1;
        >p:first-child{
            font-size: 20px;
            font-weight: bold;
            margin: 15px 0 9px;
        }
        >p:last-child{
            font-size: 13px;
            color: #333333;
        }
        >span{
            z-index: 2;
            position: absolute;
            width: 16px;
            height: 16px;
            right: -8px;
            background: #f3f3f3;
            border-radius: 50%;
            //  border-style:solid;
            // border-width: 1px;
        }
        >span.coupon_item_s1{
            top: -8px;
            // border-color:  transparent red red transparent;
        }
        >span.coupon_item_s2{
            bottom: -8px;
        }
    }
    >div:last-child{
        padding-right: 10px;
        .p_co{
            padding-left: 17px;
            >p:first-child{
                font-size: 13px;
                margin-bottom: 12px;
            }
        }
        button{
            height: 29px;
            line-height: 29px;
        }
    }
}
</style>
