<template>
  <div class="templeIntroTwo">
    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      id="mescroll"
    >
      <div class="header_img_com" v-if="info.img_json != ''">
        <van-swipe
          :show-indicators="false"
          :autoplay="0"
          class="shop_swipe"
          @change="onChange"
        >
          <!-- <van-swipe-item
          style="height: 100%;"
          v-if="info.img_json && info.img_json != ''"
          class="shop_swipe-item"
        >
          <div>
            <video
              v-show="!isVideoShow"
              v-if="!$fnc.isYkAPP()"
              class="video_box shop_swi_img"
              :class="{ play1: iconPlayShow }"
              width="100%"
              id="videoCloud"
              ref="videoshow"
              height="100%"
              x5-playsinline
              playsinline
              webkit-playsinline
              x-webkit-airplay="allow"
              preload="auto"
              :src="info.img_json[0].piclink"
              @click="pauseVideo"
              @ended="onPlayerEnded($event)"
              loop="loop"
            ></video>
            <img
              v-show="iconPlayShow"
              v-if="!$fnc.isYkAPP()"
              class="icon_play"
              @click="playvideo"
              src="../../../assets/img/play.png"
              style="width: 48px; height: 48px; z-index: 1000"
            />
            <img
              v-show="isVideoShow"
              @click="playvideo"
              :src="info.img_json[0].piclink"
              v-if="!$fnc.isYkAPP()"
              class="play play1"
            />
            <video-default
              class="video_box"
              direction="vertical"
              :url="info.img_json[0].piclink"
              :video_pic="info.img_json[0].piclink"
              v-else
            />
          </div>
        </van-swipe-item> -->
          <van-swipe-item
            v-for="(item, index) in info.img_json"
            :key="index"
            style="position: relative; height: 270px"
            class="shop_swipe-item"
            @click="imagePreview(info.img_json, index)"
          >
            <img v-lazy="item.piclink" class="shop_swi_img" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <div class="temple_name_info">
        <p>
          <span>{{
            info.status == "0"
              ? "未开始"
              : info.status == "1"
              ? "进行中"
              : "已结束"
          }}</span
          >{{ info.title }}
        </p>
      </div>

      <div class="temple_detail">
        <div class="title">
          <div><img :src="$fnc.getImgUrl(info.shop.shop_logo)" alt="" /></div>
          <div>
            <p>{{ info.shop.shop_title }}</p>
            <p>已有{{ info.shop.shop_visits || 0 }}人到访过</p>
          </div>
          <div>
            <img src="./../../assets/img/project/temple3.png" alt="" />
          </div>
        </div>
        <van-divider />
        <div class="temple_con" v-html="info.content"></div>
      </div>

      <div class="jingzhan">
        <div class="jingzhan_title">
          <img src="./../../assets/img/project/t1.png" alt="" />
          <p>进展动态</p>
        </div>

        <div class="jingzhan_detail" v-if="comment != ''">
          <showItem
            class="dtail_item"
            v-for="(item, i) in comment"
            :key="i"
            :info="item"
            @open_detail="rec_open"
            @open_str="open_str"
          ></showItem>
        </div>
        <!-- <div>查看更多</div> -->
        <div v-else>
          <van-empty description="还没有进展动态~" />
        </div>
      </div>

      <div class="ranking_con" style="margin-top: 10px">
        <div class="title">
          <div
            class=""
            @click="
              rankingtype = 1;
              mescroll.resetUpScroll();
            "
            :class="{ ranking_style: rankingtype == 1 }"
          >
            <img src="./../../assets/img/project/left_img2.png" alt="" />
            <p>参与动态</p>
            <img src="./../../assets/img/project/right_img2.png" alt="" />
          </div>
          <div
            @click="
              rankingtype = 2;
              mescroll.resetUpScroll();
            "
            :class="{ ranking_style: rankingtype == 2 }"
          >
            <p>功德榜</p>
          </div>
        </div>
      </div>
      <div class="ranking_con" style="padding-bottom: 30px;">
        <public-item
          v-show="dynamicList != '' && rankingtype == 1"
          v-for="(n, index) in dynamicList"
          :key="index"
          :item="n"
        ></public-item>
        <!-- </div> -->

        <!-- <div v-show="dynamicList == ''">
          <van-empty description="还没有参与动态~" />
        </div> -->
        <!-- <div class="rankingList" v-if="rankingtype == 2">
          <div
            
          > -->
            <public-item v-show="rankingList != '' && rankingtype == 2"
            v-for="(n, index) in rankingList"
            :key="index" :type="2" :item="n"></public-item>
          <!-- </div>
        </div> -->
      </div>

      <div class="footer_button2" @click="showPopup">
        <img src="./../../assets/img/project/bbg.png" alt="" />
        <p>点此供奉</p>
      </div>
      <van-popup
        v-model="showDetail"
        position="top"
        class="detail_pop"
        :close-on-popstate="true"
        :style="{ width: '100%', height: '100%', 'background-color': 'black' }"
      >
        <showDetail
          @currency="currency"
          :swipestart="swipestart"
          @close_pop="rec_close"
          @touch_change="rec_touch"
          :detail="detail"
        ></showDetail>
      </van-popup>
      <van-popup v-model="show" class="footer_pop footer_pop_box" position="bottom">
        <shopDetailsSku
          :shopInfo="info"
          @show_sy="show_sy"
          @closePop="getClosePop"
          :toAut="index"
        />
      </van-popup>
      <van-popup
        v-model="show_pop"
        get-container="body"
        position="bottom"
        :overlay="true"
        class="footer_pop"
      >
        <clickpop
          @r_value="r_value"
          :radio_value1="radio_value"
          @random="random"
          @showgdz="show_gdz = true"
          :item="info"
        ></clickpop>
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
      <van-popup
        v-model="is_show_menu"
        get-container="body"
        position="left"
        :overlay="true"
        style="
          border-radius: 5px 5px 0 0;
          height: 100%;
          width: 80%;
          overflow: visible;
        "
      >
        <dzmenu @close_menu="is_show_menu = false"></dzmenu>
      </van-popup>
      <onlinebtn @is_show="is_show_menu = true"></onlinebtn>
    </mescroll-vue>
  </div>
</template>
<script>
import videoDefault from "@/components/currency/videoDefault.vue";
import shopDetailsSku from "@/components/shop/shopdetails/shopdetailssku_dz";
import {
  Swipe,
  SwipeItem,
  Image,
  ImagePreview,
  Stepper,
  Empty,
  Field,
} from "vant";
import PublicItem from "./currency/publicItem.vue";
import clickpop from "@/components/dz/currency/click_pop";
import information from "@/components/dz/dz_information";
import addAddres from "@/components/setting/addAddres";
import showDetail from "@/components/shop/buyers/show_detail_dz";
import showItem from "@/components/shop/buyers/show_item_dz";
import onlinebtn from "@/components/currency/onlinebtn";
import dzmenu from "@/components/dz/dz_menu.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
import Cookies from "js-cookie";
export default {
  name: "dz_details",
  data() {
    return {
      show_gdz: false,
      show_pop: false,
      show: false,
      rankingtype: 1,
      value: 1,
      //新增
      info: {
        shop: {},
      },
      //新增
      show: false,
      value: null,
      isVideoShow: true,
      playOrPause: true,
      video: null,
      iconPlayShow: true,
      comment: [],
      dynamicList: [], //参与动态
      rankingList: [], //功德榜
      number: "",
      index: 1,
      radio_value: "1",
      radio_change: false,
      nickname:
        this.$store.state.user.nickname || this.$store.state.user.username,
      nickname1: "匿名",
      donationList: [],
      randomNumber: 0,
      current: 0,
      show: false, //详情页
      detail: {
        piclink: [],
        video: "",
        video_piclink: "",
      },
      showDetail: false,
      swipestart: "",
      is_show_menu: false,
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false,
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
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          warpId: "mescroll",
          src: require("../../assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000, //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "mescroll", //父布局的id (1.3.5版本支持传入dom元素)
          icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
          tip: "暂无相关数据~", //提示
        },
      },
      beforeRouteEnter(to, from, next) {
        // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
        next((vm) => {
          // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
          vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
        });
      },
      beforeRouteLeave(to, from, next) {
        // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
        this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
        next();
      },
    };
  },
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Image.name]: Image,
    videoDefault,
    [Stepper.name]: Stepper,
    shopDetailsSku,
    PublicItem,
    [Empty.name]: Empty,
    [Field.name]: Field,
    clickpop,
    information,
    addAddres,
    showDetail,
    showItem,
    onlinebtn,
    dzmenu,
    MescrollVue,
  },
  mounted() {},
  created() {
    this.getShopDetails(this.$route.query.id);
    this.getList();
    // this.get_product_dynamic();
    // this.get_product_ranking();
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      if (this.rankingtype == 1) {
        //商品收藏
        this.$api.getDz
          .get_product_dynamic({
            page: page.num,
            page_size: page.size,
            id: this.$route.query.id,
          })
          .then((res) => {
            if (res.code == 200) {
              let arr = res.result.data;
              // 如果是第一页需手动置空列表
              if (page.num === 1) this.dynamicList = [];
              // 把请求到的数据添加到列表
              this.dynamicList = this.dynamicList.concat(arr);
              // 数据渲染成功后,隐藏下拉刷新的状态
              this.$nextTick(() => {
                mescroll.endSuccess(arr.length);
              });
            } else {
              mescroll.endErr();
            }
          });
      } else if (this.rankingtype == 2) {
        this.$api.getDz
          .get_product_ranking({
            page: page.num,
            page_size: page.size,
            id: this.$route.query.id,
          })
          .then((res) => {
            if (res.code == 200) {
              let arr = res.result;
              // 如果是第一页需手动置空列表
              if (page.num === 1) this.rankingList = [];
              // 把请求到的数据添加到列表
              this.rankingList = this.rankingList.concat(arr);
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
    imagePreview(src, index) {
      var arr = [];
      for (var i in src) {
        arr.push(this.$fnc.getImgUrl(src[i].piclink));
      }
      ImagePreview({ images: arr, startPosition: Number(index) });
    },
    change_radio(val) {
      this.radio_value = val;
    },
    currency(val) {
      this.swipestart = val;
    },
    open_str(obj) {
      if (obj.str == "video") {
        this.swipestart = 0;
      } else {
        if (obj.is_video) {
          this.swipestart = obj.str + 1;
        } else {
          this.swipestart = obj.str;
        }
      }
    },
    rec_touch(val) {
      if (this.detail.id && this.detail.id != 0) {
        let i = this.comment.findIndex((item) => {
          return item.id == this.detail.id;
        });
        if (i >= 0) {
          var new_i = val == 1 ? Number(i) + 1 : Number(i) - 1; //新的索引
          if (new_i >= 0 && new_i < this.comment.length) {
            this.detail = this.comment[new_i];
          }
        }
      }
    },
    rec_open(info) {
      this.showDetail = true;
      this.detail = info;
    },
    rec_close() {
      this.showDetail = false;
      this.detail = {
        piclink: [],
        video: "",
        video_piclink: "",
      };
    },
    //新增
    r_value(val) {
      this.radio_value = val; //是否匿名
    },
    random(val) {
      this.randomNumber = val; //随机值
    },
    getback() {
      this.show_gdz = false;
    },
    getAddressItem(item) {},
    show_sy(e) {
      this.show_pop = e; //sku善缘
    },
    recharge_submit(val) {
      let param = {};
      param.aid = val;
      param.cid = this.$route.query.id;
      param.money = this.randomNumber;
      param.is_anonymous = this.radio_value;
      param.id = this.info.sid;
      this.$dialog
        .confirm({
          title: "是否随喜",
          message: "确定随喜" + this.randomNumber + "吗？",
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
    radioChange() {
      this.radio_change = true;
    },
    radioClick() {
      if (!this.radio_change) {
        this.radio_value = "";
      }
      this.radio_change = false;
    },

    getClosePop() {
      this.show = false;
    },
    big_img(i) {
      var arr = [];
      this.detail.piclink.forEach((item) => {
        arr.push(this.$fnc.getImgUrl(item.piclink));
      });

      ImagePreview({ images: arr, startPosition: Number(i) });
    },
    playvideo(event) {
      let video = document.querySelector("video");
      this.isVideoShow = false;
      this.iconPlayShow = false;
      video.play();
      window.onresize = function () {};
    },
    pauseVideo() {
      //暂停\播放
      let video = this.$refs.videoshow;
      if (this.playOrPause && video) {
        video.pause();
        this.iconPlayShow = true;
        this.playOrPause = !this.playOrPause;
      } else {
        video.play();
        this.iconPlayShow = false;
        this.playOrPause = !this.playOrPause;
      }
    },
    onPlayerEnded(player) {
      //视频结束
      this.isVideoShow = true;
      this.current += this.current;
    },
    onChange(index) {
      this.current = index;
    },
    showPopup() {
      var user = Cookies.get("user") ? true : false; // 得到登陆状态 false是已登录;
      if(user){
        this.show = true;
      }else{
        this.$router.replace({ path: "/login" });
      }
    },
    getShopDetails(id) {
      var params = {};
      params.id = id || "";
      this.$api.getShop.getShopDetails(params).then((res) => {
        if (res.code == 200) {
          this.info = res.result;
        }
      });
    },
    getList() {
      var params = {};
      params.id = this.$route.query.id || "";
      this.$api.getShop.getComment(params).then((res) => {
        if (res.code == 200) {
          this.comment = res.result;
        }
      });
    },
    get_product_dynamic() {
      var params = {};
      params.id = this.$route.query.id || "";
      this.$api.getDz.get_product_dynamic(params).then((res) => {
        if (res.code == 200) {
          this.dynamicList = res.result.data;
        }
      });
    },
    get_product_ranking() {
      var params = {};
      params.id = this.$route.query.id || "";
      this.$api.getDz.get_product_ranking(params).then((res) => {
        if (res.code == 200) {
          this.rankingList = res.result;
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
  // background-position: 50% 12px;
}
.templeIntroTwo {
  height: 100%;
  overflow: auto;
  background-color: #f4f4f4;
  padding-bottom: 20px;
  .header_img_com {
    width: 375px;
    height: 249px;
    > img {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }
  .temple_name_info {
    background-color: #fff;
    padding: 10px;
    > p {
      font-size: 15px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      color: #333333;
      line-height: 23px;
      > span {
        position: relative;
        top: -1px;
        margin-right: 5px;
        width: 50px;
        height: 19px;
        padding: 1px 3px;
        opacity: 1;
        background: #feebeb;
        border: 1px solid #f35353;
        border-radius: 10px;
        font-size: 12px;
        line-height: 19px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #f35353;
        // background-image: url('../../assets/img/project/label_icon.png');
        // background-size: 100%;
      }
    }
  }
  .temple_detail {
    background-color: #fff;
    padding: 10px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div:first-of-type {
        width: 40px;
        height: 40px;
        opacity: 1;
        background: rgba(0, 0, 0, 0);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        overflow: hidden;
        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      > div:nth-of-type(2) {
        margin-left: 8px;
        margin-right: auto;
        > p:first-of-type {
          font-size: 15px;
          font-family: PingFang SC, PingFang SC-Bold;
          font-weight: 700;
          color: #333333;
          line-height: 15px;
        }
        > p:last-of-type {
          margin-top: 8px;
          font-size: 13px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #666666;
          line-height: 13px;
        }
      }
      > div:last-of-type {
        > img {
          width: 86px;
          height: 56px;
        }
      }
    }
    /deep/.van-divider {
      margin: 13px 0 0px 0px;
    }
  }
  /deep/.temple_con {
    width: 100%;
    overflow: auto;
    padding: 0px 5px 5px 0px;
    height: 100%;

    P {
      font-size: 12px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #787878;
      line-height: 20px;
      img {
        margin-top: 10px;
        width: 355px;
        height: 237px;
        object-fit: fill;
      }
    }
  }
  .jingzhan {
    margin-top: 10px;
    background-color: #fff;
    padding: 6px 10px 20px 10px;
    .jingzhan_title {
      width: 113px;
      position: relative;
      > img {
        width: 100%;
      }
      > p {
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 17px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        color: #ffffff;
        line-height: 18px;
        text-align: center;
      }
    }
    .jingzhan_detail {
      margin-top: 9px;
      padding-left: 47px;
      // border: 1px solid red;
      position: relative;
      .dtail_item {
        position: relative;
        z-index: 5px;
        padding-bottom: 20px;
        // border: 1px solid green;
        .name {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC-Bold;
          font-weight: 700;
          color: #333333;
          line-height: 15px;
        }
        .imglist {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          > img {
            width: 86px;
            height: 86px;
            opacity: 1;
            background: rgba(0, 0, 0, 0);
            border-radius: 5px;
            object-fit: cover;
            margin-right: 10px;
            margin-bottom: 8px;
          }
          > img:nth-child(3n + 3) {
            margin-right: 0;
          }
        }
        .time {
          position: relative;
          margin-top: 8px;
          font-size: 13px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #666666;
          line-height: 13px;
        }
      }
      .dtail_item:last-of-type {
        padding-bottom: 0;
        .time::before {
          content: "";
          position: absolute;
          z-index: 10;
          bottom: -4px;
          left: -40px;
          width: 28px;
          height: 20px;
          background-image: url(./../../assets/img/project/Lotus.png);
          background-repeat: no-repeat;
          background-size: 28px 20px;
        }
      }

      .dtail_item::before {
        content: "";
        position: absolute;
        top: -2px;
        left: -40px;
        width: 28px;
        height: 20px;
        background-image: url(./../../assets/img/project/Lotus.png);
        background-repeat: no-repeat;
        background-size: 28px 20px;
      }
      .dtail_item::after {
        content: "";
        position: absolute;
        z-index: 5px;
        top: 18px;
        left: -28px;
        height: 92%;
        width: 2px;
        background-color: #f88d73;
      }
    }
  }
  .ranking_con {
    //
    padding: 10px 10px 0px 10px;
    // overflow: auto;
    background-color: #fff;
    
    .title {
      // border: 1px solid #d5d5d5;
      border-radius: 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      // background-color: #d5d5d5;
      > div {
        flex: 1;
        height: 41px;
        > p {
          font-size: 17px;
          line-height: 18px;
          font-family: PingFang SC, PingFang SC-Bold;
          font-weight: 500;
          color: #999999;
          margin: 0 4px;
        }
      }
      > div:first-of-type {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #d5d5d5;
        border-right: 0;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        > img {
          width: 30px;
          height: 13px;
        }
      }
      > div:last-of-type {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #d5d5d5;
        border-left: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      .ranking_style {
        background-color: #ffa136;
        border: 0 !important;
        > p {
          color: #ffffff;
        }
      }
    }
    .rankingList {
      // padding-bottom: 80px;
      .rankingitem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 13px 0;
        > div:first-of-type {
          width: 42px;
          height: 42px;
          display: flex;
          justify-content: center;
          align-items: center;
          > img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        > div:nth-of-type(2) {
          margin-left: 10px;
          margin-right: auto;
          > p:first-of-type {
            font-size: 15px;
            font-family: PingFang SC, PingFang SC-Bold;
            font-weight: 700;
            color: #333333;
            line-height: 16px;
          }
          > p:last-of-type {
            margin-top: 8px;
            font-size: 13px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
            color: #999999;
            line-height: 14px;
          }
        }
        > div:last-of-type {
          font-size: 18px;
          font-family: PingFang SC, PingFang SC-Heavy;
          font-weight: 500;
          text-align: left;
          color: #333333;
          line-height: 18px;
        }
      }
      .rankingitem + .rankingitem {
        border-top: 1px solid #e4e4e4;
      }
    }
  }
  .footer_button2 {
    margin-top: 10px;
    padding: 0 10px;
    position: relative;
    // margin-bottom: 40px;
    // padding-bottom: 40px;
    position: fixed;
    bottom: 55px;
    z-index: 10;
    > img {
      width: 100%;
    }
    > p {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      font-size: 17px;
      line-height: 17px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .footer_pop {
    // border-top-left-radius: 20px;
    // border-top-right-radius: 20px;
    height: auto;
    max-height: 407px;
    // position: relative;
    padding: 18px 10px 20px 10px;
    display: flex;
    flex-direction: column;
    background-image: url(./../../assets/img/project/bg.png);
    background-size: 205px;
    background-repeat: no-repeat;
    background-position: 50%;
    .list_con {
      flex: 1;
      overflow: auto;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      padding-bottom: 9px;
      > div:first-of-type {
        width: 45px;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        overflow: hidden;
        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      > div:nth-of-type(2) {
        margin-left: 10px;
        margin-right: auto;
        > p:first-of-type {
          font-size: 16px;
          font-family: PingFang SC, PingFang SC-Bold;
          font-weight: 700;
          color: #333333;
          line-height: 18px;
        }
        > p:last-of-type {
          margin-top: 6px;
          font-size: 17px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #f35353;
          line-height: 18px;
          > span {
            font-size: 12px;
            line-height: 12px;
          }
        }
      }
    }
    .item + .item {
      border-top: 1px solid #dfdfdf;
    }
    .button {
      margin-top: 10px;
      width: 100%;
      position: relative;
      > img {
        width: 100%;
      }
      > p {
        font-size: 17px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        color: #ffffff;
        line-height: 18px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .footer_pop_box{
    border-radius: 0;
    padding: 10px;
  }
}

.shop_swi_img {
  width: 100%;
  height: 100%;
}
/deep/.van-swipe {
  height: 250px;
}

// /deep/.van-field__control {
//   color: #fff;
// }
.assess_form_radio {
  font-size: 14px;
  padding: 10px 16px 10px 16px;
  flex: 2;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.assess_form_radio_item {
  min-width: 45%;
}
.protocl {
  font-size: 14px;
}
/deep/.van-cell::after {
  border: none;
}
/deep/.nick .van-field__control {
  font-size: 17px;
}
/deep/.van-field__control:disabled {
  // -webkit-text-fill-color: #fff;
}
/deep/.van-icon-edit {
  color: #fff;
}
// 由于设置了get-contarin="body"要拿出来
.footer_pop1 {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  height: 100%;
  position: relative;
  width: 100%;
  background-image: url("../../assets/img/project/popimg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .footer_wrapper {
    position: absolute;
    display: flex;
    overflow: auto;
    top: 35px;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .user_img {
      width: 140px;
      height: 140px;
      opacity: 1;
      margin-top: 15px;
      background: rgba(0, 0, 0, 0);
      border: 0px solid #f99525;
      > img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }
    .dingwei {
      display: flex;
      flex-direction: column;
      .name {
        font-size: 17px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        color: #ffffff;
        line-height: 18px;
      }
      .price {
        margin-top: 10px;
        font-size: 39px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        color: #fced69;
        line-height: 40px;
        text-align: center;
        > span {
          font-size: 17px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #fced69;
          line-height: 18px;
        }
      }
    }
    .choose_set {
      display: flex;
      align-items: center;
      padding: 0 50px;
      width: 100%;
    }
    /deep/.van-cell {
      margin-top: 15px;
      width: 241px;
      height: 39px;
      opacity: 0.7;
      background: #bc0200;
      border-radius: 20px;
      > p {
        font-size: 17px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #ffffff;
      }
    }
    .input_con {
      margin-top: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 241px;
      height: 39px;
      opacity: 0.7;
      background: #bc0200;
      border-radius: 20px;
      padding: 0 22px;
      > input {
        flex: 1;
        background-color: transparent;
        border: 0;
      }
    }
    .buttonlist {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      .van-button:first-of-type {
        margin-right: 17px;
        width: 141px;
        height: 44px;
        opacity: 1;
        border: 2px solid #ead622;
        border-radius: 24px;
        background-color: transparent;
        .van-button__content {
          .van-button__text {
            font-size: 17px;
            font-family: PingFang SC, PingFang SC-Bold;
            font-weight: 700;
            color: #fced69;
            line-height: 18px;
          }
        }
      }
      .van-button:last-of-type {
        width: 178px;
        height: 44px;
        opacity: 1;
        background: #fced69;
        border-radius: 22px;
        .van-button__content {
          .van-button__text {
            font-size: 17px;
            font-family: PingFang SC, PingFang SC-Bold;
            font-weight: 700;
            color: #f64245;
            line-height: 18px;
          }
        }
      }
    }
  }
}
</style>