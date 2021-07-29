<template>
    <div class='lifting-item '
        @click="toLifiting">
        <div class="fx">
            <div class="lifting-yuan">
                <div :style="{background:(active?'#01c700':'transparent')}"></div>
            </div>
            <div class="lifting-box"
                v-if="item">
                <div class="fx lifting-box1">
                    <p class="fx_3">{{item.title || ''}}</p>
                    <!-- <p class="fx_1 tc">店铺距您</p> -->
                </div>
                <div class="fx lifting-box2">
                    <p class="fx_3">地址：{{item.province+item.city+item.area+item.add}}</p>
                    <!-- <p class="fx_1 tc">364.56</p> -->
                </div>
                <div class="fx lifting-box3">
                    <p class="fx_3">联系电话：{{item.tel}}</p>
                    <!-- <p class="fx_1 tc">公里</p> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'lifting-item',
    props: {
        item: {
            type: Object,
            default: () => { }
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {}
    },
    components: {},
    created () { },
    mounted () { },
    methods: {
        toLifiting () {
            this.$emit('toLifiting', this.item)
        }
    }
}
</script>
<style lang='less' scoped>
.lifting-item {
    font-size: 14px;
    line-height: 1.2;

    background: #fff;
    color: #333333;

    font-weight: 400;
    > div {
        padding: 20px 0;
        margin: 0 16px;
        justify-content: flex-start;
        align-items: flex-start;
        .lifting-yuan {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            padding: 3px;
            margin-top: 22px;
            border: 1px solid #01c700;
            > div {
                border-radius: 50%;
                height: 100%;
            }
        }
        .lifting-box {
            flex: 3;
            margin-left: 18px;
            .lifting-box1 {
                font-size: 15px;
                color: #1a1a1a;
                font-weight: bold;
                margin-bottom: 6px;
                > p.fx_1 {
                    font-size: 12px;
                    color: #8c8c8c;
                    font-weight: normal;
                }
            }
            .lifting-box2 {
                > p.fx_1 {
                    font-weight: bold;
                    font-size: 17px;
                }
            }
            .lifting-box3 {
                margin-top: 10px;
                > p.fx_1 {
                    color: #8c8c8c;
                }
            }
        }
    }
}
</style>
