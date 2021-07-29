<template>
  <!-- 绑定手机号 -->
  <div class="binding_phone">
    <van-popup v-model="show" get-container="body" style="width: 90%;background: none;" :style="{height: receive.tel == '' ? '670px' : ''}">
      <div class="binding" v-if="receive.tel == ''">
        <div class="binding_title">
          <div class="pop_top_contet">
            <p class="colse" v-if="ewm_img" @click="closeBinding">
              <van-icon name="close" color="#fff" />
            </p>
            <p v-if="receive.win_say">{{receive.win_say}}</p>
            <p class="title1">请<span>绑定手机号码</span></p>
            <p class="title2">方便我们与你联系并<span>领取奖品</span></p>
          </div>
          <img src="../../assets/img/home/bindteltop.png" alt="">
        </div>
        <div class="binding_form">
          <van-form>
            <van-field v-model="phone" placeholder="请输入您的手机号" />
            <van-field v-model="code" center clearable placeholder="请输入验证码">
              <template #button>
                <van-button size="small" type="primary" @click="getCODE">
                  <span class="code" v-show="!ishow">{{text}}</span> <span v-show="ishow">{{num}}</span><span v-show="ishow">S</span>
                </van-button>
              </template>
            </van-field>
            <div class="binding_btn" @click="bindPhone">
              <van-button round block type="danger" native-type="submit">
                立即绑定
              </van-button>
            </div>
          </van-form>
        </div>
        <div class="scan_code" v-if="ewm_img">
          <div class="show_code">
            <img :src="$fnc.getImgUrl(ewm_img)" alt="">
            <van-divider :style="{ color: 'rgb(250,81,60)', borderColor: 'rgb(250,81,60)', margin: '0' }">请扫码关注公众号</van-divider>
            <p class="title2">接收奖品信息</p>
          </div>
        </div>
      </div>
      <div class="binding2" v-else-if="receive.tel != '' && receive.wxewm != ''">
        <div class="scan_title">
          <van-divider :style="{ color: 'rgb(250,81,60)', borderColor: 'rgb(250,81,60)', margin: '0' }">请扫码关注公众号</van-divider>
          <p class="title2">接收奖品信息</p>
        </div>
        <div class="scan_code">
          <img src="../../assets/img/star/ewm.png" alt="">
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {
    Form,
    Field,
    Divider
  } from "vant";
  export default {
    data() {
      return {
        phone: "",
        code: "",
        // binding_show: true,
        text: "获取验证码",
        num: 60,
        ishow: false,
        wyz: "",
        receive: {
          tel:''
        },
        ewm_img: ""
      }
    },
    props: {
      // receive: {
      //   type: Object,
      //   default: {}
      // },
      show: {
        type: Boolean,
        default: false
      }
    },
    components: {
      [Form.name]: Form,
      [Field.name]: Field,
      [Divider.name]: Divider
    },
    methods: {
      getCODE() {
        if (this.phone == "") {
          this.$toast.fail("手机号码不能为空");
          return false;
        }
        this.sendcode();
      },
      sendcode() {
        // this.show = false;
        var value = this.phone;
        if (value == "") {
          this.$toast.fail("手机号码不能为空");
          return;
        }
        this.$api.getUser.is_have_user({
          username: value
        }).then(res => {
          if (res.status == 1) {
            this.sendduan();
          } else {
            this.$toast.fail(res.result);
            return;
          }
        });
      },
      sendduan() {
        var _this = this;
        this.$api.getUser.sendCode({
          tel: this.phone,
          quhao: "+86"
        }).then(res => {
          if (res.status === 1) {
            this.$toast.success("发送成功");
            this.wyz = res.result;
            var temar = setInterval(function() {
              // console.log("111111111111:",_this.num)
              if (_this.num <= 0) {
                clearInterval(temar);
                _this.text = "获取验证码";
                _this.num = 60;
              } else {
                _this.num--;
                _this.text = +_this.num + "秒";
              }
            }, 1000);
          }
        });
      },
      bindPhone() {
        if (this.code == '') {
          this.$toast.fail('请输入验证码')
          return false
        }
        var params = {};
        params.tel = this.phone;
        params.code = this.code;
        params.unicode = this.wyz;

        var apiStr = "bindPhone";

        this.$api.getUser[apiStr](params).then(res => {
          if (res.code == 200) {
            this.$toast.success("绑定成功");

            setTimeout(() => {
              //获取微信二维码
              this.$api.getConfig.get_iden({
                iden: 'wxewm'
              }).then(res => {
                if (res.code == 200) {
                  this.ewm_img = res.result;
                }
              })
            }, 1000)
            // if (res.result == true) {
            //   this.$store.dispatch("getUser");
            // } else {
            //   this.$store.commit("setUser", res.result);
            //   this.$store.dispatch("getUser");
            // }
          } else {
            this.$toast.fail(res.result)
            // this.show = true;
            // this.showCode = false;
            this.phone = "";
            this.code = "";
          }
        });
      },
      closeBinding() {
        //关闭绑定手机弹层
        this.$emit("closeBin", false)
      }
    },
    created() {
      console.log("3333333333333:", this.receive)
    }
  }
</script>

<style lang="less" scoped>
  .binding {
    width: 100%;
    position: relative;

    .colse {
      text-align: right;
      line-height: 20px;
      width: 100%;
      margin-top: -25px;
      margin-right: 25px;
      
      .van-icon{
        font-size: 25px;
      }
    }

    .binding_title {
      position: relative;
      text-align: center;
      font-size: 30px;
      color: #fff;
      // line-height: 40px;
      
      img {
        width: 100%;
        height: 150px;
      }
      
      .pop_top_contet {
        width: 100%;
        height: 100%;
        position: absolute;
        font-size: 18px;
        font-weight: bold;
        color: #ffffff;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        > p span {
          font-size: 20px;
          color: #fff844;
        }
      }

      .title1,
      .title2 {
        span {
          color: rgb(254, 250, 67);
        }
      }

      .title2 {
        font-size: 24px;
      }
    }

    .binding_form {
      background: #fff;
      padding-top: 10px;
      height: 270px;

      .van-cell {
        // margin-bottom: 20px;
        border-radius: 5px;
        height: 50px;
        border: 1px solid #D6D6D6;
        margin: 20px;
        width: inherit;

        .van-button--primary {
          background-color: #fff;
          border: 0.02667rem solid #fff;
          color: #c8c9cc;
          font-size: 16px;
        }

        .van-button--small {
          border-left: 1px solid #d6d6d6;
          padding: 0;
          padding-left: 0.21333rem;
        }


      }

      .binding_btn {
        display: flex;
        justify-content: center;

        .van-button--block {
          width: 75%;
          height: 50px;
          font-size: 20px;
        }
      }
    }


    @keyframes scan1 {
      from {
        height: 0px;
        bottom: 200px;
      }

      to {
        height: 200px;
        bottom: 0px;
      }
    }

    @-webkit-keyframes scan1 {
      from {
        height: 0px;
        bottom: 200px;
      }

      to {
        height: 200px;
        bottom: 0px;
      }
    }

    .scan_code {
      text-align: center;
      animation: scan1 3s;
      overflow: hidden;
      width: 200px;
      height: 200px;
      background: #fff;
      /* 高度是变量 */
      position: absolute;
      left: 50%;
      top: 395px;
      /* top是变量 */
      transform: translate(-50%);
      box-shadow: 0 0 8px 3px #000;

      .show_code {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%);

        img {
          width: 150px;
          height: 150px;
        }

        p {
          font-size: 14px;
          color: rgb(250, 81, 60);
        }
      }
    }
  }

  .van-divider--content-center::before {
    margin-right: 10px;
  }

  .van-divider--content-center::after {
    margin-left: 10px;
  }

  .binding2 {
    width: 100%;

    .scan_title {
      text-align: center;
      font-size: 30px;
      color: #fff;
      margin-bottom: 25px;

      .van-divider {
        font-size: 28px;
        line-height: 28px;
      }

      .title2 {
        font-size: 24px;
      }
    }

    .scan_code {
      text-align: center;

      img {
        width: 200px;
        height: 200px;
      }
    }
  }
</style>
