<template>
  <div class="container integral_bg">
    <div class="integral_top">
      <van-icon name="arrow-left" size="24px" color="#000000" @click="toBack" style="margin-right:0.3rem"></van-icon>
      <van-search shape="round" style="flex:1;width: 100%; height:30px;font-size=12px;line-height: 20px;padding:0;text-align:left"
        v-model="search_title" placeholder="请输入搜索关键词" @search="search_shop"></van-search>
    </div>

    <van-sticky>
      <van-tabs v-model="active" @change="checkTabs">
        <van-tab v-for="(cate,c) in cateList" :title="cate.title" :name="cate.id" :key="c"></van-tab>
      </van-tabs>
    </van-sticky>

    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" id="integral">
      <waterfall :col="2" :gutterWidth="0" :gutterHeight="20" :data="dataList" style="padding:5.5px;margin: 0 auto;display: flex;justify-content: space-between;align-items: flex-start;">
        <template>
          <div class="integral_box" v-for="(item,i) in dataList" :key="i">
            <router-link :to="'/shop/shopdetails?tid='+appusers.uid+'&id='+item.id">
              <integralItem :shop="item"></integralItem>
            </router-link>
          </div>
        </template>
      </waterfall>
    </mescroll-vue>
  </div>
</template>
<script>
  import {
    Tab,
    Tabs,
    Sticky
  } from "vant";
  import MescrollVue from "mescroll.js/mescroll.vue";
  import integralItem from "@/components/shop/integral/integral_shop_item";
  export default {
    name: "integral_shop",
    data() {
      return {
        cateList: [],
        cateId: "",
        active: "",
        is_search: false,
        search_title: "",
        dataList: [],
        mescroll: null, // mescroll实例对象
        mescrollDown: {
          use: false
        }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: {
          loadFull: {},
          // 上拉加载的配置.
          callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          //以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 10 //每页数据条数,默认10
          },
          htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
          noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
          toTop: {
            //回到顶部按钮
            warpId: "integral",
            src: require("../../../assets/img/top.png"), //图片路径,默认null,支持网络图
            offset: 1000 //列表滚动500px才显示回到顶部按钮
          },
          empty: {
            //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: "integral", //父布局的id (1.3.5版本支持传入dom元素)
            icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
            tip: "暂无相关数据~" //提示
          }
        }
      };
    },
    components: {
      [Sticky.name]: Sticky,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      MescrollVue,
      integralItem
    },
    created() {
      this.getIntegralCate();
    },
    methods: {
      checkTabs(name, title) {
        this.cateId = name;
        if (this.mescroll) {
          this.dataList = [];
          this.mescroll.resetUpScroll();
        }
      },
      getIntegralCate() {
        this.$api.getShop.integral_cate_lists_all({}).then(res => {
          if (res.code == 200) {
            this.cateList = res.result;
            if (this.cateList && this.cateList[0]) {
              this.cateId = this.cateList[0].id;
              if (this.mescroll) {
                this.mescroll.resetUpScroll();
              }
            }
          }
        });
      },
      search_shop() {
        this.is_search = true;
        this.dataList = []; // 在这里手动置空列表,可显示加载中的请求进度
        this.mescroll.resetUpScroll(); // 刷新列表数据
      },
      mescrollInit(mescroll) {
        this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      },
      upCallback(page, mescroll) {
        if (this.cateId == "") {
          mescroll.endErr();
          return;
        }
        var params = {};
        params.page = page.num;
        params.title = this.search_title || "";
        params.cate = this.cateId;
        this.$api.getShop.get_integralshop(params).then(res => {
          if (res.code == 200) {
            let arr = res.result;
            // 如果是第一页需手动置空列表
            if (page.num == 1) this.dataList = [];
            // 把请求到的数据添加到列表
            this.dataList = this.dataList.concat(arr);
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
    beforeRouteEnter(to, from, next) {
      // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      });
    },
    beforeRouteLeave(to, from, next) {
      // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
      this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
      next();
    }
  };
</script>
<style scoped>
  #integral {
    background: #f4f4f4;
  }

  .integral_bg {
    background-color: #f4f4f4;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
  }

  .integral_top {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 44px;
    background-color: #ffffff;
  }

  .van-field__body {
    height: auto;
    line-height: auto;
  }

  .integral_body {
    width: 96%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    min-height: 100%;
  }

  .integral_box {
    padding: 0 5px;
    margin-top: 10px;
  }
</style>
