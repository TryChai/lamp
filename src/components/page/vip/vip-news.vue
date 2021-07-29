<template>
    <div class="lesson_body" v-if="news_form.pageis_show_new == 1 && news_form.pageis_show_new_cate != null && news_form.pageis_show_new_cate != ''">
        <div class="lesson_article">
            <div class="lesson_article_title">
                <p>
                    {{news_form.homeis_show_new_title}}
                    <span></span>
                </p>
                <p @click="$router.push('/news?cate_id='+news_form.pageis_show_new_cate)">
                    更多
                    <van-icon name="arrow"></van-icon>
                </p>
            </div>
            <div class="lesson_article_body" v-if="news_form.newslist!=undefined && news_form.newslist.length>0">
            
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "",
    props: {
        news_form: {
            type: Object,
            default: () => { }
        }
    },
    data () {
        return {};
    },
    components: {
    },
    created () { },
    mounted () { },
    methods: {}
};
</script>
<style lang='less' scoped>
.lesson_body {
    width: 100%;
    background-color: #f8f9fb;
    padding: 10px 0 0;
    .lesson_article {
        width: 100%;
        padding: 0 15px;
        background-color: #ffffff;
        margin-bottom: 10px;
        .lesson_article_title {
            width: 100%;
            height: 50px;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: center;
            background-color: #ffffff;
            margin-top: 10px;
            p:nth-of-type(1) {
                font-size: 18px;
                font-weight: bold;
                color: #15222f;
                span {
                    font-size: 12px;
                    font-weight: normal;
                    color: #babdc2;
                }
            }
            p:nth-of-type(2) {
                font-size: 12px;
                font-weight: 400;
                color: #989baf;
                display: flex;
                justify-content: center;
                align-items: center;
                .van-icon {
                    font-size: 14px;
                    font-weight: normal;
                    padding-left: 2px;
                }
            }
        }
        .lesson_article_body {
            width: 100%;
            display: flex;
            flex-flow: column;
            justify-content: flex-start;
            align-items: flex-start;
            > div {
                width: 100%;
            }
        }
    }
}
</style>
