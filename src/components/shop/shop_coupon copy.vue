<template>
  <div class="container coupon_bg" id="coupon">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scol">
      <van-nav-bar left-text left-arrow class="navbar" title="优惠券" @click-left="toBack">
      </van-nav-bar>

      <van-tabs active="tab_active" @change="tab_change">
        <van-tab title="未使用">
          <div class="coupon">
            <div class="coupon_top" @click="$router.push({path:'couponmark'})">
              <div class="coupon_icon">
                <img src="./../../assets/img/shop/coupon.png" alt="">
                <p>去卷集市</p>
              </div>
              <van-icon name="arrow" class="coupon_top_right"></van-icon>

            </div>
            <div class="coupon_body">
              <div v-for="(item,i) in couponlist" :key="i">
                <div class="coupon_item" v-if="item.pid == '0'">
                  <div class="coupon_left">
                    <img src="./../../assets/img/shop/coupon1.png" alt="">
                    <div class="coupon_left_content">
                      <p><span>￥</span>{{item.money}}</p>
                      <p>{{item.desc}}</p>
                    </div>
                  </div>
                  <div class="coupon_right">
                    <div class="coupon_right_top">
                      <p>{{item.source}}</p>
                    </div>
                    <div class="coupon_right_middle">
                      <p>过期时间：{{$fnc.getTimeFormat(item.end_time)}}</p>

                    </div>
                    <div class="coupon_right_bottom">
                      <p>满 {{item.xfm }} 减 {{item.money}} </p>
                      <button @click="buy_btn(1,item)">立即使用</button>
                    </div>
                  </div>
                </div>
                <div class="coupon_item coupon_item1" v-else>
                  <div class="coupon_left">
                    <img class="coupon_left_shop" :src="$fnc.getImgUrl(item.p_piclink)" alt="">
                  </div>
                  <div class="coupon_right">
                    <div class="coupon_right_top">
                      <p>{{item.p_title}}</p>
                    </div>
                    <div class="coupon_right_middle">
                      <p>过期时间：{{$fnc.getTimeFormat(item.end_time)}}</p>

                    </div>
                    <div class="coupon_right_bottom">
                      <p>满 {{item.xfm }} 减 {{item.money}} </p>
                      <button @click="buy_btn(2,item)">立即使用</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="使用记录">
          <div class="coupon">
            <div class="coupon_top" @click="$router.push({path:'couponmark'})">
              <div class="coupon_icon">
                <img src="./../../assets/img/shop/coupon.png" alt="">
                <p>去卷集市</p>
              </div>
              <van-icon name="arrow" class="coupon_top_right"></van-icon>
            </div>
            <div class="coupon_body">
              <div v-for="(item,i) in use_couponlist" :key="i">
                <div class="coupon_item" v-if="item.pid == '0'">
                  <div class="coupon_left">
                    <img src="./../../assets/img/shop/coupon1.png" alt="">
                    <div class="coupon_left_content">
                      <p><span>￥</span>{{item.money}}</p>
                      <p>{{item.desc}}</p>
                    </div>
                  </div>
                  <div class="coupon_right">
                    <div class="coupon_right_top">
                      <p>{{item.source}}</p>
                    </div>
                    <div class="coupon_right_middle">
                      <p v-if="item.info == '已使用'">
                        使用时间：{{$fnc.getTimeFormat(item.use_time)}}</p>
                      <p v-else> 使用时间：未使用</p>
                    </div>
                    <div class="coupon_right_bottom">
                      <p>{{item.info}}</p>
                    </div>
                  </div>
                </div>
                <div class="coupon_item coupon_item1" v-else>
                  <div class="coupon_left">
                    <img class="coupon_left_shop" :src="$fnc.getImgUrl(item.p_piclink)" alt="">
                  </div>
                  <div class="coupon_right">
                    <div class="coupon_right_top">
                      <p>{{item.p_title}}</p>
                    </div>
                    <div class="coupon_right_middle">
                      <p v-if="item.info == '已使用'">
                        使用时间：{{$fnc.getTimeFormat(item.use_time)}}</p>
                      <p v-else> 使用时间：未使用</p>
                    </div>
                    <div class="coupon_right_bottom">
                      <p>{{item.info}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </mescroll-vue>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  name: "shop_coupon",     //优惠券,
  components: {
    MescrollVue
  },
  data () {
    return {
      tab_active: 0,               //0为未使用，1为已使用
      couponlist: [],
      use_couponlist: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "shop_con",
          src: require("../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "collect", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        },
      },
    }
  },
  created () {
    this.get_couponlist();
    this.get_use_couponlist();
  },
  methods: {
    buy_btn (type, item) {
      if (item.sid == 0) {
        this.$router.push({ path: '/page/vip', query: { iden: 'home' } })
      } else if (type == 1) {
        this.$router.push({ path: '/supplier/supplierdetails', query: { id: item.sid } })
      } else if (type == 2) {
        this.$router.push({ path: '/shop/shopdetails', query: { id: item.pid } })
      } else {
        this.$router.push({ path: '/page/vip', query: { iden: 'home' } })
      }

    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback (page, mescroll) {
      if (this.tab_active == 0) {              //未使用
        this.$api.getShop.get_coupon_list({ page: page.num }).then(res => {
          if (res.code == 200) {
            let arr = res.result;
            // 如果是第一页需手动置空列表
            if (page.num === 1) this.couponlist = [];
            // 把请求到的数据添加到列表
            this.couponlist = this.couponlist.concat(arr);
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              mescroll.endSuccess(arr.length);
            });
          } else {
            mescroll.endErr();
          }
        });
      } else if (this.tab_active == 1) {            //已使用
        this.$api.getShop.get_coupon_uselist({ page: page.num }).then(res => {
          if (res.code == 200) {
            let arr = res.result;
            // 如果是第一页需手动置空列表
            if (page.num === 1) this.use_couponlist = [];
            // 把请求到的数据添加到列表
            this.use_couponlist = this.use_couponlist.concat(arr);
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              mescroll.endSuccess(arr.length);
            });
          } else {
            mescroll.endErr();
          }
        });
      }

    },
    tab_change (e) {
      this.tab_active = e;
      this.couponlist = []// 在这里手动置空列表,可显示加载中的请求进度
      this.use_couponlist = []// 在这里手动置空列表,可显示加载中的请求进度
      this.mescroll.resetUpScroll() // 刷新列表数据
    },
    get_couponlist () {               //未使用优惠券列表
      this.$api.getShop.get_coupon_list({}).then(res => {
        if (res.code == 200) {
          this.couponlist = res.result;
        }
      })
    },
    get_use_couponlist () {           //已使用的优惠券
      this.$api.getShop.get_coupon_uselist({}).then(res => {
        if (res.code == 200) {
          this.use_couponlist = res.result;

        }
      })
    },
  },
  filters: {
    del_time (val) {
      var arg = val.split(" ");
      return arg[0];
    }
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
}
</script>

<style scoped>
.coupon_bg {
  background-color: #ffffff;
}
#coupon {
  height: 100%;
}
.coupon_top {
  width: 94.5%;
  height: 40px;
  margin: 10px auto 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eeeeee;
  padding: 0 10px;
}
.coupon_top > p {
  font-size: 20px;
  font-weight: normal;
}
.coupon_icon {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.coupon_icon img {
  width: 20px;
  margin-right: 10px;
}
.coupon_icon p {
  font-size: 14px;
  color: #000000;
}
.coupon_top_right {
  font-size: 18px;
  color: #999999;
}
.coupon_body {
  width: 94.5%;
  margin: 10px auto 0 auto;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
}
.coupon_body > div {
  width: 100%;
}
.coupon_item {
  width: 100%;
  height: 110px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #eeeeee;
  border-left: none;
  margin-bottom: 10px;
}
.coupon_item1 {
  border-left: 1px solid #eeeeee;
}
.coupon_left {
  width: 35%;
  position: relative;
}

.coupon_left img {
  width: 100%;
  height: 110px;
  z-index: 2;
}
.coupon_left_shop {
  padding: 5px;
}
.coupon_left_content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 60%;
  height: 100%;
  z-index: 10;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.coupon_left_content p:nth-of-type(1) {
  color: #ffffff;
  font-size: 40px;
  line-height: 32px;
}
.coupon_left_content p:nth-of-type(1) span {
  font-size: 26px;
  color: #ffffff;
}
.coupon_left_content p:nth-of-type(2) {
  font-size: 10px;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
}
.coupon_right {
  width: 65%;
  padding: 0 10px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.coupon_right_top {
  width: 100%;
  height: 35px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.coupon_right_top span {
  height: 20px;
  line-height: 20px;
  font-size: 10px;
  color: #ffffff;
  border-radius: 15px;
  background-color: #45cbc4;
  text-align: center;
}
.coupon_right_top p {
  width: 100%;
  font-size: 14px;
  color: #000;
  font-weight: bold;
  height: 46px;
  line-height: 46px;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  white-space: nowrap;
}
.coupon_right_middle {
  /* height: 45px; */
  padding-bottom: 10px;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #eeeeee;
}
.coupon_right_middle p {
  font-size: 10px;
  line-height: 1;
  color: #000;
}
.coupon_right_bottom button,
.coupon_right_middle button {
  font-size: 10px;
  height: 22px;
  padding: 0px 10px;
  border: 1px solid #45cbc4;
  border-radius: 10px;
  line-height: 22px;
  background-color: transparent;
  color: #45cbc4;
}
.coupon_right_bottom {
  width: 100%;
  height: 35px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.coupon_right_bottom p {
  font-size: 14px;
}
.coupon_right_bottom_icon {
  font-size: 12px;
  color: #ffffff;
  background-color: #dadada;
  border-radius: 50%;
  padding: 2px;
}
</style>