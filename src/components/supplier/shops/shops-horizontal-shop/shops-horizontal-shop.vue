<template>
    <div class='shops-horizontal-shop'>
        <div class="fx shops-horizontal-shop-p-box"
            v-if="product.title || product.title_en">
            <p v-if="product.title"
                class="shops-horizontal-shop-p">{{product.title}}</p>
            <p v-if="product.title_en"
                class="shops-horizontal-shop-p2">{{product.title_en}}</p>
        </div>
        <div class="shops-horizontal-shop-box"
            v-if="product.pro.length>0">
            <div class="shops-horizontal-shop-box-in">
                <supplier-shop v-for="(item,i) in product.pro"
                    :key="i"
                    :item='item' />
                    
            </div>

        </div>
    </div>
</template>

<script>
import supplierShop from "@/components/currency/shop/supplier-shop/supplier-shop";
export default {
    name: 'shops-horizontal-shop',
    props: {
        product: {
            type: Object,
            default: () => { }
        }
    },
    data () {
        return {}
    },
    components: {
        supplierShop
    },
    created () { },
    mounted () { },
    methods: {}
}
</script>
<style lang='less' scoped>
.shops-horizontal-shop-p-box {
    justify-content: flex-start;
    margin-bottom: 16px;
}
.shops-horizontal-shop {
    margin: 10px;
    padding: 16px 0px 20px 10px;
    line-height: 1.1;
    border-radius: 10px;

    background: #fff;

    .shops-horizontal-shop-p {
        font-size: 18px;
        color: #2c2c2c;
        font-weight: bold;
    }
    .shops-horizontal-shop-p2 {
        font-size: 15px;
        color: #d4d4d4;
        font-weight: 400;
        margin-left: 10px;
    }
    .shops-horizontal-shop-box {
        width: 100%;
        // height: 180px;
        overflow-x: auto;
        overflow-y: hidden;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        .shops-horizontal-shop-box-in {
            width: auto;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            flex-wrap: nowrap;
        }
    }
}
</style>
