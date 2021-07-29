import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getPage = {
  getindex(params) {
    return axios.post(`/mobile/page/index`, qs.stringify(params));
  },
  getannounce(params) {
    return axios.post(`/mobile/page/announcement`, qs.stringify(params));
  },
  get_myletter(params) {
    return axios.post(`/mobile/ucenter/my_letter`, qs.stringify(params));
  },

  phone_sign(params) {
    //手机签到
    return axios.post(`/mobile/sign_in/sign_ok`, qs.stringify(params));
  },
  is_day_sign(params) {
    //当天是否签到
    return axios.post(`/mobile/sign_in/is_sign`, qs.stringify(params));
  },
  sign_warn(params) {
    //签到提醒
    return axios.post(`/mobile/sign_in/is_remark`, qs.stringify(params));
  },
  sign_warn_remark(params) {
    //签到提醒值改变
    return axios.post(
      `/mobile/sign_in/change_sign_remark`,
      qs.stringify(params)
    );
  },
  get_sign_week(params) {
    return axios.post(`/mobile/sign_in/seven_day`, qs.stringify(params));
  },
  get_task(params) {
    return axios.post(`/mobile/new_duty/reward`, qs.stringify(params));
  },

  get_new_coupon(params) {
    //前台消费红包 领取
    return axios.post(`/mobile/coupon/get_new_coupon`, qs.stringify(params));
  },
  get_memberlist(params) {
    return axios.post(`/mobile/page/vip`, qs.stringify(params));
  },
  is_turntable(params) {
    return axios.post(`/mobile/plugin_big/ask`, qs.stringify(params));
  },
  start_turntable(params) {
    return axios.post(`/mobile/plugin_big/play`, qs.stringify(params));
  },
  get_member_vip(params) {
    //获取推荐人
    return axios.post("/mobile/ucenter/tid_info", qs.stringify(params));
  },
  get_catelist(params) {
    return axios.post("/mobile/lesson/cate_lists", qs.stringify(params));
  },
  get_lessonlist(params) {
    return axios.post("/mobile/lesson/lesson_lists", qs.stringify(params));
  },
  get_stagelist(params) {
    return axios.post(
      "/mobile/lesson/lesson_stage_lists",
      qs.stringify(params)
    );
  },
  get_hotlesson(params) {
    return axios.post("/mobile/lesson/lesson_hot", qs.stringify(params));
  },
  get_levellist(params) {
    //前台点位详情
    return axios.post("/mobile/platoon/edit", qs.stringify(params));
  },
  get_pointlist(params) {
    //前台点位页面
    return axios.post("/mobile/platoon/lists", qs.stringify(params));
  },
  getActivimsg(params) {
    return axios.post(
      "/mobile/plugin_im/user_recommend_letter",
      qs.stringify(params)
    );
  },
  getLessonDetails(params) {
    return axios.post("/mobile/lesson/lesson_centent", qs.stringify(params));
  },
  payLesson(params) {
    return axios.post("/mobile/order/save_lesson", qs.stringify(params));
  },
  checkLesson(params) {
    return axios.post("/mobile/lesson/lesson_stage_hit", qs.stringify(params));
  },
  lesson_click_lesson(params) {
    return axios.post("/mobile/lesson/lesson_likes", qs.stringify(params));
  },
  search_lesson(params) {
    return axios.post("/mobile/lesson_xs/lists", qs.stringify(params));
  },

  //直播
  get_live_apply(params) {
    //申请
    return axios.post("/mobile/live/live_application", qs.stringify(params));
  },
  submit_live_apply(params) {
    //提交申请
    return axios.post(
      "/mobile/live/live_application_save",
      qs.stringify(params)
    );
  },
  get_live_setting(params) {
    //直播设置页面
    return axios.post("/mobile/live/live_index", qs.stringify(params));
  },
  set_live_setting(params) {
    //保存直播设置
    return axios.post("/mobile/live/live_save", qs.stringify(params));
  },

  goin_live_open(params) {
    //开启直播进入主播页面
    return axios.post("/mobile/live/live_open", qs.stringify(params));
  },
  in_live_online(params) {
    return axios.post("/mobile/live/live_open_online", qs.stringify(params));
  },

  get_live_info(params) {
    //游客进入观看页面
    return axios.post("/mobile/live/tourists", qs.stringify(params));
  },
  attention_live(params) {
    return axios.post("/mobile/live/collect", qs.stringify(params));
  },
  get_present(params) {
    //礼物列表
    return axios.post("/mobile/live/live_gift", qs.stringify(params));
  },
  send_present(params) {
    //发送礼物
    return axios.post("/mobile/live/live_gift_order", qs.stringify(params));
  },
  get_livehot(params) {
    return axios.post("/mobile/live/featured", qs.stringify(params));
  },
  get_replyhot(params) {
    return axios.post("/mobile/live/video_featured", qs.stringify(params));
  },
  get_attention(params) {
    //我的关注
    return axios.post("/mobile/live/my_attention", qs.stringify(params));
  },
  get_myreply(params) {
    //我的回放
    return axios.post("/mobile/live/my_live_video", qs.stringify(params));
  },
  get_replylist(params) {
    //用户看回放
    return axios.post("/mobile/live/live_video", qs.stringify(params));
  },
  single_reply(params) {
    //单个回放
    return axios.post("/mobile/live/one_live_video", qs.stringify(params));
  },
  get_liveurl(params) {
    return axios.post("/mobile/power/plugin_open_one", qs.stringify(params));
  },

  save_apply_rider(params) {
    return axios.post("/mobile/rider/rider_apply_save", qs.stringify(params));
  },
  get_apply_rider(params) {
    return axios.post("/mobile/rider/rider_apply", qs.stringify(params));
  },

  //添加回放
  add_reply(params) {
    //单个回放
    return axios.post("/mobile/live/video_saveadd", qs.stringify(params));
  },
  del_reply(params) {
    //删除单个回放
    return axios.post("/mobile/live/video_del", qs.stringify(params));
  },
  get_reply(params) {
    //录播列表
    return axios.post("/mobile/live/video_lists", qs.stringify(params));
  },

  //会员卡消费
  get_member_upgrade(params) {
    return axios.post("/mobile/vip_system/lists", qs.stringify(params));
  },
  buy_member_upgrade(params) {
    return axios.post("/mobile/vip_system/order", qs.stringify(params));
  },

  top_reply(params) {
    //点赞
    return axios.post("/mobile/live/like_number", qs.stringify(params));
  },
  comment_reply(params) {
    //评论
    return axios.post("/mobile/live/live_comment", qs.stringify(params));
  },
  get_replycomment_list(params) {
    //评论
    return axios.post("/mobile/live/live_commen_lists", qs.stringify(params));
  },

  //人脸识别
  add_face(params) {
    return axios.post("/mobile/face/saveadd", qs.stringify(params));
  },
  backSuccess_face(params) {
    return axios.post("/mobile/face/success", qs.stringify(params));
  },
  get_mycomment(params) {
    return axios.post("/mobile/live/my_live_comment", qs.stringify(params));
  },
  get_mylivejob(params) {
    return axios.post("/mobile/live/my_live", qs.stringify(params));
  },

  extract_page(params) {
    return axios.post("/mobile/page/extract_lists", qs.stringify(params));
  },
  get_down(params) {
    return axios.post("/mobile/app/down", qs.stringify(params));
  },
  studiolook_like(params) {
    //直播点赞
    return axios.post("/mobile/live/live_like", qs.stringify(params));
  },
  livesearch(params) {
    //直播搜索
    return axios.post("/mobile/search/lists", qs.stringify(params));
  },
  nowplayback(params) {
    //当场直播观看人数获取
    return axios.post("/mobile/live/now_playback", qs.stringify(params));
  },
  end_videoplay(params) {
    //下播
    return axios.post("/mobile/live/end_live", qs.stringify(params));
  },

  live_send_notice(params) {
    //直播发送通知
    return axios.post("/mobile/live/live_index_tzxx", qs.stringify(params));
  },
  live_reply_volume(params) {
    //直播回放观看人数+1
    return axios.post("/mobile/live/video_volume", qs.stringify(params));
  },
  live_pushshop(params) {
    //直播推送商品 传id
    return axios.post("/mobile/live/live_push", qs.stringify(params));
  },

  //新的测试模板
  get_pageindex(params) {
    return axios.post("/mobile/theme/edit", qs.stringify(params));
  },
  get_pageproduct(params) {
    return axios.post("/mobile/theme/product", qs.stringify(params));
  },

  //同城信息

  get_cityinfo_cate_nologin(params) {
    //不需要登录查询分类
    return axios.post("/mobile/class_info_home/lists", qs.stringify(params));
  },
  get_cityinfo_list_nologin(params) {
    //获取信息
    return axios.post(
      "/mobile/class_info_home/list_info",
      qs.stringify(params)
    );
  },
  get_cityinfo_cate(params) {
    //查询分类
    return axios.post("/mobile/class_info/lists", qs.stringify(params));
  },
  get_cityinfo_cateson(params) {
    //根据分类id查询下级分类
    return axios.post(
      "/mobile/class_info/class_id_lists",
      qs.stringify(params)
    );
  },
  get_cityinfo_addform(params) {
    //查询发布信息要填写的信息
    return axios.post("/mobile/class_info/class_id", qs.stringify(params));
  },
  submit_cityinfo_addform(params) {
    //发布信息
    return axios.post("/mobile/class_info/add_info", qs.stringify(params));
  },
  get_cityinfo_list(params) {
    //获取信息
    return axios.post("/mobile/class_info/list_info", qs.stringify(params));
  },
  top_cityinfo_info(params) {
    //置頂
    return axios.post("/mobile/class_info/top", qs.stringify(params));
  },
  refresh_cityinfo_info(params) {
    //置頂
    return axios.post("/mobile/class_info/refresh", qs.stringify(params));
  },
  edit_cityinfo_info(params) {
    //编辑
    return axios.post("/mobile/class_info/bdsaveedit", qs.stringify(params));
  },
  del_cityinfo_info(params) {
    //删除
    return axios.post("/mobile/class_info/bddel", qs.stringify(params));
  },

  get_cityinfo_info(params) {
    //获取详情
    return axios.post("/mobile/class_info/details_info", qs.stringify(params));
  },
  jog_cityinfo_info(params) {
    //点赞
    return axios.post("/mobile/class_info/like", qs.stringify(params));
  },
  get_cityinfo_recommend(params) {
    //推荐信息
    return axios.post("/mobile/class_info/recommend", qs.stringify(params));
  },
  get_cityinfo_setting(params) {
    //获取设置
    return axios.post("/mobile/class_info/get_top_info", qs.stringify(params));
  },
  get_cityinfo_reply(params) {
    //我的回复
    return axios.post("/mobile/class_info/ireply", qs.stringify(params));
  },
  reply_cityinfo_info(params) {
    //回复
    return axios.post("/mobile/class_info/reply", qs.stringify(params));
  },
  submit_cityinfo_appointment(params) {
    //预约信息
    return axios.post("/mobile/class_info/appointment", qs.stringify(params));
  },
  get_cityinfo_appointment(params) {
    //发布预约信息
    return axios.post(
      "/mobile/class_info/appointment_info",
      qs.stringify(params)
    );
  },
  get_cityinfo_commentmore(params) {
    return axios.post(
      "/mobile/class_info/comment_details",
      qs.stringify(params)
    );
  },
  get_addresslist(params) {
    return axios.post("/common/ad/lists_one", qs.stringify(params));
  },
  //保存团长信息
  saveExtractId(params) {
    return axios.post("/mobile/extract/extract_id", qs.stringify(params));
  },
  //浏览记录
  get_footprint(params) {
    return axios.post("/mobile/footprint/lists", qs.stringify(params));
  },
  add_footprint(params) {
    return axios.post("/mobile/footprint/saveadd", qs.stringify(params));
  },
  get_footprint_type(params) {
    return axios.post("/mobile/footprint/footprint_type", qs.stringify(params));
  },
  //归来推荐红包
  getRedEnvelopes(params) {
    return axios.post("/mobile/coupon/is_gltj", qs.stringify(params));
  },
  //领取推荐红包
  receiveRedEnvelopes(params) {
    return axios.post("/mobile/coupon/get_gl_coupon", qs.stringify(params));
  },
  //新手任务积分商品
  integralGoods(params) {
    return axios.post("/mobile/new_duty/goods_list", qs.stringify(params));
  },

  get_languagelist(params) {
    return axios.post("/common/language/index", qs.stringify(params));
  },
  get_languagetype(params) {
    return axios.post("/common/language/lists", qs.stringify(params));
  },
  //收藏内容付费
  collection(params) {
    return axios.post("/mobile/lesson/collect", qs.stringify(params));
  },
  //取消收藏内容付费
  del_collection(params) {
    return axios.post("/mobile/lesson/del_collect", qs.stringify(params));
  },
  //大转盘 获取信息
  getRuleInfo(params) {
    return axios.post("/mobile/plugin_big/ask2", qs.stringify(params));
  },
};
export default getPage;
