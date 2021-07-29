<template>
    <div class="bgwrite item_com_ocn">
        <div class="fx item_comom">
            <img :src="$fnc.getImgUrl(item.avatar,'sex') || require('@/assets/img/member/sex1.png')"
                :imgurl="$fnc.getImgUrl(item.avatar,'sex')"
                alt>
            <div class="fx_4">
                <div class="fx div1">
                    <p>
                        {{item.nickname?item.nickname[0] : ''}}
                        <small>**</small>
                    </p>
                    <p>{{item.rating_cn}} </p>
                </div>
                <p class="pp1"><!-- {{$fnc.getTimeFormat(item.created_time)|| '2018-02-02'}} --></p>
            </div>
        </div>

        <p class="pp2">{{item.content}}</p>
        <div class="fx div2"
            v-if="item.piclink.length>0">
            <img :src="$fnc.getImgUrl(it.piclink)"
                :imgurl="$fnc.getImgUrl(it.piclink)"
                v-for="(it,i) in item.piclink"
                :key="i"
                alt
                @click="imagePreview(item.piclink,i)">
        </div>
        <div style="height: 30px;display: flex;justify-content: flex-start;align-items: center;">
            <van-rate :value="Number(item.star)"
                icon="like"
                :size="16"
                readonly
                void-icon="like-o" />
        </div>
        <div class="shopreply">
            <div class="shopreply_box"
                v-if="item.reply && item.reply != ''">
                <p>
                    <van-icon name="comment-circle-o"
                        size="14px" /> 掌柜回复：
                </p>
                <p>
                    {{item.reply}}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { ImagePreview, Rate } from "vant";
export default {
    props: {
        item: {
            type: Object,
            default: {}
        }
    },
    components: {
        [Rate.name]: Rate
    },
    methods: {
        imagePreview (src, index) {
            var arr = [];
            for (var i in src) {
                arr.push(this.$fnc.getImgUrl(src[i].piclink));
            }
            ImagePreview({ images: arr, startPosition: Number(index) });
        }
    }
};
</script>



<style lang="less" scoped>
.item_com_ocn {
    margin: 16px;
    border-radius: 10px;
}
.item_comom {
    line-height: 1;
    justify-content: flex-start;
    background: #fff;

    > img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
    }
    > div {
        padding-left: 10px;
        line-height: 28px;
        > .div1 {
            font-size: 14px;
            justify-content: flex-start;
            > p:first-child {
                color: #333333;
                font-weight: 500;
            }
            > p:last-child {
                color: #fff;
                font-size: 12px;
                background: #04b7ef;
                border-radius: 5px;
                padding: 0 4px;
                line-height: 1.4;
                margin-left: 6px;
            }
        }
    }
}
.pp1 {
    font-size: 12px;
    line-height: 1;
    color: #999999;
    margin-bottom: 7px;
    height: 10px;
}
.pp2 {
    line-height: 1.2;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
}
div.div2 {
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    > img {
        width: 100px;
        height: auto;
        // max-height: 100px;
        margin: 10px 5px 0px 0;
        border-radius: 5px;
        border-radius: 1px solid #f9f9f9;

        border: 1px solid #e0e0e0;
    }
}
.shopreply {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .shopreply_box {
        width: 100%;
        color: #696969;
        background-color: #f8f8f8;
        border-radius: 5px;
        padding: 10px;
        p {
            width: 100%;
            font-size: 14px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .van-icon {
                padding-right: 5px;
            }
        }
        p:nth-of-type(2) {
            font-size: 12px;
        }
    }
}
</style>
