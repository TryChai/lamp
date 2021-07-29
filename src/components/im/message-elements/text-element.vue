<template>
  <div class="text-element-wrapper">
    <div class="text-element">
      <template v-for="(item, index) in contentList">
        <span :key="index" v-if="item.name === 'text'" v-html="item.text"></span>
        <img v-else-if="item.name === 'emojiImg'" :src="item.src" width="80px" height="80px" :key="index" />
        <img v-else-if="item.name === 'img'" :src="item.src" width="20px" height="20px" :key="index" />
      </template>
    </div>
  </div>
</template>

<script>
import { decodeText } from '../../../utils/decodeText'

export default {
  name: 'TextElement',
  props: {
    payload: {
      type: Object,
      required: true
    },
    isMine: {
      type: Boolean
    }
  },
  created () {
    String.prototype.myReplace = function (f, e) {//吧f替换成e
      var reg = new RegExp(f, "g"); //创建正则RegExp对象   
      return this.replace(reg, e);
    }
  },
  computed: {
    contentList () {
      var arr = decodeText(this.payload);
      arr.forEach((item, i) => {
        if (item.name === 'text') {
          console.log(item.text)
          item.text = item.text.myReplace("\n", "</br>");
          item.text = item.text.myReplace("\r\n", "</br>");
          item.text = item.text.myReplace("\\\\n", "</br>");
        }
      })
      return arr
    }
  },
  methods: {

  },

}
</script>

<style lang="less" scoped>
.text-element-wrapper {
  position: relative;
  max-width: 300px;
  /* border: 1px solid rgb(235, 235, 235); */
  border-radius: 3px;
  word-wrap: break-word;
  word-break: break-all;
}
.text-element {
  /* padding: 6px; */
  span {
    display: flex;
    text-align: left;
  }
}
.element-received {
  background-color: #fff;
}
.element-send {
  background: rgb(5, 185, 240);
}
</style>
