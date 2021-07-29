<template>
  <div class="">
    <div class="fx shop_cell_item" v-if="shopInfo.is_virtual=='0' && shopInfo.types != 9 && shopInfo.types!=14">
      <div class="c1">发货</div>
      <div class="c2 fx_3 fx shop_cx2-box">
        <div class="shop_cx" v-if="shopInfo.mail">
          {{shopInfo.mail.ctrl ||city}}
          <span class="cell-line" v-if="shopInfo.mail.ctrl || city">|</span>
          <span class="cell-line-mail" v-if="shopInfo.types == 24">邮费：{{$fnc.toFixedZ(shopInfo.zeromail)}}</span>
          <span class="cell-line-mail" v-else>{{shopInfo.mail.money}}</span>
        </div>
        <div class="shop_cx2" v-show="isShowSales==1">
          <p v-if="shopInfo.types == 6">已预约{{shopInfo.my_num || 0}}</p>
          <p v-else>已销售{{Number(shopInfo.invent_sale) + Number(shopInfo.real_sale) || 0}}</p>

        </div>
      </div>
    </div>
    <div v-if="shopInfo.types != 7 && shopInfo.types != 2 && shopInfo.types != 4">
      <div class="fx shop_cell_item shop_cell_item1"
          v-if="(shopInfo.is_coupon==1 && shopInfo.coupon.length>0) || shopInfo.discount_number>0 || shopInfo.send_score>0 || shopInfo.integral_dk_per>0">
        <div class="c1">活动</div>
        <div class="fx_3">
          <div class="fx shop_cell_item shop_cell_item2 shop_cell_item3" @click="showList=true"
              v-show="shopInfo.is_coupon==1 && shopInfo.coupon.length>0">
            <div class="c2 fx_3 fx">
              <div class="shop_con" v-show="i<2" v-for="(item,i) in shopInfo.coupon" :key="i">满{{item.cdn_xfm}}减{{$fnc.toFixedZ(item.money,0)}}</div>
            </div>
            <van-icon name="arrow" size="16" color="#b3b3b3" />
          </div>
          <div class="fx shop_cell_item shop_cell_item2" v-if="shopInfo.discount_number>0">
            <div class="c2 fx_3 fx">
              <div class="shop_cx shop_cx1">满折</div>
              <div class="shop_cx">
                每买满 <span>{{shopInfo.discount_number}}</span>件，享受 <span>{{$fnc.toFixedZ(shopInfo.discount,1)}}</span> 折
              </div>
            </div>
          </div>
          <div class="fx shop_cell_item shop_cell_item2" v-if="shopInfo.send_score>0">
            <div class="c2 fx_3 fx">
              <div class="shop_cx">
                赠送
                <span>{{$fnc.toFixedZ(shopInfo.send_score,0)}}</span>
                {{shopInfo.send_score_cn}}
              </div>
            </div>
          </div>

          <div class="fx shop_cell_item shop_cell_item2" v-if="shopInfo.integral_dk_per>0">
            <div class="c2 fx_3 fx">
              <div class="shop_cx">
                可用
                <span>{{$fnc.toFixedZ(shopInfo.integral_dk_per,0)}}</span> {{$store.state.config.shop.integral_cn ||'积分'}}抵扣
                <span>{{shopInfo.integral_dk}}</span> 元
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rider-item" v-if="shopInfo.shop&&shopInfo.shop.shop_is_rider=='1'">
      <div class="fx">
        <img src="../../../assets/img/shop/rider.png" alt="">
        <span @click="deliverys">区域查询</span>
      </div>
    </div>

    <div class="shop-baozhang" v-if="shopInfo.commodity_protection &&shopInfo.types != 9">
      <div class=""></div>
      <div class="fx shop_cell_item">
        <div class="c1">保障</div>
        <div class="c2 fx_3 fx">
          <div class="shop_cx">{{shopInfo.commodity_protection}}</div>
        </div>
      </div>
    </div>

    <div class="shop-baozhang" v-if="shopInfo.pro_params && shopInfo.pro_params!='[]' && shopInfo.pro_params!=''" @click="showParams = true;">
      <div class=""></div>
      <div class="fx shop_cell_item">
        <div class="c1">参数</div>
        <div class="c2 fx_3 fx">
          <div class="shop_cx van-ellipsis" style="width: 250px;">{{params_title}}</div>
        </div>
      </div>
    </div>

    <!-- <div class="fx shop_cell_item " @click="showList=true" v-show="shopInfo.is_coupon==1 && shopInfo.coupon.length>0">
            <div class="c1">领劵</div>
            <div class="c2 fx_3 fx">
                <div class="shop_con" v-show="i<2" v-for="(item,i) in shopInfo.coupon" :key="i">满{{item.cdn_xfm}}减{{$fnc.toFixedZ(item.money,0)}}</div>
            </div>
            <van-icon name="arrow" size="16" color="#b3b3b3" />
        </div>
        <div class="fx shop_cell_item " v-if="shopInfo.discount_number>0">
            <div class="c1">促销</div>
            <div class="c2 fx_3 fx">
                <div class="shop_cx shop_cx1">满折</div>
                <div class="shop_cx">每满 <span>{{shopInfo.discount_number}}</span> 件，减<span> {{$fnc.toFixedZ(shopInfo.discount,0)}}</span> 折</div>
            </div>
        </div>
        <div class="fx shop_cell_item " v-if="shopInfo.send_score>0">
            <div class="c1">购物</div>
            <div class="c2 fx_3 fx">
                <div class="shop_cx ">赠送 <span>{{$fnc.toFixedZ(shopInfo.send_score,0)}}</span> {{shopInfo.send_score_cn}}</div>
            </div>
        </div>

        <div class="fx shop_cell_item " v-if="shopInfo.integral_dk_per>0">
            <div class="c1">积分</div>
            <div class="c2 fx_3 fx">
                <div class="shop_cx ">积分可抵扣 <span>{{$fnc.toFixedZ(shopInfo.integral_dk_per,0)}}</span> 元</div>
            </div>
    </div>-->

    <!-- 优惠券列表 -->
    <van-popup v-model="showList" position="bottom" class="coupon_popup" get-container="body">
      <coupon @closePop="getClosePop" :coupon="shopInfo.coupon" />
    </van-popup>
    <van-dialog v-model="show" title="配送范围" @cancel='supplier_three' cancelButtonText='重新定位' show-cancel-button>
      <div class="delivery-box">
        <van-cell :border='false' title="当前定位" title-style='flex:inherit' icon="location-o"
            :value="params.province+'-'+params.city+'-'+params.area" />
        <div class="rider-city-box">
          <p>
            <van-icon name="logistics" />&nbsp;&nbsp;配送区域
          </p>
          <div class="fx">
            <span v-for="(item,i) in citys" :key="i">{{item}}</span>
          </div>
        </div>
      </div>
    </van-dialog>
    <van-popup v-model="showParams" position="bottom" :overlay="true" get-container="body" style="border-radius: 5px 5px 0 0; min-height: 50%;">
      <shopDetailsParams :shopInfo="shopInfo" @closePop="closePop" />
    </van-popup>
  </div>
</template>

<script>
import coupon from "@/components/currency/shop/coupon.vue";
import {
  mapState
} from 'vuex';
import wx from "weixin-js-sdk";
import shopDetailsParams from "./shopdetailsparams";
var setCoor = function (lai, lon) {
  window.vue.position.latitude = lai;
  window.vue.position.longitude = lon;
  window.vue.get_address(lai, lon);
};
window.setCoor = setCoor;
var configAuthSate = function (type, result) {
  /*
     备注：
    type 1 定位 2 相册 3 相机
    result 1 授权访问成功 0 失败
     */
  if (type == 1 && result == 1) {
    window.vue.get_address(
      window.vue.position.latitude,
      window.vue.position.longitude
    );
  } else if (type == 1 && result == '0') {
    window.vue.$toast('定位获取失败');
  }
};
window.configAuthSate = configAuthSate;
export default {
  components: {
    coupon,
    shopDetailsParams
  },
  props: {
    shopInfo: {
      type: Object,
      default: () => { }
    }
  },
  created () {
    window.vue = this;
  },
  data () {
    return {
      showList: false,
      params: {
        province: "福建省",
        city: "福州市",
        area: "台江区",
      },
      show: false,
      citys: [],
      showParams: false
    };
  },
  methods: {
    closePop () {
      this.showParams = false;
    },
    deliverys () {
      var params;
      var address = localStorage.getItem("shop-rider-address");
      if (address) {
        params = JSON.parse(address);
        this.params = params;
        this.delivery(params)
      } else {
        this.supplier_three();
      }
    },
    delivery (params) {
      this.$api.getRider.delivery(params).then(res => {
        if (res.code == 200) {
          this.city = res.result;
          this.show = true;
        }
      })
    },
    async supplier_three () {
      //  是微信端或者app端  获取定位，如果是手机浏览器端或者获取不到经纬度 判断缓存如果有选择过地区，
      //  左上角显示缓存的地区，请求缓存地区的接口，如果没有缓存那么左上角显示选择地区，请求的是推荐店铺的接口
      //  根据定位获取商户
      switch (true) {
        case this.$fnc.isWx():
          var that = this;
          await wx.ready(() => {
            wx.getLocation({
              type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                that.get_address(latitude, longitude);
              },
              cancel: function (rej) {
                that.$toast.fail("获取位置信息失败", rej);
              }
            });
          });
          break;
        case this.$fnc.isapp() || this.$fnc.isYkAPP():
          var newapp;
          try {
            newapp = this.$store.state.config.shop.newapp;
          } catch (error) {
            newapp = "0";
          }
          if (newapp == "0") {
            try {
              // eslint-disable-next-line no-undef
              ykAPP.getCoor();
            } catch (error) {
              // eslint-disable-next-line no-undef
              this.get_address(ykAPP.getLatitude(), ykAPP.getlongitude());
            }
          } else {
            var data = {
              type: "getCoor"
            };
            this.$fnc.postData(data);
          }
          break;
        default:
          this.$toast('请在微信或者app打开')
          break;
      }
    },
    get_address (lat, lng) {
      //根据经纬度获取商户 获取到城市地址
      var latitude = {};
      latitude.latitude = lat;
      latitude.longitude = lng;
      var that = this;
      //获取具体位置
      const KEY = "QUEBZ-7FO3W-EBQRR-RRCFM-6DUC3-ZYBHX";
      let url =
        "https://apis.map.qq.com/ws/geocoder/v1?&poi_options=address_format=short&get_poi=0";
      let locationdata = `${lat},${lng}`; //纬度，经度
      this.$jsonp(url, {
        key: KEY,
        callbackName: "QQmap",
        output: "jsonp",
        location: locationdata
      })
        .then(json => {
          let address = json.result;
          that.$set(
            that.params,
            "province",
            address.address_component.province
          );
          that.params.city = address.address_component.city;
          that.params.area = address.address_component.district;

          localStorage.setItem("shop-rider-address", JSON.stringify(that.params));
          that.delivery(that.params)
        })
        .catch(() => { });
    },
    getClosePop () {
      this.showList = false;
    }
  },
  computed: {
    ...mapState({
      isShowSales: state => state.config.shop.is_show_sales,

    }),
    city () {
      if (this.shopInfo.shop && this.shopInfo.shop.shop_address) {
        return this.shopInfo.shop.shop_address.split('市')[0] + '市'
      } else {
        return ''
      }
    },
    params_title () {
      if (this.shopInfo.pro_params && this.shopInfo.pro_params != '[]' && this.shopInfo.pro_params != '') {
        let arr = JSON.parse(this.shopInfo.pro_params);
        let str = "";
        for (let i of arr) {
          str += i.title + ' ';
        }
        return str;
      } else {
        return "";
      }
    }
  }
};
</script>


<style lang="less" scoped>
.rider-city-box {
  padding: 0 16px;
  font-size: 14px;

  span {
    margin: 6px 6px 0 0;
    padding: 4px 8px;
    background: #f3f3f3;
    border-radius: 5px;
  }

  div {
    flex-wrap: wrap;
    padding: 0px 10px 10px;
    justify-content: flex-start;
  }
}

.rider-item {
  padding: 0 16px;

  > div {
    border-top: 1px solid #f0f0f0;
    height: 50px;

    img {
      height: 16px;
    }

    span {
      width: 87px;
      height: 28px;
      line-height: 30px;
      background: #f2f2f3;
      color: #7b7b7b;
      font-weight: 500;
      font-size: 12px;
      text-align: center;
      border-radius: 5px;
    }
  }
}

.shop-baozhang {
  > div:first-child {
    background: #f3f3f3;
    height: 0.26667rem;
  }
}

.coupon_popup {
  height: 100%;
  border-radius: 0;
}

.shop_cell {
  padding: 0px 16px;
}

.shop_cell_item {
  justify-content: flex-start;
  padding: 10px 16px;
  line-height: 1.2;

  .c1 {
    width: 45px;
    // height: 25px;
    left: 12px;
    font-size: 14px;
    color: #929292;
  }

  .c2 {
    justify-content: flex-start;

    div.shop_con {
      background: url("../../../assets/img/shop/comon.png") no-repeat;
      background-size: 100% 100%;
      font-size: 12px;
      color: #fff;
      width: 90px;
      // height: 25px;
      // line-height: 25px;
      text-align: center;
    }

    div.shop_con:not(:first-child) {
      margin-left: 5px;
    }

    div.shop_cx {
      font-size: 13px;
      color: #2b2b2b;

      > span {
        color: #df1820;
        font-weight: bold;
      }

      .cell-line {
        color: #f0f0f0;
        margin: 0 6px;
      }

      .cell-line-mail {
        color: #2b2b2b;
        font-weight: normal;
      }
    }

    div.shop_cx1 {
      padding: 0px 8px;
      height: 20px;
      line-height: 22px;
      text-align: center;
      color: #fff;
      background: #dfa34d;
      border-radius: 5px;
      font-size: 12px;
      margin-right: 10px;
    }

    div.shop_cx2 {
      // margin-left: 20px;
      font-size: 13px;
      color: #a0a0a0;
    }
  }

  .shop_cx2-box {
    justify-content: space-between;
  }
}

.shop_cell_item1 {
  justify-content: flex-start;
  align-items: flex-start;
}

.shop_cell_item2 {
  padding: 0;
  margin-bottom: 12px;
}

.shop_cell_item3 {
  line-height: 1.4;
}
</style>
