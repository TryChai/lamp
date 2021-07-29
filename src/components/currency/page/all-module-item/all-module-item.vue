<template>
  <div class :style="{backgroundColor:background}">
    <div class="phone_part" v-for="(Item,y) in partList" :key="y">
      <div class="phone_part_body" v-if="Item.is_show == 1 && Item.length != 0">
        <div class="phone_title" v-if="Item.title || Item.title_en">
          <p>
            {{Item.title}}
            <span>{{Item.title_en}}</span>
          </p>
        </div>
        <div class="phone_part_content" v-if="Item.style == 0">
          <div class="phone_part_one_img" v-for="(item,i) in Item.banner" :key="i">
            <a @click.prevent="href_inspect(item.links)">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>
        <div class="phone_part_content" v-else-if="Item.style == 1">
          <div class="phone_part_two_img" v-for="(item,i) in Item.banner" :key="i">
            <a @click.prevent="href_inspect(item.links)">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>
        <div class="phone_part_content" v-else-if="Item.style == 2">
          <div class="phone_part_three_img" v-for="(item,i) in Item.banner" :key="i">
            <a @click.prevent="href_inspect(item.links)">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>
        <div class="phone_part_content" v-else-if="Item.style == 6">
          <div class="phone_part_six1_img" v-for="(item,i) in Item.banner" :key="i">
            <a @click.prevent="href_inspect(item.links)">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>
        <div class="phone_part_content" v-else-if="Item.style == 3">
          <div class="phone_part_four_img" v-for="(item,i) in Item.banner" :key="i">
            <a @click.prevent="href_inspect(item.links)" style="display:block">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>
        <div class="phone_part_content" v-else-if="Item.style == 4">
          <div class="phone_part_five_img" v-for="(item,i) in Item.banner" :key="i">
            <a @click.prevent="href_inspect(item.links)" style="display:block">
              <van-image :src="item.piclink" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </a>
          </div>
        </div>

        <div class="phone_part_content" v-else-if="Item.style == 5">
          <div class="phone_part_six_img" v-for="(item,i) in Item.banner" :key="i">
            <a @click.prevent="href_inspect(item.links)" style="display:block">
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
import { Skeleton, Image, Loading, Field } from "vant";
export default {
  name: "",
  props: {
    partList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    background: {
      type: String,
      default: "transparent"
    }
  },
  data () {
    return {};
  },
  components: {
    [Skeleton.name]: Skeleton,
    [Image.name]: Image,
    [Loading.name]: Loading,
    [Field.name]: Field
  },
  created () { },
  mounted () { },
  methods: {
    href_inspect (val) {
      if (val == "/plugin/turntable") {
        this.$store.commit("set_turnshow", true);
        return;
      }
      this.$fnc.goLink(val);

    }
  }
};
</script>
<style lang='less' scoped>
.phone_part {
  width: 100%;
  background-color: white;
  margin: 10px 0 0px;
  position: relative;
}
.phone_part_body {
  width: 94%;
  margin: 0 auto;
}

.phone_title {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.phone_title_not {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.phone_title_exit {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
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
  align-items: center;
  padding: 10px 0 ;
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

.phone_part_two_content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
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
.phone_part_three_content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
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
.phone_part_six1_img > div {
  display: block;
}
.phone_part_three_img img,
.phone_part_six1_img img {
  width: 100%;
  border-radius: 8px;
}
.phone_part_six1_img {
  width: 24%;
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
// phone_part_five_img

.phone_part_five_img:nth-of-type(4n + 1) {
  width: 100%;
  border-radius: 8px;
  padding: 5px 0;
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

.phone_part_five_content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  align-items: center;
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
</style>
