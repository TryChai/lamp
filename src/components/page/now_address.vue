<template>
  <div class="now-address-select" id="now-address-select">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" class="scol">
      <div class="fx nas_nav">
        <div class="nas_nav_left" @click="showCitys = true">
          <van-icon name="location" />
          <span>{{address}}</span>
        </div>
        <van-search shape="round" v-model="search" placeholder="搜索本城市的小区/写字楼/地址" @search="onSearch" />
      </div>
      <div class="nas_top" v-if="usedAddress && usedAddress.id>0">
        <p>常用门店</p>
        <div class="fx">
          <div class="fx van-hairline--bottom">
            <div class="nas_top_left" @click="selectList(usedAddress)">
              <p>{{usedAddress.title}}</p>
              <p>{{usedAddress.province}}{{usedAddress.city}}{{usedAddress.area}}{{usedAddress.add}}</p>
            </div>
            <div class="fx nas_top_right">
              <p class="nas_top_right_p" v-if="usedAddress.distance>0">
                距您{{usedAddress.distance>=1000?usedAddress.distance/1000+'km':usedAddress.distance+'m'}}</p>
              <p class="nas_top_right_p1" @click="toDh(usedAddress)">查看详情</p>
            </div>
          </div>
        </div>
      </div>
      <div class="nas_con" id="now-address-select-mescroll">
        <p>附近门店</p>
        <div class="fx">
          <div class="fx van-hairline--bottom" v-for="(item,i) in list" :key="i">
            <div class="nas_con_left" @click="selectList(item)">
              <p>{{item.title}}</p>
              <p>{{item.province}}{{item.city}}{{item.area}}{{item.add}}</p>
            </div>
            <div class="fx nas_con_right">
              <p class="nas_con_right_p" v-if="item.distance>0">距您{{item.distance>=1000?item.distance/1000+'km':item.distance+'m'}}</p>
              <p class="nas_con_right_p1" @click="toDh(item)">查看详情</p>
            </div>
          </div>
        </div>
      </div>
    </mescroll-vue>

    <van-popup class="city-con-pop" get-container="body" v-model="showCitys" position="top" :overlay="false">
      <nowaddress-citys :paramsCity="params" @emitAddress="getemitAddress" />
    </van-popup>
  </div>
</template>

<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import { mapState } from "vuex";
import nowaddressCitys from "@/components/page/vip/nowaddress-citys";
import wx from "weixin-js-sdk";
export default {
  name: "",
  props: {},
  data () {
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
      showCitys: false,
      usedAdd: {},
      usedAddress: [],
      params: {
        province: "",
        city: "",
        area: "",
        town: ""
      }
    };
  },
  computed: {
    ...mapState({
      nowposition: state => state.nowposition
    }),
    address () {
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
      } else {
        return "";
      }
    }
  },
  components: { MescrollVue, nowaddressCitys },
  created () { },
  mounted () {
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
    get_address () {
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
          .catch(() => { });
      } else {
        if (this.address == "") {
          this.showCitys = true;
        }
      }
    },
    setAddress (address) {
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
    getemitAddress (params) {
      this.showCitys = false;
      this.params = params;
      localStorage.setItem("now-address", JSON.stringify(params));
      this.mescroll.resetUpScroll();
    },
    selectList (item) {
      var data = {};
      sessionStorage.setItem("usedAddress", JSON.stringify(item));
      this.$router.push("page/vip");
    },
    onSearch (val) {
      this.mescroll.resetUpScroll();
    },
    sliceCity (str) {
      return str.slice(0, str.indexOf("市"));
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll;
    },
    upCallback (page, mescroll) {
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
    toDh (item) {
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
<style lang='less' scoped>
.scol {
  padding: 0;
}
.city-con-pop {
  top: 53px;
  max-height: 100%;
  height: 100%;
  border-radius: 0;
}
.now-address-select {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f8f8f8;
  font-size: 16px;
  .nas_nav {
    width: 100%;
    padding: 10px 10px;
    background: #ffffff;
    .nas_nav_left {
      width: 21%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      line-height: 1;
      .van-icon {
        font-size: 18px;
        margin-right: 3px;
        color: #a44ff1;
      }
      > span {
        font-size: 14px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .van-search {
      width: 79%;
      padding: 0;
    }
  }
  .nas_top {
    width: 100%;
    > p {
      padding: 10px;
      font-size: 13px;
      width: 100%;
      background: #f6edfe;
      color: #a44ff1;
    }
    > div {
      background: #ffffff;
      flex-wrap: wrap;
      > div {
        width: 100%;
        padding: 12px;
        .nas_top_left {
          width: 75%;
          color: #a44ff1;
          > p:nth-of-type(2) {
            font-size: 12px;
            color: #888888;
          }
        }
        .nas_top_right {
          width: 23%;
          flex-wrap: wrap;
          justify-content: center;
          > .nas_top_right_p {
            font-size: 12px;
            color: #888888;
            text-align: center;
          }
          > .nas_top_right_p1 {
            width: 100%;
            padding: 2px 0;
            text-align: center;
            background: #ebedf0;
            border-radius: 15px;
            font-size: 13px;
          }
        }
      }
    }
  }
  .nas_con {
    width: 100%;
    > p {
      padding: 10px;
      width: 100%;
      font-size: 13px;
    }
    > div {
      background: #ffffff;
      flex-wrap: wrap;
      > div {
        width: 100%;
        padding: 12px;
        .nas_con_left {
          width: 78%;
          > p:nth-of-type(2) {
            font-size: 12px;
            color: #888888;
          }
        }
        .nas_con_right {
          width: 20%;
          flex-wrap: wrap;
          justify-content: center;
          > .nas_con_right_p {
            font-size: 12px;
            color: #888888;
          }
          > .nas_con_right_p1 {
            width: 100%;
            padding: 2px 0;
            text-align: center;
            background: #ebedf0;
            border-radius: 15px;
            font-size: 13px;
          }
        }
      }
    }
  }
}
</style>
