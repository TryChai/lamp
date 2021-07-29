<template>
  <!-- 资金流水 -->
  <div class="income1">
    <van-nav-bar title="我的功德值" left-text left-arrow class="navbar" @click-left="toBack">
      <template #right>
        <van-icon name="replay" size="20px" color="#000" @click="refresh" />
      </template>
    </van-nav-bar>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scol news_srcoll" id="income">
      <div class="cumulative">
        <div class="cum_top">
          <div class="top_left">
            <p>{{idenObj['integral'] || $store.state.config.shop.integral_cn }}总额</p>
            <p>
              {{$fnc.toFixedZ(user.integral,0)}}
              <!-- <span>元</span> -->
            </p>
          </div>
          <div class="top_right">
            <p v-if="index_data.is_withdraw == 1 || index_data.is_withdraw == '1'">
              <van-button type="default" @click="$router.push('/pay/withdraw')">提现</van-button>
            </p>
            <p v-if="index_data.is_recharge == 1 || index_data.is_recharge == '1'">
              <van-button type="default" @click="$router.push('/pay/recharge')">充值</van-button>
            </p>
          </div>
        </div>
        <!-- <div class="cum_bottom">
          <div v-if="idenObj.amount">
            <p>{{$fnc.toFixedZ(user.amount,2)}}</p>
            <p>{{idenObj['amount']}}结余</p>
          </div>
          <div v-if="idenObj.integral">
            <p>{{$fnc.toFixedZ(user.integral,0)}}</p>
            <p>{{idenObj['integral'] || $store.state.config.shop.integral_cn }}结余</p>
          </div>
          <div style="border: none;padding-right: 0;" v-if="idenObj.money">
            <p>{{$fnc.toFixedZ(user.money,2)}}</p>
            <p>{{idenObj['money']}}结余</p>
          </div>
        </div> -->
      </div>

      <div class="reward_list">
        <div class="reward">
          <p>
            <img src="../../assets/img/price_bai.jpg" alt />
            {{value}}流水
          </p>
          <!-- <div class="fx reward_select" @click="show = true;">
            <span>{{value}}</span>
            <van-icon name="arrow-down" />
          </div> -->
          <van-popup v-model="show" get-container="body" round position="bottom">
            <van-picker show-toolbar value-key="title" :columns="option2" @cancel="show = false" @confirm="getvalue" />
          </van-popup>
        </div>
        <div class="record_item" id="income_record">
          <div v-for="(item,y) in income_data" :key="y" style="padding:15px 0 ;border-top: 1px solid #f7f7f7">
            <div class="record_item_bottom">
              <p>
                <van-icon name="orders-o" color="#99c8d5" size="16px" />订单：
                <span>{{item.oid}}</span>
              </p>
              <!-- <button   :data-clipboard-text="item.oid" data-clipboard-action="copy"  @click="copy_link(item.oid)">点击复制</button> -->
              <van-icon name="newspaper-o" color="#ddd" size="24px" class="income_box_copy_btn" :data-clipboard-text="item.oid"
                  data-clipboard-action="copy" @click="copy_link(item.oid)" />
            </div>
            <div class="record_item_bottom">
              <p>
                <van-icon name="bill-o" color="#99c8d5" size="16px" />类型：
                <span>{{item.style}}</span>
              </p>
              <p>
                <span v-if="item.types == 1" class="addMoney">+{{$fnc.toFixedZ(item.money,3)}}</span>
                <span v-if="item.types == 2" class="delMoney">-{{$fnc.toFixedZ(item.money,3)}}</span>
              </p>
            </div>

            <div class="record_item_bottom">
              <!-- <p>
                <van-icon name="location-o" color="#99c8d5" size="16px" />来源：
                <span>{{item.ly_nickname?(item.ly_nickname+'').slice(0,8) : ($store.state.user.nickname+'').slice(0,8)+'(自己)'}}</span>
              </p> -->
              <p>{{' '+$fnc.getTimeFormat(item.created_time)}}</p>
              <p>
                剩余：
                <span class="pay-black">{{' '+$fnc.toFixedZ(item.balance,3)}}</span>
              </p>
            </div>

            <!-- <div class="record_item_bottom">
              <p></p>
              <p>{{' '+$fnc.getTimeFormat(item.created_time)}}</p>
            </div> -->
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import { Picker } from "vant";
export default {
  data () {
    return {
      idenObj: {},
      income_data: {},
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        mustToTop: true,
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10, //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 0, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "income_bg",
          src: require("../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000, //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "income_record", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~", //提示
        },
      },
      index_data: {},
      reward: this.$route.query.iden,
      option2: [],
      user: this.$store.state.user,
      value: this.$route.query.iden, //类型
      show: false, //显示下拉
    };
  },
  components: {
    MescrollVue,
    [Picker.name]: Picker,
  },
  beforeRouteEnter (to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next((vm) => {
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
  methods: {
    getindex1 () {
      this.$api.getPay.getincome_index({}).then((res) => {
        if (res.code == 200) {
          this.index_data = res.result;
        }
      });
    },
    getvalue (item) {
      this.value = item.title;
      this.reward = item.iden;
      if (this.mescroll) {
        this.mescroll.resetUpScroll();
      }
      this.show = false;
    },
    refresh () {
      //刷新页面
      this.$store.dispatch("getUser");
      setTimeout(() => {
        this.user = this.$store.state.user;
      }, 1000);
      if (this.mescroll) {
        this.mescroll.resetUpScroll();
      }
    },
    getindex () {
      this.$api.getPay.getFundsCate({}).then((res) => {
        if (res.code == 200) {
          //返回的数据
          this.option2 = res.result;
          var option = {}; //下拉对象
          option.title = "全部奖励";
          option.iden = "";
          this.option2.unshift(option);
          //获取从会员中心点击进来的值
          let iden = this.$route.query.iden;
          this.idenObj = {};
          for (let i = 0; i < this.option2.length; i++) {

            this.idenObj[this.option2[i].iden] = this.option2[i].title;

            if (iden == this.option2[i].iden) {
              this.value = this.option2[i].title;
              return;
            }
          }
        }
      });
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback (page, mescroll) {
      // this.type = this.type || this.$route.query.iden;
      this.$api.getPay
        .get_running_water({
          page: page.num,
          iden: this.reward,
          // iden: this.value
        })
        .then((res) => {
          if (res.code == 200) {
            let arr = res.result;
            // 如果是第一页需手动置空列表
            if (page.num === 1) this.income_data = [];
            // 下拉刷新
            // 把请求到的数据添加到列表
            this.income_data = this.income_data.concat(arr);
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              mescroll.endSuccess(arr.length);
            });
          } else {
            mescroll.endErr();
          }
        });
    },
  },
  created () {
    this.getindex();
    this.getindex1();
  },
};
</script>

<style lang="less" scoped>
@import "./../../assets/css/pay.css";

.income_bg {
  height: 100%;
  overflow: auto;
}

.news_srcoll {
  position: fixed;
  top: 46px;
}

.income1 {
  height: 100%;
  overflow: auto;
  background: #f6f6f6;

  .cumulative {
    background: url("../../assets/img/ykb/01.jpg") no-repeat;
    background-size: 100% 100%;
    margin: 12px;
    padding: 20px 15px;
    border-radius: 10px;

    .cum_top {
      display: flex;
      justify-content: space-between;
      color: #fff;

      .top_left {
        font-size: 16px;

        p:nth-of-type(2) {
          font-size: 28px;
          font-weight: bold;

          span {
            font-weight: 400;
            font-size: 14px;
          }
        }
      }

      .top_right {
        line-height: 36px;

        .van-button--default {
          width: 75px;
          height: 25px;
          color: #fc4366;
          border-radius: 15px;
        }
      }
    }

    .cum_bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      color: #fff;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding-top: 15px;
      > div:last-child {
        border-right: none;
      }
      > div {
        flex: 1;
        text-align: center;
        line-height: 24px;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
        // padding-right: 30px;

        p:nth-of-type(1) {
          font-weight: bold;
          font-size: 20px;
        }

        p:nth-of-type(2) {
          font-size: 14px;
        }
      }
    }
  }

  .reward_list {
    margin: 12px;
    background: #fff;

    .reward {
      display: flex;
      justify-content: space-between;
      background: #fff7f4;
      height: 53px;
      align-items: center;
      padding: 0 15px;

      p {
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;

        img {
          width: 25px;
          margin-right: 5px;
        }
      }

      .reward_select {
        background: #fff;
        padding: 0 12px;
        font-size: 14px;
        border-radius: 20px;
        .van-icon {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
