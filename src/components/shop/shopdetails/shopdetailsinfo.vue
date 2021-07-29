<template>
    <div class="shop_details_info">
        <div class="shop_details_info_head fx">
            <div class="line_details"></div>
            <div>商品信息</div>
            <div class="line_details"></div>
        </div>
        <div class="shop_details_in"
            v-lazy-container="{ selector: 'img' }"
            v-html="letslazyload(content)">
        </div>
        
    </div>
</template>


<script>
export default {
    props: {
        content: {
            type: String,
            default: ""
        }
    },
    data () {
        return {}
    },
    methods: {
        letslazyload (contentp) {
            let regexp1 = new RegExp(/(\<img )([^>]*)(src=")([^"]*")([^>]*)(\>)/, 'g');
            contentp = contentp.replace(regexp1, function (match, p1, p2, p3, p4, p5, p6) {
                return p1 + p2 + 'data-src="' + p4 + p5 + p6;
            });
            return contentp;
        }
    }
}
</script>


<style lang="less" scoped>
@import "../../../assets/css/quill.css";
.shop_details_info {
    overflow: hidden;
    padding: 0 6px 15px 6px;
    .shop_details_info_head {
        height: 54px;
        font-size: 14px;
        color: #918f94;
        .line_details {
            height: 1px;
            background: #d7d7d7;
            width: 132px;
        }
    }
}
.shop_details_in {
    font-size: 14px;
}
</style>
