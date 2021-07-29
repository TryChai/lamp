<template>
    <div class="shop_item_line">
        <router-link :to="'/shop/shopdetails?tid='+appusers.uid+'&id='+item.id">
            <div class="shop_item_line_con  ">
                <!-- <img src="../../../assets/img/shop/v1.png" class="vip_shops" alt=""> -->
                <img v-lazy="item.piclink"
                    class="shop_item_line_img"
                    alt="">
            </div>
            <div class="shop_item_line_title">
                <div class="">
                    {{item.title.length>12? item.title.slice(0,12)+'...' : item.title}}
                </div>
                <div class="price_regular">
                    <small>￥</small>
                    <b>{{$fnc.get_int_dec(item.price,'int')}}</b>
                    <i>{{$fnc.get_int_dec(item.price,'dec')}}</i>
                </div>
                <!-- <p>￥{{item.price}}</p> -->
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    data () {
        return {}
    },
    props: {
        item: {
            type: Object,
            default: () => { }
        }
    }
}
</script>


<style lang="less" scoped>
.shop_item_line {
    line-height: 1;
    width: 33%;

    .shop_item_line_con {
        background: #f8f8f8;
        position: relative;
        width: 110px;
        // height: 120px;
        justify-content: center;
        .vip_shops {
            position: absolute;
            width: 30px;
            height: 37px;
            left: 6px;
            top: -6px;
        }
        .shop_item_line_img {
            width: 110px;
            height: 110px;
        }
    }
    .shop_item_line_title {
        font-size: 14px;
        > div:first-child {
            line-height: 1.2;
            margin: 4px 15px 6px 0;
            color: #1a1a1a;
            // width: 110px;
            overflow: hidden;
        }
        > p:last-child {
            font-size: 14px;
            color: #a51111;
            font-family: "PingFangSC-Regular";
        }
    }
}
.price_regular > small {
    font-size: 12px;
    font-weight: bold;
}
.price_regular > b {
    font-size: 14px;
}
.price_regular > i {
    font-size: 10px;
    font-weight: normal;
    font-style: normal;
}
</style>
