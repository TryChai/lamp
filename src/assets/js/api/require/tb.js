import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const gettb={
    get_shop_sort(params){
        return axios.post(
            `/mobile/plugin_tbk/tbk_cate`,
            qs.stringify(params)
        );
    },
    get_shop_list(params) {                     //[前端]淘宝商品列表    cate_id:类别ID
        return axios.post(
            `/mobile/plugin_tbk/tbk_lists`,
            qs.stringify(params)
        );
    },
    get_shop_detail(params) {               //[前端]淘宝商品详情        id ：商品id
        return axios.post(
            `/mobile/plugin_tbk/tbk_one`,
            qs.stringify(params)
        );
    },
    find_shop_list(params){
        return axios.post(
            `/mobile/plugin_tbk/tbk_search`,
            qs.stringify(params)
        );
    },
    get_tbklink(params){
        return axios.post(
            `/mobile/plugin_tbk/tbk_kl`,
            qs.stringify(params)
        );
    },

    // search_shop_title(params) {               //[前端]淘宝商品详情        id ：商品id
    //     return axios.post(
    //         `/admin/tb_goods/lists`,
    //         qs.stringify(params)
    //     );
    // },

}

export default gettb