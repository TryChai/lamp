<template>
  <div class="con_team">
    <van-nav-bar
      title="战队管理"
      left-arrow
      :border="false"
      :right-text="info.lord==1?'保存':''"
      class="navbar"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <div class="adteam con" v-if="info.lord==0">
      <div class="liubai">战队详情</div>
      <van-cell class="cell" title="战队名称">
        <van-field  @blur="windowScorll" class="input_cell tr" disabled v-model="info.title" :placeholder="$h(请填写您的战队名称)"/>
      </van-cell>
      <van-cell class="cell" title="战队头像">
        <div class="piclink">
          <img :src="$fnc.getImgUrl(info.avatar)" alt>
        </div>
      </van-cell>
      <van-cell class="cell" title="战队口号">
        <van-field  @blur="windowScorll" class="input_cell" disabled v-model="info.slogan" placeholder="请输入您的战队口号"/>
      </van-cell>

      <van-row type="flex" class="team_tabs" justify="center">
        <div :class="{ac_team:tabs==0}" >团队成员</div>

      </van-row>

      <div class="con_teamlist" >
        <div class="fx con_team" v-for="it in item" :key="it.id+Math.random()">
          <img :src="$fnc.getImgUrl(it.avatar)" class="man" alt>
          <div class="con_item">
            <div class="team_info fx_3">
              <p class="p1">{{it.nickname}}</p>
              <div class="p2">
                <span class="s2">{{it.coin_rating_cn}}</span>
                <span class="s3">团队:{{it.team_num}}人</span>
              </div>
            </div>
          </div>
        </div>
      </div>

        <van-button class="btn_team" type="default" @click="outTeam">退出战队</van-button>
    </div>

    <div class="adteam con" v-if="info.lord==1">
      <div class="liubai">战队设置</div>
      <van-cell class="cell" title="战队名称">
        <van-field  @blur="windowScorll" class="input_cell tr" v-model="info.title" :placeholder="$h(请填写您的战队名称11)"/>
      </van-cell>
      <van-cell class="cell" title="战队头像">
        <div class="piclink" v-if="info.avatar">
          <van-icon class="close"  @click="closeImg" name="cross"/>
          <img :src="$fnc.getImgUrl(info.avatar)" alt>
        </div>
        <van-uploader :after-read="onRead" v-else/>
      </van-cell>
      <van-cell class="cell" title="战队口号">
        <van-field  @blur="windowScorll" class="input_cell" v-model="info.slogan" placeholder="请输入您的战队口号"/>
      </van-cell>

      <div class="liubai">加入条件</div>

      <van-cell class="cell" title="直推人数" @click="showPo(1)">
        <span class>{{config.team_right_join==1?zt:"不限"}}</span>
        <!-- <span class="ren" v-if="config.team_right_join==1">人</span> -->
      </van-cell>
      <van-cell class="cell" title="团队人数" :border="true" @click="showPo(2)">
        <span class>{{config.team_right_join==1?dd:"不限"}}</span>
        <!-- <span class="ren" v-if="config.team_right_join==1">人</span> -->
      </van-cell>

      <div class="liubai">战队功能</div>

      <van-cell class="cell" title="是否开放加入" v-if="config.team_right_kick==1">
        <van-switch
          v-model="is_open"
          class="fx swi"
          active-color="#07c160"
          inactive-color="#f44"
        />
      </van-cell>
      <van-cell class="cell" title="是否开放公聊" v-if="config.team_right_stoptalk==1">
        <van-switch
          v-model="is_chat"
          class="fx swi"
          active-color="#07c160"
          inactive-color="#f44"
        />
      </van-cell>

      <!-- <van-cell class="cell" title="是否允许禁言"  v-if="config.team_right_prohibited==1">
        <van-switch v-model="info.is_chat" class="fx swi" active-color="#07c160" inactive-color="#f44"/>
      </van-cell>-->

      <van-row type="flex" class="team_tabs" justify="center">
        <div :class="{ac_team:tabs==0}" @click="tabs=0">团队成员</div>
        <div :class="{ac_team:tabs==1}" @click="tabs=1">待审核</div>
      </van-row>
      <div class="con_teamlist" v-show="tabs==0">
        <div class="fx con_team" v-for="it in item" :key="it.id+Math.random()">
          <img :src="$fnc.getImgUrl(it.avatar)" class="man" alt>
          <div class="con_item">
            <div class="team_info fx_3">
              <p class="p1">{{it.nickname}}</p>
              <div class="p2">
                <span class="s2">{{it.coin_rating_cn}}</span>
                <span class="s3">团队:{{it.team_num}}人</span>
              </div>
            </div>
            <div
              class="team_btn b1"
              @click="lteout(it.id,it.nickname)"
              v-if="info.boss_uid !=it.id"
            >踢出</div>
            <div
              class="team_btn b2"
              @click="transfer(it.id,it.nickname)"
              v-if="config.team_right_transfer==1 && info.boss_uid !=it.id"
            >转让队长</div>
          </div>
        </div>
      </div>
      <div class="con_teamlist" v-show="tabs==1">
        <div class="fx con_team" v-for="it in check" :key="it.id+Math.random()">
          <img :src="$fnc.getImgUrl(it.avatar)" class="man" alt>
          <div class="con_item">
            <div class="team_info fx_3">
              <p class="p1">{{it.nickname}}</p>
              <div class="p2">
                <span class="s2">{{it.coin_rating_cn}}</span>
                <span class="s3">团队:{{it.team_num}}人</span>
              </div>
            </div>
            <div class="team_btn b1" @click="refuse(it.id,it.nickname)">拒绝</div>
            <div class="team_btn b2" @click="byjoining(it.id,it.nickname)">通过</div>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model="show1" position="bottom">
      <van-picker
        :columns="picker1"
        :default-index="parseInt(info.zt)"
        @cancel="onCancel"
        @confirm="onConfirm1"
        :show-toolbar="true"
      />
    </van-popup>

    <van-popup v-model="show2" position="bottom">
      <van-picker
        :columns="picker2"
        :default-index="parseInt(info.dd)"
        @cancel="onCancel"
        @confirm="onConfirm2"
        :show-toolbar="true"
      />
    </van-popup>
  </div>
</template>

<script>
import { Field, Picker, Switch } from "vant";
import axios from "axios";
import { setTimeout } from 'timers';
export default {
  name: "createteam",
  components: {
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Switch.name]: Switch
  },
  data() {
    return {
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
  methods: {
    closeImg(){
       this.$dialog
        .confirm({
          title: "提示",
          message: "确定删除吗"
        }).then(()=>{
            this.info.avatar='';
        })
    },
    outTeam(){
         var that = this;
      that.$dialog
        .confirm({
          title: "操作",
          message: "确认退出战队吗吗"
        })
        .then(() => {
          var params = {};
          that.$api.getIm.outTeam(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(()=>{this.$router.push('/im/imindex?active=clan')},3000)
            }
          });
        });
    },
    refuse(id, name) {
      var that = this;
      that.$dialog
        .confirm({
          title: "操作",
          message: "确认拒绝" + name + "吗"
        })
        .then(() => {
          var params = {};
          params.other_id = id;
          params.id = that.info.id;
          that.$api.getIm.refuseTeam(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(()=>{that.getList()},3000)
            }
          });
        });
    },
    byjoining(id, name) {
      var that = this;
      that.$dialog
        .confirm({
          title: "操作",
          message: "确认通过" + name + "加入吗"
        })
        .then(() => {
          var params = {};
          params.other_id = id;
          params.id = that.info.id;
          that.$api.getIm.byjoining(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(()=>{that.getList()},3000)
            }
          });
        });
    },
    lteout(id, name) {
      //踢出
      var that = this;
      that.$dialog
        .confirm({
          title: "操作",
          message: "确认踢出" + name + "吗"
        })
        .then(() => {
          var params = {};
          params.other_id = id;
          params.id = that.info.id;
          that.$api.getIm.tOutTeam(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(()=>{that.getList()},3000)
            }
          });
        });
    },
    transfer(id, name) {
      //踢出
      var that = this;
      that.$dialog
        .confirm({
          title: "操作",
          message: "确认把队长转让给" + name + "吗"
        })
        .then(() => {
          var params = {};
          params.other_id = id;
          params.id = that.info.id;
          that.$api.getIm.transferTeam(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(()=>{that.getList()},3000)
            }
          });
        });
    },
    onClickRight() {
      var that = this;
      that.$dialog
        .confirm({
          title: "操作",
          message: "确认修改吗"
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
          params.is_open = this.is_open==true?'1':'0';
          params.is_chat = this.is_chat==true?'1':'0';

          that.$api.getIm.saveEaitTeam(params).then(res => {
            if (res.code == 200) {
              that.$toast.success(res.result);
              setTimeout(()=>{this.getList()},3000)
            }
          });
        });
    },
    showPo(i) {
      if (i == 1 && this.config.team_right_join == 1) {
        this.show1 = true;
      } else if (i == 2 && this.config.team_right_join == 1) {
        this.show2 = true;
      }
    },
    onClickLeft() {
      this.toBack();
    },
    onCancel() {
      this.show1 = false;
      this.show2 = false;
    },
    onConfirm1(value, index) {
      this.zt = value;
      this.show1 = false;
      this.info.zt = index;
    },
    onConfirm2(value, index) {
      this.dd = value;
      this.show2 = false;
      this.info.dd = index;
    },
    onRead(file) {
      this.cpimgOk(file.content);
    },
    getList() {
        this.check=[];
        this.item=[];
      var params = {};
      var tid=this.$route.query.tid || ""
          if(tid.indexOf('GROUP')>=0){
            tid=tid.replace('GROUP','')
          }
      params.im = tid;
      this.$api.getIm.editTeam(params).then(res => {
        if (res.code == 200) {
          this.info = res.result;
          this.info.is_open==1?this.is_open=true:this.is_open=false;
          this.info.is_chat==1?this.is_chat=true:this.is_chat=false;
          for (var i in res.result.team) {
              if (res.result.team[i].is_im_team == 0) {
                this.check.push(res.result.team[i]);
              } else {
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
    cpimgOk(file) {
      this.$toast.loading({
        mask: false,
        message: "上传中...",
        duration: 0
      });
      let that = this;

      var img = new Image();

      img.src = file;
      // base64地址图片加载完毕后执行
      img.onload = function() {
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
            that.$toast.fail("图片上传失败");
          }
        });
      };
    },
    convertBase64UrlToBlob(urlData) {
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
  created() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
.con_team{
  background:#fff;
}
.adteam{
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
</style>
