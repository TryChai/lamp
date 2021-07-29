import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getIm = {
  playHongBao(params) {
    return axios.post(`/mobile/transfer/red_send`, qs.stringify(params));
  },
  getHongBao(params) {
    return axios.post(`/mobile/transfer/red_open`, qs.stringify(params));
  },
  infoHongBao(params) {
    return axios.post(`/mobile/transfer/order_user`, qs.stringify(params));
  },
  delHongBao(params) {
    return axios.post(`/mobile/transfer/red_del`, qs.stringify(params));
  },

  getHongBaoAllStatus(params) {
    return axios.post(`/mobile/transfer/lists_now`, qs.stringify(params));
  },

  //查看战队
  getTeatList(params) {
    return axios.post(`/mobile/im_team/lists`, qs.stringify(params));
  },
  getTeamIndex(params) {
    return axios.post(`/mobile/im_team/index`, qs.stringify(params));
  },
  addTeam(params) {
    return axios.post(`/mobile/im_team/add_team`, qs.stringify(params));
  },
  joinTeam(params) {
    return axios.post(`/mobile/im_team/join`, qs.stringify(params));
  },
  editTeam(params) {
    return axios.post(`/mobile/im_team/edit`, qs.stringify(params));
  },
  tOutTeam(params) {
    return axios.post(`/mobile/im_team/kick_out`, qs.stringify(params));
  },
  transferTeam(params) {
    return axios.post(`/mobile/im_team/transfer`, qs.stringify(params));
  },
  saveEaitTeam(params) {
    return axios.post(`/mobile/im_team/saveedit`, qs.stringify(params));
  },
  refuseTeam(params) {
    return axios.post(`/mobile/im_team/refuse`, qs.stringify(params));
  },
  byjoining(params) {
    return axios.post(`/mobile/im_team/byjoining`, qs.stringify(params));
  },
  delJoin(params) {
    return axios.post(`/mobile/im_team/del_join`, qs.stringify(params));
  },
  outTeam(params) {
    return axios.post(`/mobile/im_team/drop_out`, qs.stringify(params));
  },
  addRecom(params) {
    return axios.post(`/mobile/im_team/recommended`, qs.stringify(params));
  },
  getwelcome(params) {
    return axios.post(`/mobile/plugin_im/welcome`, qs.stringify(params));
  },
  sendMsg(params) {
    return axios.post(`/mobile/plugin_im/im_text`, qs.stringify(params));
  },
  getActivitMsg(params) {
    return axios.post(
      `/mobile/plugin_im/one_recommend_letter`,
      qs.stringify(params)
    );
  },
  getXtMsg(params) {
    return axios.post(`/mobile/plugin_im/one_letter`, qs.stringify(params));
  },
  sendMsgSms(params) {
    return axios.post(`/mobile/plugin_im/sms`, qs.stringify(params));
  },
  imBuddySearch(params) {
    return axios.post(`/mobile/im_buddy/search`, qs.stringify(params));
  },
  imBuddyApplications(params) {
    return axios.post(`/mobile/im_buddy/applications`, qs.stringify(params));
  },
  imBuddyAudits(params) {
    return axios.post(`/mobile/im_buddy/audit`, qs.stringify(params));
  },
  imBuddyBy(params) {
    return axios.post(`/mobile/im_buddy/by`, qs.stringify(params));
  },
  imBuddyLists(params) {
    return axios.post(`/mobile/im_buddy/lists`, qs.stringify(params));
  },
  imBuddyDel(params) {
    return axios.post(`/mobile/im_buddy/del`, qs.stringify(params));
  },

  //编辑备注
  edit_remark(params) {
    return axios.post(`/mobile/im_buddy/remark`, qs.stringify(params));
  },

  //获取用户信息
  get_frinedinfo(params) {
    return axios.post(`/mobile/im_buddy/friend_data`, qs.stringify(params));
  },
  //创建群聊
  create_team(params) {
    return axios.post(`/mobile/im_team/im_team_work`, qs.stringify(params));
  },
  //退出
  exit_team(params) {
    return axios.post(`/mobile/im_team/drop_out_im`, qs.stringify(params));
  },
  //自己的申请加群列表
  my_teamapply(params) {
    return axios.post(`/mobile/im_team/im_team_work`, qs.stringify(params));
  },
  //取消自己的申请
  cancel_my_teamapply(params) {
    return axios.post(`/mobile/im_team/del_join`, qs.stringify(params));
  },

  pick_friend_inteam(params) {
    return axios.post(`/mobile/im_team/pick_up_friends`, qs.stringify(params));
  },

  //删除好友
  del_myfriend(params) {
    return axios.post(`/mobile/im_buddy/del_buddy`, qs.stringify(params));
  },

  //发送群红包
  send_team_redbag(params) {
    return axios.post(`/mobile/im_team_red/red_send`, qs.stringify(params));
  },
  open_team_redbag(params) {
    return axios.post(`/mobile/im_team_red/red_open`, qs.stringify(params));
  },

  add_group_announcement(params) {
    return axios.post(`/mobile/im_team/announcement`, qs.stringify(params));
  },
  get_group_announcement(params) {
    return axios.post(
      `/mobile/im_team/announcement_lists`,
      qs.stringify(params)
    );
  },

  add_blackuser(params) {
    return axios.post(`/mobile/im_blacklist/save`, qs.stringify(params));
  },
  del_blackuser(params) {
    return axios.post(`/mobile/im_blacklist/del`, qs.stringify(params));
  },
  //签到
  add_group_sign(params) {
    return axios.post(`/mobile/im_team/sign`, qs.stringify(params));
  },

  //签到列表
  get_group_signlist(params) {
    return axios.post(`/mobile/im_team/sign_lists`, qs.stringify(params));
  },
  plugin_im_zttj(params) {
    return axios.post(`/mobile/plugin_im/zttj`, qs.stringify(params));
  },
};

export default getIm;
