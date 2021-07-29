<template>
  <div
    style="position: relative"
    class="bgwrite"
    v-if="list && list.length > 0"
  >
    <div class="phone_menu1" id="phone_menu1" @scroll="onScroll">
      <div id="phone_menu1-box">
        <div class="phone_menu_body" v-for="(it, index) in list" :key="index">
          <div
            class="phone_menu_item"
            :style="{
              width: menuList.style ? 100 / menuList.style + '%' : '20%',
            }"
            v-for="(item, i) in toArr(it)"
            :key="i"
          >
            <div class="phone_menu_item_icon">
              <a @click.prevent="href_inspect(item.links)">
                <van-image :src="item.piclink" lazy-load class="img-box-vip">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                  <template v-slot:error>
                    <img src="@/assets/img/icon01.3ab45344.png" alt="" />
                  </template>
                </van-image>
              </a>
            </div>
            <p>{{ item.title }}</p>

            <img
              v-if="item.desc == 1"
              src="@/assets/img/home/1.gif"
              class="menu-icon-gif"
            />
            <img
              v-else-if="item.desc == 2"
              src="@/assets/img/home/2.gif"
              class="menu-icon-gif"
            />
            <img
              v-else-if="item.desc == 3"
              src="@/assets/img/home/3.gif"
              class="menu-icon-gif"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="phone_menu1-line"></div>
    <div
      class="line-act"
      :style="{ width: list.length + '0%' }"
      v-show="list.length > 1"
    >
      <div
        class="line-act-active"
        :style="{ left: activeWidth + '%', width: 100 / list.length + '%' }"
        id="line-act-active"
      ></div>
    </div>
  </div>
</template>

<script >
import { Image, Loading } from "vant";
export default {
  name: "phone_menu",
  props: ["menuList"],
  data() {
    return {
      leftWidth: 0,
      activeWidth: 0,
    };
  },
  components: {
    [Image.name]: Image,
    [Loading.name]: Loading,
  },
  computed: {
    list() {
      try {
        var arr = this.menuList.banner;
        var MenuNum = this.menuList.style == "0" ? 10 : this.menuList.style * 2;
        var arr1 = [];
        if (typeof arr == "object") {
          let len = arr.length;
          let n = MenuNum; //假设每行显示5个
          let lineNum = len % n === 0 ? len / n : Math.floor(len / n + 1);
          for (let i = 0; i < lineNum; i++) {
            // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
            let temp = arr.slice(i * n, i * n + n);
            arr1.push(temp);
          }
          return arr1;
        } else {
          return [];
        }
      } catch (error) {
        return [];
      }
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        var id1 = document.getElementById("phone_menu1-box"); //phone_menu1
        var width = document.getElementById("phone_menu1").clientWidth;
        id1.style.width = width * this.list.length + "px";
      }, 300);
    });
  },
  methods: {
    onScroll(e) {
      var scrollLeft = e.target.scrollLeft;
      this.leftWidth = e.target.scrollWidth;
      this.activeWidth = (scrollLeft / this.leftWidth) * 100;
    },
    toArr(arr) {
      if (typeof arr == "object") {
        return arr;
      } else {
        return [];
      }
    },
    href_inspect(val) {
      if (window.location.href.indexOf("jdxtx") >= 0 && !val) {
        // jdxtx air游需求若链接为空显示开发中
        this.$toast.fail("正在开发中");

        return;
      }
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
.phone_menu1-line {
  height: 4px;
  margin-top: -6px;
  background: #fff;
  position: relative;
  z-index: 11;
}
.bgwrite {
  width: 94%;
  margin: 0 auto;
  border-radius: 0.13333rem;
}
.img-box-vip {
  width: 40px;
  height: 40px;
}
.phone_menu1 {
  width: 100%;
  background-color: #fff;
  flex-wrap: nowrap;
  overflow-x: auto;
  // overflow-y: hidden;
  padding: 0.26667rem 0 0;
  margin: 0.26667rem auto 0 auto;
  border-radius: 0.13333rem;
  z-index: 10;
  position: relative;
  > div {
    width: 750px;
    display: flex;
  }
  .phone_menu_body {
    a {
      display: flex;
    }
  }
  .phone_menu_item {
    height: auto;
    position: relative;
  }
}
.line-act {
  position: absolute;
  bottom: 0px;
  left: 50%;
  width: 60px;
  height: 4px;
  margin: 0 auto;
  background: #ddd;
  border-radius: 27px;
  overflow: hidden;
  transform: translate3d(-50%, -50%, 0);
  z-index: 12;
  .line-act-active {
    background-color: #ffb309;
    position: absolute;
    width: 50%;
    height: 100%;
    border-radius: 27px;
  }
}
.menu-icon-gif {
  position: absolute;
  top: -10px;
  right: 10px;
  width: 26px;
}
</style>
