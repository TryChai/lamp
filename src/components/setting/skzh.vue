<template>
  <div class="con_bg">
    <van-nav-bar :title="$h('收款账号管理')" left-text left-arrow class="navbar" @click-left="$router.back(-1)" />
    <form>
      <div class="cu-form-group margin-top">
        <div class="title">{{$h('银行账号')}}</div>
        <van-cell-group class="fx_3" :border="false">
          <van-field @blur="windowScorll" v-model="bank_card" type="text" :placeholder="$h('请输入银行账号')" clearable />
        </van-cell-group>
      </div>
      <div class="cu-form-group">
        <div class="title">{{$h('银行户名')}}</div>
        <van-cell-group :border="false" class="fx_3">
          <van-field @blur="windowScorll" v-model="bank_name" type="text" :placeholder="$h('请输入银行户名')" clearable />
        </van-cell-group>
      </div>
      <div class="cu-form-group" style="justify-content:space-between">
        <div class="title">{{$h('开户银行')}}</div>
        <div @click="show=true">
          {{coin}}
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="cu-form-group" style="justify-content:space-between">
        <div class="title">{{$h('开户地址')}}</div>
        <div @click="seladdressshow = true" style="font-size:12px">
          {{cs}}
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="cu-form-group">
        <div class="title">{{$h('开户网点')}}</div>
        <van-cell-group class="fx_3" :border="false">
          <van-field @blur="windowScorll" v-model="bank_network" type="text" :placeholder="$h('请输入网点信息')" clearable />
        </van-cell-group>
      </div>

      <div class="padding">
        <div class="cu-btn bg-gradual-orange block margin-tb-sm lg but" @click="subInfo" 
          :style="$store.state.config.shop.button_bj_color?{background:$store.state.config.shop.button_bj_color}:{}">{{$h('保存')}}</div>
      </div>
    </form>
    <van-popup v-model="show" position="bottom">
      <van-picker :columns="picker" :default-index="index" @cancel="onCancel" @confirm="onConfirm" :show-toolbar="true" />
    </van-popup>

    <!-- <van-popup v-model="address" position="bottom">
      <van-area :area-list="addressList" value="110101" @confirm="xzarrea" @cancel="address=false" />
    </van-popup> -->

    <selAddress :level="4" :show="seladdressshow" @confirm="confirmaddress"></selAddress>
  </div>
</template>


<script>
import { Picker, Field, Area } from "vant";
import axios from "axios";
import selAddress from "@/components/currency/selAddress/selAddress"
export default {
  name: "skzh",
  components: {
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Area.name]: Area,
    selAddress
  },
  data () {
    return {
      seladdressshow: false,
      index: -1,
      picker: [
        "中国工商银行",
        "中国农业银行",
        "中国银行",
        "中国建设银行",
        "交通银行",
        "中国邮政储蓄银行",
        "中信银行",
        "光大银行",
        "华夏银行",
        "民生银行",
        "招商银行",
        "平安银行",
        "兴业银行"
      ],
      bank_card: "",
      bank_name: "",
      bank_network: "",
      themeColor: "#007AFF",
      mode: "",
      deepLength: 1,
      pickerText: [],
      coin: this.$h('请选择开户银行'),
      userInfo: {
        is_real: 0
      },
      show: false,
      address: false,
      cs: this.$h('请选择地址'),
      user: this.$store.state.user
    };
  },
  mounted () {

  },
  methods: {
    confirmaddress (data) {
      this.pickerText = data;
      this.cs = `${data[0] || ''}${data[1] || ''}${data[2] || ''}${data[3] || ''} `
      this.seladdressshow = false;
    },
    xzarrea (a) {
      this.cs = a[0].name + "-" + a[1].name + "-" + a[2].name;
      this.address = false;
      this.pickerText = [a[0].name, a[1].name, a[2].name];
    },
    onCancel () {
      this.show = false;
    },
    onConfirm (value, index) {
      this.coin = value;
      this.show = false;
      this.index = index;
    },
    subInfo () {
      this.bank_card = this.bank_card || "";
      this.bank_name = this.bank_name || "";

      if (this.bank_card == "" || this.bank_card.length < 12) {
        this.$toast.fail("银行账号不能为空，且不低于12个字符");
        return false;
      } else if (this.bank_name == "" || this.bank_name.length > 6) {
        this.$toast.fail("户名不能为空，且最多六个中文");
        return false;
      } else if (
        this.picker[this.index] == undefined ||
        this.picker[this.index] == ""
      ) {
        this.$toast.fail("开户行不能为空");
        return false;
      } else if (this.cs == "" || this.cs == "请选择地址") {
        this.$toast.fail("开户地址不能为空");
        return false;
      } else if (this.bank_network == "" || this.bank_network.length < 4) {
        this.$toast.fail("开户网点不能为空，且不低于4个字符");
        return false;
      }
      var arr = this.pickerText;
      console.log(arr);
      var params = {};
      params.bank_card = this.bank_card;
      params.bank_name = this.bank_name;
      params.bank_network = this.bank_network;
      params.bank = this.picker[this.index];
      params.bank_province =
        arr[0] || this.$store.state.user.bank_province || "";
      params.bank_city = arr[1] || this.$store.state.user.bank_city || "";
      this.$api.getSetting.setSkzh(params).then(res => {
        if (res.code == 200) {
          this.$toast.success("操作成功");

          setTimeout(() => {
            this.$store.dispatch("getUser");
            this.toBack();
          }, 3000);
        }
      });
    }
  },
  created () {
    var info = this.$store.state.user;
    this.bank_card = info.bank_card;
    this.bank_name = info.bank_name;
    this.bank_network = info.bank_network;
    this.coin = info.bank || "";
    this.cs = info.bank_province
      ? (info.bank_province || "") + "-" + (info.bank_city || "")
      : "请选择地址";
    for (var i in this.picker) {
      if (this.picker[i] == info.bank) {
        this.index = parseInt(i);
      }
    }
  }
};
</script>

<style scoped>
.city_xu {
  font-size: 17px;
  color: #ddd;
  line-height: 50px;
}
.tishi {
  background: none;
}
.beiz > div {
  min-height: 30px;
  line-height: 1.5;
  height: auto;
  padding-right: 0;
  font-size: 10px;
  padding: 10px 0;
}
.tishi > div {
  color: #999999;
  font-size: 12px;
}
.bg-sub {
  background: #d1d1d1;
  border-radius: 0;
  color: #fff;
  font-size: 12px;
}
.up_img {
  width: 48px;
  height: 39px;
}
.up_view {
  width: 148px;
  height: 132px;
  text-align: center;
  margin: 0 11px;
  position: relative;
}
.up_bor {
  height: 100%;
  border: 1px solid #cccccc;
  border-radius: 2px;
  line-height: 132px;
}
.up_text {
  position: relative;
  top: -60px;
  color: #5e6266;
}
.up_img_con {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  padding: 10px 0;
}
.up_beizhu {
  background: #fffff5;
  padding: 5px 15px;
}
.up_beizhu > div > span {
  color: #5e6266;
  font-size: 12px;
}
.size_le {
  line-height: 1.5;
}
.title + div {
  font-size: 14px;
}
form {
  height: 90%;
}
</style>
