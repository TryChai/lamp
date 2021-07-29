<template>
  <div class="supplier-complaint">
    <van-nav-bar title="商家投诉" left-text left-arrow class="navbar" @click-left="$router.back()" />
    <div class="app_con fx">
      <div class="app_con_text fx_1">申述理由</div>
      <div class="fx_3">
        <div class="appliyu1 fx">
          <div>{{info.order_ar}}</div>
        </div>
      </div>
    </div>

    <div class="app_radio">
      <div class="app_radio_item fx" @click="title=item" v-for="(item,i) in  applist" :key="i">
        <div class="app_radio_item_rad" :class="{rad_ac:title==item}"></div>
        <div>{{item}}</div>
      </div>
      <div  style="border:1PX solid #f9f9f9">
        <van-cell-group>
          <van-field  @blur="windowScorll"
            class="textarea_input"
            v-model="content"
            type="textarea"
            placeholder="请输入申诉原因"
            rows="3"
            autosize
          />
        </van-cell-group>
      </div>
    </div>

    <div class="foot_text1">
      <div class="foot_text1_con1">
        <span class="icon-warnfill"></span>
        <span class="foot_text1_con1_text">投诉提醒</span>
      </div>
      <div class="foot_text1_con_title">
        <span class="foot_text1_con1_text">提起申诉后，平台客服会第一时间与您取得联系。</span>
      </div>
    </div>
    <div class="footer_btn fx btn_close" @click="subAppeal">
      <div class="btn">提交投诉</div>
    </div>
  </div>
</template>


<script>
import { Field } from "vant";
import { setTimeout } from 'timers';
export default {
  name: "SupplierComplaint",
  components: {
    // downtime,
    // cpimg
    [Field.name]: Field
  },
  data() {
    return {
      index: 0,
      info: {},
      content: "",
      title: "",
      applist: []
    };
  },
  methods: {
    subAppeal() {
      var that = this;
      that.$dialog
        .confirm({
          title: "提示",
          message: "确定提交申诉吗?"
        })
        .then(() => {
          var params = {};
          params.title = this.title;
          params.sid = "7";
          params.content = this.content;

          that.$api.getSupplier.setSupplierComlpaint(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(()=>{
                  that.$router.back();
              },1500)
            }
          });
        });
    },
    getSupplierTypes() {
      this.$api.getSupplier.getSupplierComplaintTpyes({}).then(res => {
        if (res.code == 200) {
          this.applist = res.result;
        }
      });
    }
  },
  created() {
    this.getSupplierTypes();
  }
};
</script>



<style scoped>
.supplier-complaint {
  overflow: auto;
}
.subbtn {
  text-align: center;
  padding-top: 0.2rem;
}
.sells {
  background: #fff;
  overflow: auto;
}
.appliyu1 {
  /* padding: 20px 15px 10px; */
  justify-content: flex-start;
  font-size: 14px;
}
.appeal {
  color: #8397a7;
}
.size_12 {
  font-size: 12px;
}
.sl_head1 {
  padding: 68px 15px 15px;
  color: #718aa8;
  background: #fff;
}
.liubai {
  height: 10px;
  background: #f7f6fb;
}
.app_con {
  padding: 20px 15px 10px;
  background: #fff;
  justify-content: flex-start;
}
.app_con_text {
  font-size: 14px;
  color: #1d3a51;
}
.app_radio {
  margin: 0 15px;
}
.app_radio_item {
  justify-content: flex-start !important;
  color: #0f2b48;
  font-size: 14px;
  padding: 10px 0;
}
.app_radio_item_rad {
  width: 16px;
  height: 16px;
  border: 2px solid #e7ebee;
  margin-right: 10px;
}
.sl_head1_text1 {
  font-size: 24px;
  color: #1f3f58;
  font-weight: bold;
}
.foot_text1 {
  margin: 10px 15px;
  border: 1px solid #d9e1f0;
  border-radius: 3px;
  padding: 15px;
  background: #f5f8fd;
}
.foot_text1_con1 {
  font-size: 15px;
  color: #1883d5;
  margin-bottom: 10px;
}
.foot_text1_con1_text {
  padding-left: 5px;
}
.foot_text1_con_title {
  color: #6d87a8;
  font-size: 14px;
  display: flex;
  line-height: 1.6;
  justify-content: flex-start;
}
.rad_ac {
  background: #007aff;
}
.footer_btn {
  background: #c6cfd6;
  color: #ffffff;
  margin: 15px;
  height: 46px;
  line-height: 46px;
  padding: 0 15px 0 25px;
  justify-content: center;
}
.btn {
  font-size: 16px;
  font-weight: bold;
}
.btn_close {
  background: #536d8e !important;
}
</style>
