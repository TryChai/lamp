<template>
  <div>
    <van-popup v-model="is_show" :cl="is_show" transition='fade'
        v-if="announceList.is_announcement.value==1 &&announceList.announcement_types && announceList.announcement_types.value == '文字'"
        @close="close_announ">
      <div class="popup_box">
        <div class="popup_box_bj">
          <img src="./../../assets/img/home/announ_bg.png" alt="">
        </div>
        <div class="popup_box_item">
          <div class="popup_box_top">
            <p>{{announceList.announcement_title.value}}</p>
          </div>
          <div class="popup_box_content">
            <p>{{announceList.announcement_content.value}}</p>
          </div>
        </div>
        <div class="popup_box_went"
            v-if="announceList.announcement_url.value != undefined && announceList.announcement_url.value != null && announceList.announcement_url.value !=''">
          <a :href="announceList.announcement_url.value">跳转链接去看看</a>
        </div>

        <div class="popup_box_close">
          <img src="./../../assets/img/home/announ_close.png" alt="" @click="close_btn">
        </div>

      </div>
    </van-popup>
    <!-- <van-popup v-model="is_show"
            @close="close_announ"
            
            transition='fade'
            class="img-announ"
            v-else-if="announceList.is_announcement.value==1">
            <div>
                <a :href="announceList.announcement_url.value">
                    <img :src="announceList.announcement_piclink.value"
                        alt="">
                </a>
                <img src="./../../assets/img/home/announ_close.png"
                    alt=""
                    @click="close_btn">
            </div>

        </van-popup> -->

    <md-landscape v-show="announceList.is_announcement.value==1 && announceList.announcement_types.value=='图片'" @hide='close_announ' v-model="is_show"
        class="index-man-pop">

      <a :href="announceList.announcement_url.value"
          v-if="announceList.announcement_url.value != undefined && announceList.announcement_url.value != null && announceList.announcement_url.value !=''">
        <img :src="announceList.announcement_piclink.value" alt="">
      </a>
      <img v-else :src="announceList.announcement_piclink.value" alt="">
    </md-landscape>
  </div>
</template>

<script>
import { Landscape } from 'mand-mobile'
import Cookies from 'js-cookie';
export default {
  name: "announcement",
  components: {
    [Landscape.name]: Landscape
  },
  props: {
  },
  data () {
    return {
      showPIC: true,
      is_show: false,
      announceList: {
        announcement_content: { value: "" },
        announcement_types: { value: "" },
        announcement_title: { value: "" },
        announcement_url: { value: "" },
        announcement_piclink: { value: "" },
        is_announcement: { value: "" },
      },
    }
  },
  watch: {
    $route (to) {

      var foot = Cookies.get('foot') ? JSON.parse(Cookies.get('foot')) : { links: '' };
      var user = Cookies.get('user') ? true : false;
      var is_announ = JSON.parse(sessionStorage.getItem("is_announ"))
      if ((to.path == '/' || to.path == '/index' || foot.links.indexOf(to.path) >= 0) && user) {
        if (is_announ || is_announ == undefined) {
          this.getannounce();
        }
      }
    }
  },
  methods: {
    getannounce () {
      this.$api.getPage.getannounce({}).then(res => {
        if (res.code == 200) {
          this.announceList = res.result;

        }
        if (res.code == 200 && res.result.is_announcement.value == 1) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.is_show = JSON.parse(sessionStorage.getItem("is_announ"));
            }, 1500)
          })
        }
      })
    },
    close_announ () {
      sessionStorage.setItem('is_announ', JSON.stringify(false))
      this.is_show = false;
    },
    close_btn () {
      sessionStorage.setItem('is_announ', JSON.stringify(false))
      this.is_show = false;
    }
  },
  created () {
  }
}
</script>

<style scoped lang='less'>
.img-announ > div > a > img {
  width: 100%;
  margin-top: 80px;
}
.img-announ {
  > div {
    position: relative;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    > img {
      width: 30px;
      // height: 100px;
      // position: absolute;
      margin: 0 auto;
      bottom: 0px;
      right: 10px;
      // background: rgba(0, 0, 0, 0.8);
      z-index: 2;
    }
  }
}

.popup_box_img {
  width: 100% !important;
  height: 100%;
  background-color: transparent !important;
}
.van-popup {
  overflow-y: inherit;
  border-radius: 10px;
}
.popup_box {
  width: 260px;
  min-height: 300px;
  background-color: #ffffff;
  position: relative;
  border-radius: 15px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-content: center;
}
/*.popup_box p{*/
/*    font-size: 12px;*/
/*    color: #5a5a5a;*/
/*}*/
.img-announ {
  width: 80% !important;
  height: 100%;
  background-color: transparent !important;
}
.popup_box_bj {
  width: 100%;
  position: absolute;
  top: -25px;
  z-index: 1;
}
.popup_box_bj img {
  width: 100%;
}
.popup_box_item {
  z-index: 15;
}
.popup_box_top {
  font-size: 20px;
  color: #ffffff;
  font-weight: bold;
  height: 100px;
  display: flex;
  flex-flow: column;
  align-content: center;
  justify-content: flex-start;
  padding-left: 10px;
  padding-top: 10px;
}
.popup_box_top p:nth-of-type(2) {
  font-size: 16px;
}
.popup_box_content {
  width: 80%;
  margin: 0 auto;
  font-size: 14px;
  color: #5a5a5a;
  z-index: 15;
  min-height: 200px;
  padding-top: 10px;
}
.popup_box_went {
  height: 35px;
  display: flex;
  justify-content: center;
  align-content: center;
  border-top: 1px solid #eeeeee;
}
.popup_box_went a {
  font-size: 14px;
  color: #3186fe;
  line-height: 35px;
}
.popup_box_close {
  width: 30px;
  height: 100px;
  position: absolute;
  bottom: -100px;
  right: 10px;

  z-index: 2;
}
.popup_box_close img {
  width: 100%;
  position: relative;
  z-index: 1;
}
</style>
