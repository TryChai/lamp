import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getDriver = {
  get_agentapply(params) {
    return axios.post(`/mobile/driving_agent/index`, qs.stringify(params));
  },
  submit_agentapply(params) {
    return axios.post(`/mobile/driving_agent/apply`, qs.stringify(params));
  },
  get_agentorder(params) {
    return axios.post(
      `/mobile/driving_agent/lists_order`,
      qs.stringify(params)
    );
  },

  get_motorapply(params) {
    return axios.post(`/mobile/driving/index`, qs.stringify(params));
  },
  submit_motorapply(params) {
    return axios.post(`/mobile/driving/apply`, qs.stringify(params));
  },
  get_motorinfo(params) {
    return axios.post(`/mobile/driving/member`, qs.stringify(params));
  },
  get_motorinfo2(params) {
    return axios.post(`/mobile/driving/member2`, qs.stringify(params));
  },
  get_motorrewardlist(params) {
    return axios.post(`/mobile/driving/reward_lists`, qs.stringify(params));
  },
  get_motorrewarddetail(params) {
    return axios.post(`/mobile/driving/reward_info`, qs.stringify(params));
  },
  get_motorrewardreceive(params) {
    return axios.post(`/mobile/driving/receive_rewards`, qs.stringify(params));
  },
  set_motordistance(params) {
    return axios.post(`/mobile/driving/set_up_distance`, qs.stringify(params));
  },
  set_motorislisten(params) {
    return axios.post(`/mobile/driving/set_up_listen`, qs.stringify(params));
  },
  set_motorUp(params) {
    return axios.post(`/mobile/driving/go_to_work`, qs.stringify(params));
  },
  set_motorOff(params) {
    return axios.post(`/mobile/driving/go_off_work`, qs.stringify(params));
  },
  set_motorUp_face(params) {
    return axios.post(`/mobile/driving/go_to_work_face`, qs.stringify(params));
  },
  set_motor_listen(params) {
    return axios.post(`/mobile/driving/set_up_listen`, qs.stringify(params));
  },
  get_grabbing_lists(params) {
    return axios.post(`/mobile/driving/grabbing_lists`, qs.stringify(params));
  },
  //司机抢单
  grabbing_motor_order(params) {
    return axios.post(`/mobile/driving/grabbing_add`, qs.stringify(params));
  },

  get_motor_dispatch_info(params) {
    return axios.post(`/mobile/driving/dispatch_info`, qs.stringify(params));
  },
  add_motor_dispatch_info(params) {
    return axios.post(`/mobile/driving/receiving_order`, qs.stringify(params));
  },

  get_motor_detail(params) {
    return axios.post(`/mobile/driving/information`, qs.stringify(params));
  },
  get_motor_comment(params) {
    return axios.post(`/mobile/driving/comment_list `, qs.stringify(params));
  },

  get_orderinfo(params) {
    return axios.post(`/mobile/driving/order_info `, qs.stringify(params));
  },
  get_orderinfo2(params) {
    return axios.post(`/mobile/driving/order_info2 `, qs.stringify(params));
  },
  get_user_maplist(params) {
    return axios.post(
      `/mobile/driving_passenger/driving_lists`,
      qs.stringify(params)
    );
  },
  get_user_maplist2(params) {
    return axios.post(
      `/mobile/driving_passenger2/driving_lists`,
      qs.stringify(params)
    );
  },
  get_user_estimate(params) {
    return axios.post(
      `/mobile/driving_passenger/estimate`,
      qs.stringify(params)
    );
  },
  add_user_order(params) {
    return axios.post(
      `/mobile/driving_passenger/add_order`,
      qs.stringify(params)
    );
  },
  add_user_order_friend(params) {
    return axios.post(
      `/mobile/driving_passenger/substitution_order`,
      qs.stringify(params)
    );
  },
  get_motor_order(params) {
    return axios.post(
      `/mobile/driving/driver_order_lists`,
      qs.stringify(params)
    );
  },
  add_motor_order(params) {
    return axios.post(`/mobile/driving/driver_order`, qs.stringify(params));
  },
  cancel_user_order(params) {
    return axios.post(`/mobile/driving_passenger/cancel`, qs.stringify(params));
  },
  cancel_driver_order(params) {
    return axios.post(`/mobile/driving/cancel`, qs.stringify(params));
  },
  //交通上报
  traffic_report(params) {
    return axios.post(
      `/mobile/driving_passenger/traffic_report`,
      qs.stringify(params)
    );
  },
  cancel_motor_order(params) {
    return axios.post(`/mobile/driving/cancel`, qs.stringify(params));
  },
  get_driverposition(params) {
    return axios.post(`/mobile/driving/position_info`, qs.stringify(params));
  },
  submit_motor_position(params) {
    return axios.post(`/mobile/driving/position`, qs.stringify(params));
  },
  arrive_startPoint(params) {
    return axios.post(`/mobile/driving/arrive_order `, qs.stringify(params));
  },
  start_serving(params) {
    return axios.post(`/mobile/driving/set_out`, qs.stringify(params));
  },
  end_serving(params) {
    return axios.post(`/mobile/driving/complete`, qs.stringify(params));
  },
  start_wait_open(params) {
    return axios.post(`/mobile/driving/wait_open`, qs.stringify(params));
  },
  start_wait_end(params) {
    return axios.post(`/mobile/driving/wait_end`, qs.stringify(params));
  },
  add_driver_money(params) {
    return axios.post(`/mobile/driving/other`, qs.stringify(params));
  },
  add_user_police(params) {
    return axios.post(
      `/mobile/driving_passenger/sms_alarm`,
      qs.stringify(params)
    );
  },
  motor_set_offlinepay(params) {
    return axios.post(`/mobile/driving/pay`, qs.stringify(params));
  },
  press_motor_money(params) {
    return axios.post(`/mobile/driving/press`, qs.stringify(params));
  },
  get_userinfo(params) {
    return axios.post(`/mobile/driving_passenger/member`, qs.stringify(params));
  },
  complete_carinfo(params) {
    return axios.post(
      `/mobile/driving/complete_information`,
      qs.stringify(params)
    );
  },
  //司机允许支付
  driver_apply_pay(params) {
    return axios.post(`/mobile/driving/is_yxpay`, qs.stringify(params));
  },
  //用户获取订单列表
  get_userorderlist(params) {
    return axios.post(
      `/mobile/driving_passenger/user_order_lists`,
      qs.stringify(params)
    );
  },
  //支付列表+优惠券
  get_paylist(params) {
    return axios.post(
      `/mobile/driving_passenger/pay_lists`,
      qs.stringify(params)
    );
  },
  //提交支付
  submit_pay(params) {
    return axios.post(`/mobile/driving_passenger/pay`, qs.stringify(params));
  },
  apply_invoice(params) {
    return axios.post(
      `/mobile/driving_passenger/invoice`,
      qs.stringify(params)
    );
  },
  add_invoice(params) {
    return axios.post(
      `/mobile/driving_passenger/invoice_add`,
      qs.stringify(params)
    );
  },
  get_invoicelist(params) {
    return axios.post(
      `/mobile/driving_passenger/invoice_lists`,
      qs.stringify(params)
    );
  },
  position_info(params) {
    return axios.post(`/mobile/driving/position_info`, qs.stringify(params));
  },
  submit_motor_comment(params) {
    return axios.post(
      `/mobile/driving_passenger/comment `,
      qs.stringify(params)
    );
  },
  //包时段列表
  get_user_packagelist(params) {
    return axios.post(
      `/mobile/driving_passenger/package_lists`,
      qs.stringify(params)
    );
  },
  //包时段入单
  add__user_package(params) {
    return axios.post(
      `/mobile/driving_passenger/package_order`,
      qs.stringify(params)
    );
  },
  //订单是否支付成功
  get_check_success(params) {
    return axios.post(
      `/mobile/driving_passenger/success`,
      qs.stringify(params)
    );
  },
  reminders_money(params) {
    return axios.post(`/mobile/driving/press`, qs.stringify(params));
  },
  get_motortasklist(params) {
    return axios.post(`/mobile/driving/task_lists`, qs.stringify(params));
  },
  get_motortaskdetail(params) {
    return axios.post(`/mobile/driving/task_info`, qs.stringify(params));
  },
  get_motortaskreceive(params) {
    return axios.post(`/mobile/driving/receive_task`, qs.stringify(params));
  },
  get_waterlist(params) {
    return axios.post(`/mobile/driving/driving_water`, qs.stringify(params));
  },

  edit_userinfo(params) {
    return axios.post(`/mobile/driving/saveedit`, qs.stringify(params));
  },

  get_captainapply(params) {
    return axios.post(`/mobile/driving_captain/index`, qs.stringify(params));
  },
  submit_captainapply(params) {
    return axios.post(`/mobile/driving_captain/apply`, qs.stringify(params));
  },
  rejection_order(params) {
    return axios.post(`/mobile/driving/rejection_order`, qs.stringify(params));
  },
  get_agent_waterlist(params) {
    return axios.post(
      `/mobile/driving_agent/driving_water`,
      qs.stringify(params)
    );
  },
  menuhall_reject(params) {
    return axios.post(`/mobile/driving/refuse_order`, qs.stringify(params));
  },
  //司机管理
  get_agent_employee_lists(params) {
    return axios.post(
      `/mobile/driving_agent/employee_lists`,
      qs.stringify(params)
    );
  },
  //团队长管理
  get_agent_captain_lists(params) {
    return axios.post(
      `/mobile/driving_agent/captain_lists`,
      qs.stringify(params)
    );
  },
  //乘客管理
  get_agent_passenger_lists(params) {
    return axios.post(
      `/mobile/driving_agent/passenger_lists`,
      qs.stringify(params)
    );
  },

  get_agent_data(params) {
    return axios.post(`/mobile/driving_agent/statistics`, qs.stringify(params));
  },
  get_agent_lookmotor(params) {
    return axios.post(
      `/mobile/driving_agent/driving_statistics`,
      qs.stringify(params)
    );
  },

  submit_motor_leader(params) {
    return axios.post(`/mobile/driving/add_report`, qs.stringify(params));
  },
  //团队长管理司机
  leader_employee_lists(params) {
    return axios.post(
      `/mobile/driving_captain/employee_lists`,
      qs.stringify(params)
    );
  },
  //团队长管理司机数据
  leader_statistics_data(params) {
    return axios.post(
      `/mobile/driving_captain/driving_statistics`,
      qs.stringify(params)
    );
  },
  driver_text(params) {
    return axios.post(`/mobile/driving/text`, qs.stringify(params));
  },
  edit_trajectory(params) {
    return axios.post(`/mobile/driving/trajectory_edit`, qs.stringify(params));
  },
  get_trajectory(params) {
    return axios.post(`/mobile/driving/trajectory_info`, qs.stringify(params));
  },
  get_new_reg(params) {
    return axios.post(`/mobile/qr/new_reg`, qs.stringify(params));
  },

  agent_editdriver(params) {
    return axios.post(
      `/mobile/driving_agent/driving_edit`,
      qs.stringify(params)
    );
  },

  agent_no_online(params) {
    return axios.post(
      `/mobile/driving_agent/go_off_work`,
      qs.stringify(params)
    );
  },
  agent_order_driver(params) {
    return axios.post(`/mobile/driving_agent/order_pd`, qs.stringify(params));
  },

  //开票订单列表
  get_invoice_order(params) {
    return axios.post(
      `/mobile/driving_passenger/invoice_driver_order_lists`,
      qs.stringify(params)
    );
  },
  //开票申请的金额
  get_invoice_money(params) {
    return axios.post(
      `/mobile/driving_passenger/invoice`,
      qs.stringify(params)
    );
  },
  //提交申请开票
  submit_invoice_money(params) {
    return axios.post(
      `/mobile/driving_passenger/invoice_add`,
      qs.stringify(params)
    );
  },
  //发票历史 下拉加载
  get_invoice_list(params) {
    return axios.post(
      `/mobile/driving_passenger/invoice_lists`,
      qs.stringify(params)
    );
  },
  //开票详情
  get_invoice_detail(params) {
    return axios.post(
      `/mobile/driving_passenger/invoice_lists_info`,
      qs.stringify(params)
    );
  },
  get_user_maplist2(params) {
    return axios.post(
      `/mobile/driving_agent/driving_lists`,
      qs.stringify(params)
    );
  },
};

export default getDriver;
