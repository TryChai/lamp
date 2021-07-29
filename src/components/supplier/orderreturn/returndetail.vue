<template>
  <div class="order_refund">
    <van-nav-bar title="申请退款" left-text left-arrow class="navbar" :border="false" @click-left="toBack" />

    <van-card :num="info.number" lazy-load :price="$fnc.toFixedZ(info.price)" :desc="info.sku_cn" :title="info.title" :thumb="info.piclink"
        v-lazy="info.piclink" class="card_order_refund" />

    <div class="box_liy" v-if="info.status==0">
      <van-cell title="退款原因" is-link :value="radio" @click="show=true" />
    </div>

    <div class="box_liy">
      <p class="box_liy_p">退款金额：<span>￥{{$fnc.toFixedZ(info.money)}}</span>
        <p class="box_liy_p" v-if="info.status!=0">退款原因：<span>{{info.return_reason}}</span>
          <p class="box_liy_p" v-if="info.status!=0">退款说明：<span>{{info.return_instructions}}</span>
          </p>
          <p class=" box_liy_p2 fx" v-if="info.status==0">
            <span class="">退款说明：</span>
            <van-field @blur="windowScorll" class="input_liy" v-model="return_instructions" placeholder="选填" />
          </p>
    </div>
    <div class="box_liy" v-if="!$store.state.isSupplier">
      <p class="box_liy_p" v-if="info.status>1">退货收件人姓名：<span>{{info.return_name}}</span></p>
      <p class="box_liy_p" v-if="info.status>1">退货收件人电话：<span>{{info.return_tel}}</span></p>
      <p class="box_liy_p" v-if="info.status>1">退货收件人地址：<span>{{info.return_address}}</span></p>
    </div>
    <div v-if="!$store.state.isSupplier">
      <div v-if="info.status==2 || info.status==3" class="box_liy">
        <van-cell-group class="input_group_refund">
          <p class=" box_liy_p2 fx box_liy_pp2">
            <span class="">物流公司：</span>
            <van-field @blur="windowScorll" class="input_liy" :disabled="info.status!=2" v-model="info.return_mail" placeholder="请填写物流公司" />
          </p>

          <p class=" box_liy_p2 fx">
            <span class="">物流单号：</span>
            <van-field @blur="windowScorll" class="input_liy" type="number" :disabled="info.status!=2" v-model="info.return_oid"
                placeholder="请填写物流单号" />
          </p>

        </van-cell-group>
      </div>
    </div>
    <div v-else>
      <div class="box_liy">
        <van-cell-group class="input_group_refund">
          <div>
            <p class=" box_liy_p2 fx box_liy_pp2">
              <span class="">收件人姓名：</span>
              <van-field @blur="windowScorll" class="input_liy" :disabled="info.status!=1 && info.status!=2" v-model="info.return_name"
                  placeholder="请输入收件人姓名" />
            </p>

            <p class=" box_liy_p2 fx box_liy_pp2">
              <span class="">收件人电话：</span>
              <van-field @blur="windowScorll" class="input_liy" :disabled="info.status!=1&& info.status!=2" type="tel" v-model="info.return_tel"
                  placeholder="请输入收件人电话" />
            </p>
            <p class=" box_liy_p2 fx box_liy_pp2">
              <span class="">收件人地址：</span>
              <van-field @blur="windowScorll" class="input_liy" :disabled="info.status!=1&& info.status!=2" v-model="info.return_address"
                  placeholder="请输入收件人地址" />
            </p>
          </div>
          <p class=" box_liy_p2 fx">
            <span class="">备注：</span>
            <van-field @blur="windowScorll" class="input_liy" v-model="info.admin_remark" placeholder="请输入备注" />
          </p>
          <van-radio-group v-model="status" class="box_liy_p2 fx radio-group" v-if="info.status==1">
            <span class="">申请状态：</span>
            <van-radio name="0" checked-color="#07c160">驳回退货</van-radio>
            <van-radio name="1" checked-color="#07c160">申请退货</van-radio>
            <van-radio name="2" checked-color="#07c160">允许退货</van-radio>
            <van-radio name="3" disabled checked-color="#07c160">已退货待退款</van-radio>
            <van-radio name="4" disabled checked-color="#07c160">退货成功</van-radio>
          </van-radio-group>

          <van-radio-group v-model="status" class="box_liy_p2 fx radio-group" v-if="info.status==2||info.status==4">
            <span class="">申请状态：</span>
            <van-radio name="0" checked-color="#07c160">驳回退货</van-radio>
            <van-radio disabled name="1" checked-color="#07c160">申请退货</van-radio>
            <van-radio disabled name="2" checked-color="#07c160">允许退货</van-radio>
            <van-radio disabled name="3" checked-color="#07c160">已退货待退款</van-radio>
            <van-radio disabled name="4" checked-color="#07c160">退货成功</van-radio>
          </van-radio-group>

          <van-radio-group v-model="status" class="box_liy_p2 fx radio-group" v-if="info.status==3">
            <span class="">申请状态：</span>
            <van-radio name="0" checked-color="#07c160">驳回退货</van-radio>
            <van-radio name="1" disabled checked-color="#07c160">申请退货</van-radio>
            <van-radio name="2" disabled checked-color="#07c160">允许退货</van-radio>
            <van-radio name="3" disabled checked-color="#07c160">已退货待退款</van-radio>
            <van-radio name="4" checked-color="#07c160">退货成功</van-radio>
          </van-radio-group>

        </van-cell-group>
      </div>
    </div>

    <div class="box_img">
      <p>上传凭证</p>
      <div v-for="(item,i) in pic" :key="i" class="box_img_img">
        <img width="84" height="84" :src="item" />
        <span @click="closeImg(i)" v-if="info.status==0">
          <van-icon name="cross" size="18" color="#fff" />
        </span>
      </div>
      <van-uploader multiple :max-count="3" :after-read="afterRead" v-if="pic.length<3  && info.status==0">
        <div class="up_inp_refund ">
          <van-icon name="close" class="fa fa-camera" />
          <p>上传凭证</p>
          <p>最多3张</p>
        </div>
      </van-uploader>

    </div>
    <div class="refund_text">
      <!-- <p clas>
                <van-icon name="checked" color="#fe0036"  />
                <span>天猫先行垫付退款，退货成功有助于维护信誉评级和芝麻信用 <small>《急速退款协议》</small></span>
            </p> -->
      <p>
        <van-icon name="checked" color="#fe0036" />
        <span>授权商家填写运单号</span>
      </p>
    </div>
    <div v-if="!$store.state.isSupplier">
      <van-button class="refund_btn" type="danger" @click="subRefund" size="large" v-if="info.status==0">提交</van-button>

      <van-button class="refund_btn" type="danger" size="large" disabled v-else-if="info.status==1">退货申请中</van-button>

      <van-button class="refund_btn" type="danger" size="large" @click="setOrderMail" v-else-if="info.status==2">提交物流信息</van-button>

      <van-button class="refund_btn" type="danger" size="large" disabled v-else-if="info.status==3">审核退款中</van-button>

      <van-button class="refund_btn" type="danger" size="large" disabled v-else-if="info.status==4">退货完成</van-button>
    </div>
    <div v-else>
      <van-button class="refund_btn" type="danger" @click="subConfimRefund" size="large">确认</van-button>
    </div>

    <van-popup v-model="show" position="bottom" class="refund_pop">
      <div class="refund_pop_head">
        <p class="refund_pop_head_title">退款原因</p>
        <van-radio-group v-model="radio" class="refund_pop_head_group">
          <van-cell-group>
            <van-cell :title="item" clickable @click="cleckLy(item)" v-for="item in reason" :key="item">
              <van-radio :name="item" />
            </van-cell>

          </van-cell-group>
        </van-radio-group>
        <van-button class="" type="danger" @click="show=false" size="large">关闭</van-button>
      </div>
    </van-popup>

  </div>
</template>

<script>
import { Card, Field, RadioGroup, Radio } from 'vant';
import { setTimeout } from 'timers';
import axios from "axios";
export default {
  components: {
    [Card.name]: Card,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
  },
  data () {
    return {
      return_instructions: '',
      fileList: [],
      show: false,
      radio: '请选择',
      info: {
        return_mail: '',
        return_oid: '',
      },
      reason: [],

      pic: [],
      status: ''
    }
  },
  watch: {
    // fileList(val){
    //     for(var i in val){
    //          this.myUpload(val[i].content)
    //     }
    // }
  },
  created () {
    if (this.$store.state.isSupplier) {
      this.getSupplierApplication();
    } else {
      this.getRefundShops();
    }

  },
  methods: {
    closeImg (i) {
      this.pic.splice(i, 1)
    },
    subConfimRefund () {
      var params = {};
      params.id = this.$route.query.id || '';
      params.return_name = this.info.return_name;
      params.return_tel = this.info.return_tel;
      params.return_address = this.info.return_address;
      params.admin_remark = this.info.admin_remark;
      params.status = this.status;
      this.$api.getSupplier.addSupplierApplication(params).then(res => {
        if (res.code == 200) {
          this.$toast.success('提交成功');
          setTimeout(() => {
            this.getSupplierApplication();
          }, 1500)
        }
      })
    },
    getSupplierApplication () {
      var params = {};
      params.id = this.$route.query.id || '';
      this.$api.getSupplier.getSupplierApplication(params).then(res => {
        if (res.code == 200) {
          this.info = res.result;
          this.status = this.info.status;
          if (this.$route.query.types == 9) {
            this.reason = res.result.tour_reason || [];
          } else {
            this.reason = res.result.reason || [];
          }
          // this.radio=res.result.return_reason || '';
          this.pic = [];
          if (res.result.pic.length > 0 && res.result.status > 0) {
            for (var i in res.result.pic)
              this.pic.push(res.result.pic[i].piclink);
          }
        }
      })
    },
    setOrderMail () {
      if (this.return_mail == '' || this.return_oid == '') {
        this.$toast.fail("物流信息不能为空");
        return;
      } else {
        var params = {};
        params.id = this.$route.query.id || '';
        params.return_mail = this.info.return_mail;
        params.return_oid = this.info.return_oid;
        this.$api.getOrder.setOrderMail(params).then(res => {
          if (res.code == 200) {
            this.$toast.success(res.result);
            setTimeout(() => {
              this.getRefundShops();
            }, 1500)
          }
        })

      }
    },
    subRefund () {
      if (this.radio == '请选择') {
        this.$toast.fail("请选择退货理由");
        return false;
      } else {

        var params = {};
        params.id = this.$route.query.id || '';
        params.return_reason = this.radio;
        params.return_instructions = this.return_instructions;
        params.pic = this.pic.join('@');
        this.$api.getOrder.setOrderRefund(params).then(res => {
          if (res.code == 200) {
            this.$toast.success(res.result);
            setTimeout(() => {
              this.getRefundShops();
            }, 1500)
          }
        })
      }

    },
    cleckLy (ra) {
      this.radio = ra;
      this.show = false;
    },
    getRefundShops () {
      var params = {};
      params.id = this.$route.query.id || '';
      this.$api.getOrder.getOrderRefund(params).then(res => {
        if (res.code == 200) {
          this.info = res.result;
          if (this.$route.query.types == 9) {
            this.reason = res.result.tour_reason || [];
          } else {
            this.reason = res.result.reason || [];
          }
          // this.radio=res.result.return_reason || '';
          this.pic = [];
          if (res.result.pic.length > 0 && res.result.status > 0) {
            for (var i in res.result.pic)
              this.pic.push(res.result.pic[i].piclink);
          }
        }
      })
    },
    afterRead (file) {
      // 此时可以自行将文件上传至服务器
      // this.fileList.push(file)
      // console.log(file);
      this.myUpload(file.content)
      // if(this.myUpload(file.content)){
      //     return true;
      //      this.$toast.success("上传成功")
      // }else{
      //      this.$toast.fail("图片上传失败");
      // }

    },
    myUpload (path) {
      let that = this;

      var img = new Image();

      img.src = path;
      // base64地址图片加载完毕后执行
      img.onload = function () {
        // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        // 图片原始尺寸
        var originWidth = img.width;
        var originHeight = img.height;
        // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
        var maxWidth = 750,
          maxHeight = 750;
        // 目标尺寸
        var targetWidth = originWidth,
          targetHeight = originHeight;
        // 图片尺寸超过最大尺寸的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更改宽度，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        //对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
        //压缩后的base64文件
        var newUrl = canvas.toDataURL("image/jpeg", 0.92);
        let file = that.convertBase64UrlToBlob(newUrl);
        var fd = new FormData();
        fd.append("file", file, "file_" + Date.parse(new Date()) + ".jpg");
        // fd.append("folder", 'product');

        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };

        axios.post("/api/common/upload/index/", fd, config).then(res => {
          if (res.data.code == 200) {
            that.pic.push(res.data.result)
            // that.$toast.success("上传成功")
            return true;

          } else {
            that.$toast.fail("上传失败")
            return false;
          }
        });
      };
    },
    convertBase64UrlToBlob (urlData) {
      let bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
    },
  }
}
</script>



<style lang="less" scoped>
.radio-group {
  flex-wrap: wrap;
  > div {
    width: 100%;
    padding: 10px 0 10px 64px;
  }
}
.input_group_refund {
  .van-cell {
    padding: 0.26667rem 0.4rem !important;
  }
  .box_liy_p2 {
    line-height: 1;
    padding: 0 0.4rem 0 !important;
    position: relative;
  }
  .input_liy {
    padding: 0 !important;
    width: 70% !important;
  }
  .box_liy_pp2:after {
    position: absolute;

    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 0;
    bottom: 0;
    left: 0.4rem;
    border-bottom: 0.02667rem solid #ebedf0;
    transform: scaleY(0.5);
  }
}
.refund_pop {
  width: 100%;
  border-radius: 0;
  > .refund_pop_head {
    > .refund_pop_head_title {
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
.refund_text {
  padding: 14px 15px 50px;
  i {
    vertical-align: middle;
    margin-right: 7px;
  }
  span {
    color: #404347;
    line-height: 1.4;
    > small {
      color: #4f74a7;
    }
  }
  > p:first-child:first-child {
    padding-bottom: 26px;
  }
}
.refund_btn {
  position: fixed;
  bottom: 0;
  margin-top: 10px;
}
.up_inp_refund {
  width: 84px;
  height: 84px;
  border: 1px dashed #8b8b8b;
  color: #929292;
  text-align: center;
  > i {
    display: block;
    text-align: center;
    margin: 15px 0 6px;
  }
  > p {
    line-height: 1.4;
  }
}
.order_refund {
  background: #f4f4f4;
  line-height: 1;
  position: relative;
  font-size: 14px;
  overflow: auto;
  .box_liy {
    margin: 10px 0;
    background: #fff;
    .van-cell {
      padding: 0.26667rem 0.4rem 1rem;
      .van-cell__title {
        font-weight: bold;
        flex: auto;
        color: #222;
      }
      .van-cell__value {
        flex: auto;
      }
    }
    .box_liy_p {
      padding: 0.26667rem 0.4rem 0rem;
      font-weight: bold;
      line-height: 0.64rem;
      > span {
        color: #ff2f57;
        padding-left: 12px;
      }
    }
    .box_liy_p2 {
      font-weight: bold;
      line-height: 1rem;
      padding: 16px 0.4rem 10px;
      .input_liy {
        display: inline-block;
        margin-left: 12px;
        width: 70%;
        padding: 0;
      }
    }
  }
  .box_img {
    background: #fff;
    padding: 0.26667rem 0.4rem 25px;
    > p {
      font-weight: bold;
      line-height: 0.64rem;
      margin-bottom: 10px;
    }
    .box_img_img {
      display: inline-block;
      vertical-align: bottom;
      margin: 0 5px 0 0;
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
.card_order_refund {
  font-size: 14px;
}
</style>
