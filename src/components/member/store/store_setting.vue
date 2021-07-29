<template>
  <div class="store_setting">
    <van-nav-bar title="微店设置" left-text left-arrow class="navbar" @click-left="$router.back()" />
    <div class="setting_body">

      <div class="setting_item">
        <van-uploader multiple :after-read="afterRead_ava" class="setting_up">
          <van-icon name="plus" v-if="add_form.microshop_logo == ''" />
          <img :src="add_form.microshop_logo" alt />
        </van-uploader>
        <p class="setting_title">微店logo</p>
      </div>

      <div class="setting_item van-hairline--bottom">
        <van-cell-group :border="false" class="setting_down">
          <van-field @blur="windowScorll" v-model="add_form.microshop_title" placeholder="请输入店铺标题" clearable />
        </van-cell-group>
      </div>

      <div class="setting_item van-hairline--bottom">
        <van-cell-group :border="false" class="setting_down">
          <van-field @blur="windowScorll" :value="color" @click="showcolor = true" clearable placeholder="微店色调(默认黄色)" />

          <van-popup v-model="showcolor" position="bottom">
            <van-picker show-toolbar :columns="color_list" value-key="label" @cancel="showcolor = false" @confirm="confirm_color"></van-picker>
          </van-popup>
        </van-cell-group>
      </div>

      <div class="setting_item van-hairline--bottom">
        <van-cell-group :border="false" class="setting_down">
          <van-field @blur="windowScorll" @click="seladdressshow = true" :value="add_form.microshop_ctrl" placeholder="请选择所在城市" />
        </van-cell-group>
      </div>

      <div class="setting_item van-hairline--bottom">
        <van-cell-group :border="false" class="setting_down">
          <van-field @blur="windowScorll" v-model="add_form.microshop_tel" type="tel" clearable placeholder="请输入电话" />
        </van-cell-group>
      </div>
    </div>
    <div class="setting_btn">
      <van-button type="info" size="large" @click="submit">提交</van-button>
    </div>

    <selAddress :level="4" :show="seladdressshow" @confirm="confirmaddress"></selAddress>
  </div>
</template>
<script>
import { Field, Picker } from "vant";
import axios from "axios";
import selAddress from "@/components/currency/selAddress/selAddress"
export default {
  name: "store_setting",
  data () {
    return {
      seladdressshow: false,
      showcolor: false,
      color: "黄色",
      color_list: [
        {
          label: "黄色",
          value: "#ffcc00"
        },
        {
          label: "红色",
          value: "#ff0000"
        },
        {
          label: "浅绿色",
          value: "#8cc540"
        },
        {
          label: "深绿色",
          value: "#009f5d"
        },
        {
          label: "暗蓝色",
          value: "#019fa0"
        },
        {
          label: "蓝色",
          value: "#019fde"
        },
        {
          label: "深蓝色",
          value: "#007cdc"
        },
        {
          label: "深紫色",
          value: "#887ddd"
        },
        {
          label: "浅紫色",
          value: "#cd7bdd"
        },
        {
          label: "粉色",
          value: "#ff5675"
        },
        {
          label: "红色",
          value: "#ff1244"
        },
        {
          label: "橙色",
          value: "#ff8345"
        },
        {
          label: "灰色",
          value: "#d1d2d4"
        }
      ],
      cs: "请选择地址",
      add_form: {
        microshop_title: "", //店铺标题
        microshop_logo: "", // 店铺logo
        microshop_colour: "#ffcc00", //  色调
        microshop_ctrl: "请选择地址", //  城市
        microshop_tel: "", //  电话
        province: "", //省
        city: "", //市
        area: "" //区
      }
    };
  },
  components: {
    [Field.name]: Field,
    [Picker.name]: Picker,
    selAddress
  },
  mounted () {

  },
  created () {
    this.get_info();
  },
  methods: {
    confirmaddress (data) {
      this.add_form.province = data[0] || '';
      this.add_form.city = data[1] || '';
      this.add_form.area = data[2] || '';
      this.add_form.town = data[3] || '';
      this.add_form.microshop_ctrl = `${data[0] || ''}${data[1] || ''}${data[2] || ''}${data[3] || ''} `
      this.seladdressshow = false;
    },
    confirm_color (obj) {
      console.log(obj);
      this.color = obj.label;
      this.add_form.microshop_colour = obj.value;
      this.showcolor = false;
    },
    submit () {
      if (this.add_form.microshop_title == "") {
        this.$toast.fail("请填写店铺标题");
      } else if (this.add_form.microshop_logo == "") {
        this.$toast.fail("请上传店铺logo");
      } else if (this.add_form.microshop_colour == "") {
        this.$toast.fail("请选择色调");
      } else if (this.add_form.microshop_ctrl == "") {
        this.$toast.fail("请选择所在城市");
      } else if (this.add_form.microshop_tel == "") {
        this.$toast.fail("请填写电话");
      } else {
        var that = this;
        that.$dialog
          .confirm({
            message: "是否编辑"
          })
          .then(() => {
            var params = {};
            params.microshop_title = that.add_form.microshop_title;
            params.microshop_logo = that.add_form.microshop_logo;
            params.microshop_colour = that.add_form.microshop_colour;
            params.microshop_ctrl = that.add_form.microshop_ctrl;
            params.microshop_tel = that.add_form.microshop_tel;
            that.$api.getShop.edit_store_info(params).then(res => {
              if (res.code == 200) {
                that.$toast.success("编辑成功");
                setTimeout(() => {
                  this.$router.push('/member/member')
                }, 1500);
              }
            });
          })
          .catch(() => { });
      }
    },
    get_info () {
      console.log("!!");
      this.$api.getShop.get_edit_store_info({}).then(res => {
        if (res.code == 200) {
          this.add_form.microshop_title = res.result.microshop_title;
          this.add_form.microshop_logo = res.result.microshop_logo;
          if (
            res.result.microshop_colour &&
            res.result.microshop_colour != ""
          ) {
            let c_obj = this.color_list.find(item => {
              return item.value == res.result.microshop_colour;
            });
            this.color = c_obj.label;
            this.add_form.microshop_colour = res.result.microshop_colour;
          } else {
            this.color = "黄色";
            this.add_form.microshop_colour = "#ffcc00";
          }
          this.add_form.microshop_ctrl = res.result.microshop_ctrl;
          this.add_form.microshop_tel = res.result.microshop_tel;
        }
      });
    },
    afterRead_ava (file) {
      //上传厂家授权
      var that = this;
      this.$fnc.imgCompress(file.content, function (src) {
        that.add_form.microshop_logo = src;
      });
    }
  }
};
</script>
<style  lang="less"  scoped>
.store_setting {
  width: 100%;
  .setting_body {
    width: 100%;
    padding: 30px;
    .setting_item {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-flow: wrap;
      padding: 5px 0;
      .setting_title {
        width: 100%;
        text-align: center;
        font-size: 16px;
        margin-top: 5px;
      }
      .setting_up {
        width: 100px;
        height: 100px;
        border: 2px dashed #bdbdbd;
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }
      .setting_down {
        width: 100%;
        .van-cell {
          padding: 0 !important;
          height: 48px;
          line-height: 48px;
        }
      }
    }
  }
  .setting_btn {
    width: 100%;
    padding: 30px 30px 0;
    > .van-button {
      border-radius: 30px;
    }
  }
}
</style>