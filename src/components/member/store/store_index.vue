<template>
  <div class="store_index">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scol">
      <div class="store_index_info">
        <div class="store_index_info_left">
          <p>{{info.microshop_title || '---'}}</p>
          <!-- <div>
                        <span>TA的微信号：{{info.microshop_tel || '---'}}</span>
                        <span :data-clipboard-text="info.microshop_tel"
                            data-clipboard-action="copy"
                            class="copy"
                            @click="copy_key(info.microshop_tel)">复制</span>
                        <i class="fa fa-qrcode"
                            @click="get_shareimg"></i>
                    </div> -->
        </div>
        <div class="store_index_info_right">
          <img :src="$fnc.getImgUrl(info.microshop_logo)" alt />
        </div>
      </div>
      <div class="store_index_banner" v-if=" info && info.banner && info.banner.length > 0">
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(image, index) in info.banner" :key="index">
            <img :src="$fnc.getImgUrl(image)" alt="">
          </van-swipe-item>
        </van-swipe>

      </div>
      <div class="store_index_hot" v-if="hotlist && hotlist.length >0 ">
        <div class="store_index_hot_title">
          <p>精选商品 <span>生活百货</span></p>
          <div>
            <p @click="$router.push('/member/store/hot?mid='+ $route.query.mid)">更多商品
            </p>
            <van-icon name="arrow" />
          </div>
        </div>
        <p>又好有省钱，靠谱才推荐！</p>
        <div class="store_index_hot_shop" v-if="hotlist && hotlist.length >0 ">
          <div class="store_index_hot_shop_item" v-if="(i==0 || i ==1 || i ==2)" v-for="(item,i) in hotlist" :key="i">
            <div class="store_index_hot_shop_item_img">
              <img :src="$fnc.getImgUrl(item.piclink)" alt="">
            </div>
            <p>{{item.title || ''}}</p>

            <div class="price_regular" style="color:#ff2043;width: 100%;">
              <small>￥</small>
              <b>{{$fnc.get_int_dec(item.price,'int')}}</b>
              <i>{{$fnc.get_int_dec(item.price,'dec')}}</i>
            </div>
            <!-- <p>￥{{item.price || ''}}</p> -->
          </div>

        </div>
        <div v-else style="font-size: 14px;color: #a1a1a1;">
          暂无更多精选商品...
        </div>
      </div>
      <div class="store_index_more">
        <div class="store_index_more_title">
          <span></span>
          <span>掌柜推荐</span>
          <span></span>
        </div>
        <div class="store_index_more_shop">
          <shopitem :info="item" v-for="(item,i) in list" :key="i" />
        </div>
      </div>
    </mescroll-vue>
    <!-- <div class="store_box">
            <div class="store_top">
                <div class="store_top_img">
                    <img :src="$fnc.getImgUrl(info.microshop_logo)"
                        alt />
                </div>
                <div class="store_top_right">
                    <p>{{info.microshop_title || '---'}}</p>
                    <p>
                      
                        <span>{{info.rating_cn}}</span>
                    </p>
                    <p>
                        <van-icon name="location-o"
                            style="padding-top: 2px;"
                            size="18px"
                            color="#fff" />
                        {{info.microshop_ctrl}}
                    </p>
                    <p>
                        <van-icon name="chat-o"
                            size="18px"
                            color="#fff" />
                        {{info.microshop_tel}}
                        <span class="copy"
                            :data-clipboard-text="info.microshop_tel"
                            data-clipboard-action="copy"
                            @click="copy_key(info.microshop_tel)"
                            :style="{'background-color':info.microshop_colour || ''}">复制</span>
                    </p>
                </div>
            </div>
            <div class="store_bottom">
                <div class="store_bottom_left_btn"
                    :style="{'background-color':info.microshop_colour || ''}"
                    @click="get_shareimg">分享小店</div>
                <div class="store_bottom_right"
                    ref="store_like">
                    {{info.microshop_like}}
                    <van-icon name="good-job-o"
                        @click="like_btn()"
                        size="18px"
                        color="#fff" />
                </div>
            </div>
        </div>
        <div class="store_shop">
            <mescroll-vue ref="mescroll"
                :down="mescrollDown"
                :up="mescrollUp"
                @init="mescrollInit"
                class="scol">
                <shopitem :info="item"
                    v-for="(item,i) in list"
                    :key="i" />
            </mescroll-vue>
        </div> -->
    <div class="container" style="width:100%;position:fixed;top:-2000px;">
      <div class="share-new-box" ref="imageDom1">
        <p>添加掌柜微信,有更多福利哦</p>
        <div class="share_ewm_img share_ewm_img1">
          <div class="qrcode_receipt-user">
            <div id="qrcode_receipt" ref="qrcode"></div>
            <div class="qrcode_receipt-acatar">
              <img :src="$fnc.getImgUrl(info.microshop_logo)" alt />
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="share_show" transition="fade" get-container="body" class="share_box_pop">
      <div class="share_box" style="position:relative">
        <img :src="imgUrl" alt style="width:100%" />
        <div class="share_box-foote">
          <span></span>
          <van-divider :style="{ color: '#a5a5a5', borderColor: '#c8c8c8', padding: '0',margin:'0' }">
            保存二维码添加掌柜</van-divider>
          <span></span>
        </div>
        <div class="share_box-btn">
          <van-button round type="info" @click="uploadShare(isWx)" color="linear-gradient(to right, #feed3d, #ffdb18)">保存二维码</van-button>
        </div>
      </div>

      <div class="upload_shaer_btn">
        <div class="tc">
          <van-icon @click="share_show=false" name="close" size="30px" color="#fff" style="margin-top:20px" />
        </div>
      </div>
    </van-popup>
    <van-tabbar v-model="active" active-color="#fa61a5">
      <van-tabbar-item icon="wap-home">首页</van-tabbar-item>
      <van-tabbar-item icon="manager" to="/member/member">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import shopitem from "@/components/member/store/store_shop_item";
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import { Divider, Tabbar, TabbarItem, Swipe, SwipeItem } from 'vant';
export default {
  name: "member_store",
  data () {
    return {
      active: '',
      banner: "",
      hotlist: [],
      imgUrl: "",
      isWx: "0",
      share_show: false,
      list: [],
      info: {
        banner: [],
      },
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        offset: 1000,
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
          src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: "", //父布局的id (1.3.5版本支持传入dom元素)
          icon: "@/assets/img/empty.png", //图标,默认null,支持网络图
          tip: "暂无相关数据~" //提示
        }
      }
    };
  },
  components: {
    MescrollVue,
    shopitem,
    [Divider.name]: Divider,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  created () {
    this.get_info();
    this.get_hot();
  },
  mounted () {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.isWx = "0"; //第一个微信端
    } else if (ua.match(/ykapp/i) == "ykapp") {
      this.isWx = "1"; //第二个app
    } else {
      this.isWx = "2"; //剩下的网页
    }
  },
  methods: {

    like_btn () {
      this.$api.getShop.store_like({ id: this.$route.query.mid }).then(res => {
        if (res.code == 200) {
          this.info.microshop_like = Number(this.info.microshop_like) + 1;
          this.$toast.success("点赞成功");
          this.$refs.store_like.style.color = "#ff6e00";
          this.$refs.store_like.firstElementChild.style.color = "#ff6e00";
        } else {
          this.$toast.fail(res.result);
        }
      });
    },
    uploadShare () {
      this.share_show = false;
      this.$fnc.ykAppUpImage(this.imgUrl);
    },
    get_shareimg () {
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        message: "加载中..."
      });
      html2canvas(this.$refs.imageDom1, { useCORS: true, logging: true }).then(
        canvas => {
          // 转成图片，生成图片地址
          this.imgUrl = canvas.toDataURL("image/png");
          if (this.imgUrl) {
            this.share_show = true;
            toast.clear();
          }
        }
      );
    },
    qrcode () {
      // this.ewmsrc = `/zhanye/receipt/transaction`

      var ewmsrc = `${window.location.protocol}//${window.location.host}/member/store?mid=${this.$route.query.mid}&tshare=${this.$store.state.user.username}`;
      document.getElementById("qrcode_receipt").innerHTML = "";
      new QRCode("qrcode_receipt", {
        width: 140,
        height: 140,
        text: ewmsrc, // 二维码地址
        colorDark: "#000",
        colorLight: "#fff"
      });
    },
    copy_key (link) {
      let clipboard = new this.clipboard(".copy");
      clipboard.on("success", () => {
        this.$toast.success("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        // 不支持复制
        this.$fnc.ykAPPCopy(link);
      });
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback (page, mescroll) {
      var params = {};
      params.page = page.num;
      params.id = this.$route.query.mid;
      params.page_size = 20
      this.$api.getShop.get_store_shop(params).then(res => {
        if (res.code == 200) {
          let arr = res.result;
          if (arr && arr.length == 0) {
            this.$api.getOrder
              .getOrderProduct({ page: page.num })
              .then(res2 => {
                if (res2.code == 200) {
                  let arr2 = res2.result.product;
                  // 如果是第一页需手动置空列表
                  if (page.num === 1) this.list = [];
                  // 把请求到的数据添加到列表
                  this.list = this.list.concat(arr2);
                  // 数据渲染成功后,隐藏下拉刷新的状态
                  this.$nextTick(() => {
                    mescroll.endSuccess(arr2.length);
                  });
                } else {
                  mescroll.endErr();
                }
              });
          } else {
            // 如果是第一页需手动置空列表
            if (page.num === 1) this.list = [];
            // 把请求到的数据添加到列表
            this.list = this.list.concat(arr);
            // 数据渲染成功后,隐藏下拉刷新的状态
            this.$nextTick(() => {
              mescroll.endSuccess(arr.length);
            });
          }
        } else {
          mescroll.endErr();
        }
      });
    },
    get_hot () {
      this.$api.getShop
        .get_store_hot_shop({ id: this.$route.query.mid })
        .then(res => {
          if (res.code == 200) {
            this.hotlist = res.result;
          }
        });
    },
    get_info () {
      this.$api.getShop
        .get_store_info({ id: this.$route.query.mid })
        .then(res => {
          if (res.code == 200) {
            this.info = res.result;
            this.qrcode();

          }
        });
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
  }
};
</script>
<style lang="less" scoped>
.share_box-btn {
  padding: 10px 0 16px;
  button {
    width: 164px;
    color: #1c1007 !important;
    font-weight: bold;
    font-size: 17px;
  }
}
.share_box-foote {
  width: 100%;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
  > div {
    width: 100%;
    line-height: 1.2;
  }
  span {
    width: 15px;
    height: 15px;
    position: absolute;
    background: #4c4c4c;
    border-radius: 50%;
    top: 0;
  }
  > span:first-child {
    left: -7px;
  }
  > span:last-child {
    right: -7px;
  }
}
.share_ewm_img1 {
  padding-bottom: 12px;
}
.qrcode_receipt-user {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto;

  > .qrcode_receipt-acatar {
    position: absolute;
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 5px;
    padding: 4px;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    overflow: hidden;
    img {
      max-width: 100%;
      display: block;
      border-radius: 5px;
    }
  }
}

.share-new-box {
  width: 60%;
  margin: 0 auto;
  background: #fff;
  padding: 20px 0;
  border-radius: 10px;
  > p {
    color: #1c1c1c;
    font-weight: 400;
    font-size: 16px;
    text-align: center;
    padding-bottom: 14px;
  }
  .share_ewm_img {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.store_index {
  width: 100%;
  min-height: 100%;
  background-color: #ffffff;
  .store_index_info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px 10px 12px;
    .store_index_info_left {
      > p:nth-of-type(1) {
        font-size: 16px;
        font-weight: bold;
        color: #0d0c0a;
      }
      > div {
        font-size: 12px;
        line-height: 16px;
        font-weight: 400;
        color: #8e8e8e;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        > span:nth-of-type(1) {
        }
        > span:nth-of-type(2) {
          font-size: 10px;
          color: #8e8e8e;
          border: 1px solid #8e8e8e;
          border-radius: 15px;
          padding: 0px 5px;
          margin-left: 10px;
        }
        > i {
          font-size: 22px;
          color: #000000;
          margin-left: 10px;
        }
        > img {
          width: 25px;
          margin-left: 10px;
        }
      }
    }
    .store_index_info_right {
      width: 42px;
      height: 42px;

      border-radius: 50%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .store_index_banner {
    width: 100%;
    padding: 0 12px;
    margin-bottom: 10px;
    img {
      width: 100%;
    }
  }
  .store_index_hot {
    width: 93%;
    margin: 0 auto;
    padding: 20px 12px 12px 12px;
    -moz-box-shadow: 0px 7px 8px #ebebeb;
    -webkit-box-shadow: 0px 7px 8px #ebebeb;
    box-shadow: 0px 7px 8px #ebebeb;
    border-radius: 5px;
    margin-bottom: 15px;
    background: url("./../../../assets/img/member/store_img.png") no-repeat left
      0;
    background-size: 300px;
    .store_index_hot_title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > p {
        font-size: 16px;
        color: #0d0c0a;
        font-weight: bold;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: flex-end;
        line-height: 16px;
        span {
          color: #fff;
          font-weight: bold;
          font-size: 10px;
          line-height: 14px;
          background-color: #ff4892;
          border-radius: 2px;
          padding: 1px 5px;
          margin-left: 5px;
        }
      }
      > div {
        color: #ff4892;
        border: 1px solid #ff4892;
        border-radius: 15px;
        height: 18px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        padding: 0 5px;
        p {
          font-size: 10px;
          line-height: 18px;
        }
        .van-icon {
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
    > p {
      font-size: 12px;
      color: #8a8b8d;
      width: 100%;
    }
    > .store_index_hot_shop {
      width: 100%;
      margin: 10px 0 0 0;
      flex-wrap: wrap;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .store_index_hot_shop_item {
        width: 32%;
        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-items: center;
        .store_index_hot_shop_item_img {
          width: 100%;
          height: 100px;
          img {
            width: 100%;
            height: 100px;
          }
        }
        > p:nth-of-type(1) {
          width: 100%;
          height: 36px;
          text-align: left;
          font-size: 12px;
          margin: 10px 0 0 0;
          line-height: 18px;
          color: #0f0e0b;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          //隐藏行数
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        > p:nth-of-type(2) {
          width: 100%;
          text-align: left;
          font-size: 14px;
          color: #fa61a5;
          line-height: 24px;
          font-weight: bold;
        }
      }
    }
  }
  .store_index_more {
    width: 100%;
    .store_index_more_title {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      padding: 0 12px;
      > span:nth-of-type(1),
      span:nth-of-type(3) {
        width: 20px;
        height: 1px;
        background-color: #58595b;
      }
      span:nth-of-type(2) {
        font-size: 14px;
        color: #000000;
        font-weight: bold;
        margin: 0 10px;
      }
    }
    .store_index_more_shop {
      width: 100%;
      .cut_item {
        padding-left: 0;
        padding-right: 0;
        border-bottom: 1px solid #eeeeee;
      }
    }
  }
}
.store_box {
  width: 100%;
  border: 1px solid #eeeeee;
  border-radius: 0 0 20px 20px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0;
  // background: -webkit-linear-gradient(#5ac0ff #ffffff); /* Safari 5.1 - 6.0 */
  // background: -o-linear-gradient(#5ac0ff, #ffffff); /* Opera 11.1 - 12.0 */
  // background: -moz-linear-gradient(#5ac0ff, #ffffff); /* Firefox 3.6 - 15 */
  // background: linear-gradient(
  //     #5ac0ff,
  //     #ffffff
  // ); /* 标准的语法（必须放在最后） */
  background: url("./../../../assets/img/member/store_bj.png") no-repeat center;
  background-size: 100% 100%;
  color: #ffffff;
  .store_top {
    width: 92%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px 0;
    .store_top_img {
      width: 30%;
      img {
        border: 4px solid #f69e9b;
        width: 100%;
        border-radius: 50%;
        overflow: hidden;
      }
    }

    .store_top_right {
      width: 65%;
      font-size: 12px;
      p {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: flex-start;
        line-height: 20px;
        padding-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .van-icon {
          padding-right: 4px;
        }
      }
      .van-icon {
        color: #ffffff;
      }
      > p:nth-of-type(1) {
        font-size: 18px;
        font-weight: 500;
        padding: 5px 0;
      }
      > p:nth-of-type(2) {
        font-size: 12px;

        img {
          width: 25px;
          height: 25px;
          margin-right: 5px;
        }
        span {
          color: #ffcc00;
          padding: 2px 8px;
          line-height: 12px;
          font-size: 10px;
          border-radius: 15px;
          background-color: #000000;
        }
      }
      > p:nth-of-type(4) span {
        font-size: 10px;
        line-height: 16px;
        color: #333333;
        background-color: #ffcc00;
        border-radius: 15px;
        padding: 0px 8px;
        margin-left: 10px;
      }
    }
  }
  .store_bottom {
    width: 92%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    // margin-top: 15px;
    .store_bottom_left_btn {
      width: 30%;
      color: #222222;
      font-weight: bold;
      font-size: 14px;
      background-color: #ffcc00;
      border-radius: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .store_bottom_right {
      font-size: 12px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      .van-icon {
        padding-left: 5px;
      }
    }
  }
}
.store_shop {
  height: 70%;
  overflow: auto;
  padding-bottom: 50px;
}
.share_box_pop {
  width: 100%;
  height: 85%;

  background-color: transparent;
  > div {
    width: 68%;
    margin: 0 auto 0;
  }
}
.share_box {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  margin: 0 auto;
  padding: 20px 0px;
  border-radius: 10px;

  .share_top {
    width: 40%;
    img {
      width: 100%;
      border-radius: 50%;
    }
  }
  > p {
    font-size: 32px;
    font-weight: bold;
    line-height: 32px;
    padding: 5px 0;
  }
  .share_info {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      font-size: 16px;
      font-weight: 400;
      margin: 0 5px;
    }
    span {
      padding: 0 5px;
      color: #ff9919;
    }
  }
  .share_wx {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    img {
      width: 18px;
    }
    p {
      font-weight: bold;
      padding-left: 10px;
      font-size: 18px;
    }
  }
  .share_ewm {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    margin: 15px 0;
    .share_ewm_img {
      width: 45%;
      img {
        width: 100%;
      }
    }
    p {
      font-size: 14px;
      font-weight: bold;
      color: #8e8e8e;
      padding: 10px 0;
    }
    img {
      width: 100%;
    }
  }
  .share_line {
    width: 80%;
    height: 2px;
    background-color: #f2f2f2;
  }
}
.share_close {
  // width: 100%;
  display: flex;
  justify-content: center;
  padding: 15px 0;
  position: absolute;
  right: 15px;
  top: 0px;
  background-color: transparent;
}
.share_close .van-icon {
  font-size: 30px;
  border-radius: 50%;
  background-color: transparent;
  border: 3px solid #ff2b05;
  color: #ff2b05;
}
.upload_shaer_btn {
  color: #fff;
  font-size: 14px;
  position: relative;
  text-align: center;
  .upload_img_ewm {
    display: block;
    width: 34px;
    margin: 0 auto;
  }
  span {
    display: inline-block;
    margin-top: 20px;
  }
}
</style>