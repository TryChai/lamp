import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getShop = {
  getShopIndex(params) {
    return axios.post(`/mobile/page/home`, qs.stringify(params));
  },
  getShopSearch(params) {
    return axios.post(`/mobile/product/lists`, qs.stringify(params));
  },
  getShopDetails(params) {
    return axios.post(`/mobile/product/info`, qs.stringify(params));
  },
  getComment(params) {
    //商品评论
    return axios.post(`/mobile/product_review/lists`, qs.stringify(params));
  },
  addCart(params) {
    return axios.post(`/mobile/cart/add_cart`, qs.stringify(params));
  },
  getCoupon(params) {
    return axios.post(`/mobile/coupon/receive`, qs.stringify(params));
  },
  getCardList(params) {
    return axios.post(`/mobile/cart/lists`, qs.stringify(params));
  },
  updateCardNumber(params) {
    return axios.post(`/mobile/cart/cart_num`, qs.stringify(params));
  },
  delCard(params) {
    return axios.post(`/mobile/cart/del_all`, qs.stringify(params));
  },
  getShopSraechHistory(params) {
    return axios.post(`/mobile/product/search`, qs.stringify(params));
  },
  getGz(params) {
    return axios.post(
      // 商城商品
      `/mobile/collect/product_collect`,
      qs.stringify(params)
    );
  },
  getCardNumber(params) {
    return axios.post(
      // 商城商品
      `/mobile/cart/number`,
      qs.stringify(params)
    );
  },
  getInfo(params) {
    return axios.post(
      // 商城商品
      `mobile/product_review/index`,
      qs.stringify(params)
    );
  },
  addReview(params) {
    return axios.post(
      // 商城商品
      `mobile/product_review/saveadd`,
      qs.stringify(params)
    );
  },
  getReviewTj(params) {
    return axios.post(
      // 商城商品
      `mobile/product_review/statistics`,
      qs.stringify(params)
    );
  },
  get_product_collect(params) {
    //收藏商品列表
    return axios.post(
      `/mobile/collect/product_collect_lists`,
      qs.stringify(params)
    );
  },
  get_shop_collect(params) {
    //收藏店铺列表
    return axios.post(
      `mobile/collect/shop_collect_lists`,
      qs.stringify(params)
    );
  },
  collect_product(params) {
    //收藏商品
    return axios.post(`mobile/collect/product_collect`, qs.stringify(params));
  },
  collect_shop(params) {
    //收藏店铺
    return axios.post(`mobile/collect/shop_collect`, qs.stringify(params));
  },
  get_coupon_list(params) {
    return axios.post("mobile/coupon/my_coupon_list", qs.stringify(params));
  },
  get_coupon_uselist(params) {
    return axios.post("mobile/coupon/my_coupon_history", qs.stringify(params));
  },
  get_mark_list(params) {
    return axios.post("/mobile/coupon/packet_list", qs.stringify(params));
  },
  exchange_mark(params) {
    return axios.post("/mobile/coupon/packet_jf", qs.stringify(params));
  },
  getShopCate(params) {
    return axios.post("/mobile/page/cate", qs.stringify(params));
  },
  get_limittime(params) {
    //限时特惠时间分类
    return axios.post("/mobile/activity/limited_time", qs.stringify(params));
  },
  get_limitshop(params) {
    //限时特惠列表 传id 分类ID
    return axios.post(
      "/mobile/activity/limited_time_lists",
      qs.stringify(params)
    );
  },
  get_integralshop(params) {
    //积分抢购列表
    return axios.post("/mobile/activity/redeem_lists", qs.stringify(params));
  },
  getGroupUser(params) {
    //商品拼团详情
    return axios.post("/mobile/group/info", qs.stringify(params));
  },
  getGroupOrderInfo(params) {
    return axios.post("/mobile/group/detail", qs.stringify(params));
  },
  getRecommend(params) {
    return axios.post("/mobile/group/recommend", qs.stringify(params));
  },
  getShopNewDay(params) {
    return axios.post("/mobile/product/lists_today", qs.stringify(params));
  },
  get_tourcate(params) {
    return axios.post("/mobile/product/tour_lists", qs.stringify(params));
  },

  /*砍价*/

  get_cut_banner(params) {
    return axios.post("/mobile/bargain/banner", qs.stringify(params));
  },
  get_cut_list(params) {
    return axios.post("/mobile/bargain/lists", qs.stringify(params));
  },
  start_cut(params) {
    return axios.post("/mobile/bargain/bargain_go", qs.stringify(params));
  },
  cutshop_detail(params) {
    return axios.post("/mobile/bargain/info", qs.stringify(params));
  },
  get_addshop_cate(params) {
    return axios.post("/mobile/page/cate_only", qs.stringify(params));
  },
  get_presale_list(params) {
    return axios.post(
      "/mobile/activity/appointment_lists",
      qs.stringify(params)
    );
  },
  getIndexProductList(params) {
    return axios.post("/mobile/page/product", qs.stringify(params));
  },
  getWriteList(params) {
    return axios.post("/mobile/write/lists", qs.stringify(params));
  },
  selectWrite(params) {
    return axios.post("/mobile/write/index", qs.stringify(params));
  },
  addWriteNumber(params) {
    return axios.post("/mobile/write/confirm", qs.stringify(params));
  },
  get_carnum(params) {
    return axios.post("/mobile/product/cart_number", qs.stringify(params));
  },
  get_slide_shop(params) {
    return axios.post("/mobile/page/cate_son", qs.stringify(params));
  },
  get_slide_img(params) {
    return axios.post(`mobile/page/cate_slide`, qs.stringify(params));
  },
  getQualityDetails(params) {
    return axios.post(`mobile/quality_product/info`, qs.stringify(params));
  },
  del_search_word(params) {
    return axios.post(`mobile/product/del_search`, qs.stringify(params));
  },
  getNewProduct(params) {
    return axios.post(`mobile/news/product`, qs.stringify(params));
  },

  //微店
  get_store_info(params) {
    //微店详情
    return axios.post(`mobile/microshop/info`, qs.stringify(params));
  },
  edit_store_info(params) {
    //编辑微店资料
    return axios.post(`mobile/microshop/edit_info`, qs.stringify(params));
  },
  get_store_shop(params) {
    //微店商品列表
    return axios.post(`mobile/microshop/lists`, qs.stringify(params));
  },
  get_store_manger_shop(params) {
    //添加微店商品列表
    return axios.post(`mobile/microshop/lists_product`, qs.stringify(params));
  },
  add_store_manger_shop(params) {
    //添加微店商品
    return axios.post(`mobile/microshop/add_product`, qs.stringify(params));
  },
  del_store_manger_shop(params) {
    //添加微店商品
    return axios.post(`mobile/microshop/del_product`, qs.stringify(params));
  },

  get_edit_store_info(params) {
    return axios.post(`mobile/microshop/edit`, qs.stringify(params));
  },
  get_my_storeshop(params) {
    return axios.post(`mobile/microshop/my_lists`, qs.stringify(params));
  },
  store_like(params) {
    return axios.post(`mobile/microshop/like`, qs.stringify(params));
  },
  upProducr(params) {
    return axios.post(`mobile/supplier/up_product`, qs.stringify(params));
  },
  downProducr(params) {
    return axios.post(`mobile/supplier/down_product`, qs.stringify(params));
  },

  reserve_store_lists(params) {
    return axios.post(`mobile/reserve_store/lists`, qs.stringify(params));
  },
  reserve_store_times(params) {
    return axios.post(
      `mobile/reserve_store/reserve_time`,
      qs.stringify(params)
    );
  },
  add_store_hot_shop(params) {
    return axios.post(`mobile/microshop/add_top`, qs.stringify(params));
  },
  down_store_hot_shop(params) {
    return axios.post(`mobile/microshop/del_top`, qs.stringify(params));
  },
  get_store_hot_shop(params) {
    return axios.post(`mobile/microshop/lists_top`, qs.stringify(params));
  },
  get_all_remark(params) {
    // 所有买家秀
    return axios.post(`mobile/product_review/lists_all`, qs.stringify(params));
  },
  enjoy_remark(params) {
    //点赞买家秀
    return axios.post(`mobile/product_review/awesome`, qs.stringify(params));
  },
  del_product_review(params) {
    //删除买家秀
    return axios.post(`/mobile/product_review/del`, qs.stringify(params));
  },
  yuyue_shop_lists(params) {
    //预约
    return axios.post(`mobile/product/yuyue_lists`, qs.stringify(params));
  },

  //拍卖
  get_auctionlist(params) {
    return axios.post(`mobile/auction/lists`, qs.stringify(params));
  },
  bid_auciton(params) {
    return axios.post(`mobile/auction/order`, qs.stringify(params));
  },
  get_auctioninfo(params) {
    return axios.post(`mobile/auction/info`, qs.stringify(params));
  },
  get_auctionOrder(params) {
    return axios.post(`mobile/auction/order_lists`, qs.stringify(params));
  },
  get_auction_bidpeople(params) {
    return axios.post(`mobile/auction/info_more`, qs.stringify(params));
  },
  pay_auction_order(params) {
    return axios.post(`mobile/auction/address`, qs.stringify(params));
  },
  get_default_address(params) {
    return axios.post(`mobile/address/show_address_one`, qs.stringify(params));
  },
  // 拼购
  get_groupbuyList(params) {
    return axios.post(`mobile/group_buy/cate_lists_all`, qs.stringify(params));
  },
  get_groupbuyProduct(params) {
    return axios.post(`mobile/group_buy/lists`, qs.stringify(params));
  },
  //优惠券
  coupon_packet_list(params) {
    return axios.post(`mobile/coupon/packet_list`, qs.stringify(params));
  },
  coupon_packet_ye(params) {
    return axios.post(`mobile/coupon/packet_ye`, qs.stringify(params));
  },

  //供应商审核退货列表
  get_orderreturn(params) {
    return axios.post(`mobile/supplier/reback_lists`, qs.stringify(params));
  },
  check_orderreturn(params) {
    return axios.post(`mobile/supplier/reback_goods`, qs.stringify(params));
  },
  product_review_hotel_reply(params) {
    return axios.post(
      `mobile/product_review/hotel_reply`,
      qs.stringify(params)
    );
  },

  //积分分类
  integral_cate_lists_all(params) {
    return axios.post(`mobile/integral_cate/lists_all`, qs.stringify(params));
  },
  //预约限时活动
  makeAnAppointment(params) {
    return axios.post(`mobile/activity/add_notice`, qs.stringify(params));
  },
  //随手拍举报
  product_review_report(params) {
    return axios.post(
      `mobile/product_review/report_review`,
      qs.stringify(params)
    );
  },
  //零元购
  getZero(params) {
    return axios.post(`mobile/zero/lists`, qs.stringify(params));
  },
  //取消预售
  cancelPreSale(params) {
    return axios.post(`mobile/order_return/sale_refund`, qs.stringify(params));
  },
  //砍价后请求接口
  // plugin_big(params) {
  //   return axios.post(`mobile/plugin_big/ask`, qs.stringify(params));
  // },
  get_limitshop_new(params) {
    return axios.post(
      "/mobile/product/limited_time_lists",
      qs.stringify(params)
    );
  },

  edit_shareShowPriceImg(params) {
    return axios.post("/mobile/product/share_piclink", qs.stringify(params));
  },
};
export default getShop;
