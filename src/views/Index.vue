<template>
  <div class="container">
    <div class="star_liu comet starss" id="star_"></div>
    <div id="container"></div>
    <div class="star_con">
      <div class="star padding_top48">
        <div class>
          <img class="star_head_fc" src="../assets/img/star/fc.png" mode>
        </div>
        <div class="star_head_info">{{$store.state.config.shop.coin_title}} COIN</div>
        <div style="margin-right: -10px;">
          <!-- <image class="star_head_fc" src="../..../assets/img/star/jb.png" mode=""></image> -->
          <img class="star_head_fc" src="../assets/img/star/nz.png" mode>
        </div>
      </div>
      <div class="star star_con_title padding_top48">
        <div>
          <router-link to="/star/stardetails">{{$store.state.config.shop.coin_title}} {{$h('用户指数')}}</router-link>
        </div>
        <div>{{$h('历史指数')}}</div>
      </div>
      <div class="star star_con_title star_conn">
        <div>
          <div class="star_all">
            <router-link to="/star/stardetails">
              <img class="star_icon" src="../assets/img/star/yuan1.png" mode>
              <span class="star_sum">{{$fnc.toFixedZ(info.price[0],2)}}</span>
            </router-link>
          </div>
          <div>{{$h('星球公民ID')}}</div>
          <div class="star_id_info">
            <img class="hg" src="../assets/img/star/hg.png" mode>
            <span class="star_id">ID:{{info.username || '----'}}</span>
          </div>
          <div class="padding_top48 star_con_title">{{$h('直属区块')}}</div>
          <div class>
            <div class="d">D</div>
            <span class="star_con_title size_13">{{info.left}}</span>
          </div>
          <div class="padding_top48 star_con_title">{{$h('全网区块')}}</div>
          <div class>
            <div class="d">D</div>
            <span class="star_con_title size_13">{{info.right}}</span>
          </div>
          <div class="gj">CHINA</div>
          <div>
            <img class="gq" src="../assets/img/star/gq.png">
          </div>
        </div>
        <div class="tr">
          <div
            class="firte_span"
            v-for="(item,i) in info.price"
            :key="i+Math.random()"
            v-show="i>0 && info.price[0]"
          >
            <span class="tetx_color size_12">{{$fnc.toFixedZ(item,2)}}</span>
            <div class="lx">
              <div :class="[i==1?'grey':(i==2?'lv' : 'ln')]"></div>
            </div>
          </div>
          <div class="padding_top48 star_con_title">{{$h('已有星球节点')}}</div>
          <div v-for="i in starMyNum" :key="i+Math.random()">
            <router-link to="/star/stardetails">
              <img class="img_56" src="../assets/img/star/fc2.png" mode>
            </router-link>
          </div>
          <div v-for="i in starNum" :key="i+Math.random()">
            <img class="img_56" src="../assets/img/star/fc3.png" mode>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="star_btn_div">
        <router-link to="/star/mystar">
          <div class="star_btn tc">{{$h('申请成为星球公民')}}</div>
        </router-link>
      </div>
      <!-- <div class="star_footer star tc">
        <div class>
          <router-link to="/star/mystar">
            <img class="footer_img" src="../assets/img/star/fx.png" mode>
            <div class="footer_span">发现星球</div>
          </router-link>
        </div>
        <div>
          <router-link to="/im/imindex">
            <img class="footer_img" src="../assets/img/star/sq.png" mode>
            <div class="footer_span">星球社群</div>
          </router-link>
        </div>
        <div>
          <router-link to="/star/starjyzx">
            <img class="footer_img" src="../assets/img/star/sc.png" mode>
            <div class="footer_span">星球市场</div>
          </router-link>
        </div>
        <div>
          <router-link to="/member/member">
            <img class="footer_img" src="../assets/img/star/wd.png" mode>
            <div class="footer_span">我的基地</div>
          </router-link>
        </div>
      </div> -->
    </div>
    <div class="star_bg">
      <div id="apps">
        <div
          data-v-910cc9f4
          class="swiper-container swiper-container-vertical swiper-container-autoheight"
        >
          <div
            data-v-910cc9f4
            class="info"
            data-swiper-parallax="-16.5%"
            data-swiper-parallax-duration="300"
            style="margin-top: -50px; transform: translate3d(0px, 0%, 0px);"
          >
            <canvas width="750" height="1334" style="width: 375px; height: 667px;"></canvas>
          </div>

          <div
            data-v-910cc9f4
            class="starwrap"
            data-swiper-parallax="-20%"
            style="height: 1334px; transform: translate3d(0px, 0%, 0px);"
          >
            <div
              class="star-item"
              style="top: -1rem; right: -2rem; width: 0.87992rem; height: 0.0155128rem; animation: 20s ease-in 0s 1 normal none running move;"
            ></div>
            <div
              class="star-item"
              style="top: 0rem; right: -3rem; width: 0.87065rem; height: 0.0182581rem; animation: 17s ease-in 0s 1 normal none running move;"
            ></div>
            <div
              class="star-item"
              style="top: -1rem; right: -2rem; width: 0.701463rem; height: 0.0133333rem; animation: 12s ease-in 0s 1 normal none running move;"
            ></div>
            <div
              class="star-item"
              style="top: -1rem; right: -3rem; width: 0.992143rem; height: 0.0125264rem; animation: 17s ease-in 0s 1 normal none running move;"
            ></div>
            <div class="star-item"></div>
          </div>
          <div data-v-910cc9f4 class="swiper-wrapper" style="height: 667px;">
            <div
              data-v-4bdc4d31
              data-v-910cc9f4
              id="initiation"
              class="swiper-slide swiper-slide-active"
              style="height: 667px;"
            >
              <div data-v-4bdc4d31 class="sun"></div>
              <div data-v-4bdc4d31>
                <div data-v-4bdc4d31 class="Jupiter">
                  <div data-v-4bdc4d31 class="Jupiter-ball"></div>
                </div>
                <div data-v-4bdc4d31 class="Saturn">
                  <div data-v-4bdc4d31 class="Saturn-ball"></div>
                </div>
                <div data-v-4bdc4d31 class="Uranus">
                  <div data-v-4bdc4d31 class="Uranus-ball"></div>
                </div>
                <div data-v-4bdc4d31 class="Neptune">
                  <div data-v-4bdc4d31 class="Neptune-ball"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="mask"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  name: "index",
  components:{
  },
  data() {
    return {
      div: "",
      info: {
        price: []
      },
      starNum: 6,
      starMyNum: 0
    };
  },
  methods: {
    getInfo() {
      this.$api.getStar.getStarInfo({}).then(res => {
        if (res.code == 200) {
          this.info = res.result;
          this.starMyNum = Number(this.info.coin_number);
          this.starNum =
            Number(this.starNum - this.info.coin_number) <= 0
              ? []
              : this.starNum - this.info.coin_number;
        }
      });
    }
  },

  mounted() {
    // console.log(width,height)
    // drawstart.drawstart('#container',width,height-10,0x8f2d08,0xF5CF55);
  },
  created() {
    this.getInfo();
  }
};
</script>

<style scoped>
@import '../assets/css/indexani.css';
@import '../assets/css/appindex.css';
.star_bg{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 2;
}
.star_bg2{
  z-index: 1;
}
#container {
  height: 200px;
  background: #0d0d25;
}
.footer_span {
  color: #484747;
}
.star_conn {
  align-items: flex-start !important;
}
.padding_top48 {
  padding-top: 20px;
}
.img_40 {
  width: 20px;
  height: 20px;
}
.came {
  width: 30pxpx;
  height: 24px;
  margin-top: 10px;
}
.footer_img {
  width: 40px;
  height: 40px;
}
.img_56 {
  width: 28px;
  height: 28px;
  margin-top: 10px;
}
.fj {
  width: 28px;
  height: 14px;
  margin-top: 10px;
}
.mr_top28 {
  margin-top: 5px;
}
.star_icon {
  width: 32px;
  height: 27px;
  vertical-align: text-bottom;
}
.size_13 {
  font-size: 13px !important;
}
.size_12 {
  font-size: 12px !important;
}
.container {
  width: 100%;
  min-height: 100vh;
  /* background: url(../assets/img/star/star_bg.jpg) no-repeat center center; */
  /* background-size: 100% 100%; */
  position: relative;
}
#container {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}
.star {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.star_head_fc {
  width: 40px;
  height: 40px;
  vertical-align: middle;
}
.star_con {
  position: relative;
  z-index: 3;
  padding: 0px 19px;
  height: 100%;
}
.star_head_info {
  width: 140px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #82ccff;
  background: #5565d6;
  border-radius: 27px;
  font-size: 16px;
}
.star_con_title {
  font-size: 15px;
  color: #9e9e9e;
}
.star_con_title a {
  font-size: 15px;
  color: #9e9e9e;
}
.star_all {
  height: 36px;
  line-height: 36px;
  margin-bottom: 15px;
}
.star_sum {
  font-size: 27px;
  font-weight: bold;
  color: #c48107;
}
.hg {
  width: 20px;
  height: 13px;
}
.star_id_info {
  padding-top: 4px;
}
.star_id {
  color: #a2dbcb;
  font-size: 13px;
  padding-left: 7px;
}
.d {
  display: inline-block;
  margin-right: 5px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #565a6e;
  background: url(../assets/img/star/d.png) no-repeat center center;
  background-size: 100%;
}
.gj {
  margin-top: 20px;
  padding: 10px 0;
  color: #75716d;
  font-size: 10px;
}
.gq {
  width: 32px;
  height: 21px;
  border-radius: 2px;
}
.lx {
  width: 10px;
  height: 10px;
  display: inline-block;
  padding: 2px;
  background: #fff;
  transform: rotate(45deg);
  vertical-align: middle;
  margin-left: 7px;
}
.lx > view {
  width: 9px;
  height: 9px;
}
.grey {
  background: #7b7c82;
}
.lv {
  background: #446a43;
}
.ln {
  background: #40666e;
}
.tetx_color {
  color: #787878;
}
.tetx_color1 {
  color: #575757;
}
.star_btn_view {
  margin-top: 5px;
  text-align: center;
}
.star_btn {
  margin: 0px auto 0 auto;
  width: 140px;
  height: 30px;
  line-height: 30px;
  border-radius: 27px;
  background: #222949;
  border: 1px solid #777f9d;
  color: #828cb5;
  font-size: 14px;
}
.star_footer {
  padding: 40px 0 0 0;
  color: #484747;
  font-size: 10px;
}
.footer_text {
  font-size: 13px;
}
.firte_text {
  margin-top: 7px;
}
.footer {
  width: 100%;
  position: absolute;
  bottom: 76px;
  padding: 0 30px;
  z-index: 16;
}
</style>
