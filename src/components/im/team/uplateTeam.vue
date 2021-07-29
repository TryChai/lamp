<template>
  <div class="con_team">
    <van-nav-bar :title="$h('战队管理')" left-arrow :border="false" :right-text="info.lord==1?$h('保存'):''" class="navbar" @click-left="onClickLeft"
        @click-right="onClickRight" />

    <div class="im_mesinfo_body">
      <div class="mesinfo_top">
        <div class="mesinfo_topitem" v-for="(item,i) in item" :key="i">
          <img :src="$fnc.getImgUrl(item.avatar)" alt="" class="mesinfo_topitem_ava">
          <span>{{item.remark || item.nickname || item.username || toAccount}}</span>
        </div>
        <div class="mesinfo_topitem" @click="inviteshow = true" v-if="$store.state.config.shop.bteam_group ==1">
          <div class="mesinfo_topitem_icon">
            <img src="@/assets/img/im/plus.png" alt="">
          </div>
        </div>
        <div class="mesinfo_topitem" @click="puntshow = true" v-show="isleader == true">
          <div class="mesinfo_topitem_icon">
            <img src="@/assets/img/im/minus.png" alt="">
          </div>
        </div>

      </div>
      <div class="mesinfo_content">
        <div class="mesinfo_part">
          <div class="mesinfo_part_form">
            <span><b></b>{{$h('战队名称')}}</span>
            <van-field v-model="info.title" input-align="right" :placeholder="isleader ?$h('请填写您的战队名称'):$h('暂无战队名称')" :disabled=" !isleader" />
          </div>
          <div class="mesinfo_part_form">
            <span><b></b>{{$h('战队口号')}}</span>
            <van-field v-model="info.slogan" input-align="right" :placeholder="isleader ?$h('请填写您的战队口号'):$h('暂无战队口号')" :disabled="!isleader" />
          </div>
          <div class="mesinfo_part_form" style="height:auto;padding:10px 0">
            <span><b></b>{{$h('战队头像')}}</span>
            <div class="img_upload">
              <div class="piclink" v-if="info.avatar">
                <van-icon class="close" @click="closeImg" name="cross" />
                <img :src="$fnc.getImgUrl(info.avatar)" alt v-show="isleader">
              </div>
              <van-uploader :after-read="onRead" :disabled="isleader ? false:true" v-else />
            </div>
            <!-- <img :src="$fnc.getImgUrl(info.avatar)" alt> -->
          </div>
        </div>
        <div class="mesinfo_part" v-show="isleader== true">
          <div class="mesinfo_part_form" @click="showPo(1)">
            <span><b></b>加入条件 - 直推人数</span>
            <span>{{config.team_right_join==1?zt:"不限"}}</span>
          </div>
          <div class="mesinfo_part_form" @click="showPo(2)">
            <span><b></b>加入条件 - 团队人数</span>
            <span class>{{config.team_right_join==1?dd:"不限"}}</span>
          </div>
          <div class="mesinfo_part_form" v-if="config.team_right_kick==1">
            <span><b></b>{{$h('是否开放加入')}}</span>
            <van-switch v-model="is_open" class="fx swi" active-color="#07c160" inactive-color="" />
          </div>
          <div class="mesinfo_part_form" v-if="config.team_right_stoptalk==1">
            <span><b></b>{{$h('是否开放公聊')}}</span>
            <van-switch v-model="is_chat" class="fx swi" active-color="#07c160" inactive-color="" />
          </div>
        </div>

        <div class="mesinfo_part_check" v-if="isleader">
          <p>{{$h('待审核列表')}}</p>
          <div class="mesinfo_part_check_user" v-for="(it,i) in check" :key="i">
            <img :src="$fnc.getImgUrl(it.avatar)" class="man" alt>
            <div class="mesinfo_part_check_user_info">
              <p class="p1">{{it.remark || it.nickname || it.username || ''}}</p>
              <div class="p2">
                <span class="s2">{{it.coin_rating_cn}}</span>
                <span class="s3">{{$h('团队')}}:{{it.team_num}}人</span>
              </div>
            </div>
            <div class="mesinfo_part_check_user_btn b1" @click="refuse(it.id,it.nickname)">{{$h('拒绝')}}</div>
            <div class="mesinfo_part_check_user_btn b2" @click="byjoining(it.id,it.nickname)">{{$h('通过')}}</div>
          </div>
        </div>
        <div class="mesinfo_part" v-else>
          <div class="mesinfo_part_btn" @click="outTeam">
            {{$h('删除并退出')}}
          </div>
        </div>
      </div>

    </div>

    <van-popup v-model="show1" position="bottom">
      <van-picker :columns="picker1" :default-index="parseInt(info.zt)" @cancel="onCancel" @confirm="onConfirm1" :show-toolbar="true" />
    </van-popup>

    <van-popup v-model="show2" position="bottom">
      <van-picker :columns="picker2" :default-index="parseInt(info.dd)" @cancel="onCancel" @confirm="onConfirm2" :show-toolbar="true" />
    </van-popup>

    <van-popup v-model="inviteshow" position="right" :style="{width:'100%', height: '100%' }">
      <invitelist @close="inviteshow =false" :isgroup="true" :teamid="info.id"></invitelist>
    </van-popup>
    <van-popup v-model="puntshow" position="right" :style="{width:'100%', height: '100%' }">
      <div class="invitetop">
        <span></span>
        <span>{{$h('选择好友')}}</span>
        <span @click="puntshow = false">{{$h('取消')}}</span>
      </div>
      <div class="punt_box">
        <div class="punt_userinfo" v-for="(item, i) in item" :key="i">

          <img :src="$fnc.getImgUrl(item.avatar)" alt="">
          <span>{{item.nickname || item.username}}</span>
          <span @click="transfer(item.id,item.nickname)" v-show="item.id != $store.state.user.id">{{$h('转让')}}</span>
          <span @click="lteout(item.id,item.nickname)" v-show="item.id != $store.state.user.id">{{$h('删除')}}</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Field, Picker, Switch } from "vant";
import axios from "axios";
import { setTimeout } from 'timers';
import invitelist from '@/components/im/information/invitelist'
export default {
  name: "createteam",
  components: {
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Switch.name]: Switch,
    invitelist
  },
  data () {
    return {
      puntshow: false,
      inviteshow: false,

      form: {},
      avatar: "",
      checked: "",
      title: "",
      slogan: "",
      is_open: true,
      is_chat: true,
      info: {
        avatar: "",
        title: "",
        slogan: "",
        is_open: "1",
        is_chat: "1",
        team_num: "0"
      },
      check: [], //待审核0
      item: [], ////团队成员1
      tabs: "0",
      config: {},
      show1: false,
      show2: false,
      picker1: [],
      picker2: [],
      index1: 0,
      index2: 0,
      zt: "",
      dd: ""
    };
  },
  computed: {
    isleader () {
      return this.info.lord == 1 ? true : false;
    },
  },
  methods: {
    closeImg () {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定删除吗"
        }).then(() => {
          this.info.avatar = '';
        })
    },
    outTeam () {
      var that = this;
      that.$dialog
        .confirm({
          title: "操作",
          message: "确认退出战队吗"
        })
        .then(() => {
          var params = {};
          params.id = that.info.id
          that.$api.getIm.exit_team(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => { this.$router.push('/im/imindex?active=clan') }, 3000)
            }
          });
        });
    },
    refuse (id, name) {
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h('操作'),
          message: this.$h('确认拒绝') + name +this.$h('吗')
        })
        .then(() => {
          var params = {};
          params.other_id = id;
          params.id = that.info.id;
          that.$api.getIm.refuseTeam(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => { that.getList() }, 3000)
            }
          });
        });
    },
    byjoining (id, name) {
      var that = this;
      that.$dialog
        .confirm({
          title:this.$h('操作'),
          message: this.$h('确认通过') + name + this.$h('加入吗')
        })
        .then(() => {
          var params = {};
          params.other_id = id;
          params.id = that.info.id;
          that.$api.getIm.byjoining(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => { that.getList() }, 3000)
            }
          });
        });
    },
    lteout (id, name) {
      //踢出
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h('操作'),
          message: this.$h('确认踢出') + name + this.$h('吗')
        })
        .then(() => {
          var params = {};
          params.other_id = id;
          params.id = that.info.id;
          that.$api.getIm.tOutTeam(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => { that.getList() }, 3000)
            }
          });
        });
    },
    transfer (id, name) {
      //踢出
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h('操作'),
          message: this.$h('确认把队长转让给') + name + this.$h('吗')
        })
        .then(() => {
          var params = {};
          params.other_id = id;
          params.id = that.info.id;
          that.$api.getIm.transferTeam(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => { that.getList(); this.puntshow = false }, 3000)
            }
          });
        });
    },
    onClickRight () {
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h('操作'),
          message: this.$h('确认修改吗')
        })
        .then(() => {
          var params = {};
          var {
            id,
            title,
            avatar,
            slogan,
            zt,
            dd,
          } = this.info;
          params.id = id;
          params.title = title;
          params.avatar = avatar;
          params.slogan = slogan;
          params.zt = zt;
          params.dd = dd;
          params.is_open = this.is_open == true ? '1' : '0';
          params.is_chat = this.is_chat == true ? '1' : '0';

          that.$api.getIm.saveEaitTeam(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(() => { this.$router.push('/im/imindex?active=clan') }, 3000)
            }
          });
        });
    },
    showPo (i) {
      if (i == 1 && this.config.team_right_join == 1) {
        this.show1 = true;
      } else if (i == 2 && this.config.team_right_join == 1) {
        this.show2 = true;
      }
    },
    onClickLeft () {
      this.toBack();
    },
    onCancel () {
      this.show1 = false;
      this.show2 = false;
    },
    onConfirm1 (value, index) {
      this.zt = value;
      this.show1 = false;
      this.info.zt = index;
    },
    onConfirm2 (value, index) {
      this.dd = value;
      this.show2 = false;
      this.info.dd = index;
    },
    onRead (file) {
      this.cpimgOk(file.content);
    },
    getList () {
      this.check = [];
      this.item = [];
      var params = {};
      var tid = this.$route.query.tid || ""
      if (tid.indexOf('GROUP') >= 0) {
        tid = tid.replace('GROUP', '')
      }
      params.im = tid;
      this.$api.getIm.editTeam(params).then(res => {
        if (res.code == 200) {
          this.info = res.result;
          this.info.is_open == 1 ? this.is_open = true : this.is_open = false;
          this.info.is_chat == 1 ? this.is_chat = true : this.is_chat = false;
          for (var i in res.result.team) {
            if (res.result.team[i].is_im_team == 0) {
              this.check.push(res.result.team[i]);
            } else if (res.result.team[i].is_im_team == 1) {
              this.item.push(res.result.team[i]);
            }
          }
          if (res.result.lord == 1) {
            this.config = res.result.config;
            if (res.result.config.is_zt == 1) {
              this.picker1 = res.result.config.zt;
              this.zt = res.result.config.zt[this.info.zt];
            }
            if (res.result.config.is_dd == 1) {
              this.picker2 = res.result.config.dd;
              this.dd = res.result.config.zt[this.info.dd];
            }
          }
        }
      });
    },
    cpimgOk (file) {
      this.$toast.loading({
        mask: false,
        message: this.$h('上传中...'),
        duration: 0
      });
      let that = this;

      var img = new Image();

      img.src = file;
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
        fd.append("folder", 'imteam');

        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };

        axios.post("/api/common/upload/index/", fd, config).then(res => {
          if (res.data.code == 200) {
            that.info.avatar = res.data.result;
            that.$toast.clear();
          } else {
            that.$toast.fail(this.$h("图片上传失败"));
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
    }
  },
  created () {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
.con_team {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #fff;
}
.adteam {
  overflow: hidden;
}
.con_teamlist > div:first-child {
  height: 100%;
  overflow: auto;
  position: relative;
  border-top: none !important;
}
.adteam {
  .team_tabs {
    height: 73px;
    background: #f2f2f2;
    align-items: center;
    font-size: 16px;
    color: #36cb7d;
    > div {
      width: 110px;
      text-align: center;
      border: 1px solid #36cb7d;
    }
    > div:first-child {
      border-radius: 4px 0 0 4px;
    }
    > div:last-child {
      border-radius: 0px 4px 4px 0px;
    }
    .ac_team {
      background: #36cb7d;
      color: #fff;
    }
  }
  .adteamhead {
    background: url("../../../assets/img/im/team/head.png") no-repeat;
    background-size: 100% 100%;
    height: 130px;
    overflow: hidden;
    > .head_text {
      margin-top: 75px;
      text-align: center;
      font-size: 14px;
      color: #fff;
    }
  }
  > div.cell {
    align-items: center;
    color: #4d4d4d;
    .van-cell__value {
      justify-content: flex-end;
    }
    .input_cell {
      padding: 0.26667rem 0rem;
      input {
        text-align: right;
      }
    }
    .custom_right {
      transform: rotateZ(90deg);
    }
    .ren {
      color: #4d4d4d;
      padding-left: 6px;
      i {
        vertical-align: middle;
      }
    }
    .red_cell {
      color: #ff4b32;
    }
    .piclink {
      display: inline-block;
      width: 80px;
      height: 80px;
      vertical-align: bottom;
      position: relative;
      .close {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        background: red;
        color: #fff;
      }
      > img {
        width: 80px;
        height: 80px;
      }
    }
    .piclink + div {
      display: inline-block;
    }
  }
  .liubai {
    height: 34px;
    line-height: 34px;
    font-size: 16px;
    color: #999999;
    padding-left: 0.4rem;
    background: #f2f2f2;
  }
  .btn_team {
    width: 340px;
    height: 46px;
    line-height: 46px;
    display: block;
    margin: 0 auto;
    background: #ff9251;
    color: #fff;
    border-radius: 4px;
    margin-top: 30px;
    margin-bottom: 10px;
  }
  p.foot_p {
    color: #ff9251;
    padding: 8px 0 24px 23px;
    font-size: 12px;
  }
}
.con_teamlist {
  padding: 18px;
  font-size: 14px;
  > div.con_team {
    justify-content: flex-start;
    padding: 16px 0;
    .man {
      width: 50px;
      height: 50px;
      border-radius: 4px;
    }
    .con_item {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex: 4;
      .team_info {
        padding-left: 16px;
        line-height: 1;
        > .p1 {
          color: #4c4c4c;
          padding-bottom: 7px;
          font-weight: bold;
          font-size: 16px;
        }
        > .p2 {
          color: #fff;
          > span {
            padding: 3px 4px;
            border-radius: 4px;
            font-size: 12px;
            display: inline-block;
          }
          .s2 {
            background: #ffb500;
          }
          .s3 {
            background: #9867ff;
            margin-left: 6px;
          }
        }
        .p3 {
          color: #999;
          font-size: 11px;
        }
      }
      .team_btn {
        padding: 8px 10px;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        font-size: 12px;
        line-height: 1;
      }
      .b1 {
        background: #ebebeb;
        color: #666;
      }
      .b2 {
        background: #07c160;
        margin-left: 6px;
      }
    }
  }
  > div:not(:first-child) {
    border-top: 1px solid #ebebeb;
  }
}
.im_mesinfo_body {
  width: 100%;
  flex: 1;
  overflow: auto;

  background-color: #ededed;
  .mesinfo_top {
    width: 100%;
    padding: 15px 10px 5px 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    background-color: #ffffff;
    .mesinfo_topitem {
      padding: 0 10px;
      width: 20%;
      font-size: 10px;
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      margin-bottom: 10px;

      > .mesinfo_topitem_ava {
        width: 100%;
        border-radius: 5px;
      }
      > .mesinfo_topitem_icon {
        width: 100%;
        padding: 10px;
        border: 2px dashed #eeeeee;
        > img {
          width: 100%;
        }
      }
      > i {
        width: 100%;
        // height: calc(width);
        font-size: 24px;
        color: #b6b6b6;
        border: 2px dashed #eeeeee;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        border-radius: 5px;
        font-weight: normal;
      }
      > span {
        width: 100%;
        color: #828282;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
  .mesinfo_content {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    .mesinfo_part {
      width: 100%;
      background-color: #ffffff;
      margin-top: 10px;
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: center;
      > div {
        width: 100%;
      }
      .mesinfo_part_btn {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #eeeeee;
        font-size: 16px;
        color: #ff5454;
      }
      .mesinfo_part_form {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #eeeeee;
        > span:nth-of-type(1) {
          font-size: 15px;
          font-weight: bold;
          color: #181818;
          padding-left: 20px;
        }
        .van-cell {
          flex: 1;
        }

        > span:nth-of-type(2) {
          margin-left: auto;
          margin-right: 13px;
          font-size: 14px;
          color: #323233;
        }
        .van-switch {
          margin-left: auto;
          margin-right: 13px;
        }
        .img_upload {
          margin-left: auto;
          margin-right: 13px;
          width: 80px;
          .piclink {
            display: inline-block;
            width: 80px;
            height: 80px;
            vertical-align: bottom;
            position: relative;
            .close {
              position: absolute;
              top: 0;
              right: 0;
              width: 15px;
              height: 15px;
              font-size: 14px;
              text-align: center;
              line-height: 20px;
              background: red;
              color: #fff;
            }
            > img {
              width: 80px;
              height: 80px;
            }
          }
          .piclink + div {
            display: inline-block;
          }
        }
      }
    }
    .mesinfo_part_check {
      width: 100%;
      display: flex;
      flex-flow: column;
      justify-content: flex-start;
      align-items: center;
      margin-top: 10px;
      > p {
        width: 100%;
        background-color: #ffffff;
        font-size: 16px;
        font-weight: bold;
        line-height: 40px;
        color: #333333;
        text-align: center;
      }
      .mesinfo_part_check_user {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        background-color: #ffffff;
        padding: 10px 13px;
        border-bottom: 1px solid #eeeeee;
        > img {
          width: 50px;
          border-radius: 10px;
        }
        > .mesinfo_part_check_user_info {
          flex: 1;
          padding-left: 16px;
          line-height: 1;
          > .p1 {
            color: #4c4c4c;
            padding-bottom: 7px;
            font-weight: bold;
            font-size: 16px;
          }
          > .p2 {
            color: #fff;
            > span {
              padding: 3px 4px;
              border-radius: 4px;
              font-size: 12px;
              display: inline-block;
            }
            .s2 {
              background: #ffb500;
            }
            .s3 {
              background: #9867ff;
              margin-left: 6px;
            }
          }
          .p3 {
            color: #999;
            font-size: 11px;
          }
        }
        .mesinfo_part_check_user_btn {
          padding: 8px 10px;
          text-align: center;
          color: #fff;
          border-radius: 5px;
          font-size: 12px;
          line-height: 1;
        }
        .b1 {
          background: #ebebeb;
          color: #666;
        }
        .b2 {
          background: #07c160;
          margin-left: 6px;
        }
      }
    }
  }
}
.invitetop {
  width: 100%;
  height: 50px;
  background-color: #ededed;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  > span:nth-of-type(1) {
    font-size: 16px;
    color: #101010;
    position: absolute;
    left: 13px;
  }
  > span:nth-of-type(2) {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #121212;
  }
  > span:nth-of-type(3) {
    font-size: 14px;
    color: #b1b1b1;
    background-color: #e2e2e2;
    border-radius: 5px;
    padding: 2px 10px;
    position: absolute;
    right: 13px;
  }
  .active_btn {
    color: #ffffff !important;
    background-color: #07c160 !important;
  }
}
.punt_box {
  width: 100%;
  height: 100%;

  overflow: auto;

  .punt_userinfo {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eeeeee;
    > img {
      width: 40px;
      height: 40px;
      margin: 0 10px;
      border-radius: 10px;
    }
    > span:nth-of-type(1) {
      font-size: 14px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    > span:nth-of-type(2) {
      font-size: 14px;
      background-color: #42cc78;
      border-radius: 5px;
      color: #ffffff;
      padding: 2px 5px;
    }
    > span:nth-of-type(3) {
      font-size: 14px;
      background-color: #f15555;
      border-radius: 5px;
      color: #ffffff;
      padding: 2px 5px;
      margin-left: 5px;
    }
  }
}
</style>
