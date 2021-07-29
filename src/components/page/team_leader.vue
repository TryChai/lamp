<template>
  <!-- 团长信息 -->
  <div class="wrap">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scol">
      <div class="top-head">
        <div class="tops">
          <div class="top-h">
            <van-icon name="arrow-left" @click="toBack" />
            <div class="top-t">
              <van-icon name="search" class="search" />
              <span @click="seladdressshow=true" class="address">{{address}}<van-icon name="arrow-down" /></span>
              <span><input type="text" placeholder="请输入团长名称" class="top-input" /></span>
            </div>
          </div>
        </div>
      </div>

      <div class="main" v-if="usedAddress && usedAddress.id>0">
        <div class="main1" @click="selectList(usedAddress)">
          <!-- <div class="touxiang"><img :src="usedAddress.piclink" alt=""></div> -->
          <div class="touxiang" :style="'background: url('+usedAddress.piclink+');background-size: 100%'" v-if="usedAddress.piclink"></div>
          <p>团长：{{usedAddress.name}}</p>
          <p>{{usedAddress.title}}</p>
          <p>{{usedAddress.province}}{{usedAddress.city}}{{usedAddress.area}}{{usedAddress.add}}</p>
        </div>
      </div>

      <div class="foot" id="now-address-select-mescroll">
        <div class="foot-head">
          <span class="f-head1">&nbsp;</span>
          <span class="f-head2">附近团长</span>
        </div>

        <div class="foot-main" v-for="(item,i) in list" :key="i">
          <div class="foot_pic"><img :src="item.piclink"></div>
          <div class="foot_font">
            <div class="distance">
              <p @click="selectList(item)">{{item.title}}</p>
              <p v-if="item.distance>0" @click="toDh(item)">
                <van-icon name="location" /><span>距离{{item.distance>=1000?item.distance/1000+'公里':item.distance+'米'}}</span></p>
            </div>
            <div class="foot_info" @click="selectList(item)">
              <div class="foot_info1">
                <p>团长：{{item.name}}</p>
                <p>
                  <van-icon name="arrow" class="arrow" />
                </p>
              </div>
              <p>{{item.province}}{{item.city}}{{item.area}}{{item.add}}</p>
            </div>
          </div>
        </div>

      </div>
    </mescroll-vue>

    <selAddress :level="4" :show="seladdressshow" @confirm="confirmaddress"></selAddress>
  </div>
</template>
<script>
  import MescrollVue from "mescroll.js/mescroll.vue";
  import {
    mapState
  } from "vuex";
  import nowaddressCitys from "@/components/page/vip/nowaddress-citys";
  import wx from "weixin-js-sdk";
  import selAddress from "@/components/currency/selAddress/selAddress"
  export default {
    name: "",
    props: {},
    data() {
      return {
        mescroll: null, // mescroll实例对象
        mescrollDown: {
          mustToTop: true
        }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
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
          noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看这就是为什么无更多数据有时候不显示的原因
          toTop: {
            //回到顶部按钮
            warId: "now-address-select",
            src: require("@/assets/img/top.png"), //图片路径,默认null,支持网络图
            offset: 1000 //列表滚动1000px才显示回到顶部按钮
          },
          empty: {
            //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: "now-address-select-mescroll", //父布局的id (1.3.5版本支持传入dom元素)
            icon: require("@/assets/img/empty.png"), //图标,默认null,支持网络图
            tip: "暂无相关数据~" //提示
          }
        },
        search: "",
        list: [],
        isApp: false,
        isxcx: false,
        // showCitys: false,
        usedAdd: {},
        usedAddress: [],
        params: {
          province: "",
          city: "",
          area: "",
          town: ""
        },
        seladdressshow: false
      };
    },
    computed: {
      ...mapState({
        nowposition: state => state.nowposition
      }),
      address() {
        var params = this.params;
        if (params.area) {
          if (params.city == "直辖区") {
            return this.sliceCity(params.province) + params.area;
          } else {
            return this.sliceCity(params.city) + params.area;
          }
        } else if (params.city) {
          if (params.city == "直辖区") {
            return this.sliceCity(params.province) + "市";
          } else {
            return this.sliceCity(params.city) + "市";
          }
        } else if (params.province) {
          return this.sliceCity(params.province) + "省"
        } else {
          return "";
        }
      }
    },
    components: {
      MescrollVue,
      nowaddressCitys,
      selAddress
    },
    created() {
      // let add = JSON.parse(localStorage.getItem("address_info"))
      // console.log("咔咔咔咔咔咔扩扩扩扩扩扩扩扩扩扩：",add)
    },
    mounted() {
      this.isxcx = sessionStorage.getItem("is_XcX");
      var usedAdd = JSON.parse(sessionStorage.getItem("usedAddress"));
      if (usedAdd && usedAdd != undefined) {
        this.usedAdd = usedAdd;
      }
      var checkCity = JSON.parse(localStorage.getItem("checkCity"));
      var address = JSON.parse(localStorage.getItem("now-address"));
      if (checkCity && checkCity != undefined) {
        this.params = checkCity;
      } else if (address && address != undefined) {
        this.params = address;
      }
      this.get_address();
    },
    methods: {
      confirmaddress(data) {
        this.params.province = data[0] || '';
        this.params.city = data[1] || '';
        this.params.area = data[2] || '';
        this.params.town = data[3] || '';
        this.cateTitle = `${data[0] || ''}${data[1] || ''}${data[2] || ''}${data[3] || ''} `
        this.seladdressshow = false;
        // this.params = data;
        localStorage.setItem("now-address", JSON.stringify(this.params));
        this.mescroll.resetUpScroll();
      },
      get_address() {
        if (this.$store.state.nowposition && this.$store.state.nowposition.latitude && this.$store.state.nowposition.longitude) {
          var that = this;
          const KEY = "QUEBZ-7FO3W-EBQRR-RRCFM-6DUC3-ZYBHX";
          let url =
            "https://apis.map.qq.com/ws/geocoder/v1?&poi_options=address_format=short&get_poi=0";
          let locationdata = `${this.$store.state.nowposition.latitude},${this.$store.state.nowposition.longitude}`;
          this.$jsonp(url, {
              key: KEY,
              callbackName: "QQmap",
              output: "jsonp",
              location: locationdata
            })
            .then(json => {
              let address_ar = json.result;
              if (
                that.params.city == "" ||
                that.params.city == undefined ||
                localStorage.getItem("now-address") == undefined
              ) {
                that.setAddress(address_ar);
              } else if (that.params.city != address_ar.address_component.city) {
                // that.$dialog
                //   .confirm({
                //     title: "提示",
                //     message: "您当前所在的城市与定位的城市不同，是否重新定位"
                //   })
                //   .then(() => {
                that.setAddress(address_ar);
                // })
                // .catch(() => { });
              } else {
                that.mescroll.resetUpScroll();
              }
            })
            .catch(() => {});
        } else {
          if (this.address == "") {
            this.seladdressshow = true;
          }
        }
      },
      setAddress(address) {
        this.params.province = address.address_component.province;
        this.params.city = address.address_component.city;
        this.params.area = address.address_component.district;
        this.params.town = address.address_component.street || "";
        try {
          var dwCity = {
            province: address.address_component.province,
            city: address.address_component.city,
            dw: true
          };
          localStorage.setItem("dw-city", JSON.stringify(dwCity));
        } catch (error) {
          new Error(error);
        }
        localStorage.setItem("now-address", JSON.stringify(this.params));
        this.mescroll.resetUpScroll();
      },
      selectList(item) {
        var data = {};
        sessionStorage.setItem("usedAddress", JSON.stringify(item));
        //保存团长信息
        let params = {
          id: item.id,
          distance: item.distance
        }
        this.$api.getPage.saveExtractId(params).then(res => {
          if (res.code == 200) {
            return;
          }
        })
        setTimeout(() => {
          if (this.$route.query.redirect) {
            let redirect = this.$route.query.redirect;
            if (redirect.indexOf("http") < 0) {
              this.$router.replace({
                path: redirect
              });
            } else {
              window.location = redirect;
            }
            this.$router.replace(redirect);
          }
        }, 500)
      },
      onSearch(val) {
        this.mescroll.resetUpScroll();
      },
      sliceCity(str) {
        return str.slice(0, str.indexOf("市"));
      },
      mescrollInit(mescroll) {
        this.mescroll = mescroll;
      },
      upCallback(page, mescroll) {
        var data = {};
        data = this.params || {};
        data.page = page.num;
        data.latitude = this.$store.state.nowposition.latitude || 0;
        data.longitude = this.$store.state.nowposition.longitude || 0;
        data.search = this.search;
        if (this.usedAdd && this.usedAdd.id) {
          data.used = this.usedAdd.id;
        }
        this.$api.getPage.extract_page(data).then(res => {
          if (res.code == 200) {
            this.usedAddress = res.result.used;
            let arr = res.result.data;
            if (page.num === 1) this.list = [];
            this.list = this.list.concat(arr);
            this.$nextTick(() => {
              mescroll.endSuccess(arr.length);
            });
          } else {
            mescroll.endErr();
          }
        });
      },
      toDh(item) {
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
      }
    }
  };
</script>

<style lang="less" scoped>
  .wrap {
    width: 100%;
    height: 100%;
    overflow: auto;

  }

  .tops {
    width: 100%;
    // height: 100%;
    padding-top: 20px;
    
    .top-h{
      display: flex;
      align-items: center;
      
      .van-icon{
        margin-left: 8px;
        color: #fff;
        font-size: 26px;
      }
    }

    .a {
      font-size: 18px;
    }
  }

  .top-t {
    width: 85%;
    height: 30px;
    margin: 0 auto;
    border-radius: 13px;
    background-color: #fff;
    display: flex;
    align-items: center;
    
    .van-icon{
      color: #000!important;
      margin-left: 0!important;
    }

    span:nth-child(2) {
      font-size: 15px;
      color: rgb（51，51，51）;
      white-space: nowrap;
      font-weight: bold;
    }

    span:nth-child(3) {
      width: 100%;
      display: flex;
      align-items: center;

      .top-input {
        width: 95%;
        height: 100%;
        font-size: 15px;
        margin-left: 5px;

      }
    }
  }

  .main {
    width: 93%;
    height: 160px;
    margin: 0 auto;
    background-color: white;
    border-radius: 13px;
    border: 1px solid rgb(237, 237, 237);
    margin-top: -50px !important;

    .main1 {
      width: 98%;
      height: 145px;
      margin: 5px auto;
      // margin-top: 5px !important;
      background-color: white;
      border-radius: 10px;
      border: 1px dashed rgb(209, 209, 209);
      line-height: 35px;
    }

    .backgroud {
      width: 100%;


    }

    // .touxiang {
    //   // background-size: cover;
    //   // overflow: hidden;

    //   img {
    //     width: 72px;
    //     height: 72px;
    //     border-radius: 50%;
    //     border: 1px solid white;
    //     position: absolute;
    //     left: 50%;
    //     // top: 90px;
    //     // transform: translate(-50%);
    //   }
    // }

    .touxiang {
      width: 72px;
      height: 72px;
      margin: -40px auto;
      border: 1px solid white;
      border-radius: 50%;
      // background: url('../../assets/img/huolongguo/person4.png');
      background-size: cover;
      overflow: hidden;
    }

    p:nth-of-type(1) {
      font-size: 16px;
      color: rgb(179, 179, 179);
      text-align: center;
      margin-top: 40px;
    }

    p:nth-of-type(2) {
      font-size: 22px;
      color: rgb(51, 51, 51);
      font-weight: bold;
      text-align: center;
    }

    p:nth-of-type(3) {
      font-size: 14px;
      color: rgb(61, 61, 61);
      text-align: center;
      line-height: 18px;
    }

  }

  .foot {
    width: 93%;
    margin: 0 auto;
    margin-top: 20px !important;
    font-size: 20px;
    // background-color: white;
  }

  .foot-head {
    .f-head2 {
      font-size: 18px;
      font-weight: bold;
      color: black;
      margin-left: 10px;
    }
  }

  .f-head1 {
    width: 10px;
    background-color: rgb(255, 105, 91);
    height: 100%;
  }

  .search {
    font-size: 23px;
    color: gray;
    text-indent: 2px;
  }

  .address {
    display: flex;
    align-items: center;

    .van-icon {
      margin-left: 3px;
      color: #d6d6d6!important;
      font-size: 20px!important;
    }
  }

  .top-head {
    height: 176px;
    // width: 100%;
    background: url('../../assets/img/huolongguo/backgroud.png');
    display: flex;
    align-items: stretch;
    background-size: 100% 100%;
  }

  .foot-main {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d6d6d6;
    padding-bottom: 10px;
    margin-top: 10px;
    position: relative;

    .foot_pic {
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }

    .foot_font {
      margin-left: 10px;
      width: 100%;

      >.distance {
        display: flex;
        justify-content: space-between;
        font-size: 15px;
        font-weight: 600;

        p:nth-of-type(2) {
          color: red;
          font-weight: 400;
          font-size: 13px;
        }
      }

      .foot_info {
        .foot_info1 {
          font-size: 13px;
          color: rgb(180, 180, 180);
          display: flex;
          justify-content: space-between;
        }

        >p:nth-of-type(1) {
          font-size: 13px;
          width: 260px;
          color: rgb(79, 79, 79);
          line-height: 18px;
        }
      }

    }

    // .arrow {
    //   color: rgb(230, 230, 230);
    //   position: absolute;
    //   right: 0;
    //   top: 30%;
    //   size: 40px;
    // }
  }
</style>
