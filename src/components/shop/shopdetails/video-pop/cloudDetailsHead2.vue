<template>
    <div >
        <div class="fx colud-details-head">
            <div class="fx" style="width:100%">
                <van-icon name="cross"
                    @click="closePop"
                    color="#fff"
                    size="20px" />
                <van-icon name="qr"
                @click="showEwm"
                    color="#fff"
                    size="20px" />

            </div>
        </div>
    </div>
</template>


<script>
import { Tag, Field } from "vant";

import wx from 'weixin-js-sdk';
import { setTimeout } from 'timers';
export default {
    props: {
        info: {
            type: Object,
            default: () => { }
        },
    },
    components: {
        [Tag.name]: Tag,
        [Field.name]: Field,

    },
    data () {
        return {
            show: false,


        };
    },
    methods: {
        closePop () {
            this.$bus.$emit('hidPop')
        },
        showEwm(){
            this.$bus.$emit('showEwm');
            this.$emit('showPop', true)
        }   
    },
    created () {
        
    },

};
</script>


<style lang="less" scoped>

.colud-details-head {
    // background:rgba(98, 99, 102, 0.9);
    height: 66px;
    padding: 0 10px;
    position: relative;
    background: rgba(19, 19, 19, 0.5);
    color: #fff;
    z-index: 3;
    > div:first-child {
        > div {
            margin-left: 12px;
            > img {
                width: 36px;
                height: 36px;
                border-radius: 50%;
            }
            > div {
                margin-left: 13px;
                > p:first-child {
                    font-size: 13px;
                }
                > p:first-child + p {
                    font-size: 12px;
                    margin-top: 5px;
                }
            }
        }
    }
    > div:last-child {
        > span {
            background: #3bb4f9;
            font-size: 13px;
            padding: 3px 14px;
            border-radius: 27px;
        }
    }
}

</style>

