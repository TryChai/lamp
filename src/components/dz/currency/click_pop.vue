<template>
  <div class="sku_con">
    <div class="fx shops_info">
      <div class="footer_wrapper">
        <div class="avatar">
            <div class="user_img">
              <img
              v-if="radio_value == '0'"
                :src="
                  $fnc.getImgUrl($store.state.user.avatar, 'sex') ||
                  ($store.state.user.sex == 2
                    ? require('./../../../assets/img/member/sex2.png')
                    : require('./../../../assets/img/member/sex1.png'))
                "
                alt=""
              />
              <img v-else :src="$store.state.user.sex == 2
                    ? require('./../../../assets/img/member/sex2.png')
                    : require('./../../../assets/img/member/sex1.png')" />
            </div>
        </div>
        
        <div class="dingwei">
          <div class="inputprice">
            <van-field
            v-if="radio_value == '1'"
            disabled
            class="nick"
            right-icon="edit"
            style="
              margin-left: 10px;
              background: #ff4b44;
              font-size: 17px;
              font-family: PingFang SC, PingFang SC-Bold;
              font-weight: 700;
            "
            clearable
            v-model="nickname1"
            input-align="center"
            center
          >
          </van-field>
          <van-field
            v-else
            @blur="get_new_nickname"
            right-icon="edit"
            class="nick"
            style="
              margin-left: 10px;
              background: #ff4b44;
              font-size: 17px;
              font-family: PingFang SC, PingFang SC-Bold;
              font-weight: 700;
            "
            clearable
            v-model="nickname"
            placeholder="请输入昵称"
            input-align="center"
            center
          >
          </van-field>
          </div>
          
          <p class="price">
            <span>S$</span>
            {{
              $fnc.toFixedZ(randomNumber) == "NaN"
                ? 0
                : $fnc.toFixedZ(randomNumber)
            }}
          </p>
          <div class="inputprice">
             <van-field
              @blur="windowScorll"
              id="myInput1"
              clearable
              v-model.number="randomNumber"
              placeholder="请输入金额"
              center
              type="number"
            >
              <template #extra>
                <p>S$</p>
              </template>
            </van-field>
          </div>
         
        </div>
        <div class="choose_set fx">
          <div>
            <van-radio-group
              v-model="radio_value"
              @change="radioChange"
              class="fx assess_form_radio"
            >
              <van-radio
                name="1"
                @click="radioClick"
                class="assess_form_radio_item"
                >匿名</van-radio
              >
            </van-radio-group>
          </div>
          <div class="protocl" @click="$router.push('/useragreement?id=15')">
            查看服务协议
          </div>
        </div>
        <div class="buttonlist">
          <van-button type="default" @click="get_random_amount"
            >换个金额</van-button
          >
          <van-button type="default" @click="recharge_submit"
            >下一步</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Swipe,
  SwipeItem,
  Image,
  ImagePreview,
  Field,
  RadioGroup,
  Radio,
} from "vant";
import Cookies from "js-cookie";
export default {
  name: "clickPop",
  data() {
    return {
      value: null,
      isVideoShow: true,
      playOrPause: true,
      video: null,
      iconPlayShow: true,
      randomNumber: 0,
      current: 0,
      radio_value: this.radio_value1,
      radio_change: false,
      nickname:
        this.$store.state.user.nickname || '小施主' || this.$store.state.user.username,
      nickname1: "匿名",
      donationList: [],
      show_gdz: false,
    };
  },
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Image.name]: Image,
    Field,
    RadioGroup,
    Radio,
  },
  components: {},
  created() {
    this.get_random_amount();
  },
  props:{
    radio_value1:{
      type:[String,Number]
    }
  },
  watch:{
    radio_value1(val){
      this.radio_value=val;
    },
    randomNumber(val){
      this.$emit('random',val);
    }
  },
  mounted() {
  },
  methods: {
    get_new_nickname() {
      this.windowScorll();
      this.$api.getDz
        .change_nickname({ nickname: this.nickname })
        .then((res) => {
          if (res.code == 200) {
            this.$toast.success("修改昵称成功", 1000);
          }
        });
    },
    get_random_amount() {
      var params = {};
      this.$api.getDz.get_random_amount(params).then((res) => {
        if (res.code == 200) {
          this.randomNumber = this.$fnc.toFixedZ(res.result);
          this.$emit('random',this.randomNumber);
        }
      });
    },
    recharge_submit() {
      var user = Cookies.get("user") ? true : false; // 得到登陆状态 false是已登录;
      if(user){
        this.$emit('showgdz');
      }else{
        this.$router.replace({ path: "/login?redirect="+this.$route.path+'?id='+this.$route.query.id });
      }
    },
    radioClick() {
      if (!this.radio_change) {
        this.radio_value = "0";
      }
      this.radio_change = false;
      this.$emit('r_value',this.radio_value);
    },
    radioChange() {
      this.radio_change = true;
    },
  },
};
</script>
<style lang="less" scoped>
.avatar{
  display: flex;
  align-items: center;
  justify-content: center;
}
.sku_con {
  line-height: 1;
  position: relative;
  .shops_info {
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    width: 100%;
    left: 0;
    top: 46px;
    .footer_wrapper {
      width: 100%;
      position: relative;
      margin-left: 5px;
      .user_img {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 155px;
        height: 155px;
        opacity: 1;
        margin-top: 15px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0);
        box-sizing: border-box; 
        padding: 10px; 
        border-radius: 50%; 
        background-image: -webkit-linear-gradient(top, #FEE4B1 0%, #FFE39D 30%, #FBBE57 60%, #FFF0CD 90%);  
        background-image: -moz-linear-gradient(top, #FEE4B1 0%, #FFE39D 30%, #FBBE57 60%, #FFF0CD 90%); 
        background-image: linear-gradient(top, #FEE4B1 0%, #FFE39D 30%, #FBBE57 60%, #FFF0CD 90%);  
        > img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
          object-fit: fill;
           background:#fff; 
        }
      }
      .dingwei {
        display: flex;
        flex-direction: column;
        .name {
          font-size: 17px;
          font-family: PingFang SC, PingFang SC-Bold;
          font-weight: 700;
          color: #ffffff;
          line-height: 18px;
        }
        .price {
          margin-top: 10px;
          font-size: 39px;
          font-family: PingFang SC, PingFang SC-Bold;
          font-weight: 700;
          color: #fced69;
          line-height: 40px;
          text-align: center;
          > span {
            font-size: 22px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
            color: #fced69;
            line-height: 22px;
          }
        }
      }
      .choose_set {
        display: flex;
        align-items: center;
        padding: 0 50px;
        width: 100%;
      }
      /deep/.van-cell {
        margin-top: 15px;
        width: 241px;
        height: 39px;
        opacity: 0.7;
        background: #bc0200;
        border-radius: 20px;
        > p {
          font-size: 17px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #ffffff;
        }
      }
      .input_con {
        margin-top: 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 241px;
        height: 39px;
        opacity: 0.7;
        background: #bc0200;
        border-radius: 20px;
        padding: 0 22px;
        > input {
          flex: 1;
          background-color: transparent;
          border: 0;
        }
      }
      .buttonlist {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        .van-button:first-of-type {
          margin-right: 17px;
          width: 141px;
          height: 44px;
          opacity: 1;
          border: 2px solid #ead622;
          border-radius: 24px;
          background-color: transparent;
          .van-button__content {
            .van-button__text {
              font-size: 17px;
              font-family: PingFang SC, PingFang SC-Bold;
              font-weight: 700;
              color: #fced69;
              line-height: 18px;
            }
          }
        }
        .van-button:last-of-type {
          width: 178px;
          height: 44px;
          opacity: 1;
          background: #fced69;
          border-radius: 22px;
          .van-button__content {
            .van-button__text {
              font-size: 17px;
              font-family: PingFang SC, PingFang SC-Bold;
              font-weight: 700;
              color: #f64245;
              line-height: 18px;
            }
          }
        }
      }
    }
  }
}
.bg_temple {
  position: absolute;
  width: 100%;
  height: 100%;
  // z-index: 10;
}
/deep/.inputprice .van-field__control {
  color: #fff;
}
.assess_form_radio {
  font-size: 14px;
  padding: 10px 16px 10px 16px;
  flex: 2;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.assess_form_radio_item {
  min-width: 45%;
}
.protocl {
  font-size: 14px;
  color: #fff;
}
/deep/.van-cell::after {
  border: none;
}
/deep/.nick .van-field__control {
  font-size: 17px;
}
/deep/.inputprice .van-field__control:disabled {
  -webkit-text-fill-color: #fff;
}
/deep/.van-icon-edit {
  color: #fff;
}
.inputprice{
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}
/deep/.van-radio__label{
  color: #fff;
}
</style>