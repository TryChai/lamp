<template>
  <div class="personalinfor">
    <van-nav-bar
      :title="$h('我的资料')"
      left-text
      left-arrow
      class="navbar"
      @click-left="toBack"
    />
    <div style="display: none">
      <crop @callback="getUrl" ref="crop" />
    </div>

    <div class="container">
      <div class="title">
        <p>基本信息</p>
      </div>

      <div class="info_card">
        <van-cell title="头像" is-link @click="changeImg">
          <template #default>
            <img
              :src="
                $fnc.getImgUrl(avatar, 'sex') ||
                (info.sex == 2
                  ? require('@/assets/img/member/sex2.png')
                  : require('@/assets/img/member/sex1.png'))
              "
              width="46px"
              height="46px"
              style="border-radius: 50%"
            />
          </template>
        </van-cell>
        <van-cell
          title="昵称"
          is-link
          :value="nickname ? nickname : '设置个性昵称'"
          @click="show_nick = true"
        />
        <van-cell title="用户名" :value="$store.state.user.username" />
        <van-cell
          title="性别"
          is-link
          :value="sex == 2 ? '女' : '男'"
          @click="show_sex = true"
        />
        <van-cell
          title="邮箱"
          is-link
          :value="email ? email : '设置邮箱'"
          @click="show_email = true"
        />
        <!-- <van-cell title="微信二维码" is-link>
          <template #default>
            <van-uploader
              :after-read="afterRead"
              class="user-info-up"
              :max-count="1"
            >
              <img :src="$fnc.getImgUrl(wx_lx_ewm)" />
            </van-uploader>
          </template>
        </van-cell> -->
      </div>

      <!-- <div class="title">
        <p>其它认证信息</p>
      </div>

      <div class="realname">
        <van-cell
          center
          title="实名认证"
          value="去实名"
          label="海淘需要实名哦"
          is-link
          @click="$router.push('/setting/realname')"
        />
      </div>

      <div class="reminder" v-if="iden">
        <p>溫馨提示</p>
        <p>{{ $h(iden) }}</p>
      </div> -->
    </div>

    <van-dialog
      v-model="show_nick"
      title="编辑昵称"
      show-cancel-button
      @confirm="addDizhi"
    >
      <van-field
        @blur="windowScorll"
        v-model="nickname"
        type="text"
        placeholder="昵称最多六个字符"
        clearable
        :border="false"
        class="info_field"
      />
    </van-dialog>
        <van-dialog
      v-model="show_email"
      title="编辑邮箱"
      show-cancel-button
      @confirm="addDizhi"
    >
      <van-field
        @blur="windowScorll"
        v-model="email"
        type="text"
        placeholder="请输入邮箱"
        clearable
        :border="false"
        class="info_field"
      />
    </van-dialog>
    <van-action-sheet
      v-model="show_sex"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="show_sex = false"
      @select="changeSex"
    />
  </div>
</template>

<script>
import { Field, ActionSheet } from "vant";
import axios from "axios";
import crop from "@/components/currency/crop/crop.vue";
import { mapState } from "vuex";
import exif from "@/assets/js/exif.js";
export default {
  name: "myinfo",
  components: {
    [Field.name]: Field,
    [ActionSheet.name]: ActionSheet,
    crop,
  },
  data() {
    return {
      username: "",
      nickname: "",
      email:"",
      avatar: "",
      sex: "",
      loadModal: false,
      index: 0,
      imgList: [],
      ss: "ssa",
      iden: "",
      info: {
        sex: "",
      },
      show: false,
      fileList: [],
      wx_lx_ewm: "",
      show_nick: false,
      show_email: false,
      show_sex: false,
      actions: [
        { name: "男", val: 1 },
        { name: "女", val: 2 },
      ],
    };
  },
  methods: {
    changeSex(val) {
      this.sex = val.val;
      this.addDizhi();
    },
    changeImg() {
      this.$refs.crop.$el.lastElementChild.dispatchEvent(
        new MouseEvent("click")
      );
    },
    afterRead(file) {
      var that = this;
      exif.imageListConvert([file.file], function (res) {
        that.wx_lx_ewm = res;
        that.addDizhi();
      });
    },
    getUrl(newUrl) {
      let file = this.convertBase64UrlToBlob(newUrl);
      var that = this;
      var fd = new FormData();
      fd.append("file", file, "file_" + Date.parse(new Date()) + ".jpg");
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      axios.post("/api/common/upload/index/", fd, config).then((res) => {
        if (res.data.code == 200) {
          that.avatar = res.data.result;
          this.$toast.clear();
          this.addDizhi();
        } else {
          this.$toast.fail(res.data.result);
          this.$toast.clear();
        }
      });
    },
    callback(img) {
      this.$toast.loading({
        mask: false,
        message: "上传中...",
        duration: 0,
      });
      this.myUpload(img);
    },
    realTime(data) {
      this.previews = data;
    },
    chackSex(str) {
      this.sex = str;
    },
    myUpload(path) {
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

        let config = {
          headers: { "Content-Type": "multipart/form-data" },
        };

        axios.post("/api/common/upload/index/", fd, config).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            that.avatar = res.data.result;
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
    },
    onRead(file) {
      this.crooption.img = file.content;
    },
    addDizhi() {
      if (this.nickname.length > 6) {
        this.$toast("昵称最多六个中文");
        return false;
      }
      var params = {
        nickname: this.nickname,
        sex: this.sex,
        avatar: this.avatar || "",
        wx_lx_ewm: this.wx_lx_ewm,
        email:this.email,
      };
      this.$api.getSetting.setMyInfo(params).then((res) => {
        if (res.code == 200) {
          if (this.isSDKReady && this.isLogin) {
            this.$store.commit("updateUserInfo", {
              gender: params.sex,
              avatar: params.avatar,
              nickname: params.nickname,
              email:params.email,
            }); //修改Im资料
          }
          this.$toast.success(this.$h("保存成功"));
          setTimeout(() => {
            this.show_nick = false;
            this.show_email = false;
            this.$store.dispatch("getUser");
          }, 3000);
        }
      });
    },
  },
  created() {
    this.$api.getSetting.findMyInfoReward({ iden: "wcgrzl" }).then((res) => {
      if (res.code == 200) {
        this.iden = res.result;
      }
    });
    var info = this.$store.state.user;
    this.nickname = info.nickname || "";
    this.sex = info.sex;
    this.email =info.email;
    this.avatar = info.avatar;
    this.wx_lx_ewm = info.wx_lx_ewm;
    this.fileList.push({ url: info.wx_lx_ewm });
  },
  computed: {
    ...mapState({
      isSDKReady: (state) => state.imUser.isSDKReady,
      isLogin: (state) => state.imUser.isLogin,
    }),
  },
};
</script>
<style lang="less" scoped>
/deep/.van-dialog__header {
  padding: 16px 0 0;
}
.info_field {
  width: 92%;
  padding: 0 16px;
  margin: 10px auto 16px;
  height: 46px;
  border: 1px solid #f4f4f4;
  border-radius: 5px;
}
.user-info-up {
  img {
    width: 64px;
    height: 64px;
  }
}
.personalinfor {
  display: flex;
  flex-direction: column;
  height: 100%;

  .container {
    flex: 1;
    overflow: auto;
    background-color: #f8f8f8;
    padding: 0 14px;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      padding: 15px 0;
      > p:last-of-type {
        font-size: 12px;
        line-height: 13px;
        color: #eb0707;
      }
      > p:first-of-type {
        font-size: 15px;
        line-height: 16px;
        color: black;
      }
    }

    .info_card {
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 10px;
      /deep/.van-cell:first-of-type {
        align-items: center;
        padding-top: 12px;
        padding-bottom: 12px;
        .van-cell__value {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
      }
      /deep/.van-cell {
        padding-top: 15px;
        padding-bottom: 15px;
        .van-cell__title {
          font-size: 16px;
          font-weight: bold;
        }
        .van-cell__value {
          overflow: initial;
          font-size: 15px;
        }
      }
    }

    .realname {
      border-radius: 8px;
      overflow: hidden;
      /deep/.van-cell {
        /deep/.van-cell__title {
          > span {
            font-size: 16px;
            line-height: 16px;
            font-weight: bold;
          }
          .van-cell__label {
            margin-top: 0;
            font-size: 12px;
          }
        }
        .van-cell__value {
          font-size: 15px;
        }
      }
    }

    .reminder {
      margin-top: 20px;
      > p:first-of-type {
        font-size: 15px;
        line-height: 16px;
        color: black;
        font-weight: bold;
      }
      > p:last-of-type {
        margin-top: 10px;
        font-size: 13px;
        line-height: 15px;
        color: #999;
      }
    }
  }
}
</style>