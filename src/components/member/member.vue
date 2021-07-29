<template>
  <div class="member_con" id="member">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit"
        :class="{showMesc:listProduct.length==0 || flag.recommend.data == 'false'}" class="scol member-mescroll">
      <div class="bo_xhy_div1" :style="'background-image:url(' + (info.piclink?$fnc.getImgUrl(info.piclink):'') +')'">
        <div class="bo_xhy_div2">
          <router-link to="/page/notice" hover-class="none" class="sms_body" v-if="flag.top.data.sms">
            <img src="../../assets/img/member/xxx.png" alt class="bo_xhy_img2" />
            <span class="sms_dot" v-if="info.is_view && info.is_view !=0">{{info.is_view}}</span>
          </router-link>
          <router-link to="/setting/setting" v-if="flag.top.data.sz">
            <img src="../../assets/img/member/sz.png" alt class="bo_xhy_img1" />
          </router-link>
          <a @click="toIm" v-if="flag.top.data.kf">
            <img src="../../assets/img/member/kf.png" alt class="bo_xhy_img1" />
            <span class="sms_dot_kf" v-if="kfUnreadCount && kfUnreadCount > 0">{{kfUnreadCount}}</span>
          </a>
        </div>
        <div class="bo_xhy_div3 member_text_con">
          <div class="f_l avatarinfo">
            <img :src="$fnc.getImgUrl(info.avatar,'sex') || (info.sex==2? require('../../assets/img/member/sex2.png'): require('../../assets/img/member/sex1.png'))"
                alt class="bo_xhy_img3" />
            <!-- <p class="bo_xhy_p1">
              {{info.rating==1 && info.coin_rating>1?info.coin_rating_cn:info.rating_cn}}
            </p> -->
          </div>

          <div class="f_l">
            <!-- {{flag.top.data.tjr}} -->
            <!-- usernickname -->
            <div class="bo_xhy_li1">{{info.nickname || '小施主'}}</div>
            <div class="bo_xhy_li2" v-if="flag.top.data.tjr && uidNick">
              <span class="bo_xhy_span1">功德传播人：{{uidNick}}</span>
            </div>
            <!-- <div class="bo_xhy_li5" v-if="info.rating_piclink">
              <img v-if="info.rating_piclink > 5 " :src="require('@/assets/img/member/dj/star_5.gif')" />
              <img v-else :src="require('@/assets/img/member/dj/star_'+info.rating_piclink+'.gif')" />
            </div> -->
          </div>
        </div>
        <div class="bo_xhy_div8" @click="$router.push('/member/ewm')" v-if="flag.top.data.hym">
          <div class="fx">
            <div class="fx">
              <img src="@/assets/img/member/dj/huang.png" />
              <span>功德传播码</span>
              <span></span>
              <span>{{flag.top.title1}}</span>
            </div>
            <i class="fa fa-qrcode"></i>
          </div>
        </div>
      </div>
      <!-- {{$store.state.config.plugin.xxmk.is_open}} -->
      <div class="self" v-if="info.extract_ar && $store.state.config.plugin.xxmk.is_open == 1">
        <div class="head">
          <span>我的自提点</span>
          <span @click="$router.push('/page/team_leader?redirect=/member/member')">
            切换自提点
            <van-icon name="arrow" class="arrow" />
          </span>
          <div class="tag"></div>
        </div>
        <div class="container">
          <div>
            <img :src="info.extract_ar.piclink || require('@/assets/img/huolongguo/person.png')" alt />
          </div>
          <div>
            <p>
              <span>{{info.extract_ar.title}}</span>
              <span
                  v-if="info.extract_ar.distance && info.extract_ar.distance>0">距离{{info.extract_ar.distance>=1000?info.extract_ar.distance/1000+'公里':info.extract_ar.distance+'米'}}</span>
            </p>
            <p>团长：{{info.extract_ar.name}}</p>
            <p>{{info.extract_ar.province}}{{info.extract_ar.city}}{{info.extract_ar.area}}{{info.extract_ar.add}}</p>
            <p class="button">
              <span @click.prevent="$fnc.tel(info.extract_ar.tel)">门店电话</span>
              <span @click="toDh(info.extract_ar)">门店导航</span>
            </p>
          </div>
        </div>
        <div class="fx foot">
          <p>
            <van-icon name="info-o" color="#0C7EE7" />
          </p>
          <p>如果您购买的商品有任何问题，请直接联系门店处理！</p>
        </div>
      </div>

      <div class="bo_huiyuan_div8" v-if="JSON.stringify(flag.my_order.data)!='{}'">
        <div class="bo_xhy_div5">
          <router-link to="/order/orderlist">
            <span class="f_l">我的善缘</span>
            <span class="f_r bo_xhy_span2">全部善缘
              <van-icon name="arrow" />
            </span>
          </router-link>
        </div>
        <ul>
          <li class="bo_huiyuan_li1" style="padding:0 " v-if="flag.my_order.data.qs && $store.state.config.plugin.qsps.is_open==1">
            <router-link to="/order/orderlist?status=骑手配送">
              <div class="order_num" style="    height: 45px;">
                <img src="../../assets/img/member/member_menu6.png" class="bo_huiyuan_img6" alt />
                <span v-if="info.my_order_num_7>0">{{info.my_order_num_7 || ''}}</span>
              </div>
              <div class="bo_huiyuan_div9">{{flag.my_order.data.qs}}</div>
            </router-link>
          </li>
          <li class="bo_huiyuan_li1" style="padding:0 " v-if="flag.my_order.data.dfk">
            <router-link to="/order/orderlist?status=未支付">
              <div class="order_num" style="    height: 45px;">
                <img src="../../assets/img/member/member_menu1.png" class="bo_huiyuan_img6" alt />
                <span v-if="info.my_order_num_1>0">{{info.my_order_num_1}}</span>
              </div>
              <div class="bo_huiyuan_div9">{{flag.my_order.data.dfk}}</div>
            </router-link>
          </li>
          <li class="bo_huiyuan_li1" style="padding: 0 " v-if="flag.my_order.data.dfh">
            <router-link to="/order/orderlist?status=已支付">
              <div class="order_num" style="    height: 45px;">
                <img src="../../assets/img/member/member_menu5.png" class="bo_huiyuan_img6" alt />
                <span v-if="info.my_order_num_2>0">{{info.my_order_num_2}}</span>
              </div>
              <div class="bo_huiyuan_div9">{{flag.my_order.data.dfh}}</div>
            </router-link>
          </li>
          <li class="bo_huiyuan_li1" style="padding: 0 " v-if="flag.my_order.data.dsh">
            <router-link to="/order/orderlist?status=已发货">
              <div class="order_num" style="    height: 45px;">
                <img src="../../assets/img/member/member_menu2.png" class="bo_huiyuan_img6" alt />
                <span v-if="info.my_order_num_3>0">{{info.my_order_num_3}}</span>
              </div>
              <div class="bo_huiyuan_div9">{{flag.my_order.data.dsh}}</div>
            </router-link>
          </li>
          
          <li class="bo_huiyuan_li1" style="padding:0 " v-if="flag.my_order.data.dpj">
            <router-link to="/order/orderlist?status=待评价">
              <div class="order_num" style="    height: 45px;">
                <img src="../../assets/img/member/member_menu3.png" class="bo_huiyuan_img6" alt />
                <span v-if="info.my_order_num_4>0">{{info.my_order_num_4}}</span>
              </div>
              <div class="bo_huiyuan_div9">{{flag.my_order.data.dpj}}</div>
            </router-link>
          </li>
           <li class="bo_huiyuan_li1" style="padding:0 " v-if="flag.my_order.data.dfk">
            <router-link to="/order/orderlist?status=已取消">
              <div class="order_num" style="    height: 45px;">
                <img src="../../assets/img/member/member_menu1.png" class="bo_huiyuan_img6" alt />
                <span v-if="info.my_order_num_1>0">{{info.my_order_num_8}}</span>
              </div>
              <div class="bo_huiyuan_div9">{{flag.my_order.data.yqx}}</div>
            </router-link>
          </li>
          <li class="bo_huiyuan_li1" style="padding: 0 " v-if="flag.my_order.data.sh">
            <router-link to="/order/orderlist?status=已退单">
              <div class="order_num" style="height: 45px;">
                <img src="../../assets/img/member/member_menu4.png" class="bo_huiyuan_img6" alt />
                <span v-if="info.my_order_num_5>0">{{info.my_order_num_5}}</span>
              </div>
              <div class="bo_huiyuan_div9">退换/售后</div>
            </router-link>
          </li>
          <li class="bo_huiyuan_li1" style="padding: 0 " v-if="flag.my_order.data.zt">
            <router-link to="/order/orderlist?status=用户自提">
              <div class="order_num" style="height: 45px;">
                <img src="../../assets/img/member/member_menu7.png" class="bo_huiyuan_img6" alt />
                <span v-if="info.my_order_num_6>0">{{info.my_order_num_6}}</span>
              </div>
              <div class="bo_huiyuan_div9">用户自提</div>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="bo_huiyuan_div19" v-if="JSON.stringify(flag.money.data)!='{}'">
        <div class="bo_xhy_div5">
          <span class="f_l">功德记录</span>
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item" v-if="flag.money.data.yr" style="width:33%;" @click="$router.push({path:'/pay/income',query:{iden:'money'}})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2" >{{$fnc.toFixedZ(info.money,2) }}</p>
              <p class="bo_xhy_p3">{{flag.money.data.yr}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.jf" style="width:33%;" @click="$router.push({path:'/pay/income',query:{iden:'integral'}})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2_dz">{{$fnc.toFixedZ(info.integral,0) }}</p>
              <p class="bo_xhy_p3">{{flag.money.data.jf}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.integrity" style="width:33%;"
              @click="$router.push({path:'/pay/income',query:{iden:'integrity'}})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2">{{$fnc.toFixedZ(info.integrity,2) }}</p>
              <p class="bo_xhy_p3">{{flag.money.data.integrity}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.yj" style="width:33%;" @click="$router.push({path:'/pay/income',query:{iden:'amount'}})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2">{{$fnc.toFixedZ(info.amount,2) }}</p>
              <p class="bo_xhy_p3">{{flag.money.data.yj}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.xlb" style="width:33%;" @click="$router.push({path:'/coin/coin'})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2">{{$fnc.toFixedZ(info.coin_storage+info.coin,2)}}</p>
              <p class="bo_xhy_p3">{{flag.money.data.xlb}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.xlbcc" style="width:33%;" @click="$router.push({path:'/coin/coin'})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2">{{$fnc.toFixedZ(info.coin_storage,2)}}</p>
              <p class="bo_xhy_p3">{{flag.money.data.xlbcc}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.xlbhd" style="width:33%;" @click="toXnb">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2">{{$fnc.toFixedZ(info.coin,2)}}</p>
              <p class="bo_xhy_p3">{{flag.money.data.xlbhd}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.weight" style="width:33%;"
              @click="$router.push({path:'/pay/income',query:{iden:'weight'}})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2">{{$fnc.toFixedZ(info.weight,2)}}</p>
              <p class="bo_xhy_p3">{{flag.money.data.weight}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.gold" style="width:33%;" @click="$router.push({path:'/pay/income',query:{iden:'gold'}})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2">{{$fnc.toFixedZ(info.gold,2)}}</p>
              <p class="bo_xhy_p3">{{flag.money.data.gold}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.supply" style="width:33%;"
              @click="$router.push({path:'/pay/income',query:{iden:'supply'}})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2">{{$fnc.toFixedZ(info.supply,2)}}</p>
              <p class="bo_xhy_p3">{{flag.money.data.supply}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.hyz" style="width:33%;" @click="$router.push({path:'/pay/income',query:{iden:'hyz'}})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2">{{$fnc.toFixedZ(info.hyz,2)}}</p>
              <p class="bo_xhy_p3">{{flag.money.data.hyz}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.gold_dj" style="width:33%;"
              @click="$router.push({path:'/pay/income',query:{iden:'gold_dj'}})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2">{{$fnc.toFixedZ(info.gold_dj,2)}}</p>
              <p class="bo_xhy_p3">{{flag.money.data.gold_dj}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.money.data.margin" style="width:33%;" @click="$router.push({path:'/pay/margin/recharge'})">
            <div class="bo_xhy_li3">
              <p class="bo_xhy_p2">{{$fnc.toFixedZ(info.margin,2)}}</p>
              <p class="bo_xhy_p3">{{flag.money.data.margin}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-for="(item,i) in info.member_tool" :key="i"  @click="toMenber(item.menu_link)">
            <div class="bo_xhy_li3">
              <img style="width: 30px;height: 30px;border-radius: 50%;margin-bottom:10px" v-lazy="item.menu_pic"  alt />
              <p class="bo_xhy_p3">{{item.menu_title}}</p>
            </div>
          </div>
          <!-- <div class="vip_tool_item" v-for="(item,i) in info.member_tool" :key="i" @click="toMenber(item.menu_link)">
            <div class="vip_tool_item_box">
              <img v-lazy="item.menu_pic" alt />
              <p>{{item.menu_title}}</p>
            </div>
          </div> -->
        </div>
      </div>

      <div class="bo_huiyuan_div19"
          v-if="flag.jpsc_order && JSON.stringify(flag.jpsc_order.data)!='{}' && $store.state.config.plugin.jpsc.is_open==1">
        <div class="bo_xhy_div5">
          <span class="f_l">竞拍订单</span>
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item " style="width:20%;position:relative" v-if="flag.jpsc_order.data.cpz"
              @click="$router.push({path:'/shop/auctionorder?status=0'})">
            <div class="vip_tool_item_box">
              <!-- 参拍中 -->
              <img src="./../../assets/img/member/cpz.png" alt />
              <span class="tool_tipnum" v-if="info.my_order_num_8>0">{{info.my_order_num_8}}</span>
              <p>{{flag.jpsc_order.data.cpz}}</p>
            </div>
          </div>
          <div class="vip_tool_item" style="width:20%" v-if="flag.jpsc_order.data.whp" @click="$router.push({path:'/shop/auctionorder?status=2'})">
            <div class="vip_tool_item_box">
              <!-- 未获拍 -->
              <img src="./../../assets/img/member/whp.png" alt />

              <p>{{flag.jpsc_order.data.whp}}</p>
            </div>
          </div>
          <div class="vip_tool_item" style="width:20%;position:relative" v-if="flag.jpsc_order.data.dzf"
              @click="$router.push('/order/orderlist?status=待支付')">
            <div class="vip_tool_item_box">
              <!-- 待支付 -->
              <img src="./../../assets/img/member/dzf.png" alt />
              <span class="tool_tipnum" v-if="info.my_order_num_9>0">{{info.my_order_num_9}}</span>
              <p>{{flag.jpsc_order.data.dzf}}</p>
            </div>
          </div>
          <div class="vip_tool_item" style="width:20%;position:relative" v-if="flag.jpsc_order.data.yhp"
              @click="$router.push('/order/orderlist?status=已获拍')">
            <div class="vip_tool_item_box">
              <!-- 已获拍 -->
              <img src="./../../assets/img/member/yhp.png" alt />
              <span class="tool_tipnum" v-if="info.my_order_num_10>0">{{info.my_order_num_10}}</span>
              <p>{{flag.jpsc_order.data.yhp}}</p>
            </div>
          </div>
          <div class="vip_tool_item" style="width:20%" v-if="flag.jpsc_order.data.ylp" @click="$router.push({path:'/shop/auctionorder?status=1'})">
            <div class="vip_tool_item_box">
              <!-- 已流拍 -->
              <img src="./../../assets/img/member/ylp.png" alt />
              <p>{{flag.jpsc_order.data.ylp}}</p>
            </div>
          </div>
        </div>
      </div>


      <div class="bo_huiyuan_div19" v-if="($store.state.config.plugin.nyffxt && $store.state.config.plugin.nyffxt.is_open==1) ||
                ($store.state.config.plugin.ypmk && $store.state.config.plugin.ypmk.is_open==1) ||
                ($store.state.config.plugin.xssj && $store.state.config.plugin.xssj.is_open==1)">
        <div class="bo_xhy_div5">
          <span class="f_l">内容付费模块</span>
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item" @click="$router.push({path:'/page/my_buy'}).catch(() => {})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/hotel/icon01.png" alt />
              <p>我购买的</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/page/my_collect'}).catch(() => {})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/hotel/icon02.png" alt />
              <p>我收藏的</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/page/my_browse'}).catch(() => {})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/hotel/icon03.png" alt />
              <p>我浏览的</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/page/my_follow'}).catch(() => {})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/hotel/icon04.png" alt />
              <p>我关注的</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bo_huiyuan_div19"
          v-if="flag.my_hotel && JSON.stringify(flag.my_hotel.data)!='{}' && $store.state.config.plugin.hotel && $store.state.config.plugin.hotel.is_open==1">
        <div class="bo_xhy_div5">
          <span class="f_l">我的酒店</span>
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item" v-if="flag.my_hotel.data.jddd" @click="$router.push({path:'/order/orderlist',query:{types:21}})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/hotel/icon01.png" alt />
              <p>{{flag.my_hotel.data.jddd}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.my_hotel.data.dzf" @click="$router.push({path:'/order/orderlist',query:{types:21,status:'未支付'}})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/hotel/icon02.png" alt />
              <span class="tool_tipnum" style="right:20px" v-if="info.my_order_num_14>0">{{info.my_order_num_14}}</span>
              <p>{{flag.my_hotel.data.dzf}}</p>
            </div>
          </div>
          <div class="vip_tool_item" style="position:relative" v-if="flag.my_hotel.data.drz"
              @click="$router.push({path:'/order/orderlist',query:{types:21,status:'已发货'}})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/hotel/icon03.png" alt />
              <span class="tool_tipnum" style="right:20px" v-if="info.my_order_num_15>0">{{info.my_order_num_15}}</span>
              <p>{{flag.my_hotel.data.drz}}</p>
            </div>
          </div>
          <div class="vip_tool_item" style="position:relative" v-if="flag.my_hotel.data.dpj"
              @click="$router.push({path:'/order/orderlist',query:{types:21,status:'待评价'}})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/hotel/icon04.png" alt />
              <span class="tool_tipnum" style="right:20px" v-if="info.my_order_num_16>0">{{info.my_order_num_16}}</span>
              <p>{{flag.my_hotel.data.dpj}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bo_huiyuan_div19" v-if="flag.sqwd && JSON.stringify(flag.sqwd.data)!='{}' && $store.state.config.plugin.sqwd.is_open==1 ">
        <div class="bo_xhy_div5">
          <span class="f_l">社群微店</span>
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item" v-if="flag.sqwd.data.wdwd" @click="$router.push({path:'/member/store',query:{mid:info.id}})">
            <div class="vip_tool_item_box">
              <!-- 我的微店-->
              <img src="./../../assets/img/member/store_1.png" alt />
              <p>我的微店</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.sqwd.data.glsp" @click="$router.push({path:'/member/store/myshop'})">
            <div class="vip_tool_item_box">
              <!-- 管理商品-->
              <img src="./../../assets/img/member/store_2.png" alt />
              <p>管理商品</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.sqwd.data.wdzl" @click="$router.push({path:'/member/store/setting'})">
            <div class="vip_tool_item_box">
              <!-- 微店设置-->
              <img src="./../../assets/img/member/store_3.png" alt />
              <p>微店设置</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.sqwd.data.gldd" @click="$router.push({path:'/order/orderlist?mid='+info.id})">
            <div class="vip_tool_item_box">
              <!-- 微店订单-->
              <img src="./../../assets/img/member/store_4.png" alt />
              <p>微店订单</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bo_huiyuan_div19" v-if="flag.qsps && JSON.stringify(flag.qsps.data)!='{}' && $store.state.config.plugin.qsps.is_open==1  ">
        <div class="bo_xhy_div5">
          <span class="f_l">{{flag.qsps.title || '骑手工作台'}}</span>
        </div>
        <div class="vip_tool">

          <div class="vip_tool_item" v-if="flag.qsps.data.wyld && info.is_rider=='1'" @click="$router.push({path:'/rider/index'})">
            <div class="vip_tool_item_box ">
              <img src="./../../assets/img/member/qs/20.png" alt />
              <span class="tool_tipnum" style="right:20px" v-if="info.my_rider_1>0">{{info.my_rider_1}}</span>
              <p>{{flag.qsps.data.wyld}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-else @click="$router.push({path:'/rider/apply'})">
            <div class="vip_tool_item_box">
              <!-- 申请骑手 -->
              <img src="./../../assets/img/member/sqqs.png" alt />
              <p>申请成为骑手</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.qsps.data.psz && info.is_rider=='1'"
              @click="$router.push({path:'/rider/index',query:{status:'配送中'}})">
            <div class="vip_tool_item_box ">
              <img src="./../../assets/img/member/qs/22.png" alt />
              <span class="tool_tipnum" style="right:20px" v-if="info.my_rider_2>0">{{info.my_rider_2}}</span>
              <p>{{flag.qsps.data.psz}}</p>
            </div>
          </div>

          <div class="vip_tool_item" v-if="flag.qsps.data.yps && info.is_rider=='1'"
              @click="$router.push({path:'/rider/index',query:{status:'已完成'}})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/member/qs/21.png" alt />
              <p>{{flag.qsps.data.yps}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.qsps.data.yjmx && info.is_rider=='1'" @click="$router.push({path:'/pay/income?iden=rider_reward'})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/member/qs/23.png" alt />
              <p>{{flag.qsps.data.yjmx}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bo_huiyuan_div19" v-if=" flag.yuncang && JSON.stringify(flag.yuncang.data)!='{}'&& $store.state.config.plugin.ycxt.is_open==1 ">
        <div class="bo_xhy_div5">
          <span class="f_l">{{flag.yuncang.title || '我的云仓'}}</span>
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item" @click="$router.push({path:'/page/member_shop'})" v-if="flag.yuncang.data.yc_wyjh">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/yc/l1.png" alt />
              <p>{{flag.yuncang.data.yc_wyjh}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/yc/order'})" v-if="flag.yuncang.data.yc_ddgl">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/yc/l2.png" alt />
              <p>{{flag.yuncang.data.yc_ddgl}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/yc/zhituiren',})" v-if="flag.yuncang.data.yc_yclv">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/yc/l3.png" alt />
              <p>{{flag.yuncang.data.yc_yclv}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/yc/my-yc'})" v-if="flag.yuncang.data.yc_wdyc">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/yc/l4.png" alt />
              <p>{{flag.yuncang.data.yc_wdyc}}</p>
            </div>
          </div>

          <div class="vip_tool_item" @click="$router.push({path:'/yc/retail-outlet'})" v-if="flag.yuncang.data.yc_lscc">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/yc/l5.png" alt />
              <p>{{flag.yuncang.data.yc_lscc}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/yc/exchange-goods'})" v-if="flag.yuncang.data.yc_hhgl">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/yc/l6.png" alt />
              <p>{{flag.yuncang.data.yc_hhgl}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/yc/authorization',})" v-if="flag.yuncang.data.yc_zzzs">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/yc/l7.png" alt />
              <p>{{flag.yuncang.data.yc_zzzs}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/yc/market'})" v-if="flag.yuncang.data.yc_scsj">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/yc/l8.png" alt />
              <p>{{flag.yuncang.data.yc_scsj}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bo_huiyuan_div19" v-if="flag.rwds && JSON.stringify(flag.rwds.data)!='{}' && $store.state.config.plugin.rwds.is_open==1">
        <div class="bo_xhy_div5">
          <span class="f_l">任务大厅</span>
          <!-- <span class="f_r bo_xhy_span2" @click="$router.push('/task/printtask')">发布</span> -->
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item" @click="$router.push({path:'/task/list'})">
            <div class="vip_tool_item_box">
              <!-- 任务大厅-->
              <img src="./../../assets/img/member/task_rwdt.png" alt />
              <p>{{flag.rwds.data.rwdt}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/task/printtask'})">
            <div class="vip_tool_item_box">
              <!-- 发布任务-->
              <img src="./../../assets/img/member/task_fbrw.png" alt />
              <p>{{flag.rwds.data.fbrw}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/task/signup'})">
            <div class="vip_tool_item_box">
              <!-- 报名的任务-->
              <img src="./../../assets/img/member/task_bmdrw.png" alt />
              <span class="tool_tipnum" style="right:20px" v-if="info.my_order_num_11>0">{{info.my_order_num_11}}</span>
              <p>{{flag.rwds.data.bmdrw}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/task/myprint'})">
            <div class="vip_tool_item_box">
              <!-- 我的任务-->
              <img src="./../../assets/img/member/task_dqrrw.png" alt />
              <span class="tool_tipnum" style="right:20px" v-if="info.my_order_num_12>0">{{info.my_order_num_12}}</span>
              <p>{{flag.rwds.data.dqrrw}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bo_huiyuan_div19" v-if="flag.flxx && JSON.stringify(flag.flxx.data)!='{}' && $store.state.config.plugin.flxx.is_open==1">
        <div class="bo_xhy_div5">
          <span class="f_l">分类信息</span>
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item" @click="$router.push({path:'/cityinfo/add'})">
            <div class="vip_tool_item_box">
              <!-- 同城发布-->
              <img src="./../../assets/img/member/fl_tcfb.png" alt />
              <p>{{flag.flxx.data.fl_tcfb}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/cityinfo/myreserve'})">
            <div class="vip_tool_item_box">
              <!-- 预约服务-->
              <img src="./../../assets/img/member/fl_yyfw.png" alt />
              <p>{{flag.flxx.data.fl_yyfw}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/cityinfo/myinfo'})">
            <div class="vip_tool_item_box">
              <!-- 我的信息-->
              <img src="./../../assets/img/member/fl_wdxx.png" alt />
              <p>{{flag.flxx.data.fl_wdxx}}</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push({path:'/cityinfo/myreply'})">
            <div class="vip_tool_item_box">
              <!-- 我的评论-->
              <img src="./../../assets/img/member/fl_wdpl.png" alt />
              <p>{{flag.flxx.data.fl_wdpl}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bo_huiyuan_div19" v-if="flag.live && JSON.stringify(flag.live.data)!='{}' && $store.state.config.plugin.zbcj.is_open==1">
        <div class="bo_xhy_div5">
          <span class="f_l">直播电商</span>
          <span class="f_r bo_xhy_span2" @click="$router.push('/live/addreply')">添加短视频</span>
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item" v-if="flag.live.data.live_zb && info.is_live == 1 " @click="$router.push({path:'/live/open'})">
            <div class="vip_tool_item_box">
              <!-- 发起直播-->
              <img src="./../../assets/img/member/fqzb.png" alt />
              <p>发起直播</p>
            </div>
          </div>
          <div class="vip_tool_item" v-else @click="$router.push({path:'/live/apply'})">
            <div class="vip_tool_item_box">
              <!-- 发起直播-->
              <img src="./../../assets/img/member/fqzb.png" alt />
              <p>申请主播</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.live.data.live_gz " @click="$router.push({path:'/live/attention'})">
            <div class="vip_tool_item_box">
              <!-- 关注我的-->
              <img src="./../../assets/img/member/wdgz.png" alt />
              <p>关注我的</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.live.data.live_hf " @click="$router.push({path:'/live/home?mid='+info.id})">
            <div class="vip_tool_item_box">
              <!-- 我的回放-->
              <img src="./../../assets/img/member/wdhf.png" alt />
              <p>我的主页</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.live.data.live_dd " @click="$router.push({path:'/live/mycomment'})">
            <div class="vip_tool_item_box">
              <!-- 我的订单-->
              <img src="./../../assets/img/member/wddd.png" alt />
              <p>我的评论</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bo_huiyuan_div19" v-if="flag.djpt && JSON.stringify(flag.djpt.data)!='{}' && $store.state.config.plugin.djpt.is_open==1">
        <div class="bo_xhy_div5">
          <span class="f_l">代驾平台</span>
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item" v-if="flag.djpt.data.wydj " @click="$router.push({path:'/driver/user_index'})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/member/wydj.png" alt />
              <p>{{flag.djpt.data.wydj}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.djpt.data.djxc " @click="$router.push({path:'/driver/user_myorder'})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/member/djxc.png" alt />
              <p>{{flag.djpt.data.djxc}}</p>
            </div>
          </div>

          <div class="vip_tool_item" v-if="flag.djpt.data.djsj && info.is_driving == 1" @click="$router.push({path:'/driver/motor_member'})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/member/djsj.png" alt />
              <p>司机中心</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.djpt.data.djsj && info.is_driving == 0" @click="$router.push({path:'/driver/motor_apply'})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/member/djsj.png" alt />
              <p>申请司机</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.djpt.data.djdl && info.is_driving_agent == 1" @click="$router.push({path:'/driver/agent_member'})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/member/djdl.png" alt />
              <p>代理中心</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.djpt.data.djdl && info.is_driving_agent == 0" @click="$router.push({path:'/driver/agent_apply'})">
            <div class="vip_tool_item_box">
              <img src="./../../assets/img/member/djdl.png" alt />
              <p>申请代理</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bo_huiyuan_div19"
          v-if="info.is_store == 1 && flag.yuyue && JSON.stringify(flag.yuyue.data)!='{}' && $store.state.config.plugin.yymk.is_open==1">
        <div class="bo_xhy_div5">
          <span class="f_l">预约门店</span>
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item" v-if="flag.yuyue.data.yy_wdmd" @click="$router.push({path:'/store'})">
            <div class="vip_tool_item_box">
              <!-- 我的门店 -->
              <img src="./../../assets/img/member/md/32.png" alt />
              <p>{{flag.yuyue.data.yy_wdmd}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.yuyue.data.yy_ddgl" @click="$router.push({path:'/store/order'})">
            <div class="vip_tool_item_box">
              <!-- 订单管理 -->
              <img src="./../../assets/img/member/md/30.png" alt />
              <p>{{flag.yuyue.data.yy_ddgl}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.yuyue.data.yy_smqr" @click="scan">
            <div class="vip_tool_item_box">
              <!-- 扫码确认 -->
              <img src="./../../assets/img/member/md/33.png" alt />
              <p>{{flag.yuyue.data.yy_smqr}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CRM -->
      <div class="bo_huiyuan_div19"
          v-if="flag.wcrm && JSON.stringify(flag.wcrm.data)!='{}' && $store.state.config.plugin.wcrm && $store.state.config.plugin.wcrm.is_open==1 && info.is_staff == 1">
        <div class="bo_xhy_div5">
          <span class="f_l">CRM</span>
        </div>
        <div class="vip_tool">
          <div class="vip_tool_item" v-if="flag.wcrm.data.ghkh" @click="$router.push({path:'/page/public_client'})">
            <div class="vip_tool_item_box">
              <img src="@/assets/img/member/crm_public.png" alt />
              <p>{{flag.wcrm.data.ghkh}}</p>
            </div>
          </div>
          <div class="vip_tool_item" v-if="flag.wcrm.data.wdkh" @click="$router.push({path:'/page/follow'})">
            <div class="vip_tool_item_box">
              <img src="@/assets/img/member/crm_mineclinet.png" alt />
              <span class="tool_tipnum" style="right:20px" v-if="info.my_order_num_14>0">{{info.my_order_num_14}}</span>
              <p>{{flag.wcrm.data.wdkh}}</p>
            </div>
          </div>
          <div class="vip_tool_item" style="position:relative" v-if="flag.wcrm.data.wdcj" @click="$router.push({path:'/page/mydeal'})">
            <div class="vip_tool_item_box">
              <img src="@/assets/img/member/crm_end.png" alt />
              <span class="tool_tipnum" style="right:20px" v-if="info.my_order_num_15>0">{{info.my_order_num_15}}</span>
              <p>{{flag.wcrm.data.wdcj}}</p>
            </div>
          </div>
          <div class="vip_tool_item" style="position:relative" v-if="flag.wcrm.data.wdsy"
              @click="$router.push({path:'/pay/income',query:{style:'staff_amount'}})">
            <div class="vip_tool_item_box">
              <img src="@/assets/img/member/crm_minegrow.png" alt />
              <span class="tool_tipnum" style="right:20px" v-if="info.my_order_num_16>0">{{info.my_order_num_16}}</span>
              <p>{{flag.wcrm.data.wdsy}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bo_huiyuan_div19" v-if="flag.tzzt && JSON.stringify(flag.tzzt.data)!='{}' && $store.state.config.plugin.xxmk.is_open==1">
        <div class="bo_xhy_div5">
          <span class="f_l">团长自提</span>
        </div>
        <div class="vip_tool" v-if="flag.tzzt.data.smqr && $store.state.config.plugin.xxmk.is_open==1 && info.mention_id <= 0">
          <div class="vip_tool_item" @click="$router.push('/order/mention/apply')">
            <div class="vip_tool_item_box">
              <!-- 申请团长 -->
              <img src="./../../assets/img/member/sqzt.png" alt />
              <p>申请团长</p>
            </div>
          </div>
        </div>
        <div class="vip_tool" v-if="info.mention_id > 0">
          <div class="vip_tool_item" @click="scan" v-if="flag.tzzt.data.smqr">
            <div class="vip_tool_item_box">
              <!-- 扫码确认 -->
              <img src="./../../assets/img/member/task_rwdt.png" alt />
              <p>扫码确认</p>
            </div>
          </div>
          <div class="vip_tool_item tool_zt" @click="$router.push('/order/mention?status=待提货订单')" v-if="flag.tzzt.data.dthdd">
            <div class="order_num" style="height: 45px;" v-if="info.my_order_num_13>0">
              <span>{{info.my_order_num_13}}</span>
            </div>
            <div class="vip_tool_item_box">
              <!-- 待提货订单 -->
              <img src="./../../assets/img/member/待提货.png" alt />
              <p>待提货订单</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push('/order/mention?status=已提货订单')" v-if="flag.tzzt.data.ythdd">
            <div class="vip_tool_item_box">
              <!-- 已提货订单 -->
              <img src="./../../assets/img/member/已提货.png" alt />
              <p>已提货订单</p>
            </div>
          </div>
          <div class="vip_tool_item" @click="$router.push('/order/mention/apply')" v-if="flag.tzzt.data.xgtzxx">
            <div class="vip_tool_item_box">
              <!-- 信息修改 -->
              <img src="./../../assets/img/member/信息修改.png" alt />
              <p>信息修改</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bo_xhy_div6" style="min-height:auto" v-if="JSON.stringify(flag.new_power.data)!='{}'">
        <div class="bo_xhy_div5">
          <span class="f_l">会员活动特权</span>

          <!-- <span class="f_r bo_xhy_span2">查看全部&nbsp; <text class="icon-right bo_xhy_span2"></text>
          </span>-->
        </div>
        <div class="new_task">
          <div class="new_task_item" v-if="flag.new_power.data.zqqd">
            <!-- 早起签到 -->
            <router-link to="/punch/punchindex">
              <div class="new_task_item_box">
                <img src="./../../assets/img/member/novice_zqqd.png" alt />
              </div>
            </router-link>
          </div>
          <div class="new_task_item" v-if="flag.new_power.data.jfcq">
            <!-- 积分猜拳 -->
            <router-link to="/guess/guess">
              <div class="new_task_item_box">
                <img src="./../../assets/img/member/novice_jfcq.png" alt />
              </div>
            </router-link>
          </div>
          <div class="new_task_item" v-if="flag.new_power.data.agccn">
            <!-- A股猜猜乐 -->
            <div class="new_task_item_box">
              <router-link to="/ccl/ccl">
                <img src="./../../assets/img/member/novice_agccl.png" alt />
              </router-link>
            </div>
          </div>
          <div class="new_task_item" v-if="flag.new_power.data.hbrw">
            <!-- 红包任务 -->
            <div class="new_task_item_box">
              <router-link to="/page/sign">
                <img src="./../../assets/img/member/novice_hbrw.png" alt />
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="bo_huiyuan_div8" v-if="JSON.stringify(flag.m_data.data)!='{}'">
        <div class="bo_xhy_div5">
          <span class="f_l">功德传播</span>
          <span class="f_r bo_xhy_span2">
            <span class="icon-attention bo_xhy_span2"></span>
          </span>
        </div>
        <div class="fx tc tuan_men">
          <div class="fx_1 tuan_fir" v-if="flag.m_data.data.m_1">
            <div class="fir_1" style="line-height:32px"
                :class="{small_size: info.zsales.toString().length >= 7 || (parseInt(info.zvip.toString().length)+parseInt(info.znumber.toString().length)) >= 7 ? true :false}">
              {{info.yvip}}/{{info.ynumber}}</div>
            <div class="fir_2" style="font-size:14px">我的好友</div>
          </div>
          <!-- {{info.zvip}}/ -->
          <div class="fx_1 tuan_fir" v-if="flag.m_data.data.m_2">
            <div class="fir_1" style="line-height:32px"
                :class="{small_size: info.zsales.toString().length >= 7 || (parseInt(info.zvip.toString().length)+parseInt(info.znumber.toString().length)) >= 7 ? true :false}">
              {{info.znumber}}</div>
            <div class="fir_2" style="font-size:14px">功德传播人数</div>
          </div>
          <div class="fx_1 tuan_fir" v-if="flag.m_data.data.m_3">
            <div class="fir_1" style="line-height:32px"
                :class="{small_size: info.zsales.toString().length >= 7 || (parseInt(info.zvip.toString().length)+parseInt(info.znumber.toString().length)) >= 7 ? true :false}">
              {{$fnc.toFixedZ(info.zsales)}}</div>
            <div class="fir_2" style="font-size:14px">团队业绩</div>
          </div>
          <div class="fx_1 tuan_fir" v-if="flag.m_data.data.m_4">
            <div class="fir_1" style="line-height:32px"
                :class="{small_size: info.zsales.toString().length >= 7 || (parseInt(info.zvip.toString().length)+parseInt(info.znumber.toString().length)) >=7 ? true :false}">
              {{$fnc.toFixedZ(info.sum_amount)}}</div>
            <div class="fir_2" style="font-size:14px">累计收益</div>
          </div>
        </div>
        <div class="my_tuandui">
          <!-- <router-link to="/im/imindex">
            <div class="my_tuandui_btn">
              <span class="icon-friend my_tuandui_btn_ic"></span>
              <span class="my_tuandui_btn_i2">管理我的团队</span>
            </div>
          </router-link> -->
        </div>
      </div>

      <div class="bo_huiyuan_div8" v-if="flag.star.title">
        <div class="bo_xhy_div5">
          <span class="f_l">区块链星球</span>
          <span class="f_r bo_xhy_span2">
            <van-icon name="eye" class="bo_xhy_span2" />
          </span>
        </div>
        <div class="fx tc tuan_men">
          <div class="fx_1 tuan_fir t_br">
            <div class="fir_2">直属区块</div>
            <div class="fir_1">{{info.coin_yvip}}/{{info.ynumber}}</div>
          </div>
          <div class="fx_1 tuan_fir">
            <div class="fir_2">全网区块</div>
            <div class="fir_1">{{info.coin_zvip}}/{{info.znumber}}</div>
          </div>
        </div>
        <div class="my_tuandui">
          <router-link to="/im/imindex">
            <div class="my_tuandui_btn">
              <van-icon name="friends-o" class="my_tuandui_btn_ic" />
              <span class="my_tuandui_btn_i2">查看区块好友</span>
            </div>
          </router-link>
        </div>
        <div class="fx tc tuan_men">
          <div class="fx_1 tuan_fir t_br">
            <div class="fir_2">团队业绩</div>
            <div class="fir_1">{{$fnc.toFixedZ(info.coin_sales,8)}}</div>
          </div>
          <div class="fx_1 tuan_fir">
            <div class="fir_2">累计收益</div>
            <div class="fir_1">{{$fnc.toFixedZ(info.sum_coin,8)}}</div>
          </div>
        </div>
        <div class="my_tuandui">
          <router-link to="/coin/coinhistory?iden=coin">
            <div class="my_tuandui_btn">
              <van-icon name="search" class="my_tuandui_btn_ic" />
              <span class="my_tuandui_btn_i2">查看矿工收益</span>
            </div>
          </router-link>
        </div>
      </div>
      <div class="blank"></div>
      <div class="card_con" v-if="flag.recommend.data == 'true' && listProduct.length>0">
        <div class="fx product-card-title">
          <img src="../../assets/img/order/06.png" alt />
          <span>猜你喜欢</span>
          <img src="../../assets/img/order/05.png" alt />
        </div>

        <div class="shop_scroll" id="shop_scroll-mem" style="margin:0 auto; position: relative;z-index: 1;">
          <indexshoplist :top_shoplist="listProduct" />
        </div>
      </div>
    </mescroll-vue>
    <md-landscape v-model="point_sign_show" class="index-man-pop member-man-pop" style="background-color: transparent;width: 70%">
      <div class="sign_popup">
        <img :src="$fnc.getImgUrl(sign.pic)" alt />
        <div class="sign_go" @click="toSign"></div>
        <div class="sign_close" @click="point_sign_show = false"></div>
      </div>
    </md-landscape>

    <!-- <turn @send_isturn="receive_isturn" @send_closepop="receive_pop" :con="'指定抽奖'" :turnnum="userInfo.big_wheel_num"
      :show="turn_show"></turn> -->
  </div>
</template>

<script>
import {
  Rate
} from "vant";
import indexshoplist from "@/components/shop/shopindex/indexshoplist.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
import turn from "@/components/page/turn";
import Cookies from "js-cookie";
import {
  Landscape
} from "mand-mobile";
import {
  mapState
} from "vuex";
import wx from "weixin-js-sdk";
export default {
  name: "member",
  components: {
    [Rate.name]: Rate,
    indexshoplist,
    MescrollVue,
    turn,
    [Landscape.name]: Landscape
  },
  data () {
    return {

      sign: {},
      turn_show: false,
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false,
        // inOffset: 80,
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)

      mescrollUp: {
        offset: 500,
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        // inOffset: this.upCallback,
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        },
        // htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "member",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        // lazyLoad: {
        //   use: true,
        //   attr: 'imgurl',
        //   showClass: 'mescroll-lazy-in',
        //   delay: 500,
        //   offset: 200
        // }
        // empty: {
        //     //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
        //     warpId: "shop_scroll-mem", //父布局的id (1.3.5版本支持传入dom元素)
        //     icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
        //     tip: "暂无相关数据~" //提示
        // }
      },
      listProduct: [],
      point_sign_show: false,
      zqqd: "", //早起签到
      dzp: "", //大转盘
      cq: "", //猜拳
      ccn: "", //猜猜乐
      nickname: "", //昵称
      rating: "", //会员等级
      share: "", //推广码
      money: "", //余额
      amount: "", //佣金
      integral: "", //积分
      xshb: "", //新手红包
      xfsc: "", //积分商城
      wzy: "", //微展业
      znumber: "0", //总人数
      zsales: "", //总业绩
      sum_amount: "", //累计佣金
      info: this.$store.state.user,
      flag: {
        top: {
          data: {},
          title1: "",
          title2: "",
          links: ""
        },
        money: {
          data: {}
        },
        my_order: {
          data: {}
        },
        new_power: {
          data: {}
        },
        m_data: {
          data: {}
        },
        business: {
          data: {}
        },
        tool: {
          data: {}
        },
        recommend: {
          data: {}
        },
        star: {
          title: ""
        }
      },
      ewm: {
        wy_ewm: "",
        banner: [{
          piclink: ""
        }]
      },
      userInfo: this.$store.state.user
    };
  },
  methods: {
    toDh (item) {
      //导航去门店
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == "ykapp") {
        this.isApp = true;
      }
      var that = this;
      if (that.isApp) {
        try {
          that.$fnc.appNav(item.latitude, item.longitude);
        } catch (error) {
          that.$toast.fail("App地图跳转失败");
        }
      } else if (that.$fnc.isWx()) {
        var obj = {};
        obj.latitude = parseFloat(item.latitude);
        obj.longitude = parseFloat(item.longitude);
        obj.name = item.title;
        obj.address =
          item.province + item.city + item.area + item.town + item.address;
        obj.scale = 14;
        obj.infoUrl = location.origin + "/page/vip";

        if (that.isxcx == true || that.isxcx == "true") {
          wx.miniProgram.navigateTo({
            url: `/pages/map/map?latitude=${obj.latitude}&longitude=${obj.longitude}&name=${obj.name}&address=${obj.address}`
          });
        } else {
          this.wxApi.ToLocation(obj);
        }
      } else {
        that.$toast.fail("请在微信或者app打开");
      }
    },
    gotosupplier () {
      var suppliermoney = this.info.is_supplier_margin || 0
      if (Number(suppliermoney) > 0 && Number(suppliermoney) >= Number(this.info.margin)) {
        this.$toast.fail(`需缴纳${suppliermoney}元保证金才能使用商户功能`)
        setTimeout(() => {
          this.$router.push({
            path: '/pay/margin/recharge'
          })
        }, 1500);
      } else {
        this.$router.push('/zhanye/zhanyemember')
      }

    },
    goto_xcxkf () {
      wx.miniProgram.navigateTo({
        url: `/pages/service/service`,
      });
    },
    toXnb () {
      if (this.isOpenXnb) {
        this.$router.push({
          path: "/pay/income",
          query: {
            iden: "coin"
          }
        });
      } else {
        this.$router.push({
          path: "/coin/coin"
        });
      }
    },
    receive_pop (val) {
      this.turn_show = val;
    },
    toSign () {
      this.point_sign_show = false;
      this.$router.push({
        path: "/page/sign"
      });
    },
    toMenber (link) {
      if (link == "") {
        this.$toast("敬请期待");
        return;
      }
      if (link.indexOf("/") === 0) {
        this.$router.push(link);
      } else {
        window.location.href = link;
      }
    },
    open_turn () {
      var num = this.userInfo.big_wheel_num;
      this.$router.push({ path: "/member/turntable", query: { con: "指定抽奖", turnnum: num } });
      // if (num != "0") {
      //   // this.turn_show = true;
      //   this.$router.push({ path: "/member/turntable", query: { con: "指定抽奖", turnnum: num } });
      // } else {
      //   this.$toast.fail("无次数");
      // }
    },
    receive_isturn () {
      // this.is_turn = val;
    },
    mescrollInit (mescroll) {
      if (this.flag.recommend.data == "true") {
        this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      }
    },
    upCallback (page, mescroll) {
      if (this.flag.recommend.data == "true") {
        this.$api.getOrder
          .getOrderProduct({
            page: page.num,
            page_size: 20
          })
          .then(res => {
            if (res.code == 200) {
              let arr = res.result.product;
              // 如果是第一页需手动置空列表
              if (page.num === 1) this.listProduct = [];
              // 把请求到的数据添加到列表
              this.listProduct = this.listProduct.concat(arr);
              // 数据渲染成功后,隐藏下拉刷新的状态
              this.$nextTick(() => {
                setTimeout(() => {
                  mescroll.endSuccess(arr.length);
                }, 1500);
              });
            } else {
              mescroll.endErr();
            }
          });
      } else {
        mescroll.endErr();
      }
    },
    is_point_sign () {
      var is_point = JSON.parse(sessionStorage.getItem("sign_point")) || {};
      var date = new Date();
      var year = date.getFullYear(); //年
      var month = date.getMonth() + 1; //月
      var day = date.getDate(); //日
      var rq = `${year}${month > 9 ? month : "0" + month}${day > 9 ? day : "0" + day
        }`;
      let sign_obj = {};
      if (!(is_point.is_point == true && is_point.rq == rq)) {
        this.$api.getPage.sign_warn({}).then(res => {
          // 签到提醒 is_remark
          if (res.code == 200) {
            this.sign = res.result;
            sign_obj = res.result;
            if (sign_obj.is_remark == 1) {
              //开启签到提醒
              this.$api.getPage.get_sign_week({}).then(res => {
                //当天是否签到
                if (res.code == 200) {
                  var arr = res.result;
                  for (const key in arr.res) {
                    if (arr.res.hasOwnProperty(key)) {
                      const item = arr.res[key];
                      if (item.stage == rq && item.is_sign == 0) {
                        //今日未签到

                        this.point_sign_show = true;
                        sessionStorage.setItem(
                          "sign_point",
                          JSON.stringify({
                            is_point: true,
                            rq: rq
                          })
                        );
                      } else {
                        this.point_sign_show = false;
                      }
                    }
                  }
                }
              });
            } else {
              //未开启签到提醒
              sessionStorage.setItem(
                "sign_point",
                JSON.stringify({
                  is_point: false,
                  rq: rq
                })
              );
            }
          }
        });
      }
    },
    toSeting () { },
    getUserInfo () {
      this.$api.getUser.getUserInfo({}).then(res => {
        if (res.code == 200) {
          localStorage.setItem("myMember", JSON.stringify(res.result));
          this.info = res.result;
          this.$store.commit("setUser", res.result);
          try {
            setTimeout(() => {
              this.$store.commit("updateUserInfo", {
                gender: res.result.sex,
                avatar: res.result.avatar,
                nickname: res.result.nickname || res.result.username
              }); //修改Im资料
            }, 2000);
          } catch (err) {
            new Error(err);
          }
          if (res.result.flag && res.result.flag != "") {
            this.flag = JSON.parse(res.result.flag);
          } else {
            this.flag = {};
          }

          if (!this.flag.top.title1) {
            this.flag.top.title1 = "成为会员享受至尊会员权益";
          }
          if (!this.flag.top.title2) {
            this.flag.top.title2 = "去购物";
          }
          if (!this.flag.top.links) {
            this.flag.top.links = "/page/member_shop";
          }
          if (
            res.result.tel == "" &&
            this.$store.state.config.shop.reg_tel == "1"
          ) {
            this.$router.push('/bind')
            // this.$store.commit("setShowBingPhone", true);
          } else if (
            res.result.tid == 0 &&
            this.$store.state.config.shop.reg_permission == "1"
          ) {
            this.$store.commit("setTsShare", true);
          } else {
            this.$store.commit("setShowBingPhone", false);
            this.$store.commit("setTsShare", false);
          }
          //判断团长id是否为空
          let extract_id = localStorage.getItem("extract_id") || "";
          if (this.info.extract_id == "" || (extract_id != "" && this.info.extract_id != extract_id)) {
            this.$api.getPage.saveExtractId({
              id: extract_id
            }).then(res => {
              if (res.code == 200) {
                return;
              }
            })
          }
        }
      });
    },
    setDefaultPage () {
      var data = localStorage.getItem("myMember");
      if (data) {
        data = JSON.parse(data);
        this.info = data;
        console.log(this.info);
        if (data.flag == "") {
          this.flag = {};
        } else {
          this.flag = JSON.parse(data.flag);
        }
      }
    },
    toIm () {
      if (this.$store.state.config.plugin.btkfxt.is_open == 0) {
        this.$toast.fail("敬请期待");
      } else {
        this.$router.push("/im/kf");
      }
    },
    get_scanresult (str) {
      if (str.indexOf('/order/mention/code?id=') >= 0) {
        this.$dialog.confirm({
          title: '是否确认取货',
        }).then(() => {
          let to = str.indexOf('?id=');
          let from = str.indexOf('&VNK');
          let id = "";
          if (from == -1) {
            id = str.substring(to + 4)
          } else {
            id = str.substring(to + 4, from)
          }
          var params = {
            id: id
          }
          this.$api.getOrder.complect_mention(params).then(res1 => {
            if (res1.code == 200) {
              this.$toast.success('操作成功')
            }
          })
        }).catch(() => {

        });
      } else if (str.indexOf('/order/orderdetails') >= 0) {
        var obj = this.$fnc.urlparse(str);
        if (obj['type'] == '14') {
          this.$dialog.confirm({
            title: '是否确认开始服务',
          }).then(() => {
            var params = {
              id: obj['id']
            }
            this.$api.getOrder.start_reserve(params).then(res1 => {
              if (res1.code == 200) {
                this.$toast.success('开始服务')
              }
            })
          }).catch(() => {

          });
        }
      }
    },
    scan () {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == 'ykapp') {
        this.$fnc.appScan();
      } else if (this.$fnc.isWx() && this.$store.state.config.plugin.wxgzhbb && this.$store.state.config.plugin.wxgzhbb.is_open == 1) {
        var that = this;
        wx.scanQRCode({
          needResult: 1,
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: (res) => {
            that.get_scanresult(res.resultStr)
          },
          fail: (rej) => {
            this.$toast.fail('调起摄像头失败')
          }
        });
      } else if (navigator.userAgent.indexOf("miniProgram") !== -1) {
        wx.miniProgram.navigateTo({
          url: `/pages/code/code`,
        });
      } else {
        this.$toast.fail('调起摄像头失败')
      }
    },
  },
  created () {
    this.setDefaultPage();
    this.$store.dispatch("getconfig");
    this.$store.dispatch("getLoginConfig");
    this.getUserInfo();
    this.is_point_sign(); //判断是否存在提醒签到

    

  },
  mounted () {
    window.scanCodeBack = this.get_scanresult;
    window.setScanText = this.get_scanresult
  },
  beforeRouteEnter (to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave (to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  computed: {
    is_xcx () {
      return navigator.userAgent.indexOf("miniProgram") !== -1 ? true : false;
    },
    ...mapState({
      config: state => state.config,
      conversationList: state => state.conversation.conversationList
    }),
    kfUnreadCount () {
      var index = 0;
      for (var i in this.conversationList) {
        if (this.conversationList[i].conversationID.indexOf("admin") != -1) {
          index += this.conversationList[i].unreadCount;
        }
      }
      return index; //得到总IM未读消息
    },
    isOpenXnb () {
      var qknsc = this.config.plugin.qknsc.is_open || "0";
      var xnbkj = this.config.plugin.xnbkj.is_open || "0";
      if (qknsc == "0" && xnbkj == "0") {
        return true;
      } else {
        return false;
      }
    },
    usernickname () {
      var nick = this.info.nickname;
      var username = this.info.username;
      if (nick) {
        if (nick.length > 6) {
          return nick.slice(0, 6) + "..." + "【" + username + "】";
        } else {
          return nick + "【" + username + "】";
        }
      } else {
        return username;
      }
    },
    uidNick () {
      var uidnick = this.info.tid_cn;
      if (uidnick) {
        if (uidnick.nickname) {
          if (uidnick.nickname.length > 6) {
            return uidnick.nickname.slice(0, 6);
          } else {
            return uidnick.nickname;
          }
        } else {
          return uidnick.username;
        }
      } else {
        return false;
      }
    }
  },
  watch: {
    $route () {
      this.info = this.$store.state.user;
    }
  }
};
</script>

<style scoped lang='less'>
@import "../../assets/css/style.css";

.sign_popup {
  width: 100%;
  position: relative;
}

.sign_popup img {
  width: 100%;
}

.sign_go {
  width: 240px;
  height: 50px;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: auto;
}

.sign_close {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0;
  right: 0;
}

.bo_huiyuan_li1 {
  padding: 12px 0;
}

.bo_huiyuan_div9 {
  line-height: 12px;
}

.order_num {
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vip_tool {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.vip_tool_item {
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tool_zt {
  position: relative;

  .order_num {
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 5px;
    right: 30px;
    z-index: 1;
  }
}

.vip_tool_item_box {
  width: 100%;
  height: 75px;
  display: flex;
  flex-flow: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}

.vip_tool_item_box img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.vip_tool_item_box p {
  font-size: 12px;
  color: #333333;
  text-align: center;
  line-height: 26px;
}

.new_task {
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 5px 0;
}

.new_task_item {
  width: 48%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.new_task_item_box {
  width: 100%;
}

.new_task_item_box img {
  width: 100%;
}

.product-card-title {
  justify-content: center;
  margin: 10px 0;
}

.product-card-title span {
  font-size: 16px;
  height: 28px;
  line-height: 28px;
  font-weight: bold;
}

.small_size {
  font-size: 16px !important;
}

.bo_xhy_li1 {
  width: 220px;
}

.bo_xhy_div2 {
  position: relative;
}

.sms_dot {
  font-size: 10px;
  width: 15px;
  height: 15px;
  padding: 2px;
  border-radius: 50%;
  background-color: #ee0a24;
  color: #ffffff;
  position: absolute;
  right: -8px;
  top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sms_dot_kf {
  font-size: 10px;
  width: 15px;
  height: 15px;
  padding: 2px;
  border-radius: 50%;
  background-color: #ee0a24;
  color: #ffffff;
  position: absolute;
  right: 75px;
  top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mescroll {
  position: relative;
  z-index: 1;
  /* padding-bottom: 50px; */
}

.member-mescroll {
  /* position: fixed;
    top: 0; */
  padding-bottom: 50px;
}

/* 团长信息 */
.self {
  width: 95%;
  margin: 10px auto;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(255, 255, 255);
  border-radius: 10px;

  .head {
    width: 100%;
    height: 35px;
    padding-left: 8px;
    padding-right: 8px;
    background-color: rgb(255, 131, 98);
    color: white;
    font-size: 15px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span:nth-of-type(1) {
      font-weight: 600;
    }

    span:nth-child(2) {
      font-size: 14px;
    }

    .tag {
      width: 20px;
      height: 20px;
      background-color: rgb(255, 131, 98);
      position: absolute;
      bottom: -3px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }

    .arrow {
      padding-top: 10px;
      font-size: 12px;
    }
  }

  .button {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    font-size: 12px;
    margin: 10px 0;

    > span {
      background: #fd8462;
      color: #ffffff;
      padding: 1px 5px;
      border-radius: 2px;
      &:nth-of-type(1) {
        margin-right: 15px;
      }
    }
  }

  .foot {
    color: rgb(209, 209, 209);
    line-height: 18px;
    margin-bottom: 10px;
    align-items: flex-start;
    justify-content: flex-start;

    .van-icon {
      font-size: 15px;
    }

    > p {
      font-size: 14px;
      &:nth-of-type(1) {
        width: 72px;
        text-align: right;
      }
      &:nth-of-type(2) {
        width: 260px;
        padding: 0 5px;
      }
    }
  }

  .container {
    width: 100%;
    font-size: 14px;
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-top: 15px;
    padding-left: 12px;

    > div:nth-child(1) {
      width: 57px;
      height: 52px;
      background: red;
      border-radius: 50%;
      overflow: hidden;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    > div:nth-child(2) {
      width: 100%;
      padding-left: 15px;

      > p:nth-child(1) {
        display: flex;
        justify-content: space-between;
        font-weight: bold;

        > span:nth-child(1) {
          font-size: 15px;
          color: rgb(51, 51, 51);
        }

        > span:nth-child(2) {
          padding-right: 10px;
          color: rgb(255, 50, 50);
          font-weight: lighter;
          font-size: 14px;
        }
      }

      > p:nth-child(2) {
        color: rgb(168, 168, 166);
      }

      > p:nth-child(3) {
        color: rgb(51, 51, 51);
        line-height: 18px;
      }
    }
  }
}

.vip_tool_item_box1 > div {
  position: relative;

  > span {
    position: absolute;
    top: 0;
    right: 0px;
    font-size: 0.26667rem;
    width: 0.42667rem;
    height: 0.42667rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 50%;
    background: rgba(255, 0, 0, 0.8);
    color: #fff;
  }
}

.tool_tipnum {
  width: 15px;
  height: 15px;
  position: absolute;
  top: 7px;
  right: 13px;
  font-size: 0.26667rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.8);
  color: #fff;
}

.bo_xhy_li5 {
  margin-left: 13px;
  margin-top: 6px;
  height: 25px;
  line-height: 25px;
}

.member_text_con {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.bo_xhy_div8 {
  position: absolute;
  bottom: 0;
  width: 100%;

  > div {
    width: 94%;
    margin: 0 auto;
    border-radius: 5px 5px 0 0;
    background: #2d262e;
    padding: 8px 8px;

    > div {
      justify-content: flex-start;
      align-items: center;

      > img {
        width: 16px;
        margin-right: 5px;
        vertical-align: middle;
      }

      > span {
        line-height: 1;

        &:nth-of-type(1) {
          color: #edcf95;
          font-weight: bold;
          font-size: 14px;
          line-height: 1;
          // padding-top: 3px;
        }

        &:nth-of-type(2) {
          height: 16px;
          border-left: 1px solid #f5ead3;
          margin: 0 8px;
        }

        &:nth-of-type(3) {
          color: #f5ead3;
          font-size: 12px;
        }
      }
    }

    > i {
      color: #edcf95;
      font-size: 20px;
      vertical-align: middle;
    }
  }
}

.bo_xhy_span2 > .van-icon {
  font-size: 10px;
  padding-left: 2px;
  vertical-align: middle;
}
</style>
