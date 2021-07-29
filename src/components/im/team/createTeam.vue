<template>
  <div class="con_team">
    <van-nav-bar :title="$h('创建战队')" left-arrow :border="false" class="navbar" @click-left="onClickLeft" />
    <div class="adteam con">
      <div class="adteamhead">
        <p class="head_text" v-if="create>0">{{$h('队长享受')}}{{create || 0}}%{{$h('高佣')}}</p>
      </div>
      <van-cell class="cell" :title="$h('队长申请条件')" @click="show=true">
        <span>{{$h(cate)}}</span>
        <van-icon slot="right-icon" name="play" class="custom_right" />
      </van-cell>
      <van-cell class="cell" :title="$h('队长申请条件（直推）')" v-if="item.zt_num>0">
        <span>{{$h(item.zt_num)}}</span>
        <span class="ren">人</span>
      </van-cell>
      <van-cell class="cell" :title="$h('队长申请条件（团队）')" v-if="item.dd_num>0">
        <span>{{item.dd_num}}</span>
        <span class="ren">{{$h('人')}}</span>
      </van-cell>
      <van-cell class="cell" :title="$h('申请需支付')">
        <span class="red_cell">{{item.money}}</span>
        <span class="ren">{{$h(item.money_cn)}}</span>
      </van-cell>

      <div class="liubai">{{$h('设置加入您的战队的条件')}}</div>

      <van-cell class="cell" :title="$h('直推人数')" @click="show1=true" v-if="item.is_zt==1">
        <span class="">{{$h(zt)}}</span>
        <span class="ren">
          <van-icon slot="right-icon" name="arrow" class="custom-icon" />
        </span>
      </van-cell>
      <van-cell class="cell" :title="$h('团队人数')" @click="show2=true" v-if="item.is_dd==1">
        <span class="">{{$h(dd)}}</span>
        <span class="ren">
          <van-icon slot="right-icon" name="arrow" class="custom-icon" />
        </span>

      </van-cell>

      <van-cell class="cell">
        <van-field @blur="windowScorll" class="input_cells" v-model="title" :placeholder="$h('请填写您的战队名称')" />
      </van-cell>
      <van-cell class="cell ">
        <div class="pic_title">{{$h('上传您的战队队标')}}</div>
        <div class="piclink" v-if="avatar">
          <van-icon class="close" @click="closeImg" name="cross" />
          <img :src="$fnc.getImgUrl(avatar)" alt="">
        </div>
        <van-uploader :after-read="onRead" v-else />
      </van-cell>
      <van-cell class="cell">
        <van-field @blur="windowScorll" class="input_cells" v-model="slogan" :placeholder="$h('请输入您的战队口号')" />
      </van-cell>

      <van-button class="btn_team" type="default" @click="sunInfo" :disabled='condition==0'>{{condition==1?$h('确认'):$h('未达到创建条件')}}</van-button>
      <p class="foot_p">{{$h('战队队长享受全战队会员业绩分润')}}{{create || 0}}%</p>

    </div>

    <van-popup v-model="show" position="bottom">
      <van-picker :columns="picker" :default-index="index" @cancel="onCancel" @confirm="onConfirm" :show-toolbar="true" />
    </van-popup>

    <van-popup v-model="show1" position="bottom">
      <van-picker :columns="picker1" :default-index="index1" @cancel="onCancel" @confirm="onConfirm1" :show-toolbar="true" />
    </van-popup>

    <van-popup v-model="show2" position="bottom">
      <van-picker :columns="picker2" :default-index="index2" @cancel="onCancel" @confirm="onConfirm2" :show-toolbar="true" />
    </van-popup>

  </div>
</template>

<script>
import { Field, Picker } from 'vant';
import axios from 'axios';
import { setTimeout } from 'timers';
export default {
  name: "createteam",
  components: {
    [Field.name]: Field,
    [Picker.name]: Picker,
  },
  data () {
    return {
      value: "",
      info: {},
      create: '',
      show: false,
      picker: [],
      cate: "",
      index: 0,
      item: {},
      show1: false,
      picker1: [],
      index1: 0,
      zt: "",
      dd: "",
      index2: 0,
      show2: false,
      avatar: "",
      title: "",
      slogan: "",
      picker2: [],
      condition: 0


    };
  },
  methods: {
    closeImg () {
      this.$dialog
        .confirm({
          title: this.$h('提示'),
          message: this.$h('确定删除吗')
        }).then(() => {
          this.avatar = '';
        })
    },
    sunInfo () {
      if (this.condition == 0) {
        this.$toast.fail(this.$h("未达到创建条件"));
      } else {
        var params = {};
        params.cate = this.cate;
        params.title = this.title;
        params.avatar = this.avatar;
        params.slogan = this.slogan;
        this.item.is_zt > 0 ? params.zt = this.index1 : '';
        this.item.is_dd > 0 ? params.dd = this.index2 : '';

        this.$api.getIm.addTeam(params).then(res => {
          if (res.code == 200) {
            this.onClickLeft();
            this.$toast.success(this.$h("创建成功"));
          }
        })
      }



    },
    onClickLeft () {
      this.$emit('close')
    },
    onRead (file) {
      this.cpimgOk(file.content);
    },
    getList () {
      this.$api.getIm.getTeamIndex({}).then(res => {
        if (res.code == 200) {
          this.info = res.result;

          for (var i in res.result) {
            this.picker.push(res.result[i].title)
            this.item = res.result.bteam;
            this.cate = res.result.bteam.title;
            this.zt = res.result.bteam.dd[0];
            this.dd = res.result.bteam.dd[0]
            this.picker1 = res.result.bteam.dd;
            this.picker2 = res.result.bteam.dd;
            this.create = res.result.bteam.create;
            this.condition = res.result.bteam.condition;
          }
        } else {
          setTimeout(() => {
            this.$emit('close')
          }, 3000)

        }
      })
    },
    onCancel () {
      this.show = false;
      this.show1 = false;
      this.show2 = false;
    },
    onConfirm (value, index) {
      this.cate = value;
      this.show = false;
      this.index = index;

    },
    onConfirm1 (value, index) {
      this.zt = value;
      this.show1 = false;
      this.index1 = index;

    },
    onConfirm2 (value, index) {
      this.dd = value;
      this.show2 = false;
      this.index2 = index;
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
            that.avatar = (res.data.result);
            that.$toast.clear()
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
    },
  },
  created () {
    this.getList();
  },
  watch: {
    cate (val) {
      var arr = this.info;
      for (var i in arr) {
        if (val == arr[i].title) {
          this.item = arr[i];
          this.picker1 = arr[i].dd;
          this.picker2 = arr[i].zt;
          this.create = arr[i].create;
          this.condition = arr[i].condition;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.cell .van-cell__title {
  flex: 3;
}
.pic_title {
  line-height: 1;
  color: #969799;
  padding-bottom: 4px;
}
.con_team {
  height: 100%;
  width: 100%;
  overflow: auto;
  position: absolute;
}
.adteam {
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
    .input_cells {
      padding: 0.26667rem 0rem;
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
    margin-top: 10px;
  }
  p.foot_p {
    color: #ff9251;
    padding: 8px 0 24px 23px;
    font-size: 12px;
  }
}
</style>
