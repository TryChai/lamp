<template>
  <div class="mail_details">
    <van-nav-bar title="物流信息" left-text left-arrow class="navbar" :border="false" @click-left="toBack" />

    <div class="mail_details_head">
      <p>
        物流公司
        <span>{{info.mail_courier}}</span>
      </p>
      <!-- <p>
        物流电话
        <span>{{info.mail_tel}}</span>
      </p>-->
    </div>

    <div class="mail_details_mailinfo">
      <div class="mail_oid">
        运单编号
        <span style="    padding-left: 15px;">{{info.mail_oid}}</span>
        <van-button type="primary" size="mini" class="copy" style="cursor: pointer" onclick :data-clipboard-text="info.mail_oid"
            data-clipboard-action="copy" @click="copy(info.mail_oid)">复制</van-button>
      </div>
      <van-steps direction="vertical" :active="0" class="setps_mail" v-if="info.mail && info.mail.Traces">
        <van-step v-for="(item,i) in info.mail.Traces" :key="i">
          <h3>{{item.AcceptStation}}</h3>
          <p class="mail_time">{{item.AcceptTime}}</p>
        </van-step>
      </van-steps>

      <div v-else class="no_mail">暂未查找到物流信息</div>
    </div>
  </div>
</template>


<script>
import { Step, Steps } from "vant";
export default {
  components: {
    [Step.name]: Step,
    [Steps.name]: Steps
  },
  data () {
    return {
      info: {
        mail: {
          Traces: []
        }
      }
    };
  },
  created () {
    this.getMailInfo();
  },
  methods: {
    copy (value) {
      let _this = this;
      let clipboard = new this.clipboard(".copy");

      clipboard.on("success", function (e) {
        _this.$toast.success("复制成功");
        e.clearSelection();
      });
      clipboard.on("error", function () {
        // _this.$toast.success('调用app方法');
        _this.$fnc.ykAPPCopy(value);
      });
    },
    getMailInfo () {
      var params = {};
      params.id = this.$route.query.id || "";
      this.$api.getOrder.getMailInfo(params).then(res => {
        if (res.code == 200) {
          this.info = res.result;
        }
      });
    }
  }
};
</script>


<style lang="less" scoped>
.mail_details {
  background: #f3f4f6;
  line-height: 1;
  font-size: 14px;
  overflow: auto;
  > .mail_details_head {
    background: #fff;
    padding: 16px 13px;
    margin: 16px 0;
    > p {
      color: #8b8f94;
      > span {
        margin-left: 15px;
      }
    }
    > p:first-child {
      // margin-bottom: 12px;
      > span {
        color: #4f4f4f;
      }
    }
    > p:last-child {
      > span {
        color: #0f70e4;
      }
    }
  }
  > .mail_details_mailinfo {
    padding: 0 13px;
    background: #fff;
    > .mail_oid {
      height: 52px;
      line-height: 52px;
      border-bottom: 1px solid #f7f7f7;
      display: flex;
      align-items: center;
      > span {
        margin-right: 8px;
      }
    }
    .setps_mail {
      h3 {
        font-size: 14px;
        font-weight: 400;
        line-height: 1.4;
      }
      .mail_time {
        font-size: 10px;
        margin-top: 10px;
      }
      .van-step--process {
        h3 {
          color: #202020;
        }
        .mail_time {
          color: #71757b;
        }
      }
    }
  }
}
.no_mail {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #9b9b9b;
}
</style>
