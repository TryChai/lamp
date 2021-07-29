<template>
  <div>
    <div class="tabbox">
      <div v-for="(item,i) in arr " :key="i" :class="[i >= 3 && i >=(arr.length - (arr.length % 3 == 0 ? 3 :( arr.length % 3))) ?'bottom':'']"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "component_name",
  data () {
    return {
      arr: [1, 2, 3],

    };
  },
  components: {
  },
  methods: {

  },
}
</script>
<style lang="less" scoped>
.tabbox {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  > div {
    width: 30%;
    height: 50px;
    background-color: pink;
    margin: 0 5px 10px 5px;
  }
  .bottom {
    border-bottom: 1px solid #000;
  }
}
.tabbox::after {
  width: 30%;
  content: "";
  margin: 0 5px 10px 5px;
}
</style>