<template>
  <div class="dz_menu">
    <div class="avatar" @click="$router.push('/setting/myinfo')">
      <div class="dz_wrapper">
        <img
          :src="
            $fnc.getImgUrl(info.avatar, 'sex') ||
            (info.sex == 2
              ? require('../../assets/img/member/sex2.png')
              : require('../../assets/img/member/sex1.png'))
          "
          alt
          class="bo_xhy_img3"
        />
        <div class="name" v-if="user">
          <div class="dz_name">{{ info.nickname || '小施主' }}</div>
          <div class="dz_name">{{ info.username }}</div>
        </div>
        <div class="name" @click="$router.replace({ path: '/login' })" style="justify-content: center;" v-else>
          <div class="dz_name">点击登陆</div>
        </div>
      </div>
      <van-icon size="30" name="arrow"></van-icon>
    </div>
    <div class="iconlist">
      <div class="content1">
        <router-link to="/order/orderlist">
          <img
            class="left_img"
            src="../../assets/img/setting/dz_menu5.png"
            mode
          />
          <span>我的善缘</span>
        </router-link>
      </div>
      <van-divider />
      <div class="content1">
        <router-link to="/im/kf">
          <img
            class="left_img"
            src="../../assets/img/setting/dz_menu1.png"
            mode
          />
          <span>联系客服</span>
        </router-link>
      </div>
      <van-divider />
      <div class="content1" >
        <router-link to="/order/orderlist?status=待评价">
          <img
            class="left_img"
            src="../../assets/img/setting/dz_menu2.png"
            mode
          />
          <span>功德箱</span>
        </router-link>
      </div>
      <van-divider />
      <div class="content1">
        <router-link to="/dz/dz_search">
          <img
            class="left_img"
            src="../../assets/img/setting/dz_menu4.png"
            mode
          />
          <span>查看更多寺庙</span>
        </router-link>
      </div>
      <van-divider />
      <div class="content1">
        <router-link to="/page/sign">
          <img
            class="left_img"
            src="../../assets/img/setting/dz_menu3.png"
            mode
          />
          <span>每日一善</span>
        </router-link>
      </div>
       <van-divider />
       <div class="content1">
        <router-link to="/page/buddhistlamp/order">
          <img
            class="left_img"
            src="../../assets/img/setting/dz_menu3.png"
            mode
          />
          <span>供灯</span>
        </router-link>
      </div>
      <van-divider />
    </div>
    <div class="leftarrow" @click="$emit('close_menu')">
      <van-icon style="margin-right:5px" size="30" name="arrow-left"></van-icon>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
export default {
  name: "dzmenu",
  data() {
    return {
      info: this.$store.state.user,
    };
  },
  components: {},
  computed: {
    usernickname() {
      var nick = this.info.nickname;
      var username = this.info.username;
      if (nick) {
        if (nick.length > 6) {
          return nick.slice(0, 6) + "..." + "【" + username + "】";
        } else {
          return nick + "【" + username + "】";
        }
      } else {
        return username;
      }
    },
    user(){
      return Cookies.get("user") ? true : false;
    }
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="less" scoped>
/deep/.van-divider {
  margin: 10px 0;
}
.dz_menu {
  padding: 40px 10px 0px 15px;
  height: 100%;
  position: relative;
  background-image: url('../../assets/img/project/bg.png');
  background-size: cover;
  .avatar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .dz_wrapper {
      display: flex;
      img {
        border-radius: 50%;
        height: 60px;
        width: 60px;
      }
      .name {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .dz_name {
          font-size: 16px;
        }
      }
    }
  }
  .iconlist {
    margin: 30px 10px 10px 12px;
    img {
      width: 30px;
      height: 30px;
    }
    .content1 {
      font-size: 16px;
      display: flex;
      align-items: center;
      width: 100%;
      a{display: block;width: 100%;}
      span {
        margin-left: 5px;
      }
    }
  }
  .leftarrow {
    position: absolute;
    right: -20px;
    z-index: 100;
    top: 48%;
    background-color: #F2F4F4;
    height: 40px;
    width: 20px;
    border-radius:0 45px 45px 0; 
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
.left_img {
  width: 22px;
  height: 22px;
  position: relative;
  top: -2px;
 
  margin-right: 10px;
}
</style>