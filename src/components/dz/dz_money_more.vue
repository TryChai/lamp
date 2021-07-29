<template>
  <div class="templeIntroduction" id="templeIntroductionid">
    <van-nav-bar title="功德海" left-arrow @click-left="toBack" />
    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      id="supplier"
      class="fx_3"
    >
      <div class="seabg">
        <img src="../../assets/img/project/seabg.jpg" />
        <div class="footer_button2" @click="show = true">
          <img src="../../assets/img/project/button2.png" alt="" />
        </div>
      </div>
      <public-item
        style="
          background: #fff;
          margin-bottom: 10px;
          padding-left: 10px;
          padding-right: 10px;
        "
        v-for="(item, index) in list"
        :key="index"
        :item="item"
      />
    </mescroll-vue>
     <van-popup
      v-model="show"
      get-container="body"
      position="bottom"
      :overlay="true"
      class="footer_pop"
      
    >
      <clickpop @r_value="r_value" :radio_value1="radio_value" @random="random" @showgdz="show_gdz=true" ></clickpop>
    </van-popup>
     <van-popup
      v-model="show_gdz"
      :style="{ height: '100%', width: '100%' }"
      get-container="body"
      position="right"
    >
      <information
        @close_information="show_gdz = false"
        @getAddressItem="getAddressItem"
        :isShop="true"
        @back="getback"
        :isOrder="true"
        v-if="show_gdz"
        :radio_value="radio_value"
        :randomNumber="randomNumber"
        @change_radio="change_radio"
      />
      <addAddres
        @getAddressItem="getAddressItem"
        @back="getback"
        :item="{}"
        :isOrder="true"
        v-else
      />
    </van-popup>
  </div>
</template>
<script>
import indexshoplist from "@/components/shop/shopindex/indexshoplist_dz.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
import PublicItem from "./currency/publicItem.vue";
import clickpop from '@/components/dz/currency/click_pop';
import information from "@/components/dz/dz_information";
import addAddres from "@/components/setting/addAddres";
export default {
  name: "dz_index",
  data() {
    return {
      show: false,
      value: null,
      list: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false,
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        // use:false,
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10, //每页数据条数,默认10
        },
        loadFull: {
          use: false,
          delay: 1500,
        },
        htmlNodata: "",
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "templeIntroductionid",
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000, //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "supplier", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无更多商品~", //提示
        },
      },
      //新增
      isVideoShow: true,
      playOrPause: true,
      video: null,
      iconPlayShow: true,
      randomNumber: 0,
      current: 0,
      radio_value: "1",
      donationList: [],
      is_show_menu:false,
      show_gdz:false,
    };
  },
  components: {
    indexshoplist,
    MescrollVue,
    PublicItem,
    clickpop,
    information,
    addAddres
  },
  mounted() {},
  methods: {
    change_radio(val){
      this.radio_value=val;
    },
    r_value(val){
      this.radio_value=val;//是否匿名
    },
    random(val){
      this.randomNumber=val;//随机值
    },
    getback() {
      this.show_gdz = false;//关闭功德主页面
    },
    getAddressItem(item) {},
    showPopup() {
      this.show = true;
    },
    pay_gdz(val) {
      let param = {};
      param.aid = val;
      param.money = this.randomNumber;
      param.is_anonymous = this.radio_value;
      // param.tshare = this.tshare;
      param.id = this.$route.query.id;
      // param.is_integral = this.is_integral;
      // if (this.redEnvelopes) {
      //   param.red_id = this.redEnvelopes.id;
      // }
      this.$dialog
        .confirm({
          title: "是否供奉",
          message: "确定供奉S$" + this.randomNumber + "吗？",
        })
        .then(() => {
          this.show = false;
          this.$api.getZhanYe.submit_zhanye_pay(param).then((res) => {
            //缴费
            if (res.code == 200) {
              this.$toast.success("提交订单成功", 1000);
              setTimeout(() => {
                this.$router.push({
                  path: "/order/payorder",
                  query: {
                    id: res.result,
                  },
                });
              }, 1000);
            }
          });
        })
        .catch(() => {});
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      var params = {};
      params.id = this.$route.query.id || "";
      params.page = page.num;
      this.$api.getDz.get_donation_record(params).then((res) => {
        if (res.code == 200) {
          let arr = res.result.data;
          // 如果是第一页需手动置空列表
          if (page.num == 1) this.list = [];
          // 把请求到的数据添加到列表
          this.list = this.list.concat(arr);
          console.log(this.list);
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
    },
  },
};
</script>
<style lang="less" scoped>
.footer_pop {
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  height: auto;
  max-height: 650px;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  background-image: url(../../assets/img/project/popimg.png);
  background-size: 100%;
  background-repeat: no-repeat;
}
.templeIntroduction {
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}
/deep/.van-nav-bar .van-icon {
  color: #333;
}
.fx_3 {
  margin-bottom: 50px;
}
.seabg {
  width: 100%;
  height: 200px;
  position: relative;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}
.footer_button2 {
  padding: 0px 50px;
  position: absolute;
  bottom: 20px;
  height: 40px;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>