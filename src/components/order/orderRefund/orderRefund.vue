<template>
  <div class="order_refund">
    <template v-if="info.status == 0 && !$store.state.isSupplier">
      <van-nav-bar
        title="申请退款"
        left-text
        left-arrow
        class="navbar"
        :border="false"
        @click-left="toBack"
      />

      <div class="order_refund_product">
        <p>退款商品</p>
        <div class="fx">
          <img :src="$fnc.getImgUrl(info.piclink)" />
          <span>
            <p>
              {{ info.title }}
            </p>
            <p v-if="info.sku_cn">{{ info.sku_cn }}</p>
          </span>
        </div>
      </div>

      <div class="order_refund_info">
        <p>退款信息</p>
        <van-cell
          title="退款原因"
          :value="radio ? radio : '请选择'"
          required
          :border="false"
          @click="show = true"
        >
          <template #right-icon>
            <van-icon name="arrow" size="14" />
          </template>
        </van-cell>
        <van-cell title="退款金额" required :border="false">
          <span slot="default" class="price_regular">
            <b>￥{{ $fnc.toFixedZ(info.money) }}</b>
          </span>
        </van-cell>
      </div>

      <div class="order_refund_img">
        <p>补充描述和凭证</p>
        <div>
          <van-field
            v-model="return_instructions"
            rows="2"
            autosize
            type="textarea"
            placeholder="补充描述，有助于商家更好的处理售后问题"
            maxlength="200"
            show-word-limit
            :border="false"
          />
          <div v-for="(item, i) in pic" :key="i" class="box_img_img">
            <img width="84" height="84" :src="item" />
            <span @click="closeImg(i)" v-if="info.status == 0">
              <van-icon name="cross" size="18" color="#fff" />
            </span>
          </div>
          <van-uploader
            multiple
            :max-count="3"
            :after-read="afterRead"
            v-if="pic.length < 3 && info.status == 0"
          >
            <div class="up_inp_refund">
              <i class="fa fa-camera" />
              <p>上传凭证</p>
              <p>最多3张</p>
            </div>
          </van-uploader>
        </div>
      </div>

      <van-button
        color="linear-gradient(to right, #FF8A00, #FE5301)"
        block
        @click="subRefund"
        class="order_refund_foot"
      >
        确认提交
      </van-button>
    </template>

    <template v-if="info.status > 0 && !$store.state.isSupplier">
      <van-nav-bar
        title="退款详情"
        left-text
        left-arrow
        class="navbar"
        :border="false"
        @click-left="toBack"
      />

      <div class="order_refund_top">
        <div class="fx">
          <i class="fa fa-check"></i>
          <span>
            <p>
              {{
                info.status == 1
                  ? "退货申请中"
                  : info.status == 2
                  ? "请提交物流信息"
                  : info.status == 3
                  ? "审核退款中"
                  : info.status == 4
                  ? "退货完成"
                  : ""
              }}
            </p>
            <p>
              {{ $fnc.getTimeFormat(info.return_time) }}
            </p>
          </span>
        </div>
      </div>

      <div class="fx order_refund_money">
        <span class="fx">
          <van-icon name="after-sale" color="#cf133b" size="20" />
          <span>退款总金额</span>
        </span>
        <span v-if="info.status == 4">
          ￥{{ $fnc.toFixedZ(info.order_ar.return_order) }}
        </span>
        <span v-else>￥{{ $fnc.toFixedZ(info.money) }}</span>
      </div>

      <div class="order_refund_xinxi">
        <p>退款信息</p>
        <div class="fx">
          <img :src="$fnc.getImgUrl(info.piclink)" />
          <span>
            <p>
              {{ info.title }}
            </p>
            <p v-if="info.sku_cn">{{ info.sku_cn }}</p>
          </span>
        </div>
        <p v-if="info.status == 4">
          <span>退款金额</span>
          <span>￥{{ $fnc.toFixedZ(info.order_ar.return_order) }}</span>
        </p>
        <p v-else>
          <span>退款金额</span>
          <span>￥{{ $fnc.toFixedZ(info.money) }}</span>
        </p>
        <p>
          <span>退款原因</span>
          <span>{{ info.return_reason || "---" }}</span>
        </p>
        <p>
          <span>退款说明</span>
          <span>{{ info.return_instructions || "---" }}</span>
        </p>
        <p>
          <span>申请时间</span>
          <span>{{ $fnc.getTimeFormat(info.return_time) }}</span>
        </p>
        <p>
          <span>退款编号</span>
          <span>{{ info.oid }}</span>
        </p>
        <div
          v-if="info.sid == 0 && $store.state.config.plugin.btkfxt.is_open == 1"
        >
          <p class="fx" @click="$router.push('/im/kf')">
            <van-icon name="chat-o" color="#77B4D9" size="16" />
            <span>联系客服</span>
          </p>
        </div>
        <div
          class="fx"
          v-else-if="
            info.sid > 0 &&
            ((info.im && $store.state.config.plugin.btkfxt.is_open == 1) ||
              info.tel)
          "
        >
          <p
            class="fx"
            @click="$router.push('/im/mes?id=' + info.im)"
            v-if="info.im && $store.state.config.plugin.btkfxt.is_open == 1"
          >
            <van-icon name="chat-o" color="#77B4D9" size="16" />
            <span>联系卖家</span>
          </p>
          <p class="fx" @click="$fnc.tel(info.tel)" v-if="info.tel">
            <van-icon name="phone-o" color="#77B4D9" size="16" />
            <span>拨打电话</span>
          </p>
        </div>
      </div>

      <div
        class="order_refund_tuijian"
        v-if="
          (info.status == 3 || info.status == 4) &&
          info.return_mail &&
          info.return_oid
        "
      >
        <p>
          <span style="width: 86px">物流公司</span>
          <span>{{ info.return_mail || "---" }}</span>
        </p>
        <p>
          <span style="width: 86px">物流单号</span>
          <span>{{ info.return_oid || "---" }}</span>
        </p>
      </div>

      <div
        class="order_refund_tuijian"
        v-if="(pic && pic.length > 0) || info.status == 2"
      >
        <p v-if="info.status == 2">
          <span>退货收件人姓名</span>
          <span>{{ info.return_name || "---" }}</span>
        </p>
        <p v-if="info.status == 2">
          <span>退货收件人电话</span>
          <span>{{ info.return_tel || "---" }}</span>
        </p>
        <p v-if="info.status == 2">
          <span>退货收件人地址</span>
          <span>{{ info.return_address || "---" }}</span>
        </p>
        <div v-if="pic && pic.length > 0">
          <p>上传凭证</p>
          <div v-for="(item, i) in pic" :key="i" class="box_img_img">
            <img width="106" height="106" :src="item" />
            <span @click="closeImg(i)" v-if="info.status == 0">
              <van-icon name="cross" size="18" color="#fff" />
            </span>
          </div>
        </div>
      </div>

      <van-button
        color="linear-gradient(to right, #FF8A00, #FE5301)"
        block
        @click="showPass = true"
        class="order_refund_foot"
        v-if="info.status == 2"
      >
        提交物流信息
      </van-button>
    </template>

    <template v-if="$store.state.isSupplier">
      <van-nav-bar
        title="退款详情"
        left-text
        left-arrow
        class="navbar"
        :border="false"
        @click-left="toBack"
      />

      <div class="fx order_refund_money">
        <span class="fx">
          <van-icon name="after-sale" color="#cf133b" size="20" />
          <span>退款总金额</span>
        </span>
        <span>￥{{ $fnc.toFixedZ(info.money) }}</span>
      </div>

      <div class="order_refund_xinxi">
        <p>退款信息</p>
        <div class="fx">
          <img :src="$fnc.getImgUrl(info.piclink)" />
          <span>
            <p>
              {{ info.title }}
            </p>
            <p v-if="info.sku_cn">{{ info.sku_cn }}</p>
          </span>
        </div>
        <p v-if="info.status == 4">
          <span>退款金额</span>
          <span>￥{{ $fnc.toFixedZ(info.order_ar.return_order) }}</span>
        </p>
        <p v-else>
          <span>退款金额</span>
          <span>￥{{ $fnc.toFixedZ(info.money) }}</span>
        </p>
        <p>
          <span>退款原因</span>
          <span>{{ info.return_reason || "---" }}</span>
        </p>
        <p>
          <span>退款说明</span>
          <span>{{ info.return_instructions || "---" }}</span>
        </p>
        <p>
          <span>申请时间</span>
          <span>{{ $fnc.getTimeFormat(info.return_time) }}</span>
        </p>
        <p>
          <span>退款编号</span>
          <span>{{ info.oid }}</span>
        </p>
      </div>

      <div class="order_refund_tuihuo">
        <van-field
          label="收件人姓名"
          placeholder="请输入收件人姓名"
          v-model="info.return_name"
          @blur="windowScorll"
          :border="false"
          required
          :disabled="info.status != 1 && info.status != 2"
        />
        <van-field
          label="收件人电话"
          placeholder="请输入收件人电话"
          v-model="info.return_tel"
          @blur="windowScorll"
          :border="false"
          required
          :disabled="info.status != 1 && info.status != 2"
        />
        <van-field
          label="收件人地址"
          placeholder="请输入收件人地址"
          v-model="info.return_address"
          @blur="windowScorll"
          :border="false"
          required
          :disabled="info.status != 1 && info.status != 2"
        />
        <van-field
          label="退货备注"
          placeholder="请输入备注"
          v-model="info.admin_remark"
          @blur="windowScorll"
          :border="false"
          :disabled="info.status != 1 && info.status != 2"
        />
        <van-radio-group v-model="status">
          <p>申请状态</p>
          <van-radio name="0" checked-color="#07c160">驳回退货</van-radio>
          <van-radio
            name="1"
            checked-color="#07c160"
            :disabled="
              info.status == 1 ||
              info.status == 2 ||
              info.status == 4 ||
              info.status == 3
            "
            >申请退货</van-radio
          >
          <van-radio
            name="2"
            checked-color="#07c160"
            :disabled="info.status == 2 || info.status == 4 || info.status == 3"
          >
            允许退货
          </van-radio>
          <van-radio
            name="3"
            checked-color="#07c160"
            :disabled="
              info.status == 1 ||
              info.status == 2 ||
              info.status == 4 ||
              info.status == 3
            "
          >
            已退货待退款
          </van-radio>
          <van-radio
            name="4"
            checked-color="#07c160"
            :disabled="info.status == 1 || info.status == 2 || info.status == 4"
          >
            退货成功
          </van-radio>
        </van-radio-group>
      </div>

      <van-button
        color="linear-gradient(to right, #FF8A00, #FE5301)"
        block
        class="order_refund_foot"
        @click="subConfimRefund"
        v-if="info.status != 4"
      >
        确认
      </van-button>
    </template>

    <van-popup v-model="showPass" class="pop_pass tc">
      <div>
        <p class="p_title">物流信息</p>
        <van-cell-group>
          <van-field
            @blur="windowScorll"
            v-model="info.return_mail"
            label="物流公司"
            placeholder="请填写物流公司"
            required
          />
          <van-field
            @blur="windowScorll"
            v-model="info.return_oid"
            label="物流单号"
            placeholder="请填写物流单号"
            required
          />
        </van-cell-group>
        <van-button type="info" size="small" @click="setOrderMail">
          确认
        </van-button>
      </div>
    </van-popup>

    <van-popup v-model="show" position="bottom" class="refund_pop">
      <div class="refund_pop_head">
        <p>退款原因</p>
        <van-radio-group v-model="radio" class="refund_pop_head_group">
          <van-cell-group>
            <van-cell
              :title="item"
              clickable
              @click="cleckLy(item)"
              v-for="item in reason"
              :key="item"
            >
              <van-radio :name="item" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <van-button type="danger" @click="show = false" size="large">
          关闭
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Card, Field, RadioGroup, Radio } from "vant";
import { setTimeout } from "timers";
import axios from "axios";
import exif from "@/assets/js/exif.js";
export default {
  components: {
    [Card.name]: Card,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
  },
  data() {
    return {
      return_instructions: "",
      show: false,
      radio: "请选择",
      info: {
        return_mail: "",
        return_oid: "",
      },
      reason: [],
      pic: [],
      status: "",
      showPass: false,
    };
  },
  watch: {},
  created() {
    if (this.$store.state.isSupplier) {
      this.getSupplierApplication();
    } else {
      this.getRefundShops();
    }
  },
  methods: {
    closeImg(i) {
      this.pic.splice(i, 1);
    },
    subConfimRefund() {
      var params = {};
      params.id = this.$route.query.id || "";
      params.return_name = this.info.return_name;
      params.return_tel = this.info.return_tel;
      params.return_address = this.info.return_address;
      params.admin_remark = this.info.admin_remark;
      params.status = this.status;
      this.$api.getSupplier.addSupplierApplication(params).then((res) => {
        if (res.code == 200) {
          this.$toast.success("提交成功");
          setTimeout(() => {
            this.getSupplierApplication();
          }, 1500);
        }
      });
    },
    getSupplierApplication() {
      var params = {};
      params.id = this.$route.query.id || "";
      this.$api.getSupplier.getSupplierApplication(params).then((res) => {
        if (res.code == 200) {
          this.info = res.result;
          this.status = this.info.status;
          if (this.$route.query.types == 9) {
            this.reason = res.result.tour_reason || [];
          } else {
            this.reason = res.result.reason || [];
          }
          this.pic = [];
          if (res.result.pic.length > 0 && res.result.status > 0) {
            for (var i in res.result.pic)
              this.pic.push(res.result.pic[i].piclink);
          }
        }
      });
    },
    setOrderMail() {
      if (this.return_mail == "" || this.return_oid == "") {
        this.$toast.fail("物流信息不能为空");
        return;
      } else {
        var params = {};
        params.id = this.$route.query.id || "";
        params.return_mail = this.info.return_mail;
        params.return_oid = this.info.return_oid;
        this.$api.getOrder.setOrderMail(params).then((res) => {
          if (res.code == 200) {
            this.$toast.success(res.result);
            setTimeout(() => {
              this.showPass = false;
              this.getRefundShops();
            }, 1500);
          }
        });
      }
    },
    subRefund() {
      if (this.radio == "请选择") {
        this.$toast.fail("请选择退货理由");
        return false;
      } else {
        var params = {};
        params.id = this.$route.query.id || "";
        params.return_reason = this.radio;
        params.return_instructions = this.return_instructions;
        params.pic = this.pic.join("@");
        this.$api.getOrder.setOrderRefund(params).then((res) => {
          if (res.code == 200) {
            this.$toast.success(res.result);
            setTimeout(() => {
              this.getRefundShops();
            }, 1500);
          }
        });
      }
    },
    cleckLy(ra) {
      this.radio = ra;
      this.show = false;
    },
    getRefundShops() {
      var params = {};
      params.id = this.$route.query.id || "";
      this.$api.getOrder.getOrderRefund(params).then((res) => {
        if (res.code == 200) {
          this.info = res.result;
          if (this.$route.query.types == 9) {
            this.reason = res.result.tour_reason || [];
          } else {
            this.reason = res.result.reason || [];
          }
          this.pic = [];
          if (res.result.pic.length > 0 && res.result.status > 0) {
            for (var i in res.result.pic)
              this.pic.push(res.result.pic[i].piclink);
          }
        }
      });
    },
    afterRead(file) {
      var that = this;
      exif.imageListConvert([file.file], function (res) {
        that.pic.push(res);
      });
    },
  },
};
</script>



<style lang="less" scoped>
.order_refund {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f4f4f4;
  font-size: 14px;
  position: relative;
  padding-bottom: 50px;

  .order_refund_product {
    width: 96%;
    margin: 10px auto;
    padding: 10px;
    background: #ffffff;
    border-radius: 10px;

    > p {
      width: 100%;
      font-size: 17px;
      font-weight: bold;
    }

    > div {
      width: 100%;
      padding-top: 5px;
      > img {
        width: 80px;
        height: 80px;
        border-radius: 5px;
        margin-right: 10px;
      }
      > span {
        flex: 1;
        min-height: 80px;
        > p {
          line-height: 1.4;
          &:nth-of-type(2) {
            color: #999999;
            padding-top: 5px;
          }
        }
      }
    }
  }

  .order_refund_info {
    width: 96%;
    margin: 10px auto;
    background: #ffffff;
    border-radius: 10px;
    padding: 10px 0;
    > p {
      width: 100%;
      font-size: 17px;
      font-weight: bold;
      padding: 0 10px;
    }

    .van-cell {
      padding: 10px 10px 10px 16px;
    }

    .price_regular {
      font-size: 15px;
    }
  }

  .order_refund_img {
    width: 96%;
    margin: 10px auto;
    background: #ffffff;
    border-radius: 10px;
    padding: 10px 10px;
    > p {
      width: 100%;
      font-size: 17px;
      font-weight: bold;
    }

    > div {
      width: 100%;
      padding-top: 5px;
      background: #fbfbfb;

      .van-field {
        padding: 10px;
        border-radius: 6px;
        background: #fbfbfb;
      }

      .box_img_img {
        display: inline-block;
        vertical-align: bottom;
        margin-left: 8px;
        position: relative;
        > span {
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #ff2f57;
        }
      }

      .up_inp_refund {
        margin-left: 8px;
        width: 84px;
        height: 84px;
        border: 1px dashed #8b8b8b;
        color: #929292;
        text-align: center;
        > i {
          display: block;
          text-align: center;
          margin: 15px 0 6px;
          font-size: 22px;
        }
        > p {
          line-height: 1.4;
          font-size: 12px;
        }
      }
    }
  }

  .order_refund_foot {
    width: 100%;
    position: fixed;
    bottom: 0;
    font-size: 16px;
    letter-spacing: 1px;
  }

  //退款中
  .order_refund_top {
    width: 100%;
    padding: 10px 10px;
    background: #f5005d;
    margin-bottom: 10px;

    > div {
      width: 100%;
      padding: 14px 10px;
      background: #ffffff;
      border-radius: 10px;
      align-items: flex-start;

      > i {
        background: #fdf5e9;
        width: 22px;
        height: 22px;
        border-radius: 100%;
        justify-content: center;
        color: #f5005d;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      > span {
        flex: 1;
        margin-left: 10px;
        line-height: 1.6;

        > p:nth-of-type(1) {
          font-size: 16px;
          font-weight: bold;
        }

        > p:nth-of-type(2) {
          color: #999999;
        }
      }
    }
  }

  .order_refund_money {
    width: 100%;
    background: #ffffff;
    padding: 10px 14px;
    margin: 10px auto;
    color: #cf133b;
    font-size: 15px;
    .van-icon {
      margin-right: 3px;
    }
  }

  .order_refund_xinxi {
    width: 100%;
    background: #ffffff;
    padding: 10px 16px;
    margin: 10px auto;
    > p:nth-of-type(1) {
      width: 100%;
      font-size: 17px;
      font-weight: bold;
      padding: 0;
    }

    > div:nth-of-type(1) {
      width: 100%;
      padding: 10px 0;
      > img {
        width: 80px;
        height: 80px;
        border-radius: 5px;
        margin-right: 10px;
      }
      > span {
        flex: 1;
        min-height: 80px;
        > p {
          line-height: 1.4;
          &:nth-of-type(2) {
            color: #999999;
            padding-top: 5px;
          }
        }
      }
    }

    > p {
      width: 100%;
      padding-bottom: 5px;
      > span:nth-of-type(1) {
        width: 86px;
        color: #999999;
        display: inline-block;
      }
    }

    > div:nth-of-type(2) {
      width: 100%;
      padding-top: 16px;
      > p {
        min-width: 50%;
        justify-content: center;
        line-height: 1;
        color: #656565;
        .van-icon {
          margin-right: 3px;
        }
      }
    }
  }

  .order_refund_tuijian {
    width: 100%;
    background: #ffffff;
    padding: 10px 16px;
    margin: 10px auto;

    > p {
      width: 100%;
      padding-bottom: 5px;
      > span:nth-of-type(1) {
        width: 110px;
        color: #999999;
        display: inline-block;
      }
    }

    > div {
      width: 100%;
      > p {
        width: 100%;
        font-size: 15px;
      }
      .box_img_img {
        display: inline-block;
        vertical-align: bottom;
        margin: 5px 8px 5px 0;
        position: relative;
        > span {
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #ff2f57;
        }
      }
    }
  }

  .order_refund_tuihuo {
    width: 100%;
    background: #ffffff;
    margin: 10px auto;
    padding: 0 0 10px;

    .van-field {
      padding: 10px 16px 0;
    }

    .van-radio-group {
      flex-wrap: wrap;
      > p {
        width: 100%;
        padding: 10px 16px 0;
        color: #646566;
      }
      > div {
        width: 100%;
        padding: 6px 0 6px 110px;
      }
    }
  }
}

.refund_pop {
  width: 100%;
  border-radius: 0;
  > .refund_pop_head {
    width: 100%;
    > p {
      height: 65px;
      line-height: 65px;
      color: #363e40;
      font-size: 16px;
      text-align: center;
    }
    .refund_pop_head_group {
      margin-top: 12px;
      .van-radio {
        justify-content: flex-end;
      }
      .van-cell__title {
        color: #222;
        font-weight: bold;
        flex: auto;
      }
    }
  }
}

.pop_pass {
  width: 95%;
  padding: 10px 16px 10px;
  .p_title {
    padding: 10px 0;
    font-size: 15px;
    font-weight: bold;
  }
  .van-cell {
    align-items: center;
  }
  button {
    margin: 20px 0 10px;
    width: 60px;
  }
}
</style>
