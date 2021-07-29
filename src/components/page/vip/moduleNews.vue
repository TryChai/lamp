<template>
    <div class="module_part_body" :style="{backgroundColor:background}">
        <moduleTitle :info="info" background="#fff">

        </moduleTitle>
        <div class="active_box" style="    background-color: #ffffff;padding: 0 13px;">
            <div class="active_box_item" v-for="(item,k) in newslist" :key="k">
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
            newslist: [],
            bannerHeight: "",
        };
    },
    components: {
        moduleTitle,

    },
    created () {
        this.getNew(this.info.text);
    },
    mounted () { },
    methods: {
        getNew (id) {
            this.$api.getnews
                .get_news_list({
                    cate_id: id
                })
                .then(res => {
                    if (res.code == 200) {
                        this.newslist = res.result.data || [];
                    }
                });
        },
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
