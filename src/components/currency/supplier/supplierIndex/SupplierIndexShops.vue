<template>
    <div class="s-shops-list">
        <supplier-shop-item v-for="(item,i) in pro"
            :key="i"
            :item='item' />
    </div>

</template>


<script>
import SupplierShopItem from '@/components/currency/supplier/supplierShop/SupplierShopItem'
export default {
    components: {
        SupplierShopItem
    },
    props: {
        pro: {
            type: Array,
            default: () => { return [] }
        }
    }
}
</script>


<style lang="less" scoped>
.s-shops-list {
    background: #f4f4f4;
    padding: 16px 10px;
    > div {
        margin-bottom: 16px;
        > img {
            width: 80%;
            margin: 0 auto;
        }
    }
}
</style>
