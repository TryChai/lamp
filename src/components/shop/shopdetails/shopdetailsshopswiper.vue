<template>
    <div>
        <van-swipe :autoplay="0"
            indicator-color="#9f8258"
            :loop='false'
            class="swiper_shop_item">
            <van-swipe-item class="swiper_shop_item fx">
                <shopitemline :item='item'
                    v-for="(item,i) in recommend"
                    :key="i"
                    v-show="i<3" />
            </van-swipe-item>
            <van-swipe-item class="swiper_shop_item fx"
                v-if="recommend && recommend.length>3">
                <shopitemline :item='item'
                    v-for="(item,i) in recommend"
                    :key="i"
                    v-show="i>=3 && i<6" />
            </van-swipe-item>
            <van-swipe-item class="swiper_shop_item fx"
                v-if="recommend && recommend.length>7">
                <shopitemline :item='item'
                    v-for="(item,i) in recommend"
                    :key="i"
                    v-show="i>=6 && i<9" />
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
import shopitemline from "@/components/currency/shop/shopitemline.vue"
export default {
    components: {
        shopitemline,
    },
    data () {
        return {

        }
    },
    props: {
        recommend: {
            type: Array,
            default: () => { [] }
        }
    }

}
</script>

<style lang="less" scoped>
.swiper_shop_item {
    // height: 232px;
    // padding-bottom: 15px;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 8px 0;
}
</style>
