<template>
  <div class="inf_height">
    <van-nav-bar
      :title="$h('添加功德主')"
      left-text
      left-arrow
      class="navbar"
      @click-left="backLeft"
    />
    <div>
      <van-notice-bar left-icon="warning-o" mode="closeable"
        >请认真填写信息，处理完成之后无法备注修改</van-notice-bar
      >
      <div class="add_merit">
        <div class="add_border" @click="show_gdz = true">
          <van-icon name="add" class="add_icon" size="35" color="#285AF8" />
          <div class="add_content">
            <div class="title1">添加功德主</div>
            <div class="tip">功德主资料将用于记录与反馈</div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="border_content">
          <van-cell-group class="address_set cell">
            <van-field
              v-model="params.name"
              clearable
              style="color: #333"
              :label="$h('姓名')"
              input-align="right"
              :placeholder="$h('请输入姓名')"
            />
            <van-field name="radio" input-align="right" :label="$h('性别')">
              <template #input>
                <van-radio-group
                  v-model="params.sex"
                  direction="horizontal"
                >
                  <van-radio name="1">男</van-radio>
                  <van-radio name="2">女</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              @blur="windowScorll"
              v-model="params.tel"
              type="tel"
              clearable
              :label="$h('电话')"
              input-align="right"
              :placeholder="$h('请输入联系电话')"
            />
            <van-field
              clearable
              readonly
              disabled
              @click="showDate = true"
              :value="params.birth_date"
              label="出生年月"
              placeholder="请选择您的出生年月"
              label-width="85px"
              right-icon="arrow"
            />
            <van-popup get-container="body" v-model="showDate" position="bottom">
              <van-datetime-picker
                title="出生年月"
                :min-date="min_birth_date"
                :max-date="max_birth_date"
                @confirm="confirm_birth_date"
                @cancel="showDate = false"
                v-model="birth_date"
                show-toolbar
                type="date"
              />
            </van-popup>
            <!-- @click="seladdressshow = true" -->
            <!-- <van-cell :title="$h('地区')" :value="cateTitle">
              <van-icon name="arrow" slot="right-icon" size="14px" />
            </van-cell> -->

            <div v-if="open_map == true">
              <van-cell
                readonly
                :title="$h('定位区域')"
                @click="get_lat_lng"
                :value="params.address ? params.address : '请选择'"
              >
                <van-icon name="location-o" slot="right-icon" size="14px" />
              </van-cell>
              <van-field
                readonly
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
            class="address_set"
            @blur="windowScorll"
            v-model="params.shop_wish"
            type="textarea"
            clearable
            autosize
            readonly
            @click="
              show_wish = true;
              shop_wish = params.shop_wish;
            "
            :label="$h('心愿')"
            input-align="right"
            :placeholder="$h('请输入你的心愿')"
          />
        </div>
      </div>
      <div class="content">
        <div class="border_content">
          <div class="is_nn">
            <div class="nn_left">
              <div class="center1">
                <van-icon name="manager" size="20" color="#285AF8" />
                <span>匿名参与</span>
              </div>
              <span class="tip"
                >对寺庙，其他用户在参与记录中将隐藏你的名称</span
              >
            </div>
            <van-switch
              v-if="!is_show"
              @change="confirmedit1"
              v-model="value"
              active-value="1"
              inactive-value="0"
              active-color="#1989FA"
              size="23px"
            />
            <van-switch
              v-else
              @change="confirmedit"
              v-model="new_radio_value"
              active-value="1"
              inactive-value="0"
              active-color="#1989FA"
              size="23px"
            />
          </div>
        </div>
      </div>
      <div class="protocol">
        点击下一步表示同意<span @click="show_protcol = true">《服务协议》</span>
      </div>
      <div class="content">
        <div class="">
          <div class="sk-butt">
            <div class="btn_round1" v-if="!is_show">
              <div class="next" @click="nextOrder">下一步</div>
            </div>
            <div class="btn_round" v-else>
              <div class="total">合计S${{ randomNumber }}</div>
              <div class="next" @click="pay_gdz">下一步</div>
            </div>
          </div>
        </div>
      </div>
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
    <van-popup
      v-model="show"
      class="add_show_edit"
      get-container="body"
      position="right"
    >
      <addAddres
        @back="back"
        @getAddressItem="getAddressItem"
        :isOrder="true"
        v-if="show"
        :item="item"
      />
    </van-popup>
    <!-- 心愿管理 -->
    <!-- get-container="body" -->
    <van-popup
      v-model="show_wish"
      :style="{
        width: '85%',
        paddingBottom: '10px',
        backgroundColor: '#4C4C4C',
      }"
    >
      <div class="wish_wrappar">
        <!-- <div class="wish_close">
          <van-icon @click="show_wish = false" size="24" name="close" />
        </div> -->
        <div class="wish_content">
          <div class="wish_img">
            <img src="../../assets/img/project/sy_pic_bt.png" />
          </div>
          <div class="wish_title">写下您的心愿</div>
          <div class="wish_border">
            <van-field
              @blur="windowScorll"
              v-model="shop_wish"
              type="textarea"
              height="80"
              clearable
              autosize
              maxlength="50"
              show-word-limit
              input-align="left"
              :placeholder="
                $h(
                  '请选择或者写下您的心愿，愿菩萨保佑你早日心愿成真哦！最多可输入50个字'
                )
              "
            />
          </div>
          <div class="wish_middle">
            <div class="tags">
              <p
                class="tags_t"
                @click="toTags(item)"
                v-for="(item, index) in wishList"
                :key="index"
              >
                {{ item }}
              </p>
            </div>
            <div class="replay">
              <div @click="get_random_content()">
                <img
                  :class="[rotate ? 'go' : 'aa']"
                  src="../../assets/img/project/rotate_icon.png"
                />
              </div>
              <span><p>摇一摇，换一组</p></span>
            </div>
          </div>

          <div class="footer">
            <div class="complete" @click="complate">
              <img src="../../assets/img/project/complete_btn.png" />
            </div>
            <div class="complete_text" @click="complate">完成</div>
            <van-radio-group
              v-model="is_public"
              @change="radioChange"
              class="fx assess_form_radio"
            >
              <van-radio
                icon-size="11px"
                checked-color="#F72A48"
                name="1"
                @click="radioClick"
                class="assess_form_radio_item"
                >公开
                <!-- <template #icon="props">
                  <img
                    class="img-icon"
                    :src="props.checked ? activeIcon : inactiveIcon"
                  /> </template
              > -->
              </van-radio>
            </van-radio-group>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 选择功德主 -->
    <van-popup
      v-model="show_gdz"
      :style="{ height: '100%', width: '100%' }"
      get-container="body"
      position="right"
    >
      <information
        @close_information="
          show_gdz = false;
          getAddress();
        "
        @getAddressItem="getAddressItem"
        :isShop="true"
        @back="getback"
        :isOrder="true"
        v-if="show_gdz"
      />
      <addAddres
        @getAddressItem="getAddressItem"
        @back="getback"
        
        :item="{}"
        :isOrder="true"
        v-else
      />
    </van-popup>
    <van-popup
      v-model="show_protcol"
      :style="{ height: '100%', width: '100%' }"
      get-container="body"
      position="right"
    >
      <useragreement
        @close_self="show_protcol = false"
        :id="protocol_id"
      ></useragreement>
    </van-popup>
  </div>
</template>
<script>
import {
  AddressEdit,
  Field,
  Calendar,
  DatetimePicker,
  RadioGroup,
  Radio,
  AddressList,
} from "vant";
import { setTimeout } from "timers";
import useragreement from "@/components/currency/userAgreement/userAgreement";
import mapAddress from "@/components/setting/map_address";
import selAddress from "@/components/currency/selAddress/selAddress";
import information from "@/components/setting/information";
import addAddres from "@/components/setting/addAddres";
export default {
  data() {
    return {
      showId: "",
      name: "",
      tel: "",
      address: "",
      radio: "1",
      addressList: [],
      load: false,
      is_address: false,
      chosenAddressId: "",
      list: [],
      show: false,
      item: {},
      //新增
      seladdressshow: false,
      isxcx: navigator.userAgent.indexOf("miniProgram") !== -1 ? true : false,
      spe_location: {
        lat: 0,
        lng: 0,
      },
      map_show: false,
      open_map: false,
      searchResult: [],
      cateTitle: this.$h("请选择所在地区"),
      birthdayData: "",
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
        sex: "1",
        birth_date: "",
        shop_wish: "",
      },
      citys: [],
      showDate: false,
      min_birth_date: new Date(1970, 0, 1),
      max_birth_date: new Date(),
      birth_date: new Date(),
      wishList: [], //心愿列表
      show_wish: false,
      is_public: "1",
      show_gdz: false, //选择功德主
      show_gdz: false,
      aid: "", //功德主管理中id
      shop_wish: "",
      new_radio_value: this.radio_value,
      rotate: false,
      show_protcol: false,
      protocol_id: "15", //协议id
      value: "1",
      real_birth_date:"",
    };
  },
  props: {
    isShop: {
      type: Boolean,
      default: false,
    },
    radio_value: {
      type: [String, Number],
    },
    randomNumber: {
      type: [String, Number],
    },
    is_show: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    [AddressList.name]: AddressList,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    addAddres,
    [AddressEdit.name]: AddressEdit,
    [Field.name]: Field,
    [Calendar.name]: Calendar,
    [DatetimePicker.name]: DatetimePicker,
    mapAddress,
    selAddress,
    information,
    useragreement,
  },
  watch: {
    radio_value(val) {
      this.new_radio_value = val;
    },
  },
  created() {
    this.getAddress();
    this.get_random_content();
    this.auctionpay();
  },
  methods: {
    nextOrder() {
      var param ={};
      param.name = this.params.name;
      param.sex = this.params.sex;
      param.tel = this.params.tel;
      param.birth_date = this.birth_date;
      param.address = this.params.address;
      param.wish_content = this.params.shop_wish;
      param.aid = this.aid || "";
      param = JSON.stringify(param)
      console.log(param)
      if (this.params.shop_wish == "") {
        this.$toast.fail("请输入你的心愿！");
        return false;
      }  else {
        this.$router.push(
          "/order/addorder?obj=" +
            param +
            "&is_public=" +
            this.is_public +
            "&is_anonymous=" +
            this.value
        );
      }
    },
    auctionpay() {
      this.$api.getShop.get_default_address({}).then((res) => {
        if (res.code == 200) {   
          if (res.result!='' && res.result != null) {
            this.params = res.result || {};
            this.params.shop_wish = res.result.wish_content;
            this.params.birth_date = this.$fnc.getTimeFormat(res.result.birth_date,'ymd')
            this.birth_date = res.result.birth_date
            this.aid = res.result.id;
            this.cateTitle =
              this.params.province +
              this.params.city +
              this.params.area +
              this.params.town;
          }else{
            this.params={};
            this.cateTitle =this.$h("请选择所在地区");
            this.params.birth_date="";
            this.aid="";
          }
        }
      });
    },
    confirmedit(val) {
      this.$emit("change_radio", val);
    },
    confirmedit1(val) {
      this.value = val;
    },
    complate() {
      this.params.shop_wish = this.shop_wish;
      this.show_wish = false;
      this.shop_wish = "";
    },
    pay_gdz() {
      // if(this.aid==''){
      //   this.$toast.fail('请填写功德主！')
      //   return false
      // }
      let param = {};
      param.aid = this.aid || "";
      param.money = this.randomNumber;
      param.is_anonymous = this.radio_value;
      param.id = this.$route.query.id;
      param.cid = this.$route.query.id;
      param.is_public = this.is_public;
      param.name = this.params.name;
      param.sex = this.params.sex;
      param.tel = this.params.tel;
      param.birth_date = this.birth_date;
      param.address = this.params.address;
      param.wish_content = this.params.shop_wish;

      if(this.real_birth_date!=''){
        param.birth_date = this.real_birth_date;
      }else{
        param.birth_date = this.birth_date;
      }
      this.$dialog
        .confirm({
          title: "是否供奉",
          message: "确定供奉S$" + this.randomNumber + "吗？",
        })
        .then(() => {
          this.show = false;
          this.$api.getZhanYe.submit_zhanye_pay(param).then((res) => {
            //缴费
            if (res.code == 200) {
              this.$toast.success("提交善缘成功", 1000);
              setTimeout(() => {
                this.$router.push({
                  path: "/order/payorder",
                  query: {
                    id: res.result,
                  },
                });
              }, 1000);
            }
          });
        })
        .catch(() => {});
    },
    toTags(val) {
      if(this.shop_wish){
        this.shop_wish = this.shop_wish += val + " ";
      }else{
        this.shop_wish =  val + " ";
      }
      
      console.log(this.shop_wish);
    },
    getAddressItem(e) {
      console.log(e)
      this.params = e;
      this.aid = e.id;
      this.params.shop_wish = e.wish_content;
      this.params.birth_date = this.$fnc.getTimeFormat(e.birth_date,'ymd')
      this.birth_date = new Date(e.birth_date) / 1000;
      this.cateTitle =
        this.params.province +
        this.params.city +
        this.params.area +
        this.params.town;
      this.show_gdz=false;
    },
    getback() {
      this.show_gdz = false; //关闭功德主页面
      this.auctionpay();
    },
    radioClick() {
      if (!this.radio_change) {
        this.is_public = "0";
      }
      this.radio_change = false;
    },
    radioChange() {
      this.radio_change = true;
    },
    get_random_content() {
      this.rotate = !this.rotate;
      var that = this;
      var params = {};
      that.$api.getDz.get_random_content(params).then((res) => {
        if (res.code == 200) {
          this.wishList = res.result;
        }
      });
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
    confirm_birth_date(val) {
      this.params.birth_date = this.$fnc.getTimeFormat(new Date(val) / 1000,'ymd');
      console.log(val)
      this.birth_date = new Date(val) / 1000;
      this.showDate = false;
    },
    //新增
    backLeft() {
      if (this.isShop == true) {
        this.$emit("close_information");
      } else {
        this.toBack();
      }
    },
    getAddress() {
      this.$api.getSetting.getAddres({}).then((res) => {
        if (res.code === 200) {
          var arr = [];
          arr = res.result;
          arr.filter((item) => {
            item.add = item.address;
            // item.address=item.province+item.city+item.area+item.address

            if (item.is_show == 1) {
              this.$store.commit("setDefaultAddress", item);
              this.showId = item;
            }
          });
          this.list = arr;
          this.load = true;
        }
      });
    },
    back(bool) {
      this.show = false;
      if (bool) {
        this.getAddress();
        // this.auctionpay();
      }
    },
  },
};
</script>

<style lang='less' scoped >
.item_address {
  padding: 0 15px;
  > .cu-form-group {
    padding: 0;
    justify-content: flex-start;
  }
}
.inf_height {
  background: #f3f3f3;
  font-size: 14px;
  line-height: 1.8;
  overflow: auto;
  position: relative;
}
.addreslist {
  position: relative;
  z-index: 1;
}
.add_show_edit {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
.title {
  font-size: 14px !important;
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
.inf_height {
  height: 100%;
}
.no_zhi {
  /* position: absolute; */
  /* top: 0; */
}
.no_zhi > div {
  position: absolute;
  z-index: 1;
  width: 100%;
  text-align: center;
  top: 60%;
  color: #373923;
}
.no_zhi > img {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.no_zhi_sub {
  top: 85% !important;
}
.up_dizhi {
  flex-wrap: wrap;
  padding: 20px 15px;
  font-size: 15px;
}
.up_dizhi > div {
  width: 100%;
  height: 20px !important;
  line-height: 20px !important;
  font-size: 13px;
}
.title {
  color: #333;
  font-weight: bold;
  font-size: 14px;
}
.left_edit {
  margin-right: 12px;
}
.bg-gradual-orange {
  background: linear-gradient(45deg, #ff9700, #ed1c24);
  border: none;
  border-radius: 5px;
}
.add_merit {
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  .add_border {
    display: flex;
    align-items: center;
    border: 1px solid #f3f3f3;
    width: 100%;
    padding: 5px 5px;
    border-radius: 5px;
    .add_icon {
      margin-left: 10px;
    }
    .add_content {
      margin-left: 10px;
      .title1 {
        font-size: 15px;
        font-weight: 700;
      }
      .tip {
        font-size: 12px;
        // color: #f3f3f3;
      }
    }
  }
}
.protocol {
  font-size: 14px;
  background-color: #fff;
  padding-left: 20px;
  span {
    color: #285af8;
  }
}

.content {
  padding: 10px 10px;
  background-color: #fff;
  .border_content {
    border: 1px solid #f3f3f3;
    padding: 5px;
    /deep/.van-field__control:disabled{
      color: #222;
      -webkit-text-fill-color:#222;
    }
    .is_nn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 5px;
      .nn_left {
        .center1 {
          display: flex;
          span {
            margin-left: 5px;
          }
        }
        .tip {
          font-size: 12px;
          color: #285af8;
        }
      }
    }
  }
}
.btn_round {
  border: 1px solid #285af8;
  border-radius: 25px;
  display: flex;
  align-items: center;
  // padding: 10px 5px;
  .total {
    display: flex;
    width: 50%;
    justify-content: center;
  }
  .next {
    width: 50%;
    display: flex;
    justify-content: center;
    background-color: #285af8;
    border-radius: 0px 25px 25px 0px;
    color: #fff;
    padding: 8px 5px;
  }
}
.btn_round1 {
  border: 1px solid #285af8;
  border-radius: 25px;
  display: flex;
  align-items: center;
  .next {
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: #285af8;
    border-radius: 25px;
    color: #fff;
    padding: 8px 5px;
  }
}
// 心愿弹窗
.wish_wrappar {
  position: relative;
  height: 100%;
  background-image: url("../../assets/img/project/xingyuan_bg.png");
  background-size: 100% 100%;
  .wish_close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .wish_content {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    position: relative;
    .wish_img {
      position: absolute;
      left: 31px;
      top: 33px;
      display: flex;
      justify-content: center;
    }
    .wish_title {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      color: #fcef69;
    }
    .wish_border {
      height: auto;
      width: 90%;
      margin: 20px auto;
      margin-top: 10px;
      border: 1px solid #f3f3f3;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      padding: 0px 0px 0px 20px;
      max-width: 220px;
      .tags_t {
        background-color: #f72a48;
        color: #fff;
        border-radius: 3px;
        border: 1px solid #eeeeee;
        margin-right: 10px;
        margin-bottom: 10px;
        min-width: 55px;
        height: 25px;
        text-align: center;
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .replay {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;
      padding-top: 15px;
      span {
        margin-top: 10px;
        width: 73px;
        height: 18px;
        border: 1px solid #eee;
        border-radius: 25px;
        background-color: #f4657a;
        p {
          height: 9px;
          font-size: 9px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #eeeeee;
          line-height:16px;
          opacity: 0.8;
          text-align: center;
        }
      }
    }
    .footer {
      display: flex;
      padding-left: 10px;
      padding-top: -20px;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      .complete_text {
        position: absolute;
        top: 5px;
        height: 13px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #fcef69;
      }
    }
  }
}
.wish_middle {
  display: flex;
  padding-bottom: 40px;
}
.van-button {
  height: 30px;
}
.van-field__control {
  color: #333;
}
.aa {
  transition: all 1s;
}
.go {
  transform: rotate(720deg);
  transition: all 1s;
}
/deep/.van-radio__icon--checked .van-icon {
  color: #fff;
  background-color: #1989fa;
  border-color: #1989fa;
}
// /deep/.van-radio__label {
//   color: #fff;
//   font-size: 9px;
// }
.assess_form_radio {
  margin-top: -5px;
  margin-bottom: 2px;
}
</style>
