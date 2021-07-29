<template>
  <div class="buyers_add">
    <van-nav-bar
      title="随手拍"
      left-arrow
      class="navbar"
      @click-left="toBack"
    />
    <div class="buyers_add_con">
      <van-field
        v-model="data.content"
        rows="5"
        autosize
        type="textarea"
        placeholder="您可以再这里输入内容，记录您的一切"
      />
      <div class="buyers_add_img">
        <p class="fx">
          图片上传
          <span>您最多可以上传6张图片</span>
        </p>
        <div class="buyers_add_img_div">
          <div
            class="buyers_add_img_div_item"
            v-for="(item, k) in piclink"
            :key="k"
          >
            <img :src="$fnc.getImgUrl(item)" alt />
            <span @click="del_img(k)">
              <van-icon name="cross" color="#ffffff" size="12px"></van-icon>
            </span>
          </div>

          <div
            class="buyers_add_img_div_item add_box_up_up"
            v-if="piclink.length < 6"
          >
            <van-uploader :after-read="afterRead">
              <div class="up_inp_refund">
                <van-icon
                  name="photo-o"
                  class="fa fa-camera"
                  size="28px"
                  color="#ECECEC"
                />
              </div>
            </van-uploader>
          </div>
        </div>
      </div>
    </div>

    <div class="fx buyers_add_address">
      <p
        class="fx"
        :class="data.address ? 'have_address' : ''"
        @click="get_lat_lng"
      >
        <van-icon name="location-o" />
        {{ data.address }}
      </p>
    </div>

    <div class="buyers_add_btn">
      <van-checkbox icon-size="14" v-model="checked" shape="square">
        我已经阅读并同意《
        <span @click="$router.push('/useragreement?id=7')">发布协议</span>
        》
      </van-checkbox>
      <p @click="subInfo">发布</p>
    </div>

    <van-popup
      v-model="map_show"
      position="bottom"
      :style="{ width: '100%', height: '100%' }"
    >
      <mapAddress
        @sendPosition="recPosition"
        :spe_location="spe_location"
        @closemap="map_show = false"
        v-if="map_show"
        navtitle="当前位置"
      ></mapAddress>
    </van-popup>
  </div>
</template>


<script>
import { Field, Checkbox } from "vant";
import mapAddress from "@/components/setting/map_address";
export default {
  components: {
    [Checkbox.name]: Checkbox,
    [Field.name]: Field,
    mapAddress,
  },
  data() {
    return {
      checked: true,
      map_show: false,
      data: {
        content: "",
        address: "",
        longitude: "",
        latitude: "",
      },
      piclink: [],
      spe_location: {
        lat: 0,
        lng: 0,
      },
    };
  },
  methods: {
    subInfo() {
      if (this.checked == false) {
        this.$toast.fail("请先阅读并同意协议");
        return;
      }
      var that = this;
      that.$dialog
        .confirm({
          title: "提示",
          message: "是否发布？",
        })
        .then(() => {
          var params = {};
          params = that.data;
          params.pic = that.piclink.join("@") || "";
          that.$api.getShop.addReview(params).then((res) => {
            if (res.code == 200) {
              that.$toast.success("发布成功");
              setTimeout(() => {
                that.toBack();
              }, 1500);
            }
          });
        });
    },
    get_lat_lng() {
      this.spe_location = {
        lat: 0,
        lng: 0,
      };
      this.map_show = true;
    },
    recPosition(obj) {
      this.map_show = false;
      this.data.address = obj.address;
      this.data.longitude = obj.lng;
      this.data.latitude = obj.lat;
    },
    del_img(k) {
      this.piclink.splice(k, 1);
      // params.pic = that.pic.join("@") || '';
    },
    afterRead(file) {
      var that = this;
      this.$fnc.imgCompress(file.content, function (src) {
        that.piclink.push(src);
      });
    },
  },
};
</script>



<style lang="less" scoped>
.buyers_add {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f8f8ff;
  font-size: 14px;
  padding-bottom: 50px;
  .buyers_add_con {
    width: 100%;
    margin: 10px auto 0;
    padding: 0 10px;
    background: #ffffff;
    .van-field {
      padding: 10px 0;
    }
    .van-cell::after {
      left: 0;
    }
    .buyers_add_img {
      width: 100%;
      padding: 10px 0;
      font-size: 16px;
      color: #3a4658;
      span {
        font-size: 14px;
        line-height: 1;
        background: #ececec;
        border-radius: 3px;
        color: #48576c;
        padding: 4px 8px;
      }
      .buyers_add_img_div {
        width: 100%;
        background-color: #ffffff;
        padding: 16px 0 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        .buyers_add_img_div_item {
          width: 100px;
          height: 100px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 5px;
          margin-right: 6px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .add_box_up_up {
          border: 1px dashed #ececec;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2px;
        }
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ff2f57;
          position: absolute;
          padding: 2px;
          top: 0;
          right: 0px;
        }
        .up_inp_refund {
          width: 100%;
          height: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  .buyers_add_address {
    width: 100%;
    padding: 14px 10px;
    > p {
      font-size: 14px;
      line-height: 1;
      border-radius: 5px 0px 5px 0px;
      .van-icon {
        font-size: 16px;
      }
    }
    .have_address {
      background: #faf2c7;
      padding: 4px 6px 4px 3px;
    }
  }
  .buyers_add_btn {
    width: 100%;
    position: fixed;
    bottom: 0;
    .van-checkbox {
      width: 100%;
      font-size: 12px;
      line-height: 1;
      padding: 6px 12px;
      border-bottom: 1px solid #cccccc;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: #459eff;
      }
    }
    > p {
      width: 100%;
      line-height: 50px;
      text-align: center;
      background: #ffd500;
      color: #ffffff;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 2px;
    }
  }
}
</style>
