<template>
  <div class :style="{ backgroundColor: background }">
    <div class="phone_part">
      <div class="phone_part_body" v-if="info.show == 1 && info.banner.length != 0" :style="info.text == 1 ? 'padding:0;':'padding:0 10px;'">
        <div class="phone_title" :style="info.text == 1 ? 'min-height:0;padding:0 10px;':'min-height:10px;'">
          <p v-if="info.title || info.title_en">
            {{ info.title }}
            <span>{{ info.title_en }}</span>
          </p>
        </div>

        <div class="phone_part_content" v-if="info.style == 0" :style="info.text == 1 ? 'padding-bottom: 10px;' : ''">
          <div class="phone_part_one_img" v-for="(item, i) in info.banner" :key="i" :class="info.text == 1 ? 'phone_part_one_img1' : ''">
            <a @click.prevent="href_inspect(item.links)">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>

        <div class="phone_part_content" v-else-if="info.style == 1" :style="info.text == 1 ? 'padding-bottom: 10px;' : ''">
          <div class="phone_part_two_img" v-for="(item, i) in info.banner" :key="i" :class="info.text == 1 ? 'phone_part_two_img1' : ''">
            <a @click.prevent="href_inspect(item.links)">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>
        <div class="phone_part_content" v-else-if="info.style == 2" :style="info.text == 1 ? 'padding-bottom: 10px;' : ''">
          <div class="phone_part_three_img" v-for="(item, i) in info.banner" :key="i" :class="info.text == 1 ? 'phone_part_three_img1' : ''">
            <a @click.prevent="href_inspect(item.links)">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>
        <div class="phone_part_content" v-else-if="info.style == 6" :style="info.text == 1 ? 'padding-bottom: 10px;' : ''">
          <div class="phone_part_six1_img" v-for="(item, i) in info.banner" :key="i" :class="info.text == 1 ? 'phone_part_six1_img1' : ''">
            <a @click.prevent="href_inspect(item.links)">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>
        <div class="phone_part_content" v-else-if="info.style == 3" :style="info.text == 1 ? 'padding-bottom: 10px;' : ''">
          <div class="phone_part_four_img" v-for="(item, i) in info.banner" :key="i" :class="info.text == 1 ? 'phone_part_four_img1' : ''">
            <a @click.prevent="href_inspect(item.links)" style="display: block">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>
        <div class="phone_part_content" v-else-if="info.style == 4" :style="info.text == 1 ? 'padding-bottom: 10px;' : ''">
          <div class="phone_part_five_img" v-for="(item, i) in info.banner" :key="i" :class="info.text == 1 ? 'phone_part_five_img1' : ''">
            <a @click.prevent="href_inspect(item.links)" style="display: block">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>

        <div class="phone_part_content" v-else-if="info.style == 5" :style="info.text == 1 ? 'padding-bottom: 10px;' : ''">
          <div class="phone_part_six_img" v-for="(item, i) in info.banner" :key="i" :class="info.text == 1 ? 'phone_part_six_img1' : ''">
            <a @click.prevent="href_inspect(item.links)" style="display: block">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>

        <div class="phone_part_content" v-else-if="info.style == 7">
          <van-swipe :autoplay="5000" class="modulecarousel" :show-indicators="false">
            <van-swipe-item v-for="(item, index) in info.banner" :key="index">
              <a @click.prevent="href_inspect(item.links)" style="width: 100%; display: block">
                <van-image :src="item.piclink" ref="image" @load="imageload" lazy-load>
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </a>
            </van-swipe-item>
          </van-swipe>
        </div>

        <div class="phone_part_content" v-else-if="info.style ==8" :style="info.text == 1 ? '' : 'padding-bottom: 10px;'">
          <div v-for="(item, i) in info.banner" :key="i" :class="info.text == 1 ? 'new_phone_part_eight_img_no_border' : 'phone_part_eight_img'">
            <a @click.prevent="href_inspect(item.links)" style="display: block">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { Image, Loading, Field, Swipe, SwipeItem } from "vant";
export default {
  name: "",
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          banner: [],
        };
      },
    },
    background: {
      type: String,
      default: "transparent",
    },
  },
  data () {
    return {
      bannerHeight: "",
    };
  },
  components: {
    [Image.name]: Image,
    [Loading.name]: Loading,
    [Field.name]: Field,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  created () { },
  mounted () { },
  methods: {
    imageload () {
      if (this.$refs.image[0]) {
        this.bannerHeight = this.$refs.image[0].height;
      }
    },
    href_inspect (val) {
      if (val == "/plugin/turntable") {
        this.$store.commit("set_turnshow", true);
        return;
      }
      this.$fnc.goLink(val);
    },
  },
};
</script>
<style lang='less' scoped>
.phone_part {
  width: 100%;
  background-color: transparent;
  margin: 10px 0 0px;
  position: relative;
}
.phone_part_body {
  width: 94%;
  margin: 0 auto;
  background-color: white;
  // padding: 0 10px;
  border-radius: 10px;
}

.phone_title {
  min-height: 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-banners: center;
}
.phone_title_not {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-banners: center;
}
.phone_title_exit {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-banners: center;
  height: 50px;
}
.phone_title p {
  font-size: 18px;
  color: #2f2f2f;
  font-weight: bold;
  padding: 5px 0;
}
.phone_title span {
  font-size: 12px;
  color: #d4d4d4;
  font-weight: 400;
}
.phone_part_content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-banners: center;
  // padding: 10px 0;
}
.phone_part_one_img {
  width: 100%;
  padding-bottom: 10px;
}
.phone_part_one_img a {
  display: block;
  text-align: center;
  line-height: 1;
  font-size: 14px;
}

.phone_part_one_img1 a > div {
  display: block;
}
.phone_part_one_img1 {
  padding-bottom: 0;
}

.phone_part_two_content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-banners: center;
}

.phone_part_two_img {
  width: 49%;
  padding-bottom: 10px;
}
.phone_part_two_img a {
  display: block;
  text-align: center;
}
.phone_part_two_img a > div {
  display: block;
}
.phone_part_two_img img {
  width: 100%;
  border-radius: 8px;
}

.phone_part_two_img1 {
  width: 50%;
  padding-bottom: 0;
}

.phone_part_three_content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-banners: center;
}
.phone_part_three_img {
  width: 32%;
  padding-bottom: 10px;
}
.phone_part_three_img a,
.phone_part_six1_img a {
  display: block;
  text-align: center;
}
.phone_part_three_img a > div,
.phone_part_six1_img a > div {
  display: block;
}
.phone_part_three_img img,
.phone_part_six1_img img {
  width: 100%;
  border-radius: 8px;
}

.phone_part_three_img1 {
  width: 33.3%;
  padding-bottom: 0;
}
.phone_part_six1_img {
  width: 24%;
  padding-bottom: 10px;
}
.phone_part_six1_img1 {
  width: 25%;
  padding-bottom: 0;
}
.phone_part_four_img:nth-of-type(3n + 1) {
  width: 100%;
  border-radius: 8px;
  padding: 3px 0 8px 0;
}

.phone_part_four_img:nth-of-type(3n + 2),
.phone_part_four_img:nth-of-type(3n + 3) {
  width: 49%;
  border-radius: 8px;
  padding: 0 3px 8px 0;
}
.phone_part_four_img img {
  width: 100%;
  border-radius: 8px;
}
.phone_part_four_img > a > div {
  display: block;
}

.phone_part_four_img1:nth-of-type(3n + 1) {
  width: 100%;
  border-radius: 0;
  padding: 0;
}
.phone_part_four_img1:nth-of-type(3n + 2),
.phone_part_four_img1:nth-of-type(3n + 3) {
  width: 50%;
  border-radius: 0;
  padding: 0;
}
// phone_part_five_img

.phone_part_five_img:nth-of-type(4n + 1) {
  width: 100%;
  border-radius: 8px;
  padding: 5px 0;
}
.phone_part_five_img:last-of-type {
  padding-bottom: 10px !important;
}
.phone_part_five_img:nth-of-type(4n + 2),
.phone_part_five_img:nth-of-type(4n + 3),
.phone_part_five_img:nth-of-type(4n + 4) {
  width: 32%;
  border-radius: 8px;
  padding: 5px 0;
}
.phone_part_five_img img {
  width: 100%;
  border-radius: 8px;
  display: block;
}
.phone_part_five_img > a > div {
  display: block;
}

.phone_part_five_img1:nth-of-type(4n + 1) {
  width: 100%;
  border-radius: 0;
  padding: 0;
}
.phone_part_five_img1:last-of-type {
  padding-bottom: 0 !important;
}
.phone_part_five_img1:nth-of-type(4n + 2),
.phone_part_five_img1:nth-of-type(4n + 3),
.phone_part_five_img1:nth-of-type(4n + 4) {
  width: 33.33%;
  border-radius: 0;
  padding: 0;
}

// phone_part_six_img

.phone_part_six_img:nth-of-type(5n + 1),
.phone_part_six_img:nth-of-type(5n + 2) {
  width: 48%;
  border-radius: 8px;
  padding: 5px 0;
}

.phone_part_six_img:nth-of-type(5n + 3),
.phone_part_six_img:nth-of-type(5n + 4),
.phone_part_six_img:nth-of-type(5n + 5) {
  width: 32%;
  border-radius: 8px;
  padding: 5px 0;
}
.phone_part_six_img img {
  width: 100%;
  border-radius: 8px;
  display: block;
}
.phone_part_six_img > a > div {
  display: block;
}

.phone_part_six_img1:nth-of-type(5n + 1),
.phone_part_six_img1:nth-of-type(5n + 2) {
  width: 50%;
  border-radius: 0;
  padding: 0;
}

.phone_part_six_img1:nth-of-type(5n + 3),
.phone_part_six_img1:nth-of-type(5n + 4),
.phone_part_six_img1:nth-of-type(5n + 5) {
  width: 33.33%;
  border-radius: 0;
  padding: 0;
}

.phone_part_five_content {
  display: flex;
  justify-content: space-between;
  align-banners: center;
  height: 300px;
}
.phone_part_five_left {
  width: 49%;
  height: 100%;
  border-radius: 8px;
}
.phone_part_five_left_img {
  width: 100%;
  height: 100%;
  padding: 5px 0;
}
.phone_part_five_right {
  width: 49%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-banners: center;
}
.phone_part_five_right_img {
  width: 100%;
  height: 50%;
  padding: 5px 0;
}
.phone_part_five_left_img img,
.phone_part_five_right_img img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
.modulecarousel {
  width: 100%;
  padding: 10px 0;
  // height: 400px;
}

.modulecarousel .van-image,
.modulecarousel img,
.modulecarousel a {
  width: 100%;
  height: 100%;
}

.phone_part_content .phone_part_eight_img:nth-of-type(5n + 1) {
  width: 100%;
  display: flex;
  justify-content: center;
}
.phone_part_content .phone_part_eight_img:nth-of-type(5n + 2),
.phone_part_content .phone_part_eight_img:nth-of-type(5n + 3),
.phone_part_content .phone_part_eight_img:nth-of-type(5n + 4),
.phone_part_content .phone_part_eight_img:nth-of-type(5n + 5) {
  width: 48%;
  height: auto;
  display: flex;
  justify-content: center;
}
.phone_part_content .new_phone_part_eight_img_no_border:nth-of-type(5n + 1) {
  width: 100%;
  display: flex;
  justify-content: center;
}
.phone_part_content .new_phone_part_eight_img_no_border a {
  display: flex !important;
  width: 100%;
  .van-image {
    width: 100%;
  }
}
.phone_part_content .new_phone_part_eight_img_no_border:nth-of-type(5n + 2),
.phone_part_content .new_phone_part_eight_img_no_border:nth-of-type(5n + 3),
.phone_part_content .new_phone_part_eight_img_no_border:nth-of-type(5n + 4),
.phone_part_content .new_phone_part_eight_img_no_border:nth-of-type(5n + 5) {
  width: 50%;
  height: auto;
  display: flex;
  justify-content: center;
}
</style>
