<template>
  <div
    class="phone_top_img"
    :style="{
      background:
        page.background == ''
          ? '#f4f4f4'
          : 'url(' +
            page.background +
            ') no-repeat center top/100%  ' +
            `${
              carouseldata.show == 1 &&
              (carouseldata.style == 1 ||
                (carouseldata.style == 0 &&
                  carouseldata.banner &&
                  carouseldata.banner.length != 0))
                ? '75%'
                : '100%'
            }`,
    }"
  >
    <div class="" v-if="page.is_search == 0" style="height: 10px"></div>
    <div class="phone_top_search" v-else-if="headerdata.style == 0">
      <div
        class="phone_top_search_left"
        @click="$fnc.goLink(lefticon.links)"
        style="align-items: center"
        v-if="JSON.stringify(lefticon) != '{}'"
      >
        <van-icon
          :name="lefticon.piclink || ''"
          size="20"
          :info="
            lefticon.links == '/shop/shopcard' && car_num != 0
              ? car_num
              : lefticon.links == '/im/kf' && kfUnreadCount > 0
              ? kfUnreadCount
              : ''
          "
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_i1'
              : 'phone_top_search_i2',
          ]"
        />
        <span
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_span1'
              : 'phone_top_search_span2',
          ]"
          >{{ lefticon.title }}</span
        >
      </div>
      <div
        class="phone_top_search_middle"
        @click="
          $fnc.goLink(page.search == '' ? '/shop/shopsearch' : page.search)
        "
      >
        <van-icon
          name="search"
          class="phone_top_search_middle_icon"
          size="20"
        ></van-icon>
        <van-field
          input-align="left"
          style="background-color: transparent; padding: 0"
          v-model="search_input"
          readonly
          placeholder="输入您想搜索的关键词"
        />
      </div>
      <div
        class="phone_top_search_right"
        @click="$fnc.goLink(righticon.links)"
        style="align-items: center"
        v-if="JSON.stringify(righticon) != '{}'"
      >
        <van-icon
          :name="righticon.piclink || ''"
          size="21"
          :info="
            righticon.links == '/shop/shopcard' && car_num != 0
              ? car_num
              : righticon.links == '/im/kf' && kfUnreadCount > 0
              ? kfUnreadCount
              : ''
          "
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_i1'
              : 'phone_top_search_i2',
          ]"
        >
        </van-icon>
        <span
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_span1'
              : 'phone_top_search_span2',
          ]"
          >{{ righticon.title }}</span
        >
      </div>
    </div>
    <div class="phone_top_search" v-else-if="headerdata.style == 1">
      <div
        class="phone_top_search_left"
        @click="$fnc.goLink(lefticon.links)"
        style="align-items: flex-start; margin-right: 5px"
        v-if="JSON.stringify(lefticon) != '{}'"
      >
        <van-icon
          :name="lefticon.piclink || ''"
          size="20"
          :info="
            lefticon.links == '/shop/shopcard' && car_num != 0
              ? car_num
              : lefticon.links == '/im/kf' && kfUnreadCount > 0
              ? kfUnreadCount
              : ''
          "
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_i1'
              : 'phone_top_search_i2',
          ]"
        />
        <span
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_span1'
              : 'phone_top_search_span2',
          ]"
          >{{ lefticon.title }}</span
        >
      </div>
      <div
        class="phone_top_search_right"
        @click="$fnc.goLink(righticon.links)"
        style="align-items: center; margin-right: 5px"
        v-if="JSON.stringify(righticon) != '{}'"
      >
        <van-icon
          :name="righticon.piclink || ''"
          size="21"
          :info="
            righticon.links == '/shop/shopcard' && car_num != 0
              ? car_num
              : righticon.links == '/im/kf' && kfUnreadCount > 0
              ? kfUnreadCount
              : ''
          "
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_i1'
              : 'phone_top_search_i2',
          ]"
        >
        </van-icon>
        <span
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_span1'
              : 'phone_top_search_span2',
          ]"
          >{{ righticon.title }}</span
        >
      </div>
      <div
        class="phone_top_search_middle"
        @click="
          $fnc.goLink(page.search == '' ? '/shop/shopsearch' : page.search)
        "
      >
        <van-icon
          name="search"
          class="phone_top_search_middle_icon"
          size="20"
        ></van-icon>
        <van-field
          input-align="left"
          style="background-color: transparent; padding: 0"
          v-model="search_input"
          readonly
          placeholder="输入您想搜索的关键词"
        />
      </div>
    </div>
    <div class="phone_top_search" v-else-if="headerdata.style == 2">
      <div
        class="phone_top_search_middle"
        @click="
          $fnc.goLink(page.search == '' ? '/shop/shopsearch' : page.search)
        "
      >
        <van-icon
          name="search"
          class="phone_top_search_middle_icon"
          size="20"
        ></van-icon>
        <van-field
          input-align="left"
          style="background-color: transparent; padding: 0"
          v-model="search_input"
          readonly
          placeholder="输入您想搜索的关键词"
        />
      </div>
      <div
        class="phone_top_search_left"
        @click="$fnc.goLink(lefticon.links)"
        style="align-items: flex-start; margin-left: 10px"
        v-if="JSON.stringify(lefticon) != '{}'"
      >
        <van-icon
          :name="lefticon.piclink || ''"
          size="20"
          :info="
            lefticon.links == '/shop/shopcard' && car_num != 0
              ? car_num
              : lefticon.links == '/im/kf' && kfUnreadCount > 0
              ? kfUnreadCount
              : ''
          "
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_i1'
              : 'phone_top_search_i2',
          ]"
        />
        <span
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_span1'
              : 'phone_top_search_span2',
          ]"
          >{{ lefticon.title }}</span
        >
      </div>
      <div
        class="phone_top_search_right"
        @click="$fnc.goLink(righticon.links)"
        style="align-items: center; margin-left: 10px"
        v-if="JSON.stringify(righticon) != '{}'"
      >
        <van-icon
          :name="righticon.piclink || ''"
          size="21"
          :info="
            righticon.links == '/shop/shopcard' && car_num != 0
              ? car_num
              : righticon.links == '/im/kf' && kfUnreadCount > 0
              ? kfUnreadCount
              : ''
          "
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_i1'
              : 'phone_top_search_i2',
          ]"
        >
        </van-icon>
        <span
          :class="[
            headerdata.banner && headerdata.banner.length == 0
              ? 'phone_top_search_span1'
              : 'phone_top_search_span2',
          ]"
          >{{ righticon.title }}</span
        >
      </div>
    </div>
    <div
      class="phone_top_search"
      v-else-if="headerdata.style == 3"
      style="flex-wrap: wrap; margin-bottom: 5px; height: auto"
    >
      <div class="address_look">
        <nowaddress
          :showbtn="false"
          style="width: auto; margin-right: auto"
        ></nowaddress>
        <div
          class="phone_top_search_left"
          @click="$fnc.goLink(lefticon.links)"
          style="height: auto; align-items: flex-start; margin-left: 10px"
          v-if="JSON.stringify(lefticon) != '{}'"
        >
          <van-icon
            :name="lefticon.piclink || ''"
            size="20"
            :info="
              lefticon.links == '/shop/shopcard' && car_num != 0
                ? car_num
                : lefticon.links == '/im/kf' && kfUnreadCount > 0
                ? kfUnreadCount
                : ''
            "
            :class="[
              headerdata.banner && headerdata.banner.length == 0
                ? 'phone_top_search_i1'
                : 'phone_top_search_i2',
            ]"
          />
        </div>
        <div
          class="phone_top_search_right"
          @click="$fnc.goLink(righticon.links)"
          style="height: auto; align-items: center; margin-left: 10px"
          v-if="JSON.stringify(righticon) != '{}'"
        >
          <van-icon
            :name="righticon.piclink || ''"
            size="21"
            :info="
              righticon.links == '/shop/shopcard' && car_num != 0
                ? car_num
                : righticon.links == '/im/kf' && kfUnreadCount > 0
                ? kfUnreadCount
                : ''
            "
            :class="[
              headerdata.banner && headerdata.banner.length == 0
                ? 'phone_top_search_i1'
                : 'phone_top_search_i2',
            ]"
          >
          </van-icon>
        </div>
      </div>
      <div
        class="phone_top_search_middle"
        @click="
          $fnc.goLink(page.search == '' ? '/shop/shopsearch' : page.search)
        "
        style="margin: 0"
      >
        <van-icon
          name="search"
          class="phone_top_search_middle_icon"
          size="20"
        ></van-icon>
        <van-field
          input-align="left"
          style="background-color: transparent; padding: 0"
          v-model="search_input"
          readonly
          placeholder="输入您想搜索的关键词"
        />
      </div>
    </div>
    <div
      class="phone_top_word"
      v-if="searchList && searchList.length != 0 && page.is_show_cate == 1"
    >
      <van-tabs
        style="width: 100%; background-color: transparent"
        :border="false"
        :swipeable="true"
        :ine-height="0"
      >
        <van-tab v-for="(item, i) in searchList" :key="i">
          <div slot="title">
            <span
              class="search_span"
              @click="
                $router.push({
                  path: '/shop/shopsearch',
                  query: { cate_id: item.id },
                })
              "
              >{{ item.title }}</span
            >
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div
      style="width: 94%; margin: 0 auto"
      v-if="page.tuanzhang == 1 && $store.state.config.plugin.xxmk.is_open == 1"
    >
      <nowaddress></nowaddress>
    </div>
    <div
      class="carousel"
      v-if="
        carouseldata.show == 1 &&
        carouseldata.style == 0 &&
        carouseldata.banner &&
        carouseldata.banner.length > 0
      "
      :style="{
        'margin-top':
          searchList && searchList.length != 0 && page.is_show_cate == 1
            ? '0'
            : '3px',
      }"
    >
      <van-swipe
        class="swiImgs"
        style="width: 100%; height: 100%"
        :autoplay="3000"
        :show-indicators="false"
      >
        <van-swipe-item
          v-for="(item, index) in carouseldata.banner"
          :key="index"
          data-index="index"
          class="item"
        >
          <a
            @click.prevent="href_inspect(item.links)"
            style="
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 5px;
              overflow: hidden;
            "
          >
            <img v-lazy="item.piclink" :src="item.piclink" />
          </a>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div
      v-else-if="
        carouseldata.show == 1 &&
        carouseldata.style == 1 &&
        $store.state.config.plugin.hotel &&
        $store.state.config.plugin.hotel.is_open == 1
      "
    >
      <topHotel></topHotel>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import nowaddress from "@/components/page/vip/nowaddress";
import { Field } from "vant";
import topHotel from "@/components/page/vip/topHotel";
export default {
  components: {
    [Field.name]: Field,
    nowaddress,
    topHotel,
  },

  data() {
    return {
      search_input: "",
    };
  },
  props: {
    //轮播
    carouseldata: {
      type: Object,
      default: () => ({
        banner: [],
      }),
    },
    //头部图标
    headerdata: {
      type: Object,
      default: () => ({
        banner: [],
      }),
    },
    page: {
      type: Object,
      default: () => ({
        banner: [],
      }),
    },
  },
  computed: {
    lefticon() {
      try {
        return this.headerdata.banner[0];
      } catch (error) {
        return {};
      }
    },
    righticon() {
      try {
        return this.headerdata.banner[1];
      } catch (error) {
        return {};
      }
    },
    searchList() {
      try {
        return this.page.product_cate;
      } catch (error) {
        return [];
      }
    },
    ...mapState({
      car_num: (state) => state.car_num,
      conversationList: (state) => state.conversation.conversationList,
    }),

    kfUnreadCount() {
      var index = 0;
      for (var i in this.conversationList) {
        if (this.conversationList[i].conversationID.indexOf("admin") != -1) {
          index += this.conversationList[i].unreadCount;
        }
      }
      return index;
    },
  },
  watch: {},
  methods: {
    href_inspect(val) {
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
</style>