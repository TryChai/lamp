<template>
  <div class="mentionapply">
    <van-notice-bar
      v-if="form.is_check == 2"
      :text="`审核不通过！${form.remark || ''}`"
      color="#fff"
      wrapable
      background="#ff6a6a"
      left-icon="bulb-o"
    />
    <van-notice-bar
      v-else-if="form.is_check == 1"
      :text="`审核通过！${form.remark || ''}`"
      color="#fff"
      wrapable
      background="#4fc08d"
      left-icon="bulb-o"
    />
    <van-nav-bar
      title="申请自提门店"
      class="navbar"
      left-arrow=""
      @click-left="$router.push('/member/member')"
    />
    <div class="applybox">
      <div class="applybox_top" v-if="banner && banner != ''">
        <img :src="$fnc.getImgUrl(banner)" alt="" />
      </div>

      <div class="applybox_content">
        <van-field
          v-model="form.name"
          placeholder="请输入您的姓名"
          input-align="right"
          label-width="120px"
          label="文本"
        >
          <div slot="label" class="inputlabel"><span>*</span>您的姓名</div>
        </van-field>
        <van-field
          v-model="form.tel"
          placeholder="请输入您的手机"
          input-align="right"
          label-width="120px"
          label="文本"
        >
          <div slot="label" class="inputlabel"><span>*</span>您的手机</div>
        </van-field>
        <van-field
          v-model="form.title"
          placeholder="请输入店铺名称"
          input-align="right"
          label-width="120px"
          label="文本"
        >
          <div slot="label" class="inputlabel"><span>*</span>店铺名称</div>
        </van-field>
        <van-cell
          title="所属区域"
          is-link
          :value="cs"
          @click="seladdressshow = true"
        >
          <div slot="title" class="inputlabel"><span>*</span>所属区域</div>
        </van-cell>
        <van-field
          v-model="form.add"
          placeholder="请输入店铺详细地址"
          input-align="right"
          label-width="120px"
          @click="get_lat_lng"
          label="文本"
          readonly
        >
          <div slot="label" class="inputlabel"><span>*</span>详细地址</div>
        </van-field>
      </div>
      <div class="applybox_upimg">
        <p>封面图上传</p>
        <div class="upbox">
          <van-uploader :after-read="afterRead">
            <div class="up_inp_refund" style="width: 100%">
              <img
                :src="$fnc.getImgUrl(form.piclink)"
                style="width: 100%"
                v-if="form.piclink && form.piclink != ''"
                alt
              />
              <van-icon
                name="close"
                v-else
                class="fa fa-camera"
                size="28px"
                color="#c2c2c2"
              />
            </div>
          </van-uploader>
        </div>
      </div>

      <div class="applybox_btn">
        <div
          class="applybtn"
          v-if="form.is_check == 3 || form.is_check == 2 || form.is_check == ''"
          @click="applybtn(0)"
        >
          立即申请
        </div>
        <div class="applybtn" v-else @click="applybtn(1)">
          {{ form.is_check == 0 ? "审核中" : "修改" }}
        </div>
      </div>
    </div>

    <van-popup
      v-model="map_show"
      position="bottom"
      :style="{ width: '100%', height: '100%' }"
    >
      <mapAddress
        @sendPosition="recPosition"
        :form="form"
        :spe_location="spe_location"
        @closemap="map_show = false"
        v-if="map_show"
      ></mapAddress>
    </van-popup>

    <selAddress
      :level="4"
      :show="seladdressshow"
      @confirm="confirmaddress"
    ></selAddress>
  </div>
</template>
<script>
import { Field, Checkbox, CheckboxGroup } from "vant";
import mapAddress from "@/components/setting/map_address";
import selAddress from "@/components/currency/selAddress/selAddress";
import driver from "@/assets/js/fnc/driver.js";
export default {
  name: "mentionapply",
  data() {
    return {
      seladdressshow: false,
      mapposition: {},
      spe_location: {
        lat: 0,
        lng: 0,
      },
      map_show: false,
      cs: "请选择地址",

      radio: "",
      banner: "",
      //‘name’, ‘tel’, ‘title’, ‘piclink’, ‘province’, ‘city’, ‘area’, ‘town’, ‘add’, ‘longitude’, ‘latitude’
      form: {
        name: "",
        tel: "",
        title: "",
        piclink: "",
        province: "",
        city: "", //市
        area: "", //区
        town: "",
        is_check: "",
      },
    };
  },
  components: {
    [Field.name]: Field,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    mapAddress,
    selAddress,
  },
  created() {
    // navigator.userAgent.indexOf("miniProgram") >= 0 &&
    if (this.$route.query.latitude && this.$route.query.longitude) {
      this.form = JSON.parse(localStorage.getItem("map_address_form")) || {
        province: "",
        city: "",
        area: "",
        town: "",
      };
      this.cs = this.$fnc.deleteNumber(
        this.form.province + this.form.city + this.form.area + this.form.town
      );
      this.form.add = this.$route.query.name;
      this.form.longitude = this.$route.query.longitude;
      this.form.latitude = this.$route.query.latitude;
    }
    this.getinfo();
  },
  mounted() {
    if (this.$route.query.latitude && this.$route.query.longitude) {
      return;
    }
  },
  methods: {
    confirmaddress(data) {
      this.form.province = data[0] || "";
      this.form.city = data[1] || "";
      this.form.area = data[2] || "";
      this.form.town = data[3] || "";
      this.cs = `${data[0] || ""}${data[1] || ""}${data[2] || ""}${
        data[3] || ""
      } `;
      this.seladdressshow = false;
    },
    get_lat_lng() {
      this.spe_location = {
        lat: 0,
        lng: 0,
      };
      if (
        this.cs &&
        this.cs != "请选择所在地区" &&
        this.cs != "请选择地址" &&
        this.cs != ""
      ) {
        var that = this;
        driver.MapLoader().then((aMap) => {
          var geocoder = new AMap.Geocoder({
            city: "全国",
          });
          geocoder.getLocation(
            `${this.form.province}${this.form.city}${this.form.area}${this.form.town}`,
            function (status, result) {
              if (status === "complete" && result.geocodes.length) {
                that.spe_location = result.geocodes[0].location;
                that.spe_location.province =
                  result.geocodes[0].province || that.form.province || "";
                that.spe_location.city =
                  result.geocodes[0].city || that.form.city || "";
                that.spe_location.area =
                  result.geocodes[0].district || that.form.area || "";
                that.spe_location.town = that.form.town || "";
                that.map_show = true;
              } else {
                this.$toast.fail("请重新选择区域");
              }
            }
          );
        });
      } else {
        this.$toast.fail("请先选择区域");
      }
    },
    recPosition(obj) {
      this.map_show = false;
      this.mapposition = obj;
      this.form.add = obj.address;
      this.form.longitude = obj.lng;
      this.form.latitude = obj.lat;
    },
    afterRead(file) {
      var that = this;
      this.$fnc.imgCompress(file.content, function (src) {
        that.form.piclink = src;
      });
    },
    getinfo() {
      this.$api.getOrder.get_apply_mention({}).then((res) => {
        if (res.code == 200) {
          this.banner = res.result.extract_banner;
          if (res.result.info) {
            this.form = res.result.info;
            this.cs = this.$fnc.deleteNumber(
              this.form.province +
                this.form.city +
                this.form.area +
                this.form.town
            );
          } else {
            this.form.is_check = 3; //未申请过
          }
        }
      });
    },
    applybtn(index) {
      if (!/^1[3456789]\d{9}$/.test(this.form.tel)) {
        this.$toast.fail("手机号码格式错误");
        return false;
      }
      if (
        this.form.name == "" ||
        this.form.tel == "" ||
        this.form.add == "" ||
        this.form.title == "" ||
        this.form.piclink == "" ||
        this.cs == ""
      ) {
        this.$toast.fail("请完善全部信息");
        return false;
      }

      var params = {};
      params = this.form;
      if (index == "0") {
        // console.log("进入申请")
        this.$api.getOrder.save_apply_mention(params).then((res) => {
          if (res.code == 200) {
            this.$toast.success("申请成功");
            localStorage.removeItem("map_address_form");
            setTimeout(() => {
              this.$router.push("/member/member");
            }, 1500);
          }
        });
      } else if (index == "1") {
        // console.log("进入修改")
        this.$api.getOrder.edit_apply_mention(params).then((res) => {
          if (res.code == 200) {
            this.$toast.success("修改成功");
            localStorage.removeItem("map_address_form");
            setTimeout(() => {
              this.$router.push("/member/member");
            }, 1500);
          }
        });
      }
    },
    editApplyBtn() {
      //修改团长信息
    },
  },
};
</script>
<style lang="less" scoped>
.van-cell__value {
  color: #323233;
}

.applybox .van-cell {
  padding: 0;
  height: 50px;
}

.mentionapply {
  width: 100%;
  height: 100%;
  overflow: auto;
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;

  .applybox {
    width: 100%;
    flex: 1;
    overflow: auto;

    .applybox_top {
      width: 100%;

      img {
        width: 100%;
      }
    }

    .applybox_content {
      width: 100%;
      padding: 0 12px;
      background-color: #ffffff;

      .inputlabel {
        font-size: 14px;
        color: #3e3e3e;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;

        span {
          font-size: 20px;
          color: #f45858;
          line-height: 26px;
          padding-top: 1px;
          padding-right: 5px;
        }
      }

      .van-cell__value {
        // color: #969799 !important;
      }
    }

    .applybox_upimg {
      width: 100%;
      padding: 0 13px;
      margin-top: 10px;

      background-color: #ffffff;

      > p {
        width: 100%;
        text-align: center;
        font-size: 14px;
        line-height: 40px;
        color: #6c6c6c;
        text-align: left;
      }

      > p:nth-of-type(2) {
        border-top: 1px solid #f3f3f3;
      }

      .upbox {
        width: 100%;
        padding: 17px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;

        > div {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .upbox_left {
          width: 150px;

          img {
            border-radius: 10px;
            border: 1px solid #f6f6f6;
            padding: 5px;
            width: 100%;
            height: 100px;
          }

          > p {
            width: 100%;
            text-align: center;
            font-size: 14px;

            color: #6c6c6c;
            line-height: 30px;
          }
        }
      }
    }

    .applybox_btn {
      width: 100%;
      padding: 0 17px;
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;

      // margin-top: 15px;
      .applybtn {
        width: 100%;
        height: 42px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #ed6c00;
        background-color: #fff1e4;
        border-radius: 25px;
        margin: 15px 0;
      }
    }
  }
}
</style>
