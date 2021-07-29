<template>
  <div class="searchbox">
    <van-nav-bar
      :title="navtitle"
      left-text
      left-arrow
      class="navbar"
      @click-left="$emit('closemap')"
    />

    <div class="serchtab">
      <van-search
        v-model="words"
        placeholder="小区/写字楼/学校 等"
        @search="onSearch1"
      />
    </div>

    <div id="container"></div>

    <div class="sl" id="result">
      <div
        class="additem"
        v-for="(item, i) in list"
        :key="i"
        @click="sel_address(item)"
      >
        <van-icon name="location" />
        <div>
          <p>{{ item.name }}</p>
          <p>{{ item.address }}</p>
        </div>
      </div>
      <van-empty
        image="search"
        description="没有更多了"
        v-if="list && list.length == 0"
      />
    </div>

    <div style="display: none">
      <getaddress
        ref="getaddress"
        @sendAddress="recaddress"
        :isDetail="false"
        :isauto="false"
        :isturnGAODE="true"
      ></getaddress>
    </div>
  </div>
</template>
<script>
import { Search, Empty, Toast } from "vant";
import driver from "@/assets/js/fnc/driver.js";
import getaddress from "@/components/currency/getaddress";
export default {
  data() {
    return {
      words: "",
      list: [],
      now_location: this.spe_location || {},
      map: null,
      nowMarker: null,
      addressshow: false,
      is_search: false,
    };
  },
  props: {
    navtitle: {
      type: String,
      default: "确认收货地址",
    },
    spe_location: {
      type: Object,
      default: () => ({}),
    },
    isAddress: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    [Search.name]: Search,
    [Empty.name]: Empty,
    getaddress,
  },
  created() {
    if (this.now_location.lat > 0 && this.now_location.lng > 0) {
      driver.MapLoader().then((aMap) => {
        this.init();
      });
    } else {
      this.$nextTick(() => {
        this.$refs.getaddress.getnowaddress();
      });
    }
  },
  computed: {},
  methods: {
    recaddress(val) {
      var that = this;
      driver.MapLoader().then((aMap) => {
        that.now_location = new AMap.LngLat(val.longitude, val.latitude);
        that.now_location.address = val.address || "";
        that.now_location.area = val.area || "";
        that.now_location.city = val.city || "";
        that.now_location.province = val.province || "";
        that.now_location.town = val.town || "";
        that.init(1);
      });
    },
    init(type) {
      var that = this;
      that.map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 16,
        center: that.now_location,
      });
      if (type == 1) {
        this.setMarker();
      }
      var geocoder = null;
      AMap.service("AMap.Geocoder", function () {
        geocoder = new AMap.Geocoder({
          city: that.now_location.city || "", //城市
        });
      });
      AMap.event.addListener(that.map, "dragend", function () {
        geocoder.getAddress(that.map.getCenter(), function (status, data) {
          if (status === "complete" && data.info === "OK") {
            var name = data.regeocode.formattedAddress.replace(
              data.regeocode.addressComponent.province,
              ""
            );
            name = name.replace(data.regeocode.addressComponent.city, "");
            name = name.replace(data.regeocode.addressComponent.district, "");
            name = name.replace(data.regeocode.addressComponent.township, "");
            var obj = {
              province: data.regeocode.addressComponent.province,
              city: data.regeocode.addressComponent.city,
              area: data.regeocode.addressComponent.district,
              town: data.regeocode.addressComponent.township,
              street: data.regeocode.addressComponent.street,
              lat: that.map.getCenter().getLat(),
              lng: that.map.getCenter().getLng(),
              name: name,
            };
            that.now_location = obj;
            that.setMarker(that.map.getCenter());
            that.onSearch();
          }
        });
      });
      this.onSearch();
    },
    sel_address(item) {
      var obj = {
        lat: item.location.lat,
        lng: item.location.lng,
        address: item.name,
        province: this.now_location.province || "",
        city: this.now_location.city || "",
        area: this.now_location.area || "",
        town: this.now_location.town || "",
        street: this.now_location.street || "",
      };
      this.$emit("sendPosition", obj);
    },
    setMarker(nowpostion) {
      var that = this;
      if (!nowpostion) {
        nowpostion = that.map.getCenter();
      }
      if (that.nowMarker) {
        if (this.is_search == true) {
          that.map.setCenter(nowpostion);
        }
        that.nowMarker.setPosition(nowpostion);
        that.nowMarker.setAnimation("AMAP_ANIMATION_DROP");
      } else {
        var markerContent = `
          <div class="dotbox">
            <div class="point">
              <div class="radius">
                <span></span>
              </div>
              <div class="shu"></div>
                <span></span>
            </div>
          </div>
      `;
        that.map.setCenter(nowpostion);
        that.nowMarker = new AMap.Marker({
          position: nowpostion,
          animation: "AMAP_ANIMATION_DROP",
          anchor: "bottom-center", //设置锚点
          offset: new AMap.Pixel(0, 0), //设置偏移量
          content: markerContent,
        });
        that.nowMarker.setMap(that.map);
        that.is_search = false;
      }
    },
    onSearch1() {
      this.is_search = true;
      this.onSearch();
    },
    onSearch() {
      AMap.service("AMap.PlaceSearch", () => {
        var placeSearch = new AMap.PlaceSearch({
          pageSize: 20, //每页显示多少行
          pageIndex: 1, //显示的下标从那个开始
          city: this.now_location.city || "全国", //城市
          citylimit: true, //是否强制限制在设置的城市内搜索
        });
        var keywords = this.words
          ? this.words
          : this.now_location.name || this.now_location.street
          ? `${this.now_location.name || ""}｜${this.now_location.street || ""}`
          : this.now_location.town || this.now_location.area
          ? `${this.now_location.area || ""}${this.now_location.town || ""}`
          : " ";
        placeSearch.search(keywords, (status, result) => {
          if (result.info == "OK" && result.poiList.pois) {
            this.list = result.poiList.pois;
            //设置地图中心的和标记
            if (
              (this.is_search == true || !this.nowMarker) &&
              this.list &&
              this.list[0]
            ) {
              this.setMarker(this.list[0].location);
            }
          } else {
            this.list = [];
          }
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
// 去除地图水印
/deep/.amap-logo {
  display: none !important;
}

/deep/.amap-copyright {
  opacity: 0 !important;
}

#container {
  width: 100%;
  height: 300px;
  flex: 1;
}

/deep/.dotbox {
  width: auto;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 25px;
  height: 35px;
  margin: auto;
  > .dottip {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 4px 20px;
    border-radius: 25px;
    font-size: 12px;
    margin-bottom: 10px;
    position: absolute;
    top: -40px;
    min-width: 0;
    position: absolute;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.16);
  }
  .dottip:after {
    width: 0;
    height: 0;
    position: absolute;
    top: 25px;
    margin: 0 auto;
    content: "";
    border: 8px solid transparent;
    border-top-color: #fff;
  }
  .point {
    width: auto;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    .radius {
      width: 25px;
      height: 25px;
      background-color: #3cbca3;
      border: 1px solid #31927e;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        width: 8px;
        height: 8px;
        background-color: #fff;
        border-radius: 50%;
      }
    }
    .shu {
      width: 2.5px;
      height: 8px;
      background-color: #3cbca3;
    }
    > span {
      width: 3px;
      height: 1.5px;
      border-radius: 50px;
      background-color: #797576;
    }
  }
  .startpoint {
    .radius {
      background-color: #3cbca3 !important;
      border: 0.02667rem solid #31927e !important;
      color: #fff !important;
    }
    .shu {
      background-color: #3cbca3 !important;
    }
  }
  .endpoint {
    .radius {
      background-color: #f88242 !important;
      border: 0.02667rem solid #f88242 !important;
      color: #fff !important;
    }
    .shu {
      background-color: #f88242 !important;
    }
  }
}

.searchbox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  > .serchtab {
    width: 100%;
    padding: 8px 10px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin: 0 auto;
    background-color: #fff;
    > div {
      flex: 1;
    }
    .van-search {
      padding: 0;
    }
  }
  .sl {
    width: 100%;
    flex: 1;
    overflow: auto;
    background-color: #fff;
    .additem {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid #eaeaea;
      padding: 5px 12px;
      min-height: 56px;
      .van-icon {
        font-size: 14px;
        color: #959595;
        margin-right: 5px;
      }
      > div {
        flex: 1;
        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-content: flex-start;
        > p:nth-of-type(1) {
          font-size: 13px;
          color: #3d3d3d;
          // line-height: 13px;
        }
        > p:nth-of-type(2) {
          width: 100%;
          font-size: 12px;
          color: #989898;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
        }
      }
    }
  }
}
</style>