import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      meta: {
        keepAlive: true,
        // keepAlive:true,uth: true, //需要登录
      },
      component: () => import(/*webpackPrefetch:true */ "@/views/Index2"),
    },
    {
      path: "/index",
      meta: {
        keepAlive: true,
        // keepAlive:true,uth: true, //需要登录
      },
      component: () => import(/*webpackPrefetch:true */ "@/views/Index2"),
    },
    {
      path: "/star",
      meta: {
        keepAlive: true,
        uth: true, //需要登录
        tab: true,
      },
      component: () => import(/*webpackPrefetch:true */ "@/views/Index"),
    },
    // {
    //   path: '/login',
    //   name: 'logins',
    //   component: resolve => require(['@/views/Login'], resolve)
    // },
    {
      path: "/login",
      name: "logins",
      component: (resolve) => require(["@/views/new_login"], resolve),
    },
    {
      path: "/bind",
      name: "bind",
      component: (resolve) =>
        require(["@/components/page/login/bind"], resolve),
    },
    {
      path: "/wxlogin",
      name: "wx",
      component: (resolve) => require(["@/views/WxLogin"], resolve),
    },
    {
      path: "/binding",
      name: "binding",
      component: (resolve) =>
        require(["@/components/page/binding_phone"], resolve),
    },
    {
      path: "/page/applets",
      name: "applets",
      component: (resolve) =>
        require(["@/components/login/applets.vue"], resolve),
    },
    {
      path: "/dz",
      name: "dz",
      meta: {
        keepAlive: true,
        // uth: true, //需要登录
      },
      component: (resolve) => require(["@/views/Dz"], resolve),
      children: [
        {
          //会员中心
          path: "dz_index",
          name: "dz_index",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/dz/dz_index"], resolve),
        },
        {
          path: "dz_details",
          name: "dz_details",
          meta: {
            keepAlive: true,
            // uth: true, //需要登录
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/dz/dz_details"], resolve),
        },
        {
          path: "dz_search",
          name: "dz_search",
          meta: {
            keepAlive: true,
            // uth: true, //需要登录
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/dz/dz_search"], resolve),
        },
        {
          path: "supplier_shop_more",
          name: "supplier_shop_more",
          meta: {
            keepAlive: true,
            uth: false, //需要登录
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/dz/supplier_shop_more"], resolve),
        },     
        {
          path: "dz_money_more",
          name: "dz_money_more",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/dz/dz_money_more"], resolve),
        },  
        {
          path: "dz_abbot_detail",
          name: "dz_abbot_detail",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/dz/dz_abbot_detail"], resolve),
        }, 
        {
          path: "dz_information",
          name: "dz_information",
          meta: {
            keepAlive: true,
            // uth: true, //需要登录
            // tab: true,
          },
          component: (resolve) =>
            require(["@/components/dz/dz_information"], resolve),
        }, 
      ],
    },
    {
      path: "/member",
      name: "members",
      meta: {
        keepAlive: true,
        uth: true, //需要登录
      },
      component: (resolve) => require(["@/views/Member"], resolve),
      children: [
        {
          //会员中心
          path: "member",
          name: "member",
          meta: {
            keepAlive: true,
            // uth: true, //需要登录
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/member/member"], resolve),
        },
        {
          path: "myshare",
          name: "myshare",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/member/myshare"], resolve),
        },
        {
          path: "ewm",
          name: "ewm",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/member/ewm/ewm"], resolve),
        },
        //微店
        {
          path: "store",
          name: "member_store",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
            tab: false,
          },
          component: (resolve) =>
            require(["@/components/member/store/store_index"], resolve),
        },
        {
          path: "store/myshop",
          name: "store_myshop",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/member/store/store_shop.vue"], resolve),
        },
        {
          path: "store/manger",
          name: "store_manger",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/member/store/store_manger.vue"], resolve),
        },
        {
          path: "store/setting",
          name: "store_setting",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/member/store/store_setting.vue"], resolve),
        },
        {
          path: "store/hot", //精选商品
          name: "store_hot",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/member/store/store_hot.vue"], resolve),
        },
        {
          path: "turntable", //精选商品
          name: "turntable",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/member/turntable.vue"], resolve),
        },
      ],
    },

    {
      path: "/setting",
      name: "settings",
      meta: {
        keepAlive: true,
        uth: true, //需要登录
      },
      component: (resolve) => require(["@/views/Setting"], resolve),
      children: [
        {
          path: "setting",
          name: "setting",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/setting"], resolve),
        },
        {
          path: "myinfo",
          name: "myinfo",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/myinfo"], resolve),
        },
        {
          path: "alpaywx",
          name: "alpaywx",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/alpaywx"], resolve),
        },
        {
          path: "alpaysetting",
          name: "alpaySetting",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/alpaySetting"], resolve),
        },
        {
          path: "realname",
          name: "realname",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/realname"], resolve),
        },
        {
          path: "face",
          name: "face",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/face.vue"], resolve),
        },
        {
          path: "myprofit",
          name: "myprofit",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/myprofit"], resolve),
        },
        {
          path: "pay_password",
          name: "pay_password",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/pay_password"], resolve),
        },
        {
          path: "skzh",
          name: "skzh",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/skzh"], resolve),
        },
        {
          path: "information",
          name: "information",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/information"], resolve),
        },
        {
          path: "addAddres",
          name: "addAddres",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/addAddres"], resolve),
        },
        {
          path: "map",
          name: "map_address",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/setting/map_address.vue"], resolve),
        },
      ],
    },
    {
      path: "/im",
      name: "Im",
      meta: {
        keepAlive: true,
        uth: true, //需要登录
      },
      component: (resolve) => require(["@/views/Im"], resolve),
      children: [
        {
          path: "imindex",
          name: "imindex",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
            tab: true,
          },
          component: (resolve) => require(["@/components/im/imindex"], resolve),
        },
        {
          path: "mes",
          name: "mes",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) => require(["@/components/im/mes"], resolve),
        },
        {
          path: "search",
          name: "imsearch",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/im/im_index_con/search"], resolve),
        },
        {
          path: "uplateteam",
          name: "uplateteam",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/im/team/uplateTeam"], resolve),
        },
        {
          path: "uplateteam2",
          name: "uplateTeam_copy",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/im/team/uplateTeam copy"], resolve),
        },
        {
          path: "kf",
          name: "kf",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
            tab: true,
          },
          component: (resolve) => require(["@/components/im/kf"], resolve),
        },

      ],
    },
    {
      path: "/shop",
      name: "shops",
      meta: {
        // keepAlive:true,uth: true, //需要登录
      },
      component: (resolve) => require(["@/views/Shop"], resolve),
      children: [
        {
          path: "index",
          name: "shopindex",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) => require(["@/components/shop/index"], resolve),
        },
        {
          path: "shopcate",
          name: "shopcate",
          meta: {
            tab: true,
            // keepAlive:true,uth: true,
          },
          component: (resolve) =>
            require(["@/components/shop/shopproducecate"], resolve),
        },
        {
          path: "shopsearch",
          name: "shopsearch",
          meta: {
            // keepAlive:true,uth: true,
          },
          component: (resolve) =>
            require(["@/components/shop/shopsearch"], resolve),
        },
        {
          path: "shopall",
          name: "shopall",
          meta: {
            tab: true,
            // keepAlive:true,uth: true,
          },
          component: (resolve) =>
            require(["@/components/shop/shopAll"], resolve),
        },
        {
          path: "shoplist",
          name: "shoplist",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/shop/shoplist"], resolve),
        },
        {
          path: "shopdetails",
          name: "shopdetails",
          meta: {
            // keepAlive:true,uth: true,
            uth: false,
          },
          component: (resolve) =>
            require(["@/components/shop/shopdetails"], resolve),
        },
        {
          path: "productdetails",
          name: "productdetails",
          meta: {
            // keepAlive:true,uth: true,
          },
          component: (resolve) =>
            require(["@/components/shop/productdetails"], resolve),
        },
        {
          path: "shopcomment",
          name: "shopcomment",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/shop/shopcomment"], resolve),
        },
        {
          path: "shopcard",
          name: "shopcard",
          meta: {
            uth: true,
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/shop/shopcard"], resolve),
        },
        {
          path: "shopreview",
          name: "shopreview",
          meta: {
            uth: false,
          },
          component: (resolve) =>
            require(["@/components/shop/shopreview/shopreview"], resolve),
        },
        {
          path: "shopcoupon", //优惠券
          name: "shopcoupon",
          meta: {
            uth: false,
          },
          component: (resolve) =>
            require(["@/components/shop/shop_coupon"], resolve),
        },
        {
          path: "couponmark", //券集市
          name: "shop_coupon_mark",
          meta: {
            uth: false,
          },
          component: (resolve) =>
            require(["@/components/shop/shop_coupon_mark"], resolve),
        },
        {
          path: "shopcollect", //商品店铺收藏
          name: "shop_collect",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/shop_collect"], resolve),
        },
        {
          path: "integral", //积分商城
          name: "integral_shop",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/integral/integral_shop"], resolve),
        },
        {
          path: "limit", //限时特惠
          name: "limit_time",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/limit/limit_time"], resolve),
        },
        {
          path: "cut", //砍价页面
          name: "cut_page",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/cut/cut_page"], resolve),
        },
        {
          path: "cut/detail", //砍价页面
          name: "cut_detail",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/cut/cut_detail"], resolve),
        },
        {
          path: "shoptoday", //砍价页面
          name: "newDay",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/newDay/newDay"], resolve),
        },
        {
          path: "presale", //预售页面
          name: "presale_page",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/presale/presale_page.vue"], resolve),
        },
        {
          path: "write", //预售页面
          name: "write_page",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/write-off/write.vue"], resolve),
        },
        {
          path: "shopslide",
          name: "shop_slide",
          meta: {
            keepAlive: true,
            tab: true,
            // keepAlive:true,uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/shop_slide.vue"], resolve),
        },
        {
          path: "quality",
          name: "quality",
          meta: {
            keepAlive: true,
            // keepAlive:true,uth: true, //需要登录  quality 品控师
          },
          component: (resolve) =>
            require(["@/components/shop/quality/quality.vue"], resolve),
        },
        {
          path: "reserve", //预售页面
          name: "shop_reserve",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/reserve/shop_reserve.vue"], resolve),
        },
        {
          path: "cateimg", //分类
          name: "shop-cate-img",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/shop-cate-img.vue"], resolve),
        },
        {
          path: "buyers", //买家秀
          name: "buyers_show",
          meta: {
            keepAlive: true,
            // uth: true //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/buyers/buyers.vue"], resolve),
        },
        {
          path: "yy_shop",
          name: "yuyue_shops",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/yuyue/yuyue_shops.vue"], resolve),
        },
        {
          path: "auctionlist",
          name: "auction_page",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/auction/list/auction.vue"], resolve),
        },
        {
          path: "auctionorder",
          name: "auctionorder",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/auction/order/orderlist.vue"], resolve),
        },
        {
          path: "auctionpeople",
          name: "auctionpeople",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require([
              "@/components/shop/auction/bidpeople/bidpeople.vue",
            ], resolve),
        },
        {
          path: "buyers_add", //随手拍
          name: "buyers_add",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/buyers/buyers_add.vue"], resolve),
        },
        {
          path: "zero", //零元购
          name: "zero",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/shop/zero_list.vue"], resolve),
        },
      ],
    },
    {
      path: "/order",
      name: "orders",
      meta: {
        keepAlive: true,
        uth: true, //需要登录
      },
      component: (resolve) => require(["@/views/Order"], resolve),
      children: [
        {
          path: "addorder",
          name: "addorder",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/addOrder/addOrder"], resolve),
        },
        {
          path: "payorder",
          name: "payorder",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/payOrder/payOrder"], resolve),
        },
        {
          path: "paydetails",
          name: "paydetails",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/payOrder/payDetails"], resolve),
        },
        {
          path: "orderlist",
          name: "orderlist",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/orderList/orderList"], resolve),
        },
        {
          path: "orderdetails",
          name: "orderdetails",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/orderDetails/orderDetails"], resolve),
        },
        {
          path: "maildetails",
          name: "maildetails",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/mailDetails/mailDetails"], resolve),
        },
        {
          path: "orderrefund",
          name: "orderrefund",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/orderRefund/orderRefund"], resolve),
        },
        {
          path: "presale",
          name: "presale_order",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/presaleorder/presale_order"], resolve),
        },
        {
          path: "orderwrite",
          name: "orderwrite",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/order-write/order-write"], resolve),
        },
        {
          path: "mention",
          name: "mention",
          meta: {
            keepAlive: true,
            tab: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/mention/mention"], resolve),
        },
        {
          path: "mention/page",
          name: "mention_page",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/mention/mentionpage.vue"], resolve),
        },
        {
          path: "mention/apply",
          name: "mention_apply",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/mention/apply.vue"], resolve),
        },
        {
          path: "gb_order",
          name: "gb_order",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/groupbuy/groupbuy.vue"], resolve),
        },
        {
          path: "tuhu_redbag",
          name: "tuhu_redbag",
          meta: {
            keepAlive: true,
            uth: true,
          },
          component: (resolve) =>
            require(["@/components/order/payOrder/tuhu_redbag"], resolve),
        },
      ],
    },

    {
      path: "/pay",
      name: "Pay",
      meta: {
        keepAlive: true,
        uth: true,
      },
      component: (resolve) => require(["@/views/Pay"], resolve),
      children: [
        {
          path: "recharge", //充值页面
          name: "recharge",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/pay/recharge"], resolve),
        },
        {
          path: "paydetails", //充值页面
          name: "payDetails",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/pay/paydetails"], resolve),
        },
        {
          path: "withdraw", //充值页面
          name: "withdraw",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/pay/withdraw"], resolve),
        },
        // {
        //   path: 'income', //选择提现账户页面
        //   name: 'income',
        //   meta: {
        //     keepAlive: true,
        //     uth: true //需要登录
        //   },
        //   component: resolve => require(['@/components/pay/income'], resolve)
        // },
        {
          path: "income", //选择提现账户页面
          name: "income",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/pay/income1"], resolve),
        },
        {
          path: "record",
          name: "record",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) => require(["@/components/pay/record"], resolve),
        },
        {
          path: "life",
          name: "life_recharge",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/pay/life/life_recharge"], resolve),
        },
        {
          path: "life/record",
          name: "life_record",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/pay/life/life_record"], resolve),
        },
        {
          path: "life/detail",
          name: "life_paydetail",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/pay/life/life_paydetail"], resolve),
        },
        {
          path: "life/defray",
          name: "life_pay",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/pay/life/life_pay"], resolve),
        },
        {
          path: "margin/recharge",
          name: "marginrecharge",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require([
              "@/components/shop/auction/recharge/recharge.vue",
            ], resolve),
        },
      ],
    },
    {
      path: "/page",
      name: "Page",
      meta: {
        // keepAlive:true,
        uth: false,
      },
      component: () => import(/*webpackPrefetch:true */ "@/views/Page"),
      children: [
        {
          path: "index", //新的模板首页
          name: "pageindex",
          meta: {
            keepAlive: true,
            uth: false,
            tab: true,
          },
          component: (resolve) => require(["@/components/page/index"], resolve),
        },
        {
          path: "vip", //充值页面
          name: "vip",
          meta: {
            keepAlive: true,
            uth: false,
            tab: true,
          },
          component: (resolve) => require(["@/components/page/vip"], resolve),
        },
        {
          path: "notice", //充值页面
          name: "notice",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/page/notice"], resolve),
        },
        {
          path: "activemsg", //充值页面
          name: "activemsg",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/page/activemsg"], resolve),
        },
        {
          path: "sign", //充值页面
          name: "sign",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) => require(["@/components/page/sign"], resolve),
        },
        {
          path: "member_shop", //会员商城页面
          name: "member_shop",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/page/member_shop"], resolve),
        },
        {
          path: "complaint", //投诉建议页面
          name: "complaint",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/page/complaint"], resolve),
        },
        {
          path: "level",
          name: "level",
          meta: {
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/page/grade/level"], resolve),
        },
        {
          path: "point",
          name: "point",
          meta: {
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/page/grade/point"], resolve),
        },
        {
          path: "serve",
          name: "applets_service",
          meta: {
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/login/service.vue"], resolve),
        },
        {
          path: "scan",
          name: "pagescan",
          meta: {
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/page/scan.vue"], resolve),
        },
        {
          path: "now_address",
          name: "now_address",
          meta: {
            keepAlive: true,
            uth: false,
            tab: false,
          },
          component: (resolve) =>
            require(["@/components/page/now_address.vue"], resolve),
        },
        {
          path: "team_leader",
          name: "team_leader",
          meta: {
            keepAlive: true,
            uth: false,
            tab: false,
          },
          component: (resolve) =>
            require(["@/components/page/team_leader.vue"], resolve),
        },
        {
          path: "clear",
          name: "clear",
          meta: {
            keepAlive: true,
            uth: false,
            tab: false,
          },
          component: (resolve) =>
            require(["@/components/page/clear/clear.vue"], resolve),
        },
        {
          path: "groupbuy",
          name: "groupbuy",
          meta: {
            keepAlive: true,
            uth: false,
            tab: true,
          },
          component: (resolve) =>
            require(["@/components/page/groupbuy"], resolve),
        },
        {
          path: "text",
          name: "text",
          meta: {
            keepAlive: true,
            uth: false,
            tab: true,
          },
          component: (resolve) => require(["@/components/page/text"], resolve),
        },
        {
          path: "footprint",
          name: "footprint",
          meta: {
            keepAlive: true,
            uth: false,
            // tab: true,
          },
          component: (resolve) =>
            require(["@/components/page/footprint/footprint"], resolve),
        },
        {
          path: "record",
          name: "pagerecord",
          meta: {
            keepAlive: true,
            uth: false,
          },
          component: (resolve) =>
            require(["@/components/page/record/record.vue"], resolve),
        },


        {
          path: "my_joborder", //我的工单
          name: "my_joborder",
          meta: {
            keepAlive: false,
            uth: false,
            tab: false,
          },
          component: (resolve) =>
            require(["@/components/page/my_job_order.vue"], resolve),
        },

      ],
    },
    {
      path: "/wx_phone",
      name: "wx_phone",
      component: (resolve) => require(["@/components/login/wx_phone"], resolve),
    },
    {
      path: "/useragreement", //注册协议
      name: "useragreement",
      component: (resolve) =>
        require(["@/components/currency/userAgreement/userAgreement"], resolve),
    },
    {
      path: "/toappupload",
      uth: false, //需要登录
      name: "ToAppUpload",
      component: (resolve) =>
        require(["@/components/login/ToAppUpload"], resolve),
    },
    {
      path: "/appdown",
      uth: false, //需要登录
      name: "appdown",
      component: (resolve) =>
        require(["@/components/login/appdown.vue"], resolve),
    },
    {
      path: "/supplier",
      name: "Supplier",
      meta: {
        keepAlive: true,
        uth: false,
      },
      component: (resolve) => require(["@/views/Supplier"], resolve),
      children: [
        {
          path: "supplierindex",
          name: "SupplierIndex",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require([
              "@/components/supplier/supplierIndex/SupplierIndex",
            ], resolve),
        },
        {
          path: "supplierdetails",
          name: "supplierdetails",
          meta: {
            keepAlive: true,
            uth: false, //需要登录
          },
          component: (resolve) =>
            require([
              "@/components/supplier/supplierDetails/SupplierDetails",
            ], resolve),
        },
        {
          path: "supplierapply",
          name: "supplierapply",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require([
              "@/components/supplier/supplierApply/SupplierApply",
            ], resolve),
        },
        {
          path: "suppliercomplaint",
          name: "SupplierComplaint",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require([
              "@/components/supplier/supplierComplaint/SupplierComplaint",
            ], resolve),
        },
        {
          path: "suppliershoplist",
          name: "SupplierShopList",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require([
              "@/components/supplier/supplierShopList/SupplierShopList",
            ], resolve),
        },
        {
          path: "supplierorder",
          name: "supplierOrder",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require([
              "@/components/supplier/supplierOrder/SupplierOrder",
            ], resolve),
        },
        {
          path: "suppliershop",
          name: "suppliershop",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require([
              "@/components/supplier/supplierShop/SupplierShop",
            ], resolve),
        },
        {
          path: "suppliershopdetails",
          name: "supplier-shop-details",
          meta: {
            keepAlive: true,
            uth: false, //需要登录
            tab: true,
          },
          component: (resolve) =>
            require([
              "@/components/supplier/supplier-shop-details/supplier-shop-details",
            ], resolve),
        },
        {
          path: "shops",
          name: "shops-con",
          meta: {
            keepAlive: true,
            tab: true,
            uth: false, //不需要登录
          },
          component: (resolve) =>
            require(["@/components/supplier/shops/shops"], resolve),
        },
        {
          path: "new-shops",
          name: "new-shops-con",
          meta: {
            keepAlive: true,
            tab: true,
            uth: false, //不需要登录
          },
          component: (resolve) =>
            require(["@/components/supplier/new-shops/new-shops"], resolve),
        },
        {
          path: "extract",
          name: "extract-con",
          meta: {
            keepAlive: true,
            tab: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require(["@/components/supplier/extract/extract"], resolve),
        },
        {
          path: "orderreturn",
          name: "orderreturn",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require([
              "@/components/supplier/orderreturn/orderreturn.vue",
            ], resolve),
        },
        {
          path: "returndetail",
          name: "returndetail",
          meta: {
            keepAlive: true,
            uth: true, //需要登录
          },
          component: (resolve) =>
            require([
              "@/components/supplier/orderreturn/returndetail.vue",
            ], resolve),
        },
      ],
    },
    {
      path: "*",
      redirect: "/",
    },
    {
      path: "/ce",
      name: "ce-shi",
      meta: {
        keepAlive: true,
        uth: false,
      },
      component: (resolve) => require(["@/views/Ce"], resolve),
    },
    {
      path: "/ce2",
      meta: {
        keepAlive: true,
        uth: false,
      },
      component: (resolve) => require(["@/views/Ce2"], resolve),
    },
    {
      path: "/ce3",
      meta: {
        keepAlive: true,
        uth: false,
      },
      component: (resolve) => require(["@/views/Ce3"], resolve),
    },
    {
      path: "/ce4",
      meta: {
        keepAlive: true,
        uth: false,
      },
      component: (resolve) => require(["@/views/Ce4"], resolve),
    },
    {
      path: "/page/buddhistlamp",
      name:'lampindex',
      meta: {
        keepAlive: true,
        uth: false,
      },
      component: (resolve) => require(["@/components/buddhistlamp/index.vue"], resolve),
    },
    {
      path: "/lampdetail",
      name:'lampdetail',
      meta: {
        keepAlive: true,
        uth: false,
      },
      component: (resolve) => require(["@/components/buddhistlamp/detail.vue"], resolve),
    },
    {
      path: "/lamppay",
      name:'lamppay',
      meta: {
        keepAlive: true,
        uth: false,
      },
      component: (resolve) => require(["@/components/buddhistlamp/pay.vue"], resolve),
    },
    {
      path: "/lampposition",
      name:'lampposition',
      meta: {
        keepAlive: true,
        uth: false,
      },
      component: (resolve) => require(["@/components/buddhistlamp/position.vue"], resolve),
    },
    {
      path: "/page/buddhistlamp/order",
      name:'lamporder',
      meta: {
        keepAlive: true,
        uth: false,
      },
      component: (resolve) => require(["@/components/buddhistlamp/order.vue"], resolve),
    },

  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        var scrollClass = document.querySelector(".scrollNum");
        if (scrollClass) {
          from.meta.savedPosition = scrollClass.scrollTop;
        }
      }
      // return {
      //   x: 0,
      //   y: to.meta.savedPosition || 0,
      // };
    }
  },
});
