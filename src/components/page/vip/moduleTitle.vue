<template>

    <div class="phone_title" v-if="info.title || info.title_en" :style="{backgroundColor:background}">
        <p>
            {{info.title}}
            <span>{{info.title_en}}</span>
        </p>
        <slot name="righttitle"></slot>
    </div>
</template>

<script>
export default {
    name: "",
    props: {
        info: {
            type: Object,
            default: () => {
                return {
                    banner: [],
                };
            }
        },
        background: {
            type: String,
            default: "transparent"
        }
    },
    data () {
        return {
            bannerHeight: "",
        };
    },
    components: {


    },
    created () { },
    mounted () { },
    methods: {


    }
};
</script>
<style lang='less' scoped>
.phone_title {
    width: 100%;
    padding: 0 14px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-banners: center;

    // background-color: red;
}
.phone_title_not {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-banners: center;
}
.phone_title_exit {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-banners: center;
    height: 50px;
}
.phone_title > p {
    font-size: 18px;
    color: #2f2f2f;
    font-weight: bold;
    padding: 5px 0;
    // padding: 0 0 5px 0;
    margin-right: auto;
}
.phone_title span {
    font-size: 12px;
    color: #d4d4d4;
    font-weight: 400;
}
</style>
