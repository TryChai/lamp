<template>
    <div>
        <div class="details_liubai "></div>
        <div class="presale_progress"
            v-if="shopInfo.ladder_ar.length && shopInfo.ladder_ar.length > 0 ">
            <div class="presale_progress_title">
                <span>目标数量</span>
                <span>目标价格</span>
                <span>完成度</span>
            </div>
            <div class="presale_progress_line"
                v-for="(item,k) in shopInfo.ladder_ar"
                :key="k">
                <p><span>{{item.ladder_num}}</span>个</p>
                <p><span>{{item.ladder_money}}</span>元</p>
                <p>{{item.finish_per || 0}} %</p>
            </div>

        </div>

    </div>
</template>
<script>
export default {
    name: "presale_progress",
    data () {
        return {
        };
    },
    props: {
        shopInfo: {
            type: Object,
            default: {}
        },
    },
    components: {
    },
    methods: {

    },
}
</script>
<style lang="less" scoped>
.details_liubai {
    background: #f3f3f3;
    height: 10px;
}
.presale_progress {
    width: 100%;
    background-color: #ffffff;
    > .presale_progress_title,
    .presale_progress_line {
        width: 100%;
        height: 32px;
        background-color: #ffffff;
        font-size: 14px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eeeeee;
        padding: 0 13px;
    }
    > .presale_progress_title span {
        color: #1a1a1a;
        font-weight: 600;
    }
    > .presale_progress_line {
        p {
            width: 33%;
            font-size: 14px;
            color: #333333;
            span {
                color: #b2b2b2;
                padding: 0 2px;
            }
        }
        p:nth-of-type(1) {
            text-align: left;
        }
        p:nth-of-type(2) {
            text-align: center;
        }
        p:nth-of-type(3) {
            text-align: right;
            color: #ff3c62;
            padding-right: 5px;
        }
    }
}
</style>