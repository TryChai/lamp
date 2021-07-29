import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getTask = {
  get_tasklist(params) {
    //获取任务列表
    return axios.post(`/mobile/task1/lists`, qs.stringify(params));
  },
  get_taskexpress(params) {
    //获取任务快报
    return axios.post(`/mobile/task1/express`, qs.stringify(params));
  },
  get_taskcate(params) {
    //获取任务分类
    return axios.post(`/mobile/task/cate`, qs.stringify(params));
  },
  get_taskdetail(params) {
    //获取任务详情
    return axios.post(`/mobile/task/info`, qs.stringify(params));
  },
  submit_taskreport(params) {
    //举报
    return axios.post(`/mobile/task/report`, qs.stringify(params));
  },
  get_print_parameter(params) {
    //发布页面参数
    return axios.post(`/mobile/task/parameter`, qs.stringify(params));
  },
  save_print(params) {
    //发布
    return axios.post(`/mobile/task/release`, qs.stringify(params));
  },

  get_paylist(params) {
    //支付列表
    return axios.post(`/mobile/task/pay_lists`, qs.stringify(params));
  },
  sub_pay(params) {
    //支付
    return axios.post(`/mobile/task/pay`, qs.stringify(params));
  },

  get_paystatus(params) {
    //支付是否成功
    return axios.post(`/mobile/task/success`, qs.stringify(params));
  },

  receive_task(params) {
    //领取任务
    return axios.post(`/mobile/task/receive`, qs.stringify(params));
  },

  get_signup_list(params) {
    //报名任务列表
    return axios.post(`/mobile/task/sign_up`, qs.stringify(params));
  },
  get_signup_detail(params) {
    //报名任务详情
    return axios.post(`/mobile/task/sign_up_info`, qs.stringify(params));
  },
  give_up_signup(params) {
    //放弃报名的任务
    return axios.post(`/mobile/task/give_up`, qs.stringify(params));
  },
  deliver_signup(params) {
    //交付
    return axios.post(`/mobile/task/deliver`, qs.stringify(params));
  },
  get_mytask(params) {
    //我的任务
    return axios.post(`/mobile/task/my_lists`, qs.stringify(params));
  },
  get_checklist(params) {
    //待审核列表
    return axios.post(`/mobile/task/audit_lists`, qs.stringify(params));
  },
  get_checkDetail(params) {
    //待审核详情
    return axios.post(`/mobile/task/audit_info`, qs.stringify(params));
  },
  through_checktask(params) {
    //审核 check 传1 审核通过，2审核不通过
    return axios.post(`/mobile/task/audit_by`, qs.stringify(params));
  },
  top_task(params) {
    //置顶
    return axios.post(`/mobile/task/top`, qs.stringify(params));
  },
  refresh_task(params) {
    //刷新
    return axios.post(`/mobile/task/refresh`, qs.stringify(params));
  },
  edit_task(params) {
    return axios.post(`/mobile/task/edit_release`, qs.stringify(params));
  },
};

export default getTask;
