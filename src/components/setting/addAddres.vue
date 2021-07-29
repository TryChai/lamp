<template>
  <div class="addres_con">
    <van-nav-bar
      :title="item.id ? $h('编辑功德主') : $h('添加功德主')"
      left-text
      left-arrow
      class="navbar"
      @click-left="back(false)"
    />

    <van-cell-group class="address_set cell">
      <van-field
        @blur="windowScorll"
        v-model="params.name"
        clearable
        :label="$h('姓名')"
        required
        input-align="right"
        :placeholder="$h('请输入姓名')"
      />
       <van-field name="radio" input-align="right" :label="$h('性别')">
        <template #input>
          <van-radio-group v-model="params.sex" direction="horizontal">
            <van-radio name="1">男</van-radio>
            <van-radio name="2">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        @blur="windowScorll"
        v-model="params.tel"
        type="tel"
        :label="$h('电话')"
        input-align="right"
        :placeholder="$h('请输入联系电话')"
      />
       <van-field 
          clearable
          disabled
          :value="params.birth_date"
          @click="showDate = true"
          label="出生年月"
          placeholder="请选择您的出生年月"
          label-width="85px"
          right-icon="arrow" />
        <van-popup v-model="showDate"
              position="bottom">
            <van-datetime-picker title="出生年月"
                :min-date="min_birth_date"
                :max-date="max_birth_date"
                @confirm='confirm_birth_date'
                @cancel='showDate = false'
                v-model="birth_date"
                show-toolbar
                type="date" />
        </van-popup>

      <!-- <van-cell
        :title="$h('地区')"
        :value="cateTitle"
        @click="seladdressshow = true"
      >
        <van-icon name="arrow" slot="right-icon" size="14px" />
      </van-cell> -->

      <div v-if="open_map == true">
        <van-cell
          :title="$h('定位区域')"
          @click="get_lat_lng"
          :value="params.address ? params.address : '请选择'"
        >
          <van-icon name="location-o" slot="right-icon" size="14px" />
        </van-cell>

        <van-field
          @blur="windowScorll"
          v-model="params.house"
          clearable
          :label="$h('详细地址')"
          input-align="right"
          :placeholder="$h('街道门牌，楼层房间号等信息')"
        />
      </div>

      <van-field
        @blur="windowScorll"
        v-model="params.address"
        v-else
        clearable
        :label="$h('地区')"
        input-align="right"
        :placeholder="$h('请输入地区')"
      />
      
    </van-cell-group>
    <van-field
        @blur="windowScorll"
        v-model="params.wish_content"
        type="textarea"
        clearable
        autosize
        :label="$h('心愿')"
        input-align="right"
        :placeholder="$h('请输入你的心愿')"
      />
    <div class="sk-butt">
      <van-button
        type="primary"
        size="large"
        @click="onSave"
        :color="$store.state.config.shop.button_bj_color || ''"
        >{{ params.id != undefined ? $h("修改") : $h("保存") }}</van-button
      >
    </div>

    <van-popup
      v-model="map_show"
      position="bottom"
      :style="{ width: '100%', height: '100%' }"
    >
      <mapAddress
        :spe_location="spe_location"
        @sendPosition="recPosition"
        @closemap="map_show = false"
        v-if="map_show"
      ></mapAddress>
    </van-popup>

    <selAddress
      :level="4"
      :show="seladdressshow"
      @confirm="confirmaddress"
      :is_not="true"
    ></selAddress>
  </div>
</template>

<script>
import { AddressEdit, Field, Calendar,DatetimePicker } from "vant";
import { setTimeout } from "timers";
import mapAddress from "@/components/setting/map_address";
import selAddress from "@/components/currency/selAddress/selAddress";
import driver from "@/assets/js/fnc/driver.js";
export default {
  components: {
    [AddressEdit.name]: AddressEdit,
    [Field.name]: Field,
    [Calendar.name]: Calendar,
    [DatetimePicker.name]: DatetimePicker,
    mapAddress,
    selAddress,
  },
  data() {
    return {
      seladdressshow: false,
      // isxcx: navigator.userAgent.indexOf("miniProgram") !== -1 ? true : false,
      spe_location: {
        lat: 0,
        lng: 0,
      },
      map_show: false,
      open_map: false,
      searchResult: [],
      cateTitle: this.$h("请选择所在地区"),
      birthdayData:"",
      params: {
        name: "",
        tel: "",
        address: "",
        province: "",
        city: "",
        area: "",
        town: "",
        house: "", //门牌号
        //新增
        sex:"1",
        birth_date:"",
        wish_content:"",
      },
      citys: [],
      showDate:false,
      min_birth_date:new Date(1900,0,1),
      max_birth_date:new Date(),
      birth_date:new Date(),
    };
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    isOrder: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.get_isopen_map();
    console.log(this.params);
  },
  mounted() {},
  methods: {
    addZeroPrefixForMonth(month) {
      return month < 10 ? "0" + month : month;
    },
   confirm_birth_date(val){
      this.params.birth_date = this.$fnc.getTimeFormat(new Date(val) / 1000,'ymd');
      this.birth_date = new Date(val) / 1000;
      this.showDate = false;
    },
    confirmaddress(data) {
      if (data[0]) {
        this.params.province = data[0] || "";
        this.params.city = data[1] || "";
        this.params.area = data[2] || "";
        this.params.town = data[3] || "";
        this.cateTitle = `${data[0] || ""}${data[1] || ""}${data[2] || ""}${
          data[3] || ""
        } `;
      }
      this.seladdressshow = false;
    },
    get_lat_lng() {
      this.spe_location = {
        lat: 0,
        lng: 0,
      };
      if (
        this.cateTitle &&
        this.cateTitle != "请选择所在地区" &&
        this.cateTitle != ""
      ) {
        var that = this;
        driver.MapLoader().then((aMap) => {
          var geocoder = new AMap.Geocoder({
            city: "全国",
          });
          geocoder.getLocation(
            `${this.params.province}${this.params.city}${this.params.area}${this.params.town}`,
            function (status, result) {
              if (status === "complete" && result.geocodes.length) {
                that.spe_location = result.geocodes[0].location;
                that.spe_location.province =
                  result.geocodes[0].province || that.params.province || "";
                that.spe_location.city =
                  result.geocodes[0].city || that.params.city || "";
                that.spe_location.area =
                  result.geocodes[0].district || that.params.area || "";
                that.spe_location.town = that.params.town || "";
                that.map_show = true;
              } else {
                this.$toast.fail("请重新选择区域");
              }
            }
          );
        });
      } else {
        this.$toast.fail("请先选择地区");
      }
    },
    recPosition(obj) {
      this.params.address = obj.address;
      this.params.longitude = obj.lng;
      this.params.latitude = obj.lat;
      this.map_show = false;
    },
    get_isopen_map() {
      //是否开启定位
      this.$api.getSetting.isAddressBank().then((res) => {
        if (res.code == 200) {
          this.open_map = res.result.is_address_jwd == 1 ? true : false;
          this.params = this.item;
          this.params.birth_date = this.$fnc.getTimeFormat(this.item.birth_date,'ymd')
          if (this.item.id) {
            this.cateTitle = this.item.province;
            this.cateTitle += "-" + this.item.city;
            this.cateTitle += "-" + this.item.area;
            if (this.item.town) {
              this.cateTitle += "-" + this.item.town;
            }
            
            this.cateTitle = this.$fnc.deleteNumber(this.cateTitle);
            if (this.open_map == true && this.item.address) {
              var arr = this.item.address.split("-");
              this.params.address = arr[0] || "";
              this.params.house = arr[1] || "";
            }
          }
        }
      });
    },
    back(bool) {
      this.$emit("back", bool);
    },
    onSave() {
      var params = {};
      params.name = this.params.name;
      params.tel = this.params.tel;
      params.address = this.params.address;
      params.city = this.params.city;
      params.area = this.params.area;
      params.house = this.params.house;
      params.sex = this.params.sex;
      params.wish_content = this.params.wish_content;
      params.id = this.params.id;
      // this.params.birth_date=(this.birth_date.getTime()+'').slice(0,10);
      params.birth_date =  this.birth_date;
      if (this.map_show == true) {
        return;
      }
      if (
        this.open_map == true &&
        (params.house == "" || params.house == undefined)
      ) {
        this.$toast.fail("请填写详细地址");
        return;
      }
      if (
        (params.address == "" || params.address == undefined)
      ) {
        this.$toast.fail("请填写地区");
        return;
      }

      if (this.params.id) {
        if (params.house) {
          params.address = (params.address || "") + "-" + (params.house || "");
        }
        this.$api.getSetting.setDefaultAddress(params).then((res) => {
          if (res.code == 200) {
            this.$toast.success(this.$h("修改成功"));
            if (this.isOrder) {
              this.$emit("getAddressItem", res.result);
              this.back(true);
            } else {
              setTimeout(() => {
                this.back(true);
              }, 2000);
            }
          }
        });
      } else {
        if (params.house) {
          params.address = (params.address || "") + "-" + (params.house || "");
        }
        this.$api.getSetting.addAress(params).then((res) => {
          if (res.code == 200) {
            this.$toast.success(this.$h("添加成功"));
            if (this.isOrder) {
              this.$emit("getAddressItem", res.result);
              this.back(true);
            } else {
              setTimeout(() => {
                this.back(true);
              }, 2000);
            }
          }
        });
      }
    },
    onDelete(content) {
      var params = {};
      params.id = content.id;
      this.$api.getSetting.delAddres(params).then((res) => {
        if (res.code == 200) {
          this.$toast.success(this.$h("删除成功"));
          setTimeout(() => {
            this.back(true);
          }, 2000);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.address_set {
  margin-top: 15px;
  .van-cell__title {
    color: #333;
    font-weight: bold;
    font-size: 15px;
  }
}
.sk-butt {
  padding: 46px 15px 0;
  > button {
    background: linear-gradient(45deg, #ff9700, #ed1c24);
    border: none;
    height: 44px;
    border-radius: 5px;
  }
}
/deep/.van-field__label{
    font-weight: bold;
    font-size: 0.4rem;
    color: #333;
}
</style>
