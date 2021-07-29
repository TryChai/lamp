<template>
  <div>
    <van-tabs v-model="active">
      <van-tab>
        <div slot="title">
          <div class="tc tdgl_nav_li f_l">
            <img src="../../assets/img/im/li1.png" alt>
            <div>团队</div>
          </div>
        </div>
      </van-tab>
      <van-tab>
        <div slot="title">
          <div class="tc tdgl_nav_li f_l">
          <img src="../../assets/img/im/li2.png" alt>
          <div>消息</div>
        </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import top from "@/components/im/top.vue";

export default {
  name: "im",
  data() {
    return {active:""};
  },
  components: {
    top
  }
};
</script>

<style scoped>
.tdgl_top {
  width: 100%;
  height: 88px;
  line-height: 88px;
  color: #000;
  position: relative;
  font-size: 34px;
  background-color: #fff;
}
.tdgl_top > i {
  position: absolute;
  height: 32px;
  top: 28px;
  left: 34px;
}
.tdgl_top > i > img {
  width: 18px;
  height: 32px;
  float: left;
}
.tdgl_nav {
  height: 172px;
  width: 100%;
  border-bottom: solid 2px #e0e0e0;
  background-color: #fff;
}
.tdgl_nav_li {
  width: 20%;
  padding-top: 20px;
}
.tdgl_nav_li > img {
  width: 88px;
  height: 88px;
}
.tdgl_nav_li > div {
  color: #4c4c4c;
  font-size: 24px;
  height: 24px;
  line-height: 24px;
}
</style>
