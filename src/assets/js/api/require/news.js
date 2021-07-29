import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getnews={
    get_sort_news(params) {                     //新闻类别
        return axios.post(
            `/mobile/news/news_cate`,
            qs.stringify(params)
        );
    },
    get_news_list(params) {               //新闻列表        cate_id - 新闻分类ID
        return axios.post(
            `/mobile/news/news_lists`,
            qs.stringify(params)
        );
    },
    get_news_detail(params) {             //新闻详情       id - 新闻ID
        return axios.post(
            `/mobile/news/news_info`,
            qs.stringify(params)
        );
    },
    get_recommend(params){
        return axios.post(
            `/mobile/news/news_tj`,
            qs.stringify(params)
        );
    },
    news_collect(params){
        return axios.post(
            `/mobile/collect/news_collect`,
            qs.stringify(params)
        );
    },
    get_collect_news(params){
        return axios.post(
            "/mobile/collect/news_collect_lists",
            qs.stringify(params)
        )
    },
    get_banner_lists(params){
        return axios.post(
            "/mobile/banner/lists",
            qs.stringify(params)
        )
    },
    news_like(params){
        return axios.post(
            "/mobile/news/news_like",
            qs.stringify(params)
        )
    },
    news_comment_saveadd(params){
        return axios.post(
            "/mobile/news_comment/saveadd",
            qs.stringify(params)
        )
    },
    news_comment_lists(params){
        return axios.post(
            "/mobile/news/news_comment",
            qs.stringify(params)
        )
    },
    comment_like(params){
        return axios.post(
            "/mobile/news/comment_like",
            qs.stringify(params)
        )
    },
    xcx_qr_news(params){
        return axios.post(
            "/mobile/qr/news",
            qs.stringify(params)
        )
    },
}

export default getnews