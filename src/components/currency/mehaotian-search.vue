<template>
    <div class="search"
        :style="{ backgroundColor: backgroundColor }">
        <div class="content"
            :style="{ 'border-radius': radius + 'px', border: border }">
            <div class="content-box"
                :class="{ center: mode === 2 }">
                <span class="icon icon-search">&#xe61c;</span>
                <input class="input"
                    :class="{ center: !active && mode === 2 }"
                    :focus="isFocus"
                    :placeholder="placeholder"
                    v-model="inputVal"
                    @focus="focus"
                    @blur="blur" />
                <!-- <div v-if="!active && mode === 2" class="input sub" @click="getFocus">请输入搜索内容</div> -->
                <span v-if="isDelShow"
                    class="icon icon-del"
                    @click="clear">&#xe644;</span>
            </div>
            <div v-show="(active && show && button === 'inside') || (isDelShow && button === 'inside')"
                class="searchBtn"
                @click="search">{{$h('搜索')}}</div>
        </div>
        <div v-if="button === 'outside'"
            class="button"
            :class="{ active: show || active }"
            @click="search">
            <div class="button-item">{{ !show ? searchName : $h('搜索') }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        mode: {
            type: Number,
            default: 1
        },
        button: {
            type: String,
            default: 'outside'
        },
        show: {
            type: Boolean,
            default: true
        },
        radius: {
            type: String,
            default: '60'
        },
        placeholder: {
            type: String,
            default: '请输入搜索内容'
        },
        backgroundColor: {
            type: String,
            default: '#fff'
        },
        border: { type: String, default: '1PX #f5f5f5 solid' }

    },
    data () {
        return {
            active: false,
            inputVal: '',
            searchName: '取消',
            isDelShow: false,
            isFocus: false
        };
    },
    methods: {
        focus () {
            this.active = true;
        },
        blur () {
            this.isFocus = false;
            if (!this.inputVal) {
                this.active = false;
            }
            window.scroll(0, 0);
        },
        clear () {
            this.inputVal = '';
            this.active = false;
            this.$emit('search', '');
        },
        getFocus () {
            this.isFocus = true;
        },
        search () {
            // if (!this.inputVal) return;
            this.$emit('search', this.inputVal);
        }
    },

};
</script>

<style lang="less" scoped>
.search {
    display: flex;
    width: 100%;
    border-bottom: 1px #f5f5f5 solid;
    box-sizing: border-box;
    padding: 7px;
    font-size: 7px;
    background: #fff;
    .content {
        display: flex;
        align-items: center;
        width: 100%;
        height: 30px;
        border: 1px #ccc solid;
        background: #fff;
        overflow: hidden;
        transition: all 0.2s linear;
        border-radius: 15px;

        .content-box {
            width: 100%;
            display: flex;
            align-items: center;
            &.center {
                justify-content: center;
            }
            .icon {
                padding: 0 7px;
                &.icon-del {
                    font-size: 19px;
                }
            }
            .input {
                width: 100%;
                max-width: 100%;
                line-height: 30px;
                height: 30px;
                transition: all 0.2s linear;
                &.center {
                    width: 100px;
                }
                &.sub {
                    // position: absolute;
                    width: auto;
                    color: grey;
                }
            }
        }
        .searchBtn {
            height: 100%;
            flex-shrink: 0;
            padding: 0 15px;
            background: red;
            line-height: 30px;
            color: #fff;
            border-left: 1px #ccc solid;
            transition: all 0.3s;
        }
    }

    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex-shrink: 0;
        width: 0;
        transition: all 0.2s linear;
        white-space: nowrap;
        overflow: hidden;
        &.active {
            padding-left: 7px;
            width: 50px;
        }
    }
}
@font-face {
    font-family: "iconfont";
    src: url("https://at.alicdn.com/t/font_989023_efq0mtli526.ttf")
        format("truetype");
}
.icon {
    font-family: iconfont;
    font-size: 16px;
    font-style: normal;
    color: #999;
}
.icon-search:before {
    content: "" !important;
}
</style>
