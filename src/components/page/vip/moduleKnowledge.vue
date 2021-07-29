<template>
    <div class="module_part_body" :style="{backgroundColor:background}">
        <moduleTitle :info="info" background="#fff">

        </moduleTitle>

        <div class="active_box" style="background-color:#fff;    padding: 0 13px 1px 13px ">
            <div class="" v-for="(item,k) in info.banner" :key="k">
                
            </div>
        </div>
    </div>
</template>

<script>
import moduleTitle from '@/components/page/vip/moduleTitle'

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
        moduleTitle,

    },
    created () { },
    mounted () { },
    methods: {

        href_inspect (val) {
            if (val == "/plugin/turntable") {
                this.$store.commit("set_turnshow", true);
                return;
            }
            this.$fnc.goLink(val);

        }
    }
};
</script>
<style lang='less' scoped>
.righttitlte {
    //   width: 50% !important;
    font-size: 16px;
    color: #313131;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
</style>
