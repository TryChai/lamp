<template>
  <div class="templegroup">
    <van-nav-bar title="寺庙" @click-left="toBack" left-arrow />
    <van-dropdown-menu>
      <van-dropdown-item
        @open="get_addresslist(0, '')"
        ref="dropdownItem1"
        :title="$h(province_cn)"
      >
        <div class="fx starjyzx_menu van-hairline--top">
          <p
            :class="iden1 == '' ? 'menu_active' : ''"
            @click="
              iden1 = '';
              iden2 = '';
              iden3 = '';
              province_cn = $h('请选择省');
              city_cn = $h('请选择市');
              area_cn = $h('请选择区');
            "
          >
            {{ $h("请选择省") }}
            <i></i>
          </p>
          <p
            v-for="(province, c) in provinceList"
            :key="c"
            :class="iden1 == province.id ? 'menu_active' : ''"
            @click="selectBtn(province)"
          >
            {{ $h(province.title) }}
            <i></i>
          </p>
        </div>
      </van-dropdown-item>
      <van-dropdown-item ref="dropdownItem2" :title="$h(city_cn)">
        <div class="fx starjyzx_menu van-hairline--top">
          <p
            :class="iden2 == '' ? 'menu_active' : ''"
            @click="
              iden2 = '';
              iden3 = '';
              city_cn = $h('请选择市');
              area_cn = $h('请选择区');
            "
          >
            {{ $h("请选择市") }}
            <i></i>
          </p>
          <p
            v-for="(city, c) in cityList"
            :key="c"
            :class="iden2 == city.id ? 'menu_active' : ''"
            @click="selectBtn1(city)"
          >
            {{ $h(city.title) }}
            <i></i>
          </p>
        </div>
      </van-dropdown-item>
      <van-dropdown-item ref="dropdownItem3" :title="$h(area_cn)">
        <div class="fx starjyzx_menu van-hairline--top">
          <p
            :class="iden3 == '' ? 'menu_active' : ''"
            @click="
              iden3 = '';
              area_cn = $h('请选择区');
            "
          >
            {{ $h("请选择区") }}
            <i></i>
          </p>
          <p
            v-for="(area, c) in areaList"
            :key="c"
            :class="iden3 == area.id ? 'menu_active' : ''"
            @click="selectBtn2(area)"
          >
            {{ $h(area.title) }}
            <i></i>
          </p>
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>

    <div class="container">
      <mescroll-vue
        ref="mescroll"
        :down="mescrollDown"
        :up="mescrollUp"
        @init="mescrollInit"
        class="scol"
      >
        <div v-if="shop_list != ''">
          <div
            class="temple_item"
            @click="get_details(n)"
            v-for="(n, index) in shop_list"
            :key="index"
          >
            <div class="img">
              <img :src="$fnc.getImgUrl(n.img_json[0].piclink)" alt="" />
            </div>
            <div class="temple_item_right">
              <p>{{ n.shop_title }}</p>
              <div>
                <van-icon name="location" color="#999999" size="13" />
                <p>
                  {{
                    $fnc.deleteNumber(
                      n.shop_province + n.shop_city + n.shop_area + n.shop_town
                    ) + n.shop_address
                  }}
                </p>
              </div>
              <p>{{ n.shop_visits }}到访</p>
            </div>
          </div>
        </div>

        <div v-else>
          <van-empty :description="$h('暂无寺庙')" />
        </div>
      </mescroll-vue>
    </div>
  </div>
</template>
<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import { Empty } from "vant";
export default {
  data() {
    return {
      mescroll: null,
      mescrollDown: {
        use: false,
      },
      mescrollUp: {
        callback: this.upCallback,
        page: {
          num: 0,
          size: 10,
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 5,
        toTop: {
          warpId: "starjyzx",
          src: require("@/assets/img/top.png"),
          offset: 1000,
        },
      },

      provinceList: [],
      cityList: [],
      areaList: [],
      iden1: "",
      province_cn: "请选择省",
      iden2: "",
      city_cn: "请选择市",
      iden3: "",
      area_cn: "请选择区",
      params: {
        province: "",
        city: "",
        area: "",
        town: "",
      },
      shop_list: [], //寺庙列表
    };
  },
  components: {
    MescrollVue,
    [Empty.name]: Empty,
  },

  mounted() {},
  created() {
    this.get_addresslist(0, "");
  },
  methods: {
    get_details(val) {
      this.$router.push("/supplier/suppliershopdetails?id=" + val.id);
    },
    get_addresslist(i, id) {
      var params = {};
      if (id != "") {
        params.pid = id;
      }
      this.$api.getPage.get_addresslist(params).then((res) => {
        if (res.code == 200) {
          if (id == "") {
            this.provinceList = res.result;
          } else if (i == 1) {
            this.cityList = res.result;
          } else {
            this.areaList = res.result;
          }
        }
      });
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(page, mescroll) {
      var params = {};
      params.province = this.params.province;
      params.city = this.params.city;
      params.area = this.params.area || "";
      params.town = this.params.town || "";
      params.page = page.num;
      this.$api.getSupplier.get_pageaddress(params).then((res) => {
        if (res.code == 200) {
          let arr = res.result.info.merchant.pro;
          // 如果是第一页需手动置空列表
          if (page.num === 1) this.list = [];
          // 把请求到的数据添加到列表
          this.shop_list = this.shop_list.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        } else {
          mescroll.endErr();
        }
      });
    },
    selectBtn(province) {
      this.iden1 = province.id;
      this.province_cn = province.title;
      if (this.province_cn != "") {
        this.iden2 = "";
        this.city_cn = this.$h("请选择市");
        this.area_cn = this.$h("请选择区");
        this.params.city = "";
        this.params.area = "";
      }
      if (this.city_cn != "") {
        this.iden2 = "";
        this.city_cn = this.$h("请选择市");
        this.cityList = [];
      }
      if (this.area_cn != "") {
        this.iden3 = "";
        this.area_cn = this.$h("请选择区");
        this.areaList = [];
      }
      this.params.province = this.province_cn;
      this.$refs.dropdownItem1.toggle(false);
      this.get_addresslist(1, this.iden1);
      this.changeItem();
    },
    selectBtn1(city) {
      this.iden2 = city.id;
      this.city_cn = city.title;
      if (this.area_cn != "") {
        this.iden3 = "";
        this.area_cn = this.$h("请选择区");
        this.params.area = "";
        this.areaList = [];
      }
      this.params.city = this.city_cn;
      this.$refs.dropdownItem2.toggle(false);
      this.get_addresslist(2, this.iden2);
      this.changeItem();
    },
    selectBtn2(area) {
      this.iden3 = area.id;
      this.area_cn = area.title;
      this.params.area = this.area_cn;
      this.$refs.dropdownItem3.toggle(false);
      this.changeItem();
    },
    changeItem() {
      if (this.mescroll) {
        this.shop_list = [];
        this.mescroll.resetUpScroll();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.templegroup {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
  /deep/.van-nav-bar {
    .van-nav-bar__left {
      .van-icon {
        font-size: 20px;
        line-height: 20px;
        color: black;
      }
    }
    .van-nav-bar__title {
      font-size: 17px;
      line-height: 20px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      color: #333333;
    }
  }
  /deep/.van-dropdown-menu__bar {
    box-shadow: none;
    .van-dropdown-menu__item:first-of-type {
      justify-content: flex-start;
      .van-dropdown-menu__title {
        padding-left: 20px;
      }
    }
    .van-dropdown-menu__item:nth-of-type(2) {
      .van-dropdown-menu__title {
        padding-left: 0;
      }
    }
    .van-dropdown-menu__title::after {
      top: 49%;
      right: -10px;
      border: 4px solid;
      border-color: transparent transparent #333333 #333333;
    }
    .van-dropdown-menu__title {
      .van-ellipsis {
        font-size: 13px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #666666;
        line-height: 13px;
      }
    }
  }
  .container {
    padding: 15px 10px;
    flex: 1;
    overflow: auto;
    .temple_item {
      padding: 10px;
      border-radius: 6px;
      display: flex;
      background-color: #fff;
      background-image: url(./../../assets/img/project/temple4.png);
      background-size: 133px;
      background-repeat: no-repeat;
      background-position: right bottom;
      .img {
        flex-shrink: 0;
        width: 83px;
        height: 83px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        overflow: hidden;
        margin-right: 15px;
        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .temple_item_right {
        flex: 1;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        > p:first-of-type {
          margin-top: 10px;
          font-size: 15px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #333333;
          line-height: 15px;
        }
        > div {
          display: flex;
          align-items: center;
          margin-top: 15px;
          > p {
            margin-left: 2px;
            font-size: 12px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
            color: #999999;
            line-height: 12px;
            width: 200px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
        }
        > p:last-of-type {
          margin-top: auto;
          margin-bottom: 2px;
          font-size: 13px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #999999;
          line-height: 13px;
        }
      }
    }
    .temple_item + .temple_item {
      margin-top: 10px;
    }
  }
}
.starjyzx_menu {
  width: 100%;
  flex-wrap: wrap;
  padding: 10px 10px;
  font-size: 12px;
  justify-content: flex-start;
  > p {
    width: 102px;
    line-height: 22px;
    background: #f0f3fa;
    border-radius: 2px;
    text-align: center;
    letter-spacing: 1px;
    position: relative;
    border: 1px solid transparent;
    margin: 0 8px 10px;
    color: #969696;
    > i {
      display: none;
      position: absolute;
      top: -1px;
      right: -1px;
      width: 0;
      height: 0;
      border-bottom: 8px solid transparent;
      border-right: 8px solid #ea1e43;
    }
  }

  .menu_active {
    border: 1px solid #ea1e43;
    background: #ffffff;
    color: #ea1e43;
    > i {
      display: inline-block;
    }
  }
}
</style>